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
// import ProgramModel from "../../models/ProgramModel";
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

// const ReadProgram = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<any>(false);

//   const regex = /^(g_|archived|extra_data)/;
//   const apiUrl = `${apiConfig.getResourceUrl("program")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Program")}?`;
//   const BaseUrl = "${apiConfig.API_BASE_URL}";
//   // Fetch resource data

//   const {
//     data: dataRes,
//     isLoading: isLoadingDataRes,
//     error: errorDataRes,
//   } = useQuery({
//     queryKey: ["resourceData", "programRead"],
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
//       // return data;
//     },
//   });

//   const {
//     data: dataResMeta,
//     isLoading: isLoadingDataResMeta,
//     error: errorDataResMeta,
//   } = useQuery({
//     queryKey: ["resourceMetaData", "programRead1"],
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

//   // --- Transform API data into model objects and then JSON ---
//   useEffect(() => {
//     if (fetchData && fetchData.length > 0) {
//       //ADDED: Convert array of plain objects → array of model instances
//       const modelObjects = fetchData.map((obj: any) =>
//         ProgramModel.fromJson(obj)
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

// export default ReadProgram;


// import React, { useState, useEffect } from "react";
// import apiConfig from "../../config/apiConfig";
// import {
//   AllCommunityModule,
//   ModuleRegistry,
// } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import ProgramModel from "../../models/ProgramModel";

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

// const ReadProgram = () => {
//   const queryClient = useQueryClient();

//   const [rowData, setRowData] = useState<any[]>([]);
//   const [colDef1, setColDef1] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [fetchData, setFetchedData] = useState<any[]>([]);
//   const [showToast, setShowToast] = useState<any>(false);

//   const regex = /^(g_|archived|extra_data)/;

//   // -------------------------
//   // GET PROGRAM LIST
//   // -------------------------
//   useQuery({
//     queryKey: ["ProgramListAll"],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       params.append("queryId", "GET_ALL");

//       const accessToken = getCookie("access_token");
//       if (!accessToken) throw new Error("Access token missing");

//       const response = await fetch(
//         `${apiConfig.getResourceUrl("program")}?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       const data = await response.json();
//       const list = data.resource || [];

//       // ⭐ Store globally so CreateProgram_registration can use it
//       queryClient.setQueryData(["ProgramList"], list);

//       setFetchedData(list);
//       return list;
//     },
//   });

//   // -------------------------
//   // GET METADATA
//   // -------------------------
//   useQuery({
//     queryKey: ["ProgramMetadata"],
//     queryFn: async () => {
//       const response = await fetch(
//         `${apiConfig.getResourceMetaDataUrl("program")}?`
//       );

//       const data = await response.json();
//       setResMetaData(data);
//       setFields(data[0]?.fieldValues || []);

//       const required = data[0]?.fieldValues
//         .filter((f: any) => !regex.test(f.name))
//         .map((f: any) => f.name);

//       setRequiredFields(required);
//       return data;
//     },
//   });

//   // -------------------------
//   // TRANSFORM MODEL → GRID DATA
//   // -------------------------
//   useEffect(() => {
//     if (fetchData.length > 0) {
//       const modelObjects = fetchData.map((obj) => ProgramModel.fromJson(obj));
//       const jsonObjects = modelObjects.map((m) => m.toJson());
//       setRowData(jsonObjects);
//     }
//   }, [fetchData]);

//   // -------------------------
//   // CREATE TABLE COLUMNS
//   // -------------------------
//   useEffect(() => {
//     if (fetchData.length === 0 || requiredFields.length === 0) return;

//     const fields = requiredFields.filter((f: string) => f !== "id");

//     const columns = fields.map((field: any) => ({
//       field: field,
//       headerName: field,
//       editable: false,
//       sortable: true,
//       filter: true,
//       resizable: true,
//     }));

//     setColDef1(columns);
//   }, [fetchData, requiredFields]);

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 120,
//   };

