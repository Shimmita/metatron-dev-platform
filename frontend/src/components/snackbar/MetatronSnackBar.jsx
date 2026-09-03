import React, { useState, useEffect, useRef } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { snackbarAlertSx, snackbarSx } from "./snackbarStyles";

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
      sx={snackbarSx}
    >
      <Alert
        severity={isError ? "error" : "success"}
        variant="outlined"
        onClose={() => setInternalOpen(false)}
        sx={snackbarAlertSx(isError ? "error" : "success")}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MetatronSnackbar;
