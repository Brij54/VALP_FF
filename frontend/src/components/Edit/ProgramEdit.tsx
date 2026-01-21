// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const Edit = () => {
//   const { id }: any = useParams();

//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
//   const [enums, setEnums] = useState<Record<string, any[]>>({});

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // ---------------- FETCH RECORD BY ID ----------------
//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");

//     const response = await fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     return response.json();
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(id, "Program");

//   useEffect(() => {
//     if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
//       setEditedRecord((prev: any) => ({
//         ...prev,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById.resource[0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   // ---------------- METADATA FETCH ----------------
//   useQuery({
//     queryKey: ["resMetaData"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch metadata`);

//       const data = await res.json();
//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       const foreignFields = data[0].fieldValues.filter((f: any) => f.foreign);

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

//       const enumFields = data[0].fieldValues.filter((f: any) => f.isEnum === true);

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
//       console.error(err);
//     }
//   };

//   const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({ ...prev, [foreignResource]: data }));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------- FIXED handleEdit ----------------
//   const handleEdit = (id: any, field: string, value: string | File | null) => {
//     setEditedRecord((prev: any) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const base64EncodeFun = (str: string) =>
//     btoa(unescape(encodeURIComponent(str)));

//   // ---------------- UPDATE ----------------
//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editedRecord) return;

//     const params = new FormData();

//     const fileKey = Object.keys(editedRecord).find(
//       (key) => editedRecord[key] instanceof File
//     );

//     if (fileKey) {
//       params.append("file", editedRecord[fileKey]);
//       editedRecord[fileKey] = "";
//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     // Convert record to base64 JSON
//     const jsonString = JSON.stringify(editedRecord);
//     params.append("resource", base64EncodeFun(jsonString));
//     params.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${accessToken}` },
//         credentials: "include",
//         body: params,
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 2500);
//       } else {
//         console.error("Update failed");
//       }
//     } catch (error) {
//       console.error("Update Error:", error);
//     }
//   };

//   return (
//     <>
//       {!loadingEditComp && (
//         <div className="container mt-4">
//           <form>
//             <div className="d-flex flex-column border border-2 p-2 gap-2 mb-2">
//               <div className="fw-bold fs-3">Program</div>

//               <label>name *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={editedRecord["name"] || ""}
//                 onChange={(e) => handleEdit(id, "name", e.target.value)}
//               />

//               <label>seats *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={editedRecord["seats"] || ""}
//                 onChange={(e) => handleEdit(id, "seats", e.target.value)}
//               />

//               <label>instructor_name *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={editedRecord["instructor_name"] || ""}
//                 onChange={(e) => handleEdit(id, "instructor_name", e.target.value)}
//               />

//               <label>syllabus</label>
//               <input
//                 className="form-control"
//                 type="file"
//                 onChange={(e) =>
//                   handleEdit(id, "syllabus", e.target.files?.[0] || null)
//                 }
//               />

//               <button className="btn btn-success" onClick={(e) => handleUpdate(id, e)}>
//                 Submit
//               </button>
//             </div>
//           </form>

//           {showToast && (
//             <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//               <div className="toast show">
//                 <div className="toast-header">
//                   <strong className="me-auto">Success</strong>
//                 </div>
//                 <div className="toast-body text-success text-center">
//                   Updated Successfully!
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
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
// import "../Batch_Config.css"; // use same UI as BatchEdit

// const Edit = () => {
//   const { id }: any = useParams();
//   const navigate = useNavigate();   // ✅ added navigate()

//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
//   const [enums, setEnums] = useState<Record<string, any[]>>({});

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // ---------------- FETCH RECORD BY ID ----------------
//   const fetchDataById = async (id: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");

//     const response = await fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Network response was not ok");

//     return response.json();
//   };

//   const useGetById = (id: string) => {
//     return useQuery({
//       queryKey: ["getById", id],
//       queryFn: () => fetchDataById(id),
//       enabled: !!id,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(id);

//   useEffect(() => {
//     if (fetchedDataById?.resource?.length > 0) {
//       setEditedRecord(
//         Object.fromEntries(
//           Object.entries(fetchedDataById.resource[0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         )
//       );
//     }
//   }, [fetchedDataById]);

//   // ---------------- METADATA FETCH ----------------
//   useQuery({
//     queryKey: ["resMetaData", "Program"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();
//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       return data;
//     },
//   });

//   // ---------------- handleEdit ----------------
//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prev: any) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const base64EncodeFun = (str: string) =>
//     btoa(unescape(encodeURIComponent(str)));

//   // ---------------- UPDATE ----------------
//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();

//     const params = new FormData();

//     const fileKey = Object.keys(editedRecord).find(
//       (key) => editedRecord[key] instanceof File
//     );

//     if (fileKey) {
//       params.append("file", editedRecord[fileKey]);
//       editedRecord[fileKey] = "";
//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     params.append("resource", base64EncodeFun(JSON.stringify(editedRecord)));
//     params.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${accessToken}` },
//       credentials: "include",
//       body: params,
//     });

//     if (response.ok) {
//       setShowToast(true);

//       // WAIT 1 second, then navigate → /program_config
//       setTimeout(() => {
//         navigate("/valpcourses");  // ✅ navigate added
//       }, 1000);
//     }
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
//           <h1 className="pageTitle">Edit Course</h1>
//         </header>

