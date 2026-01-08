import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../apis/backend";
// import "./Terms.css";

import CreateAcademic_year from "./Resource/CreateAcademic_year";
import ReadAcademic_year from "./Resource/ReadAcademic_year";
import Calendar from "./Calendar/Calendar";
export default function Terms() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-LH"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateAcademic_year />
      </div>
      <div
        id="id-MB"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <ReadAcademic_year />
      </div>
    </>
  );
}
