import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Batch_Config.css";

import CreateBatch from "./Resource/CreateBatch";

import UpdateBatch from "./Resource/UpdateBatch";
import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";


export default function Batch_Config() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Logout button handler
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate("/login");
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

      {/* Main content area */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Header bar */}
        <header className="contentHeader">
          <h1 className="pageTitle">Batch Configuration</h1>
          <div className="userProfile" style={{ position: "relative" }}>
            <div className="profileCircle"
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
