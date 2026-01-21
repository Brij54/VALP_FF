// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import apiConfig from '../../config/apiConfig';
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeAlpine,
//   themeBalham
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from '@tanstack/react-query';

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface ColumnDef {
//   field: string;
//   headerName: string;
//   editable: boolean;
//   resizable: boolean;
//   sortable: boolean;
//   filter: boolean;
//   cellRenderer?: (params: any) => React.ReactNode;
// }

// // Define the custom cell renderer for the action column
// const ActionCellRenderer = (props:any) => {
//   const handleEdit = () => {
//     props.context.handleUpdate(props.data.id);
//   };

//   return (
//     <button onClick={handleEdit} className="btn btn-primary">
//       Edit
//     </button>
//   );
// };

// export type ResourceMetaData = {
//   "resource": string,
//   "fieldValues": any[]
// }
// const getCookie = (name: string): string | null => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//     return null;
//   };
  
//   const UpdateProgram_registration = () => {
//    const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl('program_registration')}?`
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Program_registration')}?`
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//    const [currentUrl, setCurrentUrl] = useState('');
//     // Fetch resource data
//     const {data:dataRes,isLoading:isLoadingDataRes,error:errorDataRes}= useQuery({
//     queryKey: ['resourceData', 'program_registration'],
//      queryFn: async () => {
//       const params = new URLSearchParams();
    
//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);
//        const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     throw new Error("Access token not found");
//   }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl('program_registration')}?` + params.toString(),
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${accessToken}`, // Add token here
//           },
//           credentials: "include", // include cookies if needed
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       setFetchedData(data.resource || []);
//        const initialEditedData = fetchData.reduce((acc: any, item: any) => {
//             acc[item.id] = { ...item };
//             return acc;
//              }, {});
//       return data;
//     },
//   })
  
//     // Fetch metadata
//     const {data: dataResMeta,isLoading:isLoadingDataResMeta,error:errorDataResMeta} = useQuery({
//     queryKey: ['resourceMetaData', 'program_registration'],
//    queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl('program_registration')}?`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);
//       const required = data[0]?.fieldValues
//         .filter((field: any) => !regex.test(field.name))
//         .map((field: any) => field.name);
//       setRequiredFields(required || []);
//       return data;
//     },
//   });
  
//     const handleEdit = (id: any, field: string, value: string) => {
//       setEditedData((prevData: any) => ({
//         ...prevData,
//         [id]: {
//           ...(prevData[id] || {}),
//           [field]: value,
//         },
//       }));
//     };
  
//     const handleUpdate = async (id: any) => {

//     navigate(`/edit/program_registration/${id}`);
// };
    
//   useEffect(() => {
//     const data = fetchData || [];
//     const fields = requiredFields.filter(field => field !== 'id') || [];
    
//     const columns = fields.map(field => ({
//       field: field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true
//     }));
    
//     // Add the Action column with the custom cell renderer
//     columns.push({
//       headerName: 'Action',
//       field: 'Action',
//       cellRenderer: ActionCellRenderer,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 120
//     } as ColumnDef)
//     setColDef1(columns);
//     setRowData(data);
//   }, [fetchData, requiredFields]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   }; 
   

// return (
//     <div>
       

// <div className="">
//     {rowData.length === 0 && colDef1.length === 0 ? (
//       <div>No data available. Please add a resource attribute.</div>
//     ) : (
//       <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={colDef1}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={10}
//           animateRows={true}
//           rowSelection="multiple"
//           context={{
//             handleUpdate: handleUpdate
//           }}
//         />
//       </div>
//     )}
//   </div>

//   {showToast && (
//     <div
//       className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//       style={{ zIndex: 1550 }}
//     >
//       <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//         <div className="toast-header">
//           <strong className="me-auto">Success</strong>
//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="toast"
//             aria-label="Close"
//             onClick={() => setShowToast(false)}
//           ></button>
//         </div>
//         <div className="toast-body text-success text-center">Created successfully!</div>
//       </div>
//     </div>
// ) }

