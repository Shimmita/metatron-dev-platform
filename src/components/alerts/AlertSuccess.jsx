import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
} from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSuccessRedux } from "../../redux/CurrentSuccess";

export default function AlertSuccess() {
  const { title, message, isActive } = useSelector(
    (state) => state.currentSuccess
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(resetClearCurrentSuccessRedux());
  };

  return (
    <Dialog
      open={isActive}
      onClose={handleClose}
      closeAfterTransition
      TransitionComponent={Fade}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backdropFilter: "blur(8px)",
            background: "rgba(6,13,24,0.7)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          width: { xs: "90vw", sm: 380 },
          overflow: "hidden",
          textAlign: "center",
        },
      }}
    >
      {/* ICON */}
      <Box
        mt={3}
        display="flex"
        justifyContent="center"
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(214,178,94,0.15)",
            color: "#D6B25E",
            boxShadow: "0 0 25px rgba(214,178,94,0.25)",
          }}
        >
          <CheckCircleRounded sx={{ fontSize: 30 }} />
        </Box>
      </Box>

      {/* TITLE */}
      <Box px={2} mt={2}>
        <Typography
          fontSize={15}
          fontWeight={600}
          color="#FFFDF7"
        >
          {title}
        </Typography>
      </Box>

      {/* MESSAGE */}
      <Box px={2} mt={1.2}>
        <Typography
          fontSize={13}
          sx={{
            color: "rgba(255,253,247,0.7)",
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* ACTION */}
      <Box mt={2.5} mb={2} display="flex" justifyContent="center">
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "10px",
            px: 3,
            background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
            color: "#fff",

            "&:hover": {
              background: "linear-gradient(135deg,#8B6F2A,#FFF2C2)",
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Dialog>
  );
}