//         {!loadingEditComp && (
//           <form
//             className="w-100"
//             style={{
//               maxWidth: "500px",
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               padding: "60px 10px",
//               margin: "100px auto",
//             }}
//           >
//             <div className="card shadow-sm border-0 rounded">
//               <div
//                 className="card-header text-white text-center fw-semibold"
//                 style={{
//                   background: "linear-gradient(135deg, #007bff, #0056d2)",
//                   padding: "15px 10px",
//                   fontSize: "20px",
//                   borderTopLeftRadius: "10px",
//                   borderTopRightRadius: "10px",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Edit Course Details
//               </div>

//               <div className="card-body p-4">
//                 <label className="fw-bold mb-1">Course Name *</label>
//                 <input
//                   type="text"
//                   className="form-control mb-3 rounded-3"
//                   value={editedRecord["name"] || ""}
//                   onChange={(e) => handleEdit(id, "name", e.target.value)}
//                 />

//                 <label className="fw-bold mb-1">Seats *</label>
//                 <input
//                   type="number"
//                   className="form-control mb-3 rounded-3"
//                   value={editedRecord["seats"] || ""}
//                   onChange={(e) => handleEdit(id, "seats", e.target.value)}
//                 />

//                 <label className="fw-bold mb-1">Instructor Name *</label>
//                 <input
//                   type="text"
//                   className="form-control mb-3 rounded-3"
//                   value={editedRecord["instructor_name"] || ""}
//                   onChange={(e) =>
//                     handleEdit(id, "instructor_name", e.target.value)
//                   }
//                 />

//                 <label className="fw-bold mb-1">Upload Syllabus</label>
//                 <input
//                   type="file"
//                   className="form-control mb-4 rounded-3"
//                   onChange={(e) =>
//                     handleEdit(id, "syllabus", e.target.files?.[0] || null)
//                   }
//                 />

//                 <button
//                   className="btn btn-success w-100 py-2 fs-6 fw-semibold rounded-3"
//                   onClick={(e) => handleUpdate(id, e)}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show shadow">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//               </div>
//               <div className="toast-body text-success text-center">
//                 Updated Successfully!
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Edit;

// import React, { useEffect,useRef, useState } from "react";
// import { useLocation,useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery,useQueryClient } from "@tanstack/react-query";
// import { getUserIdFromJWT, useProgramViewModel } from "../viewModels/useProgramViewModel";

// const ProgramEdit = () => {
// const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Program")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>( {});
//   const [resMetaData, setResMetaData] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
//   const regex = /^(g_|archived|extra_data)/;
// const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

// const {appId}:any= useParams<any>();
// const {
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
//    const fetchDataById = async (id: string, resourceName: string) => {

//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Add token here
//       },
//       credentials: "include", // include cookies if needed
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     return data;
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//    const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Program"
//   );

//     useEffect(() => {
//     // console.log()

//     if (fetchDataById.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById["resource"][0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//       console.log(
//         "fetched data by ID",
//         fetchedDataById,
//         loadingEditComp,
//         editedRecord
//       );
//     }
//   }, [fetchedDataById, loadingEditComp]);

//    const {
//     data: metaData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["resMetaData",'programEdit'],
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

// // ✅ async function, not useQuery
// const fetchEnumData = async (enumName: string) => {
//   try {
//     const data = await fetchEnum(enumName);
//     setEnums((prev:any) => ({
//       ...prev,
//       [enumName]: data,
//     }));
//   } catch (err) {
//     console.error(`Error fetching enum data for ${enumName}:`, err);
//   }
// };

//  // ✅ async function, not useQuery
// const fetchForeignData = async (
//   foreignResource: string,
//   fieldName: string,
//   foreignField: string
// ) => {
//   try {
//     const data = await fetchForeignResource(foreignResource);
//     setForeignKeyData((prev:any) => ({
//       ...prev,
//       [foreignResource]: data,
//     }));
//   } catch (err) {
//     console.error(`Error fetching foreign data for ${fieldName}:`, err);
//   }
// };

//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//         [field]: value,

//     }));
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };
//   const base64EncodeFun = (str: string) => {
//   return btoa(unescape(encodeURIComponent(str)));
// };

//   const handleUpdate = async ( e: React.FormEvent) => {
//     e.preventDefault();
//     if (editedRecord.length === 0) return;

//     const params = new FormData();

//     let selectedFile = null;
//     selectedFile = Object.keys(editedRecord).filter((key) => editedRecord[key] instanceof File)
//     if(selectedFile!== undefined && selectedFile.length>0){
//       params.append("file", editedRecord[selectedFile[0]]);
//       editedRecord[selectedFile[0]] = "";

//       params.append("description", "my description");
//       params.append("appId","hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }
//     const jsonString = JSON.stringify(editedRecord);

//     const base64Encoded = base64EncodeFun(jsonString);
//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");
//      const accessToken = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${accessToken}`, // Add token here
//         },
//         credentials: 'include', // include cookies if needed
//         body: params,

//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);

//       } else {
//         console.error("Error updating record:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error in handleUpdate:", error);
//     }
//   };

//   return (

