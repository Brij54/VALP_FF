// import React, { useState } from "react";
// import { useEffect } from "react";
// import apiConfig from "../../config/apiConfig";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
//   themeAlpine,
//   themeBalham,
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// // ADDED: Import your generated model file dynamically
// import Program_registrationModel from "../../models/Program_registrationModel";
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

// const ReadProgram_registration = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<any>(false);

//   const regex = /^(g_|archived|extra_data)/;
//   const apiUrl = `${apiConfig.getResourceUrl("program_registration")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl(
//     "Program_registration"
//   )}?`;
//   const BaseUrl = "${apiConfig.API_BASE_URL}";
//   // Fetch resource data

//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams();

//       const queryId: any = "GET_ALL";
//       params.append("queryId", queryId);

//       const accessToken = getCookie("access_token");

//       if (!accessToken) {
//         throw new Error("Access token not found");
//       }

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("program_registration")}?` +
//           params.toString(),
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
//       // return data;
//     },
//   });

//   const {
//     data: dataResMeta,
//     isLoading: isLoadingDataResMeta,
//     error: errorDataResMeta,
//   } = useQuery({
//     queryKey: ["resourceMetaData", "program_registration"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("program_registration")}?`,
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

//   // --- Transform API data into model objects and then JSON ---
//   useEffect(() => {
//     if (fetchData && fetchData.length > 0) {
//       //ADDED: Convert array of plain objects → array of model instances
//       const modelObjects = fetchData.map((obj: any) =>
//         Program_registrationModel.fromJson(obj)
//       );

//       // ADDED: Convert array of model instances → array of JSON objects (for ag-grid)
//       const jsonObjects = modelObjects.map((model: any) => model.toJson());

//       // ADDED: Set final array for AgGrid
//       setRowData(jsonObjects);
//     }
//   }, [fetchData]);

//   useEffect(() => {
//     const data = fetchData || [];
//     const fields = requiredFields.filter((field: any) => field !== "id") || [];

//     const columns = fields.map((field: any) => ({
//       field: field,
//       headerName: field,
//       editable: false,
//       resizable: true,
//       sortable: true,
//       filter: true,
//     }));

//     setColDef1(columns);
//   }, [fetchData, requiredFields]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };
//   // add new code
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

// export default ReadProgram_registration;
// import React, { useEffect, useState } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// import Program_registrationModel from "../../models/Program_registrationModel";

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

// const ReadProgram_registration = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<ColDef[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);

//   const regex = /^(g_|archived|extra_data)/;

//   // -------------------- FETCH RESOURCE DATA --------------------
//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token not found");

//       const res = await fetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) throw new Error(`Error: ${res.status}`);
//       return res.json();
//     },
//   });

//   // -------------------- FETCH METADATA --------------------
//   const {
//     data: metaRes,
//     isLoading: isLoadingMeta,
//     error: errorMeta,
//   } = useQuery({
//     queryKey: ["resourceMetaData", "program_registration"],
//     queryFn: async () => {
//       const res = await fetch(`${apiConfig.getResourceMetaDataUrl("program_registration")}?`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error(`Error: ${res.status}`);
//       return res.json();
//     },
//   });

//   // -------------------- BUILD COLUMNS FROM METADATA --------------------
//   useEffect(() => {
//     if (!metaRes || !Array.isArray(metaRes) || metaRes.length === 0) return;

//     const required =
//       metaRes[0]?.fieldValues
//         ?.filter((f: any) => !regex.test(f.name))
//         ?.map((f: any) => f.name) || [];

//     setRequiredFields(required);

//     const cols: ColDef[] = required
//       .filter((f: string) => f !== "id")
//       .map((field: string) => ({
//         field,
//         headerName: field,
//         sortable: true,
//         filter: true,
//         resizable: true,
//       }));

//     setColDef1(cols);
//   }, [metaRes]);

//   // -------------------- SET ROW DATA SAFELY --------------------
//   useEffect(() => {
//     if (!dataRes) return;

//     // ✅ force resource into array
//     const raw = Array.isArray(dataRes.resource)
//       ? dataRes.resource
//       : dataRes.resource
//         ? [dataRes.resource]
//         : [];

