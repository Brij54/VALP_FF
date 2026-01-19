// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";

// const Edit = () => {
//   const { id }: any = useParams();
//   const navigate = useNavigate();

//   const baseUrl = apiConfig.getResourceUrl("Certificate");
//   const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Network response was not ok");
//     return response.json();
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Certificate"
//   );

//   useEffect(() => {
//     if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById.resource[0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   useQuery({
//     queryKey: ["resMetaData"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.statusText}`);

//       const data = await res.json();

//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);

//       const foreignFields = (data[0]?.fieldValues || []).filter(
//         (field: any) => field.foreign
//       );

//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           await fetchForeignData(field.foreign, field.name, field.foreign_field);
//         }
//       }

//       const enumFields = (data[0]?.fieldValues || []).filter(
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

//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev) => ({ ...prev, [enumName]: data }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({ ...prev, [foreignResource]: data }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const handleStatusChange = (value: string) => {
//     setEditedRecord((prev: any) => ({
//       ...prev,
//       status: value,
//     }));
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };

//   const base64EncodeFun = (str: string) => btoa(unescape(encodeURIComponent(str)));

//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();

//     if (!editedRecord || Object.keys(editedRecord).length === 0) return;

//     const params = new FormData();

//     const selectedFileKeys = Object.keys(editedRecord).filter(
//       (key) => editedRecord[key] instanceof File
//     );

//     if (selectedFileKeys.length > 0) {
//       const fileKey = selectedFileKeys[0];
//       params.append("file", editedRecord[fileKey]);
//       editedRecord[fileKey] = "";

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     const jsonString = JSON.stringify(editedRecord);
//     const base64Encoded = base64EncodeFun(jsonString);

//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");
//     if (!accessToken) throw new Error("Access token not found");

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         credentials: "include",
//         body: params,
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 1000);

//         // ✅ Redirect on success
//         navigate("/approve_reject_certificate");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     if (status === "true")
//       return (
//         <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
//           ✅ <span>Approved</span>
//         </span>
//       );
//     if (status === "false")
//       return (
//         <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
//           ❌ <span>Rejected</span>
//         </span>
//       );
//     return (
//       <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
//         ⏳ <span>Pending</span>
//       </span>
//     );
//   };

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={false}
//         toggleSidebar={() => {}}
//         activeSection="dashboard"
//       />

//       <main className="mainContent">
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Certificate</h1>
//         </header>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             {!loadingEditComp && (
//               <form onSubmit={(e) => handleUpdate(id, e)}>
//                 <div className={styles.certificateFormWrapper}>
//                   <h2 className={styles.sectionTitle}>Edit Certificate</h2>

//                   <div className={styles.formGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Name
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_name"
//                         required
//                         value={editedRecord["course_name"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_name", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Duration
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_duration"
//                         required
//                         value={editedRecord["course_duration"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_duration", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Mode
//                       </label>
//                       <input
//                         className={styles.formControl}
//                         name="course_mode"
//                         value={editedRecord.course_mode || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_mode", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Platform
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="platform"
//                         required
//                         value={editedRecord["platform"] || ""}
//                         onChange={(e) => handleEdit(id, "platform", e.target.value)}
//                       />
//                     </div>

//                     {/* <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Completion Date
//                       </label>
//                       <input
//                         type="date"
//                         className={styles.formControl}
//                         name="course_completion_date"
//                         required
//                         value={editedRecord["course_completion_date"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_completion_date", e.target.value)
//                         }
//                       />
//                     </div> */}

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Status
//                       </label>

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "12px",
//                           padding: "10px",
//                           border: "1px solid #d0d0d0",
//                           borderRadius: "8px",
//                           background: "#fafafa",
//                         }}
//                       >
//                         <select
//                           className={styles.formControl}
//                           style={{ flex: "0 0 180px" }}
//                           name="status"
//                           value={
//                             editedRecord.status === "true"
//                               ? "true"
//                               : editedRecord.status === "false"
//                               ? "false"
//                               : "Pending"
//                           }
//                           onChange={(e) => handleStatusChange(e.target.value)}
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="true">Approved</option>
//                           <option value="false">Rejected</option>
//                         </select>