//   <>
//   {!loadingEditComp &&( <div className="container mt-4">
//      <form>
//        <div id="id-VP" className="d-flex flex-column border border-2 p-2 gap-2 mb-2"><div className="fw-bold fs-3" id="id-VR">Program</div><div id="id-VT" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-VV">name *</div><input type="text" className="form-control" name="name" required={true} value={editedRecord["name"] || ""} onChange={(e) => handleEdit(id, "name", e.target.value)} /></div><div id="id-VZ" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-W1">seats *</div><input type="text" className="form-control" name="seats" required={true} value={editedRecord["seats"] || ""} onChange={(e) => handleEdit(id, "seats", e.target.value)} /></div><div id="id-W5" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-W7">instructor_name *</div><input type="text" className="form-control" name="instructor_name" required={true} value={editedRecord["instructor_name"] || ""} onChange={(e) => handleEdit(id, "instructor_name", e.target.value)} /></div><div id="id-WB" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-WD">syllabus</div><div className="mb-3" id="id-WF"><label className="form-label">Upload file for syllabus </label><input className="form-control" type="file" name="syllabus" required={false} onChange={(e) => handleEdit( id, "syllabus", e.target.files?.[0] || null ) } /></div></div><div id="id-WH" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-WJ">term_name *</div><input type="text" className="form-control" name="term_name" required={true} value={editedRecord["term_name"] || ""} onChange={(e) => handleEdit(id, "term_name", e.target.value)} /></div><div id="id-WN" className="border-0 w-100 bg-light"><div className="fw-bold" id="id-WP">academic_year_id *</div>{(() => { const options = foreignKeyData["Academic_year"] || []; const filteredOptions = options.filter((option:any) => option["id"]?.toLowerCase().includes( (searchQueries["academic_year_id"] || "").toLowerCase() ) ); return ( <><button className="btn btn-secondary dropdown-toggle" type="button" id={`dropdownMenu-academic_year_id`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > {editedRecord["academic_year_id"] ? options.find( (item:any) => item["id"] === editedRecord["academic_year_id"] )?.["id"] || "Select" : `Select academic_year_id`} </button><div className="dropdown-menu" aria-labelledby={`dropdownMenu-academic_year_id`} ><input type="text" className="form-control mb-2" placeholder={`Search academic_year_id`} value={searchQueries["academic_year_id"] || ""} onChange={(e) => handleSearchChange("academic_year_id", e.target.value) } /> {filteredOptions.length > 0 ? ( filteredOptions.map((option:any, i:any) => ( <button key={i} className="dropdown-item" type="button" onClick={() => setEditedRecord({ ...editedRecord, ["academic_year_id"]: option["id"], }) } > {option["id"]} </button> )) ) : ( <span className="dropdown-item text-muted"> No options available </span> )} </div></> ); })()} </div><button className="btn btn-success" id="id-WT" onClick={(e)=>handleUpdate(e)}>Submit</button></div>
//      </form>

//      {showToast && (
//        <div
//          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//          style={{ zIndex: 1550 }}
//        >
//          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//            <div className="toast-header">
//              <strong className="me-auto">Success</strong>
//              <button
//                type="button"
//                className="btn-close"
//                onClick={() => setShowToast(false)}
//              ></button>
//            </div>
//            <div className="toast-body text-success text-center">
//              Updated successfully!
//            </div>
//          </div>
//        </div>
//      )}
//    </div>)}
//   </>
//   );
// };

// export default ProgramEdit;

// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getUserIdFromJWT,
//   useProgramViewModel,
// } from "../viewModels/useProgramViewModel";
// import Sidebar from "../Utils/SidebarAdmin"; // ✅ SIDEBAR ADDED
// // import "../Batch_Config.css"; // ✅ SAME UI CSS
// import styles from "../Styles/CreateCertificate.module.css";

// const ProgramEdit = () => {
//   const navigate = useNavigate();
//   const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Program")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [resMetaData, setResMetaData] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const { appId }: any = useParams<any>();

//   const {
//     fields,
//     setFields,
//     enums,
//     setEnums,
//     foreignKeyData,
//     setForeignKeyData,
//   } = useProgramViewModel(getUserIdFromJWT(), appId);

//   const fetchDataById = async (id: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");

