import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";

import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef          // <-- IMPORTANT
} from "ag-grid-community";

import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";

ModuleRegistry.registerModules([AllCommunityModule]);

// Badge Renderer
// const getStatusBadge = (status: any) => {
//   if (status === true || status === "true")
//     return <span className="badge bg-success text-white">✅ Approved</span>;

//   if (status === false || status === "false")
//     return <span className="badge bg-danger text-white">❌ Rejected</span>;

//   return <span className="badge bg-secondary text-white">⏳ Pending</span>;
// };
const getStatusBadge = (status: any) => {
  // Convert to consistent value
  const s = String(status).toLowerCase();

  if (s === "true") {
    return (
      <span className="badge bg-success text-white">✅ Approved</span>
    );
  }

  if (s === "false") {
    return (
      <span className="badge bg-danger text-white">❌ Rejected</span>
    );
  }

  // PENDING (distinct color)
  return (
    <span className="badge bg-warning text-dark">⏳ Pending</span>
  );
};

// Action button
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => {
    props.context.handleUpdate(props.data.id);
  };

  return (
    <button onClick={handleEdit} className="btn btn-primary btn-sm">
      Edit
    </button>
  );
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const UpdateCertificate = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<ColDef[]>([]); // <-- IMPORTANT
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const navigate = useNavigate();

  const regex = /^(g_|archived|extra_data)/;

  // Fetch certificate data
  const { data: dataRes } = useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token missing");

      const response = await fetch(
        `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch certificates");

      return await response.json();
    },
  });

  // Fetch metadata
  useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const response = await fetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error("Failed metadata");

      const data = await response.json();

      const required = data[0]?.fieldValues
        .filter((f: any) => !regex.test(f.name))
        .map((f: any) => f.name);

      setRequiredFields(required || []);
      return data;
    },
  });

  // Build table columns
  useEffect(() => {
    if (!dataRes) return;

    const data = dataRes.resource || [];

    const fields = requiredFields.filter((f) => f !== "id");

    const columns: ColDef[] = fields.map((field) => {
      // STATUS COLUMN RENDERER
      if (field === "status") {
        return {
          field: "status",
          headerName: "Status",
          resizable: true,
          sortable: true,
          filter: true,
          editable: false,
          cellRenderer: (params: any) => getStatusBadge(params.value),
        };
      }

      return {
        field,
        headerName: field,
        editable: false,
        resizable: true,
        sortable: true,
        filter: true,
      };
    });

    // ACTION COLUMN
    columns.push({
      headerName: "Action",
      field: "action",
      cellRenderer: ActionCellRenderer,
      resizable: true,
      sortable: false,
      filter: false,
      width: 120,
    });

    setColDef1(columns);
    setRowData(data);
  }, [dataRes, requiredFields]);

  const handleUpdate = (id: any) => {
    navigate(`/edit/certificate/${id}`);
  };

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDef1}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        animateRows={true}
        context={{ handleUpdate }}
      />
    </div>
  );
};

export default UpdateCertificate;

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



// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface Certificate {
//   id: string;
//   course_name: string;
//   course_duration: number;
//   course_mode: string;
//   platform: string;
//   course_completion_date: string;
//   upload_certificate: string;
//   status?: boolean;
//   student_id?: string; // Hidden
//   course_url?: string;
//   [key: string]: any;
// }

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const UpdateCertificate: React.FC = () => {
//   const [rowData, setRowData] = useState<Certificate[]>([]);
//   const navigate = useNavigate();
//   const regex = /^(g_|archived|extra_data)/;

//   // Fetch certificate data
//   const { data: dataRes, isFetching } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token not found");

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

//       if (!response.ok) throw new Error("Error: " + response.status);

//       return await response.json();
//     },
//     refetchOnWindowFocus: true,
//   });

//   // Status Badge
//   const getStatusBadge = (status: any) => {
//     if (status === "Approved" || status === true)
//       return <span className="badge bg-success text-white">✅ Approved</span>;
//     if (status === "Rejected" || status === false)
//       return <span className="badge bg-danger text-white">❌ Rejected</span>;
//     return <span className="badge bg-secondary text-white">⏳ Pending</span>;
//   };

//   // Populate rows
//   useEffect(() => {
//     if (!dataRes) return;

//     const certificates: Certificate[] = dataRes.resource || [];

//     const cleanedRows = certificates.map((c) => ({
//       ...c,
//       student_id: undefined, // Hide field
//     }));

//     setRowData(cleanedRows);
//   }, [dataRes]);

//   // Define columns
//   const colDef1 = useMemo(() => {
//     if (!rowData.length) return [];

//     const keys = Object.keys(rowData[0]).filter(
//       (key) =>
//         !regex.test(key) &&
//         key !== "id" &&
//         key !== "student_id" // Hide student_id
//     );

//     const cols = keys.map((field) => {
//       if (field === "status") {
//         return {
//           field,
//           headerName: "Status",
//           editable: false,
//           resizable: true,
//           sortable: true,
//           filter: true,
//           cellRenderer: (params: any) => getStatusBadge(params.value),
//         };
//       }

//       if (field === "upload_certificate") {
//         return {
//           field,
//           headerName: "Certificate",
//           sortable: true,
//           filter: true,
//           resizable: true,
//           cellRenderer: (params: any) => {
//             const documentId = params.value;
//             const userId = params.data.user_id;
//             const handleDownload = async (e: any) => {
//               e.stopPropagation();
//               const accessToken = getCookie("access_token");

//               try {
//                 const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;

//                 const res = await fetch(url, {
//                   method: "GET",
//                   headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                   },
//                   credentials: "include",
//                 });

//                 if (!res.ok)
//                   throw new Error("Failed: " + res.statusText);

//                 const blob = await res.blob();
//                 const downloadUrl = window.URL.createObjectURL(blob);

//                 const a = document.createElement("a");
//                 a.href = downloadUrl;
//                 a.download =
//                   res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/['"]/g, "") ||
//                   "certificate";
//                 a.click();
//                 window.URL.revokeObjectURL(downloadUrl);
//               } catch (err) {
//                 console.log("Download failed", err);
//               }
//             };

//             return (
//               <button
//                 className="btn btn-sm btn-primary"
//                 onClick={handleDownload}
//               >
//                 Download
//               </button>
//             );
//           },
//         };
//       }

//       return {
//         field,
//         headerName: field,
//         editable: false,
//         sortable: true,
//         filter: true,
//         resizable: true,
//       };
//     });

//     // Add action column
//     cols.push({
//       headerName: "Action",
//       field: "action",
//       cellRenderer: (params: any) => 
//         <button
//           className="btn btn-primary btn-sm"
//           onClick={() => navigate(`/edit/certificate/${params.data.id}`)}
//         >
//           Edit
//         </button>,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//     });

//     return cols;
//   }, [rowData]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   if (isFetching) return <div>Loading...</div>;

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDef1}
//         defaultColDef={defaultColDef}
//         pagination
//         paginationPageSize={10}
//         animateRows
//       />
//     </div>
//   );
// };

// export default UpdateCertificate;





// //``````````````````````````````````````````
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

// ModuleRegistry.registerModules([AllCommunityModule]);

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// type NormalizedStatus = "approved" | "rejected" | "pending";

// const normalizeStatusValue = (val: any): NormalizedStatus => {
//   if (val === true) return "approved";
//   if (val === false) return "rejected";
//   if (val === null || val === undefined) return "pending";

//   const s = String(val).trim().toLowerCase();

//   // accepted approved variants
//   const approvedSet = new Set(["approved", "true", "1", "yes", "y"]);
//   const rejectedSet = new Set(["rejected", "false", "0", "no", "n"]);

//   if (approvedSet.has(s)) return "approved";
//   if (rejectedSet.has(s)) return "rejected";
//   return "pending";
// };

// const UpdateCertificate: React.FC = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const navigate = useNavigate();
//   const regex = /^(g_|archived|extra_data)/;

//   // fetch certificates
//   const { data: dataRes, isFetching } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const token = getCookie("access_token");
//       if (!token) throw new Error("No access token");

//       const res = await fetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) throw new Error("Failed to fetch certificates");
//       return await res.json();
//     },
//     refetchOnWindowFocus: false,
//   });

//   // prepare rows and normalize status into a stable value "status_normalized"
//   useEffect(() => {
//     if (!dataRes) {
//       setRowData([]);
//       return;
//     }
//     const certificates = Array.isArray(dataRes.resource) ? dataRes.resource : [];

//     const cleaned = certificates.map((c: any) => {
//       const normalized = normalizeStatusValue(c.status);
//       // keep original status as well in case other logic depends on it
//       return {
//         ...c,
//         status: normalized, // set status to normalized string (approved/rejected/pending)
//         // hide student_id by not exposing it to column generation (we'll still keep it in object)
//         student_id: c.student_id ?? undefined,
//       };
//     });

//     setRowData(cleaned);
//   }, [dataRes]);

//   const getStatusBadge = (status: any) => {
//     if (status === "Approved" || status === true)
//       return <span className="badge bg-success text-white">✅ Approved</span>;
//     if (status === "Rejected" || status === false)
//       return <span className="badge bg-danger text-white">❌ Rejected</span>;
//     return <span className="badge bg-secondary text-white">⏳ Pending</span>;
//   };

//   // columns
//   const colDef1 = useMemo(() => {
//     if (!rowData.length) return [];

//     // build keys from first row but ensure 'status' exists
//     const firstRow = rowData[0] || {};
//     const keys = Object.keys(firstRow).filter((k) => !regex.test(k) && k !== "id" && k !== "student_id");

//     const cols: any[] = [];

//     // Force-add status as first column (so it always appears)
//     cols.push({
//       field: "status",
//       headerName: "Status",
//       sortable: true,
//       filter: true,
//       resizable: true,
//       width: 120,
//       cellRenderer: (params: any) => getStatusBadge(params.value),
//     });

//     // Add remaining keys (skipping status because we already added it)
//     keys.forEach((field) => {
//       if (field === "status") return;

//       if (field === "upload_certificate") {
//         cols.push({
//           field,
//           headerName: "Certificate",
//           sortable: true,
//           filter: true,
//           resizable: true,
//           cellRenderer: (params: any) => {
//             const documentId = params.value;
//             const userId = params.data?.user_id;
//             const token = getCookie("access_token");

//             const handleDownload = async (e: any) => {
//               e.stopPropagation();
//               try {
//                 const url = `${apiConfig.API_BASE_URL}/student?document_id=${documentId}&queryId=GET_DOCUMENT&dmsRole=admin&user_id=${userId}`;
//                 const res = await fetch(url, {
//                   headers: { Authorization: `Bearer ${token}` },
//                   credentials: "include",
//                 });
//                 if (!res.ok) throw new Error("Download failed");
//                 const blob = await res.blob();
//                 const downloadUrl = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = downloadUrl;
//                 const disposition = res.headers.get("Content-Disposition") || "";
//                 const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
//                 a.download = filenameMatch ? filenameMatch[1] : `certificate_${params.data.id}`;
//                 document.body.appendChild(a);
//                 a.click();
//                 a.remove();
//                 window.URL.revokeObjectURL(downloadUrl);
//               } catch (err) {
//                 console.error("Download error:", err);
//               }
//             };

//             return (
//               <button className="btn btn-sm btn-primary" onClick={handleDownload}>
//                 Download
//               </button>
//             );
//           },
//         });
//       } else {
//         cols.push({
//           field,
//           headerName: field,
//           sortable: true,
//           filter: true,
//           resizable: true,
//           // make sure course_completion_date displays nicely if it exists
//           valueFormatter: (params: any) => {
//             if (field === "course_completion_date" && params.value) {
//               try {
//                 const d = new Date(params.value);
//                 if (!isNaN(d.getTime())) return d.toLocaleString();
//               } catch {
//                 return params.value;
//               }
//             }
//             return params.value ?? "";
//           },
//         });
//       }
//     });

//     // action column
//     cols.push({
//       headerName: "Action",
//       field: "action",
//       width: 120,
//       cellRenderer: (params: any) => (
//         <button className="btn btn-primary btn-sm" onClick={() => navigate(`/edit/certificate/${params.data.id}`)}>
//           Edit
//         </button>
//       ),
//     });

//     return cols;
//   }, [rowData, navigate]);

//   if (isFetching) return <div>Loading...</div>;

//   return (
//     <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDef1}
//         defaultColDef={{ flex: 1, minWidth: 100 }}
//         pagination
//         paginationPageSize={10}
//         animateRows
//       />
//     </div>
//   );
// };

// export default UpdateCertificate;
