// import React, { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// import "./Upload.css";

// import CreateCertificate from "./Resource/CreateCertificate";

// import Calendar from "./Calendar/Calendar";
// export default function Upload() {
//   const navigate = useNavigate();

//   return (
//     <>
//       <div
//         id="id-1"
//         className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
//       >
//         <CreateCertificate />
//       </div>
//     </>
//   );
// }
import React, { useState } from "react";
import "./Upload.css";

import CreateCertificate from "./Resource/CreateCertificate";
import Sidebar from "./Utils/Sidebar";

export default function Upload() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"     // 👈 use whatever key you use in Sidebar
      />

      {/* Main content area */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Upload Certificate</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">S</span>
            </div>
          </div>
        </header>

        {/* White card body */}
        <div className="contentBody">
          <section className="createStudentSection">
            <div className="pageFormContainer mb-4">
              <h2 className="fw-semibold mb-3">Create Certificate</h2>
              <CreateCertificate />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
