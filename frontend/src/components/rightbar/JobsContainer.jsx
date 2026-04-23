import { InfoRounded, WorkRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobsTop } from "../../redux/CurrentJobsTop";
import AlertGeneral from "../alerts/AlertGeneral";
import FeaturedJobs from "./layouts/FeaturedJobs";

export default function JobsContainer() {
  // screen width of the device
  const screenWidth = window.screen.availWidth;
  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { jobsTop } = useSelector((state) => state.currentJobsTop);
  const [isFetching, setIsFetching] = useState(false);
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={1}
        py={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <WorkRounded sx={{ color: "#14D2BE", fontSize: 18 }} />
          <Typography fontSize={13} fontWeight={600} color="#F0F4FA">
            Featured Opportunities
          </Typography>
        </Box>

        {isFetching && <CircularProgress size={14} />}
      </Box>
      <List
        className="rounded"
        sx={{
          width: "100%",
          p: 0,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box>
          {jobsTop?.slice(0, 3).map((jobTop, index) => (
            <Box key={jobTop?._id}>
              <FeaturedJobs
                isLastIndex={index === jobsTop?.length - 1}
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
          defaultIcon={<InfoRounded />}
        />
      )}

    </React.Fragment>
  );
}
