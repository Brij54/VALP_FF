// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import Sidebar from "../Utils/SidebarAdmin";
// import "../Batch_Config.css"; // for UI design

// const Edit = () => {
//   const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Batch");
//   const apiUrl = `${apiConfig.getResourceUrl("Batch")}?`;
//   const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

//   const [editedRecord, setEditedRecord] = useState<any>({});
//   const [fields, setFields] = useState<any[]>([]);
//   const [resMetaData, setResMetaData] = useState([]);
//   const [requiredFields, setRequiredFields] = useState<string[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});
//   const regex = /^(g_|archived|extra_data)/;
//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   const fetchDataById = async (id: string, resourceName: string) => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_BY_ID",
//     });

//     const url = `${baseUrl}?${params.toString()}`;
//     const accessToken = getCookie("access_token");
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     return data;
//   };

//   const useGetById = (id: string, resourceName: string) => {
//     return useQuery({
//       queryKey: ["getById", resourceName, id],
//       queryFn: () => fetchDataById(id, resourceName),
//       enabled: !!id && !!resourceName,
//     });
//   };

//   const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
//     id,
//     "Batch"
//   );

//   useEffect(() => {
//     if (fetchDataById.length > 0 && !loadingEditComp) {
//       setEditedRecord(fetchedDataById["resource"][0]);
//     }
//   }, [fetchedDataById, loadingEditComp]);

//   const {
//     data: metaData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["resMetaData"],
//     queryFn: async () => {
//       const res = await fetch(metadataUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to fetch metadata: ${res.statusText}`);
//       }

//       const data = await res.json();

//       setResMetaData(data);
//       setFields(data[0].fieldValues);

//       const foreignFields = data[0].fieldValues.filter(
//         (field: any) => field.foreign
//       );
//       for (const field of foreignFields) {
//         if (!fetchedResources.current.has(field.foreign)) {
//           fetchedResources.current.add(field.foreign);

//           queryClient.prefetchQuery({
//             queryKey: ["foreignData", field.foreign],
//             queryFn: () => fetchForeignResource(field.foreign),
//           });

//           await fetchForeignData(
//             field.foreign,
//             field.name,
//             field.foreign_field
//           );
//         }
//       }

//       const enumFields = data[0].fieldValues.filter(
//         (field: any) => field.isEnum === true
//       );
//       for (const field of enumFields) {
//         if (!fetchedEnum.current.has(field.possible_value)) {
//           fetchedEnum.current.add(field.possible_value);

//           queryClient.prefetchQuery({
//             queryKey: ["enum", field.possible_value],
//             queryFn: () => fetchEnum(field.possible_value),
//           });

//           await fetchEnumData(field.possible_value);
//         }
//       }

//       return data;
//     },
//   });

//   const fetchEnumData = async (enumName: string) => {
//     try {
//       const data = await fetchEnum(enumName);
//       setEnums((prev) => ({
//         ...prev,
//         [enumName]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching enum data for ${enumName}:`, err);
//     }
//   };

//   const fetchForeignData = async (
//     foreignResource: string,
//     fieldName: string,
//     foreignField: string
//   ) => {
//     try {
//       const data = await fetchForeignResource(foreignResource);
//       setForeignKeyData((prev) => ({
//         ...prev,
//         [foreignResource]: data,
//       }));
//     } catch (err) {
//       console.error(`Error fetching foreign data for ${fieldName}:`, err);
//     }
//   };

//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const handleSearchChange = (fieldName: string, value: string) => {
//     setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
//   };

//   const base64EncodeFun = (str: string) => {
//     return btoa(unescape(encodeURIComponent(str)));
//   };

//   const handleUpdate = async (id: any, e: React.FormEvent) => {
//     e.preventDefault();
//     if (editedRecord.length === 0) return;

//     const params = new FormData();

