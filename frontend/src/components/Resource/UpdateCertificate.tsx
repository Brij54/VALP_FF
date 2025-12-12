// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";

// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// // -------------------- COOKIE --------------------
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// // -------------------- authFetch --------------------
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

//   const token = getCookie("access_token");
//   const headersObj = finalInit.headers as Record<string, string>;
//   if (token && !headersObj?.Authorization) {
//     headersObj.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(input, finalInit);

//   if (res.status === 401) {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/";
//     throw new Error("Unauthorized");
//   }

//   return res;
// }

// // -------------------- STATUS BADGE --------------------
// const getStatusBadge = (status: any) => {
//   const s = String(status).toLowerCase();

//   const badgeStyle: React.CSSProperties = {
//     fontSize: "14px",
//     padding: "6px 12px",
//     borderRadius: "8px",
//     display: "inline-block",
//     textAlign: "center",
//   };

//   if (s === "true") {
//     return (
//       <span className="badge bg-success text-white" style={badgeStyle}>
//         Approved
//       </span>
//     );
//   }

//   if (s === "false") {
//     return (
//       <span className="badge bg-danger text-white" style={badgeStyle}>
//         Rejected
//       </span>
//     );
//   }

//   return (
//     <span className="badge bg-warning text-dark" style={badgeStyle}>
//       Pending
//     </span>
//   );
// };

// // ✅ FILTER SHOULD USE A STRING VALUE (NOT JSX)
// const statusToLabel = (status: any) => {
//   const s = String(status).toLowerCase();
//   if (s === "true") return "Approved";
//   if (s === "false") return "Rejected";
//   return "Pending";
// };

// // -------------------- VIEW BUTTON --------------------
// const ViewRenderer = (params: any) => {
//   const documentId = params.value;

//   const handleView = (e: any) => {
//     e.stopPropagation();
//     params.context.handleViewPdf(documentId);
//   };

//   return (
//     <button
//       onClick={handleView}
//       className="btn btn-outline-primary"
//       style={{
//         fontSize: "13px",
//         padding: "6px 14px",
//         borderRadius: "8px",
//         fontWeight: 600,
//       }}
//     >
//       👁 View
//     </button>
//   );
// };

// // -------------------- ACTION RENDERER --------------------
// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => props.context.handleUpdate(props.data.id);

//   return (
//     <button
//       className="btn btn-outline-primary"
//       style={{
//         fontSize: "13px",
//         padding: "6px 14px",
//         borderRadius: "8px",
//         fontWeight: 600,
//       }}
//       onClick={handleEdit}
//     >
//       Edit
//     </button>
//   );
// };

// const UpdateCertificate = () => {
//   const navigate = useNavigate();
//   const gridRef = useRef<AgGridReact>(null);

//   const [rowData, setRowData] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const regex = /^(g_|archived|extra_data)/;

//   const [showModal, setShowModal] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState("");

//   // Bulk approve UI
//   const [selectedCount, setSelectedCount] = useState(0);
//   const [isApproving, setIsApproving] = useState(false);

//   // -------------------- VIEW PDF --------------------
//   const handleViewPdf = async (documentId: string) => {
//     const url =
//       `${apiConfig.API_BASE_URL}/certificate` +
//       `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//       `&dmsRole=admin&user_id=admin@rasp.com`;

//     const response = await authFetch(url, { method: "GET" });
//     const blob = await response.blob();
//     const fileURL = URL.createObjectURL(blob);

//     setPdfUrl(fileURL);
//     setShowModal(true);
//   };

//   // ---------------- FETCH METADATA ----------------
//   useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const res = await authFetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!res.ok) throw new Error("Metadata load failed");

//       const data = await res.json();
//       const required = data[0]?.fieldValues
//         .filter((f: any) => !regex.test(f.name))
//         .map((f: any) => f.name);

//       setRequiredFields(required || []);
//       return data;
//     },
//   });

//   // ---------------- FETCH CERTIFICATES ----------------
//   useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });

//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!res.ok) throw new Error("Certificate load failed");

//       const json = await res.json();
//       const rawRows = json.resource || [];

//       const enrichedRows = await Promise.all(
//         rawRows.map(async (row: any) => {
//           const studentParams = new URLSearchParams({
//             queryId: "GET_STUDENT_BY_CERTIFICATE",
//             args: "student_id:" + row.student_id,
//           });