//     const response = await fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Network response was not ok");
//     return response.json();
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useQuery({
//     queryKey: ["getById", id],
//     queryFn: () => fetchDataById(id),
//     enabled: !!id,
//   });

//   useEffect(() => {
//     if (fetchedDataById?.resource?.length > 0) {
//       setEditedRecord(
//         Object.fromEntries(
//           Object.entries(fetchedDataById.resource[0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         )
//       );
//     }
//   }, [fetchedDataById]);

//   useQuery({
//     queryKey: ["resMetaData", "programEdit"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl);
//       const data = await res.json();
//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       for (const field of data[0].fieldValues.filter((f: any) => f.foreign)) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);
//           const d = await fetchForeignResource(field.foreign);
//           setForeignKeyData((prev: any) => ({ ...prev, [field.foreign]: d }));
//         }
//       }

//       for (const field of data[0].fieldValues.filter((f: any) => f.isEnum)) {
//         if (!fetchedEnum.current.has(field.possible_value)) {
//           fetchedEnum.current.add(field.possible_value);
//           const d = await fetchEnum(field.possible_value);
//           setEnums((prev: any) => ({ ...prev, [field.possible_value]: d }));
//         }
//       }

//       return data;
//     },
//   });

//   const handleEdit = (field: string, value: any) => {
//     setEditedRecord((prev: any) => ({ ...prev, [field]: value }));
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const params = new FormData();
//     const fileKey = Object.keys(editedRecord).find(
//       (k) => editedRecord[k] instanceof File
//     );

//     if (fileKey) {
//       params.append("file", editedRecord[fileKey]);
//       editedRecord[fileKey] = "";
//     }

//     params.append(
//       "resource",
//       btoa(unescape(encodeURIComponent(JSON.stringify(editedRecord))))
//     );
//     params.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${accessToken}` },
//       credentials: "include",
//       body: params,
//     });

//     if (response.ok) {
//       setShowToast(true);
//       setTimeout(() => {
//         navigate("/valpcourses"); // ✅ navigate added
//       }, 1000);
//     }
//   };

//   /* ================= UI ONLY ================= */

//   return (
//     <div className="page12Container">
//   {/* ✅ SIDEBAR */}
//   <Sidebar
//     sidebarCollapsed={sidebarCollapsed}
//     toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
//     activeSection="dashboard"
//   />

//   <main className="mainContent">
//     <header className="contentHeader">
//       <h1 className="pageTitle">Edit Course</h1>
//     </header>

//     <div className="contentBody">
//       <div className="pageFormContainer">
//         {!loadingEditComp && (
//           <form onSubmit={handleUpdate}>
//             <div className={styles.certificateFormWrapper}>
//               <h2 className={styles.sectionTitle}>Edit Course Information</h2>

//               <div className={styles.formGrid}>
//                 {/* Course Name */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>
//                     <span className={styles.required}>*</span> Course Name
//                   </label>
//                   <input
//                     type="text"
//                     className={styles.formControl}
//                     value={editedRecord.name || ""}
//                     onChange={(e) => handleEdit("name", e.target.value)}
//                     required
//                   />
//                 </div>

//                 {/* Seats */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>
//                     <span className={styles.required}>*</span> Seats
//                   </label>
//                   <input
//                     type="number"
//                     className={styles.formControl}
//                     value={editedRecord.seats || ""}
//                     onChange={(e) => handleEdit("seats", e.target.value)}
//                     required
//                   />
//                 </div>

//                 {/* Instructor */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>
//                     <span className={styles.required}>*</span> Instructor Name
//                   </label>
//                   <input
//                     type="text"
//                     className={styles.formControl}
//                     value={editedRecord.instructor_name || ""}
//                     onChange={(e) =>
//                       handleEdit("instructor_name", e.target.value)
//                     }
//                     required
//                   />
//                 </div>

//                 {/* Term */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>
//                     <span className={styles.required}>*</span> Term Name
//                   </label>
//                   <input
//                     type="text"
//                     className={styles.formControl}
//                     value={editedRecord.term_name || ""}
//                     onChange={(e) => handleEdit("term_name", e.target.value)}
//                     required
//                   />
//                 </div>

//                 {/* Academic Year */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>
//                     <span className={styles.required}>*</span> Academic Year
//                   </label>
//                   <select
//                     className={styles.formControl}
//                     value={editedRecord.academic_year_id || ""}
//                     onChange={(e) =>
//                       handleEdit("academic_year_id", e.target.value)
//                     }
//                     required
//                   >
//                     <option value="">Select Academic Year</option>
//                     {(foreignKeyData["Academic_year"] || []).map((y:any) => (
//                       <option key={y.id} value={y.id}>
//                         {y.id}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Syllabus */}
//                 <div className={styles.formGroup}>
//                   <label className={styles.formLabel}>Upload Syllabus</label>
//                   <input
//                     type="file"
//                     className={styles.formControl}
//                     onChange={(e) =>
//                       handleEdit("syllabus", e.target.files?.[0] || null)
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Button */}
//               <div className={styles.buttonRow}>
//                 <button type="submit" className={styles.primaryBtn}>
//                   Update
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//         {/* Toast */}
//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//               </div>
//               <div className="toast-body text-success text-center">
//                 Updated Successfully!
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </main>
// </div>

//   );
// };

// export default ProgramEdit;

// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getUserIdFromJWT,
//   useProgramViewModel,
// } from "../viewModels/useProgramViewModel";
// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";
// import { LogOut } from "lucide-react";
// import { logout } from "../../apis/backend";

// const ProgramEdit = () => {
//   const navigate = useNavigate();
//   const { id, appId }: any = useParams();

//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [showToast, setShowToast] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const [showDropdown, setShowDropdown] = useState(false);

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());

//   const {
//     setFields,
//     setEnums,
//     foreignKeyData,
//     setForeignKeyData,
//   } = useProgramViewModel(getUserIdFromJWT(), appId);

//   /* ================= FETCH PROGRAM ================= */

//   const fetchProgramById = async () => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const res = await fetch(`${baseUrl}?${params}`, {
//       headers: {
//         Authorization: `Bearer ${getCookie("access_token")}`,
//       },
//       credentials: "include",
//     });

//     if (!res.ok) throw new Error("Failed to fetch program");
//     return res.json();
//   };

//   const { data: programData, isLoading } = useQuery({
//     queryKey: ["programById", id],
//     queryFn: fetchProgramById,
//     enabled: !!id,
//   });

//   /* ================= FETCH ACADEMIC YEARS ================= */

//   const { data: academicYears } = useQuery({
//     queryKey: ["academicYears"],
//     queryFn: async () => {
//       const d: any = await fetchForeignResource("Academic_year");
//       return Array.isArray(d) ? d : d.resource || [];
//     },
//   });

//   const academicYearMap = useMemo(() => {
//     const map: Record<string, string> = {};
//     (academicYears || []).forEach((ay: any) => {
//       map[ay.id] =
//         ay.academic_name || ay.academicName || ay.name || ay.id;
//     });
//     return map;
//   }, [academicYears]);

//   /* ================= PREFILL FORM ================= */

//   useEffect(() => {
//     if (programData?.resource?.length) {
//       const record = programData.resource[0];

//       setEditedRecord(
//         Object.fromEntries(
//           Object.entries(record).filter(
//             ([key]) => !regex.test(key)
//           )
//         )
//       );
//     }
//   }, [programData]);

//   /* ================= FETCH METADATA ================= */

