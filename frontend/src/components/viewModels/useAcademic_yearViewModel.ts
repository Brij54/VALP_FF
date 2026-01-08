// import { useState, useRef ,useEffect} from "react";
// import { useRaspStore } from "../../store/raspStore.ts";
// import { academic_yearService } from "../../services/Academic_yearService";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode"

// export const getUserIdFromJWT = (): any => {
//   try {
//     const token = Cookies.get("access_token"); // adjust cookie name if different
//     if (!token) return null;
    
//     const decoded: any = jwtDecode(token);
//     console.log("all the resource but selected decoded",decoded)
//     // assuming your token payload has "userId" or "sub" field
//     return decoded.userId || decoded.sub || null;
//   } catch {
//     return null;
//   }
// };

// export const useAcademic_yearViewModel = (userId: string, appId: string) => {
//   const [fields, setFields] = useState<any[]>([]);
//   const [foreignKeyData, setForeignKeyData] = useState<any>({});
//   const [enums, setEnums] = useState<any>({});
//   const [dataToSave, setDataToSave] = useState<any>({});
// const [fetchedForeign, setFetchedForeign] = useState<Set<string>>(new Set());
// const [fetchedEnum, setFetchedEnum] = useState<Set<string>>(new Set());
//   const addSubmission = useRaspStore((s:any) => s.addSubmission);
//   const getSubmissions = useRaspStore((s:any) => s.getSubmissions);
//     const getUserAllData = useRaspStore((s:any) => s.getUserAllData);
//     useEffect(()=>{
//       const dataFromStore = getSubmissions(userId, "Academic_year");
//      const allData = getUserAllData(userId);
//       console.log("all data from store for student resource",dataFromStore,allData);
//     },[])
// const loadMetadata = async () => {
//   const metadata = await academic_yearService.getMetadata();
//   const metaFields = metadata[0].fieldValues||[];

//   setFields(metaFields);
//   // FOREIGNS
//   for (let field of metaFields) {
//     if (field.foreign) {
//       const foreignName = field.foreign;

//       if (!fetchedForeign.has(foreignName)) {
//         const updated = new Set(fetchedForeign);
//         updated.add(foreignName);
//         setFetchedForeign(updated);

//         const data = await academic_yearService.getForeignResource(foreignName);

//         setForeignKeyData((prev:any) => ({
//           ...prev,
//           [foreignName]: data,
//         }));
//       }
//     }
//   }

//   // ENUMS
//   for (let field of metaFields) {
//     if (field.isEnum) {
//       const enumName = field.possible_value;

//       if (!fetchedEnum.has(enumName)) {
//         const updatedEnum = new Set(fetchedEnum);
//         updatedEnum.add(enumName);
//         setFetchedEnum(updatedEnum);

//         const values = await academic_yearService.getEnum(enumName);

//         setEnums((prev:any) => ({
//           ...prev,
//           [enumName]: values,
//         }));
//       }
//     }
//   }
// };

//   const save = async (accessToken: string) => {
//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }
//     const params = new FormData();

//     let selectedFile = null;
//     selectedFile = Object.keys(dataToSave).filter((key) => dataToSave[key] instanceof File);
//     if(selectedFile!== undefined && selectedFile.length>0){
//       params.append("file", dataToSave[selectedFile[0]]);
//       dataToSave[selectedFile[0]] = "";

//       params.append("description", "my description");
//       params.append("appId","hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags","t1,t2,attend");
//     }
//     const jsonString = JSON.stringify(dataToSave);
//     const base64Encoded = btoa(jsonString);
//     params.append('resource', base64Encoded);

//     const response = await academic_yearService.create({
//       accessToken,
//       params,
//     });

//     if (response.errCode !== -1) {
//       addSubmission(userId, "Student", dataToSave);
//       console.log("data initialized in store in create form model", getUserAllData(getUserIdFromJWT()))
//     }
//   };

//   return {
//     fields,
//     setFields,
//     enums,
//     foreignKeyData,
//     setForeignKeyData,
//     setEnums,
//     dataToSave,
//     setDataToSave,
//     loadMetadata,
//     save,
//   };
// };


import { useState, useEffect } from "react";
import { useRaspStore } from "../../store/raspStore"; // ❗ removed .ts
import { academic_yearService } from "../../services/Academic_yearService";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// ================= JWT HELPER =================
export const getUserIdFromJWT = (): any => {
  try {
    const token = Cookies.get("access_token");
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    console.log("decoded token", decoded);
    return decoded.userId || decoded.sub || null;
  } catch {
    return null;
  }
};

// ================= VIEW MODEL =================
export const useAcademic_yearViewModel = (userId: string, appId: string) => {
  const [fields, setFields] = useState<any[]>([]);
  const [foreignKeyData, setForeignKeyData] = useState<any>({});
  const [enums, setEnums] = useState<any>({});
  const [dataToSave, setDataToSave] = useState<any>({});
  const [fetchedForeign, setFetchedForeign] = useState<Set<string>>(new Set());
  const [fetchedEnum, setFetchedEnum] = useState<Set<string>>(new Set());

  const addSubmission = useRaspStore((s: any) => s.addSubmission);
  const getSubmissions = useRaspStore((s: any) => s.getSubmissions);
  const getUserAllData = useRaspStore((s: any) => s.getUserAllData);

  // ================= DEBUG EFFECT =================
  useEffect(() => {
    if (!userId) return;

    const dataFromStore = getSubmissions(userId, "Academic_year");
    const allData = getUserAllData(userId);

    console.log(
      "Academic_year store data:",
      dataFromStore,
      allData
    );
  }, [userId]);

  // ================= 🔥 CRASH-PROOF METADATA LOADER =================
  const loadMetadata = async () => {
    try {
      const metadata = await academic_yearService.getMetadata();

      // ✅ HARD GUARDS (THIS FIXES YOUR ERROR)
      if (!metadata || !Array.isArray(metadata) || !metadata[0]) {
        console.warn("Metadata missing or invalid", metadata);
        return;
      }

      if (!Array.isArray(metadata[0].fieldValues)) {
        console.warn("fieldValues missing in metadata", metadata[0]);
        return;
      }

      const metaFields = metadata[0].fieldValues;
      setFields(metaFields);

      // ================= FOREIGN KEYS =================
      for (const field of metaFields) {
        if (!field?.foreign) continue;

        const foreignName = field.foreign;
        if (fetchedForeign.has(foreignName)) continue;

        setFetchedForeign((prev) => new Set(prev).add(foreignName));

        try {
          const data = await academic_yearService.getForeignResource(
            foreignName
          );
          setForeignKeyData((prev: any) => ({
            ...prev,
            [foreignName]: data,
          }));
        } catch (err) {
          console.error("Foreign fetch failed:", foreignName, err);
        }
      }

      // ================= ENUMS =================
      for (const field of metaFields) {
        if (!field?.isEnum) continue;

        const enumName = field.possible_value;
        if (!enumName || fetchedEnum.has(enumName)) continue;

        setFetchedEnum((prev) => new Set(prev).add(enumName));

        try {
          const values = await academic_yearService.getEnum(enumName);
          setEnums((prev: any) => ({
            ...prev,
            [enumName]: values,
          }));
        } catch (err) {
          console.error("Enum fetch failed:", enumName, err);
        }
      }
    } catch (err) {
      console.error("loadMetadata failed:", err);
    }
  };

  // ================= SAVE =================
  const save = async (accessToken: string) => {
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const params = new FormData();

    const fileKeys = Object.keys(dataToSave).filter(
      (key) => dataToSave[key] instanceof File
    );

    if (fileKeys.length > 0) {
      const fileKey = fileKeys[0];

      params.append("file", dataToSave[fileKey]);
      dataToSave[fileKey] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append("resource", base64Encoded);

    const response = await academic_yearService.create({
      accessToken,
      params,
    });

    if (response?.errCode !== -1) {
      addSubmission(userId, "Academic_year", dataToSave);
      console.log(
        "store after save",
        getUserAllData(getUserIdFromJWT())
      );
    }
  };

  // ================= EXPORT =================
  return {
    fields,
    setFields,
    enums,
    foreignKeyData,
    setForeignKeyData,
    setEnums,
    dataToSave,
    setDataToSave,
    loadMetadata,
    save,
  };
};
