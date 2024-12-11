import { Slide, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomDeviceTablet from "../../../../utilities/CustomDeviceTablet";

export default function MyPostHomeSnack({ showSnackbar, setShowSnackbar }) {
  // handle closing of the snackbar without accepting
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
    // general closing of the snackbar
    handleClose();
  };

  const action = (
    <React.Fragment>
      <Button
        variant="contained"
        size="small"
        disableElevation
        sx={{ borderRadius: "10px" }}
        onClick={handleGoHome}
      >
        Yes
      </Button>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={showSnackbar}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: CustomDeviceTablet() ? "right" : "center",
      }}
      onClose={handleClose}
      autoHideDuration={2000}
      message={
        <Typography variant="body2">return to homepage</Typography>
      }
      TransitionComponent={Slide}
      action={action}
    />
  );
}
