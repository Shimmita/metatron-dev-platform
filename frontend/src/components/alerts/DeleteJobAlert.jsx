import { WarningRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentJobs } from "../../redux/CurrentJobs";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";

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
  const {currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

  const dispatch=useDispatch()

  // handle complete deletion of the job
  const handleCompleteDeletion=()=>{

    // set is fetching to true
        setIsFetching(true)
    
        axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/job/delete/${my_email}/${job_id}`,{
                withCredentials: true,
            })
            .then((res) => {
                // update the jobs from the backend
                if (res?.data) {

                  // log for debug message from backend 
                  console.log(res.data)

                  // update current jobs, triggers refetch
                  dispatch(resetClearCurrentJobs())

                  // refresh jobs to too for refetch
                  dispatch(resetClearCurrentJobsTop())

                  // success alert
                  dispatch(updateCurrentSuccessRedux({title:'Job Update',message:'Your job has been successfully deleted from the platform and its associated information.' }))
                
                // clear current jobs for fresh
                  dispatch(resetClearCurrentJobsTop())
                  // close the alert
                  handleClose()
                } 

            })
            .catch((err) => {

              // log message
              console.log(err?.response?.data)

            //  user login session expired show logout alert
            if (err?.response?.data?.login) {
            window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
            setErrorMessage(
                "server unreachable!"
            );
            }
            // update error message
            setErrorMessage(err.response.data)
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
          backdropFilter:'blur(5px)'
        }}
      >
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          gap={2}
          sx={{
            background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
        >
          {/* delete icon */}
          <WarningRounded />
          <Box>
          {/* title */}
          <Typography 
          >
          {title}  
          </Typography>
          <Typography textAlign={'center'} variant={'caption'} sx={{ color:'text.secondary' }}>
            {applicants} {applicants===1 ? "applicant":"applicants"}
          </Typography>
          </Box>
         
        </DialogTitle>
        {errorMessage && (
        <Box textAlign={'center'}>
        <Typography className="text-info" textAlign={'center'} variant="caption">
          {errorMessage}
        </Typography>
        </Box>
        )}
        <DialogContent
        sx={{
          maxWidth:500
        }}
         dividers>
          <DialogContentText 
          variant="body2" id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
          size="small"
          disabled={isFetching} 
          sx={{ borderRadius: "20px" }} onClick={handleClose}>
            No
          </Button>
          <Button 
          size="small"
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
