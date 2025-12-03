// import React, { useState, useEffect, useRef, useContext } from "react";
// import apiConfig from "../../config/apiConfig";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { fetchForeignResource } from "../../apis/resources";
// import { fetchEnum } from "../../apis/enum";
// import { LoginContext } from "../../context/LoginContext";
// import styles from "../Styles/CreateCertificate.module.css";

// export type resourceMetaData = {
//   resource: string;
//   fieldValues: any[];
// };

// export const getCookie = (name: string): string | null => {
//   const cookies = document.cookie.split(";");

//   for (const cookie of cookies) {
//     const [key, ...rest] = cookie.split("=");
//     const trimmedKey = key.trim();

//     if (trimmedKey === name) {
//       return rest.join("=").trim() || null;
//     }
//   }
//   return null;
// };

// // safer base64 for any unicode characters
// const base64Encode = (str: string) =>
//   window.btoa(unescape(encodeURIComponent(str)));

// const CreateCertificate = () => {
//   const { user } = useContext(LoginContext); // logged-in user

//   const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
//   const [fields, setFields] = useState<any[]>([]);
//   const [dataToSave, setDataToSave] = useState<any>({});
//   const [showToast, setShowToast] = useState<boolean>(false);
//   const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
//     {}
//   );
//   const [enums, setEnums] = useState<Record<string, any[]>>({});

//   const apiUrl = apiConfig.getResourceUrl("certificate"); // 🔹 use lowercase (same as other components)
//   const metadataUrl = apiConfig.getResourceMetaDataUrl("Certificate");

//   const fetchedResources = useRef(new Set<string>());
//   const fetchedEnum = useRef(new Set<string>());
//   const queryClient = useQueryClient();

//   // ---- Foreign data loader ----
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

//   // ---- Enum data loader ----
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

//   // ---- Metadata & foreign/enum bootstrap ----
//   const { isLoading, error } = useQuery({
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

//       if (Array.isArray(data) && data.length > 0) {
//         setFields(data[0].fieldValues);

//         const foreignFields = data[0].fieldValues.filter(
//           (field: any) => field.foreign
//         );

//         for (const field of foreignFields) {
//           if (!fetchedResources.current.has(field.foreign)) {
//             fetchedResources.current.add(field.foreign);

//             queryClient.prefetchQuery({
//               queryKey: ["foreignData", field.foreign],
//               queryFn: () => fetchForeignResource(field.foreign),
//             });

//             await fetchForeignData(
//               field.foreign,
//               field.name,
//               field.foreign_field
//             );
//           }
//         }

//         const enumFields = data[0].fieldValues.filter(
//           (field: any) => field.isEnum === true
//         );

//         for (const field of enumFields) {
//           if (!fetchedEnum.current.has(field.possible_value)) {
//             fetchedEnum.current.add(field.possible_value);

//             queryClient.prefetchQuery({
//               queryKey: ["enum", field.possible_value],
//               queryFn: () => fetchEnum(field.possible_value),
//             });

//             await fetchEnumData(field.possible_value);
//           }
//         }
//       }

//       return data;
//     },
//   });

//   // ---- Auto-set student_id from logged-in user's email ----
//   useEffect(() => {
//     if (!user || user.role !== "student") return;
//     const students = foreignKeyData["Student"] || [];
//     if (!students.length) return;

//     const match = students.find(
//       (s: any) =>
//         s.email && s.email.toLowerCase() === user.email_id.toLowerCase()
//     );

//     if (match && match.id) {
//       setDataToSave((prev: any) => ({
//         ...prev,
//         student_id: match.id,
//       }));
//     } else {
//       console.warn(
//         "No matching student found for logged-in user email:",
//         user.email_id
//       );
//     }
//   }, [user, foreignKeyData]);

//   useEffect(() => {
//     console.log("data to save", dataToSave);
//   }, [dataToSave]);

//   const handleCreate = async () => {
//     const accessToken = getCookie("access_token");
//     console.log("access_token from cookie:", accessToken);

//     if (!accessToken) {
//       alert("Access token not found. Please login again.");
//       return;
//     }

//     if (!dataToSave.student_id) {
//       alert("Student mapping not found. Please contact admin.");
//       return;
//     }