// </div>
// )


// };

// export default UpdateProgram_registration;
// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";
// import { fetchForeignResource } from "../../apis/resources";

// ModuleRegistry.registerModules([AllCommunityModule]);

// // -------------------- ACTION RENDERER (DELETE) --------------------
// const ActionCellRenderer = (props: any) => {
//   const handleDelete = () => props.context.handleDelete(props.data.id);

//   return (
//     <button
//       onClick={handleDelete}
//       className="btn btn-danger"
//       style={{
//         fontSize: "14px",
//         padding: "6px 16px",
//         borderRadius: "8px",
//         fontWeight: 600,
//       }}
//     >
//       Delete
//     </button>
//   );
// };

// const UpdateProgram_registration = () => {
//   const navigate = useNavigate(); // (kept in case you later add edit navigation)
//   const queryClient = useQueryClient();

//   // 1) Fetch registrations
//   const regQuery = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );
//       if (!res.ok) throw new Error("Failed to fetch program registrations");
//       return res.json();
//     },
//   });

//   // 2) Fetch programs (for name mapping)
//   const programQuery = useQuery({
//     queryKey: ["foreign", "Program"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Program");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   // 3) Fetch students (for name/roll mapping)
//   const studentQuery = useQuery({
//     queryKey: ["foreign", "Student"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Student");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   // 4) Build enriched rowData (program_id -> program_name, student_id -> student_name/roll_no)
//   type StudentInfo = { name: string; roll_no: string };

//   const rowData = useMemo(() => {
//     const json = regQuery.data;
//     const regs: any[] = Array.isArray(json) ? json : json?.resource || [];

//     const programs: any[] = (programQuery.data as any[]) || [];
//     const students: any[] = (studentQuery.data as any[]) || [];

//     const programMap = new Map<string, string>(
//       programs.map((p: any) => [
//         String(p.id),
//         String(p.program_name || p.name || p.id),
//       ])
//     );

//     const studentMap = new Map<string, StudentInfo>(
//       students.map((s: any) => [
//         String(s.id),
//         {
//           name: String(s.name || s.id),
//           roll_no: String(s.roll_no || ""),
//         },
//       ])
//     );

//     return regs.map((r: any) => {
//       const stu = studentMap.get(String(r.student_id)); // StudentInfo | undefined

//       return {
//         ...r,
//         program_name: programMap.get(String(r.program_id)) || r.program_id,
//         student_name: stu?.name || r.student_id,
//         roll_no: stu?.roll_no || "",
//       };
//     });
//   }, [regQuery.data, programQuery.data, studentQuery.data]);

//   // -------------------- DELETE HANDLER --------------------
//   const handleDelete = async (id: any) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to remove this student from this program?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const payload = { id };

//       const formData = new FormData();
//       const jsonString = JSON.stringify(payload);
//       const base64 = btoa(unescape(encodeURIComponent(jsonString)));

//       formData.append("resource", base64);
//       formData.append("action", "DELETE");

//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Delete failed: " + res.status);
//       }

//       // Refresh list from backend
//       await queryClient.invalidateQueries({
//         queryKey: ["resourceData", "program_registration"],
//       });

//       alert("Registration deleted successfully.");
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Failed to delete registration. Please try again.");
//     }
//   };

//   // 5) Column definitions (manual and stable)
//   const colDefs: ColDef[] = useMemo(() => {
//     return [
//       {
//         headerName: "Course",
//         field: "program_name",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Roll No",
//         field: "roll_no",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Student",
//         field: "student_name",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Action",
//         field: "action",
//         cellRenderer: ActionCellRenderer,
//         sortable: false,
//         filter: false,
//         width: 140,
//       },
//     ];
//   }, []);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 150,
//     editable: false,
//   };

//   if (regQuery.isLoading || programQuery.isLoading || studentQuery.isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (regQuery.isError) return <div>Error loading registrations.</div>;

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         defaultColDef={defaultColDef}
//         pagination
//         paginationPageSize={10}
//         animateRows
//         context={{ handleDelete }}
//       />
//     </div>
//   );
// };

