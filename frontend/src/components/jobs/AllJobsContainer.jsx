import {
  Box,
  CircularProgress,
  Divider,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AlertJobSearch from "../alerts/AlertJobSearch";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomTabsWidth from "../utilities/CustomTabsWidth";
import JobsAppliedContainer from "./JobsAppliedContainer";
import JobLayout from "./layout/JobLayout";
const AlertNoPosts = lazy(() => import("../alerts/AlertNoPosts"));

// tabs customisation
const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: <span className="MuiTabs-indicatorSpan" />,
    }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
  },
});

export default function AllJobsContainer() {
  const [openAlertNoPosts, setOpenAlertNoPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // axios default credentials
  axios.defaults.withCredentials = true;
  const [openAlert, setOpenAlert] = useState(false);
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { jobs } = useSelector((state) => state.currentJobs);
  const { jobSearch } = useSelector((state) => state.currentJobSearch);
  const { user } = useSelector((state) => state.currentUser);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);

  // tab controls
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();

  // fetch job posts from the backend (all,verified,nearby)
  useEffect(() => {
    if (value === 3) {
      setOpenAlert(true);
    } else {
      // nearby jobs are those within the country of the currently logged in user
      const country = user.country.split(" ")[1];
      // set is fetching to true
      setIsFetching(true);
      // performing post request
      if (value === 2) {
        axios
          .post(
            "http://localhost:5000/metatron/api/v1/jobs/all/nearby",
            { country },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              dispatch(updateCurrentJobs(res.data));
            } else {
              // no more posts
              setOpenAlertNoPosts(true);
            }
          })
          .catch(async (err) => {
            console.log(err);
            //  user login session expired show logout alert
            if (err?.response?.data.login) {
              window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server unreachable please try again later to complete your request"
              );
              setOpenAlertNoPosts(true);
              return;
            }
            setOpenAlertNoPosts(true);
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            setIsFetching(false);
          });
      } else {
        axios
          .get(
            value === 0
              ? "http://localhost:5000/metatron/api/v1/jobs/all"
              : value === 1 &&
                  "http://localhost:5000/metatron/api/v1/jobs/all/verified",
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              dispatch(updateCurrentJobs(res.data));
            } else {
              // no more posts
              setOpenAlertNoPosts(true);
            }
          })
          .catch(async (err) => {
            console.log(err);
            //  user login session expired show logout alert
            if (err?.response?.data.login) {
              window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server unreachable please try again later to complete your request"
              );
              setOpenAlertNoPosts(true);
              return;
            }
            setOpenAlertNoPosts(true);
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            setIsFetching(false);
          });
      }
    }
  }, [value, messageSnack, user.country, dispatch]);

  // handle clearing of isNetwork and error message when the alert shown
  const handleClearing = () => {
    setErrorMessage("");
  };

  return (
    <Box height={"90vh"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        width={CustomTabsWidth()}
        minWidth={"100%"}
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            width: "95%",
          }}
          aria-label="tab bar"
          className={
            !CustomDeviceIsSmall()
              ? "shadow p-1"
              : CustomDeviceIsSmall() && "border-bottom"
          }
        >
          {/* constant tabs */}
          <Tab
            className="fw-bold"
            label={"Jobs"}
            aria-label={"all available jobs"}
          />

          <Tab
            className="fw-bold"
            label={"Verified"}
            aria-label={"verified jobs"}
          />

          <Tab
            className="fw-bold"
            label={"Nearby"}
            aria-label={"jobs near me"}
          />

          <Tab
            className="fw-bold"
            label={"Search"}
            aria-label={"search for jobs "}
          />

          <Tab
            className="fw-bold"
            label={"Manage"}
            aria-label={"view job application history"}
          />
        </StyledTabs>
      </Box>

      {/* container scrollable */}
      <Box
        p={!CustomDeviceIsSmall() ? 2 : undefined}
        height={"80vh"}
        sx={{
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <React.Fragment>
          {/* all jobs and verified jobs and Nearby that have no external link */}
          {(value === 0 || value === 1 || value === 2) && (
            <React.Fragment>
              {isFetching ? (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"100%"}
                  flexDirection={"column"}
                >
                  <CircularProgress size={"30px"} />
                </Box>
              ) : (
                <React.Fragment>
                  {jobs &&
                    jobs?.map((job, index) => (
                      <React.Fragment>
                        <JobLayout
                          key={index}
                          isDarkMode={isDarkMode}
                          job={job}
                        />
                        {/* divider */}
                        {isDarkMode && !CustomDeviceIsSmall() && (
                          <Box display={"flex"} justifyContent={"center"}>
                            <Divider component={"div"} className={"w-75"} />
                          </Box>
                        )}
                        {CustomDeviceIsSmall() && (
                          <Box
                            display={"flex"}
                            justifyContent={"center"}
                            mb={2}
                          >
                            <Divider component={"div"} className={"w-100"} />
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {/* display search results */}
          {value === 3 && (
            <React.Fragment>
              {jobSearch &&
                jobSearch.map((job, index) => (
                  <React.Fragment>
                    <JobLayout key={index} isDarkMode={isDarkMode} job={job} />
                    {/* divider */}
                    {isDarkMode && !CustomDeviceIsSmall() && (
                      <Box display={"flex"} justifyContent={"center"} mb={2}>
                        <Divider component={"div"} className={"w-75"} />
                      </Box>
                    )}
                    {CustomDeviceIsSmall() && (
                      <Box display={"flex"} justifyContent={"center"} mb={2}>
                        <Divider component={"div"} className={"w-100"} />
                      </Box>
                    )}
                  </React.Fragment>
                ))}
            </React.Fragment>
          )}

          {/* manage jobs */}
          {value === 4 && (
            <Box mt={2}>
              <JobsAppliedContainer />
            </Box>
          )}
        </React.Fragment>
      </Box>

      {/* show job search alert */}
      <AlertJobSearch
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setValue={setValue}
        isPreviousResults={jobSearch?.length > 0}
      />

      {/* alert no posts if true */}
      <AlertNoPosts
        openAlert={openAlertNoPosts}
        setOpenAlert={setOpenAlertNoPosts}
        errorMessage={errorMessage}
        handleClearing={handleClearing}
      />

      {/* show success snackbar when redux snack state is updated */}
      {messageSnack && <SnackBarSuccess message={messageSnack} />}
    </Box>
  );
}