//   useQuery({
//     queryKey: ["programMeta"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl);
//       const data = await res.json();

//       setFields(data[0].fieldValues);

//       for (const f of data[0].fieldValues.filter((x: any) => x.foreign)) {
//         if (!fetchedResources.current.has(f.foreign)) {
//           fetchedResources.current.add(f.foreign);
//           const d = await fetchForeignResource(f.foreign);
//           setForeignKeyData((p: any) => ({ ...p, [f.foreign]: d }));
//         }
//       }

//       for (const f of data[0].fieldValues.filter((x: any) => x.isEnum)) {
//         if (!fetchedEnum.current.has(f.possible_value)) {
//           fetchedEnum.current.add(f.possible_value);
//           const d = await fetchEnum(f.possible_value);
//           setEnums((p: any) => ({ ...p, [f.possible_value]: d }));
//         }
//       }

//       return data;
//     },
//   });

//   const handleEdit = (field: string, value: any) => {
//     setEditedRecord((prev: any) => ({ ...prev, [field]: value }));
//   };

//   /* ================= UPDATE ================= */

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const params = new FormData();
//     params.append(
//       "resource",
//       btoa(unescape(encodeURIComponent(JSON.stringify(editedRecord))))
//     );
//     params.append("action", "MODIFY");

//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${getCookie("access_token")}`,
//       },
//       credentials: "include",
//       body: params,
//     });

//     if (res.ok) {
//       setShowToast(true);
//       setTimeout(() => navigate("/valpcourses"), 1000);
//     }
//   };

//   const handleLogout = async () => {
//       const ok = await logout();
//       if (ok) {
//         navigate("/");
//       }
//     };

//   /* ================= UI (UNCHANGED) ================= */

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={sidebarCollapsed}
//         toggleSidebar={() => setSidebarCollapsed((p) => !p)}
//         activeSection="dashboard"
//       />

//       <main className="mainContent">
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Course</h1>
//         </header>

//         <div className="userProfile" style={{ position: "relative" }}>
//             <div className="profileCircle"
//               onClick={() => setShowDropdown((prev) => !prev)}
//               style={{ cursor: "pointer" }}
//             >
//               <span className="profileInitial">A</span>
//             </div>

//             {showDropdown && (
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: "45px",
//                   background: "white",
//                   borderRadius: "8px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
//                   padding: "10px",
//                   minWidth: "130px",
//                   zIndex: 100,
//                 }}
//               >
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     width: "100%",
//                     background: "none",
//                     border: "none",
//                     textAlign: "left",
//                     padding: "8px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   <LogOut size={16} />
//                   <span style={{ marginLeft: "8px" }}>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             {!isLoading && (
//               <form onSubmit={handleUpdate}>
//                 <div className={styles.certificateFormWrapper}>
//                   <h2 className={styles.sectionTitle}>
//                     Edit Course Information
//                   </h2>

//                   <div className={styles.formGrid}>
//                     {/* Name */}
//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.name || ""}
//                       onChange={(e) =>
//                         handleEdit("name", e.target.value)
//                       }
//                     />

//                     {/* Seats */}
//                     <input
//                       type="number"
//                       className={styles.formControl}
//                       value={editedRecord.seats || ""}
//                       onChange={(e) =>
//                         handleEdit("seats", e.target.value)
//                       }
//                     />

//                     {/* Instructor */}
//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.instructor_name || ""}
//                       onChange={(e) =>
//                         handleEdit("instructor_name", e.target.value)
//                       }
//                     />

//                     {/* Term */}
//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.term_name || ""}
//                       onChange={(e) =>
//                         handleEdit("term_name", e.target.value)
//                       }
//                     />

//                     {/* Academic Year */}
//                     <select
//                       className={styles.formControl}
//                       value={editedRecord.academic_year_id || ""}
//                       onChange={(e) =>
//                         handleEdit("academic_year_id", e.target.value)
//                       }
//                     >
//                       <option value="">Select Academic Year</option>
//                       {(academicYears || []).map((ay: any) => (
//                         <option key={ay.id} value={ay.id}>
//                           {academicYearMap[ay.id]}
//                         </option>
//                       ))}
//                     </select>

//                     {/* Start Date */}
//                     <input
//                       type="date"
//                       className={styles.formControl}
//                       value={editedRecord.start_date || ""}
//                       onChange={(e) =>
//                         handleEdit("start_date", e.target.value)
//                       }
//                     />

//                     {/* End Date */}
//                     <input
//                       type="date"
//                       className={styles.formControl}
//                       value={editedRecord.end_date || ""}
//                       onChange={(e) =>
//                         handleEdit("end_date", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className={styles.buttonRow}>
//                     <button className={styles.primaryBtn}>
//                       Update
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-body text-success text-center">
//                     Updated Successfully!
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

// export default ProgramEdit;

// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getUserIdFromJWT,
//   useProgramViewModel,
// } from "../viewModels/useProgramViewModel";
// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";
// import { LogOut } from "lucide-react";
// import { logout } from "../../apis/backend";

// const ProgramEdit = () => {
//   const navigate = useNavigate();
//   const { id, appId }: any = useParams();

//   const baseUrl = apiConfig.getResourceUrl("Program");
//   const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
//   const metadataUrl =
//     apiConfig.getResourceMetaDataUrl("Program");

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [showToast, setShowToast] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   /* 🔑 PROFILE STATE (SAME AS Batch_Config) */
//   const [showDropdown, setShowDropdown] = useState(false);

//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());

//   const {
//     setFields,
//     setEnums,
//     setForeignKeyData,
//   } = useProgramViewModel(getUserIdFromJWT(), appId);

//   /* ================= FETCH PROGRAM ================= */

//   const fetchProgramById = async () => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const res = await fetch(`${baseUrl}?${params}`, {
//       headers: {
//         Authorization: `Bearer ${getCookie("access_token")}`,
//       },
//       credentials: "include",
//     });

//     if (!res.ok) throw new Error("Failed to fetch program");
//     return res.json();
//   };

//   const { data: programData, isLoading } = useQuery({
//     queryKey: ["programById", id],
//     queryFn: fetchProgramById,
//     enabled: !!id,
//   });

//   /* ================= FETCH ACADEMIC YEARS ================= */

//   const { data: academicYears } = useQuery({
//     queryKey: ["academicYears"],
//     queryFn: async () => {
//       const d: any = await fetchForeignResource("Academic_year");
//       return Array.isArray(d) ? d : d.resource || [];
//     },
//   });

//   /* ================= PREFILL FORM ================= */

//   useEffect(() => {
//     if (programData?.resource?.length) {
//       const record = programData.resource[0];
//       setEditedRecord(
//         Object.fromEntries(
//           Object.entries(record).filter(
//             ([key]) => !regex.test(key)
//           )
//         )
//       );
//     }
//   }, [programData]);

//   /* ================= FETCH METADATA ================= */

//   useQuery({
//     queryKey: ["programMeta"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl);
//       const data = await res.json();

//       setFields(data[0].fieldValues);

//       for (const f of data[0].fieldValues.filter((x: any) => x.foreign)) {
//         if (!fetchedResources.current.has(f.foreign)) {
//           fetchedResources.current.add(f.foreign);
//           const d = await fetchForeignResource(f.foreign);
//           setForeignKeyData((p: any) => ({ ...p, [f.foreign]: d }));
//         }
//       }

//       for (const f of data[0].fieldValues.filter((x: any) => x.isEnum)) {
//         if (!fetchedEnum.current.has(f.possible_value)) {
//           fetchedEnum.current.add(f.possible_value);
//           const d = await fetchEnum(f.possible_value);
//           setEnums((p: any) => ({ ...p, [f.possible_value]: d }));
//         }
//       }

//       return data;
//     },
//   });

//   const handleEdit = (field: string, value: any) =>
//     setEditedRecord((p: any) => ({ ...p, [field]: value }));

//   /* ================= UPDATE ================= */

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const params = new FormData();
//     params.append(
//       "resource",
//       btoa(unescape(encodeURIComponent(JSON.stringify(editedRecord))))
//     );
//     params.append("action", "MODIFY");

//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${getCookie("access_token")}`,
//       },
//       credentials: "include",
//       body: params,
//     });

//     if (res.ok) {
//       setShowToast(true);
//       setTimeout(() => navigate("/valpcourses"), 1000);
//     }
//   };

//   /* ================= LOGOUT ================= */

//   const handleLogout = async () => {
//     const ok = await logout();
//     if (ok) navigate("/");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={sidebarCollapsed}
//         toggleSidebar={() => setSidebarCollapsed((p) => !p)}
//         activeSection="dashboard"
//       />

//       <main
//         className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
//       >
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Course</h1>

//           {/* ✅ USER PROFILE (EXACT SAME AS Batch_Config) */}
//           <div className="userProfile" style={{ position: "relative" }}>
//             <div
//               className="profileCircle"
//               onClick={() => setShowDropdown((prev) => !prev)}
//               style={{ cursor: "pointer" }}
//             >
//               <span className="profileInitial">A</span>
//             </div>

//             {showDropdown && (
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: "45px",
//                   background: "white",
//                   borderRadius: "8px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
//                   padding: "10px",
//                   minWidth: "130px",
//                   zIndex: 100,
//                 }}
//               >
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     width: "100%",
//                     background: "none",
//                     border: "none",
//                     textAlign: "left",
//                     padding: "8px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   <LogOut size={16} />
//                   <span style={{ marginLeft: "8px" }}>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </header>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             {!isLoading && (
//               <form onSubmit={handleUpdate}>
//                 <div className={styles.certificateFormWrapper}>
//                   <h2 className={styles.sectionTitle}>
//                     Edit Course Information
//                   </h2>

//                   <div className={styles.formGrid}>
//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.name || ""}
//                       onChange={(e) => handleEdit("name", e.target.value)}
//                     />

//                     <input
//                       type="number"
//                       className={styles.formControl}
//                       value={editedRecord.seats || ""}
//                       onChange={(e) => handleEdit("seats", e.target.value)}
//                     />

//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.instructor_name || ""}
//                       onChange={(e) =>
//                         handleEdit("instructor_name", e.target.value)
//                       }
//                     />

//                     <input
//                       className={styles.formControl}
//                       value={editedRecord.term_name || ""}
//                       onChange={(e) => handleEdit("term_name", e.target.value)}
//                     />

//                     <select
//                       className={styles.formControl}
//                       value={editedRecord.academic_year_id || ""}
//                       onChange={(e) =>
//                         handleEdit("academic_year_id", e.target.value)
//                       }
//                     >
//                       <option value="">Select Academic Year</option>
//                       {(academicYears || []).map((ay: any) => (
//                         <option key={ay.id} value={ay.id}>
//                           {ay.academic_name || ay.name || ay.id}
//                         </option>
//                       ))}
//                     </select>

//                     <input
//                       type="date"
//                       className={styles.formControl}
//                       value={editedRecord.start_date || ""}
//                       onChange={(e) =>
//                         handleEdit("start_date", e.target.value)
//                       }
//                     />

