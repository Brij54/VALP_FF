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

const CreateDean = () => {
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
  const apiUrl = apiConfig.getResourceUrl("Dean");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Dean");

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
    <>
      {/* Title */}
      <div style={{ width: "100%", padding: "10px 40px" }}>
        {/* Title */}
        <h2
          style={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.4 rem",
            color: "#222",
            marginBottom: "30px",
          }}
        >
          Add Signature
        </h2>

        {/* ======= 2 Column Layout ======= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            width: "100%",
          }}
        >
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "6px",
                color: "#2b3a67",
              }}
            >
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={dataToSave["name"] || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, name: e.target.value })
              }
              style={{
                height: "50px",
                borderRadius: "6px",
                border: "1px solid #dcdcdc",
                padding: "6px 10px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Updated At */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "6px",
                color: "#2b3a67",
              }}
            >
              Updated At
            </label>
            <input
              type="date"
              name="updated_at"
              value={dataToSave["updated_at"] || ""}
              onChange={(e) =>
                setDataToSave({ ...dataToSave, updated_at: e.target.value })
              }
              style={{
                height: "50px",
                borderRadius: "6px",
                border: "1px solid #dcdcdc",
                padding: "6px 10px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* Signature Upload – Full Width */}
        <div style={{ marginTop: "25px" }}>
          <label
            style={{
              fontWeight: "500",
              marginBottom: "6px",
              display: "block",
              color: "#2b3a67",
            }}
          >
            Signature <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="file"
            name="signature"
            onChange={(e) =>
              setDataToSave({
                ...dataToSave,
                signature: e.target.files?.[0] || null,
              })
            }
            style={{
              width: "50%",
              height: "50px",
              border: "1px solid #dcdcdc",
              padding: "6px",
              borderRadius: "6px",
              outline: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "35px", textAlign: "center" }}>
          <button
            onClick={handleCreate}
            style={{
              width: "150px",
              height: "40px",
              borderRadius: "6px",
              border: "none",
              background: "#007bff",
              color: "white",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
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
      {/* </div> */}
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
    </>
  );
};

export default CreateDean;
