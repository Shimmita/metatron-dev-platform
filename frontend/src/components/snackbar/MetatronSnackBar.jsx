import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

// Optional: Adds a smooth slide-down effect from the top
function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

const MetatronSnackbar = ({ 
  open, 
  message, 
  isError, 
  handleClose, 
  duration = 3000 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={TransitionDown}
    >
      <Alert
        onClose={handleClose}
        severity={isError ? "error" : "success"}
        variant="outlined" // Best for showing off your custom border & backdrop
        sx={{
          width: "100%",
          minWidth: "300px",
          backdropFilter: "blur(15px)",
          // Merging with your theme's Alert overrides
          fontSize: "0.95rem",
          letterSpacing: "0.02em",
          "& .MuiAlert-icon": {
            color: isError ? "error.main" : "primary.main",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MetatronSnackbar;