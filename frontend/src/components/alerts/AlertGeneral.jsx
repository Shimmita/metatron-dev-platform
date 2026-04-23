import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  Fade,
  Backdrop,
} from "@mui/material";
import React from "react";

export default function AlertGeneral({
  openAlertGeneral,
  setOpenAlertGeneral,
  title,
  message,
  defaultIcon,
  setErrorMessage,
  isError = false,
}) {
  const handleClose = () => {
    if (isError) {
      setErrorMessage("");
      setOpenAlertGeneral(false);
    } else {
      setOpenAlertGeneral(false);
    }
  };

  return (
    <Dialog
      open={openAlertGeneral}
      onClose={handleClose}
      closeAfterTransition
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
      TransitionComponent={Fade}
    >
      <Box
        sx={{
          width: { xs: "90vw", sm: 420 },
          borderRadius: "16px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          px={2}
          py={1.5}
          sx={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "10px",
              background: isError
                ? "rgba(255,100,100,0.15)"
                : "rgba(20,210,190,0.15)",
              color: isError ? "#EF4444" : "#14D2BE",
            }}
          >
            {defaultIcon}
          </Box>

          <Typography
            fontSize={14}
            fontWeight={600}
            sx={{ color: "#F0F4FA" }}
          >
            {title}
          </Typography>
        </Box>

        {/* CONTENT */}
        <DialogContent
          sx={{
            px: 2,
            py: 2,
          }}
        >
          <Typography
            fontSize={13}
            sx={{
              color: "rgba(240,244,250,0.7)",
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
        </DialogContent>

        {/* ACTION */}
        <Box
          display="flex"
          justifyContent="flex-end"
          px={2}
          pb={2}
        >
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              px: 2,
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
              fontSize: 12,

              "&:hover": {
                background: "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
              },
            }}
          >
            Got it
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}