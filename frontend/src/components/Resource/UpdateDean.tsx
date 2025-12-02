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

//   const UpdateDean = () => {
//    const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [editedData, setEditedData] = useState<any>({});
//   const [showToast, setShowToast] = useState<any>(false);
//   const navigate = useNavigate();
//   const apiUrl = `${apiConfig.getResourceUrl('dean')}?`
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Dean')}?`
//   const BaseUrl = `${apiConfig.API_BASE_URL}`;
//   const regex = /^(g_|archived|extra_data)/;

//    const [currentUrl, setCurrentUrl] = useState('');
//     // Fetch resource data
//     const {data:dataRes,isLoading:isLoadingDataRes,error:errorDataRes}= useQuery({
//     queryKey: ['resourceData', 'dean'],
//      queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);
//        const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     throw new Error("Access token not found");
//   }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl('dean')}?` + params.toString(),
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
//     queryKey: ['resourceMetaData', 'dean'],
//    queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl('dean')}?`,
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

//     navigate(`/edit/dean/${id}`);
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

// export default UpdateDean

import React, { useState, useEffect } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

// cookie fetcher
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/* -----------------------------------------
    🔥 Pretty Header (snake_case → Title Case)
-------------------------------------------*/
const prettifyHeader = (str: string) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
};

/* -----------------------------------------
    🔥 Custom Edit Button
-------------------------------------------*/
const EditButton = ({ id, handleUpdate }: any) => {
  return (
    <button
      className="btn btn-warning"
      style={{
        fontSize: "16px",
        marginBottom: "6px",
        width: "100px",
        padding: "6px 14px",
        borderRadius: "8px",
        marginRight: "8px",
        fontWeight: 500,
      }}
      onClick={() => handleUpdate(id)}
    >
      Edit
    </button>
  );
};

/* -----------------------------------------
    🔥 Custom View Signature Button
-------------------------------------------*/
const ViewButton = ({ documentId, onView }: any) => {
  if (!documentId) return null;

  return (
    <button
      className="btn btn-info"
      style={{
        marginBottom: "6px",
        width: "100px",
        fontSize: "16px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 500,
      }}
      onClick={() => onView(documentId)}
    >
      View
    </button>
  );
};

const UpdateDean = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<ColDef[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiUrl = `${apiConfig.getResourceUrl("dean")}?`;
  const regex = /^(g_|archived|extra_data)/;

  /* -----------------------------------------
      Fetch ALL Dean Records
  -------------------------------------------*/
  useQuery({
    queryKey: ["resourceDataDean"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(apiUrl + params.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error: " + response.status);
      const data = await response.json();

      setFetchedData(data.resource || []);
      return data;
    },
  });

  /* -----------------------------------------
      Fetch Metadata (Field names)
  -------------------------------------------*/
  useQuery({
    queryKey: ["resourceMetaDataDean"],
    queryFn: async () => {
      const response = await fetch(
        apiConfig.getResourceMetaDataUrl("dean") + "?",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      const required = data[0]?.fieldValues
        .filter((f: any) => !regex.test(f.name))
        .map((f: any) => f.name);

      setRequiredFields(required || []);
      return data;
    },
  });

  /* -----------------------------------------
      When metadata + data loaded → build table
  -------------------------------------------*/
  useEffect(() => {
    const data = fetchData || [];

    const fields = requiredFields.filter((field) => field !== "id") || [];

    const columns: ColDef[] = fields.map((field: string) => {
      if (field === "signature") {
        return {
          field,
          headerName: "Signature",
          width: 160,
          cellRenderer: (params: any) => {
            const documentId = params.value;

            return (
              <ViewButton
                documentId={documentId}
                onView={handleViewSignature}
              />
            );
          },
        };
      }

      return {
        field,
        headerName: prettifyHeader(field),
        editable: false,
        resizable: true,
        sortable: true,
        filter: true,
      };
    });

    // 🎯 Add Action Column
    columns.push({
      headerName: "Action",
      field: "action",
      width: 150,
      cellRenderer: (params: any) => (
        <EditButton id={params.data.id} handleUpdate={handleUpdate} />
      ),
    });

    setColDef1(columns);
    setRowData(data);
  }, [fetchData, requiredFields]);

  /* -----------------------------------------
      VIEW SIGNATURE (Image/PDF)
  -------------------------------------------*/
  const handleViewSignature = async (documentId: any) => {
    try {
      const accessToken = getCookie("access_token");

      const url =
        `${apiConfig.API_BASE_URL}/dean` +
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

      if (!response.ok) throw new Error("Unable to fetch signature");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    } catch (err) {
      console.error("Signature View Error:", err);
    }
  };

  /* -----------------------------------------
      EDIT Navigation
  -------------------------------------------*/
  const handleUpdate = (id: any) => {
    navigate(`/edit/dean/${id}`);
  };

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    editable: false,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#2b3a67",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Dean List
      </h2>

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDef1}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
        />
      </div>

      {/* SIGNATURE PREVIEW MODAL */}
      {previewUrl && (
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
            zIndex: 2000,
          }}
          onClick={() => setPreviewUrl(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "600px",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <img
              src={previewUrl}
              alt="Signature Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDean;
