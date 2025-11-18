// src/components/Utils/Sidebar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileSpreadsheet } from "lucide-react";
// CSS is global; you can import here OR rely on CreateStudent importing Upload.css
// import "../Upload.css";

type SidebarProps = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeSection: "dashboard" | "settings";
};

const iconMap: Record<string, JSX.Element> = {
  Home: <Home size={22} color="#007bff" />,
  "Student Records": <FileSpreadsheet size={22} color="#28a745" />,
};


export default function Sidebar({
  sidebarCollapsed,
  toggleSidebar,
  activeSection,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className={`menuToggleBtn ${
          sidebarCollapsed ? "sidebarCollapsed" : ""
        }`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <div className="hamburgerIcon">
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
        </div>
      </button>

      {/* Sidebar Container */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Logo Section */}
        <div className="logoSection">
          <div
            className="logoCircle d-flex justify-content-center align-items-center shadow-sm mx-auto"
            style={{
              width: "95px", // larger circle
              height: "95px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "2px solid #ddd",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px", // 🟢 adds inner breathing space to prevent edge cutting
            }}
          >
            <img
              src="/images/IIITB_logo1.png"
              alt="IIITB Logo"
              style={{
                width: "90%",
                height: "90%",
                objectFit: "contain", // 🟢 shows full image, no cropping
                objectPosition: "center", // 🟢 ensures it stays centered horizontally
              }}
            />
          </div>
          <div
            className="instituteName text-center"
            style={{
              fontFamily: "'Merriweather', serif",
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "#161e27ff",
              lineHeight: "1.4",
              letterSpacing: "0.5px",
              whiteSpace: "pre-line", // 👈 this ensures line breaks are respected
              maxWidth: "100%", // prevent tight wrapping
            }}
          >
            {`International Institute of
Information Technology
Bangalore`}
          </div>
        </div>
        {/* Navigation Menu */}
        <div className="navMenu">
  {/* Home */}
  <button
    className="navItem"
    onClick={() => navigate("/upload")}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "12px 14px",
      marginBottom: "12px",
      borderRadius: "8px",
      width: "100%",
    }}
  >
    <span className="navIcon">{iconMap["Home"]}</span>
    <span
      className="navText"
      style={{ fontSize: "17px", fontWeight: 600 }}
    >
      Home
    </span>
  </button>

  {/* Student Records */}
  <button
    className="navItem"
    onClick={() => navigate("/records")}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "12px 14px",
      marginBottom: "12px",
      borderRadius: "8px",
      width: "100%",
    }}
  >
    <span className="navIcon">{iconMap["Student Records"]}</span>
    <span
      className="navText"
      style={{ fontSize: "17px", fontWeight: 600 }}
    >
      Student Records
    </span>
  </button>
</div>
      </div>
    </>
  );
}
