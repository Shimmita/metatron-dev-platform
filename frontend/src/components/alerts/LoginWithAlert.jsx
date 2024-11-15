import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginWithAlert({
  openAlert,
  setOpenAlert,
  message = "",
  title = "",
  icon,
  setisMicrosoft,
  setIsGoogle,
  setIsGitHub,
}) {
  const handleClose = () => {
    // close alert
    setOpenAlert(false);
    setIsGitHub(false);
    setIsGoogle(false);
    setisMicrosoft(false);
  };

  //   handle agree a signin option
  const handleAgreeSignin = () => {
    if (title.toLowerCase().includes("github")) {
      setIsGitHub(true);
      setIsGoogle(false);
      setisMicrosoft(false);
    }

    if (title.toLowerCase().includes("google")) {
      setIsGoogle(true);
      setisMicrosoft(false);
      setIsGitHub(false);
    }
    if (title.toLowerCase().includes("microsoft")) {
      setisMicrosoft(true);
      setIsGitHub(false);
      setIsGoogle(false);
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle display={"flex"} alignItems={"center"} gap={1}>
          {/* icon */}
          {icon}
          {/* title */}
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message.toLowerCase()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: "20px" }} onClick={handleClose}>
            Disagree
          </Button>
          <Button sx={{ borderRadius: "20px" }} onClick={handleAgreeSignin}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
