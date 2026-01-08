// import React, { useState, useEffect, useRef } from "react";
// import apiConfig from "../../config/apiConfig";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum } from "../../apis/enum";

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

// const CreateProgram_registration = () => {
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
//   const apiUrl = apiConfig.getResourceUrl("Program_registration");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program_registration");

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
//       console.log("Data fetched:", data);
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

// useEffect(()=>{
//     const ff =async()=>{
//         if(resMetaData.length<=0)return;
//          const foreignFields = resMetaData[0].fieldValues.filter(
//         (field: any) => field.foreign
//       );
//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           const res= await fetchForeignData(
//             field.foreign,
//             field.name,
//             field.foreign_field
//           );
//         //   const resp= await res.json();
//           console.log("Data fetched in ss:",res)
//         }
//       }
//         // await fetchForeignData(
//         //            field.foreign,
//         //            field.name,
//         //            field.foreign_field
//         //          );
//     }
//     ff();
// },[resMetaData])

//   // ✅ useQuery only here
//   const {
//     data: metaData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["resMetaData","Program_registration1"],
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
//             queryKey: ["foreignData1", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//         //   await fetchForeignData(
//         //     field.foreign,
//         //     field.name,
//         //     field.foreign_field
//         //   );
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
//      refetchInterval: 5000,
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
//     <div>
//       <div>
//         <div
//           id="id-A9"
//           className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
//         >
//           <div className="border-0 fw-bold fs-3" id="id-AB">
//             Program_registration
//           </div>
//           <div className="border-0 fw-bold" id="id-AF">
//             program_id *
//           </div>
//           {(() => {
//             const options = foreignKeyData["Program"] || [];
//             const filteredOptions = options.filter((option) =>
//               option["id"]
//                 ?.toLowerCase()
//                 .includes((searchQueries["program_id"] || "").toLowerCase())
//             );
//             return (
//               <>
//                 <button
//                   className="btn btn-secondary dropdown-toggle"
//                   type="button"
//                   id={`dropdownMenu-${"program_id"}`}
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   {" "}
//                   {dataToSave["program_id"]
//                     ? options.find(
//                         (item) => item["id"] === dataToSave["program_id"]
//                       )?.["id"] || "Select"
//                     : `Select program_id`}{" "}
//                 </button>
//                 <div
//                   className="dropdown-menu"
//                   aria-labelledby={`dropdownMenu-${"program_id"}`}
//                 >
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     placeholder={"Search program_id"}
//                     value={searchQueries["program_id"] || ""}
//                     onChange={(e) =>
//                       handleSearchChange("program_id", e.target.value)
//                     }
//                   />{" "}
//                   {filteredOptions.length > 0 ? (
//                     filteredOptions.map((option, i) => (
//                       <button
//                         key={i}
//                         className="dropdown-item"
//                         type="button"
//                         onClick={() => {
//                           setDataToSave({
//                             ...dataToSave,
//                             ["program_id"]: option["id"],
//                           });
//                         }}
//                       >
//                         {" "}
//                         {option["id"]}{" "}
//                       </button>
//                     ))
//                   ) : (
//                     <span className="dropdown-item text-muted">
//                       {" "}
//                       No options available{" "}
//                     </span>
//                   )}{" "}
//                 </div>
//               </>
//             );
//           })()}
//           <div className="border-0 fw-bold" id="id-AL">
//             student_id *
//           </div>
//           {(() => {
//             const options = foreignKeyData["Student"] || [];
//             const filteredOptions = options.filter((option) =>
//               option["id"]
//                 ?.toLowerCase()
//                 .includes((searchQueries["student_id"] || "").toLowerCase())
//             );
//             return (
//               <>
//                 <button
//                   className="btn btn-secondary dropdown-toggle"
//                   type="button"
//                   id={`dropdownMenu-${"student_id"}`}
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   {" "}
//                   {dataToSave["student_id"]
//                     ? options.find(
//                         (item) => item["id"] === dataToSave["student_id"]
//                       )?.["id"] || "Select"
//                     : `Select student_id`}{" "}
//                 </button>
//                 <div
//                   className="dropdown-menu"
//                   aria-labelledby={`dropdownMenu-${"student_id"}`}
//                 >
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     placeholder={"Search student_id"}
//                     value={searchQueries["student_id"] || ""}
//                     onChange={(e) =>
//                       handleSearchChange("student_id", e.target.value)
//                     }
//                   />{" "}
//                   {filteredOptions.length > 0 ? (
//                     filteredOptions.map((option, i) => (
//                       <button
//                         key={i}
//                         className="dropdown-item"
//                         type="button"
//                         onClick={() => {
//                           setDataToSave({
//                             ...dataToSave,
//                             ["student_id"]: option["id"],
//                           });
//                         }}
//                       >
//                         {" "}
//                         {option["id"]}{" "}
//                       </button>
//                     ))
//                   ) : (
//                     <span className="dropdown-item text-muted">
//                       {" "}
//                       No options available{" "}
//                     </span>
//                   )}{" "}
//                 </div>
//               </>
//             );
//           })()}
//           <button className="btn btn-success" id="id-AP" onClick={handleCreate}>
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
//   );
// };

