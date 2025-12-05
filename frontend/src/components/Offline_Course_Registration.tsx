import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

//   import "./Offline_Course_Registration.css";

import ReadProgram from "./Resource/ReadProgram";

import CreateProgram_registration from "./Resource/CreateProgram_registration";

export default function Offline_Course_Registration() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-9F"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <ReadProgram />
      </div>
      <div
        id="id-A9"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateProgram_registration />
      </div>
    </>
  );
}
