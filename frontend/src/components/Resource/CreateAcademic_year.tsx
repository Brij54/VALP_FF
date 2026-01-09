// import React, { useState, useEffect, useRef } from "react";
// import apiConfig from "../../config/apiConfig";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum } from "../../apis/enum";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useParams } from "react-router-dom";

// import { useAcademic_yearViewModel } from "../viewModels/useAcademic_yearViewModel";
// import { useRaspStore } from "../../store/raspStore";
// import { academic_yearService } from "../../services/Academic_yearService";

// export type resourceMetaData = {
//   resource: string;
//   fieldValues: any[];
// };
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const CreateAcademic_year = () => {
//   const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
//   const [showToast, setShowToast] = useState<any>(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const regex = /^(g_|archived|extra_data)/;
//   const apiUrl = apiConfig.getResourceUrl("Academic_year");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Academic_year");

//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const getUserIdFromJWT = (): any => {
//     try {
//       const token = Cookies.get("access_token"); // adjust cookie name if different
//       if (!token) return null;

//       const decoded: any = jwtDecode(token);
//       console.log("all the resource but selected decoded", decoded);
//       // assuming your token payload has "userId" or "sub" field
//       return decoded.userId || decoded.sub || null;
//     } catch {
//       return null;
//     }
//   };

//   const { appId }: any = useParams<any>();

//   const {
//     fields,
//     setFields,
//     enums,
//     setEnums,
//     foreignKeyData,
//     setForeignKeyData,
//     dataToSave,
//     setDataToSave,
//     loadMetadata,
//     save,
//   } = useAcademic_yearViewModel(getUserIdFromJWT(), appId);

//   useEffect(() => {
//     loadMetadata();
//   }, []);

//   // ✅ async function, not useQuery
//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev: any) => ({
//         ...prev,
//         [foreignResource]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   // ✅ async function, not useQuery
//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev: any) => ({
//         ...prev,
//         [enumName]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   // ✅ useQuery only here
//   const {
//     data: metaData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["resMetaData", "academic_yearCreate"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch metadata: ${res.statusText}`);
//       }

//       const data = await res.json();

//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       const foreignFields = data[0].fieldValues.filter(
//         (field: any) => field.foreign
//       );
//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           await fetchForeignData(
//             field.foreign,
//             field.name,
//             field.foreign_field
//           );
//         }
//       }

//       const enumFields = data[0].fieldValues.filter(
//         (field: any) => field.isEnum === true
//       );
//       for (const field of enumFields) {
//         if (!fetchedEnum.current.has(field.possible_value)) {
//           fetchedEnum.current.add(field.possible_value);

//           queryClient.prefetchQuery({
//             queryKey: ["enum", field.possible_value],
//             queryFn: () => fetchEnum(field.possible_value),
//           });

//           await fetchEnumData(field.possible_value);
//         }
//       }

//       return data;
//     },
//   });

//   useEffect(() => {
//     console.log("data to save", dataToSave);
//   }, [dataToSave]);

//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "academic_yearCreate"],
//     queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);

//       const accessToken = getCookie("access_token");

//       if (!accessToken) {
//         throw new Error("Access token not found");
//       }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("academic_year")}?` + params.toString(),
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`, // Add token here
//           },
//           credentials: "include", // include cookies if needed
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       return data.resource;
//     },
//   });
//   useEffect(() => {
//     if (dataRes) {
//       let dataToStore = { resource: "academic_year", records: dataRes };
//       useRaspStore.getState().initializeStore(getUserIdFromJWT(), dataToStore);
//     }
//   }, [dataRes]);
//   const handleCreate = async () => {
//     const accessToken: any = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     await save(accessToken);
//     setShowToast(true);
//     setDataToSave({});
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };

//   return (
//     <div>
//       <div>
//         <div
//           id="id-LH"
//           className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
//         >
//           <div className="fw-bold fs-3" id="id-LJ">
//             Academic_year
//           </div>
//           <div id="id-LL" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-LN">
//               term_name *
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="term_name"
//               required={true}
//               value={dataToSave["term_name"] || ""}
//               id="id-A7"
//               placeholder="term_name"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["term_name"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-LR" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-LT">
//               start_date *
//             </div>
//             <input
//               type="date"
//               className="form-control"
//               name="start_date"
//               required={true}
//               value={dataToSave["start_date"] || ""}
//               id="id-LV"
//               placeholder="start_date"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["start_date"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-LX" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-LZ">
//               end_date *
//             </div>
//             <input
//               type="date"
//               className="form-control"
//               name="end_date"
//               required={true}
//               value={dataToSave["end_date"] || ""}
//               id="id-M1"
//               placeholder="end_date"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["end_date"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-M3" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-M5">
//               details
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="details"
//               required={false}
//               value={dataToSave["details"] || ""}
//               id="id-AP"
//               placeholder="details"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["details"]: e.target.value })
//               }
//             />
//           </div>
//           <button className="btn btn-success" id="id-M9" onClick={handleCreate}>
//             Submit
//           </button>
//         </div>
//       </div>
//       {showToast && (
//         <div
//           className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//           style={{ zIndex: 1550 }}
//         >
//           <div
//             className="toast show"
//             role="alert"
//             aria-live="assertive"
//             aria-atomic="true"
//           >
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="toast"
//                 aria-label="Close"
//                 onClick={() => setShowToast(false)}
//               ></button>
//             </div>
//             <div className="toast-body text-success text-center">
//               Created successfully!
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateAcademic_year;


import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

import { useAcademic_yearViewModel } from "../viewModels/useAcademic_yearViewModel";
import { useRaspStore } from "../../store/raspStore";
import styles from "../Styles/CreateCertificate.module.css";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const CreateAcademic_year = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);

  const metadataUrl = apiConfig.getResourceMetaDataUrl("Academic_year");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const getUserIdFromJWT = (): any => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return null;
      const decoded: any = jwtDecode(token);
      return decoded.userId || decoded.sub || null;
    } catch {
      return null;
    }
  };

  const { appId }: any = useParams<any>();

  const {
    fields,
    setFields,
    enums,
    setEnums,
    foreignKeyData,
    setForeignKeyData,
    dataToSave,
    setDataToSave,
    loadMetadata,
    save,
  } = useAcademic_yearViewModel(getUserIdFromJWT(), appId);

  useEffect(() => {
    loadMetadata();
  }, []);

  useQuery({
    queryKey: ["resMetaData", "academic_yearCreate"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setResMetaData(data);
      setFields(data[0].fieldValues);
      return data;
    },
  });

  const handleCreate = async () => {
    const accessToken: any = getCookie("access_token");
    if (!accessToken) throw new Error("Access token not found");

    await save(accessToken);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setDataToSave({});
  };

  // =========================
  // ✅ UI (CreateCertificate style)
  // =========================

  return (
    <div className={styles.batchformCard}>
      <div className={styles.certificateFormWrapper}>
        <h4 className={styles.sectionTitle}>Create Academic Year</h4>

        <div className={styles.formGrid}>
          {/* Term Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span> Academic Name
            </label>
            <input
              type="text"
              className={styles.formControl}
              value={dataToSave.academic_name || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, academic_name: e.target.value })
              }
              placeholder="Academic Name"
            />
          </div>

          {/* Start Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span> Start Date
            </label>
            <input
              type="date"
              className={styles.formControl}
              value={dataToSave.start_date || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, start_date: e.target.value })
              }
            />
          </div>

          {/* End Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span> End Date
            </label>
            <input
              type="date"
              className={styles.formControl}
              value={dataToSave.end_date || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, end_date: e.target.value })
              }
            />
          </div>

          {/* Details */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Details</label>
            <input
              type="text"
              className={styles.formControl}
              value={dataToSave.details || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, details: e.target.value })
              }
              placeholder="Optional details"
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.primaryBtn} onClick={handleCreate}>
            Submit
          </button>
        </div>
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
          style={{ zIndex: 2000 }}
        >
          <div className="toast show shadow">
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success fw-semibold text-center">
              Created Successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAcademic_year;
