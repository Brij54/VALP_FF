// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum, getCookie } from "../../apis/enum";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const Edit = () => {
//   const { id }: any = useParams();
//   const baseUrl = apiConfig.getResourceUrl("Certificate");
//   const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
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
//         Authorization: `Bearer ${accessToken}`, // Add token here
//       },
//       credentials: "include", // include cookies if needed
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
//     "Certificate"
//   );

//   useEffect(() => {
//     // console.log()

//     if (fetchDataById.length > 0 && !loadingEditComp) {
//       setEditedRecord((prevData: any) => ({
//         ...prevData,
//         ...Object.fromEntries(
//           Object.entries(fetchedDataById["resource"][0]).filter(
//             ([key]) => !regex.test(key)
//           )
//         ),
//       }));
//       console.log(
//         "fetched data by ID",
//         fetchedDataById,
//         loadingEditComp,
//         editedRecord
//       );
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

//   // ✅ async function, not useQuery
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

//   // ✅ async function, not useQuery
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
//   useEffect(() => {
//     console.log("my data", editedRecord);
//   }, [editedRecord]);

//   const handleEdit = (id: any, field: string, value: any) => {
//     setEditedRecord((prevData: any) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   // const handleStatusChange = (value: string) => {
//   //   setEditedRecord((prev: any) => ({
//   //     ...prev,
//   //     "status": value,
//   //   }));
//   //   console.log("HANDLEEDITsTATUS", editedRecord);
//   // };
//   const handleStatusChange = (value: string) => {
//   setEditedRecord((prev : any) => ({
//     ...prev,
//     status: value   // value = "true", "false", "Pending"
//   }));
// };
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
//           Authorization: `Bearer ${accessToken}`, // Add token here
//         },
//         credentials: "include", // include cookies if needed
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

//   const getStatusBadge = (status: string) => {
//     if (status === "true")
//       return (
//         <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
//           ✅ <span>Approved</span>
//         </span>
//       );
//     if (status === "false")
//       return (
//         <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
//           ❌ <span>Rejected</span>
//         </span>
//       );
//     return (
//       <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
//         ⏳ <span>Pending</span>
//       </span>
//     );
//   };

//   return (
//     <>
//       {!loadingEditComp && (
//         <div className="container mt-4">
//           <form>
//             <div
//               id="id-1"
//               className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
//             >
//               <div className="border-0 fw-bold fs-3" id="id-3">
//                 Certificate
//               </div>
//               <div className="border-0 fw-bold" id="id-7">
//                 course_name *
//               </div>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="course_name"
//                 required={true}
//                 value={editedRecord["course_name"] || ""}
//                 onChange={(e) => handleEdit(id, "course_name", e.target.value)}
//               />
//               <div className="border-0 fw-bold" id="id-D">
//                 course_duration *
//               </div>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="course_duration"
//                 required={true}
//                 value={editedRecord["course_duration"] || ""}
//                 onChange={(e) => {
//                   handleEdit(id, "course_duration", e.target.value);
//                   console.log(editedRecord);
//                 }}
//               />
//               {/* <div className="border-0 fw-bold" id="id-J">
//                 course_mode *
//               </div>
//               <select
//                 className="form-select"
//                 name="course_mode"
//                 required={true}
//                 value={editedRecord["course_mode"] || ""}
//                 onChange={(e) => handleEdit(id, "course_mode", e.target.value)}
//               >
//                 <option value="">Select course_mode</option>{" "}
//                 {enums["Course_mode"]?.map((val, idx) => (
//                   <option key={idx} value={val}>
//                     {val}
//                   </option>
//                 ))}
//               </select> */}

//               <div className="border-0 w-100 bg-light" id="id-J">
//                 <div className="border-0 fw-bold">course_mode *</div>
//                 <input
//                   className="form-control"
//                   name="course_mode"
//                   value={editedRecord.course_mode || ""}
//                   onChange={(e) =>
//                     handleEdit(id, e.target.name, e.target.value)
//                   }
//                 />
//               </div>
//               <div className="border-0 fw-bold" id="id-P">
//                 platform *
//               </div>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="platform"
//                 required={true}
//                 value={editedRecord["platform"] || ""}
//                 onChange={(e) => handleEdit(id, "platform", e.target.value)}
//               />
//               <div className="border-0 fw-bold" id="id-V">
//                 course_completion_date *
//               </div>
//               <input
//                 // type="date"
//                 className="form-control"
//                 name="course_completion_date"
//                 required={true}
//                 value={editedRecord["course_completion_date"] || ""}
//                 onChange={(e) => handleEdit(id, e.target.value, e.target.value)}
//               />
//               {/* <div className="border-0 fw-bold" id="id-11">
//                 upload_certificate *
//               </div>
//               <div className="mb-3" id="id-13">
//                 <label className="form-label">
//                   Upload file for upload_certificate{" "}
//                 </label>
//                 <input
//                   className="form-control"
//                   type="file"
//                   name="upload_certificate"
//                   required={true}
//                   onChange={(e) =>
//                     handleEdit(
//                       id,
//                       "upload_certificate",
//                       e.target.files?.[0] || null
//                     )
//                   }
//                 />
//               </div> */}
//               <div className="border-0 fw-bold" id="id-19">
//                 student_id *
//               </div>
//               {(() => {
//                 const options = foreignKeyData["Student"] || [];
//                 const filteredOptions = options.filter((option) =>
//                   option["id"]
//                     ?.toLowerCase()
//                     .includes((searchQueries["student_id"] || "").toLowerCase())
//                 );
//                 return (
//                   <>
//                     <button
//                       className="btn btn-secondary dropdown-toggle"
//                       type="button"
//                       id={`dropdownMenu-${"student_id"}`}
//                       data-bs-toggle="dropdown"
//                       aria-haspopup="true"
//                       aria-expanded="false"
//                     >
//                       {" "}
//                       {editedRecord["student_id"]
//                         ? options.find(
//                             (item) => item.id === editedRecord["student_id"]
//                           )?.["id"] || "Select"
//                         : `Select student_id`}{" "}
//                     </button>
//                     <div
//                       className="dropdown-menu"
//                       aria-labelledby={`dropdownMenu-${"student_id"}`}
//                     >
//                       <input
//                         type="text"
//                         className="form-control mb-2"
//                         placeholder={"Search student_id"}
//                         value={searchQueries["student_id"] || ""}
//                         onChange={(e) =>
//                           handleSearchChange("student_id", e.target.value)
//                         }
//                       />{" "}
//                       {filteredOptions.length > 0 ? (
//                         filteredOptions.map((option, i) => (
//                           <button
//                             key={i}
//                             className="dropdown-item"
//                             type="button"
//                             onClick={() =>
//                               handleEdit(id, "student_id", option.id)
//                             }
//                           >
//                             {" "}
//                             {option["id"]}{" "}
//                           </button>
//                         ))
//                       ) : (
//                         <span className="dropdown-item text-muted">
//                           No options available
//                         </span>
//                       )}{" "}
//                     </div>
//                   </>
//                 );
//               })()}

//               <div className="border-0 w-100 bg-light">
//                 <div className="border-0 fw-bold mb-1">status *</div>
//                 <div className="d-flex align-items-center">
//                   {/* <select
//                     className="form-select w-auto"
//                     name="status"
//                     value={
//                       editedRecord.status === "true"
//                         ? "true"
//                         : editedRecord.status === "false"
//                         ? "false"
//                         : "Pending"
//                     }
//                     onChange={(e) => {
//                       handleStatusChange(e.target.value);
//                       console.log("status", e.target.value);
//                     }}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value='true'>Approved</option>
//                     <option value="false">Rejected</option>
//                   </select> */}
//                                     <select
//                     className="form-select w-auto"
//                     name="status"
//                     value={
//                       editedRecord.status === "true"
//                         ? "true"
//                         : editedRecord.status === "false"
//                         ? "false"
//                         : "Pending"
//                     }
//                     onChange={(e) => handleStatusChange(e.target.value)}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="true">Approved</option>
//                     <option value="false">Rejected</option>
//                   </select>

//                   {getStatusBadge(editedRecord.status)}
//                 </div>
//               </div>
//               <div className="border-0 fw-bold" id="id-1F">
//                 course_url
//               </div>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="course_url"
//                 required={false}
//                 value={editedRecord["course_url"] || ""}
//                 onChange={(e) => handleEdit(id, "course_url", e.target.value)}
//               />
//               <button
//                 className="btn btn-success"
//                 id="id-1J"
//                 onClick={(e) => handleUpdate(id, e)}
//               >
//                 Submit
//               </button>
//             </div>
//           </form>

