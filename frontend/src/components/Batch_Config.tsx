import React, { useState } from "react";

import "./Batch_Config.css";

import CreateBatch from "./Resource/CreateBatch";

import UpdateBatch from "./Resource/UpdateBatch";
import Sidebar from "./Utils/SidebarAdmin";


export default function Batch_Config() {
  // const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Main content area */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Batch Configuration</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">B</span>
            </div>
          </div>
        </header>

        {/* White card body */}
        <div className="contentBody">
          <section className="createStudentSection">
            {/* Create Batch block */}
            <div className="pageFormContainer mb-4">
              <h2 className="fw-semibold mb-3">Create Batch</h2>
              <CreateBatch />
            </div>

            {/* Update Batch block */}
            <div className="pageFormContainer">
              <h2 className="fw-semibold mb-3">Update Batch</h2>
              <UpdateBatch />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
