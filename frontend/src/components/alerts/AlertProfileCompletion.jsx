import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  Avatar,
  TextField,
  CircularProgress,
} from "@mui/material";
import { CloudUploadRounded } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import logo from "../../images/logo_sm.png";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
import BrowserCompress from "../utilities/BrowserCompress";

const MAX_ABOUT = 200;

export default function AlertProfileCompletion({
  openAlertProfile,
  setOpenAlertProfile,
  user,
}) {
  const { avatar, token } = useSelector((state) => state.signUser);

  const [step, setStep] = useState(0);
  const [about, setAbout] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPath, setAvatarPath] = useState(avatar || "");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [errorPosting, setErrorPosting] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ───────── NAVIGATION ───────── */
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleClose = () => {
    setOpenAlertProfile(false);
    setIsPosting(false);
  };

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
    if (!about) {
      setErrorPosting("Please add a short bio");
      return;
    }

    setIsPosting(true);

    try {
      user.about = about;
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

  /* ───────── LOGIN AFTER SUCCESS ───────── */
  const handleLogin = async () => {
    if (token) {
      dispatch(resetAllSigningStateDetails());
      const auth = getAuth();
      await signOut(auth);
    }
    navigate("/explore");
  };

  return (
    <Dialog
      open={openAlertProfile}
      onClose={handleClose}
      TransitionComponent={Fade}
      fullWidth
      maxWidth="sm"
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
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={2}
        py={1.5}
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Avatar src={avatarPath || logo} />
        <Typography fontSize={14} fontWeight={600} color="#F0F4FA">
          Complete Your Profile
        </Typography>
      </Box>

      {/* STEP INDICATOR */}
      {!successMsg && (
        <Box px={2} pt={1}>
          <Typography fontSize={11} sx={{ color: "rgba(240,244,250,0.5)" }}>
            Step {step + 1} of 2
          </Typography>
        </Box>
      )}

      {/* ERROR */}
      {errorPosting && (
        <Box px={2} pt={1}>
          <Typography sx={{ color: "#F59E0B", fontSize: 12 }}>
            {errorPosting}
          </Typography>
        </Box>
      )}

      {/* CONTENT */}
      <Box px={2} py={2}>
        {isPosting ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : successMsg ? (
          <Typography sx={{ color: "#22C55E", textAlign: "center" }}>
            {successMsg}
          </Typography>
        ) : step === 0 ? (
          <>
            <Typography
              fontSize={13}
              sx={{ color: "rgba(240,244,250,0.7)", mb: 1 }}
            >
              Tell us about yourself
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              value={about}
              label={`About (${MAX_ABOUT - about.length})`}
              onChange={(e) => setAbout(e.target.value)}
            />
          </>
        ) : (
          <>
            <Typography
              fontSize={13}
              sx={{ color: "rgba(240,244,250,0.7)", mb: 1 }}
            >
              Upload your profile picture
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={avatarPath} sx={{ width: 60, height: 60 }} />

              <Button component="label" startIcon={<CloudUploadRounded />}>
                Upload
                <input hidden type="file" onChange={handleFileChange} />
              </Button>
            </Box>

            {error && (
              <Typography sx={{ color: "#EF4444", fontSize: 12 }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* ACTIONS */}
      <Box display="flex" justifyContent="space-between" px={2} pb={2}>
        {!successMsg ? (
          <>
            <Button
              disabled={step === 0}
              onClick={handleBack}
              sx={{ color: "rgba(255,255,255,0.6)" }}
            >
              Back
            </Button>

            {step === 0 ? (
              <Button
                onClick={handleNext}
                disabled={!about || about.length > MAX_ABOUT}
                sx={{
                  background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                  color: "#fff",
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCompleteRegistration}
                disabled={!avatarFile}
                sx={{
                  background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                  color: "#fff",
                }}
              >
                Complete
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleLogin}
            sx={{
              margin: "auto",
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Go to Login
          </Button>
        )}
      </Box>
    </Dialog>
  );
}
