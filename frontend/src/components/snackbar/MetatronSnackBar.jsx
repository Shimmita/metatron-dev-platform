import React, { useState, useEffect, useRef } from "react";
import { Snackbar, Alert, Slide, Box } from "@mui/material";

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

const MetatronSnackbar = ({ 
  message, 
  isError, 
  duration = 4000 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const timerRef = useRef(null);

  // ─── INTERNAL LIFECYCLE ───
  useEffect(() => {
    if (message) {
      // Clear any existing force-close timers if a new message arrives
      if (timerRef.current) clearTimeout(timerRef.current);

      // Trigger visibility
      setInternalOpen(true);

      // Set the force-close "kill switch"
      timerRef.current = setTimeout(() => {
        setInternalOpen(false);
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, duration]);

  const handleInternalClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setInternalOpen(false);
  };

  return (
    <Snackbar
      open={internalOpen}
      autoHideDuration={duration}
      onClose={handleInternalClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={TransitionDown}
      sx={{ zIndex: 10000 }}
    >
      <Alert
        severity={isError ? "error" : "success"}
        variant="outlined"
        onClose={() => setInternalOpen(false)}
        sx={{
          width: "100%",
          minWidth: "320px",
          backdropFilter: "blur(20px)",
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? "rgba(10, 15, 25, 0.85)" 
            : "rgba(255, 255, 255, 0.9)",
          borderColor: isError ? "rgba(239, 68, 68, 0.5)" : "rgba(20, 210, 190, 0.5)",
          borderRadius: "12px",
          color: "text.primary",
          fontWeight: 800,
          fontSize: "0.75rem",
          textTransform: "lowercase",
          letterSpacing: "0.05rem",
          boxShadow: isError 
            ? "0 8px 32px rgba(239, 68, 68, 0.2)" 
            : "0 8px 32px rgba(20, 210, 190, 0.2)",
          "& .MuiAlert-icon": {
            color: isError ? "#ef4444" : "#14D2BE",
          },
          "& .MuiAlert-action": {
            paddingTop: 0,
            alignItems: 'center'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MetatronSnackbar;