// export default UpdateProgram_registration;


// import React, { useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";
// import { fetchForeignResource } from "../../apis/resources";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// ModuleRegistry.registerModules([AllCommunityModule]);

// /* ===================== TOKEN + ROLE UTILS ===================== */

// const getAccessToken = (): string | null =>
//   Cookies.get("access_token") || Cookies.get("token") || null;

// const getUserRoles = (): string[] => {
//   const token = getAccessToken();
//   if (!token) return [];

//   const decoded: any = jwtDecode(token);
//   const roles =
//     decoded?.resource_access?.["backend-api"]?.roles || [];

//   return roles.map((r: string) => r.toUpperCase());
// };

// /* ===================== ACTION CELL ===================== */

// const ActionCellRenderer = (props: any) => {
//   const { handleDelete, isAdmin } = props.context;
//   const { id, courseStarted } = props.data;

//   const canDrop = isAdmin || !courseStarted;

//   return (
//     <button
//       onClick={() => handleDelete(id)}
//       disabled={!canDrop}
//       className="btn btn-danger"
//       style={{
//         fontSize: "14px",
//         padding: "6px 16px",
//         borderRadius: "8px",
//         fontWeight: 600,
//         opacity: canDrop ? 1 : 0.4,
//         cursor: canDrop ? "pointer" : "not-allowed",
//       }}
//       title={
//         canDrop
//           ? "Un-enrol from course"
//           : "Course has already started. Students cannot drop."
//       }
//     >
//       Drop
//     </button>
//   );
// };

// /* ===================== MAIN COMPONENT ===================== */

// const UpdateProgram_registration = () => {
//   const queryClient = useQueryClient();

//   const roles = getUserRoles();
//   const isAdmin = roles.includes("ADMIN");
//   const isStudent = roles.includes("STUDENT");

//   /* ---------- FETCH REGISTRATIONS ---------- */
//   const regQuery = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
//         { method: "GET" }
//       );
//       if (!res.ok) throw new Error("Failed to fetch registrations");
//       return res.json();
//     },
//   });

//   /* ---------- FETCH PROGRAMS ---------- */
//   const programQuery = useQuery({
//     queryKey: ["foreign", "Program"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Program");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- FETCH STUDENTS ---------- */
//   const studentQuery = useQuery({
//     queryKey: ["foreign", "Student"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Student");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- BUILD ROW DATA ---------- */
//   type StudentInfo = { name: string; roll_no: string };

//   const rowData = useMemo(() => {
//     const regs: any[] = Array.isArray(regQuery.data)
//       ? regQuery.data
//       : regQuery.data?.resource || [];

//     const programs: any[] = programQuery.data || [];
//     const students: any[] = studentQuery.data || [];

//     const programMap = new Map<
//       string,
//       { name: string; startDate: Date }
//     >(
//       programs.map((p: any) => [
//         String(p.id),
//         {
//           name: String(p.program_name || p.name || p.id),
//           startDate: new Date(p.start_date),
//         },
//       ])
//     );

//     const studentMap = new Map<string, StudentInfo>(
//       students.map((s: any) => [
//         String(s.id),
//         {
//           name: String(s.name || s.id),
//           roll_no: String(s.roll_no || ""),
//         },
//       ])
//     );

//     const today = new Date();

//     return regs.map((r: any) => {
//       const stu = studentMap.get(String(r.student_id));
//       const prog = programMap.get(String(r.program_id));

//       const courseStarted =
//         prog?.startDate ? today >= prog.startDate : false;

//       return {
//         ...r,
//         program_name: prog?.name || r.program_id,
//         student_name: stu?.name || r.student_id,
//         roll_no: stu?.roll_no || "",
//         courseStarted, // 👈 used by ActionCell
//       };
//     });
//   }, [regQuery.data, programQuery.data, studentQuery.data]);

//   /* ---------- DROP (UN-ENROL) ---------- */
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Do you want to un-enrol from this course?")) return;

