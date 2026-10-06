import React, { useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import html2pdf from "html2pdf.js";

const Certificate = ({
  course,
  user
}) => {
  const certificateRef = useRef();

  // Auto-generate current date (e.g., August 19, 2025)
  const certDate = new Date(course?.currentCertDate? course?.currentCertDate?.split("T")[0]:new Date());
  const formattedDate = certDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday:"long"
  });

  const handleDownload = () => {
    const element = certificateRef.current;
    const opt = {
      margin: 0,
      filename: `${user?.name}-certificate.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 }, // High resolution
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2}}>
      {/* Certificate */}
      <Box
        ref={certificateRef}
        sx={{
          width: "100%",
          maxWidth: "850px",
          minHeight: "620px",
          border: "8px double #0d1b2a",
          borderRadius: "12px",
          p: { xs: 3, md: 6 },
          textAlign: "center",
          background: "linear-gradient(135deg, #fffdf5, #f9f6ef)",
          mx: "auto",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative corners */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 30,
            height: 30,
            borderTop: "4px solid goldenrod",
            borderLeft: "4px solid goldenrod",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderTop: "4px solid goldenrod",
            borderRight: "4px solid goldenrod",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            width: 30,
            height: 30,
            borderBottom: "4px solid goldenrod",
            borderLeft: "4px solid goldenrod",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 30,
            height: 30,
            borderBottom: "4px solid goldenrod",
            borderRight: "4px solid goldenrod",
          }}
        />

        {/* Logo */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#0d1b2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            border: "3px solid goldenrod",
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            MD
          </Typography>
        </Box>

        {/* Platform Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 2,
            color: "#0d1b2a",
            textTransform: "uppercase",
          }}
        >
          METATRON DEVELOPER
        </Typography>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "goldenrod",
            mt: 2,
            textShadow: "1px 1px 2px #333",
          }}
        >
          CERTIFICATE OF COMPLETION
        </Typography>

        {/* Subtitle */}
        <Typography sx={{ mt: 3, fontSize: "1rem", color: "#444" }}>
          This is to certify that
        </Typography>

        {/* Recipient Name */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#0d1b2a",
            mt: 2,
            textTransform: "uppercase",
          }}
        >
          {user?.name}
        </Typography>

        <Typography sx={{ mt: 2, fontSize: "1rem", color: "#444" }}>
          has successfully completed the course
        </Typography>

        {/* Course Name */}
        <Typography
          variant="h6"
          textTransform={'uppercase'}
          sx={{
            fontWeight: "bold",
            color: "#0d1b2a",
            mt: 1,
            fontSize: "1.2rem",
          }}
        >
          {course?.course_title}
        </Typography>

        {/* Instructor */}
        <Typography sx={{ mt: 3, fontSize: "1rem", color: "#444" }}>
          under the instruction of
        </Typography>
        <Typography
          variant="h6"
          textTransform={'uppercase'}
          sx={{ fontWeight: "bold", color: "#0d1b2a", mt: 1 }}
        >
          {course?.course_instructor?.instructorName}
        </Typography>

        {/* Date */}
        <Typography
          sx={{
            mt: 3,
            fontSize: "1rem",
            color: "#444",
            fontStyle: "italic",
          }}
        >
          {formattedDate}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mt: 6,
            px: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "0.9rem", color: "#333" }}
          >
            Certificate ID: {course?.currentUserCertified && course?.currentCertId!=="" ? course?.currentCertId :`complete-payment-$${course?.price}`}
          </Typography>

          {/* Signature */}
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "1.5rem",
                fontStyle: "italic",
                color: "#0d1b2a",
              }}
            >
              {process.env.REACT_APP_METATRON_CEO}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.8rem", color: "#333" }}
            >
              CEO, METATRON DEVELOPER
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Download Button only if user certified 
      since download is 50/50 on small devices, dynamically
      generate the cert from the server too and send the htm to the client
      for download
      */}
      {course?.currentUserCertified && (
        <Button
        variant="contained"
        color="success"
        sx={{ mt: 3, borderRadius:3 }}
        onClick={handleDownload}
      >
        Download Certificate
      </Button>
      )}
  
    </Box>
  );
};

export default Certificate;
