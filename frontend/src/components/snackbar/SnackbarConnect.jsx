import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const SnackbarConnect = ({ message, isWarning = false }) => {
  const dispatch = useDispatch();

  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );

  const open = Boolean(message || messageConnectRequestSent);
  const displayMessage = message || messageConnectRequestSent;

  const handleClose = () => {
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
          horizontal: CustomDeviceTablet() ? "right" : "center",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={isWarning ? "warning" : "info"}
          sx={{
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            background: isWarning
              ? "rgba(255,193,7,0.1)"
              : "rgba(20,210,190,0.1)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "text.primary",
            minWidth: "250px",
          }}
        >
          {displayMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackbarConnect);