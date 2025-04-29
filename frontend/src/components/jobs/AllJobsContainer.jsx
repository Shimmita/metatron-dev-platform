import {
  AssignmentTurnedInRounded,
  DarkModeRounded,
  FindInPageRounded,
  HighlightOffOutlined,
  Menu,
  MyLocationRounded,
  VerifiedRounded,
  VisibilityRounded,
  WorkRounded
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AppBar,
  CircularProgress,
  CssBaseline,
  Stack,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  resetDarkMode,
} from "../../redux/AppUI";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AlertJobSearch from "../alerts/AlertJobSearch";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import JobLayout from "./layout/JobLayout";

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
  // redux states
  const { isDarkMode, isDefaultSpeedDial, isJobSearchGlobal } = useSelector(
    (state) => state.appUI
  );
  const [textOption, setTextOption] = useState(
    isJobSearchGlobal ? "Search Jobs" : "All Jobs"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(true);
  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet()) && true
  );
  const theme = useTheme();

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // axios default credentials
  axios.defaults.withCredentials = true;
  const [openAlert, setOpenAlert] = useState(false);

  const { jobs } = useSelector((state) => state.currentJobs);
  const { user } = useSelector((state) => state.currentUser);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  // handle showing of speed dial by making it off in this window of jobs
  if (isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(false));
  }

  // use effect for fetching jobs
  // fetch job posts from the backend (all,verified,nearby)
  useEffect(() => {
    // dont fetch any if isJobsearch global to avoid overriding  data
    if (isJobSearchGlobal) {
      return;
    }

    // show search jobs alert when its the one focused
    if (textOption === "Search Jobs") {
      setOpenAlert(true);
      return;
    }

    // nearby jobs are those within the country of the currently logged in user
    const country = user.country.split(" ")[1];

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "All Jobs") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all`, {
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
        });
    }

    // fetch all jobs that have been verified
    if (textOption === "Verified Jobs") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/verified`, {
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
        });
    }

    // performing post request and get the nearby jobs base on the country
    if (textOption === "Nearby Jobs") {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/nearby`,
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
        });
    }
  }, [dispatch, textOption, user, isJobSearchGlobal]);

 

  // handle display of the darwaer pane
  const handleShowDrawerPane = () => {
    setIsDrawerPane((prev) => !prev);
  };

  // UI theme dark light teaking effect
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
        <Box display={"flex"} width={"100%"}>
          <CssBaseline />
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
              <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  textAlign={"center"}
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                >
                  Metatron Jobs
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="caption" fontWeight={"bold"}>
                    {textOption}
                  </Typography>
                </Box>
              </Box>

              {/* alter theme */}
              <Box>
                <IconButton onClick={handleShowDarkMode}>
                  <Tooltip arrow title={isDarkMode ? "Try Light" : "Try Dark"}>
                    <DarkModeRounded
                      sx={{ color: isDarkMode ? "yellow" : "white" }}
                    />
                  </Tooltip>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            open={open}
            sx={{ display: isDrawerPane ? "block" : "none" }}
          >
            <DrawerHeader
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!open && (
                <Box>
                  <IconButton onClick={handleDrawerOpen}>
                    <Menu />
                  </IconButton>
                </Box>
              )}

              {open && (
                <Box>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )}
                  </IconButton>
                </Box>
              )}
            </DrawerHeader>
            <Divider className=" w-100" component={"div"} />

            {/* show hide drawer vsibility when drawer is not expanded */}
            {!open && (
              <Stack justifyContent={"center"} mt={1}>
                {/* hide drawer visibility */}
                <IconButton size="small" onClick={handleShowDrawerPane}>
                  <HighlightOffOutlined />
                </IconButton>
              </Stack>
            )}

            {open && (
              <React.Fragment>
                <Box pt={1} ml={3}>
                  {/*applicants */}
                  <Typography variant="body1" textAlign={'center'} fontWeight={"bold"}>
                   DashBoard
                  </Typography>
                </Box>

                {/*divider */}
                <Divider className="p-1 w-100" component={"div"} />
              </React.Fragment>
            )}

            <List>
              {[
                "All Jobs",
                "Search Jobs",
                "Verified Jobs",
                "Nearby Jobs",
                "My Applications",
                "Recruiter Seen",
              ].map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{ display: "block" }}
                  onClick={() => {
                    // update the selected option
                    setTextOption(text);
                    // disable jobsSearch gloablal results to fale in redux
                    dispatch(handleIsJobsGlobalResults(false));
                  }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      <Tooltip title={text} arrow>
                      {index === 0 ? (
                        <WorkRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 1 ? (
                        <FindInPageRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 2 ? (
                        <VerifiedRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 3 ? (
                        <MyLocationRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 4 ? (
                        <AssignmentTurnedInRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : (
                        <VisibilityRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      )}
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          color={text === textOption ? "primary" : "inherit"}
                          fontWeight={text === textOption && "bold"}
                        >
                          {text}
                        </Typography>
                      }
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

          </Drawer>
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
                {/* all jobs and verified jobs and Nearby that have no external link */}
                {(textOption === "All Jobs" ||
                  textOption === "Nearby Jobs" ||
                  textOption === "Verified Jobs" ||
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
                          jobs?.map((job, index) => (
                            <React.Fragment>
                              <JobLayout
                                key={index}
                                isDarkMode={isDarkMode}
                                job={job}
                              />
                              {/* divider for small devices */}
                              {CustomDeviceIsSmall() && (
                                <Divider
                                  className="mb-2 w-100"
                                  component={"div"}
                                />
                              )}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            </Box>
          </Box>

          {/* show job search alert */}
          <AlertJobSearch
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            isFullView={true}
          />

          {/* show success snackbar when redux snack state is updated */}
          {messageSnack && <SnackBarSuccess message={messageSnack} />}
        </Box>
      </Suspense>
  );
}
