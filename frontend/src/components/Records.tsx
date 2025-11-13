

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Records.css";

          
            import ReadCertificate from './Resource/ReadCertificate';

            import Calendar from "./Calendar/Calendar";export default function Records() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-1L" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><ReadCertificate/></div>

              </>

            );

          }