//     const params = new FormData();
//     const payload: any = { ...dataToSave };

//     const fileFieldKeys = Object.keys(payload).filter(
//       (key) => payload[key] instanceof File
//     );

//     if (fileFieldKeys.length > 0) {
//       const fileKey = fileFieldKeys[0];
//       params.append("file", payload[fileKey]);
//       payload[fileKey] = ""; // backend expects empty field in JSON

//       params.append("description", "my description");
//       params.append("appId", "hostel_management_system");
//       params.append("dmsRole", "admin");
//       params.append("user_id", "admin@rasp.com");
//       params.append("tags", "t1,t2,attend");
//     }

//     const jsonString = JSON.stringify(payload);
//     const base64Encoded = base64Encode(jsonString);
//     params.append("resource", base64Encoded);

//     try {
//       console.log("POSTing to:", apiUrl);
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
//         setDataToSave({});
//       } else {
//         const text = await response.text();
//         console.error("Backend returned error:", response.status, text);
//         alert("Failed to create certificate. Check console for details.");
//       }
//     } catch (err) {
//       console.error("❌ Network / CORS error in handleCreate:", err);
//       alert(
//         "Failed to reach server. Check if backend is running and CORS is configured."
//       );
//     }
//   };

//   if (isLoading) return <div>Loading certificate metadata...</div>;
//   if (error) return <div>Error loading metadata.</div>;




//   return (
//     <div className={styles.formCard}>
//       <div className={styles.certificateFormWrapper}>
        
//         <h4 className={styles.sectionTitle}>Add Course Certificate</h4>

//         <div className={styles.formGrid}>

//           {/* course_name */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Course Name
//             </label>
//             <input
//               type="text"
//               className={styles.formControl}
//               name="course_name"
//               required
//               value={dataToSave.course_name || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, course_name: e.target.value })
//               }
//             />
//           </div>

//           {/* course_duration */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Course Duration
//             </label>
//             <input
//               type="text"
//               className={styles.formControl}
//               name="course_duration"
//               required
//               value={dataToSave.course_duration || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, course_duration: e.target.value })
//               }
//             />
//           </div>

//           {/* course_mode */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Course Mode
//             </label>
//             <select
//               className={styles.formControl}
//               name="course_mode"
//               required
//               value={dataToSave.course_mode || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, course_mode: e.target.value })
//               }
//             >
//               <option value="">Select course mode</option>
//               {enums["Course_mode"]?.map((val, idx) => (
//                 <option key={idx} value={val}>
//                   {val}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* platform */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Platform
//             </label>
//             <input
//               type="text"
//               className={styles.formControl}
//               name="platform"
//               required
//               value={dataToSave.platform || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, platform: e.target.value })
//               }
//             />
//           </div>

//           {/* completion date */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Completion Date
//             </label>
//             <input
//               type="date"
//               className={styles.formControl}
//               name="course_completion_date"
//               required
//               value={dataToSave.course_completion_date || ""}
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   course_completion_date: e.target.value,
//                 })
//               }
//             />
//           </div>

//           {/* upload_certificate */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>
//               <span className={styles.required}>*</span>
//               Upload Certificate
//             </label>
//             <input
//               className={styles.formControl}
//               type="file"
//               name="upload_certificate"
//               required
//               onChange={(e) =>
//                 setDataToSave({
//                   ...dataToSave,
//                   upload_certificate: e.target.files?.[0] || null,
//                 })
//               }
//             />
//           </div>

//           {/* course_url */}
//           <div className={styles.formGroup}>
//             <label className={styles.formLabel}>Course URL</label>
//             <input
//               type="text"
//               className={styles.formControl}
//               name="course_url"
//               value={dataToSave.course_url || ""}
//               onChange={(e) =>
//                 setDataToSave({ ...dataToSave, course_url: e.target.value })
//               }
//             />
//           </div>

//         </div>

//         {/* hidden */}
//         <input type="hidden" name="student_id" value={dataToSave.student_id || ""} />

//         <div className={styles.buttonRow}>
//           <button className={styles.primaryBtn} onClick={handleCreate}>
//             Submit
//           </button>
//         </div>
//       </div>

