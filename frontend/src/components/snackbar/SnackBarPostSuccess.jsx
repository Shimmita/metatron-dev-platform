import { Alert, Box, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { snackbarAlertSx, snackbarSx } from "./snackbarStyles";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const SnackBarPostSuccess = ({ messageSnackPostTech }) => {
  const dispatch = useDispatch();

  const { isTabSideBar } = useSelector((state) => state.appUI);

  const open = Boolean(messageSnackPostTech);

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
          vertical: "top",
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
          {messageSnackPostTech}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SnackBarPostSuccess);
