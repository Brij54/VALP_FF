import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Program_Records.css";

import UpdateProgram_registration from "./Resource/UpdateProgram_registration";
import { LogOut } from "lucide-react";
import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import styles from "./Styles/CreateCertificate.module.css";
export default function Program_Records() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate("/");
    }
  };

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
              <h1 className="pageTitle">Ongoing courses Records</h1>
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
    
            {/* White card area */}
            <div className="contentBody">
              <section className="createStudentSection">
                <div className="pageFormContainer">
                  {/* <h2 className={styles.sectionTitle1}>Program Records</h2> */}
    
                  {/* Your AG-Grid table for students */}
                  <UpdateProgram_registration />
                </div>
              </section>
            </div>
          </main>
        </div>
  );
}
