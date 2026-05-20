import {
  InfoRounded,
  Refresh
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  useMediaQuery
} from "@mui/material";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import GlobalDrawer from "../drawer/MetatronDrawer";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import GlobalAppBar from "../navbar/GlobalNavBar";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import MetatronSnackbar from "../snackbar/MetatronSnackBar";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import JobLayout from "./layout/JobLayout";
import JobStatsLayout from "./layout/JobStatsLayouts";

const drawerWidth = CustomDeviceIsSmall ? 200 : 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));


export default function MiniDrawer() {
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const [generalTitle, setGeneralTitle] = useState("")
  const [messageGeneral, setMessageGeneral] = useState("")
  const [pageNumber, setPageNumber] = useState(-1)
  // redux states
  const {
    currentMode,
    isDefaultSpeedDial,
    isJobSearchGlobal,
    isSidebarRighbar,
    isOpenDrawerProfile,
    isOpenMessageDrawer
  } = useSelector(
    (state) => state.appUI
  );
  const isDarkMode = currentMode === 'dark'


  const { jobs } = useSelector((state) => state.currentJobs);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);
  const theme = useTheme();
  const panelRadius = `${theme.shape.borderRadius}px`;

  // trigger redux update
  const dispatch = useDispatch();

  // smartphones and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isMyStats, setIsMyStats] = useState(false)

  const navigate = useNavigate()

  const [textOption, setTextOption] = useState(
    !isGuest && isJobSearchGlobal ? "Search Jobs" : "Explore Jobs"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false : true);
  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet() || isGuest)
  );

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openAlert, setOpenAlert] = useState(false);

  //   handle opening of drawer profile
  const handleShowingProfileDrawer = () => {
    dispatch(showUserProfileDrawer());
  };

  // handle display of the drawer pane
  const handleShowDrawerPane = () => {
    setIsDrawerPane((prev) => !prev);
  };

  // false right bar is no of use this route
  useLayoutEffect(() => {
    // true tem, and the redux will reverse
    dispatch(handleSidebarRightbar(true));

  }, [dispatch, isSidebarRighbar])


  // open drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // close drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // handle showing of speed dial by making it off in this window of jobs
  if (isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(false));
  }


  // use effect for fetching jobs
  // fetch job posts from the backend (all,verified,nearby,recommended etc)
  useEffect(() => {
    // update bottom nav position
    dispatch(updateCurrentBottomNav(1))

    // don't fetch any if isJob-search global to avoid overriding  data
    if (!isGuest && isJobSearchGlobal) {
      // increase page number for bypassing similar jobs in the array of next fetch
      setPageNumber(prev => prev + 1)
      // false my stats
      setIsMyStats(false)
      return;
    }

    // show search jobs alert when its the one focused
    if (textOption === "Search Jobs") {
      // false my stats
      setIsMyStats(false)

      setOpenAlert(true);
      return;
    }

    // nearby jobs are those within the country of the currently logged in user
    const country = user?.country?.split(" ")[1] || "";

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "Explore Jobs") {

      // get the full pathname
      const pathName = window.location.href
      // init job id

      let jobId = ""

      // check existence of query
      if (pathName?.includes("?")) {
        jobId = pathName?.split("?")[1]?.split("=")[1]

        // axios query
        axios
          .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/specific/${user?._id}/${jobId}`, {
            withCredentials: true,
          }).then(res =>
            dispatch(updateCurrentJobs(res.data))
          ).catch(err => {
            if (err?.response?.data.login) {
              window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server unreachable"
              );
              return;
            }
            setErrorMessage(err?.response.data);
          }).finally(() => {
            setIsFetching(false);
            // false my stats
            setIsMyStats(false)
          });
      } else {

        axios
          .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/${user?._id}`, {
            withCredentials: true,
          })
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              dispatch(updateCurrentJobs(res.data));
            }

            // update the page number for the next fetch
            setPageNumber((prev) => prev + 1)

          })
          .catch(async (err) => {
            //  user login session expired show logout alert
            if (err?.response?.data.login) {
              window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server unreachable"
              );
              return;
            }
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            setIsFetching(false);
            // false my stats
            setIsMyStats(false)
          });

      }
    }

    // fetch all jobs that have been verified
    if (textOption === "Verified Jobs") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/verified/${user?._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });
    }


    // get external jobs, jobs with external websites 

    if (textOption === "External Jobs") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/external/${user?._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });
    }

    // performing post request and get the nearby jobs base on the country
    if (textOption === "Nearby Jobs") {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/nearby/${user?._id}`,
          { country },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });
    }

    // handle getting of the recommended jobs from backend
    if (textOption === "AI Selection") {

      const userSkills = user?.selectedSkills

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/recommended/${user?._id}`,
          userSkills,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
              "server unreachable"
            );
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });

    }

    // get all job applications done by the current user /all/my/application/:userId
    if (textOption === "Applications") {

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/my/application/${user?._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
              "server unreachable"
            );
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });

    }


    // fetching my jobs statistics
    if (textOption === "My Statistics") {

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/my/statistics/${user?._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentJobs(res.data));
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
              "server unreachable"
            );
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
          // true myStats
          setIsMyStats(true)
        });

    }

  }, [dispatch, textOption, user, isGuest, isJobSearchGlobal]);



  // handle navigation to hiring pane if the user has jobs he/she posted
  // as the recruiter
  const handleNavigateHiring = () => {
    // set is fetching true
    setIsFetching(true)

    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/posted/${user?.email}`, {
      withCredentials: true,
    })
      .then((res) => {
        // if the length is greater than 0 then navigate hiring pane since 
        // are jobs user posted
        if (res?.data?.length > 0) {
          navigate('/jobs/hiring')
        } else {
          // don't navigate alert you have not posted any jobs
          setGeneralTitle("Metatron H.R")
          setMessageGeneral("seems you have not posted any jobs for evaluation. post and the system will help you with assessment!")
          setOpenAlertGeneral(true)
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
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);
        // false my stats
        setIsMyStats(false)

      });
  }


  // UI theme dark light tweaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };


  // handle refresh of data
  const handleRefreshData = () => {
    // set text to default explore events
    setTextOption('Explore Jobs')
  }

  // handle navigate to login
  const handleNavigateLogin = () => {
    navigate("/auth/login")
  }

  return (
    <Suspense
      fallback={
        <Box height="88vh" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={24} />
        </Box>
      }
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ---------- AppBar ---------- */}
        <GlobalAppBar
          open={open}
          handleNavigateLogin={handleNavigateLogin}
          handleShowDarkMode={handleShowDarkMode}
          handleRefreshData={handleRefreshData}
          handleNavigateHiring={handleNavigateHiring}
          handleShowDrawerPane={handleShowDrawerPane}
          handleShowingProfileDrawer={handleShowingProfileDrawer}
          isDarkMode={isDarkMode}
          textOption={textOption}
          isGuest={isGuest}
          user={user}
        />

        {/* ---------- Drawer ---------- */}
        <GlobalDrawer
          open={open}
          setOpen={setOpen}
          isDrawerPane={isDrawerPane}
          setIsDrawerPane={setIsDrawerPane}
          textOption={textOption}
          setTextOption={setTextOption}
          isDarkMode={isDarkMode}
          user={user}
          isGuest={isGuest}
          dispatch={dispatch}
          handleIsJobsGlobalResults={handleIsJobsGlobalResults}
          handleNavigateHiring={handleNavigateHiring}
        />

        {/* ---------- MAIN CONTENT ---------- */}
        <Box
          sx={{
            height: "calc(100vh - 64px)",
            overflow: "hidden",
            width: "100%",
            transition: "all 0.25s ease",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              pt: 5,
              px: { xs: 1, md: 2 },

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: open
                  ? "repeat(auto-fit, minmax(220px, 1fr))"
                  : "repeat(auto-fit, minmax(200px, 1fr))",
                md: open
                  ? "repeat(auto-fit, minmax(240px, 1fr))"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
              },

              gap: 2,
              alignItems: "stretch",

              transition: "all 0.25s ease",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {/* ---------- LOADING ---------- */}
            {isFetching ? (
              <Box
                gridColumn="1 / -1"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                {/* ---------- JOBS ---------- */}
                {jobs?.map((job, index) => (
                  <Box key={job._id} sx={{ width: "100%" }}>
                    {isMyStats ? (
                      <JobStatsLayout
                        isDarkMode={isDarkMode}
                        job={job}
                        user={user}
                      />
                    ) : (
                      <JobLayout
                        isLastIndex={index === jobs.length - 1}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        isDarkMode={isDarkMode}
                        job={job}
                        jobs={jobs}
                        setErrorMessage={setErrorMessage}
                        isJobSearchGlobal={isJobSearchGlobal}
                      />
                    )}
                  </Box>
                ))}

                {/* ---------- EMPTY STATE ---------- */}
                {jobs?.length < 1 && (
                  <Box
                    gridColumn="1 / -1"
                    height="60vh"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    color="text.secondary"
                  >
                    <Typography variant="body2">
                      no more jobs posted
                    </Typography>

                    <Button
                      disableElevation
                      onClick={handleRefreshData}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                      startIcon={<Refresh />}
                    >
                      refresh
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* ---------- ALERTS ---------- */}
        {openAlertGeneral && (
          <AlertGeneral
            openAlertGeneral={openAlertGeneral}
            setOpenAlertGeneral={setOpenAlertGeneral}
            title={generalTitle}
            message={messageGeneral}
            defaultIcon={<InfoRounded />}
          />
        )}

        {isOpenMessageDrawer && <ParentNotifMessageDrawer />}
        {isOpenDrawerProfile && <ProfileDrawer />}

        {openAlert && (
          <AlertJobSearch
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            isFullView={true}
          />
        )}

        {errorMessage && (
          <AlertGeneral
            title="something went wrong!"
            message={errorMessage}
            isError={true}
            openAlertGeneral={errorMessage}
            setOpenAlertGeneral={setOpenAlertGeneral}
            setErrorMessage={setErrorMessage}
            defaultIcon={<InfoRounded />}
          />
        )}

        {messageSnack && (
          <MetatronSnackbar open={messageSnack} message={messageSnack} />
        )}
      </Box>
    </Suspense>
  );
}