//           const studentRes = await authFetch(
//             `${apiConfig.getResourceUrl("certificate")}?${studentParams.toString()}`,
//             {
//               method: "GET",
//               headers: { "Content-Type": "application/json" },
//             }
//           );

//           if (studentRes.ok) {
//             const stuJson = await studentRes.json();
//             const stu = stuJson.resource?.[0];

//             return {
//               ...row,
//               roll_no: stu?.roll_no || "N/A",
//               student_name: stu?.name || "",
//             };
//           }

//           return row;
//         })
//       );

//       setRowData(enrichedRows);
//       return enrichedRows;
//     },
//   });

//   const handleUpdate = (id: any) => navigate(`/edit/certificate/${id}`);

//   // ---------------- Bulk Approve Selected ----------------
//   const handleApproveSelected = async () => {
//     const api = gridRef.current?.api;
//     if (!api) return;

//     const selectedRows = api.getSelectedRows() || [];
//     if (!selectedRows.length) return;

//     setIsApproving(true);
//     try {
//       // Update in backend: set status true for each selected row
//       await Promise.all(
//         selectedRows.map(async (row: any) => {
//           const updated = { ...row, status: true };

//           // remove UI-only fields before sending
//           delete (updated as any).roll_no;
//           delete (updated as any).student_name;
//           delete (updated as any).Action;

//           const params = new FormData();
//           const jsonString = JSON.stringify(updated);
//           const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)));

//           params.append("resource", base64Encoded);
//           params.append("action", "MODIFY");

//           const url = `${apiConfig.getResourceUrl("certificate")}?`;

//           const res = await authFetch(url, {
//             method: "POST",
//             body: params,
//           });

//           if (!res.ok) throw new Error("Approve failed: " + res.status);
//         })
//       );

//       // Update UI instantly
//       const selectedIds = new Set(selectedRows.map((r: any) => r.id));
//       setRowData((prev) =>
//         prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: true } : r))
//       );

//       // Clear selection
//       api.deselectAll();
//       setSelectedCount(0);
//     } catch (e) {
//       console.error(e);
//       alert("Bulk approve failed. Check console/network.");
//     } finally {
//       setIsApproving(false);
//     }
//   };

//   // ============================================================
//   //            COLUMN DEFINITIONS (WITH STATUS FILTER ✅)
//   // ============================================================
//   const colDefs = useMemo<ColDef[]>(() => {
//     return [
//       // checkbox selection column (needed for bulk actions)
//       {
//         headerName: "",
//         field: "__select__",
//         width: 60,
//         pinned: "left",
//         checkboxSelection: true,
//         headerCheckboxSelection: true,
//         headerCheckboxSelectionFilteredOnly: true,
//         sortable: false,
//         filter: false,
//         resizable: false,
//       },

//       { headerName: "Roll Number", field: "roll_no", sortable: true, filter: true },
//       { headerName: "Student Name", field: "student_name", sortable: true, filter: true },
//       { headerName: "Course", field: "course_name", sortable: true, filter: true },
//       { headerName: "Platform", field: "platform", sortable: true, filter: true },

//       {
//         headerName: "Completion Date",
//         field: "course_completion_date",
//         sortable: true,
//         filter: true,
//         cellRenderer: (params: any) => {
//           if (!params.value) return "";
//           const d = new Date(params.value);
//           return d.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "2-digit",
//           });
//         },
//       },

//       // ✅ Status column: badge renderer + set filter using valueGetter
//       {
//         headerName: "Status",
//         field: "status",
//         sortable: true,

//         // IMPORTANT: filter should see strings
//         valueGetter: (p: any) => statusToLabel(p.data?.status),

//         // ✅ dropdown filter with 3 values
//         filter: "agSetColumnFilter",
//         filterParams: {
//           values: ["Approved", "Rejected", "Pending"],
//           suppressMiniFilter: false,
//         },

//         cellRenderer: (p: any) => getStatusBadge(p.data?.status),
//       },

//       {
//         headerName: "View",
//         field: "upload_certificate",
//         cellRenderer: ViewRenderer,
//         sortable: false,
//         filter: false,
//       },

//       {
//         headerName: "Action",
//         field: "Action",
//         cellRenderer: ActionCellRenderer,
//         sortable: false,
//         filter: false,
//       },
//     ];
//   }, [rowData]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 120,
//     resizable: true,
//     editable: false,
//     cellStyle: {
//       display: "flex",
//       alignItems: "center",
//     },
//   };

//   return (
//     <>
//       {/* Header + Bulk button */}
//       <div style={{ padding: "12px 0" }}>
//         <h2 style={{ margin: 0, fontWeight: 700 }}>Student Certificates</h2>

//         <div
//           style={{
//             marginTop: 10,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 12,
//           }}
//         >
//           <div style={{ fontSize: 18 }}>
//             Selected: <b>{selectedCount}</b>
//           </div>

//           <button
//             className="btn btn-success"
//             onClick={handleApproveSelected}
//             disabled={selectedCount === 0 || isApproving}
//             style={{
//               borderRadius: 10,
//               padding: "10px 16px",
//               fontSize: 18,
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               opacity: selectedCount === 0 ? 0.6 : 1,
//             }}
//           >
//             ✅ Approve Selected ({selectedCount})
//           </button>
//         </div>
//       </div>

//       <div className="ag-theme-alpine" style={{ height: 500 }}>
//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={colDefs}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={10}
//           animateRows={true}
//           rowSelection="multiple"
//           suppressRowClickSelection={true}
//           context={{ handleUpdate, handleViewPdf }}
//           onSelectionChanged={() => {
//             const api = gridRef.current?.api;
//             if (!api) return;
//             setSelectedCount(api.getSelectedRows()?.length || 0);
//           }}
//         />
//       </div>

//       {/* PDF MODAL */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.6)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               width: "70%",
//               height: "80%",
//               background: "white",
//               padding: "10px",
//               borderRadius: "12px",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={() => setShowModal(false)}
//               className="btn btn-danger"
//               style={{ position: "absolute", top: 10, right: 10 }}
//             >
//               Close
//             </button>

//             <iframe
//               src={pdfUrl}
//               style={{ width: "100%", height: "100%", border: "none" }}
//               title="PDF Preview"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UpdateCertificate;

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";

// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
//   const finalInit: RequestInit = {
//     credentials: "include",
//     ...init,
//     headers: { ...(init.headers || {}) },
//   };

//   const token = getCookie("access_token");
//   const headersObj = finalInit.headers as Record<string, string>;
//   if (token && !headersObj?.Authorization) {
//     headersObj.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(input, finalInit);

//   if (res.status === 401) {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/";
//     throw new Error("Unauthorized");
//   }

//   return res;
// }

// const getStatusBadge = (status: any) => {
//   const s = String(status).toLowerCase();

//   const badgeStyle: React.CSSProperties = {
//     fontSize: "14px",
//     padding: "6px 12px",
//     borderRadius: "8px",
//     display: "inline-block",
//     textAlign: "center",
//   };

//   if (s === "true") return <span className="badge bg-success text-white" style={badgeStyle}>Approved</span>;
//   if (s === "false") return <span className="badge bg-danger text-white" style={badgeStyle}>Rejected</span>;
//   return <span className="badge bg-warning text-dark" style={badgeStyle}>Pending</span>;
// };

// const statusToLabel = (status: any) => {
//   const s = String(status).toLowerCase();
//   if (s === "true") return "Approved";
//   if (s === "false") return "Rejected";
//   return "Pending";
// };

// const ViewRenderer = (params: any) => {
//   const documentId = params.value;

//   const handleView = (e: any) => {
//     e.stopPropagation();
//     params.context.handleViewPdf(documentId);
//   };

//   return (
//     <button onClick={handleView} className="btn btn-outline-primary" style={{ fontSize: "13px", padding: "6px 14px", borderRadius: "8px", fontWeight: 600 }}>
//       👁 View
//     </button>
//   );
// };

// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => props.context.handleUpdate(props.data.id);
//   return (
//     <button className="btn btn-outline-primary" style={{ fontSize: "13px", padding: "6px 14px", borderRadius: "8px", fontWeight: 600 }} onClick={handleEdit}>
//       Edit
//     </button>
//   );
// };

// const UpdateCertificate = () => {
//   const navigate = useNavigate();
//   const gridRef = useRef<AgGridReact>(null);

