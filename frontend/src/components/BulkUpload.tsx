// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import { parseExcelFile } from '../utils/xlsx';
// import { useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
// import { fetchEnum, getCookie } from '../apis/enum';
// export default function BulkUpload({
//   show,
//   onClose,
//   apiEndpoint,
//   headers,
//   mapRowToPayload,
//   sessionKeyName = 'key'
// }:any) {
//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [errors, setErrors] = useState([]);

//   const handleFileChange = (e:any) => {
//     setFile(e.target.files[0]);
//     setErrors([]);
//     setProgress(0);
//   };

//   const queryClient = useQueryClient();

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file.");
//       return;
//     }

//     try {
//       const data = await parseExcelFile(file, headers);
//       setTotal(data.length);
//       setUploading(true);

//       const failedRows:any = [];

//       for (let i = 0; i < data.length; i++) {
//         const row = data[i];
//         const payload = mapRowToPayload(row);
//         const success = await tryCreate(payload);
//         if (!success) {
//           failedRows.push({ row: i + 1, data: row });
//         }
//         setProgress(i + 1);
//       }

//       setErrors(failedRows);
//       setUploading(false);
//     } catch (err:any) {
//       alert(err.message);
//     }
//   };

//   const tryCreate = async (payload:any) => {
//     let success = await createUser(payload);
//     if (!success) {
//       console.log("Retrying...");
//       success = await createUser(payload);
//     }
//     return success;
//   };

//   const createUser = async (dataToSave: any) => {
//   const jsonString = JSON.stringify(dataToSave); 
//   const base64Encoded = btoa(jsonString);
//   const accessToken = getCookie("access_token");

//   if (!accessToken) {
//     console.error("Access token not found. Please log in again.");
//     return;
//   }

//   try {
//     const response = await fetch(apiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: `resource=${encodeURIComponent(base64Encoded)}`,
//     });

//     const result = await response.json();

//     if (response.ok && result.errCode === 0) {
//       console.log("Successfully uploaded")
//     } else {
//        console.error("Failed to upload")
//        return false;
//     }
//     return response.ok;
//   } catch (err) {
//     console.error("Network error: Unable to create user. Please check your connection and try again.");
//     return false;
//   }
// };


