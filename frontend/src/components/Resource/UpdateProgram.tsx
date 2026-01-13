// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeAlpine,
//   themeBalham,
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";

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
// const ActionCellRenderer = (props: any) => {
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
//   resource: string;
//   fieldValues: any[];
// };
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//   return null;
// };

// const UpdateProgram = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl("program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Program")}?`;
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//   const [currentUrl, setCurrentUrl] = useState("");
//   // Fetch resource data
//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "programUpdate"],
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
//       setFetchedData(data.resource || []);
//       const initialEditedData = fetchData.reduce((acc: any, item: any) => {
//         acc[item.id] = { ...item };
//         return acc;
//       }, {});
//       return data;
//     },
//   });

//   // Fetch metadata
//   const {
//     data: dataResMeta,
//     isLoading: isLoadingDataResMeta,
//     error: errorDataResMeta,
//   } = useQuery({
//     queryKey: ["resourceMetaData", "programUpdate"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("program")}?`,
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

//   const handleEdit = (id: any, field: string, value: string) => {
//     setEditedData((prevData: any) => ({
//       ...prevData,
//       [id]: {
//         ...(prevData[id] || {}),
//         [field]: value,
//       },
//     }));
//   };

//   const handleUpdate = async (id: any) => {
//     navigate(`/edit/program/${id}`);
//   };

//   useEffect(() => {
//     const data = fetchData || [];
//     const fields = requiredFields.filter((field) => field !== "id") || [];

//     const columns = fields.map((field) => ({
//       field: field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true,
//     }));

//     // Add the Action column with the custom cell renderer
//     columns.push({
//       headerName: "Action",
//       field: "Action",
//       cellRenderer: ActionCellRenderer,
//       editable: false,
//       resizable: true,
//       sortable: false,
//       filter: false,
//       width: 120,
//     } as ColumnDef);
//     setColDef1(columns);
//     setRowData(data);
//   }, [fetchData, requiredFields]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   return (
//     <div>
//       <div className="">
//         {rowData.length === 0 && colDef1.length === 0 ? (
//           <div>No data available. Please add a resource attribute.</div>
//         ) : (
//           <div
//             className="ag-theme-alpine"
//             style={{ height: 500, width: "100%" }}
//           >
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={colDef1}
//               defaultColDef={defaultColDef}
//               pagination={true}
//               paginationPageSize={10}
//               animateRows={true}
//               rowSelection="multiple"
//               context={{
//                 handleUpdate: handleUpdate,
//               }}
//             />
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

// export default UpdateProgram;

// import React, { useMemo, useRef, useState } from "react";
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

// // -------------------- FORMAT HEADER --------------------
// const formatHeaderName = (field: string) =>
//   field
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

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

// const UpdateProgram = () => {
//   const navigate = useNavigate();
//   const gridRef = useRef<AgGridReact>(null);

//   const [rowData, setRowData] = useState<any[]>([]);
//   const regex = /^(g_|archived|extra_data)/;

//   // ---------------- FETCH METADATA ----------------
//   const { data: metaData } = useQuery({
//     queryKey: ["programMetaData"],
//     queryFn: async () => {
//       const res = await fetch(
//         apiConfig.getResourceMetaDataUrl("program")
//       );
//       if (!res.ok) throw new Error("Metadata load failed");
//       return res.json();
//     },
//   });

//   // ---------------- FETCH PROGRAM DATA ----------------
//   useQuery({
//     queryKey: ["programData"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const token = getCookie("access_token");

//       const res = await fetch(
//         `${apiConfig.getResourceUrl("program")}?${params.toString()}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Program load failed");

//       const json = await res.json();
//       setRowData(json.resource || []);
//       return json.resource;
//     },
//   });

//   const handleUpdate = (id: any) => navigate(`/edit/program/${id}`);

//   // ============================================================
//   //            COLUMN DEFINITIONS (REFERENCE STYLE)
//   // ============================================================
//   const colDefs = useMemo<ColDef[]>(() => {
//     if (!metaData?.[0]?.fieldValues) return [];

//     const fields = metaData[0].fieldValues
//       .filter((f: any) => !regex.test(f.name))
//       .map((f: any) => f.name)
//       .filter((f: string) => f !== "id");

//     const dynamicCols: ColDef[] = fields.map((field:any) => ({
//       headerName: formatHeaderName(field),
//       field,
//       sortable: true,
//       filter: true,
//     }));

