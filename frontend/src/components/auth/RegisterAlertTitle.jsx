import { Close, WorkOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function RegisterAlertTitle({
  openAlert,
  setOpenAlert,
  setSpecialisationTitle,
}) {
  const [customTitle, setCustomTitle] = useState("");

  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === "dark";

  const handleClose = () => setOpenAlert(false);

  const handleSave = () => {
    setSpecialisationTitle(customTitle.trim());
    handleClose();
  };

  const handleDismiss = () => {
    setSpecialisationTitle("");
    handleClose();
  };

  return (
    <Dialog
      open={openAlert}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      TransitionComponent={Fade}
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
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" gap={1} alignItems="center">
          <WorkOutlineRounded />
          <Typography fontWeight={600}>
            Your Specialisation
          </Typography>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* CONTENT */}
      <DialogContent>
        <Typography
          fontSize={13}
          color="text.secondary"
          mb={2}
        >
          Enter your primary IT specialization (e.g. Frontend Developer,
          DevOps Engineer, Cybersecurity Analyst).
        </Typography>

        <TextField
          autoFocus
          fullWidth
          label="Specialisation Title"
          placeholder="e.g. Backend Developer"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
        />

        {/* ACTIONS */}
        <Box mt={3} display="flex" gap={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleDismiss}
            sx={{ borderRadius: "12px" }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={!customTitle.trim()}
            onClick={handleSave}
            sx={{
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}