//     const payload = { id };
//     const formData = new FormData();
//     const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

//     formData.append("resource", base64);
//     formData.append("action", "DELETE");

//     await authFetch(apiConfig.getResourceUrl("program_registration"), {
//       method: "POST",
//       body: formData,
//     });

//     await queryClient.invalidateQueries({
//       queryKey: ["resourceData", "program_registration"],
//     });
//   };

//   /* ---------- COLUMNS ---------- */
//   const colDefs: ColDef[] = useMemo(
//     () => [
//       {
//         headerName: "Course",
//         field: "program_name",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Roll No",
//         field: "roll_no",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Student",
//         field: "student_name",
//         sortable: true,
//         filter: true,
//         resizable: true,
//       },
//       {
//         headerName: "Action",
//         cellRenderer: ActionCellRenderer,
//         sortable: false,
//         filter: false,
//         width: 180,
//       },
//     ],
//     []
//   );

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 150,
//     editable: false,
//   };

//   if (
//     regQuery.isLoading ||
//     programQuery.isLoading ||
//     studentQuery.isLoading
//   ) {
//     return <div>Loading...</div>;
//   }

//   if (regQuery.isError) {
//     return <div>Error loading registrations.</div>;
//   }

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         defaultColDef={defaultColDef}
//         pagination
//         paginationPageSize={10}
//         animateRows
//         overlayNoRowsTemplate={`<span style="color:#777;">No enrollments found</span>`}
//         context={{
//           handleDelete,
//           isAdmin,
//           isStudent,
//         }}
//       />
//     </div>
//   );
// };

// export default UpdateProgram_registration;


// import React, { useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";
// import { fetchForeignResource } from "../../apis/resources";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// ModuleRegistry.registerModules([AllCommunityModule]);

// /* ===================== TOKEN UTILS ===================== */

// const getAccessToken = (): string | null =>
//   Cookies.get("access_token") || Cookies.get("token") || null;

// const getDecodedToken = (): any => {
//   const token = getAccessToken();
//   return token ? jwtDecode(token) : null;
// };

// const getUserRoles = (): string[] => {
//   const decoded = getDecodedToken();
//   const roles =
//     decoded?.resource_access?.["backend-api"]?.roles || [];
//   return roles.map((r: string) => r.toUpperCase());
// };

// const getUserEmailFromToken = (): string | null => {
//   const decoded = getDecodedToken();
//   return decoded?.email?.toLowerCase() || null;
// };

// /* ===================== ACTION CELL ===================== */

// const ActionCellRenderer = (props: any) => {
//   const { handleDelete, isAdmin } = props.context;
//   const { id, courseStarted } = props.data;

//   const canDrop = isAdmin || !courseStarted;

//   return (
//     <button
//       onClick={() => handleDelete(id)}
//       disabled={!canDrop}
//       className="btn btn-danger"
//       style={{
//         fontSize: "13px",
//         padding: "6px 14px",
//         borderRadius: "8px",
//         fontWeight: 600,
//         opacity: canDrop ? 1 : 0.4,
//         cursor: canDrop ? "pointer" : "not-allowed",
//       }}
//       title={
//         canDrop
//           ? "Drop course"
//           : "Course already started. Students cannot drop."
//       }
//     >
//       Drop
//     </button>
//   );
// };

// /* ===================== MAIN COMPONENT ===================== */

// const UpdateProgram_registration = () => {
//   const queryClient = useQueryClient();

//   const roles = getUserRoles();
//   const isAdmin = roles.includes("ADMIN");
//   const isStudent = roles.includes("STUDENT");
//   const userEmail = getUserEmailFromToken(); // 🔑 FIX

//   /* ---------- FETCH STUDENTS ---------- */
//   const studentQuery = useQuery({
//     queryKey: ["foreign", "Student"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Student");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- MAP EMAIL → STUDENT ID ---------- */
//   const myStudentId = useMemo(() => {
//     if (!userEmail) return null;
//     const students = studentQuery.data || [];
//     const match = students.find(
//       (s: any) => s.email?.toLowerCase() === userEmail
//     );
//     return match?.id || null;
//   }, [studentQuery.data, userEmail]);

