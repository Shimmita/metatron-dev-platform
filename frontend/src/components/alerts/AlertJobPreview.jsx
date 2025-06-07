import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
import JobLayout from "../jobs/layout/JobLayout";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertJobPreview({
   openAlert,
   setOpenAlert,
    job,
  defaultIcon
}) {
  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  console.log(job)

  //   redux states
  const { isTabSideBar,isDarkMode } = useSelector((state) => state.appUI);

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
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
               marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,
               width:handleWidthAlert()
           }}
      >
         
        <DialogContent dividers >
        {/* show layout job hiring */}
     
        {job && (
         <JobLayout job={job} isPreviewHR={true} isDarkMode={isDarkMode}/>
       )}
        </DialogContent>
      </Dialog>
  );
}
