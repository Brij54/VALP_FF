// import React, { useState, useEffect } from "react";
// import apiConfig from "../../config/apiConfig";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   ColDef,
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// import CertificateModel from "../../models/CertificateModel";
// import { jwtDecode } from "jwt-decode";

// ModuleRegistry.registerModules([AllCommunityModule]);

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

// // ---- SAME BADGE LOGIC AS UpdateCertificate / Edit ----
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

//   // Pending
//   return (
//     <span className="badge bg-warning text-dark">⏳ Pending</span>
//   );
// };

// const ReadCertificate = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<ColDef[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<any>(false);

//   const regex = /^(g_|archived|extra_data)/;

//   // ------------------- FETCH RESOURCE DATA -------------------
//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "certificate"],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);

//       const accessToken = getCookie("access_token");
//       if (!accessToken) {
//         throw new Error("Access token not found");
//       }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("certificate")}?` + params.toString(),
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error: " + response.status);
//       }

//       const data = await response.json();
//       setFetchedData(data.resource || []);
//       return data;
//     },
//   });

//   // ------------------- FETCH METADATA -------------------
//   const {
//     data: dataResMeta,
//     isLoading: isLoadingDataResMeta,
//     error: errorDataResMeta,
//   } = useQuery({
//     queryKey: ["resourceMetaData", "certificate"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
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

//   // ----------------- CONVERT API DATA -> MODEL -> JSON -----------------
//   useEffect(() => {
//     if (fetchData && fetchData.length > 0) {
//       const modelObjects = fetchData.map((obj: any) =>
//         CertificateModel.fromJson(obj)
//       );
//       const jsonObjects = modelObjects.map((model: any) => model.toJson());
//       setRowData(jsonObjects);
//     } else {
//       setRowData([]);
//     }
//   }, [fetchData]);

//   // ----------------- BUILD COLUMN DEFS WITH STATUS BADGE -----------------
//   useEffect(() => {
//     const data = fetchData || [];
//     const flds = requiredFields.filter((field: any) => field !== "id") || [];

//     const columns: ColDef[] = flds.map((field: any) => {
//   const baseCol: ColDef = {
//     field: field,
//     headerName: field,
//     editable: false,
//     resizable: true,
//     sortable: true,
//     filter: true,
//   };

//   // ------------------ STATUS COLUMN ------------------
//   if (String(field).toLowerCase() === "status") {
//     return {
//       ...baseCol,
//       headerName: "Status",
//       cellRenderer: (params: any) => getStatusBadge(params.value),
//     };
//   }

// const getUserIdFromToken = () => {
//   const token = getCookie("access_token");
//   if (!token) return null;

//   try {
//     const decoded: any = jwtDecode(token);
//     return decoded?.sub || null;
//   } catch (e) {
//     console.error("Token decode failed:", e);
//     return null;
//   }
// };

// console.log(getUserIdFromToken());



//   // ------------------ UPLOAD CERTIFICATE (DOWNLOAD BUTTON) ------------------
//   if (field === "upload_certificate") {
//     return {
//       ...baseCol,
//       headerName: "Certificate",
//       cellRenderer: (params: any) => {
//         const documentId = params.value;
//         const userId = getUserIdFromToken(); // used internally

//         const handleDownload = async (e: any) => {
//           e.stopPropagation();
//           const accessToken = getCookie("access_token");

//           try {
//             const url =
//               `${apiConfig.API_BASE_URL}/certificate` +
//               `?document_id=${documentId}&queryId=GET_DOCUMENT` +
//               `&dmsRole=admin&user_id=${userId}`;

//             const response = await fetch(url, {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//               },
//               credentials: "include",
//             });

//             if (!response.ok) throw new Error("Download failed " + response.status);

//             const blob = await response.blob();
//             const downloadUrl = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = downloadUrl;

//             const filename =
//               response.headers
//                 .get("Content-Disposition")
//                 ?.split("filename=")[1]
//                 ?.replace(/['"]/g, "") || "certificate.pdf";

//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(downloadUrl);
//           } catch (err) {
//             console.error("Download error:", err);
//           }
//         };

//         return (
//           <button
//             onClick={handleDownload}
//             style={{
//               backgroundColor: "#1976d2",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               padding: "4px 8px",
//               cursor: "pointer",
//             }}
//           >
//             Download
//           </button>
//         );
//       },
//     };
//   }

//   // ---------- Default fields ----------
//   return baseCol;
// });

//     setColDef1(columns);
//   }, [fetchData, requiredFields]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   return (
//     <div>
//       <div>
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