//   const [rowData, setRowData] = useState<any[]>([]);
//   const regex = /^(g_|archived|extra_data)/;

//   const [showModal, setShowModal] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState("");

//   // Bulk actions
//   const [selectedCount, setSelectedCount] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // -------------------- VIEW PDF --------------------
//   const handleViewPdf = async (documentId: string) => {
//     const url =
//       `${apiConfig.API_BASE_URL}/certificate` +
//       `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//       `&dmsRole=admin&user_id=admin`;

//     const response = await authFetch(url, { method: "GET" });
//     const blob = await response.blob();
//     const fileURL = URL.createObjectURL(blob);

//     setPdfUrl(fileURL);
//     setShowModal(true);
//   };

//   // ---------------- FETCH METADATA ----------------
//   useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const res = await authFetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!res.ok) throw new Error("Metadata load failed");
//       const data = await res.json();
//       return data;
//     },
//   });

//   // ---------------- FETCH CERTIFICATES ----------------
//   useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });

//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!res.ok) throw new Error("Certificate load failed");

//       const json = await res.json();
//       const rawRows = json.resource || [];

//       const enrichedRows = await Promise.all(
//         rawRows.map(async (row: any) => {
//           const studentParams = new URLSearchParams({
//             queryId: "GET_STUDENT_BY_CERTIFICATE",
//             args: "student_id:" + row.student_id,
//           });

//           const studentRes = await authFetch(
//             `${apiConfig.getResourceUrl("certificate")}?${studentParams.toString()}`,
//             { method: "GET", headers: { "Content-Type": "application/json" } }
//           );

//           if (studentRes.ok) {
//             const stuJson = await studentRes.json();
//             const stu = stuJson.resource?.[0];
//             return {
//               ...row,
//               roll_no: stu?.roll_no || "N/A",
//               student_name: stu?.name || "",
//             };
//           }

//           return row;
//         })
//       );

//       setRowData(enrichedRows);
//       return enrichedRows;
//     },
//   });

//   const handleUpdate = (id: any) => navigate(`/edit/certificate/${id}`);

//   // universal update function (approve | reject)
//   const updateSelected = async (actionType: "approve" | "reject") => {
//     const api = gridRef.current?.api;
//     if (!api) return;

//     const selectedRows = api.getSelectedRows() || [];
//     if (!selectedRows.length) return;

//     setIsProcessing(true);
//     try {
//       await Promise.all(
//         selectedRows.map(async (row: any) => {
//           const updated = {
//             ...row,
//             status: actionType === "approve" ? true : false,
//           };

//           delete updated.roll_no;
//           delete updated.student_name;
//           delete updated.Action;

//           // 1️⃣ Modify certificate
//           const params = new FormData();
//           const jsonString = JSON.stringify(updated);
//           const base64 = btoa(unescape(encodeURIComponent(jsonString)));

//           params.append("resource", base64);
//           params.append("action", "MODIFY");

//           const modifyUrl = `${apiConfig.getResourceUrl("certificate")}?`;

//           const res = await authFetch(modifyUrl, { method: "POST", body: params });
//           if (!res.ok) throw new Error("Update failed");

//           // 2️⃣ Update Logs (Decorator)
//           const logUrl =
//             `${apiConfig.getResourceUrl("certificate")}` +
//             `?queryId=UPDATE_CERTIFICATE_LOGS&id=${row.id}&action=${actionType}&admin=admin`;

//           await authFetch(logUrl, { method: "POST" });
//         })
//       );

//       // Update UI instantly
//       const selectedIds = new Set(selectedRows.map((r: any) => r.id));
//       setRowData((prev) =>
//         prev.map((r) =>
//           selectedIds.has(r.id)
//             ? { ...r, status: actionType === "approve" ? true : false }
//             : r
//         )
//       );

//       api.deselectAll();
//       setSelectedCount(0);
//     } catch (err) {
//       console.error(err);
//       alert(`Bulk ${actionType} failed.`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleApproveSelected = () => updateSelected("approve");
//   const handleRejectSelected = () => updateSelected("reject");

