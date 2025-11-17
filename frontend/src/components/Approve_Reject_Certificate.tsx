import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Approve_Reject_Certificate.css";

import UpdateCertificate from "./Resource/UpdateCertificate";
import Sidebar from "./Utils/SidebarAdmin";
export default function Approve_Reject_Certificate() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  return (
    <div className="page12Container">
      {/* Left sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Right main content */}
      <main
        className={`mainContent ${
          sidebarCollapsed ? "sidebarCollapsed" : ""
        }`}
      >
        {/* Blue header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Approve / Reject Certificate</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">A</span>
            </div>
          </div>
        </header>

        {/* White card area */}
        <div className="contentBody">
          <section className="createStudentSection">
            <div className="pageFormContainer">
              <h2 className="fw-semibold mb-3">Student Certificates</h2>

              {/* Your AG-Grid table for students */}
              <UpdateCertificate />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