//     // ✅ convert to model -> json
//     const jsonObjects = raw.map((obj: any) =>
//       Program_registrationModel.fromJson(obj).toJson()
//     );

//     setRowData(jsonObjects);
//   }, [dataRes]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 100,
//     editable: false,
//   };

//   // -------------------- UI STATES --------------------
//   if (isLoadingDataRes || isLoadingMeta) return <div>Loading...</div>;
//   if (errorDataRes || errorMeta)
//     return <div>Error loading data/metadata. Check console/network.</div>;

//   return (
//     <div>
//       {rowData.length === 0 ? (
//         <div>No data available.</div>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={colDef1}
//             defaultColDef={defaultColDef}
//             pagination={true}
//             paginationPageSize={10}
//             animateRows={true}
//             rowSelection="multiple"
//           />
//         </div>
//       )}

//       {showToast && (
//         <div
//           className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//           style={{ zIndex: 1550 }}
//         >
//           <div className="toast show">
//             <div className="toast-header">
//               <strong className="me-auto">Success</strong>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setShowToast(false)}
//               />
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

// export default ReadProgram_registration;
// import React, { useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";
// import Program_registrationModel from "../../models/Program_registrationModel";

// ModuleRegistry.registerModules([AllCommunityModule]);

// export type ResourceMetaData = {
//   resource: string;
//   fieldValues: any[];
// };

// const regex = /^(g_|archived|extra_data)/;

// const prettifyHeader = (str: string) =>
//   (str || "")
//     .replace(/_/g, " ")
//     .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// const ReadProgram_registration = () => {
//   // -------------------- 1) FETCH DATA --------------------
//   const dataQuery = useQuery({
//     queryKey: ["resourceData", "program_registration"],
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });

//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!res.ok) throw new Error(`Data fetch failed: ${res.status}`);
//       return res.json();
//     },
//   });

//   // -------------------- 2) FETCH METADATA (IMPORTANT) --------------------
//   const metaQuery = useQuery({
//     queryKey: ["resourceMetaData", "program_registration"],
//     queryFn: async () => {
//       const res = await authFetch(
//         `${apiConfig.getResourceMetaDataUrl("program_registration")}?`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       if (!res.ok) throw new Error(`Metadata fetch failed: ${res.status}`);
//       return res.json();
//     },
//   });

//   // -------------------- 3) ROW DATA (MODEL -> JSON) --------------------
//   const rowData = useMemo(() => {
//     const json = dataQuery.data;

//     // backend might return { resource: [...] } OR directly [...]
//     const rawRows: any[] = Array.isArray(json) ? json : json?.resource || [];

//     return rawRows.map((obj: any) =>
//       Program_registrationModel.fromJson(obj).toJson()
//     );
//   }, [dataQuery.data]);

//   // -------------------- 4) COLUMN DEFS --------------------
//   const colDefs: ColDef[] = useMemo(() => {
//     const meta = metaQuery.data;

//     let fields: string[] = [];

//     if (Array.isArray(meta) && meta[0]?.fieldValues?.length) {
//       fields = meta[0].fieldValues
//         .map((f: any) => f.name)
//         .filter((name: string) => !regex.test(name));
//     } else if (rowData.length > 0) {
//       // fallback if metadata didn’t load
//       fields = Object.keys(rowData[0]).filter((name) => !regex.test(name));
//     }

//     fields = fields.filter((f) => f !== "id"); // optional

//     return fields.map((field) => ({
//       field,
//       headerName: prettifyHeader(field),
//       sortable: true,
//       filter: true,
//       resizable: true,
//     }));
//   }, [metaQuery.data, rowData]);

//   const defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 140,
//     editable: false,
//   };

//   // -------------------- 5) UI STATES --------------------
//   if (dataQuery.isLoading || metaQuery.isLoading) return <div>Loading...</div>;
//   if (dataQuery.isError) return <div>Error loading data.</div>;
//   if (metaQuery.isError) return <div>Error loading metadata.</div>;

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         defaultColDef={defaultColDef}
//         pagination={true}
//         paginationPageSize={10}
//         animateRows={true}
//       />
//     </div>
//   );
// };

