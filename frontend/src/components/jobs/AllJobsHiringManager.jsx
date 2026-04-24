import {
  DarkModeRounded,
  HelpRounded,
  InfoRounded,
  Menu,
  Refresh,
  TipsAndUpdatesRounded
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  Toolbar,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AlertGeneral from "../alerts/AlertGeneral";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import PostJobModal from "../modal/PostJobModal";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import HiringDrawer from "./HiringDrawer";
import ApplicantsTable from "./layout/ApplicantsTable";
import JobLayoutHiring from "./layout/JobLayoutHiring";
import JobStatsLayout from "./layout/JobStatsLayouts";
import ManageJobsTable from "./layout/ManageJobsTable";

const drawerWidth = CustomDeviceIsSmall ? 200 : 270;

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



export default function AllJobsHiringManager() {
  // track axios progress
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openJobPostModal, setOpenJobPostModal] = useState(false)
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const [openAlertAbout, setOpenAlertAbout] = useState(false)
  const [messageAbout, setMessageAbout] = useState("")
  const [title, setTitle] = useState("")

  // track theme
  const theme = useTheme();

  // smartphones and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const { user } = useSelector((state) => state.currentUser);

  const { messageSnack } = useSelector((state) => state.currentSnackBar);

  // trigger redux update
  const dispatch = useDispatch();

  // statistics tracker
  const [isMyStats, setIsMyStats] = useState(false)

  // job application table
  const [isApplicantsTable, setIsApplicantsTable] = useState(false)

  // manage jobs posted
  const [isManageJobsTable, setIsManageJobsTable] = useState(false)

  // selected option
  const [textOption, setTextOption] = useState(
    isJobSearchGlobal ? "Search Jobs" : "My Posted Jobs"
  );

  // false right bar is no of use this route
  useLayoutEffect(() => {
    // true tem, and the redux will reverse
    dispatch(handleSidebarRightbar(true));
  }, [dispatch, isSidebarRighbar])


  // holds drawer status
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false : true);

  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet())
  );

  // focused job for assessment and fetch prospective applicants
  const [focusedJob, setFocusedJob] = useState({})

  // navigate to other routes
  const navigate = useNavigate()


  // handle navigation to hiring pane
  const handleNavigateJobSeeker = () => {
    navigate('/jobs')
  }

  // handle opening of drawer profile
  const handleShowingProfileDrawer = () => {
    dispatch(showUserProfileDrawer());
  };


  // handle opening drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // handle closing of the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // handle showing of speed dial by making it off in this window of jobs
  if (isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(false));
  }

  // false right bar is no of use this route
  useLayoutEffect(() => {
    // updating right bar show false
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  }, [dispatch, isSidebarRighbar])

  // use effect for fetching jobs
  // fetch job posts from the backend (all,verified,nearby,recommended etc)
  useEffect(() => {
    // don't fetch any if isJob-search global to avoid overriding  data
    if (isJobSearchGlobal) {
      // false my stats
      setIsMyStats(false)
      return;
    }

    // open jobs creation modal
    if (textOption === "Upload New Job") {
      setOpenJobPostModal(true)
      return
    }

    // show alert general, displays about page
    if (textOption === "About H.R Page") {
      setTitle(textOption)
      setMessageAbout(
        `Metatron H.R. gives recruiters a powerful, 
        one click dashboard to effortlessly manage job applicants. Quickly evaluate candidates, surface top talent, and move the right people forward all within a unified experience. 
        Important: Jobs that direct applicants to an external website for submission do not support this feature, as application handling takes place outside the Metatron Developer Platform. 
        Only jobs that keep the entire application flow within Metatron benefit from the full management suite. 
        Platform Integrity Notice Posting false, misleading, or “rogue” job listings is strictly forbidden. To protect our community, any account found violating this policy will be permanently 
        deleted with or without prior notice at our sole discretion. 
        Your account safe: only publish genuine opportunities for our valued users.`)
      setOpenAlertAbout(true)
      // refetch jobs
      setTextOption("My Posted Jobs")
      return
    }

    // examine HR tips 
    if (textOption === "Examine H.R Tips") {
      setTitle(textOption)
      setMessageAbout(
        `Metatron H.R. gives recruiters a powerful, one‑click dashboard to effortlessly manage job applicants, evaluate candidates, 
        and surface top talent all within a unified experience. 
        The Explore Posted Jobs view lists every job you’ve published, showing both Verified Jobs 
        (applications managed entirely within Metatron) and External Jobs (where applicants are redirected to an external site to complete their submission). For Verified Jobs, 
        the Jobs Assessment window provides a complete toolkit to download candidate CVs, message applicants directly, preview profiles, and update application statuses to Pending, Proceed, or Reject—and we recommend messaging applicants after updating their status to keep them informed throughout the process. The Jobs Management panel lets you easily edit job details, toggle a posting between Active and Inactive, or permanently remove a job when it’s no longer accepting applications. To protect our community, posting false, misleading, or "rogue" job listings is strictly forbidden; any account found violating this policy will be permanently deleted—with or without prior notice—at our sole discretion, 
        so keep your account safe by only publishing genuine opportunities for our valued users.
          `)
      setOpenAlertAbout(true)
      // refetch jobs
      setTextOption("My Posted Jobs")
      return
    }


    // show the manage jobs table
    if (textOption === "Jobs Management") {
      setIsManageJobsTable(true)
      return
    }


    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "My Posted Jobs" || textOption === "Jobs Assessment") {

      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/posted/${user?.email}`, {
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
          setOpenAlertGeneral(true)
        })
        .finally(() => {
          setIsFetching(false);
          // false my stats
          setIsMyStats(false)

        });
    }


  }, [dispatch, textOption, user, isJobSearchGlobal]);


  // handle display of the drawer pane
  const handleShowDrawerPane = () => {
    setIsDrawerPane((prev) => !prev);
  };

  // handle refresh of data
  const handleRefreshData = () => {
    // set text to default explore events
    setTextOption('My Posted Jobs')
  }

  // UI theme dark light tweaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };

  return (
    <Suspense
      fallback={
        <Box height={"90vh"} display={"flex"} justifyContent={"center"}>
          <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress size={20} />
          </Box>
        </Box>
      }
    >
      <Box
        height={(CustomLandScape() || CustomLandscapeWidest()) ? "86vh" : "90vh"}
        display={"flex"}
        sx={{
          width: window.screen.availWidth - 18,
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Box>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleShowDrawerPane}
                edge="start"
                sx={[
                  {
                    marginRight: 5,
                  },
                  open && { display: "none" },
                ]}
              >
                <Menu />
              </IconButton>

            </Box>

            {/* main jobs title and the current selection */}
            {CustomDeviceIsSmall() ? (
              <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  textAlign={"center"}
                  fontWeight={'bold'}
                  textTransform={"uppercase"}
                >
                  Metatron
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="caption"
                    fontWeight={'bold'}
                    textTransform={'capitalize'}
                  >
                    {textOption}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  textAlign={"center"}
                  fontWeight={'bold'}
                  textTransform={"uppercase"}

                  ml={open ? 30 : 24}
                >
                  Metatron HR
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="caption"
                    fontWeight={'bold'}
                    textTransform={'capitalize'}
                    ml={open ? 30 : 24}>
                    - {textOption} -
                  </Typography>
                </Box>
              </Box>
            )}

            <Box display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'flex-end'}>


              {/* dark mode */}
              <IconButton
                onClick={handleShowDarkMode}>
                <Tooltip arrow title={isDarkMode ? "Light" : "Dark"}>
                  <DarkModeRounded

                    sx={{ color: "white", height: 24, width: 24, }}
                  />
                </Tooltip>
              </IconButton>

              {/* profile avatar */}
              <Tooltip arrow title={"profile"}>
                <IconButton onClick={handleShowingProfileDrawer}>
                  <Avatar
                    sx={{ width: 30, height: 30 }}
                    src={user?.avatar}
                    alt={""}
                  />
                </IconButton>
              </Tooltip>

            </Box>

          </Toolbar>
        </AppBar>

        {/* show hiring drawer */}
        <HiringDrawer
          dispatch={dispatch}
          isDrawerPane={isDrawerPane}
          open={open}
          setOpen={setOpen}
          theme={theme}
          isDarkMode={isDarkMode}
          user={user}
          setTextOption={setTextOption}
          handleNavigateJobSeeker={handleNavigateJobSeeker}
          handleIsJobsGlobalResults={handleIsJobsGlobalResults}
          setIsDrawerPane={setIsDrawerPane}
          textOption={textOption}
        />


        {/* body of the jobs */}
        <Box
          width={"100%"}
          display={"flex"}
          height={"90vh"}
          justifyContent={"center"}
        >
          {/* centering the content */}
          <Box
            p={!CustomDeviceIsSmall() ? 2 : undefined}
            display={"flex"}
            gap={2}
            maxHeight={"85vh"}
            flexWrap={"wrap"}
            justifyContent={"center"}
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

              {/* if is applicants table vs jobs layout */}
              {isApplicantsTable ? (
                <ApplicantsTable setIsApplicantsTable={setIsApplicantsTable} focusedJob={focusedJob} />
              ) : isManageJobsTable ? (
                <ManageJobsTable setIsManageJobsTable={setIsManageJobsTable} MyPostedJobs={jobs} />
              ) : (
                <React.Fragment>
                  {/* all jobs and verified jobs and Nearby that have no external link */}
                  {(textOption === "My Posted Jobs" ||
                    textOption === "Jobs Assessment" ||
                    textOption === "Search Jobs") && (
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
                            {/* rendered when are jobs greater than 1 */}
                            {jobs &&
                              jobs?.length > 0 &&
                              jobs?.map((job) => (
                                <>
                                  {/* if is stats displays different layout else job layout */}
                                  {isMyStats ? (
                                    <JobStatsLayout
                                      key={job?._id}
                                      isDarkMode={isDarkMode}
                                      job={job}
                                    />
                                  ) : (
                                    <JobLayoutHiring
                                      textOption={textOption}
                                      key={job?._id}
                                      isDarkMode={isDarkMode}
                                      job={job}
                                      setFocusedJob={setFocusedJob}
                                      setIsApplicantsTable={setIsApplicantsTable}
                                    />
                                  )}
                                  {/* divider for small devices */}
                                  {CustomDeviceIsSmall() && (
                                    <Divider
                                      className="mb-2 w-100"
                                      component={"div"}
                                    />
                                  )}
                                </>
                              ))}

                            {/* rendered if are no jobs  */}
                            {jobs?.length < 1 && (
                              <Box
                                height={'70vh'}
                                display={'flex'}
                                justifyContent={'center'}
                                color={'text.secondary'}
                                flexDirection={'column'}
                                gap={2}
                                alignItems={'center'}
                              >
                                {/* no events */}
                                <Typography variant="body2">
                                  no more jobs posted
                                </Typography>
                                {/* show refresh button */}
                                <Button
                                  disableElevation
                                  onClick={handleRefreshData}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 3 }}
                                  startIcon={<Refresh />}
                                >refresh</Button>
                              </Box>
                            )}

                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                </React.Fragment>
              )}

            </React.Fragment>
          </Box>
        </Box>

        {/* open job posting modal */}
        {openJobPostModal && (
          <PostJobModal
            openModalJob={openJobPostModal}
            setOpenModalJob={setOpenJobPostModal}
            isHiring={true}
            setTextOption={setTextOption}
          />
        )}

        {/* holds the notification and messaging drawer */}
        {isOpenMessageDrawer && (
          <ParentNotifMessageDrawer />
        )}

        {/* holds the profile drawer which contains user account info */}
        {isOpenDrawerProfile && (
          <ProfileDrawer />
        )}

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

        {/* alert show about  */}
        {openAlertAbout && (
          <AlertGeneral
            title={title}
            message={messageAbout}
            openAlertGeneral={openAlertAbout}
            setOpenAlertGeneral={setOpenAlertAbout}
            defaultIcon={title.includes('Examine') ? <TipsAndUpdatesRounded color="primary" /> : <HelpRounded color="info" />}
          />
        )}

        {/* show success snackbar when redux snack state is updated */}
        {messageSnack && <SnackBarSuccess message={messageSnack} />}
      </Box>
    </Suspense>
  );
}
