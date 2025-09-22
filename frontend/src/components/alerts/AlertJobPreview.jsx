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
}) {
  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };


  //   redux states
  const { isTabSideBar,currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'


  const handleAlertGenWidth=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "36%"
      } else if(CustomLandScape()){
        return "-1%"
      } else if(CustomLandscapeWidest()){
        return "0%"
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
              marginLeft:handleAlertGenWidth(),
          }}
      >
      
        <DialogContent dividers 
        sx={{
           background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
         >
        {/* show layout job hiring */}
     
        {job && (
        <JobLayout job={job} isPreviewHR={true} isDarkMode={currentMode==='dark'}/>
       )}
        </DialogContent>
      </Dialog>
  );
}