//   /* ---------- FETCH REGISTRATIONS ---------- */
//   const regQuery = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params}`,
//         { method: "GET" }
//       );
//       if (!res.ok) throw new Error("Failed to fetch registrations");
//       return res.json();
//     },
//     enabled: isAdmin || !!myStudentId,
//   });

//   /* ---------- FETCH PROGRAMS ---------- */
//   const programQuery = useQuery({
//     queryKey: ["foreign", "Program"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Program");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- BUILD ROW DATA ---------- */
//   const rowData = useMemo(() => {
//     const regs: any[] = Array.isArray(regQuery.data)
//       ? regQuery.data
//       : regQuery.data?.resource || [];

//     const programs: any[] = programQuery.data || [];
//     const students: any[] = studentQuery.data || [];

//     const programMap = new Map(
//       programs.map((p: any) => [
//         String(p.id),
//         {
//           name: p.program_name || p.name || p.id,
//           startDate: new Date(p.start_date),
//         },
//       ])
//     );

//     const studentMap = new Map(
//       students.map((s: any) => [
//         String(s.id),
//         { name: s.name, roll_no: s.roll_no },
//       ])
//     );

//     const today = new Date();

//     let filtered = regs;

//     // 🎯 STUDENT → ONLY OWN RECORDS
//     if (isStudent && myStudentId) {
//       filtered = regs.filter(
//         (r) => String(r.student_id) === String(myStudentId)
//       );
//     }

//     return filtered.map((r: any) => {
//       const prog = programMap.get(String(r.program_id));
//       const stu = studentMap.get(String(r.student_id));

//       const courseStarted =
//         prog?.startDate ? today >= prog.startDate : false;

//       return {
//         ...r,
//         program_name: prog?.name || r.program_id,
//         student_name: stu?.name || r.student_id,
//         roll_no: stu?.roll_no || "",
//         courseStarted,
//       };
//     });
//   }, [
//     regQuery.data,
//     programQuery.data,
//     studentQuery.data,
//     isStudent,
//     myStudentId,
//   ]);

//   /* ---------- DROP ---------- */
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Do you want to drop this course?")) return;

//     const payload = { id };
//     const formData = new FormData();
//     const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

//     formData.append("resource", base64);
//     formData.append("action", "DELETE");

//     await authFetch(apiConfig.getResourceUrl("program_registration"), {
//       method: "POST",
//       body: formData,
//     });

//     await queryClient.invalidateQueries({
//       queryKey: ["resourceData", "program_registration"],
//     });
//   };

//   /* ---------- COLUMNS ---------- */
//   const colDefs: ColDef[] = [
//     { headerName: "Course", field: "program_name", flex: 2 },
//     { headerName: "Roll No", field: "roll_no", flex: 1 },
//     { headerName: "Student", field: "student_name", flex: 2 },
//     {
//       headerName: "Action",
//       cellRenderer: ActionCellRenderer,
//       width: 160,
//     },
//   ];

//   if (
//     regQuery.isLoading ||
//     programQuery.isLoading ||
//     studentQuery.isLoading
//   ) {
//     return <div>Loading...</div>;
//   }

//   if (isStudent && !myStudentId) {
//     return <div>Student mapping not found for this user.</div>;
//   }

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         pagination
//         paginationPageSize={10}
//         animateRows
//         context={{ handleDelete, isAdmin }}
//       />
//     </div>
//   );
// };

// export default UpdateProgram_registration;

// import React, { useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";
// import { fetchForeignResource } from "../../apis/resources";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// ModuleRegistry.registerModules([AllCommunityModule]);

// /* ===================== TOKEN UTILS ===================== */

// const getAccessToken = (): string | null =>
//   Cookies.get("access_token") || Cookies.get("token") || null;

// const getDecodedToken = (): any => {
//   const token = getAccessToken();
//   return token ? jwtDecode(token) : null;
// };

