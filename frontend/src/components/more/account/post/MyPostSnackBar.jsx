import { Slide } from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";

export default function MyPostSnackBar({
  showSnackbar,
  setShowSnackbar,
  setIsEditing,
}) {
  // handle closing of the snackbar without accepting
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  // handle showing of edit & close update and discard btn when yes
  // of the snackbar is clicked

  const handleEditUpdateDiscard = () => {
    setIsEditing(true);
    // general closing of the snackbar
    handleClose();
  };

  const action = (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        disableElevation
        sx={{ borderRadius: "10px" }}
        onClick={handleEditUpdateDiscard}
      >
        Yes
      </Button>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={showSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
      autoHideDuration={2000}
      message="changes made will be discarded"
      TransitionComponent={Slide}
      action={action}
    />
  );
}
