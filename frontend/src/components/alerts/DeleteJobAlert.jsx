import { DeleteRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { resetClearCurrentJobs, updateCurrentJobs } from "../../redux/CurrentJobs";

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

   // track axios progress
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  const dispatch=useDispatch()

  // handle complete deletion of the job

  const handleCompleteDeletion=()=>{
     // use axios to post to the backend of status update
        setIsFetching(true)
    
         axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/job/delete/${my_email}/${job_id}`,{
                withCredentials: true,
            })
            .then((res) => {
                // update the jobs from the backend
                if (res?.data) {
                  // update current jobs
                  dispatch(updateCurrentJobs(res.data))

                // clear current jobs for fresh
                  dispatch(resetClearCurrentJobsTop())
                  // close the alert
                  handleClose()
                } 

            })
            .catch((err) => {
    
                //  user login session expired show logout alert
                if (err?.response?.data.login) {
                window.location.reload();
                }
                if (err?.code === "ERR_NETWORK") {
                setErrorMessage(
                    "server unreachable"
                );
                }
            })
            .finally(() => {
                // false fetching
                setIsFetching(false);        
            });
    
  }

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
          <Button 
          disabled={isFetching}
           sx={{ borderRadius: "20px" }} 
           onClick={handleCompleteDeletion} 
           color="warning">
            {isFetching ? "Wait...":"Yes"}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
