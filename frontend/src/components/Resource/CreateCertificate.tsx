import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum } from "../../apis/enum";

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const CreateCertificate = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("Certificate");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Certificate");

  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ✅ async function, not useQuery
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

  // ✅ async function, not useQuery
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

  // ✅ useQuery only here
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
      setFields(data[0].fieldValues);

      const foreignFields = data[0].fieldValues.filter(
        (field: any) => field.foreign
      );
      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(
            field.foreign,
            field.name,
            field.foreign_field
          );
        }
      }

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

      return data;
    },
  });

  useEffect(() => {
    console.log("data to save", dataToSave);
  }, [dataToSave]);

  const handleCreate = async () => {
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }
    const params = new FormData();

    let selectedFile = null;
    selectedFile = Object.keys(dataToSave).filter(
      (key) => dataToSave[key] instanceof File
    );
    if (selectedFile !== undefined && selectedFile.length > 0) {
      params.append("file", dataToSave[selectedFile[0]]);
      dataToSave[selectedFile[0]] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append("resource", base64Encoded);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token here
      },
      credentials: "include", // include cookies if needed
      body: params,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

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
              setDataToSave({ ...dataToSave, ["course_name"]: e.target.value })
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
                ["course_duration"]: e.target.value,
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
              setDataToSave({ ...dataToSave, ["course_mode"]: e.target.value })
            }
          >
            <option value="">Select course_mode</option>{" "}
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
              setDataToSave({ ...dataToSave, ["platform"]: e.target.value })
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
                ["course_completion_date"]: e.target.value,
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
                  ["upload_certificate"]: e.target.files?.[0] || null,
                })
              }
            />
          </div>
          <div className="border-0 fw-bold" id="id-19">
            student_id *
          </div>
          {(() => {
            const options = foreignKeyData["Student"] || [];
            const filteredOptions = options.filter((option) =>
              option["id"]
                ?.toLowerCase()
                .includes((searchQueries["student_id"] || "").toLowerCase())
            );
            return (
              <>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id={`dropdownMenu-${"student_id"}`}
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {" "}
                  {dataToSave["student_id"]
                    ? options.find(
                        (item) => item["id"] === dataToSave["student_id"]
                      )?.["id"] || "Select"
                    : `Select student_id`}{" "}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby={`dropdownMenu-${"student_id"}`}
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={"Search student_id"}
                    value={searchQueries["student_id"] || ""}
                    onChange={(e) =>
                      handleSearchChange("student_id", e.target.value)
                    }
                  />{" "}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, i) => (
                      <button
                        key={i}
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setDataToSave({
                            ...dataToSave,
                            ["student_id"]: option["id"],
                          });
                        }}
                      >
                        {" "}
                        {option["id"]}{" "}
                      </button>
                    ))
                  ) : (
                    <span className="dropdown-item text-muted">
                      {" "}
                      No options available{" "}
                    </span>
                  )}{" "}
                </div>
              </>
            );
          })()}
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
              setDataToSave({ ...dataToSave, ["course_url"]: e.target.value })
            }
          />
          <button className="btn btn-success" id="id-1J" onClick={handleCreate}>
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
  );
};

export default CreateCertificate;