//   // ============================================================
//   //            COLUMN DEFINITIONS (WITH LOGS)
//   // ============================================================
//   const colDefs = useMemo<ColDef[]>(
//     () => [
//       {
//         headerName: "",
//         field: "__select__",
//         width: 60,
//         pinned: "left",
//         checkboxSelection: true,
//         headerCheckboxSelection: true,
//         headerCheckboxSelectionFilteredOnly: true,
//         sortable: false,
//         filter: false,
//       },
//       { headerName: "Roll Number", field: "roll_no", sortable: true, filter: true },
//       { headerName: "Student Name", field: "student_name", sortable: true, filter: true },
//       { headerName: "Course", field: "course_name", sortable: true, filter: true },
//       { headerName: "Platform", field: "platform", sortable: true, filter: true },

//       {
//         headerName: "Completion Date",
//         field: "course_completion_date",
//         sortable: true,
//         filter: true,
//         cellRenderer: (p: any) =>
//           p.value
//             ? new Date(p.value).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "2-digit",
//               })
//             : "",
//       },

//       {
//         headerName: "Status",
//         field: "status",
//         sortable: true,
//         valueGetter: (p: any) => statusToLabel(p.data?.status),
//         filter: "agSetColumnFilter",
//         filterParams: { values: ["Approved", "Rejected", "Pending"] },
//         cellRenderer: (p: any) => getStatusBadge(p.data?.status),
//       },

//       // LOGS column for admin
//       {
//         headerName: "Logs",
//         field: "logs",
//         sortable: false,
//         filter: false,
//         cellRenderer: (params: any) => {
//           if (!params.value) return "No logs";
//           try {
//             const logs = typeof params.value === "string" ? JSON.parse(params.value) : params.value;
//             return (
//               <div style={{ fontSize: 13, lineHeight: 1.3 }}>
//                 {logs.uploaded_at && <div><b>Uploaded:</b> {logs.uploaded_at}</div>}
//                 {logs.approved_by && <div><b>Approved By:</b> {logs.approved_by}</div>}
//                 {logs.approved_date && <div><b>Approved Date:</b> {logs.approved_date}</div>}
//                 {logs.rejected_by && <div><b>Rejected By:</b> {logs.rejected_by}</div>}
//                 {logs.rejected_date && <div><b>Rejected Date:</b> {logs.rejected_date}</div>}
//               </div>
//             );
//           } catch (err) {
//             return "Invalid logs";
//           }
//         },
//       },

//       {
//         headerName: "View",
//         field: "upload_certificate",
//         cellRenderer: ViewRenderer,
//       },

//       {
//         headerName: "Action",
//         field: "Action",
//         cellRenderer: ActionCellRenderer,
//       },
//     ],
//     []
//   );

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 120,
//     resizable: true,
//   };

//   return (
//     <>
//       <div style={{ padding: "12px 0" }}>
//         <h2 style={{ margin: 0, fontWeight: 700 }}>Student Certificates</h2>

//         <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
//           <div style={{ fontSize: 18 }}>
//             Selected: <b>{selectedCount}</b>
//           </div>

//           <div style={{ display: "flex", gap: 12 }}>
//             <button className="btn btn-success" onClick={handleApproveSelected} disabled={selectedCount === 0 || isProcessing} style={{ borderRadius: 10, padding: "10px 16px", fontSize: 18 }}>
//               ✅ Approve Selected
//             </button>

//             <button className="btn btn-danger" onClick={handleRejectSelected} disabled={selectedCount === 0 || isProcessing} style={{ borderRadius: 10, padding: "10px 16px", fontSize: 18 }}>
//               ❌ Reject Selected
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="ag-theme-alpine" style={{ height: 500 }}>
//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={colDefs}
//           defaultColDef={defaultColDef}
//           pagination
//           paginationPageSize={10}
//           animateRows
//           rowSelection="multiple"
//           suppressRowClickSelection
//           context={{ handleUpdate, handleViewPdf }}
//           onSelectionChanged={() => {
//             const api = gridRef.current?.api;
//             if (!api) return;
//             setSelectedCount(api.getSelectedRows()?.length || 0);
//           }}
//         />
//       </div>

//       {showModal && (
//         <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
//           <div style={{ width: "70%", height: "80%", background: "white", padding: "10px", borderRadius: "12px", position: "relative" }}>
//             <button onClick={() => setShowModal(false)} className="btn btn-danger" style={{ position: "absolute", top: 10, right: 10 }}>
//               Close
//             </button>

