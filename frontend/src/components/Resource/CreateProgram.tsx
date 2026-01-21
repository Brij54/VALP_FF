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
//     queryKey: ["resMetaData"],
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
//   <div className={styles.batchformCard}>
//     <div className={styles.certificateFormWrapper}>
//       <h2 className={styles.sectionTitle}>Add Courses</h2>

//       <div className={styles.formGrid}>
//         {/* Program Name */}
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>
//             Course Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             className={styles.formControl}
//             name="name"
//             required
//             value={dataToSave["name"] || ""}
//             onChange={(e) =>
//               setDataToSave({ ...dataToSave, name: e.target.value })
//             }
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>
//             Term Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             className={styles.formControl}
//             name="term_name"
//             required
//             value={dataToSave["term_name"] || ""}
//             onChange={(e) =>
//               setDataToSave({
//                 ...dataToSave,
//                 term_name: e.target.value,
//               })
//             }
//           />
//         </div>

//         {/* Seats */}
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>
//             Seats <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="number"
//             className={styles.formControl}
//             name="seats"
//             required
//             value={dataToSave["seats"] || ""}
//             onChange={(e) =>
//               setDataToSave({ ...dataToSave, seats: e.target.value })
//             }
//           />
//         </div>

//         {/* Instructor */}
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>
//             Instructor Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             className={styles.formControl}
//             name="instructor_name"
//             required
//             value={dataToSave["instructor_name"] || ""}
//             onChange={(e) =>
//               setDataToSave({
//                 ...dataToSave,
//                 instructor_name: e.target.value,
//               })
//             }
//           />
//         </div>

//         {/* Syllabus Upload */}
//         <div className={styles.formGroup}>
//           <label className={styles.formLabel}>Syllabus</label>
//           <input
//             type="file"
//             className={styles.formControl}
//             name="syllabus"
//             onChange={(e) =>
//               setDataToSave({
//                 ...dataToSave,
//                 syllabus: e.target.files?.[0] || null,
//               })
//             }
//           />
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className={styles.buttonRow}>
//         <button className={styles.primaryBtn} onClick={handleCreate}>
//           Submit
//         </button>
//       </div>

//       {/* Toast */}
//       {showToast && (
//         <div
//           className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//           style={{ zIndex: 1550 }}
//         >
//           <div className="toast show" role="alert" aria-live="assertive">
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button
//                 type="button"
//                 className="btn-close"
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
//   </div>
// );

// };

// export default CreateProgram;

// import React, { useState, useEffect, useRef } from "react";
// import apiConfig from "../../config/apiConfig";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum } from "../../apis/enum";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useParams } from "react-router-dom";

// import { useProgramViewModel } from "../viewModels/useProgramViewModel";
// import { getUserIdFromJWT } from "../../services/ProgramService";
// import { useRaspStore } from "../../store/raspStore";

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
//   const [showToast, setShowToast] = useState<any>(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const regex = /^(g_|archived|extra_data)/;
//   const apiUrl = apiConfig.getResourceUrl("Program");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

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
//   } = useProgramViewModel(getUserIdFromJWT(), appId);

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
//     queryKey: ["resMetaData", "programCreate"],
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
//     queryKey: ["resourceData", "programCreate"],
//     queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);

//       const accessToken = getCookie("access_token");