// export default ReadCertificate;

import React, { useState, useEffect, useContext } from "react";
import apiConfig from "../../config/apiConfig";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import CertificateModel from "../../models/CertificateModel";
import { LoginContext } from "../../context/LoginContext";
import { fetchForeignResource } from "../../apis/resources";

ModuleRegistry.registerModules([AllCommunityModule]);

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

// ---- Status badge ----
const getStatusBadge = (status: any) => {
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
  return (
    <span className="badge bg-warning text-dark">⏳ Pending</span>
  );
};

const ReadCertificate = () => {
  const { user } = useContext(LoginContext);          // logged-in user
  const userEmail = user?.email_id?.toLowerCase() || "";

  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<ColDef[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const regex = /^(g_|archived|extra_data)/;

  // ----------- fetch Student list (to resolve studentId from email) -----------
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchForeignResource("Student"),
    enabled: !!userEmail,                       // only once we know who is logged in
  });

  useEffect(() => {
    if (!studentsData || !userEmail) return;

    // fetchForeignResource("Student") returns an array of students
    const students: any[] = Array.isArray(studentsData)
      ? studentsData
      : studentsData.resource || [];

    const match = students.find(
      (s: any) =>
        s.email && s.email.toLowerCase() === userEmail
    );

    if (match?.id) {
      setStudentId(match.id);
    } else {
      console.warn("No Student found for email:", userEmail);
      setStudentId(null);
    }
  }, [studentsData, userEmail]);

  // ------------------- FETCH CERTIFICATE DATA (ALL) -------------------
  useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

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

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      const all = data.resource || [];
      setAllCertificates(all);
      return data;
    },
    enabled: !!userEmail, // don't even bother until we know the user
  });

  // --------------- FETCH METADATA -----------------
  useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const response = await fetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);

      setRequiredFields(required || []);
      return data;
    },
  });

  // --------------- FILTER CERTIFICATES BY studentId -----------------
  useEffect(() => {
    if (!studentId) {
      // if we couldn't resolve studentId, show nothing (or show all if you prefer)
      setFilteredCertificates([]);
      return;
    }

    const filtered = allCertificates.filter(
      (c: any) => c.student_id === studentId
    );
    setFilteredCertificates(filtered);
  }, [allCertificates, studentId]);

  // --------------- Convert -> model -> JSON for grid -----------------
  useEffect(() => {
    if (filteredCertificates && filteredCertificates.length > 0) {
      const modelObjects = filteredCertificates.map((obj: any) =>
        CertificateModel.fromJson(obj)
      );
      const jsonObjects = modelObjects.map((m: any) => m.toJson());
      setRowData(jsonObjects);
    } else {
      setRowData([]);
    }
  }, [filteredCertificates]);

  // --------------- Build column defs (hide student_id, style status, download) ---------------
  useEffect(() => {
    const flds =
      requiredFields.filter(
        (field: any) => field !== "id" && field !== "student_id"
      ) || [];

    const columns: ColDef[] = flds.map((field: any) => {
      const baseCol: ColDef = {
        field,
        headerName: field,
        editable: false,
        resizable: true,
        sortable: true,
        filter: true,
      };

      if (String(field).toLowerCase() === "status") {
        return {
          ...baseCol,
          headerName: "Status",
          cellRenderer: (params: any) => getStatusBadge(params.value),
        };
      }

      if (field === "upload_certificate") {
        return {
          ...baseCol,
          headerName: "Certificate",
          cellRenderer: (params: any) => {
            const documentId = params.value;
            const handleDownload = async (e: any) => {
              e.stopPropagation();
              const accessToken = getCookie("access_token");

              try {
                const url =
                  `${apiConfig.API_BASE_URL}/certificate` +
                  `?document_id=${documentId}&queryId=GET_DOCUMENT` +
                  `&dmsRole=admin&user_id=${userEmail}`;

                const response = await fetch(url, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                });

                if (!response.ok)
                  throw new Error("Download failed " + response.status);

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
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
              } catch (err) {
                console.error("Download error:", err);
              }
            };

            return (
              <button
                onClick={handleDownload}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            );
          },
        };
      }

      return baseCol;
    });

    setColDef1(columns);
  }, [requiredFields, userEmail]);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  };

  return (
    <div>
      {rowData.length === 0 && colDef1.length === 0 ? (
        <div>No data available. Please add a resource attribute.</div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDef1}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            rowSelection="multiple"
          />
        </div>
      )}

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
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

export default ReadCertificate;
