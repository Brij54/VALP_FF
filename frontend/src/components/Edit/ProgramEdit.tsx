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


import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserIdFromJWT, useProgramViewModel } from "../viewModels/useProgramViewModel";
import Sidebar from "../Utils/SidebarAdmin";   // ✅ SIDEBAR ADDED
import "../Batch_Config.css";                 // ✅ SAME UI CSS

const ProgramEdit = () => {

  const navigate = useNavigate();
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Program");
  const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Program")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [resMetaData, setResMetaData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const { appId }: any = useParams<any>();

  const {
    fields,
    setFields,
    enums,
    setEnums,
    foreignKeyData,
    setForeignKeyData,
  } = useProgramViewModel(getUserIdFromJWT(), appId);

  const fetchDataById = async (id: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useQuery({
    queryKey: ["getById", id],
    queryFn: () => fetchDataById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (fetchedDataById?.resource?.length > 0) {
      setEditedRecord(
        Object.fromEntries(
          Object.entries(fetchedDataById.resource[0]).filter(
            ([key]) => !regex.test(key)
          )
        )
      );
    }
  }, [fetchedDataById]);

  useQuery({
    queryKey: ["resMetaData", "programEdit"],
    queryFn: async () => {
      const res = await fetch(metadataUrl);
      const data = await res.json();
      setResMetaData(data);
      setFields(data[0].fieldValues);

      for (const field of data[0].fieldValues.filter((f: any) => f.foreign)) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);
          const d = await fetchForeignResource(field.foreign);
          setForeignKeyData((prev: any) => ({ ...prev, [field.foreign]: d }));
        }
      }

      for (const field of data[0].fieldValues.filter((f: any) => f.isEnum)) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);
          const d = await fetchEnum(field.possible_value);
          setEnums((prev: any) => ({ ...prev, [field.possible_value]: d }));
        }
      }

      return data;
    },
  });

  const handleEdit = (field: string, value: any) => {
    setEditedRecord((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new FormData();
    const fileKey = Object.keys(editedRecord).find(
      (k) => editedRecord[k] instanceof File
    );

    if (fileKey) {
      params.append("file", editedRecord[fileKey]);
      editedRecord[fileKey] = "";
    }

    params.append(
      "resource",
      btoa(unescape(encodeURIComponent(JSON.stringify(editedRecord))))
    );
    params.append("action", "MODIFY");

    const accessToken = getCookie("access_token");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
      body: params,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => {
        navigate("/valpcourses");  // ✅ navigate added
      }, 1000);
    }
  };

  /* ================= UI ONLY ================= */

  return (
    <div className="page12Container">
      {/* ✅ SIDEBAR */}
      <Sidebar
        sidebarCollapsed={false}
        toggleSidebar={() => {}}
        activeSection="dashboard"
      />

      <main className="mainContent">
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Course</h1>
        </header>

        {!loadingEditComp && (
          <form
            className="w-100"
            style={{
              maxWidth: "500px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "60px 10px",
              margin: "100px auto",
            }}
          >
            <div className="card shadow-sm border-0 rounded">
              <div
                className="card-header text-white text-center fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #007bff, #0056d2)",
                  padding: "15px",
                  fontSize: "20px",
                }}
              >
                Edit Course Details
              </div>

              <div className="card-body p-4">
                <label className="fw-bold mb-1">Course Name *</label>
                <input
                  className="form-control mb-3"
                  value={editedRecord.name || ""}
                  onChange={(e) => handleEdit("name", e.target.value)}
                />

                <label className="fw-bold mb-1">Seats *</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  value={editedRecord.seats || ""}
                  onChange={(e) => handleEdit("seats", e.target.value)}
                />

                <label className="fw-bold mb-1">Instructor Name *</label>
                <input
                  className="form-control mb-3"
                  value={editedRecord.instructor_name || ""}
                  onChange={(e) =>
                    handleEdit("instructor_name", e.target.value)
                  }
                />

                <label className="fw-bold mb-1">Term Name *</label>
                <input
                  className="form-control mb-3"
                  value={editedRecord.term_name || ""}
                  onChange={(e) => handleEdit("term_name", e.target.value)}
                />

                <label className="fw-bold mb-1">Academic Year *</label>
                <select
                  className="form-control mb-3"
                  value={editedRecord.academic_year_id || ""}
                  onChange={(e) =>
                    handleEdit("academic_year_id", e.target.value)
                  }
                >
                  <option value="">Select Academic Year</option>
                  {(foreignKeyData["Academic_year"] || []).map((y: any) => (
                    <option key={y.id} value={y.id}>
                      {y.id}
                    </option>
                  ))}
                </select>

                <label className="fw-bold mb-1">Upload Syllabus</label>
                <input
                  type="file"
                  className="form-control mb-4"
                  onChange={(e) =>
                    handleEdit("syllabus", e.target.files?.[0] || null)
                  }
                />

                <button
                  className="btn btn-success w-100 fw-semibold"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        )}

        {showToast && (
          <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
            <div className="toast show shadow">
              <div className="toast-header">
                <strong className="me-auto">Success</strong>
              </div>
              <div className="toast-body text-success text-center">
                Updated Successfully!
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgramEdit;
