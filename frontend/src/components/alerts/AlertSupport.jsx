import { SupportAgentRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSupportAlert } from "../../redux/AppUI";
import HelpSupport from "../custom/HelpSupport";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertSupport({ openSupportAlert }) {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(showSupportAlert(false));
  };

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
      <Dialog
        open={openSupportAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description-support"
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
          fontWeight={"bold"}
          gap={2}
        >
          <SupportAgentRounded />
          {"Technical Support"}
        </DialogTitle>
        <DialogContent dividers>
          {/* render the support layout */}
          <HelpSupport  />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
  );
}