// const getUserRoles = (): string[] => {
//   const decoded = getDecodedToken();
//   const roles =
//     decoded?.resource_access?.["backend-api"]?.roles || [];
//   return roles.map((r: string) => r.toUpperCase());
// };

// const getUserEmailFromToken = (): string | null => {
//   const decoded = getDecodedToken();
//   return decoded?.email?.toLowerCase() || null;
// };

// /* ===================== ACTION CELL ===================== */

// const ActionCellRenderer = (props: any) => {
//   const { handleDelete, isAdmin } = props.context;
//   const { id, courseEnded } = props.data;

//   const canDrop = isAdmin || !courseEnded;

//   return (
//     <button
//       onClick={() => handleDelete(id)}
//       disabled={!canDrop}
//       className="btn btn-danger"
//       style={{
//         fontSize: "13px",
//         padding: "6px 14px",
//         borderRadius: "8px",
//         fontWeight: 600,
//         opacity: canDrop ? 1 : 0.4,
//         cursor: canDrop ? "pointer" : "not-allowed",
//       }}
//       title={
//         canDrop
//           ? "Drop course"
//           : "Course has ended. Students cannot drop."
//       }
//     >
//       Drop
//     </button>
//   );
// };

// /* ===================== MAIN COMPONENT ===================== */

// const UpdateProgram_registration = () => {
//   const queryClient = useQueryClient();

//   const roles = getUserRoles();
//   const isAdmin = roles.includes("ADMIN");
//   const isStudent = roles.includes("STUDENT");
//   const userEmail = getUserEmailFromToken();

//   /* ---------- FETCH STUDENTS ---------- */
//   const studentQuery = useQuery({
//     queryKey: ["foreign", "Student"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Student");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- MAP EMAIL → STUDENT ID ---------- */
//   const myStudentId = useMemo(() => {
//     if (!userEmail) return null;
//     const students = studentQuery.data || [];
//     const match = students.find(
//       (s: any) => s.email?.toLowerCase() === userEmail
//     );
//     return match?.id || null;
//   }, [studentQuery.data, userEmail]);

//   /* ---------- FETCH REGISTRATIONS ---------- */
//   const regQuery = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params}`,
//         { method: "GET" }
//       );
//       if (!res.ok) throw new Error("Failed to fetch registrations");
//       return res.json();
//     },
//     enabled: isAdmin || !!myStudentId,
//   });

//   /* ---------- FETCH PROGRAMS ---------- */
//   const programQuery = useQuery({
//     queryKey: ["foreign", "Program"],
//     queryFn: async () => {
//       const data: any = await fetchForeignResource("Program");
//       return Array.isArray(data) ? data : data.resource || [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ---------- BUILD ROW DATA ---------- */
//   const rowData = useMemo(() => {
//     const regs: any[] = Array.isArray(regQuery.data)
//       ? regQuery.data
//       : regQuery.data?.resource || [];

//     const programs: any[] = programQuery.data || [];
//     const students: any[] = studentQuery.data || [];

//     const programMap = new Map(
//       programs.map((p: any) => [
//         String(p.id),
//         {
//           name: p.program_name || p.name || p.id,
//           endDate: p.end_date ? new Date(p.end_date) : null,
//         },
//       ])
//     );

//     const studentMap = new Map(
//       students.map((s: any) => [
//         String(s.id),
//         { name: s.name, roll_no: s.roll_no },
//       ])
//     );

//     const today = new Date();

//     let filtered = regs;

//     // 🎯 STUDENT → ONLY OWN RECORDS
//     if (isStudent && myStudentId) {
//       filtered = regs.filter(
//         (r) => String(r.student_id) === String(myStudentId)
//       );
//     }

//     return filtered.map((r: any) => {
//       const prog = programMap.get(String(r.program_id));
//       const stu = studentMap.get(String(r.student_id));

//       const courseEnded =
//         prog?.endDate ? today > prog.endDate : false;

