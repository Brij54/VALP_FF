import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Program_Records.css";

import UpdateProgram_registration from "./Resource/UpdateProgram_registration";

export default function Program_Records() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-8X"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <UpdateProgram_registration />
      </div>
    </>
  );
}