//   const handleDownloadErrors = () => {
//     const csvContent = "data:text/csv;charset=utf-8," + 
//       ["Row,Data"].concat(errors.map((e:any) => 
//         `${e.row},"${JSON.stringify(e.data).replace(/"/g, '""')}"`)).join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "failed_rows.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const reset = () => {
//     setFile(null);
//     setProgress(0);
//     setTotal(0);
//     setErrors([]);
//     setUploading(false);
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   return (
//     <div className={`modal fade ${show ? 'show d-block' : ''}`} >
//     {/* <div  > */}
//       <div className="modal-dialog modal-lg">
//         <div className="modal-content">

//           <div className="modal-header">
//             <h5 className="modal-title">Bulk Upload</h5>
//             <button type="button" className="btn-close" onClick={handleClose}></button>
//           </div>

//           <div className="modal-body">
//             <div className="mb-3">
//               <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} disabled={uploading}/>
//             </div>

//             <button className="btn btn-primary mb-3" onClick={handleUpload} disabled={!file || uploading}>
//               {uploading ? 'Uploading...' : 'Start Upload'}
//             </button>

//             {uploading && (
//               <div className="progress mb-3">
//                 <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
//                   style={{ width: `${(progress / total) * 100}%` }}>
//                   {progress} / {total}
//                 </div>
//               </div>
//             )}
//             {total > 0 && !uploading && (
//               <>
//                 <h5>Upload Summary:</h5>
//                 <ul>
//                   <li>✅ Success: {total-errors.length}</li>
//                   <li>❌ Failed: {errors.length}</li>
//                 </ul>
//               </>
//             )}

//             {errors.length > 0 && (
//               <>
//                 <h5>Failed Rows ({errors.length}):</h5>
//                 <ul className="list-group mb-3">
//                   {errors.slice(0, 10).map((err:any, idx) => (
//                     <li key={idx} className="list-group-item list-group-item-danger">
//                       Row {err.row}: {JSON.stringify(err.data)}
//                     </li>
//                   ))}
//                 </ul>
//                 {errors.length > 10 && <p>Only first 10 errors shown.</p>}
//                 <button className="btn btn-secondary" onClick={handleDownloadErrors}>
//                   Download Failed Rows
//                 </button>
//               </>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={uploading}>
//               Close
//             </button>
//           </div>

//         </div>
//       </div>
//       hello
//     </div>
    
//   );
// }


// // EXAMPLE USAGE
// // import React, { useState } from 'react';
// // import BulkUploadModal from './BulkUploadModal';

// // export default function ParentComponent() {
// //   const [showModal, setShowModal] = useState(false);

// //   const apiEndpoint = '/your/api/endpoint';
// //   const headers = ['First Name', 'Last Name', 'Email', 'Phone'];

// //   const mapRowToPayload = (row) => ({
// //     first_name: row['First Name'],
// //     last_name: row['Last Name'],
// //     email: row['Email'],
// //     phone: row['Phone']
// //   });

// //   return (
// //     <div className="container mt-4">
// //       <h3>Example Parent</h3>
// //       <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// //         Open Bulk Upload
// //       </button>

// //       <BulkUploadModal 
// //         show={showModal}
// //         onClose={() => setShowModal(false)}
// //         apiEndpoint={apiEndpoint}
// //         headers={headers}
// //         mapRowToPayload={mapRowToPayload}
// //       />
// //     </div>
// //   );
// // }
import React, { useState } from "react";
import * as XLSX from "xlsx";
//import { parseExcelFile } from "../utils/xlsx";
import { getCookie } from "../apis/enum";
import { useQueryClient } from "@tanstack/react-query";
import { parseExcelFile } from "../utils/xlsx";

interface BulkUploadModalProps {
  show: boolean;
  onClose: () => void;
  apiEndpoint: string;
  headers: string[];
  mapRowToPayload: (row: any) => any;
  sessionKeyName?: string;
}

export default function BulkUploadModal({
  show,
  onClose,
  apiEndpoint,
  headers,
  mapRowToPayload,
  sessionKeyName = "key",
}: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ row: number; data: any }[]>([]);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrors([]);
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const data = await parseExcelFile(file, headers);
      setTotal(data.length);
      setUploading(true);

      const failedRows: any[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const payload = mapRowToPayload(row);
        const success = await tryCreate(payload);
        if (!success) {
          failedRows.push({ row: i + 1, data: row });
        }
        setProgress(i + 1);
      }

      setErrors(failedRows);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const tryCreate = async (payload: any) => {
    let success = await createUser(payload);
    if (!success) {
      console.warn("Retrying...");
      success = await createUser(payload);
    }
    return success;
  };

  const createUser = async (dataToSave: any) => {
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      console.error("Access token not found. Please log in again.");
      return false;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
        body: `resource=${encodeURIComponent(base64Encoded)}`,
      });

      const result = await response.json();
      if (response.ok && result.errCode === 0) {
        console.log("Successfully uploaded");
        return true;
      } else {
        console.error("Failed to upload");
        return false;
      }
    } catch (err) {
      console.error("Network error:", err);
      return false;
    }
  };

  const handleDownloadErrors = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Row,Data"]
        .concat(
          errors.map(
            (e) =>
              `${e.row},"${JSON.stringify(e.data).replace(/"/g, '""')}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "failed_rows.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setTotal(0);
    setErrors([]);
    setUploading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Bulk Upload</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            <button
              className="btn btn-primary mb-3"
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? "Uploading..." : "Start Upload"}
            </button>

            {uploading && (
              <div className="progress mb-3">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${(progress / total) * 100}%` }}
                >
                  {progress} / {total}
                </div>
              </div>
            )}

            {total > 0 && !uploading && (
              <>
                <h5>Upload Summary:</h5>
                <ul>
                  <li>✅ Success: {total - errors.length}</li>
                  <li>❌ Failed: {errors.length}</li>
                </ul>
              </>
            )}

            {errors.length > 0 && (
              <>
                <h5>Failed Rows ({errors.length}):</h5>
                <ul className="list-group mb-3">
                  {errors.slice(0, 10).map((err, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-danger"
                    >
                      Row {err.row}: {JSON.stringify(err.data)}
                    </li>
                  ))}
                </ul>
                {errors.length > 10 && <p>Only first 10 errors shown.</p>}
                <button
                  className="btn btn-secondary"
                  onClick={handleDownloadErrors}
                >
                  Download Failed Rows
                </button>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={uploading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