// export default CreateProgram_registration;


// import React, { useState } from "react";
// import apiConfig from "../../config/apiConfig";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";

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

// const CreateProgram_registration = () => {
//   const queryClient = useQueryClient();

//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [showToast, setShowToast] = useState(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

//   const apiUrl = apiConfig.getResourceUrl("Program_registration");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program_registration");

//   // ---------------------------------------------------
//   // FETCH METADATA
//   // ---------------------------------------------------
//   useQuery({
//     queryKey: ["ProgramRegMeta"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl);
//       return res.json();
//     },
//   });

//   // ---------------------------------------------------
//   // FETCH STUDENT RESOURCE & store in cache
//   // ---------------------------------------------------

//   useQuery({
//     queryKey: ["StudentList"],
//     queryFn: async () => {
//       const data = await fetchForeignResource("Student"); // your API helper
//       const formatted = Array.isArray(data) ? data : data.resource || [];
//       return formatted;
//     },
//     staleTime: 5 * 60 * 1000, // cache 5 min
//   });

//   // ---------------------------------------------------
//   // UNIVERSAL DROPDOWN FOR ALL RESOURCES
//   // ---------------------------------------------------
//   const Dropdown = ({ label, field, cacheKey }: any) => {
//     const [open, setOpen] = useState(false);

//     // GET FROM CACHE
//     const cachedList = queryClient.getQueryData([cacheKey]) || [];
//     const options = Array.isArray(cachedList) ? cachedList : [];

//     const filtered = options.filter((o: any) =>
//       (o.name || o.id)
//         ?.toLowerCase()
//         .includes((searchQueries[field] || "").toLowerCase())
//     );

//     return (
//       <div style={{ marginBottom: "20px", position: "relative" }}>
//         <label style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
//           {label} *
//         </label>

//         {/* Dropdown box */}
//         <div
//           onClick={() => setOpen(!open)}
//           style={{
//             width: "100%",
//             padding: "10px 12px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             backgroundColor: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           {dataToSave[field]
//             ? options.find((x: any) => x.id === dataToSave[field])?.name ||
//               options.find((x: any) => x.id === dataToSave[field])?.id
//             : `Select ${label}`}
//         </div>

//         {/* Dropdown menu */}
//         {open && (
//           <div
//             style={{
//               width: "100%",
//               maxHeight: "180px",
//               overflowY: "auto",
//               background: "#fff",
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//               padding: "8px",
//               position: "absolute",
//               zIndex: 20,
//             }}
//           >
//             {/* Search box */}
//             <input
//               placeholder="Search..."
//               value={searchQueries[field] || ""}
//               onChange={(e) =>
//                 setSearchQueries({ ...searchQueries, [field]: e.target.value })
//               }
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "8px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//               }}
//             />

//             {filtered.map((opt: any, i: number) => (
//               <div
//                 key={i}
//                 onClick={() => {
//                   setDataToSave({ ...dataToSave, [field]: opt.id });
//                   setOpen(false);
//                 }}
//                 style={{ padding: "8px 10px", cursor: "pointer" }}
//               >
//                 {opt.name || opt.id}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ---------------------------------------------------
//   // SUBMIT HANDLER
//   // ---------------------------------------------------
//   const handleCreate = async () => {
//     const params = new FormData();
//     params.append("resource", btoa(JSON.stringify(dataToSave)));

//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${getCookie("access_token")}` },
//       credentials: "include",
//       body: params,
//     });

