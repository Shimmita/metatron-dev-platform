import {
  Close,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  VerifiedUser,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Design Tokens (same as login) ─── */
const C = {
  bg: "#060D18",
  bgCard: "rgba(255,255,255,0.045)",
  bgInput: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(20,210,190,0.6)",
  teal: "#14D2BE",
  tealGlow: "rgba(20,210,190,0.25)",
  textPri: "#F0F4FA",
  textSec: "rgba(240,244,250,0.65)",
  textHint: "rgba(240,244,250,0.45)",
};

/* ─── Input Styling ─── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background: C.bgInput,
    borderRadius: "12px",

    "& fieldset": { borderColor: C.border },

    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },

    "&.Mui-focused fieldset": {
      borderColor: C.teal,
    },

    "&.Mui-focused": {
      boxShadow: `0 0 0 3px ${C.tealGlow}`,
    },
  },

  "& .MuiInputLabel-root": {
    color: C.textHint,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: C.teal,
  },

  "& input": {
    color: "#fff",
  },
};

const RecoverAuth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeReceived, setIsCodeReceived] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordLayout, setIsPasswordLayout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  axios.defaults.withCredentials = true;

  /* ─── API HANDLERS ─── */

  const handleRequestCode = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/request`,
        { email }
      );

      setIsCodeReceived(true);
      setMessage(res?.data?.message);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Server unreachable");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/verify`,
        { email, email_code: verificationCode }
      );

      setIsPasswordLayout(res?.data?.status);
      setMessage(res?.data?.message);
    } catch (err) {
      setMessage(err?.response?.data?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newPassword2) {
      setMessage("Passwords do not match");
      return;
    }

    setIsProcessing(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/complete`,
        { email, newPassword }
      );

      navigate("/");
    } catch (err) {
      setMessage(err?.response?.data?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ─── UI ─── */

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ background: C.bg }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: "20px",
          background: C.bgCard,
          backdropFilter: "blur(25px)",
          border: `1px solid ${C.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <Typography
          textAlign="center"
          fontWeight={700}
          fontSize={22}
          color={C.textPri}
          mb={1}
        >
          Recover Access
        </Typography>

        <Typography textAlign="center" fontSize={13} color={C.textSec} mb={3}>
          Restore your Metatron account securely
        </Typography>

        {/* Alert */}
        <Collapse in={!!message}>
          <Alert
            sx={{
              mb: 2,
              background: "rgba(20,210,190,0.1)",
              border: `1px solid ${C.teal}`,
              color: C.textPri,
            }}
            action={
              <IconButton size="small" onClick={() => setMessage("")}>
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {message}
          </Alert>
        </Collapse>

        <form
          onSubmit={
            isPasswordLayout ? handleChangePassword : handleSubmitDetails
          }
        >
          {!isPasswordLayout ? (
            <>
              <TextField
                label="Work Email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: C.textHint }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Verification Code"
                fullWidth
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                sx={{ ...inputSx, mt: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedUser sx={{ color: C.textHint }} />
                    </InputAdornment>
                  ),
                }}
              />

              {!isCodeReceived && (
                <Button
                  onClick={handleRequestCode}
                  fullWidth
                  sx={{ mt: 2 }}
                  variant="outlined"
                >
                  Request Code
                </Button>
              )}
            </>
          ) : (
            <>
              <FormControl fullWidth sx={inputSx}>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock sx={{ color: C.textHint }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <IconButton onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  label="New Password"
                />
              </FormControl>

              <FormControl fullWidth sx={{ ...inputSx, mt: 2 }}>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput
                  type={showPassword2 ? "text" : "password"}
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Lock sx={{ color: C.textHint }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <IconButton onClick={() => setShowPassword2((p) => !p)}>
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            </>
          )}

          {/* CTA */}
          <Button
            fullWidth
            type="submit"
            disabled={isProcessing}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: "10px",
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
            }}
            variant="contained"
            startIcon={
              isProcessing ? <CircularProgress size={16} /> : <Lock />
            }
          >
            {isPasswordLayout ? "Reset Password" : "Verify & Continue"}
          </Button>
        </form>

        {/* Back */}
        <Typography textAlign="center" mt={3} fontSize={13}>
          <Link to="/" style={{ color: C.teal }}>
            Back to Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RecoverAuth;