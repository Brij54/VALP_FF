

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

          import React, { useState } from "react";
import "./Records.css";

import ReadCertificate from "./Resource/ReadCertificate";
import Sidebar from "./Utils/Sidebar";

export default function Records() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"    // 👈 key for highlighting in sidebar
      />

      {/* Main content area */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Records</h1>
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
              <h2 className="fw-semibold mb-3">Your Certificates</h2>
              <ReadCertificate />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