//       if (!accessToken) {
//         throw new Error("Access token not found");
//       }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("program")}?` + params.toString(),
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
//       let dataToStore = { resource: "program", records: dataRes };
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
//           id="id-VP"
//           className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
//         >
//           <div className="fw-bold fs-3" id="id-VR">
//             Program
//           </div>
//           <div id="id-VT" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-VV">
//               name *
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="name"
//               required={true}
//               value={dataToSave["name"] || ""}
//               id="id-CH"
//               placeholder="name"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["name"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-VZ" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-W1">
//               seats *
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="seats"
//               required={true}
//               value={dataToSave["seats"] || ""}
//               id="id-CN"
//               placeholder="seats"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["seats"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-W5" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-W7">
//               instructor_name *
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="instructor_name"
//               required={true}
//               value={dataToSave["instructor_name"] || ""}
//               id="id-CT"
//               placeholder="instructor_name"
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   ["instructor_name"]: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div id="id-WB" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-WD">
//               syllabus
//             </div>
//             <div className="mb-3" id="id-WF">
//               <label className="form-label">Upload file for syllabus </label>
//               <input
//                 className="form-control"
//                 type="file"
//                 name="syllabus"
//                 required={false}
//                 id=""
//                 onChange={(e) =>
//                   setDataToSave({
//                     ...dataToSave,
//                     ["syllabus"]: e.target.files?.[0] || null,
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <div id="id-WH" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-WJ">
//               term_name *
//             </div>
//             <input
//               type="text"
//               className="form-control"
//               name="term_name"
//               required={true}
//               value={dataToSave["term_name"] || ""}
//               id="id-D5"
//               placeholder="term_name"
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, ["term_name"]: e.target.value })
//               }
//             />
//           </div>
//           <div id="id-WN" className="border-0 w-100 bg-light">
//             <div className="fw-bold" id="id-WP">
//               academic_year_id *
//             </div>
//             {(() => {
//               const options = foreignKeyData["Academic_year"] || [];
//               const filteredOptions = options.filter((option: any) =>
//                 option["id"]
//                   ?.toLowerCase()
//                   .includes(
//                     (searchQueries["academic_year_id"] || "").toLowerCase()
//                   )
//               );
//               return (
//                 <>
//                   <button
//                     className="btn btn-secondary dropdown-toggle"
//                     type="button"
//                     id={`dropdownMenu-academic_year_id`}
//                     data-bs-toggle="dropdown"
//                     aria-haspopup="true"
//                     aria-expanded="false"
//                   >
//                     {" "}
//                     {dataToSave["academic_year_id"]
//                       ? options.find(
//                           (item: any) =>
//                             item["id"] === dataToSave["academic_year_id"]
//                         )?.["id"] || "Select"
//                       : `Select academic_year_id`}{" "}
//                   </button>
//                   <div
//                     className="dropdown-menu"
//                     aria-labelledby={`dropdownMenu-academic_year_id`}
//                   >
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       placeholder={`Search academic_year_id`}
//                       value={searchQueries["academic_year_id"] || ""}
//                       onChange={(e) =>
//                         handleSearchChange("academic_year_id", e.target.value)
//                       }
//                     />{" "}
//                     {filteredOptions.length > 0 ? (
//                       filteredOptions.map((option: any, i: any) => (
//                         <button
//                           key={i}
//                           className="dropdown-item"
//                           type="button"
//                           onClick={() =>
//                             setDataToSave({
//                               ...dataToSave,
//                               ["academic_year_id"]: option["id"],
//                             })
//                           }
//                         >
//                           {" "}
//                           {option["id"]}{" "}
//                         </button>
//                       ))
//                     ) : (
//                       <span className="dropdown-item text-muted">
//                         {" "}
//                         No options available{" "}
//                       </span>
//                     )}{" "}
//                   </div>
//                 </>
//               );
//             })()}{" "}
//           </div>
//           <button className="btn btn-success" id="id-WT" onClick={handleCreate}>
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

// export default CreateProgram;

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

// // Date utils (YYYY-MM-DD)
// const isValidDateRange = (start?: string, end?: string) => {
//   if (!start || !end) return true; // validate only when both exist
//   const s = new Date(start).getTime();
//   const e = new Date(end).getTime();
//   return s <= e; // allow same date; change to s < e for strict
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

//   // ✅ Date validation UI
//   const [dateError, setDateError] = useState<string>("");

//   const apiUrl = apiConfig.getResourceUrl("Program");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // -----------------------------
//   // Foreign Data Fetch
//   // -----------------------------
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

//   // -----------------------------
//   // Metadata
//   // -----------------------------
//   useQuery({
//     queryKey: ["resMetaData"],
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

//   // -----------------------------
//   // Create
//   // -----------------------------
//   const handleCreate = async () => {
//     // ✅ validate date range before API call
//     const start = dataToSave?.start_date;
//     const end = dataToSave?.end_date;

//     if (start && end && !isValidDateRange(start, end)) {
//       setDateError("Start date must be before (or same as) End date.");
//       return;
//     }

//     // optional required check
//     if (!start || !end) {
//       setDateError("Start date and End date are required.");
//       return;
//     }

//     setDateError("");

//     const accessToken = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     const params = new FormData();

//     let selectedFile = Object.keys(dataToSave).filter(
//       (key) => dataToSave[key] instanceof File
//     );

