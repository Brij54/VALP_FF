import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

//   import "./Program_Config.css";

import CreateProgram from "./Resource/CreateProgram";

import UpdateProgram from "./Resource/UpdateProgram_registration";

export default function Program_Config() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-79"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateProgram />
      </div>
      <div
        id="id-83"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <UpdateProgram />
      </div>
    </>
  );
}