//     if (res.ok) {
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       setDataToSave({});
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-start mt-5">
//       <form
//         style={{
//           width: "100%",
//           maxWidth: "550px",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           padding: "30px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <div
//           style={{
//             background: "linear-gradient(135deg, #007bff, #0056d2)",
//             color: "white",
//             textAlign: "center",
//             padding: "14px",
//             borderRadius: "10px",
//             fontSize: "22px",
//             marginBottom: "25px",
//           }}
//         >
//           Program Registration
//         </div>

//         {/* Program dropdown */}
//         <Dropdown label="Program" field="program_id" cacheKey="ProgramList" />

//         {/* Student dropdown (now works) */}
//         <Dropdown label="Student" field="student_id" cacheKey="StudentList" />

//         <button
//           type="button"
//           onClick={handleCreate}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: 600,
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Submit
//         </button>

//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show shadow">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//               </div>
//               <div className="toast-body text-success text-center">
//                 Created Successfully!
//               </div>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CreateProgram_registration;

// import React, { useContext, useEffect, useState } from "react";
// import apiConfig from "../../config/apiConfig";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { LoginContext } from "../../context/LoginContext";
// import { authFetch } from "../../apis/authFetch";

// // safer base64 for unicode
// const base64Encode = (str: string) => window.btoa(unescape(encodeURIComponent(str)));

// const CreateProgram_registration = () => {
//   const queryClient = useQueryClient();
//   const { user } = useContext(LoginContext);

//   const userEmail = user?.email_id?.toLowerCase() || "";
//   const isStudent = String(user?.role || "").toLowerCase() === "student";

//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [showToast, setShowToast] = useState(false);
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

//   // ✅ keep same endpoints you were using
//   const apiUrl = apiConfig.getResourceUrl("Program_registration");
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Program_registration");

//   // ---------------------------------------------------
//   // FETCH METADATA (kept as-is; optional)
//   // ---------------------------------------------------
//   useQuery({
//     queryKey: ["ProgramRegMeta"],
//     queryFn: async () => {
//       const res = await authFetch(metadataUrl, { method: "GET" });
//       return res.json();
//     },
//   });

//   // ---------------------------------------------------
//   // ✅ FETCH PROGRAM LIST (you were missing this earlier)
//   // ---------------------------------------------------
//   useQuery({
//     queryKey: ["ProgramList"],
//     queryFn: async () => {
//       const data = await fetchForeignResource("Program");
//       const formatted = Array.isArray(data) ? data : data.resource || [];
//       return formatted;
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   // ---------------------------------------------------
//   // FETCH STUDENT LIST (cache)
//   // ---------------------------------------------------
//   const { data: studentList } = useQuery({
//     queryKey: ["StudentList"],
//     queryFn: async () => {
//       const data = await fetchForeignResource("Student");
//       const formatted = Array.isArray(data) ? data : data.resource || [];
//       return formatted;
//     },
//     staleTime: 5 * 60 * 1000,
//     enabled: !!userEmail, // only when logged in
//   });

//   // ---------------------------------------------------
//   // ✅ AUTO SET student_id FOR LOGGED-IN STUDENT
//   // ---------------------------------------------------
//   useEffect(() => {
//     if (!isStudent) return;
//     if (!studentList || !userEmail) return;

//     const match = (studentList as any[]).find(
//       (s: any) => s.email?.toLowerCase() === userEmail
//     );

//     if (match?.id) {
//       setDataToSave((prev: any) => ({
//         ...prev,
//         student_id: match.id,
//       }));
//     } else {
//       console.warn("No Student found for logged-in email:", userEmail);
//     }
//   }, [isStudent, studentList, userEmail]);

//   // ---------------------------------------------------
//   // UNIVERSAL DROPDOWN (same as yours)
//   // ---------------------------------------------------
//   const Dropdown = ({ label, field, cacheKey }: any) => {
//     const [open, setOpen] = useState(false);

//     // GET FROM CACHE
//     const cachedList = queryClient.getQueryData([cacheKey]) || [];
//     const options = Array.isArray(cachedList) ? cachedList : [];

//     const filtered = options.filter((o: any) =>
//       (o.name || o.program_name || o.id)
//         ?.toLowerCase()
//         .includes((searchQueries[field] || "").toLowerCase())
//     );

//     const selectedLabel =
//       dataToSave[field] &&
//       (options.find((x: any) => x.id === dataToSave[field])?.name ||
//         options.find((x: any) => x.id === dataToSave[field])?.program_name ||
//         options.find((x: any) => x.id === dataToSave[field])?.id);

//     return (
//       <div style={{ marginBottom: "20px", position: "relative" }}>
//         <label style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
//           {label} *
//         </label>

