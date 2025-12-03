// import React, { useState, useEffect, useMemo } from "react";
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

// // -------------------- STATUS BADGE --------------------
// const getStatusBadge = (status: any) => {
//   const s = String(status).toLowerCase();

//   const badgeStyle = {
//     fontSize: "14px",
//     padding: "6px 12px",
//     borderRadius: "8px",
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

// // -------------------- VIEW + DOWNLOAD BUTTON --------------------
// const ViewDownloadRenderer = (params: any) => {
//   const documentId = params.value;

//   const handleView = (e: any) => {
//     e.stopPropagation();
//     params.context.handleViewPdf(documentId);
//   };

//   const handleDownload = (e: any) => {
//     e.stopPropagation();
//     params.context.handleDownload(documentId);
//   };

//   return (
//     <div className="d-flex gap-1">
//       <button
//         onClick={handleView}
//         className="btn btn-info"
//         style={{
//           fontSize: "12px",
//           padding: "6px 8px",
//           marginTop: "6px",
//           borderRadius: "8px",
//           fontWeight: 500,
//         }}
//       >
//         View
//       </button>

//       <button
//         onClick={handleDownload}
//         className="btn btn-primary"
//         style={{
//           fontSize: "12px",
//           padding: "6px 8px",
//           marginTop: "6px",
//           borderRadius: "8px",
//           fontWeight: 500,
//         }}
//       >
//         Download
//       </button>
//     </div>
//   );
// };

// // -------------------- ACTION RENDERER --------------------
// const ActionCellRenderer = (props: any) => {
//   const handleEdit = () => props.context.handleUpdate(props.data.id);

//   return (
//     <button
//       className="btn btn-warning"
//       style={{
//         fontSize: "12px",
//         padding: "6px 15px",
//         borderRadius: "8px",
//         fontWeight: 500,
//       }}
//       onClick={handleEdit}
//     >
//       Edit
//     </button>
//   );
// };

// // ==========================================================
// //                    MAIN COMPONENT
// // ==========================================================
// const UpdateCertificate = () => {
//   const navigate = useNavigate();
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const regex = /^(g_|archived|extra_data)/;

//   // PDF Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState("");

//   // -------------------- VIEW PDF FUNCTION --------------------
//   const handleViewPdf = async (documentId: string) => {
//     const accessToken = getCookie("access_token");

//     const url =
//       `${apiConfig.API_BASE_URL}/certificate` +
//       `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//       `&dmsRole=admin&user_id=admin@rasp.com`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const blob = await response.blob();
//     const fileURL = URL.createObjectURL(blob);

//     setPdfUrl(fileURL);
//     setShowModal(true);
//   };

//   // -------------------- DOWNLOAD PDF FUNCTION --------------------
//   const handleDownload = async (documentId: string) => {
//     const accessToken = getCookie("access_token");

//     const url =
//       `${apiConfig.API_BASE_URL}/certificate` +
//       `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//       `&dmsRole=admin&user_id=admin@rasp.com`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const blob = await response.blob();
//     const downloadUrl = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = downloadUrl;

//     const filename =
//       response.headers
//         .get("Content-Disposition")
//         ?.split("filename=")[1]
//         ?.replace(/['"]/g, "") || "certificate.pdf";

//     a.download = filename;
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(downloadUrl);
//   };

//   // ---------------- FETCH METADATA ----------------
//   const { error: metaError, isLoading: metaLoading } = useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`
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

//   // ---------------- FETCH CERTIFICATES + ENRICH ----------------
//   const { error: dataError, isLoading: dataLoading } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const token = getCookie("access_token");

//       const res = await fetch(
//         `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const json = await res.json();
//       const rawRows = json.resource || [];

//       const enrichedRows = await Promise.all(
//         rawRows.map(async (row: any) => {
//           const studentParams = new URLSearchParams({
//             queryId: "GET_STUDENT_BY_CERTIFICATE",
//             args: "student_id:" + row.student_id,
//           });

//           const studentRes = await fetch(
//             `${apiConfig.getResourceUrl(
//               "certificate"
//             )}?${studentParams.toString()}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           if (studentRes.ok) {
//             const stuJson = await studentRes.json();
//             const stu = stuJson.resource[0];

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