//       return {
//         ...r,
//         program_name: prog?.name || r.program_id,
//         student_name: stu?.name || r.student_id,
//         roll_no: stu?.roll_no || "",
//         courseEnded,
//       };
//     });
//   }, [
//     regQuery.data,
//     programQuery.data,
//     studentQuery.data,
//     isStudent,
//     myStudentId,
//   ]);

//   /* ---------- DROP ---------- */
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Do you want to drop this course?")) return;

//     const payload = { id };
//     const formData = new FormData();
//     const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

//     formData.append("resource", base64);
//     formData.append("action", "DELETE");

//     await authFetch(apiConfig.getResourceUrl("program_registration"), {
//       method: "POST",
//       body: formData,
//     });

//     await queryClient.invalidateQueries({
//       queryKey: ["resourceData", "program_registration"],
//     });
//   };

//   /* ---------- COLUMNS ---------- */
//   const colDefs: ColDef[] = [
//     { headerName: "Course", field: "program_name", flex: 2 },
//     { headerName: "Roll No", field: "roll_no", flex: 1 },
//     { headerName: "Student", field: "student_name", flex: 2 },
//     {
//       headerName: "Action",
//       cellRenderer: ActionCellRenderer,
//       width: 160,
//     },
//   ];

//   if (
//     regQuery.isLoading ||
//     programQuery.isLoading ||
//     studentQuery.isLoading
//   ) {
//     return <div>Loading...</div>;
//   }

//   if (isStudent && !myStudentId) {
//     return <div>Student mapping not found for this user.</div>;
//   }

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         pagination
//         paginationPageSize={10}
//         animateRows
//         context={{ handleDelete, isAdmin }}
//       />
//     </div>
//   );
// };

// export default UpdateProgram_registration;


import React, { useMemo } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "../../apis/authFetch";
import { fetchForeignResource } from "../../apis/resources";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

ModuleRegistry.registerModules([AllCommunityModule]);

/* ===================== TOKEN UTILS ===================== */

const getAccessToken = (): string | null =>
  Cookies.get("access_token") || Cookies.get("token") || null;

const getDecodedToken = (): any => {
  const token = getAccessToken();
  return token ? jwtDecode(token) : null;
};

const getUserRoles = (): string[] => {
  const decoded = getDecodedToken();
  const roles =
    decoded?.resource_access?.["backend-api"]?.roles || [];
  return roles.map((r: string) => r.toUpperCase());
};

const getUserEmailFromToken = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.email?.toLowerCase() || null;
};

/* ===================== STATUS UTILS ===================== */

const getCourseStatus = (
  start?: string,
  end?: string
): "UPCOMING" | "ONGOING" | "COMPLETED" | "" => {
  if (!start || !end) return "";

  const today = new Date().setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);

  if (today < s) return "UPCOMING";
  if (today > e) return "COMPLETED";
  return "ONGOING";
};

const StatusCellRenderer = (props: any) => {
  const status = props.value || "";

  const color =
    status === "ONGOING"
      ? "green"
      : status === "COMPLETED"
      ? "red"
      : "#0d6efd";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "8px",
        color: "white",
        background: color,
        fontWeight: 600,
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
};

/* ===================== ACTION CELL ===================== */

const ActionCellRenderer = (props: any) => {
  const { handleDelete, isAdmin } = props.context;
  const { id, courseEnded } = props.data;

  const canDrop = isAdmin || !courseEnded;

  return (
    <button
      onClick={() => handleDelete(id)}
      disabled={!canDrop}
      className="btn btn-danger"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
        opacity: canDrop ? 1 : 0.4,
        cursor: canDrop ? "pointer" : "not-allowed",
      }}
      title={
        canDrop
          ? "Drop course"
          : "Course has ended. Students cannot drop."
      }
    >
      Drop
    </button>
  );
};

/* ===================== MAIN COMPONENT ===================== */