//             <iframe src={pdfUrl} style={{ width: "100%", height: "100%", border: "none" }} title="PDF Preview" />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UpdateCertificate;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";

import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";

ModuleRegistry.registerModules([AllCommunityModule]);

// -------------------- COOKIE --------------------
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// -------------------- authFetch --------------------
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
  const headersObj = finalInit.headers as any;

  // ⭐ Fixed TypeScript Authorization header issue
  if (token && !headersObj["Authorization"]) {
    headersObj["Authorization"] = `Bearer ${token}`;
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

// -------------------- STATUS BADGE --------------------
const getStatusBadge = (status: any) => {
  const s = String(status).toLowerCase();

  const badgeStyle: React.CSSProperties = {
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "8px",
    display: "inline-block",
    textAlign: "center",
  };

  if (s === "true") {
    return (
      <span className="badge bg-success text-white" style={badgeStyle}>
        Approved
      </span>
    );
  }

  if (s === "false") {
    return (
      <span className="badge bg-danger text-white" style={badgeStyle}>
        Rejected
      </span>
    );
  }

  return (
    <span className="badge bg-warning text-dark" style={badgeStyle}>
      Pending
    </span>
  );
};

// For filtering dropdown
const statusToLabel = (status: any) => {
  const s = String(status).toLowerCase();
  if (s === "true") return "Approved";
  if (s === "false") return "Rejected";
  return "Pending";
};

// -------------------- VIEW BUTTON --------------------
const ViewRenderer = (params: any) => {
  const documentId = params.value;

  const handleView = (e: any) => {
    e.stopPropagation();
    params.context.handleViewPdf(documentId);
  };

  return (
    <button
      onClick={handleView}
      className="btn btn-outline-primary"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
    >
      👁 View
    </button>
  );
};

// -------------------- ACTION RENDERER --------------------
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => props.context.handleUpdate(props.data.id);

  return (
    <button
      className="btn btn-outline-primary"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
      onClick={handleEdit}
    >
      Edit
    </button>
  );
};

