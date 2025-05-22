import { WorkRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobsTop } from "../../redux/CurrentJobsTop";
import FeaturedJobs from "./layouts/FeaturedJobs";

export default function JobsContainer() {
  // screen width of the device
  const screenWidth = window.screen.availWidth;
  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { jobsTop } = useSelector((state) => state.currentJobsTop);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // dispatch
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

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

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
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
          <WorkRounded color="primary" sx={{ width: 20, height: 20 }} />
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
          {jobsTop?.map((jobTop) => (
            <Box key={jobTop?._id}>
              <FeaturedJobs isLoading={isFetching} jobTop={jobTop} />
            </Box>
          ))}
        </Box>
      </List>
    </React.Fragment>
  );
}
