import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Approve_Reject_Certificate.css";

import UpdateCertificate from "./Resource/UpdateCertificate";

import Calendar from "./Calendar/Calendar";
export default function Approve_Reject_Certificate() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-49"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <UpdateCertificate />
      </div>
    </>
  );
}