//     // NOTE: avoid mutating state object directly
//     const payload = { ...dataToSave };

//     if (selectedFile.length > 0) {
//       params.append("file", payload[selectedFile[0]]);
//       payload[selectedFile[0]] = "";

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     params.append("resource", btoa(JSON.stringify(payload)));

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       credentials: "include",
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

//   // helpers to validate & show error live
//   const validateDatesLive = (nextStart?: string, nextEnd?: string) => {
//     if (nextStart && nextEnd && !isValidDateRange(nextStart, nextEnd)) {
//       setDateError("Start date must be before (or same as) End date.");
//     } else {
//       setDateError("");
//     }
//   };

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <div className={styles.batchformCard}>
//       <div className={styles.certificateFormWrapper}>
//         <h2 className={styles.sectionTitle}>Add Courses</h2>

//         <div className={styles.formGrid}>
//           {/* Course Name */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               Course Name <span className={styles.required}>*</span>
//             </label>
//             <input
//               className={styles.formControl}
//               value={dataToSave["name"] || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, name: e.target.value })
//               }
//             />
//           </div>

//           {/* Term Name */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               Term Name <span className={styles.required}>*</span>
//             </label>
//             <input
//               className={styles.formControl}
//               value={dataToSave["term_name"] || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, term_name: e.target.value })
//               }
//             />
//           </div>

//           {/* Academic Year (FOREIGN KEY UI ONLY) */}
//           <div className={styles.formGroup} style={{ position: "relative" }}>
//             <label className={styles.formLabel}>
//               Academic Year <span className={styles.required}>*</span>
//             </label>

//             {(() => {
//               const options = foreignKeyData["Academic_year"] || [];

//               const filteredOptions = options.filter((option: any) =>
//                 (option.academic_name || option.id)
//                   ?.toLowerCase()
//                   .includes(
//                     (searchQueries["academic_year_id"] || "").toLowerCase()
//                   )
//               );

//               const selected = options.find(
//                 (item: any) => item.id === dataToSave["academic_year_id"]
//               );

//               return (
//                 <>
//                   <div
//                     className={styles.formControl}
//                     style={{ cursor: "pointer", background: "#fff" }}
//                     onClick={() =>
//                       setSearchQueries((prev) => ({
//                         ...prev,
//                         __openAcademicYear: prev.__openAcademicYear
//                           ? ""
//                           : "open",
//                       }))
//                     }
//                   >
//                     {selected
//                       ? selected.academic_name || selected.id
//                       : "Select Academic Year"}
//                   </div>

//                   {searchQueries.__openAcademicYear && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         zIndex: 1000,
//                         width: "100%",
//                         background: "#fff",
//                         border: "1px solid #ccc",
//                         borderRadius: 6,
//                         marginTop: 4,
//                         maxHeight: 220,
//                         overflowY: "auto",
//                         padding: 8,
//                       }}
//                     >
//                       <input
//                         className="form-control mb-2"
//                         placeholder="Search academic year"
//                         value={searchQueries["academic_year_id"] || ""}
//                         onChange={(e) =>
//                           handleSearchChange(
//                             "academic_year_id",
//                             e.target.value
//                           )
//                         }
//                       />
//                       {filteredOptions.length > 0 ? (
//                         filteredOptions.map((option: any) => (
//                           <div
//                             key={option.id}
//                             style={{ padding: 8, cursor: "pointer" }}
//                             onClick={() => {
//                               setDataToSave({
//                                 ...dataToSave,
//                                 academic_year_id: option.id,
//                               });
//                               setSearchQueries((prev) => ({
//                                 ...prev,
//                                 __openAcademicYear: "",
//                               }));
//                             }}
//                           >
//                             {option.academic_name || option.id}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-muted">No options available</div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               );
//             })()}
//           </div>

//           {/* Start Date */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span> Start Date
//             </label>
//             <input
//               type="date"
//               className={styles.formControl}
//               value={dataToSave.start_date || ""}
//               onChange={(e) => {
//                 const start = e.target.value;
//                 const end = dataToSave.end_date;
//                 const next = { ...dataToSave, start_date: start };
//                 setDataToSave(next);
//                 validateDatesLive(start, end);
//               }}
//             />
//           </div>

