import React, { useState } from "react";
import "../../App.css";
import { forgotPassword } from "../../apis/backend";

const ForgotPassword: React.FC = () => {
  const [identifier, setIdentifier] = useState(""); // username OR email
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your username or email.");
      return;
    }

    try {
      // ✅ property name matches type: { identifier: string }
      const success = await forgotPassword({ identifier: identifier.trim() });

      if (success) {
        setMessage(
          "If this account exists, a password reset link has been sent to your email."
        );
      } else {
        setError("Failed to process request. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: 800 }}>
      <form
        className="border w-15 d-flex flex-column m-auto shadow-sm"
        style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
        onSubmit={handleSubmit}
      >
        <div
          className="d-flex justify-content-center"
          style={{
            background: "#DCDCDC",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h3 className="fs-5 fw-light p-2">Forgot Password</h3>
        </div>

        <div className="d-flex flex-column gap-4 p-4 align-items-center">
          {/* Single textbox: username OR email */}
          <div className="w-100">
            <input
              type="text"
              className="form-control bg-light border-1"
              name="identifier"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="text-center col-sm-10">
            <button
              type="submit"
              className="btn text-white w-100"
              style={{
                background: "#2D88D4",
                fontSize: "18px",
                borderRadius: "10px",
              }}
            >
              Submit
            </button>
          </div>

          {message && <div className="fs-6 text-success">{message}</div>}
          {error && <div className="fs-6 text-danger">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
