import {
  Close,
  WbIncandescentRounded,
  VerifiedRounded
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import CertVerified from "./CertVerified";

const CertificateVerification = () => {
  const [certID, setCertID] = useState("");
  const [messageGeneral, setMessageGeneral] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [certData, setCertData] = useState(null);

  const handleSubmitDetails = (event) => {
    event.preventDefault();
    setIsProcessing(true);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/certificate/verify`,
        { certID }
      )
      .then((res) => {
        setCertData(res.data);
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server unreachable");
        } else {
          setMessageGeneral(err?.response?.data);
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleCloseCertWindow = () => {
    setCertData(null);
    setCertID("");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={2}
    >
      <Box
        width="100%"
        maxWidth={420}
        p={certData ? 0 : 3}
        borderRadius="18px"
        sx={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* VERIFIED VIEW */}
        {certData ? (
          <Box textAlign="center" p={2}>
            <CertVerified certificateData={certData} />

            <Button
              onClick={handleCloseCertWindow}
              variant="outlined"
              sx={{ mt: 2, borderRadius: 3 }}
            >
              Verify Another Certificate
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmitDetails}>
            {/* HEADER */}
            <Box textAlign="center" mb={2}>
              <Typography fontWeight={700}>
                Metatron Developer
              </Typography>

              <Typography
                fontSize={13}
                color="text.secondary"
                display="flex"
                justifyContent="center"
                gap={1}
                alignItems="center"
              >
                <WbIncandescentRounded
                  sx={{ color: "#f59e0b", width: 16 }}
                />
                Certificate Verification Portal
                <WbIncandescentRounded
                  sx={{ color: "#f59e0b", width: 16 }}
                />
              </Typography>
            </Box>

            {/* TITLE */}
            <Box textAlign="center" mb={2}>
              <VerifiedRounded
                sx={{ fontSize: 40, color: "#14D2BE" }}
              />
              <Typography fontWeight={600} mt={1}>
                Verify Certificate
              </Typography>
            </Box>

            {/* ALERT */}
            {messageGeneral && (
              <Collapse in>
                <Alert
                  severity="info"
                  sx={{ mb: 2 }}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => setMessageGeneral("")}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {messageGeneral}
                </Alert>
              </Collapse>
            )}

            {/* INPUT */}
            <TextField
              fullWidth
              label="Certificate ID"
              value={certID}
              onChange={(e) => setCertID(e.target.value)}
              disabled={isProcessing}
              sx={{ mb: 2 }}
            />

            {/* ACTION */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!certID || isProcessing}
              startIcon={
                isProcessing && <CircularProgress size={16} />
              }
              sx={{
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#0FA88F,#14D2BE)",
                color: "#fff",
              }}
            >
              {isProcessing
                ? "Verifying..."
                : "Verify Certificate"}
            </Button>

            {/* BACK */}
            {!isProcessing && (
              <Box textAlign="center" mt={2}>
                <Typography fontSize={12} color="text.secondary">
                  Back to{" "}
                  <Link to="/" style={{ color: "#14D2BE" }}>
                    Login
                  </Link>
                </Typography>
              </Box>
            )}
          </form>
        )}
      </Box>
    </Box>
  );
};

export default CertificateVerification;