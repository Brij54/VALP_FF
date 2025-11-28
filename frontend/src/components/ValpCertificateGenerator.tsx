import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";
import apiConfig from "../config/apiConfig";
import "./ValpCertificateGenerator.css";
import html2canvas from "html2canvas";

// Cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function ValpCertificateGenerator() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  const token = getCookie("access_token");

  // ------------------------------
  // Format Date (remove time)
  // ------------------------------
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en-Gb", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // ------------------------------
  // Fetch completed courses
  // ------------------------------
  const fetchCompletedCourses = async (studentId: string) => {
    const params = new URLSearchParams({ queryId: "GET_ALL" });

    const res = await fetch(
      apiConfig.getResourceUrl("certificate") + "?" + params,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const all = (await res.json()).resource || [];

    return all.filter(
      (c: any) => c.student_id === studentId && c.status === true
    );
  };

  // ------------------------------
  // Fetch Students + Eligibility
  // ------------------------------
  const fetchStudents = async () => {
    const params = new URLSearchParams({ queryId: "GET_ALL" });

    const batchRes = await fetch(
      apiConfig.getResourceUrl("batch") + "?" + params,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const batchList = (await batchRes.json()).resource || [];

    const selectedBatch = batchList.find(
      (b: any) => b.batch_name?.toLowerCase() === batch.toLowerCase()
    );

    if (!selectedBatch) {
      alert("Batch not found!");
      return;
    }

    const batchId = selectedBatch.id;
    const requiredCourses = selectedBatch.no_of_courses || 0;

    const studentRes = await fetch(
      apiConfig.getResourceUrl("student") + "?" + params,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const allStudents = (await studentRes.json()).resource || [];

    const filtered = allStudents.filter((s: any) => s.batch === batchId);

    const enriched = await Promise.all(
      filtered.map(async (stu: any) => {
        const completed = await fetchCompletedCourses(stu.id);
        return {
          ...stu,
          completedCount: completed.length,
          requiredCourses,
          eligible: completed.length >= requiredCourses,
        };
      })
    );

    setStudents(enriched);
  };

  // ------------------------------
  // Convert PDF SIGNATURE → PNG
  // ------------------------------
  const pdfToPng = async (blob: Blob) => {
    return new Promise<string>((resolve) => {
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");

      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = async () => {
        const canvas = await html2canvas(iframe.contentDocument!.body, {
          scale: 3,
          useCORS: true,
        });

        const pngBase64 = canvas.toDataURL("image/png");
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);

        resolve(pngBase64);
      };
    });
  };

  const blobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });

  // ------------------------------
  // Fetch dean signature from DMS
  // ------------------------------
  const fetchDeanSignatureFile = async (documentId: any) => {
    if (!documentId) return "";

    const token = getCookie("access_token");

    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const blob = await res.blob();

    // PDF SIGNATURE → Convert to PNG
    if (blob.type === "application/pdf") {
      return await pdfToPng(blob);
    }

    return await blobToBase64(blob);
  };

  const fetchDeanSignature = async () => {
    const params = new URLSearchParams({ queryId: "GET_ALL" });

    const res = await fetch(apiConfig.getResourceUrl("dean") + "?" + params, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    const dean = json.resource?.[0];

    if (!dean) {
      return { name: "Dean", signature: "" };
    }

    const base64Signature = await fetchDeanSignatureFile(dean.signature);

    return {
      name: dean.name,
      signature: base64Signature,
    };
  };

  // ------------------------------
  // Generate HTML Template
  // ------------------------------
  const generateHTMLTemplate = async (
    stu: any,
    completed: any[],
    dean: any
  ) => {
    let html = await fetch("/templates/valp_template.html").then((r) =>
      r.text()
    );

    const rows = completed
      .map(
        (c: any, idx: number) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${c.course_name}</td>
            <td>IIIT Bangalore</td>
            <td>${formatDate(c.course_completion_date)}</td>
          </tr>`
      )
      .join("");

    html = html
      .replace("{{studentName}}", stu.name)
      .replace("{{rollNo}}", stu.roll_no)
      .replace("{{tableRows}}", rows)
      .replace("{{deanName}}", dean.name)
      .replace("{{deanSignature}}", dean.signature)
      .replace("{{todayDate}}", formatToday());

    return html;
  };

  // ------------------------------
  // Convert HTML → PDF
  // ------------------------------
  const convertHTMLtoPDF = async (html: string, stu: any) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    // container.style.padding = "0mm 10mm 0mm 10mm"; // match your CSS
    container.style.boxSizing = "border-box";
    container.style.background = "white";
    container.style.overflow = "hidden";

    document.body.appendChild(container);

    const opt = {
      margin: [10, 5, 10, 5], // Top, Left, Bottom, Right (mm → auto converted)
      filename: `${stu.roll_no}_VALP_Certificate.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    } as any;

    const pdfBlob = await html2pdf().from(container).set(opt).output("blob");

    document.body.removeChild(container);

    const base64 = await blobToBase64(pdfBlob);

    return { pdfBlob, base64 };
  };

  // ------------------------------
  // Save PDF to backend
  // ------------------------------
  const saveToBackend = async (studentId: string, base64: string) => {
    await fetch(
      `${apiConfig.getResourceUrl(
        "certificate"
      )}?resource=certificate&queryId=SAVE_VALP_CERTIFICATE`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId, base64 }),
      }
    );
  };

  // ------------------------------
  // Download & Print
  // ------------------------------
  const downloadPdf = (blob: Blob, stu: any) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stu.roll_no}_VALP_Certificate.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
      URL.revokeObjectURL(url);
    };
  };

  // ------------------------------
  // Generate & Preview
  // ------------------------------
  const handleGenerate = async (stu: any) => {
    const completed = await fetchCompletedCourses(stu.id);

    if (completed.length === 0) {
      alert("No completed courses!");
      return;
    }

    const dean = await fetchDeanSignature();

    const html = await generateHTMLTemplate(stu, completed, dean);
    setHtmlPreview(html);

    const { pdfBlob, base64 } = await convertHTMLtoPDF(html, stu);

    setPdfBlob(pdfBlob);
    setCurrentStudent(stu);

    await saveToBackend(stu.id, base64);
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="page12Container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      <main
        className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}
      >
        <header className="contentHeader">
          <h1 className="pageTitle">Certificate Generator</h1>

          <div className="userProfile" style={{ position: "relative" }}>
            <div
              className="profileCircle"
              onClick={() => setShowDropdown((p) => !p)}
            >
              <span className="profileInitial">A</span>
            </div>

            {showDropdown && (
              <div className="dropdownMenu">
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="contentBody">
          <div className="pageFormContainer">
            <div className="pageFormContainer2">
              <input
                type="text"
                placeholder="Enter Batch Name"
                className="form-control"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
              <button className="btn btn-primary" onClick={fetchStudents}>
                Search
              </button>
            </div>

            {/* Students List */}
            {students.length > 0 && (
              <div className="table-wrapper">
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th className="text-start">Name</th>
                      <th>Eligibility</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((stu) => (
                      <tr key={stu.id}>
                        <td>{stu.roll_no}</td>
                        <td className="text-start">{stu.name}</td>
                        <td>
                          {stu.eligible ? (
                            <span className="badge bg-success">
                              Eligible ({stu.completedCount}/
                              {stu.requiredCourses})
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Not Eligible ({stu.completedCount}/
                              {stu.requiredCourses})
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${
                              stu.eligible ? "btn-primary" : "btn-secondary"
                            }`}
                            disabled={!stu.eligible}
                            onClick={() => handleGenerate(stu)}
                          >
                            {stu.eligible
                              ? "Generate Certificate"
                              : "Not Eligible"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Preview & Download */}
            {htmlPreview && (
              <div className="mt-5">
                <h4>Certificate Preview</h4>

                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    background: "white",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlPreview }}
                ></div>

                {pdfBlob && currentStudent && (
                  <div className="d-flex gap-3 mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => downloadPdf(pdfBlob, currentStudent)}
                    >
                      Download PDF
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => printPdf(pdfBlob)}
                    >
                      Print Certificate
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
