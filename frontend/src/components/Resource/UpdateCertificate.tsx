import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config/apiConfig";

import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// -------------------- COOKIE --------------------
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// -------------------- authFetch --------------------
async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const finalInit: RequestInit = {
    credentials: "include",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  };

  const token = getCookie("access_token");
  const headersObj = finalInit.headers as any;

  if (token && !headersObj["Authorization"]) {
    headersObj["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(input, finalInit);

  if (res.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  return res;
}

// -------------------- STATUS BADGE --------------------
const getStatusBadge = (status: any) => {
  const s = String(status).toLowerCase();

  const badgeStyle: React.CSSProperties = {
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "8px",
    display: "inline-block",
    textAlign: "center",
  };

  if (s === "true") {
    return (
      <span className="badge bg-success text-white" style={badgeStyle}>
        Approved
      </span>
    );
  }

  if (s === "false") {
    return (
      <span className="badge bg-danger text-white" style={badgeStyle}>
        Rejected
      </span>
    );
  }

  return (
    <span className="badge bg-warning text-dark" style={badgeStyle}>
      Pending
    </span>
  );
};

// For filtering dropdown
const statusToLabel = (status: any) => {
  const s = String(status).toLowerCase();
  if (s === "true") return "Approved";
  if (s === "false") return "Rejected";
  return "Pending";
};

// -------------------- normalize logs --------------------
const normalizeLogsToLines = (logs: any): string[] => {
  if (logs == null) return [];

  // If backend already sends object
  if (typeof logs === "object") {
    if (Array.isArray(logs)) return logs.map((x) => String(x));
    return Object.entries(logs).map(([k, v]) => `${k}: ${String(v)}`);
  }

  // If string
  const str = String(logs).trim();
  if (!str) return [];

  // Try JSON string logs
  const looksJson =
    (str.startsWith("{") && str.endsWith("}")) ||
    (str.startsWith("[") && str.endsWith("]"));

  if (looksJson) {
    try {
      const parsed = JSON.parse(str);
      return normalizeLogsToLines(parsed);
    } catch {
      // fallthrough
    }
  }

  // Normal newline logs
  return str
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
};

// -------------------- VIEW BUTTON --------------------
const ViewRenderer = (params: any) => {
  const documentId = params.value;

  const handleView = (e: any) => {
    e.stopPropagation();
    params.context.handleViewPdf(documentId);
  };

  return (
    <button
      onClick={handleView}
      className="btn btn-outline-primary"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
    >
      👁 View
    </button>
  );
};

// -------------------- LOGS ICON RENDERER --------------------
const LogsIconRenderer = (params: any) => {
  const logsValue = params.value;
  const lines = normalizeLogsToLines(logsValue);
  const hasLogs = lines.length > 0;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!hasLogs) return;
    params.context.handleShowLogs(lines);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn btn-outline-secondary"
      title={hasLogs ? "View Logs" : "No logs"}
      disabled={!hasLogs}
      style={{
        borderRadius: 10,
        padding: "6px 10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: hasLogs ? 1 : 0.45,
        cursor: hasLogs ? "pointer" : "not-allowed",
      }}
    >
      <FileText size={18} />
    </button>
  );
};

