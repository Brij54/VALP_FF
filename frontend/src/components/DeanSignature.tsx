import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DeanSignature.css";

import UpdateDean from "./Resource/UpdateDean";
import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";
import CreateDean from "./Resource/CreateDean";
import styles from "./Styles/CreateCertificate.module.css";

export default function DeanSignature() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  return (
    <div className="page12Container">
      {/* ---------------- Sidebar Admin ---------------- */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* ---------------- Main Content ---------------- */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* ---------- Header Bar ---------- */}
        <header className="contentHeader">
          <h1 className="pageTitle">Dean Signature Update</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            {/* Profile Circle */}
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <span className="profileInitial">A</span>
            </div>

            {/* Dropdown Menu */}
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

        {/* ---------- White Card Body ---------- */}
        {/* <div className="contentBody">
          <section className="createStudentSection">
            <div className="pageFormContainer">
              <UpdateDean />
            </div>
          </section>
        </div> */}
        <div className="contentBody">
          <section className="createStudentSection">
              <CreateDean />

            {/* Update Batch block */}
            <div className="pageFormContainer">
              <h2 className={styles.sectionTitle1}>Update Signature</h2>
              <UpdateDean />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