//       {/* Toast */}
//       {showToast && (
//         <div
//           className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
//           style={{ zIndex: 2000 }}
//         >
//           <div className="toast show shadow">
//             <div className="toast-header bg-success text-white">
//               <strong className="me-auto">Success</strong>
//               <button
//                 type="button"
//                 className="btn-close"
//                 aria-label="Close"
//                 onClick={() => setShowToast(false)}
//               ></button>
//             </div>
//             <div className="toast-body text-success fw-semibold text-center">
//               Created Successfully!
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateCertificate;
import React, { useState, useEffect, useRef, useContext } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";
import { LoginContext } from "../../context/LoginContext";
import styles from "../Styles/CreateCertificate.module.css";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    const trimmedKey = key.trim();

    if (trimmedKey === name) {
      return rest.join("=").trim() || null;
    }
  }
  return null;
};

// safer base64 for any unicode characters
const base64Encode = (str: string) =>
  window.btoa(unescape(encodeURIComponent(str)));

const CreateCertificate = () => {
  const { user } = useContext(LoginContext); // logged-in user

  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<boolean>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  // ✅ NEW: platform UI states for Online mode
  const [onlinePlatform, setOnlinePlatform] = useState<string>("");
  const [otherPlatform, setOtherPlatform] = useState<string>("");

  const apiUrl = apiConfig.getResourceUrl("certificate"); // use same casing pattern as your other components
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Certificate");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ---- Foreign data loader ----
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

  // ---- Enum data loader ----
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

  // ---- Metadata & foreign/enum bootstrap ----
  const { isLoading, error } = useQuery({
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

      if (Array.isArray(data) && data.length > 0) {
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
      }

      return data;
    },
  });

  // ---- Auto-set student_id from logged-in user's email ----
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const students = foreignKeyData["Student"] || [];
    if (!students.length) return;

    const match = students.find(
      (s: any) =>
        s.email && s.email.toLowerCase() === user.email_id.toLowerCase()
    );

    if (match && match.id) {
      setDataToSave((prev: any) => ({
        ...prev,
        student_id: match.id,
      }));
    } else {
      console.warn(
        "No matching student found for logged-in user email:",
        user.email_id
      );
    }
  }, [user, foreignKeyData]);

  // ✅ NEW: keep dataToSave.platform in sync with Online dropdown + Other textbox
  useEffect(() => {
    if (dataToSave.course_mode !== "Online") {
      // Not online: clear online-specific states (don't touch platform because user might type it manually)
      setOnlinePlatform("");
      setOtherPlatform("");
      return;
    }

    // Online: platform comes from dropdown (or Other textbox)
    if (onlinePlatform === "Other") {
      setDataToSave((prev: any) => ({ ...prev, platform: otherPlatform || "" }));
    } else {
      setDataToSave((prev: any) => ({ ...prev, platform: onlinePlatform || "" }));
    }
  }, [dataToSave.course_mode, onlinePlatform, otherPlatform]);

  useEffect(() => {
    console.log("data to save", dataToSave);
  }, [dataToSave]);

  const handleCreate = async () => {
    const accessToken = getCookie("access_token");
    console.log("access_token from cookie:", accessToken);

    if (!accessToken) {
      alert("Access token not found. Please login again.");
      return;
    }

    if (!dataToSave.student_id) {
      alert("Student mapping not found. Please contact admin.");
      return;
    }

    // ✅ Extra validation for Online platform selection
    if (dataToSave.course_mode === "Online") {
      if (!onlinePlatform) {
        alert("Please select a platform (Coursera/Udemy/NPTEL/Other).");
        return;
      }
      if (onlinePlatform === "Other" && !otherPlatform.trim()) {
        alert("Please enter the platform name.");
        return;
      }
    }

    const params = new FormData();
    const payload: any = { ...dataToSave };

    const fileFieldKeys = Object.keys(payload).filter(
      (key) => payload[key] instanceof File
    );

    if (fileFieldKeys.length > 0) {
      const fileKey = fileFieldKeys[0];
      params.append("file", payload[fileKey]);
      payload[fileKey] = ""; // backend expects empty field in JSON

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const jsonString = JSON.stringify(payload);
    const base64Encoded = base64Encode(jsonString);
    params.append("resource", base64Encoded);

    try {
      console.log("POSTing to:", apiUrl);
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

        // reset form
        setDataToSave((prev: any) => ({ student_id: prev.student_id })); // keep student_id
        setOnlinePlatform("");
        setOtherPlatform("");
      } else {
        const text = await response.text();
        console.error("Backend returned error:", response.status, text);
        alert("Failed to create certificate. Check console for details.");
      }
    } catch (err) {
      console.error("❌ Network / CORS error in handleCreate:", err);
      alert(
        "Failed to reach server. Check if backend is running and CORS is configured."
      );
    }
  };

  if (isLoading) return <div>Loading certificate metadata...</div>;
  if (error) return <div>Error loading metadata.</div>;

  return (
    <div className={styles.formCard}>
      <div className={styles.certificateFormWrapper}>
        <h4 className={styles.sectionTitle}>Add Course Certificate</h4>

        <div className={styles.formGrid}>
          {/* course_name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Course Name
            </label>
            <input
              type="text"
              className={styles.formControl}
              name="course_name"
              required
              value={dataToSave.course_name || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, course_name: e.target.value })
              }
            />
          </div>

          {/* course_duration */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Course Duration
            </label>
            <input
              type="text"
              className={styles.formControl}
              name="course_duration"
              required
              value={dataToSave.course_duration || ""}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  course_duration: e.target.value,
                })
              }
            />
          </div>

          {/* course_mode */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Course Mode
            </label>
            <select
              className={styles.formControl}
              name="course_mode"
              required
              value={dataToSave.course_mode || ""}
              onChange={(e) => {
                const mode = e.target.value;
                setDataToSave({ ...dataToSave, course_mode: mode });

                // if switching away from Online, keep whatever platform user typed; but clear online UI states
                if (mode !== "Online") {
                  setOnlinePlatform("");
                  setOtherPlatform("");
                }
              }}
            >
              <option value="">Select course mode</option>
              {enums["Course_mode"]?.map((val, idx) => (
                <option key={idx} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* platform (dynamic) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Platform
            </label>

            {dataToSave.course_mode === "Online" ? (
              <>
                <select
                  className={styles.formControl}
                  name="platform_select"
                  required
                  value={onlinePlatform}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOnlinePlatform(val);
                    if (val !== "Other") setOtherPlatform("");
                  }}
                >
                  <option value="">Select platform</option>
                  <option value="Coursera">Coursera</option>
                  <option value="Udemy">Udemy</option>
                  <option value="NPTEL">NPTEL</option>
                  <option value="Other">Other</option>
                </select>

                {onlinePlatform === "Other" && (
                  <input
                    type="text"
                    className={styles.formControl}
                    style={{ marginTop: "10px" }}
                    placeholder="Enter platform name"
                    value={otherPlatform}
                    onChange={(e) => setOtherPlatform(e.target.value)}
                    required
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                className={styles.formControl}
                name="platform"
                required
                value={dataToSave.platform || ""}
                onChange={(e) =>
                  setDataToSave({ ...dataToSave, platform: e.target.value })
                }
              />
            )}
          </div>

          {/* completion date */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Completion Date
            </label>
            <input
              type="date"
              className={styles.formControl}
              name="course_completion_date"
              required
              value={dataToSave.course_completion_date || ""}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  course_completion_date: e.target.value,
                })
              }
            />
          </div>

          {/* upload_certificate */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span className={styles.required}>*</span>
              Upload Certificate
            </label>
            <input
              className={styles.formControl}
              type="file"
              name="upload_certificate"
              required
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  upload_certificate: e.target.files?.[0] || null,
                })
              }
            />
          </div>

          {/* course_url */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Course URL</label>
            <input
              type="text"
              className={styles.formControl}
              name="course_url"
              value={dataToSave.course_url || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, course_url: e.target.value })
              }
            />
          </div>
        </div>

        {/* hidden */}
        <input
          type="hidden"
          name="student_id"
          value={dataToSave.student_id || ""}
        />

        <div className={styles.buttonRow}>
          <button
            className={styles.primaryBtn}
            type="button"
            onClick={handleCreate}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
          style={{ zIndex: 2000 }}
        >
          <div className="toast show shadow">
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success fw-semibold text-center">
              Created Successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCertificate;