//           {/* End Date */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span> End Date
//             </label>
//             <input
//               type="date"
//               className={styles.formControl}
//               value={dataToSave.end_date || ""}
//               onChange={(e) => {
//                 const end = e.target.value;
//                 const start = dataToSave.start_date;
//                 const next = { ...dataToSave, end_date: end };
//                 setDataToSave(next);
//                 validateDatesLive(start, end);
//               }}
//             />
//           </div>

//           {/* ✅ Date Error Message */}
//           {dateError && (
//             <div
//               style={{
//                 gridColumn: "1 / -1",
//                 color: "#dc3545",
//                 fontSize: 13,
//                 marginTop: -6,
//               }}
//             >
//               {dateError}
//             </div>
//           )}

//           {/* Seats */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               Seats <span className={styles.required}>*</span>
//             </label>
//             <input
//               type="number"
//               className={styles.formControl}
//               value={dataToSave["seats"] || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, seats: e.target.value })
//               }
//             />
//           </div>

//           {/* Instructor */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               Instructor Name <span className={styles.required}>*</span>
//             </label>
//             <input
//               className={styles.formControl}
//               value={dataToSave["instructor_name"] || ""}
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   instructor_name: e.target.value,
//                 })
//               }
//             />
//           </div>

//           {/* Syllabus */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>Syllabus</label>
//             <input
//               type="file"
//               className={styles.formControl}
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   syllabus: e.target.files?.[0] || null,
//                 })
//               }
//             />
//           </div>
//         </div>

//         <div className={styles.buttonRow}>
//           <button
//             className={styles.primaryBtn}
//             onClick={handleCreate}
//             disabled={!!dateError}
//             title={dateError ? dateError : "Submit"}
//           >
//             Submit
//           </button>
//         </div>

//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//                 <button
//                   className="btn-close"
//                   onClick={() => setShowToast(false)}
//                 />
//               </div>
//               <div className="toast-body text-success text-center">
//                 Created successfully!
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateProgram;

import React, { useEffect, useRef, useState } from "react";
import apiConfig from "../../config/apiConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import styles from "../Styles/CreateCertificate.module.css";

/* ================= TYPES ================= */

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

/* ================= UTILS ================= */

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const isBeforeOrEqual = (a?: string, b?: string) => {
  if (!a || !b) return true;
  return new Date(a).getTime() <= new Date(b).getTime();
};

const getCourseStatus = (
  start?: string,
  end?: string,
): "UPCOMING" | "ONGOING" | "COMPLETED" | "" => {
  if (!start || !end) return "";

  const today = new Date().setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);

  if (today < s) return "UPCOMING";
  if (today > e) return "COMPLETED";
  return "ONGOING";
};

/* ================= COMPONENT ================= */

