// import React, { useState, useEffect, useRef } from "react";
// import apiConfig from "../../config/apiConfig";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum } from "../../apis/enum";
// import styles from "../Styles/CreateCertificate.module.css";

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

// const CreateProgram = () => {
//   const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});
//   const regex = /^(g_|archived|extra_data)/;
//   const apiUrl = apiConfig.getResourceUrl("Program");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // ✅ async function, not useQuery
//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({
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
//       setEnums((prev) => ({
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
//     queryKey: ["resMetaData", "ProgramCreate"],
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

//   const handleCreate = async () => {
//     const accessToken = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }
//     const params = new FormData();

//     let selectedFile = null;
//     selectedFile = Object.keys(dataToSave).filter(
//       (key) => dataToSave[key] instanceof File
//     );
//     if (selectedFile !== undefined && selectedFile.length > 0) {
//       params.append("file", dataToSave[selectedFile[0]]);
//       dataToSave[selectedFile[0]] = "";

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }
//     const jsonString = JSON.stringify(dataToSave);
//     const base64Encoded = btoa(jsonString);
//     params.append("resource", base64Encoded);

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Add token here
//       },
//       credentials: "include", // include cookies if needed
//       body: params,
//     });

//     if (response.ok) {
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       setDataToSave({});
//     }
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };

//   return (
//     <div className={styles.formCard}>
//       <div className={styles.certificateFormWrapper}>
//             <h4 className={styles.sectionTitle}>Program</h4>

//             <div className={styles.formGrid}>
//                 <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span>
//                         Name
//                     </label>
//           <input
//             type="text"
//             className="form-control"
//             name="name"
//             required={true}
//             value={dataToSave["name"] || ""}
//             onChange={(e) =>
//               setDataToSave({ ...dataToSave, ["name"]: e.target.value })
//             }
//           />
//           <div className="border-0 fw-bold" id="id-7L">
//             seats *
//           </div>
//           <input
//             type="text"
//             className="form-control"
//             name="seats"
//             required={true}
//             value={dataToSave["seats"] || ""}
//             onChange={(e) =>
//               setDataToSave({ ...dataToSave, ["seats"]: e.target.value })
//             }
//           />
//           <div className="border-0 fw-bold" id="id-7R">
//             instructor_name *
//           </div>
//           <input
//             type="text"
//             className="form-control"
//             name="instructor_name"
//             required={true}
//             value={dataToSave["instructor_name"] || ""}
//             onChange={(e) =>
//               setDataToSave({
//                 ...dataToSave,
//                 ["instructor_name"]: e.target.value,
//               })
//             }
//           />
//           <div className="border-0 fw-bold" id="id-7X">
//             syllabus
//           </div>
//           <div className="mb-3" id="id-7Z">
//             <label className="form-label">Upload file for syllabus </label>
//             <input
//               className="form-control"
//               type="file"
//               name="syllabus"
//               required={false}
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   ["syllabus"]: e.target.files?.[0] || null,
//                 })
//               }
//             />
//           </div>
//           <button className="btn btn-success" id="id-81" onClick={handleCreate}>
//             Submit
//           </button>
//         </div>
//         {showToast && (
//           <div
//             className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//             style={{ zIndex: 1550 }}
//           >
//             <div
//               className="toast show"
//               role="alert"
//               aria-live="assertive"
//               aria-atomic="true"
//             >
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   data-bs-dismiss="toast"
//                   aria-label="Close"
//                   onClick={() => setShowToast(false)}
//                 ></button>
//               </div>
//               <div className="toast-body text-success text-center">
//                 Created successfully!
//               </div>
//             </div>
//           </div>
//         )}
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
//     </div>
//   );
// };

// export default CreateProgram;



import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";
import styles from "../Styles/CreateProgram.module.css";

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

const CreateProgram = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("Program");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // Fetch metadata
  const { isLoading, error } = useQuery({
    queryKey: ["resMetaData", "ProgramCreate"],
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
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      alert("Access token not found");
      return;
    }

    const params = new FormData();

    let selectedFile = Object.keys(dataToSave).find(
      (key) => dataToSave[key] instanceof File
    );

    if (selectedFile) {
      params.append("file", dataToSave[selectedFile]);
      dataToSave[selectedFile] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const encoded = btoa(JSON.stringify(dataToSave));
    params.append("resource", encoded);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
      body: params,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.programFormWrapper}>
        <h4 className={styles.sectionTitle}>Add Program</h4>

        <div className={styles.formGrid}>
          {/* Program Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formControl}
              name="name"
              required
              value={dataToSave["name"] || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, ["name"]: e.target.value })
              }
            />
          </div>

          {/* Seats */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Seats <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formControl}
              name="seats"
              required
              value={dataToSave["seats"] || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, ["seats"]: e.target.value })
              }
            />
          </div>

          {/* Instructor Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Instructor Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formControl}
              name="instructor_name"
              required
              value={dataToSave["instructor_name"] || ""}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  ["instructor_name"]: e.target.value,
                })
              }
            />
          </div>

          {/* Syllabus Upload */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Upload Syllabus</label>
            <input
              className={styles.formControl}
              type="file"
              name="syllabus"
              required={false}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  ["syllabus"]: e.target.files?.[0] || null,
                })
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonRow}>
          <button className={styles.primaryBtn} onClick={handleCreate}>
            Submit
          </button>
        </div>
      </div>

      {/* Toast */}
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
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center fw-semibold">
              Program Created Successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProgram;
