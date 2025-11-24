// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";

// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   ColDef          // <-- IMPORTANT
// } from "ag-grid-community";

// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// // Badge Renderer
// // const getStatusBadge = (status: any) => {
// //   if (status === true || status === "true")
// //     return <span className="badge bg-success text-white">✅ Approved</span>;

// //   if (status === false || status === "false")
// //     return <span className="badge bg-danger text-white">❌ Rejected</span>;

// //   return <span className="badge bg-secondary text-white">⏳ Pending</span>;
// // };
// const getStatusBadge = (status: any) => {
//   // Convert to consistent value
//   const s = String(status).toLowerCase();

//   if (s === "true") {
//     return (
//       <span className="badge bg-success text-white">✅ Approved</span>
//     );
//   }

//   if (s === "false") {
//     return (
//       <span className="badge bg-danger text-white">❌ Rejected</span>
//     );
//   }

//   // PENDING (distinct color)
//   return (
//     <span className="badge bg-warning text-dark">⏳ Pending</span>
//   );
// };

// // Action button
// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => {
//     props.context.handleUpdate(props.data.id);
//   };

//   return (
//     <button onClick={handleEdit} className="btn btn-primary btn-sm">
//       Edit
//     </button>
//   );
// };

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const UpdateCertificate = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<ColDef[]>([]); // <-- IMPORTANT
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const navigate = useNavigate();

//   const regex = /^(g_|archived|extra_data)/;

//   // Fetch certificate data
//   const { data: dataRes } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       params.append("queryId", "GET_ALL");

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token missing");

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch certificates");

//       return await response.json();
//     },
//   });

//   // Fetch metadata
//   useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!response.ok) throw new Error("Failed metadata");

//       const data = await response.json();

//       const required = data[0]?.fieldValues
//         .filter((f: any) => !regex.test(f.name))
//         .map((f: any) => f.name);

//       setRequiredFields(required || []);
//       return data;
//     },
//   });

//   // Build table columns
//   useEffect(() => {
//     if (!dataRes) return;

//     const data = dataRes.resource || [];

//     const fields = requiredFields.filter((f) => f !== "id");

//     const columns: ColDef[] = fields.map((field) => {
//       // STATUS COLUMN RENDERER
//       if (field === "status") {
//         return {
//           field: "status",
//           headerName: "Status",
//           resizable: true,
//           sortable: true,
//           filter: true,
//           editable: false,
//           cellRenderer: (params: any) => getStatusBadge(params.value),
//         };
//       }

//       return {
//         field,
//         headerName: field,
//         editable: false,
//         resizable: true,
//         sortable: true,
//         filter: true,
//       };
//     });

//     // ACTION COLUMN
//     columns.push({
//       headerName: "Action",
//       field: "action",
//       cellRenderer: ActionCellRenderer,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 120,
//     });

//     setColDef1(columns);
//     setRowData(data);
//   }, [dataRes, requiredFields]);

//   const handleUpdate = (id: any) => {
//     navigate(`/edit/certificate/${id}`);
//   };

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDef1}
//         defaultColDef={defaultColDef}
//         pagination={true}
//         paginationPageSize={10}
//         animateRows={true}
//         context={{ handleUpdate }}
//       />
//     </div>
//   );
// };

// export default UpdateCertificate;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";

// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   ColDef
// } from "ag-grid-community";

// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// // -------------------- STATUS BADGE --------------------
// const getStatusBadge = (status: any) => {
//   const s = String(status).toLowerCase();

//   if (s === "true") {
//     return (
//       <span className="badge bg-success text-white">✅ Approved</span>
//     );
//   }

//   if (s === "false") {
//     return (
//       <span className="badge bg-danger text-white">❌ Rejected</span>
//     );
//   }

//   return (
//     <span className="badge bg-warning text-dark">⏳ Pending</span>
//   );
// };

// // -------------------- ACTION RENDERER --------------------
// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => {
//     props.context.handleUpdate(props.data.id);
//   };

//   return (
//     <button onClick={handleEdit} className="btn btn-primary btn-sm">
//       Edit
//     </button>
//   );
// };

// // -------------------- COOKIE --------------------
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// // -------------------- DOWNLOAD BUTTON RENDERER --------------------
// const DownloadButtonRenderer = (params: any) => {
//   const documentId = params.value;
//   const accessToken = getCookie("access_token");

//   const handleDownload = async (e: any) => {
//     e.stopPropagation();

//     try {
//       const url =
//         `${apiConfig.API_BASE_URL}/certificate` +
//         `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//         `&dmsRole=admin&user_id=admin@rasp.com`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Download failed");

//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = downloadUrl;

//       const filename =
//         response.headers
//           .get("Content-Disposition")
//           ?.split("filename=")[1]
//           ?.replace(/['"]/g, "") || "certificate.pdf";

//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (err) {
//       console.error("Download error:", err);
//     }
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       style={{
//         backgroundColor: "#1976d2",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         padding: "4px 8px",
//         cursor: "pointer",
//       }}
//     >
//       Download
//     </button>
//   );
// };

// // ==========================================================
// //                    MAIN COMPONENT
// // ==========================================================
// const UpdateCertificate = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<ColDef[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const navigate = useNavigate();

//   const regex = /^(g_|archived|extra_data)/;

//   // ---------------- FETCH CERTIFICATE DATA ----------------
//   const { data: dataRes } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       params.append("queryId", "GET_ALL");

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token missing");

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch certificates");

//       return await response.json();
//     },
//   });

//   // ---------------- FETCH METADATA ----------------
//   useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!response.ok) throw new Error("Failed metadata");

//       const data = await response.json();

//       const required = data[0]?.fieldValues
//         .filter((f: any) => !regex.test(f.name))
//         .map((f: any) => f.name);

//       setRequiredFields(required || []);
//       return data;
//     },
//   });

//   // ---------------- BUILD COLUMNS ----------------
//   useEffect(() => {
//     if (!dataRes) return;

//     const data = dataRes.resource || [];
//     const fields = requiredFields.filter((f) => f !== "id");

//     const columns: ColDef[] = fields.map((field) => {
//       if (field === "status") {
//         return {
//           field: "status",
//           headerName: "Status",
//           resizable: true,
//           sortable: true,
//           filter: true,
//           editable: false,
//           cellRenderer: (params: any) => getStatusBadge(params.value),
//         };
//       }

//       return {
//         field,
//         headerName: field,
//         editable: false,
//         resizable: true,
//         sortable: true,
//         filter: true,
//       };
//     });

//     // --------- DOWNLOAD BUTTON COLUMN ----------
//     columns.push({
//       field: "upload_certificate",
//       headerName: "Certificate",
//       cellRenderer: DownloadButtonRenderer,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 150,
//     });

//     // -------- ACTION COLUMN --------
//     columns.push({
//       headerName: "Action",
//       field: "action",
//       cellRenderer: ActionCellRenderer,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 120,
//     });

//     setColDef1(columns);
//     setRowData(data);
//   }, [dataRes, requiredFields]);

//   const handleUpdate = (id: any) => {
//     navigate(`/edit/certificate/${id}`);
//   };

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDef1}
//         defaultColDef={defaultColDef}
//         pagination={true}
//         paginationPageSize={10}
//         animateRows={true}
//         context={{ handleUpdate }}
//       />
//     </div>
//   );
// };

// export default UpdateCertificate;

// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import apiConfig from '../../config/apiConfig';
// import { ColDef } from "ag-grid-community";

// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeAlpine,
//   themeBalham
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from '@tanstack/react-query';

// ModuleRegistry.registerModules([AllCommunityModule]);

// // interface ColumnDef {
// //   field: string;
// //   headerName: string;
// //   editable: boolean;
// //   resizable: boolean;
// //   sortable: boolean;
// //   filter: boolean;
// //   width?: number;             // <-- ADD THIS
// //   cellRenderer?: (params: any) => React.ReactNode;
// // }

// // // Define the custom cell renderer for the action column
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
// const getStatusBadge = (status: any) => {
//   if (status === true || status === "true")
//     return <span className="badge bg-success text-white">✅ Approved</span>;

//   if (status === false || status === "false")
//     return <span className="badge bg-danger text-white">❌ Rejected</span>;

//   return <span className="badge bg-secondary text-white">⏳ Pending</span>;
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

//   const UpdateCertificate = () => {
//    const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl('certificate')}?`
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Certificate')}?`
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//    const [currentUrl, setCurrentUrl] = useState('');
//     // Fetch resource data
//     const {data:dataRes,isLoading:isLoadingDataRes,error:errorDataRes}= useQuery({
//     queryKey: ['resourceData', 'certificate'],
//      queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);
//        const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     throw new Error("Access token not found");
//   }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl('certificate')}?` + params.toString(),
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
//     queryKey: ['resourceMetaData', 'certificate'],
//    queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl('certificate')}?`,
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

//     navigate(`/edit/certificate/${id}`);
// };

//   // useEffect(() => {
//   //   const data = fetchData || [];
//   //   const fields = requiredFields.filter(field => field !== 'id') || [];

//   //   const columns = fields.map(field => ({
//   //     field: field,
//   //     headerName: field,
//   //     editable: false,
//   //     resizable: true,
//   //     sortable: true,
//   //     filter: true
//   //   }));

//   //   // Add the Action column with the custom cell renderer
//   //   columns.push({
//   //     headerName: 'Action',
//   //     field: 'Action',
//   //     cellRenderer: ActionCellRenderer,
//   //     editable: false,
//   //     resizable: true,
//   //     sortable: false,
//   //     filter: false,
//   //     width: 120
//   //   } as ColumnDef)
//   //   setColDef1(columns);
//   //   setRowData(data);
//   // }, [fetchData, requiredFields]);
// useEffect(() => {
//   const data = fetchData || [];
//   const fields = requiredFields.filter(field => field !== 'id') || [];

//   const columns = fields.map((field) => {
//     if (field === "status") {
//       return {
//         field: "status",
//         headerName: "Status",
//         editable: false,
//         resizable: true,
//         sortable: true,
//         filter: true,
//         cellRenderer: (params: any) => getStatusBadge(params.value),
//       };
//     }

//     return {
//       field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true
//     };
//   });

//   columns.push({
//     headerName: "Action",
//     field: "Action",
//     cellRenderer: ActionCellRenderer,
//     editable: false,
//     resizable: true,
//     sortable: false,
//     filter: false,
//     width: 120,
//   });

//   setColDef1(columns);
//   setRowData(data);
// }, [fetchData, requiredFields]);

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

// export default UpdateCertificate

import React, { useState, useEffect, useMemo } from "react";
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

// -------------------- STATUS BADGE --------------------
const getStatusBadge = (status: any) => {
  const s = String(status).toLowerCase();

  if (s === "true") {
    return <span className="badge bg-success text-white">Approved</span>;
  }

  if (s === "false") {
    return <span className="badge bg-danger text-white">Rejected</span>;
  }

  return <span className="badge bg-warning text-dark">Pending</span>;
};

// -------------------- DOWNLOAD BUTTON --------------------
const DownloadButtonRenderer = (params: any) => {
  const documentId = params.value;
  const accessToken = getCookie("access_token");

  const handleDownload = async (e: any) => {
    e.stopPropagation();

    try {
      const url =
        `${apiConfig.API_BASE_URL}/certificate` +
        `?document_id=${documentId}&queryId=GET_DOCUMENT` +
        `&dmsRole=admin&user_id=admin@rasp.com`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;

      const filename =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/['"]/g, "") || "certificate.pdf";

      a.download = filename;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <button onClick={handleDownload} className="btn btn-primary btn-sm">
      Download
    </button>
  );
};

// -------------------- ACTION RENDERER --------------------
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => props.context.handleUpdate(props.data.id);

  return (
    <button className="btn btn-warning btn-sm" onClick={handleEdit}>
      Edit
    </button>
  );
};

// ==========================================================
//                    MAIN COMPONENT
// ==========================================================
const UpdateCertificate = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const regex = /^(g_|archived|extra_data)/;

  // ---------------- FETCH METADATA ----------------
  const { error: metaError, isLoading: metaLoading } = useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const res = await fetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`
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

  // ---------------- FETCH CERTIFICATES + ENRICH ----------------
  const { error: dataError, isLoading: dataLoading } = useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });
      const token = getCookie("access_token");

      const res = await fetch(
        `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();
      const rawRows = json.resource || [];
      console.log("rawRows", rawRows);

      // ⭐ EXACT EXAMSCHEDULING-STYLE ENRICHING LOGIC
      const enrichedRows = await Promise.all(
        rawRows.map(async (row: any) => {
          const studentParams = new URLSearchParams({
            queryId: "GET_STUDENT_BY_CERTIFICATE",
            args:"student_id:"+ row.student_id,
          });

          const studentRes = await fetch(
            `${apiConfig.getResourceUrl(
              "certificate"
            )}?${studentParams.toString()}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (studentRes.ok) {
            const stuJson = await studentRes.json();
            const stu = stuJson.resource[0];

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

  // ============================================================
  //            COLUMN DEFINITIONS (ExamScheduling style)
  // ============================================================
  const colDefs = useMemo(() => {
    return [
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
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: (p: any) => getStatusBadge(p.value),
      },
      {
        headerName: "Certificate",
        field: "upload_certificate",
        cellRenderer: DownloadButtonRenderer,
      },
      {
        headerName: "Action",
        field: "Action",
        cellRenderer: ActionCellRenderer,
      },
    ];
  }, [rowData]);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
    editable: false,
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      {metaLoading || dataLoading ? (
        <div>Loading...</div>
      ) : metaError || dataError ? (
        <div>Error loading data...</div>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          context={{ handleUpdate }}
        />
      )}
    </div>
  );
};

export default UpdateCertificate;
