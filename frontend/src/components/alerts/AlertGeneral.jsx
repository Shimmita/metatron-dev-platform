import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
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
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // handle width of the alert
  const handleWidthAlert=()=>{
    if (CustomDeviceTablet() && isTabSideBar) {
      return "60%"
    } else if(CustomLandScape()){
      return "92%"
    } else if(CustomLandscapeWidest()){
      return "97.5%"
    }
  }


  return (
      <Dialog
        open={openAlertGeneral}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
               marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,
                  width:handleWidthAlert()
                }}
      >
          <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          fontWeight={"bold"}
          gap={2}
        >
          {defaultIcon}
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ borderRadius:4 }}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}