//   return (
//     <div>
//       <div>
//         {rowData.length === 0 ? (
//           <div>No Program records available</div>
//         ) : (
//           <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={colDef1}
//               defaultColDef={defaultColDef}
//               pagination={true}
//               paginationPageSize={10}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReadProgram;
// import React, { useMemo } from "react";
// import apiConfig from "../../config/apiConfig";
// import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
// import { useQuery } from "@tanstack/react-query";
// import { authFetch } from "../../apis/authFetch";

// ModuleRegistry.registerModules([AllCommunityModule]);

// type Program = {
//   id: string;
//   name?: string;
//   seats?: number;
//   instructor_name?: string;
//   syllabus?: string;
// };

// type ProgramRegistration = {
//   id: string;
//   program_id: string;
//   student_id: string;
// };

// const ReadProgram = () => {
//   // 1) Fetch programs
//   const programQuery = useQuery({
//     queryKey: ["ProgramList"], // IMPORTANT: keep same key used elsewhere
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program")}?${params.toString()}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );
//       if (!res.ok) throw new Error("Failed to load programs");
//       const json = await res.json();
//       return (json.resource || []) as Program[];
//     },
//   });

//   // 2) Fetch registrations (to compute filled seats)
//   const regQuery = useQuery({
//     queryKey: ["ProgramRegistrationList"], // IMPORTANT: keep same key used elsewhere
//     queryFn: async () => {
//       const params = new URLSearchParams({ queryId: "GET_ALL" });
//       const res = await authFetch(
//         `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );
//       if (!res.ok) throw new Error("Failed to load registrations");
//       const json = await res.json();
//       return (json.resource || []) as ProgramRegistration[];
//     },
//     refetchInterval: 5000, // optional: live refresh every 5s
//   });

//   // 3) Compute available seats per program
//   const rowData = useMemo(() => {
//     const programs = programQuery.data || [];
//     const regs = regQuery.data || [];

//     const filledMap = new Map<string, number>();
//     regs.forEach((r) => filledMap.set(r.program_id, (filledMap.get(r.program_id) || 0) + 1));

//     return programs.map((p) => {
//       const total = Number(p.seats ?? 0);
//       const filled = filledMap.get(p.id) || 0;
//       const available = Math.max(0, total - filled);

//       return {
//         ...p,
//         filled_seats: filled,
//         available_seats: available,
//         availability: `${available}/${total}`,
//       };
//     });
//   }, [programQuery.data, regQuery.data]);

//   // 4) Columns (adds Available Seats)
//   const colDefs = useMemo<ColDef[]>(() => {
//     return [
//       { headerName: "name", field: "name", sortable: true, filter: true },
//       { headerName: "seats", field: "seats", sortable: true, filter: true },

//       // ✅ new columns
//       { headerName: "filled", field: "filled_seats", sortable: true, filter: true, width: 120 },

//       {
//         headerName: "available",
//         field: "available_seats",
//         sortable: true,
//         filter: true,
//         width: 140,
//         cellRenderer: (p: any) => {
//           const a = Number(p.value ?? 0);
//           const total = Number(p.data?.seats ?? 0);
//           const isFull = a <= 0;
//           return (
//             <span
//               style={{
//                 fontWeight: 800,
//                 padding: "4px 10px",
//                 borderRadius: 10,
//                 display: "inline-block",
//                 background: isFull ? "#ffe5e5" : "#e8f5e9",
//                 color: isFull ? "#b71c1c" : "#1b5e20",
//               }}
//             >
//               {isFull ? "FULL" : `${a}/${total}`}
//             </span>
//           );
//         },
//       },

//       { headerName: "instructor_name", field: "instructor_name", sortable: true, filter: true },
//       { headerName: "syllabus", field: "syllabus", sortable: true, filter: true },
//     ];
//   }, []);

//   const defaultColDef: ColDef = { flex: 1, minWidth: 140, resizable: true };

//   if (programQuery.isLoading || regQuery.isLoading) return <div>Loading...</div>;
//   if (programQuery.isError || regQuery.isError) return <div>Error loading data</div>;