//   // ============================================================
//   //            COLUMN DEFINITIONS
//   // ============================================================
//   const colDefs = useMemo(() => {
//     return [
//       { headerName: "Roll Number", field: "roll_no", sortable: true, filter: true },
//       { headerName: "Student Name", field: "student_name", sortable: true, filter: true },
//       { headerName: "Course", field: "course_name", sortable: true, filter: true },
//       { headerName: "Platform", field: "platform", sortable: true, filter: true },
//       { headerName: "Completion Date", field: "course_completion_date", sortable: true, filter: true },
//       { headerName: "Status", field: "status", cellRenderer: (p: any) => getStatusBadge(p.value) },
//       {
//         headerName: "Certificate",
//         field: "upload_certificate",
//         cellRenderer: ViewDownloadRenderer,
//       },
//       {
//         headerName: "Action",
//         field: "Action",
//         cellRenderer: ActionCellRenderer,
//       },
//     ];
//   }, [rowData]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 120,
//     resizable: true,
//     editable: false,
//   };

//   return (
//     <>
//       <div className="ag-theme-alpine" style={{ height: 500 }}>
//         {metaLoading || dataLoading ? (
//           <div>Loading...</div>
//         ) : metaError || dataError ? (
//           <div>Error loading data...</div>
//         ) : (
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={colDefs}
//             defaultColDef={defaultColDef}
//             pagination={true}
//             paginationPageSize={10}
//             animateRows={true}
//             context={{ handleUpdate, handleViewPdf, handleDownload }}
//           />
//         )}
//       </div>

//       {/* ---------- PDF MODAL ---------- */}
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

// -------------------- authFetch (INSIDE) --------------------
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

  // attach Authorization automatically (if not already passed)
  const token = getCookie("access_token");
  const headersObj = finalInit.headers as Record<string, string>;
  if (token && !headersObj?.Authorization) {
    headersObj.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(input, finalInit);

  // ✅ Global 401 handling
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

  const badgeStyle = {
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "8px",
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

// -------------------- VIEW + DOWNLOAD BUTTON --------------------
const ViewDownloadRenderer = (params: any) => {
  const documentId = params.value;

  const handleView = (e: any) => {
    e.stopPropagation();
    params.context.handleViewPdf(documentId);
  };

  const handleDownload = (e: any) => {
    e.stopPropagation();
    params.context.handleDownload(documentId);
  };

  return (
    <div className="d-flex gap-1">
      <button
        onClick={handleView}
        className="btn btn-info"
        style={{
          fontSize: "12px",
          padding: "6px 8px",
          marginTop: "6px",
          borderRadius: "8px",
          fontWeight: 500,
        }}
      >
        View
      </button>

      <button
        onClick={handleDownload}
        className="btn btn-primary"
        style={{
          fontSize: "12px",
          padding: "6px 8px",
          marginTop: "6px",
          borderRadius: "8px",
          fontWeight: 500,
        }}
      >
        Download
      </button>
    </div>
  );
};

// -------------------- ACTION RENDERER --------------------
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => props.context.handleUpdate(props.data.id);

  return (
    <button
      className="btn btn-warning"
      style={{
        fontSize: "12px",
        padding: "6px 15px",
        borderRadius: "8px",
        fontWeight: 500,
      }}
      onClick={handleEdit}
    >
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

  // PDF Modal State
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // -------------------- VIEW PDF FUNCTION --------------------
  const handleViewPdf = async (documentId: string) => {
    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const response = await authFetch(url, {
      method: "GET",
    });

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    setPdfUrl(fileURL);
    setShowModal(true);
  };

  // -------------------- DOWNLOAD PDF FUNCTION --------------------
  const handleDownload = async (documentId: string) => {
    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const response = await authFetch(url, {
      method: "GET",
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
  };

  // ---------------- FETCH METADATA ----------------
  const { error: metaError, isLoading: metaLoading } = useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const res = await authFetch(`${apiConfig.getResourceMetaDataUrl("certificate")}?`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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
            `${apiConfig.getResourceUrl("certificate")}?${studentParams.toString()}`,
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

  // ============================================================
  //            COLUMN DEFINITIONS
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
      { headerName: "Course", field: "course_name", sortable: true, filter: true },
      { headerName: "Platform", field: "platform", sortable: true, filter: true },
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
        cellRenderer: ViewDownloadRenderer,
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
    <>
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
            context={{ handleUpdate, handleViewPdf, handleDownload }}
          />
        )}
      </div>

      {/* ---------- PDF MODAL ---------- */}
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
