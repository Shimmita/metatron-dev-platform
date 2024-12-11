import { Slide, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import CustomDeviceTablet from "../../../../utilities/CustomDeviceTablet";

export default function MyPostDeleteSnack({
  showSnackbar,
  setShowSnackbar,
  handleBeginDeletingPost,
}) {
  // handle closing of the snackbar without accepting
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const handleDelete = () => {
    // delete post from the parent component
    handleBeginDeletingPost();
    handleClose();
  };

  const action = (
    <React.Fragment>
      <Button
        variant="contained"
        size="small"
        color="warning"
        disableElevation
        sx={{ borderRadius: "10px" }}
        onClick={handleDelete}
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
        <Typography variant="body2">
          post will be deleted permanently
        </Typography>
      }
      TransitionComponent={Slide}
      action={action}
    />
  );
}
