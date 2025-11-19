// import CertificateEdit from "./components/Edit/CertificateEdit";
// import BatchEdit from "./components/Edit/BatchEdit";
// import Login from "./components/Login/Login";
// import Registration from "./components/Registration/Registration";
// import Approve_Reject_Certificate from "./components/Approve_Reject_Certificate";
// import Batch_Config from "./components/Batch_Config";
// import Records from "./components/Records";
// import Upload from "./components/Upload";
// import './App.css';
// import { Route, Routes } from 'react-router-dom';
// import Edit from './components/Edit/Edit';
// import AddStudent from "./components/AddStudent";



// function App() {
//   return (
//     <Routes>
      
//       <Route path='/edit' element={<Edit/>}/>
//       <Route path='/upload' element={<Upload />} />
//   <Route path='/records' element={<Records />} />
//   <Route path='/batch_config' element={<Batch_Config />} />
//   <Route path='/approve_reject_certificate' element={<Approve_Reject_Certificate />} />
//   <Route path='/registration' element={<Registration />}/>
//   <Route path='/login' element={<Login />}/>
//   <Route path='/edit/batch/:id' element={<BatchEdit />} />
//     <Route path='/edit/certificate/:id' element={<CertificateEdit />} />
//     <Route path='/bulkUpload' element={<AddStudent />} />
//   </Routes>
//   );
// }

// export default App;


import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Edit from "./components/Edit/Edit";
import Upload from "./components/Upload";
import Records from "./components/Records";
import Batch_Config from "./components/Batch_Config";
import Approve_Reject_Certificate from "./components/Approve_Reject_Certificate";
import BatchEdit from "./components/Edit/BatchEdit";
import ProtectedRoute from "./components/ProtectedRoute";
import AddStudent from "./components/AddStudent";
import CertificateEdit from "./components/Edit/CertificateEdit";
import ForgotPassword from "./components/Login/ForgotPassword";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/edit" element={<Edit />} />

      {/* STUDENT ROUTES */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute requiredRoles={["student"]}>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute requiredRoles={["student"]}>
            <Records />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/batch_config"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <Batch_Config />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bulkUpload"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AddStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approve_reject_certificate"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <Approve_Reject_Certificate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/batch/:id"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <BatchEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/certificate/:id"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <CertificateEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot_password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
