import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  CloudUploadRounded,
  CheckCircleRounded,
} from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import logo from "../../images/logo_sm.png";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
import BrowserCompress from "../utilities/BrowserCompress";

export default function AlertOrgCompletion({
  openAlertProfile,
  setOpenAlertProfile,
  user,
}) {
  const { avatar, token } = useSelector((state) => state.signUser);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPath, setAvatarPath] = useState(avatar || "");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [errorPosting, setErrorPosting] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ───────── FILE HANDLING ───────── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    const compressed = await BrowserCompress(file);
    setAvatarFile(compressed);
    setAvatarPath(URL.createObjectURL(compressed));
    setError("");
  };

  /* ───────── COMPLETE REGISTRATION ───────── */
  const handleCompleteRegistration = async () => {
    setIsPosting(true);

    try {
      user.educationLevel = "Other Qualification";
      user.gender = "Other";
      user.avatar = "";

      const formData = new FormData();
      formData.append("image", avatarFile);
      formData.append("user", JSON.stringify(user));

      const res = await axios.post(
        token
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/google/${token}`
          : `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/mongo`,
        formData
      );

      setSuccessMsg(res?.data?.message);
      setErrorPosting("");
    } catch (err) {
      if (err?.code === "ERR_NETWORK") {
        setErrorPosting("Server unreachable");
      } else {
        setErrorPosting(err?.response?.data);
      }
    } finally {
      setIsPosting(false);
    }
  };

  /* ───────── LOGIN ───────── */
  const handleLogin = async () => {
    if (token) {
      dispatch(resetAllSigningStateDetails());
      const auth = getAuth();
      await signOut(auth);
    }
    navigate("/");
  };

  const handleClose = () => setOpenAlertProfile(false);

  return (
    <Dialog
      open={openAlertProfile}
      onClose={handleClose}
      TransitionComponent={Fade}
      fullWidth
      maxWidth="xs"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            background: "rgba(6,13,24,0.7)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          textAlign: "center",
          p: 2,
        },
      }}
    >
      {isPosting ? (
        <CircularProgress sx={{ my: 4 }} />
      ) : successMsg ? (
        <>
          <Typography color="#22C55E" mb={2}>
            {successMsg}
          </Typography>

          <Button
            onClick={handleLogin}
            sx={{
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          {/* HEADER */}
          <Avatar
            src={avatarPath || logo}
            sx={{ width: 70, height: 70, mx: "auto", mb: 1 }}
          />

          <Typography fontSize={15} fontWeight={600} color="#F0F4FA">
            Organization Profile
          </Typography>

          <Typography
            fontSize={12}
            sx={{ color: "rgba(240,244,250,0.6)", mb: 2 }}
          >
            Upload your organization logo
          </Typography>

          {/* UPLOAD */}
          <Button
            component="label"
            startIcon={<CloudUploadRounded />}
            sx={{
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              mb: 2,
            }}
          >
            Upload Logo
            <input hidden type="file" onChange={handleFileChange} />
          </Button>

          {error && (
            <Typography color="error" fontSize={12}>
              {error}
            </Typography>
          )}

          {errorPosting && (
            <Typography color="#F59E0B" fontSize={12}>
              {errorPosting}
            </Typography>
          )}

          {/* COMPLETE */}
          <Button
            fullWidth
            startIcon={<CheckCircleRounded />}
            disabled={!avatarFile}
            onClick={handleCompleteRegistration}
            sx={{
              mt: 2,
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Complete 
          </Button>
        </>
      )}
    </Dialog>
  );
}