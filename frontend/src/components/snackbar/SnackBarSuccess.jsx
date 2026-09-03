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

const SnackBarSuccess = ({ message }) => {
  const dispatch = useDispatch();
  const { isTabSideBar } = useSelector((state) => state.appUI);

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
          horizontal:
            CustomDeviceTablet() && isTabSideBar ? "right" : "center",
        }}
        sx={snackbarSx}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="outlined"
          sx={snackbarAlertSx("success")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackBarSuccess);