//                     <input
//                       type="date"
//                       className={styles.formControl}
//                       value={editedRecord.end_date || ""}
//                       onChange={(e) =>
//                         handleEdit("end_date", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className={styles.buttonRow}>
//                     <button className={styles.primaryBtn}>
//                       Update
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-body text-success text-center">
//                     Updated Successfully!
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

// export default ProgramEdit;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery } from "@tanstack/react-query";
import {
  getUserIdFromJWT,
  useProgramViewModel,
} from "../viewModels/useProgramViewModel";
import Sidebar from "../Utils/SidebarAdmin";
import styles from "../Styles/CreateCertificate.module.css";
import { LogOut } from "lucide-react";
import { logout } from "../../apis/backend";

/* ================= UTILS ================= */

const regex = /^(g_|archived|extra_data)/;

const prettify = (s: string) =>
  (s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const isValidDateRange = (start?: string, end?: string) => {
  if (!start || !end) return true;
  return new Date(start).getTime() <= new Date(end).getTime();
};

/**
 * Validates both old date fields (start_date/end_date)
 * and new date fields (registration/course date pairs) if present.
 */
const validateProgramDates = (rec: any) => {
  // old
  const start = rec.start_date;
  const end = rec.end_date;

  // new
  const regStart = rec.registration_start_date;
  const regEnd = rec.registration_end_date;
  const courseStart = rec.course_start_date;
  const courseEnd = rec.course_end_date;

  if (start || end) {
    if (!start || !end) return "Start date and End date are required.";
    if (!isValidDateRange(start, end))
      return "Start date must be before (or same as) End date.";
  }

  if (regStart || regEnd) {
    if (!regStart || !regEnd)
      return "Registration start date and end date are required.";
    if (!isValidDateRange(regStart, regEnd))
      return "Registration start date must be before registration end date.";
  }

  if (courseStart || courseEnd) {
    if (!courseStart || !courseEnd)
      return "Course start date and end date are required.";
    if (!isValidDateRange(courseStart, courseEnd))
      return "Course start date must be before course end date.";
  }

  // Optional rule
  if (regEnd && courseStart) {
    if (new Date(regEnd).getTime() > new Date(courseStart).getTime()) {
      return "Registration must end before the course starts.";
    }
  }

  return "";
};

const ProgramEdit = () => {
  const navigate = useNavigate();
  const { id, appId }: any = useParams();

  const baseUrl = apiConfig.getResourceUrl("Program");
  const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Program");

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [showToast, setShowToast] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateError, setDateError] = useState<string>("");

  const [showDropdown, setShowDropdown] = useState(false);

  const [metaFields, setMetaFields] = useState<any[]>([]);

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());

  // ✅ local data for rendering foreign/enums (NO DUPLICATES)
  const [foreignKeyDataLocal, setForeignKeyDataLocal] = useState<
    Record<string, any[]>
  >({});
  const [enumDataLocal, setEnumDataLocal] = useState<Record<string, any[]>>({});

  // keep your view model setters (safe to keep)
  const { setFields, setEnums, setForeignKeyData } = useProgramViewModel(
    getUserIdFromJWT(),
    appId
  );

  /* ================= FETCH PROGRAM ================= */

  const fetchProgramById = async () => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const res = await fetch(`${baseUrl}?${params}`, {
      headers: { Authorization: `Bearer ${getCookie("access_token")}` },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch program");
    return res.json();
  };

  const { data: programData, isLoading } = useQuery({
    queryKey: ["programById", id],
    queryFn: fetchProgramById,
    enabled: !!id,
  });

  /* ================= PREFILL FORM ================= */

  useEffect(() => {
    if (programData?.resource?.length) {
      const record = programData.resource[0];

      const cleaned = Object.fromEntries(
        Object.entries(record).filter(([k]) => !regex.test(k))
      );

      setEditedRecord(cleaned);

      const err = validateProgramDates(cleaned);
      setDateError(err);
    }
  }, [programData]);

  /* ================= FETCH METADATA ================= */

  useQuery({
    queryKey: ["programMeta"],
    queryFn: async () => {
      const res = await fetch(metadataUrl);
      if (!res.ok) throw new Error("Failed to fetch metadata");
      const data = await res.json();

      const fvs = data?.[0]?.fieldValues || [];
      setFields(fvs);
      setMetaFields(fvs);

      // foreign keys
      for (const f of fvs.filter((x: any) => x.foreign)) {
        const foreignRes =
          typeof f.foreign === "string"
            ? f.foreign
            : f.foreign?.resource || f.foreign?.name;

        if (!foreignRes) continue;

        if (!fetchedResources.current.has(foreignRes)) {
          fetchedResources.current.add(foreignRes);

          const d: any = await fetchForeignResource(foreignRes);
          const rows = Array.isArray(d) ? d : d.resource || [];

          setForeignKeyData((p: any) => ({ ...p, [foreignRes]: rows }));
          setForeignKeyDataLocal((p) => ({ ...p, [foreignRes]: rows }));
        }
      }

      // enums
      for (const f of fvs.filter((x: any) => x.isEnum)) {
        const enumName = f.possible_value;
        if (!enumName) continue;

        if (!fetchedEnum.current.has(enumName)) {
          fetchedEnum.current.add(enumName);

          const d: any = await fetchEnum(enumName);

          setEnums((p: any) => ({ ...p, [enumName]: d }));
          setEnumDataLocal((p) => ({ ...p, [enumName]: d }));
        }
      }

      return data;
    },
    enabled: !!id,
  });

  /* ================= EDIT HANDLER ================= */

  const handleEdit = (field: string, value: any) => {
    const next = { ...editedRecord, [field]: value };
    setEditedRecord(next);

    // Validate whenever date fields change
    if (field.includes("date") || field === "start_date" || field === "end_date") {
      const err = validateProgramDates(next);
      setDateError(err);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateProgramDates(editedRecord);
    if (err) {
      setDateError(err);
      return;
    }
    setDateError("");

    const params = new FormData();
    const payload = { ...editedRecord };

    // attach first file field if present
    const fileField = metaFields.find(
      (f) => f?.is_file === true || f?.is_file === "true"
    );
    if (fileField && payload[fileField.name] instanceof File) {
      params.append("file", payload[fileField.name]);
      payload[fileField.name] = "";
    }

    params.append(
      "resource",
      btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    );
    params.append("action", "MODIFY");

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${getCookie("access_token")}` },
      credentials: "include",
      body: params,
    });

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => navigate("/valpcourses"), 1000);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  /* ================= VISIBLE FIELDS ================= */

  const visibleFields = useMemo(() => {
    // edit everything except: id + status + system keys
    return (metaFields || [])
      .filter((f: any) => f?.name && !regex.test(f.name))
      .filter((f: any) => f.name !== "id")
      .filter((f: any) => f.name !== "status");
  }, [metaFields]);

  /* ================= FIELD RENDERER ================= */

  const renderInputForField = (f: any) => {
    const name = f.name as string;
    if (name === "status") return null;

    const type = String(f.type || "").toLowerCase();
    const isFile = f.is_file === true || f.is_file === "true";
    const isEnum = f.isEnum === true || f.isEnum === "true";
    const hasForeign = !!f.foreign;

    const foreignRes =
      typeof f.foreign === "string"
        ? f.foreign
        : f.foreign?.resource || f.foreign?.name;

    // FILE
    if (isFile) {
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.formLabel}>{prettify(name)}</label>
          <input
            type="file"
            className={styles.formControl}
            onChange={(e) =>
              handleEdit(name, e.target.files?.[0] ? e.target.files[0] : null)
            }
          />
        </div>
      );
    }

    // DATE
    if (type === "date") {
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.formLabel}>{prettify(name)}</label>
          <input
            type="date"
            className={styles.formControl}
            value={editedRecord[name] || ""}
            onChange={(e) => handleEdit(name, e.target.value)}
          />
        </div>
      );
    }

    // ENUM
    if (isEnum) {
      const options = enumDataLocal[f.possible_value] || [];
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.formLabel}>{prettify(name)}</label>
          <select
            className={styles.formControl}
            value={editedRecord[name] || ""}
            onChange={(e) => handleEdit(name, e.target.value)}
          >
            <option value="">Select {prettify(name)}</option>
            {options.map((opt: any, idx: number) => {
              const val = opt?.value ?? opt?.name ?? opt?.id ?? String(opt);
              const label = opt?.label ?? opt?.name ?? opt?.value ?? String(opt);
              return (
                <option key={`${val}-${idx}`} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      );
    }

    // FOREIGN KEY
    if (hasForeign && foreignRes) {
      const rows = foreignKeyDataLocal[foreignRes] || [];
      const labelOf = (row: any) =>
        row?.academic_name || row?.name || row?.title || row?.code || row?.id;

      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.formLabel}>{prettify(name)}</label>
          <select
            className={styles.formControl}
            value={editedRecord[name] || ""}
            onChange={(e) => handleEdit(name, e.target.value)}
          >
            <option value="">Select {prettify(name)}</option>
            {rows.map((r: any) => (
              <option key={r.id} value={r.id}>
                {labelOf(r)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // NUMBER
    if (
      type === "long" ||
      type === "int" ||
      type === "integer" ||
      type === "double" ||
      type === "float" ||
      type === "number"
    ) {
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.formLabel}>{prettify(name)}</label>
          <input
            type="number"
            className={styles.formControl}
            value={editedRecord[name] ?? ""}
            onChange={(e) => handleEdit(name, e.target.value)}
          />
        </div>
      );
    }

    // DEFAULT TEXT
    return (
      <div key={name} className={styles.formGroup}>
        <label className={styles.formLabel}>{prettify(name)}</label>
        <input
          className={styles.formControl}
          value={editedRecord[name] ?? ""}
          onChange={(e) => handleEdit(name, e.target.value)}
        />
      </div>
    );
  };

  /* ================= UI ================= */

  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((p) => !p)}
        activeSection="dashboard"
      />

      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Course</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <span className="profileInitial">A</span>
            </div>

            {showDropdown && (
              <div className="profileDropdown">
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="contentBody">
          <div className="pageFormContainer">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className={styles.certificateFormWrapper}>
                  <h2 className={styles.sectionTitle}>Edit Course Information</h2>

                  <div className={styles.formGrid}>
                    {visibleFields.map((f: any) => renderInputForField(f))}
                  </div>

                  {dateError && (
                    <div style={{ color: "#dc3545", fontSize: 13, marginTop: 8 }}>
                      {dateError}
                    </div>
                  )}

                  <div className={styles.buttonRow}>
                    <button
                      className={styles.primaryBtn}
                      disabled={!!dateError}
                      title={dateError || "Update"}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}

            {showToast && (
              <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
                <div className="toast show">
                  <div className="toast-body text-success text-center">
                    Updated Successfully!
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

export default ProgramEdit;