//     let selectedFile = null;
//     selectedFile = Object.keys(editedRecord).filter(
//       (key) => editedRecord[key] instanceof File
//     );
//     if (selectedFile !== undefined && selectedFile.length > 0) {
//       params.append("file", editedRecord[selectedFile[0]]);
//       editedRecord[selectedFile[0]] = "";

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }
//     const jsonString = JSON.stringify(editedRecord);

//     const base64Encoded = base64EncodeFun(jsonString);
//     params.append("resource", base64Encoded);
//     params.append("action", "MODIFY");
//     const accessToken = getCookie("access_token");

//     if (!accessToken) {
//       throw new Error("Access token not found");
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         credentials: "include",
//         body: params,
//       });

//       if (response.ok) {
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//       } else {
//         console.error("Error updating record:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error in handleUpdate:", error);
//     }
//   };

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={false}
//         toggleSidebar={() => {}}
//         activeSection="dashboard"
//       />

//       <main className="mainContent">
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Batch</h1>
//         </header>

//         {/* <div className="pageFormContainer1 d-flex justify-content-center"> */}
//         {!loadingEditComp && (
//           <form
//             className="w-100"
//             style={{
//               maxWidth: "500px",
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               padding: "60px 10px",
//               margin: "100px auto", // keeps it responsive
//             }}
//           >
//             <div className="card shadow-sm border-0 rounded">
//               {/* Card Header */}
//               <div
//                 className="card-header text-white text-center fw-semibold"
//                 style={{
//                   background: "linear-gradient(135deg, #007bff, #0056d2)",
//                   padding: "15px 10px",
//                   fontSize: "20px",
//                   borderTopLeftRadius: "10px",
//                   borderTopRightRadius: "10px",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Edit Batch Details
//               </div>

//               {/* Card Body */}
//               <div className="card-body p-4">
//                 {/* Batch Title */}
//                 <label className="fw-bold mb-1">Batch Name *</label>
//                 <input
//                   type="text"
//                   className="form-control mb-3 rounded-3"
//                   name="batch_name"
//                   required
//                   value={editedRecord["batch_name"] || ""}
//                   onChange={(e) => handleEdit(id, "batch_name", e.target.value)}
//                 />

//                 {/* Number of Courses */}
//                 <label className="fw-bold mb-1">No. of Courses *</label>
//                 <input
//                   type="number"
//                   className="form-control mb-4 rounded-3"
//                   name="no_of_courses"
//                   required
//                   value={editedRecord["no_of_courses"] || ""}
//                   onChange={(e) =>
//                     handleEdit(id, "no_of_courses", e.target.value)
//                   }
//                 />

//                 {/* Submit Button */}
//                 <button
//                   className="btn btn-success w-100 py-2 fs-6 fw-semibold rounded-3"
//                   onClick={(e) => handleUpdate(id, e)}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//         {showToast && (
//           <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//             <div className="toast show">
//               <div className="toast-header">
//                 <strong className="me-auto">Success</strong>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowToast(false)}
//                 />
//               </div>
//               <div className="toast-body text-success text-center">
//                 Updated Successfully!
//               </div>
//             </div>
//           </div>
//         )}
//         {/* </div> */}
//       </main>
//     </div>
//   );
// };

// export default Edit;
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Sidebar from "../Utils/SidebarAdmin";
import "../Batch_Config.css"; // for UI design
import { LogOut } from "lucide-react";
import { logout } from "../../apis/backend";

