import React, { useState, useEffect, useRef, useContext } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";
import { LoginContext } from "../../context/LoginContext";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    const trimmedKey = key.trim();

    if (trimmedKey === name) {
      return rest.join("=").trim() || null;
    }
  }

  return null;
};

const CreateCertificate = () => {
  const { user } = useContext(LoginContext); // logged-in user

  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<boolean>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  const regex = /^(g_|archived|extra_data)/; // currently unused, but kept

  const apiUrl = apiConfig.getResourceUrl("Certificate");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Certificate");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ---- Foreign data loader ----
  const fetchForeignData = async (
    foreignResource: string,
    fieldName: string,
    foreignField: string
  ) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({
        ...prev,
        [foreignResource]: data,
      }));
    } catch (err) {
      console.error(`Error fetching foreign data for ${fieldName}:`, err);
    }
  };

  // ---- Enum data loader ----
  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({
        ...prev,
        [enumName]: data,
      }));
    } catch (err) {
      console.error(`Error fetching enum data for ${enumName}:`, err);
    }
  };

  // ---- Metadata & foreign/enum bootstrap ----
  const {
    data: metaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);
      }

      const data = await res.json();

      setResMetaData(data);

      if (Array.isArray(data) && data.length > 0) {
        setFields(data[0].fieldValues);

        // foreign fields
        const foreignFields = data[0].fieldValues.filter(
          (field: any) => field.foreign
        );

        for (const field of foreignFields) {
          if (!fetchedResources.current.has(field.foreign)) {
            fetchedResources.current.add(field.foreign);

            // prefetch for cache
            queryClient.prefetchQuery({
              queryKey: ["foreignData", field.foreign],
              queryFn: () => fetchForeignResource(field.foreign),
            });

            await fetchForeignData(field.foreign, field.name, field.foreign_field);
          }
        }

        // enum fields
        const enumFields = data[0].fieldValues.filter(
          (field: any) => field.isEnum === true
        );

        for (const field of enumFields) {
          if (!fetchedEnum.current.has(field.possible_value)) {
            fetchedEnum.current.add(field.possible_value);

            queryClient.prefetchQuery({
              queryKey: ["enum", field.possible_value],
              queryFn: () => fetchEnum(field.possible_value),
            });

            await fetchEnumData(field.possible_value);
          }
        }
      }

      return data;
    },
  });

  // ---- Auto-set student_id from logged-in user's email ----
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const students = foreignKeyData["Student"] || [];
    console.log("all student data", students, user);
    if (!students.length) return;

    const match = students.find(
      (s: any) =>
        s.email && s.email.toLowerCase() === user.email_id.toLowerCase()
    );

    if (match && match.id) {
      setDataToSave((prev: any) => ({
        ...prev,
        student_id: match.id, // certificate.student_id = Student.id
      }));
    } else {
      console.warn(
        "No matching student found for logged-in user email:",
        user.email_id
      );
    }
  }, [user, foreignKeyData]);

  useEffect(() => {
    console.log("data to save", dataToSave);
  }, [dataToSave]);

  const handleCreate = async () => {
    const accessToken = getCookie("access_token");
    console.log("access_token from cookie:", accessToken);

    if (!accessToken) {
      alert("Access token not found. Please login again.");
      return;
    }

    // Optional guard: avoid backend error if mapping failed
    if (!dataToSave.student_id) {
      alert("Student mapping not found. Please contact admin.");
      return;
    }

    const params = new FormData();

    // clone dataToSave so we don't mutate React state directly
    const payload: any = { ...dataToSave };

    const fileFieldKeys = Object.keys(payload).filter(
      (key) => payload[key] instanceof File
    );

    if (fileFieldKeys.length > 0) {
      const fileKey = fileFieldKeys[0];
      params.append("file", payload[fileKey]);
      // backend expects field empty in resource JSON
      payload[fileKey] = "";

      // DMS-related fixed values
      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    const jsonString = JSON.stringify(payload);
    const base64Encoded = btoa(jsonString);
    params.append("resource", base64Encoded);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: params,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    } else {
      console.error("Failed to create certificate", await response.text());
      alert("Failed to create certificate. Please try again.");
    }
  };

  useEffect(() => {
    console.log("all data to save", dataToSave, user);
  }, [dataToSave, user]);

  if (isLoading) {
    return <div>Loading certificate metadata...</div>;
  }

  if (error) {
    return <div>Error loading metadata.</div>;
  }

  return (
    <div>
      <div>
        <div
          id="id-1"
          className="d-flex flex-column border border-2 p-2 gap-2 mb-2"
        >
          <div className="border-0 fw-bold fs-3" id="id-3">
            Certificate
          </div>

          <div className="border-0 fw-bold" id="id-7">
            course_name *
          </div>
          <input
            type="text"
            className="form-control"
            name="course_name"
            required={true}
            value={dataToSave["course_name"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_name: e.target.value,
              })
            }
          />

          <div className="border-0 fw-bold" id="id-D">
            course_duration *
          </div>
          <input
            type="text"
            className="form-control"
            name="course_duration"
            required={true}
            value={dataToSave["course_duration"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_duration: e.target.value,
              })
            }
          />

          <div className="border-0 fw-bold" id="id-J">
            course_mode *
          </div>
          <select
            className="form-select"
            name="course_mode"
            required={true}
            value={dataToSave["course_mode"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_mode: e.target.value,
              })
            }
          >
            <option value="">Select course_mode</option>
            {Object.keys(enums).length !== 0 &&
              enums["Course_mode"] !== undefined &&
              enums["Course_mode"]?.map((val, idx) => (
                <option key={idx} value={val}>
                  {val}
                </option>
              ))}
          </select>

          <div className="border-0 fw-bold" id="id-P">
            platform *
          </div>
          <input
            type="text"
            className="form-control"
            name="platform"
            required={true}
            value={dataToSave["platform"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                platform: e.target.value,
              })
            }
          />

          <div className="border-0 fw-bold" id="id-V">
            course_completion_date *
          </div>
          <input
            type="date"
            className="form-control"
            name="course_completion_date"
            required={true}
            value={dataToSave["course_completion_date"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_completion_date: e.target.value,
              })
            }
          />

          <div className="border-0 fw-bold" id="id-11">
            upload_certificate *
          </div>
          <div className="mb-3" id="id-13">
            <label className="form-label">
              Upload file for upload_certificate{" "}
            </label>
            <input
              className="form-control"
              type="file"
              name="upload_certificate"
              required={true}
              onChange={(e) =>
                setDataToSave({
                  ...dataToSave,
                  upload_certificate: e.target.files?.[0] || null,
                })
              }
            />
          </div>

          {/* student_id HIDDEN – auto-filled from logged-in user */}
          <input
            type="hidden"
            name="student_id"
            value={dataToSave["student_id"] || ""}
          />

          <div className="border-0 fw-bold" id="id-1F">
            course_url
          </div>
          <input
            type="text"
            className="form-control"
            name="course_url"
            required={false}
            value={dataToSave["course_url"] || ""}
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                course_url: e.target.value,
              })
            }
          />

          <button
            className="btn btn-success"
            id="id-1J"
            onClick={handleCreate}
          >
            Submit
          </button>
        </div>

        {showToast && (
          <div
            className="toast-container position-fixed top-20 start-50 translate-middle p-3"
            style={{ zIndex: 1550 }}
          >
            <div
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <strong className="me-auto">Success</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  onClick={() => setShowToast(false)}
                ></button>
              </div>
              <div className="toast-body text-success text-center">
                Created successfully!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCertificate;
