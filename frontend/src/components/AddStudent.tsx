// import React, { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// import "./Approve_Reject_Certificate.css";
// import { FileText, Upload } from 'lucide-react';
// import apiConfig from "../config/apiConfig";
// import BulkUpload from "./BulkUpload";
// export default function BulkUpload() {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const apiEndpoint = apiConfig.getResourceUrl("student");
//   const headers = [''];
//   const mapRowToPayload = (row: any) => ({
    
//   });

//   return (
//     <>
//       <div
//         id="id-49"
//         className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
//       >
//         <div className="col-12 mb-4">
//           <div className="card">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <span>Upload Student Data</span>
//               <div className="action-dropdown d-flex gap-2">
//                 {showModal && (
//                   <BulkUpload
//                     show={showModal}
//                     onClose={() => setShowModal(false)}
//                     apiEndpoint={apiEndpoint}
//                     headers={headers}
//                     mapRowToPayload={mapRowToPayload}
//                   />
//                 )}
//                 <button
//                   className="btn btn-template"
//                   onClick={() =>
//                     generateExcelTemplate(headers, "Exam_Template.xlsx")
//                   }
//                 >
//                   <FileText size={14} className="icon-left" />
//                   Template
//                 </button>

//                 <button
//                   className="btn btn-bulk-upload"
//                   onClick={() => setShowModal(true)}
//                 >
//                   <Upload size={14} className="icon-left" />
//                   Bulk Upload
//                 </button>

//                 {/* <button className="btn btn-danger dropdown-toggle" type="button" onClick={() => setShowModal(true)}>
//                   Action
//                 </button> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Approve_Reject_Certificate.css";
// import { FileText, Upload } from "lucide-react";
// import apiConfig from "../config/apiConfig";
// import BulkUploadModal from "./BulkUpload"; // ✅ renamed import
// import * as XLSX from "xlsx";

// export default function AddStudent() {
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);

//   const apiEndpoint = apiConfig.getResourceUrl("student");

//   // ✅ Add some headers for Excel template
//   const headers = ["Roll No", "Name", "Email", "Batch"];

//   // ✅ Define how each row maps to payload for API
//   const mapRowToPayload = (row: any) => ({
//     roll_no: row["Roll No"],
//     name: row["Name"],
//     email: row["Email"],
//     batch: row["Batch"]
//   });

//   // ✅ Function to generate Excel template
//   const generateExcelTemplate = (headers: string[], fileName: string) => {
//     const worksheet = XLSX.utils.aoa_to_sheet([headers]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
//     XLSX.writeFile(workbook, fileName);
//   };

//   return (
//     <div
//       id="id-49"
//       className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
//     >
//       <div className="col-12 mb-4">
//         <div className="card">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <span>Upload Student Data</span>
//             <div className="action-dropdown d-flex gap-2">
//               {showModal && (
//                 <BulkUploadModal
//                   show={showModal}
//                   onClose={() => setShowModal(false)}
//                   apiEndpoint={apiEndpoint}
//                   headers={headers}
//                   mapRowToPayload={mapRowToPayload}
//                 />
//               )}

//               <button
//                 className="btn btn-template"
//                 onClick={() =>
//                   generateExcelTemplate(headers, "Student_Template.xlsx")
//                 }
//               >
//                 <FileText size={14} className="icon-left" />
//                 Template
//               </button>

//               <button
//                 className="btn btn-bulk-upload"
//                 onClick={() => setShowModal(true)}
//               >
//                 <Upload size={14} className="icon-left" />
//                 Bulk Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Approve_Reject_Certificate.css";
import { FileText, Upload } from "lucide-react";
import apiConfig from "../config/apiConfig";
import BulkUploadModal from "./BulkUpload";
import Sidebar from "./Utils/SidebarAdmin";
import * as XLSX from "xlsx";

export default function AddStudent() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const apiEndpoint = apiConfig.getResourceUrl("student");

  const headers = ["Roll No", "Name", "Email", "Batch"];

  const mapRowToPayload = (row:any) => ({
    roll_no: row["Roll No"],
    name: row["Name"],
    email: row["Email"],
    batch: row["Batch"],
  });

  const generateExcelTemplate = (headers: string[], fileName: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="page12Container">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      {/* Main Content */}
      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        {/* Blue Header */}
        <header className="contentHeader">
          <h1 className="pageTitle">Add Student</h1>
          <div className="userProfile">
            <div className="profileCircle">
              <span className="profileInitial">A</span>
            </div>
          </div>
        </header>

        {/* White Page Body */}
        <div className="contentBody">
          <section className="createStudentSection">
            {/* <div className="pageFormContainer"> */}
              <h2 className="fw-semibold mb-3">Upload Student Data</h2>

              <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Bulk Actions</span>

                  <div className="d-flex gap-2">
                    {showModal && (
                      <BulkUploadModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        apiEndpoint={apiEndpoint}
                        headers={headers}
                        mapRowToPayload={mapRowToPayload}
                      />
                    )}

                    <button
                      className="btn btn-template"
                      onClick={() =>
                        generateExcelTemplate(headers, "Student_Template.xlsx")
                      }
                    >
                      <FileText size={14} className="icon-left" />
                      Template
                    </button>

                    <button
                      className="btn btn-bulk-upload"
                      onClick={() => setShowModal(true)}
                    >
                      <Upload size={14} className="icon-left" />
                      Bulk Upload
                    </button>
                  </div>
                </div>
              </div>

            {/* </div> */}
          </section>
        </div>
      </main>
    </div>
  );
}