//                         <div style={{ flex: 1 }}>
//                           {getStatusBadge(editedRecord.status)}
//                         </div>
//                       </div>
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>Course URL</label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_url"
//                         value={editedRecord["course_url"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_url", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className={styles.buttonRow}>
//                     <button className={styles.primaryBtn} type="submit">
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-header">
//                     <strong className="me-auto">Success</strong>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setShowToast(false)}
//                     ></button>
//                   </div>
//                   <div className="toast-body text-success text-center">
//                     Updated successfully!
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Edit;
// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";

// /** ✅ authFetch added inside this file */
// async function authFetch(
//   input: RequestInfo,
//   init: RequestInit = {}
// ): Promise<Response> {
//   const finalInit: RequestInit = {
//     credentials: "include",
//     ...init,
//     headers: {
//       ...(init.headers || {}),
//     },
//   };

//   // Add Authorization header from cookie (your current approach)
//   const token = getCookie("access_token");
//   if (token && !(finalInit.headers as any)?.Authorization) {
//     (finalInit.headers as any).Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(input, finalInit);

//   // ✅ Global 401 handling
//   if (res.status === 401) {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/";
//     throw new Error("Unauthorized");
//   }

//   return res;
// }

// const Edit = () => {
//   const { id }: any = useParams();
//   const navigate = useNavigate();

//   const baseUrl = apiConfig.getResourceUrl("Certificate");
//   const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;

//     const response = await authFetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) throw new Error("Network response was not ok");
//     return response.json();
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Certificate"
//   );

//   useEffect(() => {
//     if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById.resource[0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   useQuery({
//     queryKey: ["resMetaData"],
//     queryFn: async () => {
//       const res = await authFetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.statusText}`);

//       const data = await res.json();

//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);

//       const foreignFields = (data[0]?.fieldValues || []).filter(
//         (field: any) => field.foreign
//       );

//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           await fetchForeignData(field.foreign, field.name, field.foreign_field);
//         }
//       }

//       const enumFields = (data[0]?.fieldValues || []).filter(
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

//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev) => ({ ...prev, [enumName]: data }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({ ...prev, [foreignResource]: data }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const handleStatusChange = (value: string) => {
//     setEditedRecord((prev: any) => ({
//       ...prev,
//       status: value,
//     }));
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };

//   const base64EncodeFun = (str: string) =>
//     btoa(unescape(encodeURIComponent(str)));

//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();

//     if (!editedRecord || Object.keys(editedRecord).length === 0) return;

//     const params = new FormData();

//     const selectedFileKeys = Object.keys(editedRecord).filter(
//       (key) => editedRecord[key] instanceof File
//     );

//     if (selectedFileKeys.length > 0) {
//       const fileKey = selectedFileKeys[0];
//       params.append("file", editedRecord[fileKey]);
//       editedRecord[fileKey] = "";

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     const jsonString = JSON.stringify(editedRecord);
//     const base64Encoded = base64EncodeFun(jsonString);

//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");

//     try {
//       const response = await authFetch(apiUrl, {
//         method: "POST",
//         body: params,
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 1000);
//         navigate("/approve_reject_certificate");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     if (status === "true")
//       return (
//         <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
//           ✅ <span>Approved</span>
//         </span>
//       );
//     if (status === "false")
//       return (
//         <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
//           ❌ <span>Rejected</span>
//         </span>
//       );
//     return (
//       <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
//         ⏳ <span>Pending</span>
//       </span>
//     );
//   };

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={false}
//         toggleSidebar={() => {}}
//         activeSection="dashboard"
//       />

//       <main className="mainContent">
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Certificate</h1>
//         </header>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             {!loadingEditComp && (
//               <form onSubmit={(e) => handleUpdate(id, e)}>
//                 <div className={styles.certificateFormWrapper}>
//                   <h2 className={styles.sectionTitle}>Edit Certificate</h2>

//                   <div className={styles.formGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Name
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_name"
//                         required
//                         value={editedRecord["course_name"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_name", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Duration
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_duration"
//                         required
//                         value={editedRecord["course_duration"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_duration", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Course Mode
//                       </label>
//                       <input
//                         className={styles.formControl}
//                         name="course_mode"
//                         value={editedRecord.course_mode || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_mode", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Platform
//                       </label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="platform"
//                         required
//                         value={editedRecord["platform"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "platform", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>
//                         <span className={styles.required}>*</span> Status
//                       </label>

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "12px",
//                           padding: "10px",
//                           border: "1px solid #d0d0d0",
//                           borderRadius: "8px",
//                           background: "#fafafa",
//                         }}
//                       >
//                         <select
//                           className={styles.formControl}
//                           style={{ flex: "0 0 180px" }}
//                           name="status"
//                           value={
//                             editedRecord.status === "true"
//                               ? "true"
//                               : editedRecord.status === "false"
//                               ? "false"
//                               : "Pending"
//                           }
//                           onChange={(e) => handleStatusChange(e.target.value)}
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="true">Approved</option>
//                           <option value="false">Rejected</option>
//                         </select>

//                         <div style={{ flex: 1 }}>
//                           {getStatusBadge(editedRecord.status)}
//                         </div>
//                       </div>
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.formLabel}>Course URL</label>
//                       <input
//                         type="text"
//                         className={styles.formControl}
//                         name="course_url"
//                         value={editedRecord["course_url"] || ""}
//                         onChange={(e) =>
//                           handleEdit(id, "course_url", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className={styles.buttonRow}>
//                     <button className={styles.primaryBtn} type="submit">
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-header">
//                     <strong className="me-auto">Success</strong>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setShowToast(false)}
//                     ></button>
//                   </div>
//                   <div className="toast-body text-success text-center">
//                     Updated successfully!
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Edit;

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Sidebar from "../Utils/SidebarAdmin";
import styles from "../Styles/CreateCertificate.module.css";
import { LogOut } from "lucide-react";
import { logout } from "../../apis/backend";

