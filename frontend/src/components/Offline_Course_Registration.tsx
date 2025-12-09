// import React, { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// //   import "./Offline_Course_Registration.css";

// import ReadProgram from "./Resource/ReadProgram";

// import CreateProgram_registration from "./Resource/CreateProgram_registration";
// import Sidebar from "./Utils/Sidebar";
// import { logout } from "../apis/backend";
// import { LogOut } from "lucide-react";
// import styles from "./Styles/CreateCertificate.module.css";

// export default function Offline_Course_Registration() {
//   const navigate = useNavigate();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   // Logout button handler
//   const handleLogout = async () => {
//     const ok = await logout();
//     if (ok) {
//       navigate("/");
//     }
//   };

//   return (
//     <div className="page12Container">
//       {/* Sidebar */}
//       <Sidebar
//         sidebarCollapsed={sidebarCollapsed}
//         toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
//         activeSection="dashboard"
//       />

//       {/* Main content area */}
//       <main
//         className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
//       >
//         {/* Header bar */}
//         <header className="contentHeader">
//           <h1 className="pageTitle">Offline Course Registration</h1>
//           <div className="userProfile" style={{ position: "relative" }}>
//             <div className="profileCircle"
//               onClick={() => setShowDropdown((prev) => !prev)}
//               style={{ cursor: "pointer" }}
//             >
//               <span className="profileInitial">A</span>
//             </div>

//             {showDropdown && (
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: "45px",
//                   background: "white",
//                   borderRadius: "8px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
//                   padding: "10px",
//                   minWidth: "130px",
//                   zIndex: 100,
//                 }}
//               >
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     width: "100%",
//                     background: "none",
//                     border: "none",
//                     textAlign: "left",
//                     padding: "8px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   <LogOut size={16} />
//                   <span style={{ marginLeft: "8px" }}>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* White card body */}
//         <div className="contentBody">
//           <section className="createStudentSection">
//             {/* Create Batch block */}
//             {/* <div className="pageFormContainer mb-4"> */}
//               {/* <h2 className="fw-semibold mb-3">Create Batch</h2> */}
//               <ReadProgram />
//             {/* </div> */}

//             {/* Update Batch block */}
//             <div className="pageFormContainer">
//               <CreateProgram_registration />
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ReadProgram from "./Resource/ReadProgram";
import CreateProgram_registration from "./Resource/CreateProgram_registration";
import Sidebar from "./Utils/Sidebar";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";
import { LoginContext } from "../context/LoginContext";
import { fetchForeignResource } from "../apis/resources";

export default function Offline_Course_Registration() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useContext(LoginContext);
  const userEmail = user?.email_id?.toLowerCase() || "";

  // ---------------------------------------------
  // 🔥 Dynamic Profile: fetch student's roll number
  // ---------------------------------------------
  const [rollNo, setRollNo] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await fetchForeignResource("Student");
        const students = Array.isArray(data) ? data : data.resource || [];

        const match = students.find(
          (s: any) => s.email?.toLowerCase() === userEmail
        );

        setRollNo(match?.roll_no || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    if (userEmail) loadStudent();
  }, [userEmail]);

  // Choose profile initial dynamically
  let profileInitial = "U";
  if (rollNo) profileInitial = rollNo.charAt(0).toUpperCase();
  else if (user?.email_id) profileInitial = user.email_id.charAt(0).toUpperCase();

  // ---------------------------------------------
  // Logout button handler
  // ---------------------------------------------
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Main content area */}
      <main className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}>
        {/* Header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Offline Course Registration</h1>

          {/* 🔥 Dynamic Profile Section */}
          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <span className="profileInitial">{profileInitial}</span>
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
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LogOut size={16} />
                  <span style={{ marginLeft: "8px" }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* White card body */}
        <div className="contentBody">
          <section className="createStudentSection">

            {/* Program Records Section */}
            <ReadProgram />

            {/* Program Registration Form */}
            <div className="pageFormContainer">
              <CreateProgram_registration />
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
