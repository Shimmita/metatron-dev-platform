import { DeleteRounded } from "@mui/icons-material";
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
import { Box, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteJobAlert({
  openAlert,
  setOpenAlert,
  message,
  title,
  applicants=0,
  my_email,
  job_id,
}) {
  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,

          width:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97.5%"
              : undefined,
        }}
      >
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          gap={2}
        >
          {/* delete icon */}
          <DeleteRounded />

          <Box>
          {/* title */}
          <Typography 
          >
          {title}  
          </Typography>
          <Typography textAlign={'center'} variant={'caption'} sx={{ color:'text.secondary' }}>
            {applicants} applicant(s)
          </Typography>
          </Box>
         
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: "20px" }} onClick={handleClose}>
            No
          </Button>
          <Button sx={{ borderRadius: "20px" }} onClick={handleClose} color="warning">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  );
}