// ✅ authFetch added here
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

  // Add Authorization from cookie if not already present
  const token = getCookie("access_token");
  const headersObj = finalInit.headers as Record<string, string>;
  if (token && !headersObj.Authorization) {
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

const Edit = () => {
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Batch");
  const apiUrl = `${apiConfig.getResourceUrl("Batch")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );


  const [showDropdown, setShowDropdown] = useState(false);
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;

    // ✅ replaced fetch -> authFetch
    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data;
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id && !!resourceName,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
    id,
    "Batch"
  );

  useEffect(() => {
    if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
      setEditedRecord(fetchedDataById["resource"][0]);
    }
  }, [fetchedDataById, loadingEditComp]);

  useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      // ✅ replaced fetch -> authFetch
      const res = await authFetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch metadata`);

      const data = await res.json();

      setResMetaData(data);
      setFields(data[0].fieldValues);

      const foreignFields = data[0].fieldValues.filter(
        (field: any) => field.foreign
      );
      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(
            field.foreign,
            field.name,
            field.foreign_field
          );
        }
      }

      const enumFields = data[0].fieldValues.filter(
        (field: any) => field.isEnum === true
      );
      for (const field of enumFields) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);

          queryClient.prefetchQuery({
            queryKey: ["enum", field.possible_value],
            queryFn: () => fetchEnum(field.possible_value),
          });

          await fetchEnumData(field.possible_value);
        }
      }

      return data;
    },
  });

  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({
        ...prev,
        [enumName]: data,
      }));
    } catch (err) {
      console.error(`Error fetching enum data for ${enumName}:`, err);
    }
  };

  const fetchForeignData = async (
    foreignResource: string,
    fieldName: string,
    foreignField: string
  ) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({
        ...prev,
        [foreignResource]: data,
      }));
    } catch (err) {
      console.error(`Error fetching foreign data for ${fieldName}:`, err);
    }
  };

  const handleEdit = (id: any, field: string, value: any) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  const base64EncodeFun = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (!editedRecord || Object.keys(editedRecord).length === 0) return;

    const params = new FormData();

    const selectedFile = Object.keys(editedRecord).filter(
      (key) => editedRecord[key] instanceof File
    );

    if (selectedFile.length > 0) {
      params.append("file", editedRecord[selectedFile[0]]);
      editedRecord[selectedFile[0]] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const jsonString = JSON.stringify(editedRecord);
    const base64Encoded = base64EncodeFun(jsonString);

    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");

    try {
      // ✅ replaced fetch -> authFetch
      const response = await authFetch(apiUrl, {
        method: "POST",
        body: params,
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

    const handleLogout = async () => {
      const ok = await logout();
      if (ok) navigate("/");
    };

  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      <main className="mainContent">
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Batch</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <span className="profileInitial">A</span>
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "45px",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  padding: "10px",
                  minWidth: "130px",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  <LogOut size={16} />
                  <span style={{ marginLeft: "8px" }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {!loadingEditComp && (
          <form
            className="w-100"
            style={{
              maxWidth: "500px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "60px 10px",
              margin: "100px auto",
            }}
          >
            <div className="card shadow-sm border-0 rounded">
              <div
                className="card-header text-white text-center fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #007bff, #0056d2)",
                  padding: "15px 10px",
                  fontSize: "20px",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  letterSpacing: "0.5px",
                }}
              >
                Edit Batch Details
              </div>

              <div className="card-body p-4">
                <label className="fw-bold mb-1">Batch Name *</label>
                <input
                  type="text"
                  className="form-control mb-3 rounded-3"
                  name="batch_name"
                  required
                  value={editedRecord["batch_name"] || ""}
                  onChange={(e) => handleEdit(id, "batch_name", e.target.value)}
                />

                <label className="fw-bold mb-1">No. of Courses *</label>
                <input
                  type="number"
                  className="form-control mb-4 rounded-3"
                  name="no_of_courses"
                  required
                  value={editedRecord["no_of_courses"] || ""}
                  onChange={(e) =>
                    handleEdit(id, "no_of_courses", e.target.value)
                  }
                />

                <button
                  className="btn btn-success w-100 py-2 fs-6 fw-semibold rounded-3"
                  onClick={(e) => handleUpdate(id, e)}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        )}

        {showToast && (
          <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
            <div className="toast show">
              <div className="toast-header">
                <strong className="me-auto">Success</strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowToast(false)}
                />
              </div>
              <div className="toast-body text-success text-center">
                Updated Successfully!
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Edit;
