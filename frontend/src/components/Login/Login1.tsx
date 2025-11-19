
// import "../../App.css";
// // import React from "react";

// export default function Login1(props: any) {
//   return (
//     <div className="d-flex flex-column" style={{ height: 800 }}>
//       <form
//         className="border w-15 d-flex flex-column m-auto shadow-sm"
//         style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
//         onSubmit={props.handleSubmit}
//       >
//         <div
//           className=" d-flex justify-content-center "
//           style={{
//             background: "#DCDCDC",
//             borderTopLeftRadius: "10px",
//             borderTopRightRadius: "10px",
//           }}
//         >
//           <h3 className="fs-5 fw-light  p-2">Sign in</h3>
//         </div>
//         <div className=" d-flex flex-column gap-4 p-4 align-items-center ">
//           <div className="d-flex gap-4 justify-content-end">
//             <input
//               type="string"
//               className="form-control  bg-light  border-1"
//               name="username"
//               placeholder="Enter Username"
//               onChange={(e) =>
//                 props.setFormData({ ...(props.formData), [e.target.name]: e.target.value })
//               }
//             />
//           </div>
//           <div className="d-flex gap-4  justify-content-start">
//             <input
//               type="password"
//               className="form-control bg-light border-1 "
//               name="password"
//               placeholder="Enter Password"
//               onChange={(e) =>
//                 props.setFormData({ ...(props.formData), [e.target.name]: e.target.value })
//               }
//             />
//           </div>
//           <div className=" text-center col-sm-10">
//             <button
//               type="submit"
//               className="btn text-white w-100  "
//               style={{
//                 background: "#2D88D4",
//                 fontSize: "18px",
//                 borderRadius: "10px",
//               }}
//               // onClick={handleLogin}
//               // disabled={!props.isEmailValid() || !props.isPasswordValid()}
//             >
//               Login
//             </button>
//           </div>

//           {props.error && ( // Updated: Conditionally render error message
//             <div className="fs-6 text-danger">{props.error}</div>
//           )}

//           <div className="fs-6 d-flex flex-column align-items-center">
//             {/* <p className="mb-0 m-4">Forgot Password</p> */}
//             <p>
//               Don't have an account?{" "}
//               <a href="#" className="text-decoration-none">
//                 Click Me
//               </a>
//             </p>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";   // 👈 add this

export default function Login1(props: any) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column" style={{ height: 800 }}>
      <form
        className="border w-15 d-flex flex-column m-auto shadow-sm"
        style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
        onSubmit={props.handleSubmit}
      >
        <div
          className=" d-flex justify-content-center "
          style={{
            background: "#DCDCDC",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h3 className="fs-5 fw-light  p-2">Sign in</h3>
        </div>
        <div className=" d-flex flex-column gap-4 p-4 align-items-center ">
          <div className="d-flex gap-4 justify-content-end">
            <input
              type="string"
              className="form-control  bg-light  border-1"
              name="username"
              placeholder="Enter Username"
              onChange={(e) =>
                props.setFormData({
                  ...(props.formData),
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="d-flex gap-4  justify-content-start">
            <input
              type="password"
              className="form-control bg-light border-1 "
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                props.setFormData({
                  ...(props.formData),
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className=" text-center col-sm-10">
            <button
              type="submit"
              className="btn text-white w-100  "
              style={{
                background: "#2D88D4",
                fontSize: "18px",
                borderRadius: "10px",
              }}
            >
              Login
            </button>
          </div>

          {props.error && (
            <div className="fs-6 text-danger">{props.error}</div>
          )}

          <div className="fs-6 d-flex flex-column align-items-center">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate("/forgot_password")}
              >
                Click Me
              </button>
            </p>
          </div>
 

        </div>
      </form>
    </div>
  );
}
