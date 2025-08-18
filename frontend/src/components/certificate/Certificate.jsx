// handle the download of the certificate
/* const handleDownload = () => {
  const element = certRef.current;

  const options = {
    margin: 0,
    filename: `${userName}_Certificate.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // Higher scale = better resolution
      useCORS: true // Ensures external images like logos are captured
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'landscape'
    }
  };

  html2pdf().set(options).from(element).save();
}; */


// css styles

/* .certificate-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f4f6f8;
}

.certificate {
  width: 900px;
  padding: 40px;
  background: #fff;
  border: 8px solid #2c3e50;
  box-shadow: 0 0 25px rgba(0,0,0,0.1);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.cert-logo {
  width: 80px;
  margin-bottom: 10px;
}

.cert-header h1 {
  font-size: 32px;
  margin: 0;
  color: #2c3e50;
}

.cert-body p {
  font-size: 18px;
  margin: 10px 0;
  color: #34495e;
}

.cert-name,
.cert-course,
.cert-instructor,
.cert-date {
  color: #2980b9;
  font-weight: bold;
}

.cert-footer {
  margin-top: 40px;
  font-size: 14px;
  color: #7f8c8d;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
} */



// code component

// import React, { useRef } from 'react';
// import html2pdf from 'html2pdf.js';
// import './Certificate.css'; // Optional: move styles here

// const Certificate = ({
//   userName = "SHIMMITA",
//   courseTitle = "Introduction to Ethical AI & Fraud Detection",
//   instructor = "Dr. Amina Nyong'o",
//   issueDate = "August 19, 2025",
//   certID = "MTN-2025-00123",
//   logoUrl = "https://yourdomain.com/metatron-logo.png"
// }) => {
//   const certRef = useRef();

//   const handleDownload = () => {
//     const element = certRef.current;
//     html2pdf().set({
//       margin: 0,
//       filename: `${userName}_Certificate.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
//     }).from(element).save();
//   };

//   return (
//     <div className="certificate-wrapper">
//       <div className="certificate" ref={certRef}>
//         <div className="cert-header">
//           {logoUrl && <img src={logoUrl} alt="METATRON Logo" className="cert-logo" />}
//           <h1>CERTIFICATE OF COMPLETION</h1>
//           <p>Issued by <strong>METATRON</strong></p>
//         </div>

//         <div className="cert-body">
//           <p>This certifies that</p>
//           <h2 className="cert-name">{userName}</h2>
//           <p>has successfully completed the course</p>
//           <h3 className="cert-course">{courseTitle}</h3>
//           <p>under the instruction of</p>
//           <h4 className="cert-instructor">{instructor}</h4>
//           <p>on</p>
//           <h4 className="cert-date">{issueDate}</h4>
//         </div>

//         <div className="cert-footer">
//           <span className="cert-id">Certificate ID: {certID}</span>
//         </div>
//       </div>

//       <button onClick={handleDownload} className="download-btn">Download PDF</button>
//     </div>
//   );
// };

// export default Certificate;