const CreateProgram = () => {
  const [dataToSave, setDataToSave] = useState<any>({});
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {},
  );
  const [dateError, setDateError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const apiUrl = apiConfig.getResourceUrl("Program");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

  const fetchedResources = useRef(new Set<string>());
  const queryClient = useQueryClient();

  /* ================= METADATA ================= */

  useQuery({
    queryKey: ["programMeta"],
    queryFn: async () => {
      const res = await fetch(metadataUrl);
      const data = await res.json();

      const foreignFields = data[0].fieldValues.filter((f: any) => f.foreign);

      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);
          const d = await fetchForeignResource(field.foreign);
          setForeignKeyData((p) => ({ ...p, [field.foreign]: d }));
        }
      }
      return data;
    },
  });

  /* ================= VALIDATION ================= */

  const validateDates = () => {
    const {
      registration_start_date,
      registration_end_date,
      course_start_date,
      course_end_date,
    } = dataToSave;

    if (!isBeforeOrEqual(registration_start_date, registration_end_date)) {
      return "Registration start date must be before registration end date.";
    }

    if (!isBeforeOrEqual(course_start_date, course_end_date)) {
      return "Course start date must be before course end date.";
    }

    if (
      registration_end_date &&
      course_start_date &&
      new Date(registration_end_date) > new Date(course_start_date)
    ) {
      return "Registration must end before the course starts.";
    }

    return "";
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    const error = validateDates();
    if (error) {
      setDateError(error);
      return;
    }

    setDateError("");

    const token = getCookie("access_token");
    if (!token) throw new Error("Access token not found");

    const params = new FormData();
    const payload = { ...dataToSave };

    if (payload.syllabus instanceof File) {
      params.append("file", payload.syllabus);
      payload.syllabus = "";
    }

    params.append("resource", btoa(JSON.stringify(payload)));

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      body: params,
    });

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  /* ================= UI ================= */

  const status = getCourseStatus(
    dataToSave.course_start_date,
    dataToSave.course_end_date,
  );

  return (
    <div className={styles.batchformCard}>
      <div className={styles.certificateFormWrapper}>
        <h2 className={styles.sectionTitle}>Add Courses</h2>

        <div className={styles.formGrid}>
          {/* Course Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Course Name <span className={styles.required}>*</span>
            </label>
          <input
            className={styles.formControl}
            placeholder="Course Name"
            value={dataToSave.name || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, name: e.target.value })
            }
          />
          </div>

          {/* Term Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Term Name <span className={styles.required}>*</span>
            </label>
          <input
            className={styles.formControl}
            placeholder="Term Name"
            value={dataToSave.term_name || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, term_name: e.target.value })
            }
          />
          </div>
          
          {/* Academic Year */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Academic Year <span className={styles.required}>*</span>
            </label>
          <select
            className={styles.formControl}
            value={dataToSave.academic_year_id || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                academic_year_id: e.target.value,
              })
            }
          >
            <option value="">Select Academic Year</option>
            {(foreignKeyData["Academic_year"] || []).map((ay: any) => (
              <option key={ay.id} value={ay.id}>
                {ay.academic_name || ay.id}
              </option>
            ))}
          </select>
          </div>

          {/* REGISTRATION WINDOW */}
          <div style={{ gridColumn: "1 / -1", fontWeight: 600 }}>
            📌 Registration Window
          </div>
          
          {/* Registration Start Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Registration start Date <span className={styles.required}>*</span>
            </label>
          <input
            type="date"
            className={styles.formControl}
            value={dataToSave.registration_start_date || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                registration_start_date: e.target.value,
              })
            }
          />
          </div>

          {/* Registration End Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Registration End Date <span className={styles.required}>*</span>
            </label>
          <input
            type="date"
            className={styles.formControl}
            value={dataToSave.registration_end_date || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                registration_end_date: e.target.value,
              })
            }
          />
          </div>

          {/* COURSE DURATION */}
          <div style={{ gridColumn: "1 / -1", fontWeight: 600 }}>
            📘 Course Duration
          </div>
          {/* COURSE Start Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Course Start Date <span className={styles.required}>*</span>
            </label>
          <input
            type="date"
            className={styles.formControl}
            value={dataToSave.course_start_date || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_start_date: e.target.value,
              })
            }
          />
          </div>

          {/* COURSE End Date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Course End Date <span className={styles.required}>*</span>
            </label>
          <input
            type="date"
            className={styles.formControl}
            value={dataToSave.course_end_date || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_end_date: e.target.value,
              })
            }
          />
          </div>

          {/* STATUS */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Status <span className={styles.required}>*</span>
            </label>
          <input
            className={styles.formControl}
            disabled
            value={status}
            style={{
              fontWeight: 600,
              color:
                status === "ONGOING"
                  ? "green"
                  : status === "COMPLETED"
                    ? "red"
                    : "#0d6efd",
            }}
          />
          </div>

          {/* OTHER FIELDS */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Seats <span className={styles.required}>*</span>
            </label>
          <input
            type="number"
            className={styles.formControl}
            placeholder="Seats"
            value={dataToSave.seats || ""}
            onChange={(e) =>
              setDataToSave({ ...dataToSave, seats: e.target.value })
            }
          />
          </div>

          {/* Instructor */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Instructor Name <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.formControl}
              placeholder="Instructor Name"
              value={dataToSave.instructor_name || ""}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  instructor_name: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Syllabus</label>
            <input
              type="file"
              className={styles.formControl}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  syllabus: e.target.files?.[0] || null,
                })
              }
            />
          </div>
        </div>

        {dateError && (
          <div style={{ color: "#dc3545", marginTop: 10 }}>{dateError}</div>
        )}

        <div className={styles.buttonRow}>
          <button className={styles.primaryBtn} onClick={handleCreate}>
            Submit
          </button>
        </div>

        {showToast && (
          <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
            <div className="toast show">
              <div className="toast-body text-success text-center">
                Created Successfully!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProgram;
