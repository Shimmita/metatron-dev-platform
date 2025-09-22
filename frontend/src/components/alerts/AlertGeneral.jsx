import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertGeneral({
  openAlertGeneral,
  setOpenAlertGeneral,
  title,
  message,
  defaultIcon,
  setErrorMessage,
  isError=false,
}) {
 
  const handleClose = () => {
   
    // if is error means the alert has setError message to clear
    if (isError) {

      setErrorMessage("")
    }else{

    // close alert
    setOpenAlertGeneral(false);
    }

  };

  //  redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'




  return (
      <Dialog
        open={openAlertGeneral}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter:'blur(5px)',
          }}
      >
          <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body2"
          fontWeight={"bold"}
          gap={2}
          sx={{
            background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
        >
          {defaultIcon}
          {`${title}`}
        </DialogTitle>
        <DialogContent 
        sx={{
          maxWidth:500
        }}
        dividers>
          <DialogContentText variant="body2"
           id="alert-dialog-slide-general">
            {`${message}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ borderRadius:4 }}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}
