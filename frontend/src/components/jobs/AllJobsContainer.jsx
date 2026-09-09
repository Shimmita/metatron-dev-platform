import {
  AutoAwesome,
  BarChartRounded,
  CloudDoneRounded,
  InfoRounded,
  MyLocationRounded,
  Refresh,
  TravelExploreRounded,
  VerifiedRounded,
  WorkRounded
} from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  useMediaQuery
} from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
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
import JobLayout from "./layout/JobLayout";
import JobStatsLayout from "./layout/JobStatsLayouts";

const drawerWidth = 240;
const collapsedDrawerWidth = 70;
const JOB_PAGE_SIZE = 12;

export default function MiniDrawer() {
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const [generalTitle, setGeneralTitle] = useState("")
  const [messageGeneral, setMessageGeneral] = useState("")
  const [pageNumber, setPageNumber] = useState(2)
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
  const [open, setOpen] = useState(false);

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
          .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/${user?._id || "guest"}?page=1&limit=${JOB_PAGE_SIZE}`, {
            withCredentials: true,
          })
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              dispatch(updateCurrentJobs(res.data));
            }

            // update the page number for the next fetch
            setPageNumber(2)

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

  const jobMetrics = [
    ["Matched roles", jobs?.length || 0, "Live opportunities in this view"],
    ["Workspace", textOption, "Current hiring lane"],
    ["Profile", isGuest ? "Guest" : "Active", "Application readiness"],
    ["Signal", isJobSearchGlobal ? "Search" : "Market", "Data source"],
  ];

  const jobQuickModes = [
    { label: "AI Selection", icon: <AutoAwesome /> },
    { label: "Verified Jobs", icon: <VerifiedRounded /> },
    { label: "External Jobs", icon: <TravelExploreRounded /> },
    { label: "Nearby Jobs", icon: <MyLocationRounded /> },
    { label: "Applications", icon: <CloudDoneRounded /> },
    { label: "My Statistics", icon: <BarChartRounded /> },
  ].filter(() => !isGuest);

  const jobGuidance = [
    ["Apply smarter", "Prioritize roles where your stack, location, and seniority already match."],
    ["Keep proof ready", "Attach projects, GitHub work, and outcomes before entering competitive roles."],
    ["Track momentum", "Use applications and statistics to tighten your next move."],
  ];

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
          minHeight: "100%",
          overflow: "visible",
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(5,8,18,0.98), rgba(10,10,10,0.98))"
            : "linear-gradient(180deg, #F7F3EA, #F7F3EA)",
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
          isDrawerPane={isDrawerPane}
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
            minHeight: "calc(100vh - 56px)",
            overflow: "visible",
            width: {
              xs: "100%",
              lg: isDrawerPane ? `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)` : "100%",
            },
            ml: {
              xs: 0,
              lg: isDrawerPane ? `${open ? drawerWidth : collapsedDrawerWidth}px` : 0,
            },
            transition: "all 0.25s ease",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", lg: "1128px", xl: "1188px" },
              mx: "auto",
              minHeight: "100%",
              overflowY: "visible",
              overflowX: "hidden",
              pt: { xs: 7.5, md: 7.5 },
              px: { xs: 1, md: 2, lg: 2.5 },
              pb: { xs: 13, md: 14, lg: 15 },

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: open
                  ? "repeat(auto-fit, minmax(260px, 1fr))"
                  : "repeat(auto-fit, minmax(280px, 1fr))",
                md: open
                  ? "repeat(auto-fit, minmax(280px, 1fr))"
                  : "repeat(auto-fit, minmax(320px, 1fr))",
                lg: open
                  ? "repeat(auto-fit, minmax(360px, 1fr))"
                  : "repeat(auto-fit, minmax(390px, 1fr))",
              },

              gap: 1.5,
              alignItems: "stretch",

              transition: "all 0.25s ease",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Box
              sx={{
                gridColumn: "1 / -1",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(13,13,13,0.94), rgba(214,178,94,0.08), rgba(255,255,255,0.10))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(238,247,255,0.92))",
                p: { xs: 1.5, md: 2 },
                boxShadow: isDarkMode
                  ? "0 18px 50px rgba(0,0,0,0.28)"
                  : "0 16px 32px rgba(139,111,42,0.08)",
              }}
            >
              <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={0.75}>
                    <WorkRounded sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography variant="overline" color="primary.main">
                      Tech Gig Marketplace
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={900} lineHeight={1.12}>
                    {textOption}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                    Explore verified engineering roles, recommended matches, applications, and hiring intelligence from one focused workspace.
                  </Typography>
                </Box>
                <Button
                  disableElevation
                  variant="contained"
                  onClick={handleRefreshData}
                  startIcon={<Refresh />}
                  sx={{ minWidth: { xs: "100%", sm: 150, md: 132 } }}
                >
                  Refresh
                </Button>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                  gap: 1,
                  mt: 2,
                }}
              >
                {jobMetrics.map(([label, value, helper]) => (
                  <Box
                    key={label}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.045)",
                      p: 1,
                      minHeight: 64,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body1" fontWeight={900} noWrap>
                      {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {helper}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {jobQuickModes.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {jobQuickModes.map((mode) => (
                    <Chip
                      key={mode.label}
                      clickable
                      icon={mode.icon}
                      label={mode.label}
                      color={textOption === mode.label ? "primary" : "default"}
                      variant={textOption === mode.label ? "filled" : "outlined"}
                      onClick={() => {
                        setTextOption(mode.label);
                        dispatch(handleIsJobsGlobalResults(false));
                      }}
                      sx={{
                        borderRadius: "8px",
                        fontWeight: 800,
                        background: textOption === mode.label ? undefined : "rgba(255,255,255,0.035)",
                      }}
                    />
                  ))}
                </Stack>
              )}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                  gap: 1,
                  mt: 1.5,
                }}
              >
                {jobGuidance.map(([title, copy]) => (
                  <Box
                    key={title}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(5,8,18,0.18)",
                      p: 1.25,
                    }}
                  >
                    <Typography variant="body2" fontWeight={900}>
                      {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {copy}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

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
                        canLoadMore={textOption === "Explore Jobs" && !window.location.href?.includes("?")}
                      />
                    )}
                  </Box>
                ))}

                {/* ---------- EMPTY STATE ---------- */}
                {jobs?.length < 1 && (
                  <Box
                    gridColumn="1 / -1"
                    minHeight="60vh"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    color="text.secondary"
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.035)",
                    }}
                  >
                    <Typography variant="body1" fontWeight={800}>
                      No matching tech gigs yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      The marketplace has no roles for this filter.
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