//     return [
//       ...dynamicCols,
//       {
//         headerName: "Action",
//         field: "action",
//         cellRenderer: ActionCellRenderer,
//         sortable: false,
//         filter: false,
//         width: 120,
//       },
//     ];
//   }, [metaData]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 120,
//     resizable: true,
//     editable: false,
//     cellStyle: { display: "flex", alignItems: "center" },
//   };

//   return (
//     <>
//       <div className="ag-theme-alpine" style={{ height: 500 }}>
//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={colDefs}
//           defaultColDef={defaultColDef}
//           pagination
//           paginationPageSize={10}
//           animateRows
//           context={{ handleUpdate }}
//         />
//       </div>
//     </>
//   );
// };

// export default UpdateProgram;

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

//   const UpdateProgram = () => {
//    const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl('program')}?`
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Program')}?`
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//    const [currentUrl, setCurrentUrl] = useState('');
//     // Fetch resource data
//     const {data:dataRes,isLoading:isLoadingDataRes,error:errorDataRes}= useQuery({
//     queryKey: ['resourceData', 'programUpdate'],
//      queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);
//        const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     throw new Error("Access token not found");
//   }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl('program')}?` + params.toString(),
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
//     queryKey: ['resourceMetaData', 'programUpdate'],
//    queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl('program')}?`,
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

//     const handleEdit = (id: any, field: string, value: any) => {
//       setEditedData((prevData: any) => ({
//         ...prevData,
//         [id]: {
//           ...(prevData[id] || {}),
//           [field]: value,
//         },
//       }));
//     };

//     const handleUpdate = async (id: any) => {

//     navigate(`/edit/program/${id}`);
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

// export default UpdateProgram

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ColumnDef {
  field: string;
  headerName: string;
  editable: boolean;
  resizable: boolean;
  sortable: boolean;
  filter: boolean;
  cellRenderer?: (params: any) => React.ReactNode;
}

// ---------------- ACTION CELL (UI ONLY CHANGE) ----------------
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => {
    props.context.handleUpdate(props.data.id);
  };

  return (
    <button
      onClick={handleEdit}
      className="btn btn-outline-primary"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
    >
      Edit
    </button>
  );
};

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const UpdateProgram = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [editedData, setEditedData] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);

  const navigate = useNavigate();
  const regex = /^(g_|archived|extra_data)/;

  // ---------------- FETCH PROGRAM DATA ----------------
  useQuery({
    queryKey: ["resourceData", "programUpdate"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(
        `${apiConfig.getResourceUrl("program")}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      setFetchedData(data.resource || []);
      return data.resource;
    },
  });

  // ---------------- FETCH METADATA ----------------
  useQuery({
    queryKey: ["resourceMetaData", "programUpdate"],
    queryFn: async () => {
      const response = await fetch(apiConfig.getResourceMetaDataUrl("program"));

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      setResMetaData(data);
      setFields(data[0]?.fieldValues || []);

      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);

      setRequiredFields(required || []);
      return data;
    },
  });

  const handleUpdate = (id: any) => {
    navigate(`/edit/program/${id}`);
  };

  // ---------------- BUILD GRID COLUMNS ----------------
  useEffect(() => {
    const data = fetchData || [];
    const visibleFields =
      requiredFields.filter((field) => field !== "id") || [];

    const columns = visibleFields.map((field) => ({
      field,
      headerName: field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      editable: false,
      resizable: true,
      sortable: true,
      filter: true,
    }));

    columns.push({
      headerName: "Action",
      field: "Action",
      cellRenderer: ActionCellRenderer,
      editable: false,
      resizable: true,
      sortable: false,
      filter: false,
      width: 120,
    } as ColumnDef);

    setColDef1(columns);
    setRowData(data);
  }, [fetchData, requiredFields]);

  const defaultColDef = {
    flex: 1,
    minWidth: 120,
    editable: false,
    resizable: true,
  };

  // ---------------- UI ONLY UPDATED ----------------
  return (
    <div style={{ padding: "16px" }}>
      {rowData.length === 0 && colDef1.length === 0 ? (
        <div>No data available. Please add a resource attribute.</div>
      ) : (
        <div
          className="ag-theme-alpine"
          style={{
            height: 500,
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={colDef1}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            animateRows
            rowSelection="multiple"
            context={{ handleUpdate }}
          />
        </div>
      )}

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              />
            </div>
            <div className="toast-body text-success text-center">
              Created successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProgram;
