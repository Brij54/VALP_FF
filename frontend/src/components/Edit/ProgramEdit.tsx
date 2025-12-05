import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Edit = () => {
  const { id }: any = useParams();

  const baseUrl = apiConfig.getResourceUrl("Program");
  const apiUrl = `${apiConfig.getResourceUrl("Program")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Airline")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // ---------------- FETCH RECORD BY ID ----------------
  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(id, "Program");

  useEffect(() => {
    if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
      setEditedRecord((prev: any) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(fetchedDataById.resource[0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
    }
  }, [fetchedDataById, loadingEditComp]);

  // ---------------- METADATA FETCH ----------------
  useQuery({
    queryKey: ["resMetaData"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch metadata`);

      const data = await res.json();
      setResMetaData(data);
      setFields(data[0].fieldValues);

      const foreignFields = data[0].fieldValues.filter((f: any) => f.foreign);

      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(field.foreign, field.name, field.foreign_field);
        }
      }

      const enumFields = data[0].fieldValues.filter((f: any) => f.isEnum === true);

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

  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({ ...prev, [enumName]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({ ...prev, [foreignResource]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FIXED handleEdit ----------------
  const handleEdit = (id: any, field: string, value: string | File | null) => {
    setEditedRecord((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const base64EncodeFun = (str: string) =>
    btoa(unescape(encodeURIComponent(str)));

  // ---------------- UPDATE ----------------
  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (!editedRecord) return;

    const params = new FormData();

    const fileKey = Object.keys(editedRecord).find(
      (key) => editedRecord[key] instanceof File
    );

    if (fileKey) {
      params.append("file", editedRecord[fileKey]);
      editedRecord[fileKey] = "";
      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }

    // Convert record to base64 JSON
    const jsonString = JSON.stringify(editedRecord);
    params.append("resource", base64EncodeFun(jsonString));
    params.append("action", "MODIFY");

    const accessToken = getCookie("access_token");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
        body: params,
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <>
      {!loadingEditComp && (
        <div className="container mt-4">
          <form>
            <div className="d-flex flex-column border border-2 p-2 gap-2 mb-2">
              <div className="fw-bold fs-3">Program</div>

              <label>name *</label>
              <input
                type="text"
                className="form-control"
                value={editedRecord["name"] || ""}
                onChange={(e) => handleEdit(id, "name", e.target.value)}
              />

              <label>seats *</label>
              <input
                type="text"
                className="form-control"
                value={editedRecord["seats"] || ""}
                onChange={(e) => handleEdit(id, "seats", e.target.value)}
              />

              <label>instructor_name *</label>
              <input
                type="text"
                className="form-control"
                value={editedRecord["instructor_name"] || ""}
                onChange={(e) => handleEdit(id, "instructor_name", e.target.value)}
              />

              <label>syllabus</label>
              <input
                className="form-control"
                type="file"
                onChange={(e) =>
                  handleEdit(id, "syllabus", e.target.files?.[0] || null)
                }
              />

              <button className="btn btn-success" onClick={(e) => handleUpdate(id, e)}>
                Submit
              </button>
            </div>
          </form>

          {showToast && (
            <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
              <div className="toast show">
                <div className="toast-header">
                  <strong className="me-auto">Success</strong>
                </div>
                <div className="toast-body text-success text-center">
                  Updated Successfully!
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
