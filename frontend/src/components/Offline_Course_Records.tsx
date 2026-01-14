import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";  // ✅ reuse same styling

import Sidebar from "./Utils/Sidebar";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";

import { LoginContext } from "../context/LoginContext";
import { fetchForeignResource } from "../apis/resources";

import ReadProgram_registration from "./Resource/ReadProgram_Registration";
import UpdateProgram_registration from "./Resource/UpdateProgram_registration";

export default function Offline_Course_Records() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const userEmail = user?.email_id?.toLowerCase() || "";

  //-------------------------------
  // 🎯 FETCH STUDENT ROLL NUMBER
  //-------------------------------
  const [rollNo, setRollNo] = useState<string | null>(null);

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

  //-------------------------------
  // 🎯 PROFILE INITIAL
  //-------------------------------
  let profileInitial = "U";

  if (rollNo) profileInitial = rollNo.charAt(0).toUpperCase();
  else if (user?.email_id) profileInitial = user.email_id.charAt(0).toUpperCase();

  //-------------------------------
  // 🎯 LOGOUT HANDLER
  //-------------------------------
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
        activeSection="dashboard"  // 👈 highlight menu
      />

      {/* Main Panel */}
      <main className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}>
        {/* Header */}
        <header className="contentHeader">
          <h1 className="pageTitle">Offline Course Records</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <span className="profileInitial">{profileInitial}</span>
            </div>

            {/* Profile Dropdown */}
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

        {/* Main Body */}
        <div className="contentBody">
          <section className="createStudentSection">

            {/* White card component */}
            <div className="pageFormContainer mb-4">
              {/* <h2 className="fw-semibold mb-3">Program Registration Records</h2> */}

              {/* TABLE COMPONENT */}
              <UpdateProgram_registration />
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
