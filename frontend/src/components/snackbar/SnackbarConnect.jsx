import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { snackbarAlertSx, snackbarSx } from "./snackbarStyles";

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
        sx={snackbarSx}
      >
        <Alert
          onClose={handleClose}
          severity={isWarning ? "warning" : "info"}
          variant="outlined"
          sx={snackbarAlertSx(isWarning ? "warning" : "info")}
        >
          {displayMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackbarConnect);
