import React, { useState, useEffect, useContext } from "react";
import apiConfig from "../../config/apiConfig";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import CertificateModel from "../../models/CertificateModel";
import { LoginContext } from "../../context/LoginContext";
import { fetchForeignResource } from "../../apis/resources";
import { authFetch } from "../../apis/authFetch";

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/* --------------------------------------------------
   🔥 1. Prettify headers (snake_case → Title Case)
----------------------------------------------------*/
const prettifyHeader = (str: string) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

/* --------------------------------------------------
   🔥 2. Status Badge Styling
----------------------------------------------------*/
const getStatusBadge = (status: any) => {
  const s = String(status).toLowerCase();

  const badgeStyle = {
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "8px",
  };

  if (s === "true") {
    return (
      <span className="badge bg-success text-white" style={badgeStyle}>
        ✅ Approved
      </span>
    );
  }

  if (s === "false") {
    return (
      <span className="badge bg-danger text-white" style={badgeStyle}>
        ❌ Rejected
      </span>
    );
  }

  return (
    <span className="badge bg-warning text-dark" style={badgeStyle}>
      ⏳ Pending
    </span>
  );
};

const ReadCertificate = () => {
  const { user } = useContext(LoginContext);
  const userEmail = user?.email_id?.toLowerCase() || "";

  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<ColDef[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const regex = /^(g_|archived|extra_data)/;

  /* --------------------------------------------------
     3. Fetch Student list
  ----------------------------------------------------*/
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchForeignResource("Student"),
    enabled: !!userEmail,
  });

  useEffect(() => {
    if (!studentsData || !userEmail) return;

    const students: any[] = Array.isArray(studentsData)
      ? studentsData
      : studentsData.resource || [];

    const match = students.find(
      (s: any) => s.email && s.email.toLowerCase() === userEmail
    );

    setStudentId(match?.id || null);
  }, [studentsData, userEmail]);

  /* --------------------------------------------------
     4. Fetch Certificate Data
  ----------------------------------------------------*/
  useQuery({
    queryKey: ["resourceData", "certificate"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const response = await authFetch(
        `${apiConfig.getResourceUrl("certificate")}?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      const all = data.resource || [];
      setAllCertificates(all);
      return data;
    },
    enabled: !!userEmail,
  });



  /* --------------------------------------------------
     5. Fetch Metadata
  ----------------------------------------------------*/
  useQuery({
    queryKey: ["resourceMetaData", "certificate"],
    queryFn: async () => {
      const response = await authFetch(
        `${apiConfig.getResourceMetaDataUrl("certificate")}?`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Error: " + response.status);
      const data = await response.json();

      const required = data[0]?.fieldValues
        .filter((f: any) => !regex.test(f.name))
        .map((f: any) => f.name);

      setRequiredFields(required || []);
      return data;
    },
  });



  /* --------------------------------------------------
     6. Filter by Student Id
  ----------------------------------------------------*/
  useEffect(() => {
    if (!studentId) return setFilteredCertificates([]);

    const filtered = allCertificates.filter(
      (c: any) => c.student_id === studentId
    );
    setFilteredCertificates(filtered);
  }, [allCertificates, studentId]);

  /* --------------------------------------------------
     7. Convert to model → JSON
  ----------------------------------------------------*/
  useEffect(() => {
    if (filteredCertificates.length > 0) {
      const modelObjects = filteredCertificates.map((o: any) =>
        CertificateModel.fromJson(o)
      );
      setRowData(modelObjects.map((m: any) => m.toJson()));
    } else {
      setRowData([]);
    }
  }, [filteredCertificates]);

  /* --------------------------------------------------
     8. Build Column Defs with PRETTIFIED HEADERS + DATE FORMAT 🔥
  ----------------------------------------------------*/
  useEffect(() => {
    const flds =
      requiredFields.filter(
        (field: any) => field !== "id" && field !== "student_id"
      ) || [];

    const columns: ColDef[] = flds.map((field: any) => {
      const baseCol: ColDef = {
        field,
        headerName: prettifyHeader(field),
        resizable: true,
        sortable: true,
        filter: true,
      };

      // Status field styling
      if (field.toLowerCase() === "status") {
        return {
          ...baseCol,
          headerName: "Status",
          cellRenderer: (params: any) => getStatusBadge(params.value),
        };
      }

      // 🟢 FORMAT COURSE_COMPLETION_DATE → Date Only
      if (field.toLowerCase() === "course_completion_date") {
        return {
          ...baseCol,
          headerName: "Course Completion Date",
          cellRenderer: (params: any) => {
            if (!params.value) return "";
            return new Date(params.value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
          },
        };
      }

      // Certificate download button
      if (field === "upload_certificate") {
        return {
          ...baseCol,
          headerName: "Certificate",
          cellRenderer: (params: any) => {
            const documentId = params.value;

            const handleDownload = async (e: any) => {
              e.stopPropagation();

              try {
                const url =
                  `${apiConfig.API_BASE_URL}/certificate` +
                  `?document_id=${documentId}&queryId=GET_DOCUMENT` +
                  `&dmsRole=admin&user_id=${userEmail}`;

                const response = await authFetch(url, {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error("Download failed");

                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = downloadUrl;

                const filename =
                  response.headers
                    .get("Content-Disposition")
                    ?.split("filename=")[1]
                    ?.replace(/['"]/g, "") || "certificate.pdf";

                a.download = filename;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
              } catch (err) {
                console.error("Download error:", err);
              }
            };


            return (
              <button
                className="btn btn-primary"
                onClick={handleDownload}
                style={{
                  fontSize: "14px",
                  padding: "6px 20px",
                  borderRadius: "8px",
                }}
              >
                Download
              </button>
            );
          },
        };
      }

      return baseCol;
    });

    setColDef1(columns);
  }, [requiredFields, userEmail]);

  /* --------------------------------------------------
     9. Default Column Config
  ----------------------------------------------------*/
  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    editable: false,
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDef1}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
        />
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1600 }}
        >
          <div className="toast show shadow">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              />
            </div>
            <div className="toast-body text-success text-center">
              Created Successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadCertificate;


