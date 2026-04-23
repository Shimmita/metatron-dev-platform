import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TipsAndUpdatesRounded } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import TutorialData from "../data/TutorialData";

export default function AlertTutorial() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  const [openTutorial, setOpenTutorial] = useState(
    user?.isTutorial || false
  );
  const [activeStep, setActiveStep] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalSteps = TutorialData.length;

  /* ───────── CLOSE ───────── */
  const handleClose = () => setOpenTutorial(false);

  /* ───────── NEXT / BACK ───────── */
  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  /* ───────── COMPLETE TUTORIAL ───────── */
  const handleCompletely = async () => {
    setIsFetching(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/tutorial`,
        { userId: user?._id },
        { withCredentials: true }
      );

      dispatch(updateUserCurrentUserRedux(res.data));
      handleClose();
    } catch (err) {
      if (err?.response?.data?.login) {
        window.location.reload();
      }

      if (err?.code === "ERR_NETWORK") {
        setErrorMessage("Server unreachable. Try again later.");
      } else {
        setErrorMessage(err?.response?.data);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Dialog
      open={openTutorial}
      closeAfterTransition
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
          width: isMobile ? "95vw" : 520,
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
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(20,210,190,0.15)",
            color: "#14D2BE",
          }}
        >
          <TipsAndUpdatesRounded />
        </Box>

        <Typography fontSize={14} fontWeight={600} color="#F0F4FA">
          Welcome to Metatron Developer
        </Typography>
      </Box>

      {/* PROGRESS */}
      <Box px={2} pt={1}>
        <Box
          sx={{
            height: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${((activeStep + 1) / totalSteps) * 100}%`,
              height: "100%",
              background:
                "linear-gradient(135deg,#0FA88F,#14D2BE)",
              transition: "width 0.3s ease",
            }}
          />
        </Box>

        <Typography
          fontSize={11}
          mt={0.5}
          sx={{ color: "rgba(240,244,250,0.5)" }}
        >
          Step {activeStep + 1} of {totalSteps}
        </Typography>
      </Box>

      {/* ERROR */}
      {errorMessage && (
        <Box px={2} pt={1}>
          <Typography
            sx={{
              color: "#F59E0B",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </Typography>
        </Box>
      )}

      {/* CONTENT */}
      <Box
        px={2}
        py={2}
        sx={{
          animation: "fadeIn 0.3s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(6px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            fontSize={14}
            fontWeight={600}
            color="#F0F4FA"
            mb={1}
          >
            {TutorialData[activeStep].description}
          </Typography>

          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {TutorialData[activeStep].listing.map((item, index) => (
              <Typography
                key={index}
                component="li"
                fontSize={12}
                sx={{
                  color: "rgba(240,244,250,0.65)",
                  mb: 0.6,
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ACTIONS */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        pb={2}
      >
        {/* BACK */}
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isFetching}
          sx={{
            borderRadius: "10px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Back
        </Button>

        <Box display="flex" gap={1}>
          
          {/* NEXT */}
          <Button
            onClick={activeStep === totalSteps - 1
              ? handleCompletely
              : handleNext}
            disabled={isFetching}
            sx={{
              borderRadius: "10px",
              background:
                "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
              },
            }}
          >
            {activeStep === totalSteps - 1
              ? "Finish"
              : "Next"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}