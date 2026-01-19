// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";
// import { getCookie } from "../../apis/enum";

// const Edit = () => {
//   const { id }: any = useParams();
//   const navigate = useNavigate();

//   const [record, setRecord] = useState<any>({});
//   const [signaturePreview, setSignaturePreview] = useState<string>("");
//   const [signatureFile, setSignatureFile] = useState<File | null>(null);
//   const [showToast, setShowToast] = useState(false);

//   const apiUrl = `${apiConfig.getResourceUrl("dean")}?`;

//   // -----------------------------------
//   // Fetch Dean By ID
//   // -----------------------------------
//   const fetchDean = async () => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_ALL",
//     });

//     const accessToken = getCookie("access_token");

//     const res = await fetch(`${apiUrl}${params.toString()}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const json = await res.json();
//     const data = json.resource?.[0];

//     setRecord(data);

//     if (data.signature) {
//       setSignaturePreview(data.signature); // base64 string
//     }
//   };

//   useEffect(() => {
//     fetchDean();
//   }, [id]);

//   // -----------------------------------
//   // On Change (Name)
//   // -----------------------------------
//   const handleEdit = (field: string, value: any) => {
//     setRecord((prev: any) => ({ ...prev, [field]: value }));
//   };

//   // -----------------------------------
//   // Signature Upload
//   // -----------------------------------
//   const handleFileChange = (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setSignatureFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => setSignaturePreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   // -----------------------------------
//   // Base64 Encode
//   // -----------------------------------
//   const base64EncodeFun = (str: string) =>
//     btoa(unescape(encodeURIComponent(str)));

//   // -----------------------------------
//   // UPDATE DEAN
//   // -----------------------------------
//   const handleUpdate = async (e: any) => {
//     e.preventDefault();

//     const form = new FormData();

//     if (signatureFile) {
//       form.append("file", signatureFile);
//       record.signature = "";

//       form.append("description", "Dean Signature");
//       form.append("appId", "rasp_app");
//       form.append("dmsRole", "admin");
//       form.append("user_id", "admin@rasp.com");
//       form.append("tags", "dean,signature");
//     }

//     const jsonString = JSON.stringify(record);
//     const base64Encoded = base64EncodeFun(jsonString);

//     form.append("resource", base64Encoded);
//     form.append("action", "MODIFY");

//     const accessToken = getCookie("access_token");

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: form,
//       credentials: "include",
//     });

//     if (response.ok) {
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
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
//           <h1 className="pageTitle">Edit Dean Details</h1>
//         </header>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             {/* ------------------------------------- */}
//             {/* FORM */}
//             {/* ------------------------------------- */}
//             <form onSubmit={handleUpdate}>
//               <div className={styles.certificateFormWrapper}>
//                 <h2 className={styles.sectionTitle}>Dean Information</h2>

//                 <div className={styles.formGrid}>
//                   {/* Dean Name */}
//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       <span className={styles.required}>*</span> Dean Name
//                     </label>
//                     <input
//                       type="text"
//                       className={styles.formControl}
//                       value={record.name || ""}
//                       onChange={(e) => handleEdit("name", e.target.value)}
//                       required
//                     />
//                   </div>

//                   {/* Signature Upload */}
//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       Upload Signature (PNG/JPG)
//                     </label>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       className={styles.formControl}
//                       onChange={handleFileChange}
//                     />

//                     {/* {signaturePreview && (
//                       <div style={{ marginTop: "10px" }}>
//                         <p style={{ marginBottom: "6px" }}>Preview:</p>
//                         <img
//                           src={signaturePreview}
//                           alt="Dean Signature"
//                           style={{
//                             width: "200px",
//                             height: "auto",
//                             border: "1px solid #ccc",
//                             padding: "6px",
//                             borderRadius: "6px",
//                             background: "#fff",
//                           }}
//                         />
//                       </div>
//                     )} */}
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className={styles.buttonRow}>
//                   <button className={styles.primaryBtn}>Update</button>
//                 </div>
//               </div>
//             </form>

//             {/* Toast */}
//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-header">
//                     <strong className="me-auto">Success</strong>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setShowToast(false)}
//                     ></button>
//                   </div>
//                   <div className="toast-body text-success text-center">
//                     Updated Successfully!
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Edit;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import apiConfig from "../../config/apiConfig";
// import Sidebar from "../Utils/SidebarAdmin";
// import styles from "../Styles/CreateCertificate.module.css";
// import { getCookie } from "../../apis/enum";

// const Edit = () => {
//   const { id }: any = useParams();

//   const [record, setRecord] = useState<any>({});
//   const [signaturePreview, setSignaturePreview] = useState<string>("");
//   const [signatureFile, setSignatureFile] = useState<File | null>(null);
//   const [showToast, setShowToast] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const apiUrl = `${apiConfig.getResourceUrl("dean")}?`;

//   // ✅ authFetch INSIDE this file
//   const authFetch = async (
//     input: RequestInfo,
//     init: RequestInit = {}
//   ): Promise<Response> => {
//     const finalInit: RequestInit = {
//       credentials: "include",
//       ...init,
//       headers: {
//         ...(init.headers || {}),
//       },
//     };

//     const token = getCookie("access_token");
//     const headersObj = finalInit.headers as Record<string, string>;

//     if (token && !headersObj?.Authorization) {
//       headersObj.Authorization = `Bearer ${token}`;
//     }

//     const res = await fetch(input, finalInit);

//     if (res.status === 401) {
//       localStorage.clear();
//       sessionStorage.clear();
//       window.location.href = "/";
//       throw new Error("Unauthorized");
//     }

//     return res;
//   };

//   // -----------------------------------
//   // Fetch Dean By ID
//   // -----------------------------------
//   const fetchDean = async () => {
//     const params = new URLSearchParams({
//       args: `id:${id}`,
//       queryId: "GET_ALL",
//     });

//     const res = await authFetch(`${apiUrl}${params.toString()}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const json = await res.json();
//     const data = json.resource?.[0];

//     setRecord(data || {});

//     if (data?.signature) {
//       setSignaturePreview(data.signature); // base64 string
//     }
//   };

//   useEffect(() => {
//     fetchDean();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   // -----------------------------------
//   // On Change (Name)
//   // -----------------------------------
//   const handleEdit = (field: string, value: any) => {
//     setRecord((prev: any) => ({ ...prev, [field]: value }));
//   };

//   // -----------------------------------
//   // Signature Upload
//   // -----------------------------------
//   const handleFileChange = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSignatureFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => setSignaturePreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   // -----------------------------------
//   // Base64 Encode
//   // -----------------------------------
//   const base64EncodeFun = (str: string) =>
//     btoa(unescape(encodeURIComponent(str)));

//   // -----------------------------------
//   // UPDATE DEAN
//   // -----------------------------------
//   const handleUpdate = async (e: any) => {
//     e.preventDefault();

//     const form = new FormData();

//     // avoid mutating state object directly
//     const payload = { ...record };

//     if (signatureFile) {
//       form.append("file", signatureFile);
//       payload.signature = "";

//       form.append("description", "Dean Signature");
//       form.append("appId", "rasp_app");
//       form.append("dmsRole", "admin");
//       form.append("user_id", "admin@rasp.com");
//       form.append("tags", "dean,signature");
//     }

//     const jsonString = JSON.stringify(payload);
//     const base64Encoded = base64EncodeFun(jsonString);

//     form.append("resource", base64Encoded);
//     form.append("action", "MODIFY");

//     const response = await authFetch(apiUrl, {
//       method: "POST",
//       body: form,
//     });

//     if (response.ok) {
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2500);
//     }
//   };

//   return (
//     <div className="page12Container">
//       <Sidebar
//         sidebarCollapsed={sidebarCollapsed}
//         toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
//         activeSection="dashboard"
//       />

//       <main className="mainContent">
//         <header className="contentHeader">
//           <h1 className="pageTitle">Edit Dean Details</h1>
//         </header>

//         <div className="contentBody">
//           <div className="pageFormContainer">
//             <form onSubmit={handleUpdate}>
//               <div className={styles.certificateFormWrapper}>
//                 <h2 className={styles.sectionTitle}>Dean Information</h2>