// export default ReadProgram_registration;

import React, { useMemo, useContext } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "../../apis/authFetch";
import Program_registrationModel from "../../models/Program_registrationModel";
import { LoginContext } from "../../context/LoginContext";
import { fetchForeignResource } from "../../apis/resources";

ModuleRegistry.registerModules([AllCommunityModule]);

const regex = /^(g_|archived|extra_data)/;

const prettifyHeader = (str: string) =>
  (str || "")
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const ReadProgram_registration = () => {
  const { user } = useContext(LoginContext);
  const userEmail = user?.email_id?.toLowerCase() || "";

  // 1) Load student list to find current student's id
  const studentQuery = useQuery({
    queryKey: ["StudentListForRecords"],
    queryFn: async () => {
      const data: any = await fetchForeignResource("Student");
      return Array.isArray(data) ? data : data.resource || [];
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000,
  });

  const myStudentId = useMemo(() => {
    const students = studentQuery.data || [];
    const match = students.find((s: any) => s.email?.toLowerCase() === userEmail);
    return match?.id || null;
  }, [studentQuery.data, userEmail]);

  // 2) Fetch program list (to show program name instead of id)
  const programQuery = useQuery({
    queryKey: ["ProgramListForRecords"],
    queryFn: async () => {
      const data: any = await fetchForeignResource("Program");
      return Array.isArray(data) ? data : data.resource || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // 3) Fetch ALL program registrations (then filter by myStudentId)
  const dataQuery = useQuery({
    queryKey: ["resourceData", "program_registration"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error(`Data fetch failed: ${res.status}`);
      return res.json();
    },
    enabled: !!myStudentId, // wait until we know who the student is
  });

  // 4) Metadata (optional, but keeps columns consistent)
  const metaQuery = useQuery({
    queryKey: ["resourceMetaData", "program_registration"],
    queryFn: async () => {
      const res = await authFetch(
        `${apiConfig.getResourceMetaDataUrl("program_registration")}?`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error(`Metadata fetch failed: ${res.status}`);
      return res.json();
    },
  });

  // 5) Row data: filter by current student + enrich with names
  const rowData = useMemo(() => {
    const json = dataQuery.data;
    const rawRows: any[] = Array.isArray(json) ? json : json?.resource || [];

    // ✅ Only my records
    const mine = myStudentId ? rawRows.filter((r) => r.student_id === myStudentId) : [];

    const programs = programQuery.data || [];
    const students = studentQuery.data || [];

    const programMap = new Map(programs.map((p: any) => [p.id, p.program_name || p.name || p.id]));
    const studentMap = new Map(students.map((s: any) => [s.id, s.name || s.roll_no || s.id]));

    return mine.map((obj: any) => {
      const m = Program_registrationModel.fromJson(obj).toJson();

      return {
        ...m,
        program_name: programMap.get(m.program_id) || m.program_id,
        student_name: studentMap.get(m.student_id) || m.student_id,
      };
    });
  }, [dataQuery.data, myStudentId, programQuery.data, studentQuery.data]);

  // 6) Column defs: show readable columns
  const colDefs: ColDef[] = useMemo(() => {
    // We will show only these columns (clean UI)
    return [
      {
        headerName: "Program",
        field: "program_name",
        sortable: true,
        filter: true,
        resizable: true,
      },
      {
        headerName: "Student",
        field: "student_name",
        sortable: true,
        filter: true,
        resizable: true,
      },
      // keep ids if you want (optional)
      // { headerName: "Program Id", field: "program_id", sortable: true, filter: true, resizable: true },
      // { headerName: "Student Id", field: "student_id", sortable: true, filter: true, resizable: true },
    ];
  }, []);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 160,
    editable: false,
  };

  // UI states
  if (studentQuery.isLoading || dataQuery.isLoading) return <div>Loading...</div>;
  if (!myStudentId) return <div>Student mapping not found for this login.</div>;
  if (dataQuery.isError) return <div>Error loading data.</div>;
  if (metaQuery.isError) return <div>Error loading metadata.</div>;

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        animateRows={true}
      />
    </div>
  );
};

export default ReadProgram_registration;
