// import React, { useState } from "react";
// import { forgotPassword, resetPassword } from "../../apis/backend";
// import "../../App.css";

// export default function ForgotPassword() {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");

//   const handleSendOTP = async (e: any) => {
//     e.preventDefault();
//     setErr("");
//     setMsg("");

//     const res = await forgotPassword(email);

//     if (!res.success) {
//       setErr(res.message);
//       return;
//     }

//     setMsg("OTP has been sent to your email.");
//     setStep(2);
//   };

//   const handleResetPassword = async (e: any) => {
//     e.preventDefault();
//     setErr("");
//     setMsg("");

//     const res = await resetPassword(email, otp, newPassword);

//     if (!res.success) {
//       setErr(res.message);
//       return;
//     }

//     setMsg("Password reset successful!");
//     setStep(3);
//   };

//   return (
//     <div
//       className="d-flex flex-column justify-content-center align-items-center"
//       style={{
//         height: "100vh",
//         width: "min(30vw, 400px)",
//         background: "#ffffff",
//       }}
//     >
//       {/* Header */}
//       <h3 className="text-center text-primary fw-bold mb-4">Forgot Password</h3>

//       {msg && <div className="text-success text-center">{msg}</div>}
//       {err && <div className="text-danger text-center">{err}</div>}

//       {/* STEP 1 */}
//       {step === 1 && (
//         <form onSubmit={handleSendOTP}>
//           <input
//             className="form-control bg-light border-1 mb-3"
//             placeholder="Enter Registered Email"
//             type="email"
//             required
//             style={{
//               padding: "14px",
//               borderRadius: "10px", // 🔥 smooth curve
//             }}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <button
//             className="btn text-white w-100"
//             style={{ background: "#2D88D4", borderRadius: 10 }}
//           >
//             Send OTP
//           </button>

//           <p className="mt-3 text-center">
//             Remember password?{" "}
//             <a href="/" className="text-primary">
//               Login
//             </a>
//           </p>
//         </form>
//       )}

//       {/* STEP 2 */}
//       {step === 2 && (
//         <form onSubmit={handleResetPassword}>
//           <input
//             className="form-control bg-light mb-3"
//             placeholder="Enter OTP"
//             required
//             onChange={(e) => setOtp(e.target.value)}
//           />

//           <input
//             className="form-control bg-light mb-3"
//             placeholder="Enter New Password"
//             type="password"
//             required
//             style={{
//               padding: "14px",
//               borderRadius: "10px", // 🔥 smooth curve
//             }}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />

//           <button
//             className="btn text-white w-100"
//             style={{ background: "#2D88D4", borderRadius: 10 }}
//           >
//             Reset Password
//           </button>
//         </form>
//       )}

//       {/* STEP 3 */}
//       {step === 3 && (
//         <div className="text-center">
//           <p>Password changed successfully!</p>
//           <a
//             href="/"
//             className="btn text-white w-100"
//             style={{ background: "#2D88D4", borderRadius: 10 }}
//           >
//             Go to Login
//           </a>
//         </div>
//       )}
//       {/* </div> */}
//     </div>
//   );
// }
import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../../apis/backend";
import "../../App.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // ✅ NEW
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSendOTP = async (e: any) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const res = await forgotPassword(email); // keep as-is for your OTP flow

    if (!res.success) {
      setErr(res.message);
      return;
    }

    setMsg("OTP has been sent to your email.");
    setStep(2);
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // ✅ NEW: confirm password validation
    if (newPassword !== confirmNewPassword) {
      setErr("New Password and Confirm New Password do not match.");
      return;
    }

    const res = await resetPassword(email, otp, newPassword);

    if (!res.success) {
      setErr(res.message);
      return;
    }

    setMsg("Password reset successful!");
    setStep(3);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
        width: "min(30vw, 400px)",
        background: "#ffffff",
      }}
    >
      <h3 className="text-center text-primary fw-bold mb-4">Forgot Password</h3>

      {msg && <div className="text-success text-center">{msg}</div>}
      {err && <div className="text-danger text-center">{err}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <input
            className="form-control bg-light border-1 mb-3"
            placeholder="Enter Registered Email"
            type="email"
            required
            style={{ padding: "14px", borderRadius: "10px" }}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="btn text-white w-100"
            style={{ background: "#2D88D4", borderRadius: 10 }}
          >
            Send OTP
          </button>

          <p className="mt-3 text-center">
            Remember password?{" "}
            <a href="/" className="text-primary">
              Login
            </a>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <input
            className="form-control bg-light mb-3"
            placeholder="Enter OTP"
            required
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            className="form-control bg-light mb-3"
            placeholder="Enter New Password"
            type="password"
            required
            style={{ padding: "14px", borderRadius: "10px" }}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* ✅ NEW FIELD: Confirm New Password */}
          <input
            className="form-control bg-light mb-3"
            placeholder="Confirm New Password"
            type="password"
            required
            style={{ padding: "14px", borderRadius: "10px" }}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <button
            className="btn text-white w-100"
            style={{ background: "#2D88D4", borderRadius: 10 }}
          >
            Reset Password
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center">
          <p>Password changed successfully!</p>
          <a
            href="/"
            className="btn text-white w-100"
            style={{ background: "#2D88D4", borderRadius: 10 }}
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  );
}
