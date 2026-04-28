import {
  Close,
  VerifiedRounded,
  WbIncandescentRounded
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
import { Link, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [messageGeneral, setMessageGeneral] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const email = window.location.href.split("?")[1];

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/verify/email`,
        { email, email_code: verificationCode }
      )
      .then((res) => {
        setMessageGeneral(res.data);
        setIsSuccess(true);
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server unreachable");
        } else {
          setMessageGeneral(err?.response?.data);
        }
      })
      .finally(() => setIsProcessing(false));
  };

  const handleProceed = () => navigate("/explore");

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
        p={3}
        borderRadius="18px"
        sx={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
        }}
      >
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
            alignItems="center"
            gap={1}
          >
            <WbIncandescentRounded sx={{ color: "#f59e0b", width: 16 }} />
            Secure Email Verification
            <WbIncandescentRounded sx={{ color: "#f59e0b", width: 16 }} />
          </Typography>
        </Box>

        {/* TITLE */}
        <Box textAlign="center" mb={2}>
          <VerifiedRounded sx={{ fontSize: 40, color: "#14D2BE" }} />
          <Typography fontWeight={600}>
            Verify Your Email
          </Typography>
        </Box>

        {/* ALERT */}
        {messageGeneral && (
          <Collapse in>
            <Alert
              severity={isSuccess ? "success" : "info"}
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

        {/* SUCCESS VIEW */}
        {isSuccess ? (
          <Box textAlign="center">
            <Button
              fullWidth
              variant="contained"
              onClick={handleProceed}
              sx={{
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#0FA88F,#14D2BE)",
                color: "#fff",
              }}
            >
              Proceed to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmitDetails}>
            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email"
              value={email}
              disabled
              sx={{ mb: 2 }}
            />

            {/* CODE */}
            <TextField
              fullWidth
              label="Verification Code"
              placeholder="Enter code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isProcessing}
              sx={{ mb: 2 }}
            />

            {/* ACTION */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={!verificationCode || isProcessing}
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
                : "Verify Email"}
            </Button>

            {/* BACK */}
            {!isProcessing && (
              <Box textAlign="center" mt={2}>
                <Typography fontSize={12} color="text.secondary">
                  Back to{" "}
                  <Link to="/" style={{ color: "#14D2BE" }}>
                    login
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

export default EmailVerification;
