import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

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
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            background: "rgba(68,183,0,0.12)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "text.primary",
            fontWeight: 600,
            minWidth: "260px",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackBarSuccess);