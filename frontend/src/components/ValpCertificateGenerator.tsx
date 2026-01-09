import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Utils/SidebarAdmin";
import { logout } from "../apis/backend";
import { LogOut } from "lucide-react";
import apiConfig from "../config/apiConfig";
import "./ValpCertificateGenerator.css";
import html2canvas from "html2canvas";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { authFetch } from "../apis/authFetch";

export default function ValpCertificateGenerator() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ batch dropdown data
  const [batchList, setBatchList] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  // ✅ student search text
  const [studentSearch, setStudentSearch] = useState<string>("");

  // ✅ table data
  const [students, setStudents] = useState<any[]>([]);

  // ✅ preview
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  // ✅ progress for bulk
  const [showProgress, setShowProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStudent, setProgressStudent] = useState("");

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
    return today.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
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

  const downloadPdf = (blob: Blob, stu: any) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stu.roll_no}_VALP_Certificate.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Load batches on page load
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const params = new URLSearchParams({ queryId: "GET_ALL" });
        const res = await authFetch(
          `${apiConfig.getResourceUrl("batch")}?${params.toString()}`,
          { method: "GET" }
        );
        const json = await res.json();
        setBatchList(json.resource || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load batches");
      }
    };
    loadBatches();
  }, []);

  // Fetch completed courses (approved only)
  const fetchCompletedCourses = async (studentId: string) => {
    const params = new URLSearchParams({ queryId: "GET_ALL" });

    const res = await authFetch(
      `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
      { method: "GET" }
    );

    const all = (await res.json()).resource || [];
    return all.filter((c: any) => c.student_id === studentId && c.status === true);
  };

  // ✅ Fetch students (decorator queryIds)
  const fetchStudents = async () => {
    if (!selectedBatchId) {
      alert("Please select a batch!");
      return;
    }

    try {
      const q = studentSearch.trim();

      const params = new URLSearchParams({
        queryId: q ? "SEARCH_STUDENTS_IN_BATCH" : "GET_STUDENTS_BY_BATCH",
        args: q ? `batch_id:${selectedBatchId},q:${q}` : `batch_id:${selectedBatchId}`,
      });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("student")}?${params.toString()}`,
        { method: "GET" }
      );

      const json = await res.json();
      const list = json.resource || [];

      const selectedBatch = batchList.find(
        (b: any) => String(b.id) === String(selectedBatchId)
      );
      const requiredCourses = selectedBatch?.no_of_courses || 0;

      const enriched = await Promise.all(
        list.map(async (stu: any) => {
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

      setHtmlPreview("");
      setPdfBlob(null);
      setCurrentStudent(null);
    } catch (e) {
      console.error(e);
      alert("Failed to load students (check Network/Console).");
    }
  };

  // Convert PDF Signature → PNG
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

  // Fetch dean signature file
  const fetchDeanSignatureFile = async (documentId: any) => {
    if (!documentId) return "";

    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const res = await authFetch(url, { method: "GET" });
    const blob = await res.blob();

    if (blob.type === "application/pdf") return await pdfToPng(blob);
    return await blobToBase64(blob);
  };

  const fetchDeanSignature = async () => {
    const params = new URLSearchParams({ queryId: "GET_ALL" });

    const res = await authFetch(
      `${apiConfig.getResourceUrl("dean")}?${params.toString()}`,
      { method: "GET" }
    );

    const json = await res.json();
    const dean = json.resource?.[0];

    if (!dean) return { name: "Dean", signature: "" };

    const base64Sign = await fetchDeanSignatureFile(dean.signature);
    return { name: dean.name, signature: base64Sign };
  };

  // Generate HTML template
  const generateHTMLTemplate = async (stu: any, completed: any[], dean: any) => {
    let html = await fetch("/templates/valp_template.html").then((r) => r.text());

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

  // Convert HTML → PDF
  const convertHTMLtoPDF = async (html: string, stu: any) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    container.style.background = "white";
    container.style.boxSizing = "border-box";

    document.body.appendChild(container);

    const opt = {
      margin: [10, 5, 10, 5],
      filename: `${stu.roll_no}_VALP_Certificate.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    } as any;

    const pdfBlob = await html2pdf().from(container).set(opt).output("blob");
    document.body.removeChild(container);

    const base64 = await blobToBase64(pdfBlob);
    return { pdfBlob, base64 };
  };

  // Save PDF to backend
  const saveToBackend = async (studentId: string, base64: string) => {
    await authFetch(
      `${apiConfig.getResourceUrl("certificate")}?resource=certificate&queryId=SAVE_VALP_CERTIFICATE`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, base64 }),
      }
    );
  };

  // SINGLE generate
  const handleGenerate = async (stu: any) => {
    const completed = await fetchCompletedCourses(stu.id);
    if (!completed.length) return alert("No completed courses!");

    const dean = await fetchDeanSignature();
    const html = await generateHTMLTemplate(stu, completed, dean);
    setHtmlPreview(html);

    const { pdfBlob, base64 } = await convertHTMLtoPDF(html, stu);
    setPdfBlob(pdfBlob);
    setCurrentStudent(stu);

    await saveToBackend(stu.id, base64);
  };

  // BULK ZIP generate
  const handleBulkGenerateZIP = async () => {
    if (!students.length) return alert("No students found!");

    const eligible = students.filter((s) => s.eligible);
    if (!eligible.length) return alert("No eligible students!");

    const zip = new JSZip();
    const total = eligible.length;
    let done = 0;

    setShowProgress(true);
    setProgressPercent(0);

    for (const stu of eligible) {
      setProgressStudent(stu.name);

      const completed = await fetchCompletedCourses(stu.id);
      if (!completed.length) continue;

      const dean = await fetchDeanSignature();
      const html = await generateHTMLTemplate(stu, completed, dean);
      const { pdfBlob, base64 } = await convertHTMLtoPDF(html, stu);

      await saveToBackend(stu.id, base64);
      zip.file(`${stu.roll_no}_VALP_Certificate.pdf`, pdfBlob);

      done++;
      setProgressPercent(Math.round((done / total) * 100));
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const batchName =
      batchList.find((b: any) => String(b.id) === String(selectedBatchId))?.batch_name ||
      "Batch";

    saveAs(zipBlob, `VALP_Certificates_${batchName}.zip`);
    alert(`Generated ${done} certificates successfully!`);
    setTimeout(() => setShowProgress(false), 1000);
  };

  // Logout
  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  return (
    <div className="page12Container">
      {showProgress && (
        <div className="progress-modal-overlay">
          <div className="progress-modal-box">
            <h5 className="fw-bold mb-3">Generating Certificates… {progressPercent}%</h5>
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="mt-3 small text-secondary">
              Current Student: <b>{progressStudent}</b>
            </div>

            <p className="mt-2 text-muted" style={{ fontSize: "13px" }}>
              Please wait… do not close this window.
            </p>
          </div>
        </div>
      )}

      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        activeSection="dashboard"
      />

      <main className={`mainContent ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}>
        <header className="contentHeader">
          <h1 className="pageTitle">VALP Transcript Generator</h1>

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
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
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
                    gap: 8,
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="contentBody">
          <div className="pageFormContainer">
            {/* ✅ Responsive search card */}
            <div className="pageFormContainer2">
              <select
                className="form-control"
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                  setStudents([]);
                  setStudentSearch("");
                  setHtmlPreview("");
                  setPdfBlob(null);
                  setCurrentStudent(null);
                }}
              >
                <option value="">Select Batch</option>
                {batchList.map((b: any) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.batch_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search student (name / roll no)"
                className="form-control"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />

              <button className="btn btn-primary" onClick={fetchStudents}>
                Search
              </button>
            </div>

            {students.length > 0 && (
              <button
                className="btn btn-success mb-3 mt-3 fs-5 rounded-3 shadow-sm"
                onClick={handleBulkGenerateZIP}
              >
                Generate All Certificates (ZIP)
              </button>
            )}

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
                              Eligible ({stu.completedCount}/{stu.requiredCourses})
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Not Eligible ({stu.completedCount}/{stu.requiredCourses})
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
                            {stu.eligible ? "Generate Certificate" : "Not Eligible"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
                />

                {pdfBlob && currentStudent && (
                  <div className="d-flex gap-3 mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => downloadPdf(pdfBlob, currentStudent)}
                    >
                      Download PDF
                    </button>

                    <button className="btn btn-secondary" onClick={() => printPdf(pdfBlob)}>
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