//         <div
//           onClick={() => setOpen(!open)}
//           style={{
//             width: "100%",
//             padding: "10px 12px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             backgroundColor: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           {selectedLabel || `Select ${label}`}
//         </div>

//         {open && (
//           <div
//             style={{
//               width: "100%",
//               maxHeight: "180px",
//               overflowY: "auto",
//               background: "#fff",
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//               padding: "8px",
//               position: "absolute",
//               zIndex: 20,
//             }}
//           >
//             <input
//               placeholder="Search..."
//               value={searchQueries[field] || ""}
//               onChange={(e) =>
//                 setSearchQueries({ ...searchQueries, [field]: e.target.value })
//               }
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "8px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//               }}
//             />

//             {filtered.map((opt: any, i: number) => (
//               <div
//                 key={i}
//                 onClick={() => {
//                   setDataToSave({ ...dataToSave, [field]: opt.id });
//                   setOpen(false);
//                 }}
//                 style={{ padding: "8px 10px", cursor: "pointer" }}
//               >
//                 {opt.name || opt.program_name || opt.id}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ---------------------------------------------------
//   // SUBMIT HANDLER
//   // ---------------------------------------------------
//   const handleCreate = async () => {
//     if (!dataToSave.program_id) {
//       alert("Please select a program");
//       return;
//     }

//     if (!dataToSave.student_id) {
//       alert("Student id not set. Please login again.");
//       return;
//     }

//     const params = new FormData();
//     params.append("resource", base64Encode(JSON.stringify(dataToSave)));

//     const res = await authFetch(apiUrl, {
//       method: "POST",
//       body: params,
//       // authFetch already adds credentials + token (if your authFetch is set that way)
//     });

//     if (res.ok) {
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);

//       // Keep student_id for student user; reset only program
//       setDataToSave((prev: any) => ({
//         student_id: prev.student_id,
//         program_id: "",
//       }));
//     } else {
//       const t = await res.text();
//       console.error("Create failed:", res.status, t);
//       alert("Failed to register. Check console.");
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-start mt-5">
//       <form
//         style={{
//           width: "100%",
//           maxWidth: "550px",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           padding: "30px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <div
//           style={{
//             background: "linear-gradient(135deg, #007bff, #0056d2)",
//             color: "white",
//             textAlign: "center",
//             padding: "14px",
//             borderRadius: "10px",
//             fontSize: "22px",
//             marginBottom: "25px",
//           }}
//         >
//           Program Registration
//         </div>

//         {/* Program dropdown */}
//         <Dropdown label="Program" field="program_id" cacheKey="ProgramList" />

//         {/* ✅ Student: auto for student role, dropdown only for non-student */}
//         {isStudent ? (
//           <>
//             <input type="hidden" value={dataToSave.student_id || ""} />
//             <div style={{ marginBottom: "20px" }}>
//               <label style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
//                 Student *
//               </label>
//               <div
//                 style={{
//                   width: "100%",
//                   padding: "10px 12px",
//                   borderRadius: "8px",
//                   border: "1px solid #ccc",
//                   backgroundColor: "#f6f7f9",
//                   color: "#333",
//                 }}
//               >
//                 Auto selected (logged in user)
//               </div>
//             </div>
//           </>
//         ) : (
//           <Dropdown label="Student" field="student_id" cacheKey="StudentList" />
//         )}

//         <button
//           type="button"
//           onClick={handleCreate}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: 600,
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//           disabled={isStudent && !dataToSave.student_id}
//         >
//           Submit
//         </button>

//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show shadow">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//               </div>
//               <div className="toast-body text-success text-center">
//                 Created Successfully!
//               </div>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CreateProgram_registration;
import React, { useEffect, useMemo, useState, useContext } from "react";
import apiConfig from "../../config/apiConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { LoginContext } from "../../context/LoginContext";

type Program = {
  id: string;
  name?: string;
  seats?: number; // backend Long comes as number in JSON
};

type Student = {
  id: string;
  name?: string;
  roll_no?: string;
  email?: string;
};