//   return (
//     <div className="ag-theme-alpine" style={{ height: 260, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         defaultColDef={defaultColDef}
//         pagination
//         paginationPageSize={10}
//         animateRows
//       />
//     </div>
//   );
// };

// export default ReadProgram;


import React, { useMemo } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "../../apis/authFetch";

ModuleRegistry.registerModules([AllCommunityModule]);

// -------------------- TYPES --------------------
type Program = {
  id: string;
  name?: string;
  seats?: number;
  instructor_name?: string;
  syllabus?: string;
  term_name?: string;
  academic_year?: string;
};

type ProgramRegistration = {
  id: string;
  program_id: string;
  student_id: string;
};

// -------------------- HEADER FORMATTER --------------------
const prettifyHeader = (str: string) =>
  (str || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ReadProgram = () => {
  // -------------------- FETCH PROGRAMS --------------------
  const programQuery = useQuery({
    queryKey: ["ProgramList"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("program")}?${params.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to load programs");

      const json = await res.json();
      return (json.resource || []) as Program[];
    },
  });

  // -------------------- FETCH REGISTRATIONS --------------------
  const regQuery = useQuery({
    queryKey: ["ProgramRegistrationList"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("program_registration")}?${params.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to load registrations");

      const json = await res.json();
      return (json.resource || []) as ProgramRegistration[];
    },
    refetchInterval: 5000,
  });

  // -------------------- COMPUTE SEATS --------------------
  const rowData = useMemo(() => {
    const programs = programQuery.data || [];
    const regs = regQuery.data || [];

    const filledMap = new Map<string, number>();
    regs.forEach((r) =>
      filledMap.set(r.program_id, (filledMap.get(r.program_id) || 0) + 1)
    );

    return programs.map((p) => {
      const total = Number(p.seats ?? 0);
      const filled = filledMap.get(p.id) || 0;
      const available = Math.max(0, total - filled);

      return {
        ...p,
        filled_seats: filled,
        available_seats: available,
      };
    });
  }, [programQuery.data, regQuery.data]);

  // -------------------- COLUMN DEFINITIONS --------------------
  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: prettifyHeader("name"),
        field: "name",
        sortable: true,
        filter: true,
      },
      {
        headerName: prettifyHeader("term_name"),
        field: "term_name",
        sortable: true,
        filter: true,
        width: 140,
      },
      {
        headerName: prettifyHeader("academic_year"),
        field: "academic_year",
        sortable: true,
        filter: true,
        width: 160,
      },
      {
        headerName: prettifyHeader("seats"),
        field: "seats",
        sortable: true,
        filter: true,
        width: 110,
      },
      {
        headerName: "Filled Seats",
        field: "filled_seats",
        sortable: true,
        filter: true,
        width: 130,
      },
      {
        headerName: "Available Seats",
        field: "available_seats",
        sortable: true,
        filter: true,
        width: 160,
        cellRenderer: (p: any) => {
          const available = Number(p.value ?? 0);
          const total = Number(p.data?.seats ?? 0);
          const isFull = available <= 0;

          return (
            <span
              style={{
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 10,
                background: isFull ? "#ffe5e5" : "#e8f5e9",
                color: isFull ? "#b71c1c" : "#1b5e20",
              }}
            >
              {isFull ? "FULL" : `${available}/${total}`}
            </span>
          );
        },
      },
      {
        headerName: prettifyHeader("instructor_name"),
        field: "instructor_name",
        sortable: true,
        filter: true,
      },
      {
        headerName: prettifyHeader("syllabus"),
        field: "syllabus",
        sortable: true,
        filter: true,
      },
    ];
  }, []);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 140,
    resizable: true,
    editable: false,
  };

  // -------------------- UI STATES --------------------
  if (programQuery.isLoading || regQuery.isLoading)
    return <div>Loading...</div>;

  if (programQuery.isError || regQuery.isError)
    return <div>Error loading data</div>;

  // -------------------- RENDER --------------------
  return (
    <div className="ag-theme-alpine" style={{ height: 360, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={10}
        animateRows
      />
    </div>
  );
};

export default ReadProgram;