//           {showToast && (
//             <div
//               className="toast-container position-fixed top-20 start-50 translate-middle p-3"
//               style={{ zIndex: 1550 }}
//             >
//               <div
//                 className="toast show"
//                 role="alert"
//                 aria-live="assertive"
//                 aria-atomic="true"
//               >
//                 <div className="toast-header">
//                   <strong className="me-auto">Success</strong>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowToast(false)}
//                   ></button>
//                 </div>
//                 <div className="toast-body text-success text-center">
//                   Updated successfully!
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Edit;

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Sidebar from "../Utils/SidebarAdmin";
import styles from "../Styles/CreateCertificate.module.css"; // SAME UI STYLES

const Edit = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const baseUrl = apiConfig.getResourceUrl("Certificate");
  const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

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
    "Certificate"
  );

  useEffect(() => {
    if (fetchDataById.length > 0 && !loadingEditComp) {
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(fetchedDataById["resource"][0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
    }
  }, [fetchedDataById, loadingEditComp]);

  const {
    data: metaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);
      }

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

  useEffect(() => {}, [editedRecord]);

  const handleEdit = (id: any, field: string, value: any) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setEditedRecord((prev: any) => ({
      ...prev,
      status: value,
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
    if (editedRecord.length === 0) return;

    const params = new FormData();

    let selectedFile = null;
    selectedFile = Object.keys(editedRecord).filter(
      (key) => editedRecord[key] instanceof File
    );
    if (selectedFile !== undefined && selectedFile.length > 0) {
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
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: params,
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {}
  };

  const getStatusBadge = (status: string) => {
    if (status === "true")
      return (
        <span className="ms-2 badge bg-success d-flex align-items-center gap-1">
          ✅ <span>Approved</span>
        </span>
      );
    if (status === "false")
      return (
        <span className="ms-2 badge bg-danger d-flex align-items-center gap-1">
          ❌ <span>Rejected</span>
        </span>
      );
    return (
      <span className="ms-2 badge bg-secondary d-flex align-items-center gap-1">
        ⏳ <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={false}
        toggleSidebar={() => {}}
        activeSection="dashboard"
      />

      <main className="mainContent">
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Certificate</h1>
        </header>

        <div className="contentBody">
          <div className="pageFormContainer">
            {!loadingEditComp && (
              <form>
                <div className={styles.certificateFormWrapper}>
                  <h2 className={styles.sectionTitle}>Edit Certificate</h2>

                  <div className={styles.formGrid}>
                    {/* course_name */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course Name
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_name"
                        required
                        value={editedRecord["course_name"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_name", e.target.value)
                        }
                      />
                    </div>

                    {/* course_duration */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course
                        Duration
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_duration"
                        required
                        value={editedRecord["course_duration"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_duration", e.target.value)
                        }
                      />
                    </div>

                    {/* course_mode */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Course Mode
                      </label>
                      <input
                        className={styles.formControl}
                        name="course_mode"
                        value={editedRecord.course_mode || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_mode", e.target.value)
                        }
                      />
                    </div>

                    {/* platform */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Platform
                      </label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="platform"
                        required
                        value={editedRecord["platform"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "platform", e.target.value)
                        }
                      />
                    </div>

                    {/* completion date */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Completion
                        Date
                      </label>
                      <input
                        type="date"
                        className={styles.formControl}
                        name="course_completion_date"
                        required
                        value={editedRecord["course_completion_date"] || ""}
                        onChange={(e) =>
                          handleEdit(
                            id,
                            "course_completion_date",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* status */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.required}>*</span> Status
                      </label>

                      {/* Dropdown + badge container */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px",
                          border: "1px solid #d0d0d0",
                          borderRadius: "8px",
                          background: "#fafafa",
                        }}
                      >
                        {/* Dropdown */}
                        <select
                          className={styles.formControl}
                          style={{ flex: "0 0 180px" }}
                          name="status"
                          value={
                            editedRecord.status === "true"
                              ? "true"
                              : editedRecord.status === "false"
                              ? "false"
                              : "Pending"
                          }
                          onChange={(e) => handleStatusChange(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="true">Approved</option>
                          <option value="false">Rejected</option>
                        </select>

                        {/* Live Badge */}
                        <div style={{ flex: 1 }}>
                          {getStatusBadge(editedRecord.status)}
                        </div>
                      </div>
                    </div>

                    {/* course_url */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Course URL</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        name="course_url"
                        value={editedRecord["course_url"] || ""}
                        onChange={(e) =>
                          handleEdit(id, "course_url", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.primaryBtn}
                      onClick={(e) => handleUpdate(id, e)}
                    >
                      Submit
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
                    ></button>
                  </div>
                  <div className="toast-body text-success text-center">
                    Updated successfully!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Edit;
