import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const SnackBarNotifications = ({
  message,
  isWarning = false,
}) => {
  const dispatch = useDispatch();

  const open = Boolean(message);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    dispatch(resetClearCurrentSnack());
  };

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={isWarning ? "warning" : "info"}
          sx={{
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            background: isWarning
              ? "rgba(255,193,7,0.12)"
              : "rgba(20,210,190,0.12)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "text.primary",
            minWidth: "260px",
            fontWeight: 500,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackBarNotifications);