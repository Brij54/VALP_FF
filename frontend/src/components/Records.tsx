// import React, { useState, useEffect } from 'react';

//  import { useNavigate } from 'react-router-dom';

// import "./Records.css";

//   import ReadCertificate from './Resource/ReadCertificate';

//   import Calendar from "./Calendar/Calendar";export default function Records() {
//   const navigate = useNavigate();

//   return (

//     <>

//     <div id="id-1L" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><ReadCertificate/></div>

//     </>

//   );

// }

// import React, { useState } from "react";
// import "./Records.css";

// import ReadCertificate from "./Resource/ReadCertificate";
// import Sidebar from "./Utils/Sidebar";
// import { logout } from "../apis/backend";
// import { useNavigate } from "react-router-dom";
// import { LogOut } from "lucide-react";

// export default function Records() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

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
//         activeSection="dashboard" // 👈 key for highlighting in sidebar
//       />

//       {/* Main content area */}
//       <main
//         className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
//       >
//         {/* Header bar */}
//         <header className="contentHeader">
//           <h1 className="pageTitle">Records</h1>
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
//             {/* <div className="pageFormContainer mb-4"> */}
//               {/* <h2 className="fw-semibold mb-3">Your Certificates</h2> */}
//               <ReadCertificate />
//             {/* </div> */}
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useState, useContext, useEffect } from "react";
import "./Records.css";

import ReadCertificate from "./Resource/ReadCertificate";
import Sidebar from "./Utils/Sidebar";
import { logout } from "../apis/backend";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { LoginContext } from "../context/LoginContext";   // ✅ added
import { fetchForeignResource } from "../apis/resources";  // ✅ added

export default function Records() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const userEmail = user?.email_id?.toLowerCase() || "";

  // ------------------------------
  // ✅ To store roll number
  // ------------------------------
  const [rollNo, setRollNo] = useState<string | null>(null);

  // ------------------------------
  // ✅ Fetch Student By Email
  // ------------------------------
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData: any = await fetchForeignResource("Student");

        const students = Array.isArray(studentsData)
          ? studentsData
          : studentsData.resource || [];

        const match = students.find(
          (s: any) => s.email?.toLowerCase() === userEmail
        );

        setRollNo(match?.roll_no || null);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    if (userEmail) fetchStudents();
  }, [userEmail]);

  // ------------------------------
  // ✅ Dynamic Profile Initial
  // ------------------------------
  let profileInitial = "U";

  if (rollNo) {
    profileInitial = rollNo.charAt(0).toUpperCase();
  } else if (user?.email_id) {
    profileInitial = user.email_id.charAt(0).toUpperCase();
  }

  // ------------------------------
  // Logout
  // ------------------------------
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate("/");
    }
  };

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Main content */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Header */}
        <header className="contentHeader">
          <h1 className="pageTitle">Records</h1>

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

        {/* Body */}
        <div className="contentBody">
          <section className="createStudentSection">
            <ReadCertificate />
          </section>
        </div>
      </main>
    </div>
  );
}

