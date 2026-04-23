import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Close, DownloadRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

const AlertCertDialog = ({ certData, setCertData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const certificateRef = useRef();

  const handleClose = () => setCertData(null);

  const certDate = new Date(certData?.createdAt?.split("T")[0]);
  const formattedDate = certDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = () => {
    const element = certificateRef.current;

    const opt = {
      margin: 0,
      filename: `${certData?.studentName}-certificate.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Dialog
      open={!!certData}
      fullScreen
      TransitionComponent={(props) => <div {...props} />}
      PaperProps={{
        sx: {
          background: "rgba(10,18,32,0.9)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Typography fontWeight={600}>
          Certificate Preview
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            startIcon={<DownloadRounded />}
            variant="contained"
            onClick={handleDownload}
            sx={{
              background:
                "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Download
          </Button>

          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* CONTENT */}
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Box
          ref={certificateRef}
          sx={{
            width: "100%",
            maxWidth: 900,
            minHeight: 600,
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            background: "linear-gradient(135deg,#fffdf5,#f9f6ef)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
            position: "relative",
            fontFamily: "Georgia, serif",
          }}
        >
          {/* BORDER */}
          <Box
            sx={{
              border: "8px double #0d1b2a",
              borderRadius: 2,
              p: 4,
              height: "100%",
            }}
          >
            {/* LOGO */}
            <Box
              sx={{
                width: 70,
                height: 70,
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
              <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                MD
              </Typography>
            </Box>

            {/* TITLE */}
            <Typography
              textAlign="center"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#0d1b2a",
              }}
            >
              METATRON DEVELOPER
            </Typography>

            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "goldenrod",
              }}
            >
              CERTIFICATE OF COMPLETION
            </Typography>

            {/* BODY */}
            <Typography textAlign="center" mt={3}>
              This is to certify that
            </Typography>

            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                mt: 2,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#0d1b2a",
              }}
            >
              {certData?.studentName}
            </Typography>

            <Typography textAlign="center" mt={2}>
              has successfully completed
            </Typography>

            <Typography
              textAlign="center"
              sx={{
                fontWeight: "bold",
                mt: 1,
                textTransform: "uppercase",
              }}
            >
              {certData?.course_title}
            </Typography>

            <Typography textAlign="center" mt={3}>
              Instructor
            </Typography>

            <Typography textAlign="center" fontWeight="bold">
              {certData?.instructorName}
            </Typography>

            <Typography textAlign="center" mt={3} fontStyle="italic">
              {formattedDate}
            </Typography>

            {/* FOOTER */}
            <Box
              display="flex"
              justifyContent="space-between"
              mt={5}
            >
              <Typography variant="caption">
                ID: {certData?._id}
              </Typography>

              <Box textAlign="right">
                <Typography
                  sx={{
                    fontFamily: "cursive",
                    fontSize: 18,
                  }}
                >
                  {process.env.REACT_APP_METATRON_CEO}
                </Typography>
                <Typography variant="caption">
                  CEO
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AlertCertDialog;