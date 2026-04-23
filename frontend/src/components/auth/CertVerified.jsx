import { Box, Typography, Chip } from "@mui/material";
import { VerifiedRounded } from "@mui/icons-material";

const CertVerified = ({ certificateData }) => {
  const certDate = new Date(certificateData?.createdAt?.split("T")[0]);
  const formattedDate = certDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          minHeight: "640px",
          border: "8px double #0d1b2a",
          borderRadius: "12px",
          p: { xs: 3, md: 6 },
          background: "linear-gradient(135deg, #fffdf5, #f9f6ef)",
          mx: "auto",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* VERIFIED BADGE */}
        <Chip
          icon={<VerifiedRounded />}
          label="Verified Certificate"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "#14D2BE",
            color: "#fff",
            fontWeight: "bold",
          }}
        />

        {/* CORNERS */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(
          (pos, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 30,
                height: 30,
                borderColor: "goldenrod",
                ...(pos.includes("top")
                  ? { top: 10, borderTop: "4px solid goldenrod" }
                  : { bottom: 10, borderBottom: "4px solid goldenrod" }),
                ...(pos.includes("left")
                  ? { left: 10, borderLeft: "4px solid goldenrod" }
                  : { right: 10, borderRight: "4px solid goldenrod" }),
              }}
            />
          )
        )}

        {/* LOGO */}
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "#0d1b2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            border: "4px solid goldenrod",
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            MD
          </Typography>
        </Box>

        {/* PLATFORM */}
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: 3,
            color: "#0d1b2a",
            textTransform: "uppercase",
          }}
        >
          METATRON DEVELOPER
        </Typography>

        {/* TITLE */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "goldenrod",
            mt: 2,
            textShadow: "1px 1px 2px #333",
          }}
        >
          CERTIFICATE OF COMPLETION
        </Typography>

        {/* BODY */}
        <Typography sx={{ mt: 3, color: "#444" }}>
          This is to certify that
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#0d1b2a",
            mt: 2,
            textTransform: "uppercase",
          }}
        >
          {certificateData?.studentName}
        </Typography>

        <Typography sx={{ mt: 2, color: "#444" }}>
          has successfully completed the course
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 1,
            textTransform: "uppercase",
          }}
        >
          {certificateData?.course_title}
        </Typography>

        <Typography sx={{ mt: 3, color: "#444" }}>
          under the instruction of
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mt: 1 }}
        >
          {certificateData?.instructorName}
        </Typography>

        {/* DATE */}
        <Typography sx={{ mt: 3, fontStyle: "italic" }}>
          {formattedDate}
        </Typography>

        {/* FOOTER */}
        <Box
          display="flex"
          justifyContent="space-between"
          mt={6}
          px={2}
        >
          <Typography variant="body2">
            Certificate ID: {certificateData?._id}
          </Typography>

          <Box textAlign="right">
            <Typography
              sx={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "1.6rem",
              }}
            >
              {process.env.REACT_APP_METATRON_CEO}
            </Typography>
            <Typography variant="caption">
              CEO, METATRON DEVELOPER
            </Typography>
          </Box>
        </Box>

        {/* QR PLACEHOLDER */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 80,
            height: 80,
            border: "2px dashed #0d1b2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
          }}
        >
          QR VERIFY
        </Box>
      </Box>
    </Box>
  );
};

export default CertVerified;