// -------------------- ACTION RENDERER --------------------
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => props.context.handleUpdate(props.data.id);

  return (
    <button
      className="btn btn-outline-primary"
      style={{
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
      onClick={handleEdit}
    >
      Edit
    </button>
  );
};

const UpdateCertificate = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<any[]>([]);
  const regex = /^(g_|archived|extra_data)/;

  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Logs modal state
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsLines, setLogsLines] = useState<string[]>([]);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isApproving, setIsApproving] = useState(false);

  // -------------------- VIEW PDF --------------------
  const handleViewPdf = async (documentId: string) => {
    const url =
      `${apiConfig.API_BASE_URL}/certificate` +
      `?document_id=${documentId}&queryId=GET_DOCUMENT` +
      `&dmsRole=admin&user_id=admin@rasp.com`;

    const response = await authFetch(url, { method: "GET" });
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    setPdfUrl(fileURL);
    setShowModal(true);
  };

  // -------------------- SHOW LOGS --------------------
  const handleShowLogs = (lines: string[]) => {
    setLogsLines(lines);
    setShowLogsModal(true);
  };

  // ---------------- FETCH METADATA ----------------
  useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const res = await authFetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Metadata load failed");

      const data = await res.json();
      // keeping your regex logic (even if not used later)
      data?.[0]?.fieldValues?.filter((f: any) => !regex.test(f.name));
      return data;
    },
  });

  // ---------------- FETCH CERTIFICATES ----------------
  useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams({ queryId: "GET_ALL" });

      const res = await authFetch(
        `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Certificate load failed");

      const json = await res.json();
      const rawRows = json.resource || [];

      const enrichedRows = await Promise.all(
        rawRows.map(async (row: any) => {
          const studentParams = new URLSearchParams({
            queryId: "GET_STUDENT_BY_CERTIFICATE",
            args: "student_id:" + row.student_id,
          });

          const studentRes = await authFetch(
            `${apiConfig.getResourceUrl(
              "certificate"
            )}?${studentParams.toString()}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (studentRes.ok) {
            const stuJson = await studentRes.json();
            const stu = stuJson.resource?.[0];

            return {
              ...row,
              roll_no: stu?.roll_no || "N/A",
              student_name: stu?.name || "",
            };
          }

          return row;
        })
      );

      setRowData(enrichedRows);
      return enrichedRows;
    },
  });

  const handleUpdate = (id: any) => navigate(`/edit/certificate/${id}`);

  // ---------------- Bulk Approve Selected ----------------
  const handleApproveSelected = async () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const selectedRows = api.getSelectedRows() || [];
    if (!selectedRows.length) return;

    setIsApproving(true);
    try {
      await Promise.all(
        selectedRows.map(async (row: any) => {
          const updated = { ...row, status: true };

          delete (updated as any).roll_no;
          delete (updated as any).student_name;
          delete (updated as any).Action;

          const params = new FormData();
          const jsonString = JSON.stringify(updated);
          const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)));

          params.append("resource", base64Encoded);
          params.append("action", "MODIFY");

          const url = `${apiConfig.getResourceUrl("certificate")}?`;

          const res = await authFetch(url, {
            method: "POST",
            body: params,
          });

          if (!res.ok) throw new Error("Approve failed: " + res.status);
        })
      );

      const selectedIds = new Set(selectedRows.map((r: any) => r.id));
      setRowData((prev) =>
        prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: true } : r))
      );

      api.deselectAll();
      setSelectedCount(0);
    } catch (e) {
      console.error(e);
      alert("Bulk approve failed.");
    } finally {
      setIsApproving(false);
    }
  };

  // ============================================================
  //            COLUMN DEFINITIONS (LOGS = ICON)
  // ============================================================
  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "",
        field: "__select__",
        width: 60,
        pinned: "left",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: false,
        filter: false,
        resizable: false,
      },

      { headerName: "Roll Number", field: "roll_no", sortable: true, filter: true },
      { headerName: "Student Name", field: "student_name", sortable: true, filter: true },
      { headerName: "Course", field: "course_name", sortable: true, filter: true },
      { headerName: "Platform", field: "platform", sortable: true, filter: true },

      {
        headerName: "Completion Date",
        field: "course_completion_date",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          if (!params.value) return "";
          const d = new Date(params.value);
          return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
        },
      },

      {
        headerName: "Status",
        field: "status",
        sortable: true,
        valueGetter: (p: any) => statusToLabel(p.data?.status),
        filter: "agSetColumnFilter",
        filterParams: { values: ["Approved", "Rejected", "Pending"] },
        cellRenderer: (p: any) => getStatusBadge(p.data?.status),
      },

      // ✅ Logs replaced with icon
      {
        headerName: "Logs",
        field: "logs",
        sortable: false,
        filter: false,
        width: 90,
        cellRenderer: LogsIconRenderer,
      },

      {
        headerName: "View",
        field: "upload_certificate",
        cellRenderer: ViewRenderer,
        sortable: false,
        filter: false,
      },

      {
        headerName: "Action",
        field: "Action",
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
      },
    ];
  }, []);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
    editable: false,
    cellStyle: { display: "flex", alignItems: "center" },
  };

  return (
    <>
      {/* Header */}
      <div style={{ padding: "12px 0" }}>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 18 }}>
            Selected: <b>{selectedCount}</b>
          </div>

          <button
            className="btn btn-success"
            onClick={handleApproveSelected}
            disabled={selectedCount === 0 || isApproving}
            style={{
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: selectedCount === 0 ? 0.6 : 1,
            }}
          >
            ✅ Approve Selected ({selectedCount})
          </button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
          animateRows
          rowSelection="multiple"
          suppressRowClickSelection
          context={{ handleUpdate, handleViewPdf, handleShowLogs }}
          onSelectionChanged={() => {
            const api = gridRef.current?.api;
            if (!api) return;
            setSelectedCount(api.getSelectedRows()?.length || 0);
          }}
        />
      </div>

      {/* PDF MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "70%",
              height: "80%",
              background: "white",
              padding: "10px",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-danger"
              style={{ position: "absolute", top: 10, right: 10 }}
            >
              Close
            </button>

            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      {/* LOGS MODAL */}
      {showLogsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: "520px",
              maxWidth: "92%",
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={20} />
              <h4 style={{ margin: 0, fontWeight: 700 }}>Logs</h4>
            </div>

            <button
              onClick={() => setShowLogsModal(false)}
              className="btn btn-danger"
              style={{ position: "absolute", top: 12, right: 12 }}
            >
              Close
            </button>

            <div
              style={{
                marginTop: 14,
                maxHeight: "320px",
                overflow: "auto",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
                background: "#fafafa",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {logsLines.length === 0 ? (
                <div>No logs</div>
              ) : (
                logsLines.map((line, idx) => (
                  <div key={idx} style={{ marginBottom: 6 }}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCertificate;