const UpdateCertificate = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const regex = /^(g_|archived|extra_data)/;

  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [selectedCount, setSelectedCount] = useState(0);
  const [isApproving, setIsApproving] = useState(false);

  // -------------------- VIEW PDF --------------------
  const handleViewPdf = async (documentId: string) => {
    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const response = await authFetch(url, { method: "GET" });
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    setPdfUrl(fileURL);
    setShowModal(true);
  };

  // ---------------- FETCH METADATA ----------------
  useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const res = await authFetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Metadata load failed");

      const data = await res.json();
      const required = data[0]?.fieldValues
        .filter((f: any) => !regex.test(f.name))
        .map((f: any) => f.name);

      setRequiredFields(required || []);
      return data;
    },
  });

  // ---------------- FETCH CERTIFICATES ----------------
  useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Certificate load failed");

      const json = await res.json();
      const rawRows = json.resource || [];

      const enrichedRows = await Promise.all(
        rawRows.map(async (row: any) => {
          const studentParams = new URLSearchParams({
            queryId: "GET_STUDENT_BY_CERTIFICATE",
            args: "student_id:" + row.student_id,
          });

          const studentRes = await authFetch(
            `${apiConfig.getResourceUrl(
              "certificate"
            )}?${studentParams.toString()}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (studentRes.ok) {
            const stuJson = await studentRes.json();
            const stu = stuJson.resource?.[0];

            return {
              ...row,
              roll_no: stu?.roll_no || "N/A",
              student_name: stu?.name || "",
            };
          }

          return row;
        })
      );

      setRowData(enrichedRows);
      return enrichedRows;
    },
  });

  const handleUpdate = (id: any) => navigate(`/edit/certificate/${id}`);

  // ---------------- Bulk Approve Selected ----------------
  const handleApproveSelected = async () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const selectedRows = api.getSelectedRows() || [];
    if (!selectedRows.length) return;

    setIsApproving(true);
    try {
      await Promise.all(
        selectedRows.map(async (row: any) => {
          const updated = { ...row, status: true };

          delete (updated as any).roll_no;
          delete (updated as any).student_name;
          delete (updated as any).Action;

          const params = new FormData();
          const jsonString = JSON.stringify(updated);
          const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)));

          params.append("resource", base64Encoded);
          params.append("action", "MODIFY");

          const url = `${apiConfig.getResourceUrl("certificate")}?`;

          const res = await authFetch(url, {
            method: "POST",
            body: params,
          });

          if (!res.ok) throw new Error("Approve failed: " + res.status);
        })
      );

      const selectedIds = new Set(selectedRows.map((r: any) => r.id));
      setRowData((prev) =>
        prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: true } : r))
      );

      api.deselectAll();
      setSelectedCount(0);
    } catch (e) {
      console.error(e);
      alert("Bulk approve failed.");
    } finally {
      setIsApproving(false);
    }
  };

  // ============================================================
  //            COLUMN DEFINITIONS (PLACE LOGS AFTER STATUS)
  // ============================================================
  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "",
        field: "__select__",
        width: 60,
        pinned: "left",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: false,
        filter: false,
        resizable: false,
      },

      {
        headerName: "Roll Number",
        field: "roll_no",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Student Name",
        field: "student_name",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Course",
        field: "course_name",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Platform",
        field: "platform",
        sortable: true,
        filter: true,
      },

      {
        headerName: "Completion Date",
        field: "course_completion_date",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          if (!params.value) return "";
          const d = new Date(params.value);
          return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
        },
      },

      // ⭐ STATUS
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        valueGetter: (p: any) => statusToLabel(p.data?.status),
        filter: "agSetColumnFilter",
        filterParams: {
          values: ["Approved", "Rejected", "Pending"],
        },
        cellRenderer: (p: any) => getStatusBadge(p.data?.status),
      },

      // ⭐ LOGS COLUMN (Added after status)
      // {
      //   headerName: "Logs",
      //   field: "logs",
      //   sortable: false,
      //   filter: false,
      //   cellRenderer: (params: any) => {
      //     if (!params.value) return "No logs";
      //     try {
      //       const logs = JSON.parse(params.value);
      //       return (
      //         <div style={{ lineHeight: "1.4", fontSize: "13px" }}>
      //           {logs.uploaded_at && <div>📤 <b>Uploaded:</b> {logs.uploaded_at}</div>}
      //           {logs.approved_by && <div>✅ <b>Approved By:</b> {logs.approved_by}</div>}
      //           {logs.approved_date && <div>📅 <b>Approved:</b> {logs.approved_date}</div>}
      //           {logs.rejected_by && <div>❌ <b>Rejected By:</b> {logs.rejected_by}</div>}
      //           {logs.rejected_date && <div>📅 <b>Rejected:</b> {logs.rejected_date}</div>}
      //         </div>
      //       );
      //     } catch {
      //       return "Invalid logs";
      //     }
      //   }
      // },

      {
        headerName: "Logs",
        field: "logs",
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const logsStr = params.value;

          if (
            !logsStr ||
            typeof logsStr !== "string" ||
            logsStr.trim() === ""
          ) {
            return "No logs";
          }

          const lines = logsStr
            .split("\n")
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0);

          return (
            <div style={{ lineHeight: "1.4", fontSize: "13px" }}>
              {lines.map((line: string, idx: number) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          );
        },
      },

      {
        headerName: "View",
        field: "upload_certificate",
        cellRenderer: ViewRenderer,
        sortable: false,
        filter: false,
      },

      {
        headerName: "Action",
        field: "Action",
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
      },
    ];
  }, [rowData]);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
    editable: false,
    cellStyle: {
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <>
      {/* Header */}
      <div style={{ padding: "12px 0" }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>Student Certificates</h2>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 18 }}>
            Selected: <b>{selectedCount}</b>
          </div>

          <button
            className="btn btn-success"
            onClick={handleApproveSelected}
            disabled={selectedCount === 0 || isApproving}
            style={{
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: selectedCount === 0 ? 0.6 : 1,
            }}
          >
            ✅ Approve Selected ({selectedCount})
          </button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          context={{ handleUpdate, handleViewPdf }}
          onSelectionChanged={() => {
            const api = gridRef.current?.api;
            if (!api) return;
            setSelectedCount(api.getSelectedRows()?.length || 0);
          }}
        />
      </div>

      {/* PDF MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "70%",
              height: "80%",
              background: "white",
              padding: "10px",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-danger"
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              Close
            </button>

            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCertificate;
