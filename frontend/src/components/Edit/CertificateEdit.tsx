import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Edit = () => {
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Certificate");
  const apiUrl = `${apiConfig.getResourceUrl("Certificate")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add token here
      },
      credentials: "include", // include cookies if needed
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id && !!resourceName,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
    id,
    "Certificate"
  );

  useEffect(() => {
    // console.log()

    if (fetchDataById.length > 0 && !loadingEditComp) {
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(fetchedDataById["resource"][0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
      console.log(
        "fetched data by ID",
        fetchedDataById,
        loadingEditComp,
        editedRecord
      );
    }
  }, [fetchedDataById, loadingEditComp]);

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

  const handleEdit = (id: any, field: string, value: any) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };
  const base64EncodeFun = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (editedRecord.length === 0) return;

    const params = new FormData();

    let selectedFile = null;
    selectedFile = Object.keys(editedRecord).filter(
      (key) => editedRecord[key] instanceof File
    );
    if (selectedFile !== undefined && selectedFile.length > 0) {
      params.append("file", editedRecord[selectedFile[0]]);
      editedRecord[selectedFile[0]] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }
    const jsonString = JSON.stringify(editedRecord);

    const base64Encoded = base64EncodeFun(jsonString);
    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    try {
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
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  return (
    <>
      {!loadingEditComp && (
        <div className="container mt-4">
          <form>
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
                value={editedRecord[id]?.["course_name"] || ""}
                onChange={(e) => handleEdit(id, "course_name", e.target.value)}
              />
              <div className="border-0 fw-bold" id="id-D">
                course_duration *
              </div>
              <input
                type="text"
                className="form-control"
                name="course_duration"
                required={true}
                value={editedRecord[id]?.["course_duration"] || ""}
                onChange={(e) =>
                  handleEdit(id, "course_duration", e.target.value)
                }
              />
              <div className="border-0 fw-bold" id="id-J">
                course_mode *
              </div>
              <select
                className="form-select"
                name="course_mode"
                required={true}
                value={editedRecord[id]?.["course_mode"] || ""}
                onChange={(e) => handleEdit(id, "course_mode", e.target.value)}
              >
                <option value="">Select course_mode</option>{" "}
                {enums?.["Course_mode"]?.map((val, idx) => (
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
                value={editedRecord[id]?.["platform"] || ""}
                onChange={(e) => handleEdit(id, "platform", e.target.value)}
              />
              <div className="border-0 fw-bold" id="id-V">
                course_completion_date *
              </div>
              <input
                type="date"
                className="form-control"
                name="course_completion_date"
                required={true}
                value={editedRecord[id]?.["course_completion_date"] || ""}
                onChange={(e) =>
                  handleEdit(id, "course_completion_date", e.target.value)
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
                    handleEdit(
                      id,
                      "upload_certificate",
                      e.target.files?.[0] || null
                    )
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
                      {editedRecord[id]?.["student_id"]
                        ? options.find(
                            (item) => item.id === editedRecord[id]["student_id"]
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
                            onClick={() =>
                              handleEdit(id, "student_id", option.id)
                            }
                          >
                            {" "}
                            {option["id"]}{" "}
                          </button>
                        ))
                      ) : (
                        <span className="dropdown-item text-muted">
                          No options available
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
                value={editedRecord[id]?.["course_url"] || ""}
                onChange={(e) => handleEdit(id, "course_url", e.target.value)}
              />
              <button
                className="btn btn-success"
                id="id-1J"
                onClick={(e) => handleUpdate(id, e)}
              >
                Submit
              </button>
            </div>
          </form>

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
                    onClick={() => setShowToast(false)}
                  ></button>
                </div>
                <div className="toast-body text-success text-center">
                  Updated successfully!
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Edit;
