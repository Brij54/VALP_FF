import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Upload.css";

import CreateCertificate from "./Resource/CreateCertificate";

import Calendar from "./Calendar/Calendar";
export default function Upload() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-1"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateCertificate />
      </div>
    </>
  );
}
