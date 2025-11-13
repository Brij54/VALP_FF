import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Generate empty Excel template
export function generateExcelTemplate(headers = [], filename = 'template.xlsx') {
  if (headers.length === 0) {
    console.error('No headers provided');
    return;
  }

  // Create AOA (array of arrays)
  const aoa = [headers];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(file, filename);
}

// Parse uploaded Excel file
export function parseExcelFile(file, headers = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      console.log(sheetName,worksheet)

      // Convert sheet to JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: ''});
      console.log(rawData)
      // Validate headers if provided
      if (headers.length > 0) {
        const fileHeaders = Object.keys(rawData[0] || {});
        const missingHeaders = headers.filter(h => !fileHeaders.includes(h));
        console.log(missingHeaders)
        // if (missingHeaders.length > 0) {
        //   reject(new Error(`Missing headers in uploaded file: ${missingHeaders.join(', ')}`));
        //   return;
        // }
      }

      resolve(rawData);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}


// Example Uses
// import { generateExcelTemplate } from './excelUtils';

// const headers = ['First Name', 'Last Name', 'Email', 'Phone'];
// generateExcelTemplate(headers, 'User_Template.xlsx');

// import { parseExcelFile } from './excelUtils';

// <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />

// function handleUpload(e) {
//   const file = e.target.files[0];
//   const headers = ['First Name', 'Last Name', 'Email', 'Phone'];
  
//   parseExcelFile(file, headers)
//     .then(data => {
//       console.log("Parsed Data: ", data);
//       // Process your uploaded data here
//     })
//     .catch(err => {
//       console.error("Error parsing file: ", err.message);
//     });
// }