type ProgramRegistration = {
  id: string;
  program_id: string;
  student_id: string;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const CreateProgram_registration = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(LoginContext);

  const userEmail = user?.email_id?.toLowerCase() || "";

  const [dataToSave, setDataToSave] = useState<{ program_id?: string; student_id?: string }>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const apiUrl = apiConfig.getResourceUrl("Program_registration");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Program_registration");

  // -----------------------------
  // 1) Metadata (optional)
  // -----------------------------
  useQuery({
    queryKey: ["ProgramRegMeta"],
    queryFn: async () => {
      const res = await fetch(metadataUrl);
      return res.json();
    },
  });

  // -----------------------------
  // 2) Programs
  // -----------------------------
  const programQuery = useQuery<Program[]>({
    queryKey: ["ProgramList"],
    queryFn: async () => {
      const data = await fetchForeignResource("Program");
      const list = Array.isArray(data) ? data : data.resource || [];
      return list as Program[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // -----------------------------
  // 3) Students (to find logged-in student_id)
  // -----------------------------
  const studentQuery = useQuery<Student[]>({
    queryKey: ["StudentList"],
    queryFn: async () => {
      const data = await fetchForeignResource("Student");
      const list = Array.isArray(data) ? data : data.resource || [];
      return list as Student[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userEmail,
  });

  const currentStudent = useMemo(() => {
    const students = studentQuery.data || [];
    return students.find((s) => (s.email || "").toLowerCase() === userEmail) || null;
  }, [studentQuery.data, userEmail]);

  // keep student_id always set (auto)
  useEffect(() => {
    if (currentStudent?.id) {
      setDataToSave((prev) => ({ ...prev, student_id: currentStudent.id }));
    }
  }, [currentStudent?.id]);

  // -----------------------------
  // 4) All registrations (to compute availability + prevent duplicates)
  // -----------------------------
  const regQuery = useQuery<ProgramRegistration[]>({
    queryKey: ["ProgramRegistrationList"],
    queryFn: async () => {
      const data = await fetchForeignResource("program_registration");
      const list = Array.isArray(data) ? data : data.resource || [];
      return list as ProgramRegistration[];
    },
    staleTime: 30 * 1000,
  });

  // Map: programId -> registration count
  const registrationCountMap = useMemo(() => {
    const map = new Map<string, number>();
    (regQuery.data || []).forEach((r) => {
      map.set(r.program_id, (map.get(r.program_id) || 0) + 1);
    });
    return map;
  }, [regQuery.data]);

  const programs = programQuery.data || [];

  const getAvailableSeats = (programId?: string) => {
    if (!programId) return null;
    const p = programs.find((x) => x.id === programId);
    if (!p) return null;
    const total = Number(p.seats ?? 0);
    const used = registrationCountMap.get(programId) || 0;
    return Math.max(0, total - used);
  };

  const selectedAvailable = getAvailableSeats(dataToSave.program_id);
  const selectedTotal = useMemo(() => {
    const p = programs.find((x) => x.id === dataToSave.program_id);
    return p ? Number(p.seats ?? 0) : null;
  }, [programs, dataToSave.program_id]);

  const alreadyRegistered = useMemo(() => {
    if (!dataToSave.program_id || !currentStudent?.id) return false;
    return (regQuery.data || []).some(
      (r) => r.program_id === dataToSave.program_id && r.student_id === currentStudent.id
    );
  }, [regQuery.data, dataToSave.program_id, currentStudent?.id]);

  // -----------------------------
  // Dropdown (Program)
  // -----------------------------
  const ProgramDropdown = ({ label, field }: { label: string; field: "program_id" }) => {
    const [open, setOpen] = useState(false);

    const filtered = programs.filter((p) =>
      (p.name || p.id)
        .toLowerCase()
        .includes((searchQueries[field] || "").toLowerCase())
    );

    const selectedProgram = programs.find((x) => x.id === dataToSave[field]);

    return (
      <div style={{ marginBottom: "18px", position: "relative" }}>
        <label style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
          {label} *
        </label>

        <div
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          {selectedProgram ? (selectedProgram.name || selectedProgram.id) : `Select ${label}`}
        </div>

        {open && (
          <div
            style={{
              width: "100%",
              maxHeight: "220px",
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "8px",
              position: "absolute",
              zIndex: 20,
              marginTop: 6,
            }}
          >
            <input
              placeholder="Search..."
              value={searchQueries[field] || ""}
              onChange={(e) => setSearchQueries({ ...searchQueries, [field]: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            {filtered.map((p) => {
              const total = Number(p.seats ?? 0);
              const used = registrationCountMap.get(p.id) || 0;
              const avail = Math.max(0, total - used);
              const isFull = avail <= 0;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (isFull) return; // don't allow selecting full program
                    setDataToSave({ ...dataToSave, [field]: p.id });
                    setOpen(false);
                  }}
                  style={{
                    padding: "10px 10px",
                    cursor: isFull ? "not-allowed" : "pointer",
                    opacity: isFull ? 0.5 : 1,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                  title={isFull ? "Program is full" : ""}
                >
                  <span>{p.name || p.id}</span>
                  <span style={{ fontWeight: 700 }}>
                    {isFull ? "FULL" : `${avail}/${total}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleCreate = async () => {
    // basic validation
    if (!dataToSave.program_id) {
      setToast({ type: "error", message: "Please select a program." });
      return;
    }
    if (!currentStudent?.id) {
      setToast({ type: "error", message: "Student not found for logged-in user." });
      return;
    }

    // client-side duplicate prevention (fast feedback)
    if (alreadyRegistered) {
      setToast({ type: "error", message: "You are already registered for this program." });
      return;
    }

    // client-side seat check (fast feedback)
    const avail = getAvailableSeats(dataToSave.program_id);
    if (avail !== null && avail <= 0) {
      const msg = `Registration failed: Program is full. Available seats: 0/${selectedTotal ?? "?"}`;
      setToast({ type: "error", message: msg });
      return;
    }

    const payload = {
      program_id: dataToSave.program_id,
      student_id: currentStudent.id, // force correct student_id
    };

    const params = new FormData();
    params.append("resource", btoa(JSON.stringify(payload)));

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${getCookie("access_token")}` },
      credentials: "include",
      body: params,
    });

    // backend may return JSON for both ok & error cases
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      // ignore
    }

    const backendMessage = json?.message || (res.ok ? "Created Successfully!" : "Request failed.");

    // treat errCode -1 as error even if HTTP 200
    const isBackendError = json?.errCode === -1 || !res.ok;

    if (isBackendError) {
      // also show seats if we can compute them
      const availNow = getAvailableSeats(dataToSave.program_id) ?? "N/A";
      const totalNow = selectedTotal ?? "N/A";

      const msg =
        backendMessage.includes("Program is full")
          ? `${backendMessage} Available seats: ${availNow}/${totalNow}`
          : backendMessage;

      setToast({ type: "error", message: msg });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["ProgramRegistrationList"] });
    await queryClient.invalidateQueries({ queryKey: ["ProgramList"] });

    setToast({ type: "success", message: "Registered successfully!" });
    setDataToSave({}); // will re-set student_id via effect

    // refresh availability + tables
    queryClient.invalidateQueries({ queryKey: ["ProgramRegistrationList"] });
    queryClient.invalidateQueries({ queryKey: ["resourceData", "program_registration"] });
    queryClient.invalidateQueries({ queryKey: ["ProgramList"] });

    // auto-hide toast
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5">
      <form
        style={{
          width: "100%",
          maxWidth: "550px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #007bff, #0056d2)",
            color: "white",
            textAlign: "center",
            padding: "14px",
            borderRadius: "10px",
            fontSize: "22px",
            marginBottom: "25px",
          }}
        >
          Course Registration
        </div>

        {/* Program dropdown */}
        <ProgramDropdown label="Course" field="program_id" />

        {/* Live availability text */}
        {dataToSave.program_id && selectedAvailable !== null && (
          <div
            style={{
              marginTop: "-6px",
              marginBottom: "14px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: selectedAvailable > 0 ? "#eef7ff" : "#fff0f0",
              border: selectedAvailable > 0 ? "1px solid #b9dcff" : "1px solid #ffb9b9",
              fontWeight: 700,
            }}
          >
            Seats available right now: {selectedAvailable}/{selectedTotal ?? "?"}
          </div>
        )}

        {/* Student auto-selected */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
            Student *
          </label>
          <input
            disabled
            value={
              currentStudent
                ? `Auto selected (${currentStudent.roll_no || currentStudent.name || currentStudent.id})`
                : "Auto selected (logged in user)"
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#f4f4f4",
              color: "#444",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleCreate}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        {/* Toast popup */}
        {toast && (
          <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
            <div className="toast show shadow">
              <div className="toast-header">
                <strong className="me-auto">
                  {toast.type === "success" ? "Success" : "Error"}
                </strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setToast(null)}
                />
              </div>
              <div
                className="toast-body text-center"
                style={{
                  color: toast.type === "success" ? "#198754" : "#dc3545",
                  fontWeight: 600,
                }}
              >
                {toast.message}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProgram_registration;
