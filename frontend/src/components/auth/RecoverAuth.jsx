import {
  ArrowBackIosNewRounded,
  CheckCircleRounded,
  Close,
  EmailRounded,
  LockRounded,
  PasswordRounded,
  ShieldRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { appColors, appGradients } from "../../utils/colors";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: appColors.textPrimary,
    background: "rgba(255,255,255,0.06)",
    borderRadius: "8px",
    transition: "box-shadow 0.25s",
    "& fieldset": { borderColor: appColors.border, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.22)" },
    "&.Mui-focused fieldset": { borderColor: appColors.primary, borderWidth: "1px" },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${appColors.glow}` },
  },
  "& .MuiInputLabel-root": { color: appColors.textMuted, fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: appColors.primary },
  "& .MuiSvgIcon-root": { color: appColors.textMuted },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0A1625 inset",
    WebkitTextFillColor: appColors.textPrimary,
  },
};

const DotGrid = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(90deg, rgba(32,214,199,0.04) 1px, transparent 1px), linear-gradient(rgba(32,214,199,0.04) 1px, transparent 1px)",
      backgroundSize: "34px 34px",
      pointerEvents: "none",
    }}
  />
);

const extractMessage = (err, fallback = "Request failed. Please try again.") => {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || fallback;
};

const RecoverySteps = ({ activeStep, steps }) => (
  <Box
    sx={{
      border: `1px solid ${appColors.border}`,
      borderRadius: "8px",
      p: 1.25,
      background: "rgba(255,255,255,0.035)",
    }}
  >
    <Box display="grid" gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap={0.75}>
      {steps.map((step, index) => {
        const isDone = index < activeStep;
        const isActive = index === activeStep;

        return (
          <Box
            key={step.label}
            sx={{
              borderRadius: "8px",
              border: "1px solid",
              borderColor: isActive ? "rgba(32,214,199,0.42)" : appColors.border,
              background: isDone
                ? "rgba(34,197,94,0.09)"
                : isActive
                ? "rgba(32,214,199,0.1)"
                : "transparent",
              px: 1,
              py: 0.8,
              minHeight: 58,
            }}
          >
            <Typography
              sx={{
                color: isActive ? appColors.primary : appColors.textSecondary,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              {index + 1}. {step.label}
            </Typography>
            <Typography sx={{ color: isDone ? appColors.success : appColors.textMuted, fontSize: 10 }}>
              {isDone ? "Ready" : isActive ? "In progress" : "Pending"}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);

const RecoverAuth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeReceived, setIsCodeReceived] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordLayout, setIsPasswordLayout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  axios.defaults.withCredentials = true;

  const activeStep = isPasswordLayout ? 2 : isCodeReceived ? 1 : 0;
  const emailReady = /\S+@\S+\.\S+/.test(email.trim());
  const codeReady = verificationCode.trim().length >= 4;
  const passwordReady = newPassword.length >= 6 && newPassword === newPassword2;
  const passwordMismatch = newPassword2.length > 0 && newPassword !== newPassword2;

  const helperText = useMemo(() => {
    if (isPasswordLayout) return "Create a new password with at least 6 characters.";
    if (isCodeReceived) return "Enter the reset code sent to your email inbox.";
    return "Enter your account email and request a secure reset code.";
  }, [isCodeReceived, isPasswordLayout]);

  const showMessage = (nextMessage, nextSeverity = "info") => {
    setMessage(nextMessage);
    setSeverity(nextSeverity);
  };

  const handleRequestCode = async () => {
    if (!emailReady) {
      showMessage("Please enter a valid email address first.", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/request`,
        { email: email.trim().toLowerCase() }
      );

      setIsCodeReceived(Boolean(res?.data?.status ?? true));
      showMessage(res?.data?.message || "Reset code sent. Check your email.", "success");
    } catch (err) {
      showMessage(extractMessage(err, "Unable to request reset code."), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    if (!isCodeReceived) {
      handleRequestCode();
      return;
    }
    if (!codeReady) {
      showMessage("Enter the verification code sent to your email.", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/verify`,
        { email: email.trim().toLowerCase(), email_code: verificationCode.trim() }
      );

      setIsPasswordLayout(Boolean(res?.data?.status));
      showMessage(res?.data?.message || "Code verified. Set a new password.", "success");
    } catch (err) {
      showMessage(extractMessage(err, "Unable to verify reset code."), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters.", "warning");
      return;
    }

    if (newPassword !== newPassword2) {
      showMessage("Passwords do not match.", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/complete`,
        { email: email.trim().toLowerCase(), newPassword }
      );

      showMessage(res?.data?.message || "Password changed successfully.", "success");
      setTimeout(() => navigate("/auth/login"), 800);
    } catch (err) {
      showMessage(extractMessage(err, "Unable to reset password."), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackStep = () => {
    if (isPasswordLayout) {
      setIsPasswordLayout(false);
      setNewPassword("");
      setNewPassword2("");
      return;
    }
    if (isCodeReceived) {
      setIsCodeReceived(false);
      setVerificationCode("");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        background: appGradients.page,
        position: "relative",
        overflow: "auto",
        px: { xs: 1.25, sm: 2, md: 4 },
        py: { xs: 3, md: 5 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(32,214,199,0.14), transparent 34%, rgba(242,184,75,0.06) 67%, rgba(124,58,237,0.11))",
          pointerEvents: "none",
        },
      }}
    >
      <DotGrid />

      <Box
        component="nav"
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1120,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 3, md: 5 },
        }}
      >
        <Box display="flex" alignItems="center" gap={1.25}>
          <Avatar src={logo} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 900, color: appColors.textPrimary, letterSpacing: "0.06em" }}>
              METATRON
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: "0.18em", color: appColors.primary, textTransform: "uppercase" }}>
              Account Recovery
            </Typography>
          </Box>
        </Box>
        <Button
          component={Link}
          to="/auth/login"
          startIcon={<ArrowBackIosNewRounded sx={{ width: 13, height: 13 }} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            color: appColors.textSecondary,
            border: `1px solid ${appColors.border}`,
            px: 1.5,
          }}
        >
          Login
        </Button>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1060,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 0.85fr) minmax(420px, 1fr)" },
          gap: { xs: 2, md: 2.5 },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 560,
            p: 4,
            borderRadius: "8px",
            border: `1px solid ${appColors.border}`,
            background:
              "linear-gradient(180deg, rgba(32,214,199,0.08), rgba(59,130,246,0.08), rgba(255,255,255,0.035))",
            backdropFilter: "blur(28px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 11, letterSpacing: "0.2em", color: appColors.primary, textTransform: "uppercase", fontWeight: 900 }}>
              Secure Recovery
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 34, lineHeight: 1.08, color: appColors.textPrimary, fontWeight: 900 }}>
              Restore access without losing your career workspace.
            </Typography>
            <Typography sx={{ mt: 2, fontSize: 14, lineHeight: 1.8, color: appColors.textSecondary }}>
              Verify your account email, confirm the reset code, then create a fresh password for your Metatron Dev account.
            </Typography>
          </Box>

          <Stack spacing={1.25}>
            {[
              ["Email check", "We confirm the account before sending a reset code."],
              ["Code verification", "Only the latest valid code can unlock the password step."],
              ["Password reset", "Your new password replaces the previous credential securely."],
            ].map(([title, body]) => (
              <Box
                key={title}
                sx={{
                  borderRadius: "8px",
                  border: `1px solid ${appColors.border}`,
                  background: "rgba(255,255,255,0.045)",
                  p: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 900, color: appColors.textPrimary }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: 12, color: appColors.textSecondary, lineHeight: 1.55 }}>
                  {body}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            p: { xs: 2, sm: 3.25 },
            borderRadius: "8px",
            background: "rgba(255,255,255,0.045)",
            backdropFilter: "blur(30px)",
            border: `1px solid ${appColors.border}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "8px",
                border: `1px solid ${appColors.border}`,
                background: "rgba(32,214,199,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <ShieldRounded sx={{ color: appColors.primary, fontSize: 30 }} />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: appColors.textPrimary }}>
              Recover Access
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: appColors.textSecondary, mt: 0.5 }}>
              {helperText}
            </Typography>
          </Box>

          <RecoverySteps
            activeStep={activeStep}
            steps={[
              { label: "Request Code" },
              { label: "Verify Code" },
              { label: "New Password" },
            ]}
          />

          <Collapse in={Boolean(message)}>
            <Alert
              severity={severity}
              sx={{
                mt: 2,
                mb: 0.5,
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${severity === "error" ? appColors.error : appColors.border}`,
                color: appColors.textPrimary,
                "& .MuiAlert-icon": {
                  color:
                    severity === "success"
                      ? appColors.success
                      : severity === "warning"
                      ? appColors.warning
                      : severity === "error"
                      ? appColors.error
                      : appColors.primary,
                },
              }}
              action={
                <IconButton size="small" onClick={() => setMessage("")} sx={{ color: appColors.textSecondary }}>
                  <Close fontSize="small" />
                </IconButton>
              }
            >
              {message}
            </Alert>
          </Collapse>

          <Box
            component="form"
            onSubmit={isPasswordLayout ? handleChangePassword : handleSubmitDetails}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={2.5}
          >
            {!isPasswordLayout ? (
              <>
                <TextField
                  label="Account Email"
                  fullWidth
                  required
                  type="email"
                  value={email}
                  disabled={isProcessing || isPasswordLayout}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRounded />
                      </InputAdornment>
                    ),
                  }}
                />

                {isCodeReceived && (
                  <TextField
                    label="Verification Code"
                    fullWidth
                    required
                    value={verificationCode}
                    disabled={isProcessing}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <Button
                  type={isCodeReceived ? "submit" : "button"}
                  onClick={isCodeReceived ? undefined : handleRequestCode}
                  fullWidth
                  disabled={isProcessing || !emailReady || (isCodeReceived && !codeReady)}
                  variant="contained"
                  startIcon={isProcessing ? <CircularProgress size={15} sx={{ color: "#fff" }} /> : <ShieldRounded fontSize="small" />}
                  sx={{
                    mt: 0.5,
                    py: 1.45,
                    borderRadius: "8px",
                    fontWeight: 900,
                    textTransform: "none",
                    background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    boxShadow: `0 8px 28px ${appColors.glow}`,
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : isCodeReceived
                    ? "Verify Code"
                    : "Request Reset Code"}
                </Button>

                {isCodeReceived && (
                  <Button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={isProcessing || !emailReady}
                    sx={{ textTransform: "none", color: appColors.textSecondary }}
                  >
                    Resend code
                  </Button>
                )}
              </>
            ) : (
              <>
                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>New Password *</InputLabel>
                  <OutlinedInput
                    required
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    disabled={isProcessing}
                    onChange={(e) => setNewPassword(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockRounded />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((p) => !p)} sx={{ color: appColors.textMuted }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                </FormControl>

                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Confirm Password *</InputLabel>
                  <OutlinedInput
                    required
                    type={showPassword2 ? "text" : "password"}
                    value={newPassword2}
                    disabled={isProcessing}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockRounded />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword2((p) => !p)} sx={{ color: appColors.textMuted }}>
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>

                {passwordMismatch && (
                  <Typography color="warning.main" variant="caption">
                    Passwords must match before you can continue.
                  </Typography>
                )}

                <Button
                  fullWidth
                  type="submit"
                  disabled={isProcessing || !passwordReady}
                  variant="contained"
                  startIcon={isProcessing ? <CircularProgress size={15} sx={{ color: "#fff" }} /> : <CheckCircleRounded fontSize="small" />}
                  sx={{
                    py: 1.45,
                    borderRadius: "8px",
                    fontWeight: 900,
                    textTransform: "none",
                    background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    boxShadow: `0 8px 28px ${appColors.glow}`,
                  }}
                >
                  {isProcessing ? "Saving password..." : "Reset Password"}
                </Button>
              </>
            )}
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2.5}>
            <Button
              type="button"
              disabled={activeStep === 0 || isProcessing}
              onClick={handleBackStep}
              startIcon={<ArrowBackIosNewRounded sx={{ width: 13, height: 13 }} />}
              sx={{ borderRadius: "8px", textTransform: "none", color: appColors.textSecondary }}
            >
              Back
            </Button>
            <Typography component={Link} to="/auth/login" sx={{ fontSize: 12, color: appColors.primary, textDecoration: "none" }}>
              Back to login
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default RecoverAuth;
