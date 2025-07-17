import { InfoRounded, WorkRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobsTop } from "../../redux/CurrentJobsTop";
import FeaturedJobs from "./layouts/FeaturedJobs";
import AlertGeneral from "../alerts/AlertGeneral";

export default function JobsContainer() {
  // screen width of the device
  const screenWidth = window.screen.availWidth;
  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { jobsTop } = useSelector((state) => state.currentJobsTop);
  const [isFetching, setIsFetching] = useState(false);
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  
  
  // dispatch
  const dispatch = useDispatch();

  // fetch posts from the backend
  useEffect(() => {
    // check if there is no jobs then fetch else don't api calls
    if (jobsTop) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing get request and passing userId 
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/top/${user?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateCurrentJobsTop(res.data));
        }
      })
      .catch(async (err) => {
        console.log(err);
        setErrorMessage(err?.response.data);
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, jobsTop, user]);


  // get the right-bar expanded appropriately
  const rightBarExpanded = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
  };

  return (
    <React.Fragment>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          pt={2}
        >
          <Typography fontWeight={"bold"} color={"primary"}>
            FEATURED JOBS
          </Typography>
          {isFetching ? (
            <CircularProgress size={16}/>
          ):(
            <WorkRounded color="primary" sx={{ width: 20, height: 20 }} />
          )}
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpanded(),
        }}
      >
        <Box>
          {jobsTop?.map((jobTop,index) => (
            <Box key={jobTop?._id}>
              <FeaturedJobs 
              isLastIndex={index===jobsTop?.length-1}
              isLoading={isFetching} 
              jobTop={jobTop} />
            </Box>
          ))}
        </Box>
      </List>

      {/* alert general of the error message */}
      {errorMessage && (
        <AlertGeneral
        title={'something went wrong!'}
        message={errorMessage}
        isError={true}
        openAlertGeneral={openAlertGeneral}
        setOpenAlertGeneral={setOpenAlertGeneral}
        setErrorMessage={setErrorMessage}
        defaultIcon={<InfoRounded/>}
        />
      )}

    </React.Fragment>
  );
}