const UpdateProgram_registration = () => {
  const queryClient = useQueryClient();

  const roles = getUserRoles();
  const isAdmin = roles.includes("ADMIN");
  const isStudent = roles.includes("STUDENT");
  const userEmail = getUserEmailFromToken();

  /* ---------- FETCH STUDENTS ---------- */
  const studentQuery = useQuery({
    queryKey: ["foreign", "Student"],
    queryFn: async () => {
      const data: any = await fetchForeignResource("Student");
      return Array.isArray(data) ? data : data.resource || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  /* ---------- MAP EMAIL → STUDENT ID ---------- */
  const myStudentId = useMemo(() => {
    if (!userEmail) return null;
    const students = studentQuery.data || [];
    const match = students.find(
      (s: any) => s.email?.toLowerCase() === userEmail
    );
    return match?.id || null;
  }, [studentQuery.data, userEmail]);

  /* ---------- FETCH REGISTRATIONS ---------- */
  const regQuery = useQuery({
    queryKey: ["resourceData", "program_registration"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });
      const res = await authFetch(
        `${apiConfig.getResourceUrl("program_registration")}?${params}`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return res.json();
    },
    enabled: isAdmin || !!myStudentId,
  });

  /* ---------- FETCH PROGRAMS ---------- */
  const programQuery = useQuery({
    queryKey: ["foreign", "Program"],
    queryFn: async () => {
      const data: any = await fetchForeignResource("Program");
      return Array.isArray(data) ? data : data.resource || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  /* ---------- BUILD ROW DATA WITH STATUS ---------- */
  const rowData = useMemo(() => {
    const regs: any[] = Array.isArray(regQuery.data)
      ? regQuery.data
      : regQuery.data?.resource || [];

    const programs: any[] = programQuery.data || [];
    const students: any[] = studentQuery.data || [];

    const programMap = new Map(
      programs.map((p: any) => [
        String(p.id),
        {
          name: p.program_name || p.name,
          start: p.course_start_date,
          end: p.course_end_date,
        },
      ])
    );

    const studentMap = new Map(
      students.map((s: any) => [
        String(s.id),
        { name: s.name, roll_no: s.roll_no },
      ])
    );

    let filtered = regs;

    // 🎯 Student: Only own records
    if (isStudent && myStudentId) {
      filtered = regs.filter(
        (r) => String(r.student_id) === String(myStudentId)
      );
    }

    return filtered.map((r: any) => {
      const prog = programMap.get(String(r.program_id));
      const stu = studentMap.get(String(r.student_id));

      const status = getCourseStatus(prog?.start, prog?.end);

      return {
        ...r,
        program_name: prog?.name,
        student_name: stu?.name,
        roll_no: stu?.roll_no,
        status,
        courseEnded: status === "COMPLETED",
      };
    });
  }, [
    regQuery.data,
    programQuery.data,
    studentQuery.data,
    isStudent,
    myStudentId,
  ]);

  /* ---------- DROP ---------- */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Do you want to drop this course?")) return;

    const payload = { id };
    const formData = new FormData();
    const base64 = btoa(JSON.stringify(payload));

    formData.append("resource", base64);
    formData.append("action", "DELETE");

    await authFetch(apiConfig.getResourceUrl("program_registration"), {
      method: "POST",
      body: formData,
    });

    await queryClient.invalidateQueries({
      queryKey: ["resourceData", "program_registration"],
    });
  };

  /* ---------- COLUMNS ---------- */
  const colDefs: ColDef[] = [
    { headerName: "Course", field: "program_name", flex: 2 },
    { headerName: "Roll No", field: "roll_no", flex: 1 },
    { headerName: "Student", field: "student_name", flex: 2 },

    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      width: 150,
    },

    {
      headerName: "Action",
      cellRenderer: ActionCellRenderer,
      width: 160,
    },
  ];

  if (
    regQuery.isLoading ||
    programQuery.isLoading ||
    studentQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  if (isStudent && !myStudentId) {
    return <div>Student mapping not found for this user.</div>;
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination
        paginationPageSize={10}
        animateRows
        context={{ handleDelete, isAdmin }}
      />
    </div>
  );
};

export default UpdateProgram_registration;