/** ✅ authFetch added inside this file */
async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const finalInit: RequestInit = {
    credentials: "include",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  };

  const token = getCookie("access_token");
  if (token && !(finalInit.headers as any)?.Authorization) {
    (finalInit.headers as any).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(input, finalInit);

  if (res.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  return res;
}

const Edit = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const baseUrl = apiConfig.getResourceUrl("Certificate");
  const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  const [showDropdown, setShowDropdown] = useState(false);

  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;

    const response = await authFetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id && !!resourceName,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
    id,
    "Certificate"
  );

  useEffect(() => {
    if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(fetchedDataById.resource[0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
    }
  }, [fetchedDataById, loadingEditComp]);

  useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      const res = await authFetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok)
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);

      const data = await res.json();

      setResMetaData(data);
      setFields(data[0]?.fieldValues || []);

      const foreignFields = (data[0]?.fieldValues || []).filter(
        (field: any) => field.foreign
      );

      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(
            field.foreign,
            field.name,
            field.foreign_field
          );
        }
      }

      const enumFields = (data[0]?.fieldValues || []).filter(
        (field: any) => field.isEnum === true
      );

      for (const field of enumFields) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);

          queryClient.prefetchQuery({
            queryKey: ["enum", field.possible_value],
            queryFn: () => fetchEnum(field.possible_value),
          });

          await fetchEnumData(field.possible_value);
        }
      }

      return data;
    },
  });

  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({ ...prev, [enumName]: data }));
    } catch (err) {
      console.error(`Error fetching enum data for ${enumName}:`, err);
    }
  };

  const fetchForeignData = async (
    foreignResource: string,
    fieldName: string,
    foreignField: string
  ) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({ ...prev, [foreignResource]: data }));
    } catch (err) {
      console.error(`Error fetching foreign data for ${fieldName}:`, err);
    }
  };

  const handleEdit = (id: any, field: string, value: any) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setEditedRecord((prev: any) => ({
      ...prev,
      status: value,
    }));
  };

  const base64EncodeFun = (str: string) =>
    btoa(unescape(encodeURIComponent(str)));

  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();

    if (!editedRecord || Object.keys(editedRecord).length === 0) return;

    const params = new FormData();

    const selectedFileKeys = Object.keys(editedRecord).filter(
      (key) => editedRecord[key] instanceof File
    );

    if (selectedFileKeys.length > 0) {
      const fileKey = selectedFileKeys[0];
      params.append("file", editedRecord[fileKey]);
      editedRecord[fileKey] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const jsonString = JSON.stringify(editedRecord);
    const base64Encoded = base64EncodeFun(jsonString);

    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");

    try {
      const response = await authFetch(apiUrl, {
        method: "POST",
        body: params,
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1000);
        navigate("/valp_certificate");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "true")
      return (
        <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
          ✅ <span>Approved</span>
        </span>
      );
    if (status === "false")
      return (
        <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
          ❌ <span>Rejected</span>
        </span>
      );
    return (
      <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
        ⏳ <span>Pending</span>
      </span>
    );
  };

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      <main className="mainContent">
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Certificate</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <span className="profileInitial">A</span>
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "45px",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  padding: "10px",
                  minWidth: "130px",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  <LogOut size={16} />
                  <span style={{ marginLeft: "8px" }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="contentBody">
          <div className="pageFormContainer">
            {!loadingEditComp && (
              <form onSubmit={(e) => handleUpdate(id, e)}>
                <div className={styles.certificateFormWrapper}>
                  <h2 className={styles.sectionTitle}>Edit Certificate</h2>

                  {/* 🔥 LOGS BLOCK ADDED HERE */}
                  {editedRecord.logs && (
                    <div
                      style={{
                        background: "#f7f7f7",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "18px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      <h5 style={{ fontWeight: 600, marginBottom: "8px" }}>
                        Certificate Logs
                      </h5>

                      {(() => {
                        try {
                          const logs = JSON.parse(editedRecord.logs);
                          return (
                            <div>
                              {logs.uploaded_at && (
                                <div>
                                  <b>Uploaded:</b> {logs.uploaded_at}
                                </div>
                              )}

                              {logs.approved_by && (
                                <div>
                                  <b>Approved By:</b> {logs.approved_by}
                                </div>
                              )}
                              {logs.approved_date && (
                                <div>
                                  <b>Approved Date:</b> {logs.approved_date}
                                </div>
                              )}

                              {logs.rejected_by && (
                                <div>
                                  <b>Rejected By:</b> {logs.rejected_by}
                                </div>
                              )}
                              {logs.rejected_date && (
                                <div>
                                  <b>Rejected Date:</b> {logs.rejected_date}
                                </div>
                              )}

                              {!logs.approved_by &&
                                !logs.rejected_by &&
                                logs.uploaded_at && <div>Status: Pending</div>}
                            </div>
                          );
                        } catch (err) {
                          return <div>Invalid logs format</div>;
                        }
                      })()}
                    </div>
                  )}

                  <div className={styles.formGrid}>
                    {/* ----- Your old inputs remain unchanged ----- */}

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course Name
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_name"
                        required
                        value={editedRecord["course_name"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_name", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course
                        Duration
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_duration"
                        required
                        value={editedRecord["course_duration"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_duration", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course Mode
                      </label>
                      <input
                        className={styles.formControl}
                        name="course_mode"
                        value={editedRecord.course_mode || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_mode", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Platform
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="platform"
                        required
                        value={editedRecord["platform"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "platform", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Status
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px",
                          border: "1px solid #d0d0d0",
                          borderRadius: "8px",
                          background: "#fafafa",
                        }}
                      >
                        <select
                          className={styles.formControl}
                          style={{ flex: "0 0 180px" }}
                          name="status"
                          value={
                            editedRecord.status === "true"
                              ? "true"
                              : editedRecord.status === "false"
                              ? "false"
                              : "Pending"
                          }
                          onChange={(e) => handleStatusChange(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="true">Approved</option>
                          <option value="false">Rejected</option>
                        </select>

                        <div style={{ flex: 1 }}>
                          {getStatusBadge(editedRecord.status)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Course URL</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_url"
                        value={editedRecord["course_url"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_url", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button className={styles.primaryBtn} type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            )}

            {showToast && (
              <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
                <div className="toast show">
                  <div className="toast-header">
                    <strong className="me-auto">Success</strong>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowToast(false)}
                    ></button>
                  </div>
                  <div className="toast-body text-success text-center">
                    Updated successfully!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Edit;
