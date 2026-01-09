import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Batch_Config.css"; // reuse same layout CSS
import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";

import CreateAcademic_year from "./Resource/CreateAcademic_year";
import ReadAcademic_year from "./Resource/ReadAcademic_year";
import styles from "./Styles/CreateCertificate.module.css";

export default function Terms() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Logout handler
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
          <h1 className="pageTitle">Academic Year Configuration</h1>

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

        {/* Body */}
        <div className="contentBody">
          <section className="createStudentSection">
            {/* Create Academic Year */}
            
              <CreateAcademic_year />

            {/* Read Academic Year */}
            <div className="pageFormContainer">
              <h2 className={styles.sectionTitle1}>Academic Year List</h2>
              <ReadAcademic_year />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
