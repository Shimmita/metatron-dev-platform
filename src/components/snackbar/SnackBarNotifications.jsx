import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import { snackbarAlertSx, snackbarSx } from "./snackbarStyles";

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
        sx={snackbarSx}
      >
        <Alert
          onClose={handleClose}
          severity={isWarning ? "warning" : "info"}
          variant="outlined"
          sx={snackbarAlertSx(isWarning ? "warning" : "info")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackBarNotifications);
