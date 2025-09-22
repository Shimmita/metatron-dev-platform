import { CheckCircleRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSuccessRedux } from "../../redux/CurrentSuccess";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertSuccess() {
 

  //  redux states
  const { title,message,isActive } = useSelector((state) => state.currentSuccess);
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  const dispatch=useDispatch()

    const handleClose = () => {
    // clear redux
    dispatch(resetClearCurrentSuccessRedux())
  };



  return (
      <Dialog
        open={isActive}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={500}
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
          <CheckCircleRounded color="success"/>
          {`${title}`}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText variant="body2"
          id="alert-dialog-slide-description">
            {`${message}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ borderRadius:4 }}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}
