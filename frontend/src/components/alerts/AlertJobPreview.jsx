import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import React from "react";
import { useSelector } from "react-redux";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import JobLayout from "../jobs/layout/JobLayout";

export default function AlertJobPreview({
  openAlert,
  setOpenAlert,
  job,
}) {
  const handleClose = () => setOpenAlert(false);

  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === "dark";

  return (
    <Dialog
      open={openAlert}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // 🔥 KEY FIX (controls width properly)
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        },
      }}
    >
      {/* CLOSE BUTTON */}
      <Box display="flex" justifyContent="flex-end" p={1}>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      {/* CONTENT */}
      <DialogContent
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",

          // 🔥 smooth scroll UI
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
          },
        }}
      >
        {/* CENTER CONTENT */}
        <Box display="flex" justifyContent="center">
          {job && (
            <JobLayout
              job={job}
              isPreviewHR={true}
              isDarkMode={isDarkMode}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}