//                 <div className={styles.formGrid}>
//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       <span className={styles.required}>*</span> Dean Name
//                     </label>
//                     <input
//                       type="text"
//                       className={styles.formControl}
//                       value={record.name || ""}
//                       onChange={(e) => handleEdit("name", e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div className={styles.formGroup}>
//                     <label className={styles.formLabel}>
//                       Upload Signature (PNG/JPG)
//                     </label>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       className={styles.formControl}
//                       onChange={handleFileChange}
//                     />
//                   </div>
//                 </div>

//                 <div className={styles.buttonRow}>
//                   <button className={styles.primaryBtn}>Update</button>
//                 </div>
//               </div>
//             </form>

//             {showToast && (
//               <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
//                 <div className="toast show">
//                   <div className="toast-header">
//                     <strong className="me-auto">Success</strong>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setShowToast(false)}
//                     ></button>
//                   </div>
//                   <div className="toast-body text-success text-center">
//                     Updated Successfully!
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Edit;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import Sidebar from "../Utils/SidebarAdmin";
import styles from "../Styles/CreateCertificate.module.css";
import { getCookie } from "../../apis/enum";
import { logout } from "../../apis/backend";
import { LogOut } from "lucide-react";

const Edit = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>({});
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* 🔑 PROFILE STATE (SAME AS Batch_Config) */
  const [showDropdown, setShowDropdown] = useState(false);

  const apiUrl = `${apiConfig.getResourceUrl("dean")}?`;

  // ✅ authFetch INSIDE this file
  const authFetch = async (
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<Response> => {
    const finalInit: RequestInit = {
      credentials: "include",
      ...init,
      headers: {
        ...(init.headers || {}),
      },
    };

    const token = getCookie("access_token");
    const headersObj = finalInit.headers as Record<string, string>;

    if (token && !headersObj?.Authorization) {
      headersObj.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(input, finalInit);

    if (res.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    return res;
  };

  // -----------------------------------
  // Fetch Dean By ID
  // -----------------------------------
  const fetchDean = async () => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_ALL",
    });

    const res = await authFetch(`${apiUrl}${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    const data = json.resource?.[0];

    setRecord(data || {});

    if (data?.signature) {
      setSignaturePreview(data.signature);
    }
  };

  useEffect(() => {
    fetchDean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // -----------------------------------
  // On Change (Name)
  // -----------------------------------
  const handleEdit = (field: string, value: any) => {
    setRecord((prev: any) => ({ ...prev, [field]: value }));
  };

  // -----------------------------------
  // Signature Upload
  // -----------------------------------
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setSignaturePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // -----------------------------------
  // Base64 Encode
  // -----------------------------------
  const base64EncodeFun = (str: string) =>
    btoa(unescape(encodeURIComponent(str)));

  // -----------------------------------
  // UPDATE DEAN
  // -----------------------------------
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const form = new FormData();
    const payload = { ...record };

    if (signatureFile) {
      form.append("file", signatureFile);
      payload.signature = "";

      form.append("description", "Dean Signature");
      form.append("appId", "rasp_app");
      form.append("dmsRole", "admin");
      form.append("user_id", "admin@rasp.com");
      form.append("tags", "dean,signature");
    }

    const base64Encoded = base64EncodeFun(JSON.stringify(payload));

    form.append("resource", base64Encoded);
    form.append("action", "MODIFY");

    const response = await authFetch(apiUrl, {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  /* 🔑 LOGOUT */
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

      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        <header className="contentHeader">
          <h1 className="pageTitle">Edit Dean Details</h1>

          {/* ✅ USER PROFILE (MATCHES Batch_Config) */}
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

        <div className="contentBody">
          <div className="pageFormContainer">
            <form onSubmit={handleUpdate}>
              <div className={styles.certificateFormWrapper}>
                <h2 className={styles.sectionTitle}>Dean Information</h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <span className={styles.required}>*</span> Dean Name
                    </label>
                    <input
                      type="text"
                      className={styles.formControl}
                      value={record.name || ""}
                      onChange={(e) => handleEdit("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Upload Signature (PNG/JPG)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.formControl}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className={styles.buttonRow}>
                  <button className={styles.primaryBtn}>Update</button>
                </div>
              </div>
            </form>

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
                    Updated Successfully!
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

