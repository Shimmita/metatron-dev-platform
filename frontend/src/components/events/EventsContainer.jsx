import {
  Add,
  AutoAwesome,
  CheckCircle,
  EventAvailableRounded,
  FindInPageRounded,
  HomeRounded,
  HubRounded,
  InfoRounded,
  InsightsRounded,
  Menu,
  MyLocationRounded,
  Person,
  Refresh,
  Settings,
  WorkRounded
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Toolbar,
  Tooltip,
  useMediaQuery
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
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import { appGradients } from "../../utils/colors";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import EventsAddModal from "../modal/EventsAddModal";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import EventItem from "./layout/EventItem";
import EventStatsLayout from "./layout/EventStatsLayout";

const drawerWidth = CustomDeviceIsSmall() ? 200 : 250;

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

const getRequestMessage = (err, fallback = "Unable to load events.") => {
  if (err?.code === "ERR_NETWORK") return "Server unreachable. Please try again later.";
  const payload = err?.response?.data || err;
  if (typeof payload === "string") return payload;
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  return fallback;
};

const EVENT_PAGE_SIZE = 12;




export default function EventsContainer() {
  const [openModalEvent,setOpenModalEvent]=useState(false)
  const [isEventsStats,setIsEventsStats]=useState(false)
  const [focusedEvent,setFocusedEvent]=useState(null)
  const [pageNumber,setPageNumber]=useState(2)
  
  // redux states
  const { 
    currentMode, 
    isDefaultSpeedDial, 
    isJobSearchGlobal,
    isOpenDrawerProfile,
    isOpenMessageDrawer,
    isSidebarRighbar
   } = useSelector(
    (state) => state.appUI
  );

  // dark mode theme
  const isDarkMode=currentMode==='dark'
  const { user,isGuest } = useSelector((state) => state.currentUser);
  const { events:eventsData } = useSelector((state) => state.currentEvents);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);
  const theme = useTheme();
  const panelRadius = `${theme.shape.borderRadius}px`;
  const navigate=useNavigate()
    // trigger redux update
    const dispatch = useDispatch();
  // smartphones and below
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const[isMyStats,setIsMyStats]=useState(false)

  const [textOption, setTextOption] = useState(
    !isGuest && isJobSearchGlobal ? "Search Events" : "Explore Events"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false:true);
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

   // false right bar is no of use this route
    useLayoutEffect(()=>{
     // true tem, and the redux will reverse
      dispatch(handleSidebarRightbar(true));
    },[dispatch,isSidebarRighbar])


  // use effect for fetching jobs
  // fetch job posts from the backend (all,verified,nearby,recommended etc)
  useEffect(() => {
     // update bottom nav position
      dispatch(updateCurrentBottomNav(2))

    // don't fetch any if isJob-search-events global to avoid overriding  data
    if (!isGuest && isJobSearchGlobal) {
      // false my stats
      setIsMyStats(false)
      return;
    }

    // show search jobs alert when its the one focused
    if (textOption === "Search Events") {
      // false my stats
      setIsMyStats(false)

      setOpenAlert(true);
      return;
    }

    // nearby jobs are those within the country of the currently logged in user
    const country = user?.country?.split(" ")[1]||"";

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "Explore Events") {
       // get the full pathname
        const pathName=window.location.href
        // init job id

        let eventId=""

        // check existence of query
            if (pathName?.includes("?")) {
              eventId=pathName?.split("?")[1]?.split("=")[1]
    
              // axios query
              axios
                .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/specific/${eventId}`, {
                  withCredentials: true,
                }).then(res=>
                  dispatch(updateCurrentEvents(res.data))
                ).catch(err=>{
                  if (err?.response?.data?.login) {
                    window.location.reload();
                  }
                  setErrorMessage(getRequestMessage(err));
                }).finally(() => {
              setIsFetching(false);
              // false my stats
              setIsMyStats(false)
            });
            }else {

            axios
              .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all?page=1&limit=${EVENT_PAGE_SIZE}`, {
                withCredentials: true,
              })
              .then((res) => {
                // update the redux of current events
                if (res?.data) {
                  dispatch(updateCurrentEvents(res.data))
                } 
                setPageNumber(2)
              })
              .catch(async (err) => {
                //  user login session expired show logout alert
                if (err?.response?.data?.login) {
                  window.location.reload();
                }
                setErrorMessage(getRequestMessage(err));
              })
              .finally(() => {
                setIsFetching(false);
                // false my stats
                setIsMyStats(false)
              });
          }
  }
    // trigger showing of modal event
    if (textOption === "Create Events") {
      // activate modal
      setOpenModalEvent(true)

      // set text to default explore events
      setTextOption('Explore Events')
    }

    // performing post request and get the nearby jobs base on the country
    if (textOption === "Nearby Events") {
      axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/nearby/`,
          { country },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentEvents(res.data));
          } 
        })
        .catch(async (err) => {
          //  user login session expired show logout alert
          if (err?.response?.data?.login) {
            window.location.reload();
          }
          setErrorMessage(getRequestMessage(err));
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });
    }

    // handle getting of the recommended jobs from backend
    if (textOption === "AI Selection") {

      const userSkills=user?.selectedSkills
      
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/recommended`,
          userSkills ,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current events
          if (res?.data) {
            dispatch(updateCurrentEvents(res.data));
          } 
        })
        .catch(async (err) => {
          //  user login session expired show logout alert
          if (err?.response?.data?.login) {
            window.location.reload();
          }
          setErrorMessage(getRequestMessage(err));
        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });

    }

   // get all events rsvp done by the current user, also 
   if (textOption === "RSVP Events" ) {

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/rsvp/${user?._id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of current events
        if (res?.data) {
          dispatch(updateCurrentEvents(res.data));
        } 
      })
      .catch(async (err) => {
        console.log(err);
        //  user login session expired show logout alert
        if (err?.response?.data?.login) {
          window.location.reload();
        }
        setErrorMessage(getRequestMessage(err));
      })
      .finally(() => {
        setIsFetching(false);
        // false myStats
        setIsMyStats(false)
      });

  }


  // if is events manager, fetch all user created events and
  // can edit or delete them.

  if (textOption==="Events Manager") {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/${user?._id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of current events
        if (res?.data) {
          dispatch(updateCurrentEvents(res.data));
        } 
      })
      .catch(async (err) => {
        console.log(err);
        //  user login session expired show logout alert
        if (err?.response?.data?.login) {
          window.location.reload();
        }
        setErrorMessage(getRequestMessage(err));
      })
      .finally(() => {
        setIsFetching(false);
        // false myStats
        setIsMyStats(false)
      });
  }

  }, [dispatch, textOption, user, isGuest, isJobSearchGlobal]);


     // UI theme dark light tweaking effect
     const handleShowDarkMode = () => {
      // update the redux theme boolean state
      dispatch(resetDarkMode());
    };


    // handle refresh of data
    const handleRefreshData=()=>{
      // set text to default explore events
      setTextOption('Explore Events')
    }
  
     // handle navigate to login
    const handleNavigateLogin=()=>{
      navigate("/auth/login")
    }

    const handleNavigateHome = () => {
      dispatch(updateCurrentBottomNav(0));
      dispatch(handleSidebarRightbar(true));
      dispatch(handleShowingSpeedDial(true));
      dispatch(handleIsJobsGlobalResults(false));
      navigate("/explore");
    }

    const eventMetrics = [
      ["Sessions", eventsData?.length || 0, "Live events in this view"],
      ["Workspace", textOption, "Current event lane"],
      ["Attendance", textOption === "RSVP Events" ? "Confirmed" : "Open", "Participation status"],
      ["Access", isGuest ? "Guest" : "Member", "Platform role"],
    ];

    const eventQuickModes = [
      { label: "AI Selection", icon: <AutoAwesome /> },
      { label: "Nearby Events", icon: <MyLocationRounded /> },
      { label: "RSVP Events", icon: <CheckCircle /> },
      { label: "Events Manager", icon: <Settings /> },
    ].filter(() => !isGuest);

    const eventGuidance = [
      ["Learn live", "Use workshops and meetups to turn skills into real technical conversations."],
      ["Grow network", "RSVP early, join active sessions, and follow builders in your stack."],
      ["Host better", "Track event stats and create focused sessions for developer outcomes."],
    ];


  return (
      <Suspense
        fallback={
          <Box height={"88vh"} display={"flex"} justifyContent={"center"}>
            <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress size={20} />
            </Box>
          </Box>
        }
      >
        <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          overflow: "visible",
          borderRadius: panelRadius,
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(5,8,18,0.98), rgba(10,10,10,0.98))"
            : "linear-gradient(180deg, #F7F3EA, #F7F3EA)",
         }}
        >
          <AppBar
            position="fixed"
            open={open}
            sx={{
              width: {
                xs: "100%",
                lg: isDrawerPane ? `calc(100% - ${open ? drawerWidth : 70}px)` : "100%",
              },
              ml: {
                xs: 0,
                lg: isDrawerPane ? `${open ? drawerWidth : 70}px` : 0,
              },
              background: theme.palette.mode === "dark"
                ? "rgba(5,5,5,0.9)"
                : appGradients.primary,
              backdropFilter: "blur(18px) saturate(150%)",
              boxShadow: theme.palette.mode === "dark"
                ? "0 8px 28px rgba(0,0,0,0.28)"
                : "0 12px 28px rgba(139,111,42,0.14)",
              borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)"}`,
            }}
          >
            <Toolbar
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: 56,
                py: 0,
                px: { xs: 1.25, md: 2 },
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
                      display: { xs: "none", lg: isDrawerPane ? "none" : "inline-flex" },
                    },
                    open && { display: "none" },
                  ]}
                >
                  <Menu />
                </IconButton>
              </Box>

              <Box width={"100%"} minWidth={0}>
                <Typography
                  noWrap
                  component="div"
                  fontWeight={900}
                  textAlign={"center"}
                  textTransform={"uppercase"}
                  sx={{
                    letterSpacing: "0.12rem",
                    fontSize: 14,
                    background: "linear-gradient(90deg, #FFFFFF, #D6B25E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Metatron Events
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={800}
                  textTransform={'capitalize'}
                  color="primary.main"
                  display="block"
                  textAlign="center"
                  noWrap
                >
                  {textOption}
                </Typography>
              </Box>
              <Box 
              display={'flex'}
                gap={1} 
                alignItems={'center'} 
                justifyContent={'flex-end'}>
                <Tooltip arrow title="Back to Home">
                  <IconButton
                    onClick={handleNavigateHome}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "primary.main",
                      width: 34,
                      height: 34,
                      "&:hover": { background: "rgba(214,178,94,0.08)" },
                    }}
                  >
                    <HomeRounded sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              
                {isGuest ? (
                  <Button 
                    size="medium"
                    onClick={handleNavigateLogin}
                    color="inherit"
                    startIcon={<Person/>}
                    >
                      Signin
                    </Button>
                ):(
                  <React.Fragment>
                {/* dark mode */}
                    {/* <IconButton
                onClick={handleShowDarkMode}>
                  <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
                  <DarkModeRounded
                    sx={{ color: "white", height:24, width:24,}}
                  />
                </Tooltip>
                </IconButton> */}

                  <Tooltip arrow title={"profile"}>
                <IconButton onClick={handleShowingProfileDrawer}>
                <Avatar
                    sx={{ width: 30, height: 30 }}
                    src={user?.avatar}
                    alt={""}
                />
                </IconButton>
              </Tooltip>
              </React.Fragment>
                )}

              </Box>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            open={open}
            sx={{
              display: { xs: "none", lg: isDrawerPane ? "block" : "none" },
              "& .MuiDrawer-paper": {
                borderRight: "1px solid",
                borderColor: "divider",
                backgroundColor: theme.palette.background.paper,
                backgroundImage: theme.palette.mode === "dark"
                  ? "linear-gradient(180deg, rgba(139,111,42,0.16), rgba(255,255,255,0.01))"
                  : "linear-gradient(180deg, rgba(139,111,42,0.08), rgba(255,255,255,0.92))",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <DrawerHeader
              sx={{
                minHeight: 56,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(12,12,12,0.96), rgba(139,111,42,0.82))"
                  : appGradients.primary,
              }}
            >
              {!open && (
                <Box>
                  <IconButton onClick={handleDrawerOpen}>
                    <Menu  sx={{ color:'white' }} />
                  </IconButton>
                </Box>
              )}

                  {open && (
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                    {/* icon right or left arrow */}
                  <IconButton onClick={handleDrawerClose}>
                    <Menu sx={{ color:'white' }} />
                  </IconButton>
                  <Box 
                  display={'flex'} 
                  flexDirection={'column'} 
                  justifyContent={'center'} 
                  alignItems={'center'}>
                  {/* title hiring */}
                  <Typography variant="body2" 
                  sx={{color:'white'}} 
                  fontWeight={'bold'}
                  mb={1}
                  textTransform={'uppercase'}>
                    Welcome
                  </Typography>
                  <Typography 
                  fontWeight={'bold'}
                  variant="caption" 
                  sx={{color:'white'}} 
                  >
                  - {user?.name?.substring(0,13) || "Guest Mode"} -
                  </Typography>
                  </Box>

                </Box>
              )}
            </DrawerHeader>
            <Divider className=" w-100" component={"div"} />

            {open && (
            <List sx={{ px: 1, pt: 1, flex: 1 }}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={handleNavigateHome}
                  sx={{
                    minHeight: 44,
                    px: 2,
                    borderRadius: "8px",
                    justifyContent: open ? "initial" : "center",
                    background: "rgba(255,255,255,0.035)",
                    "&:hover": {
                      background: "rgba(214,178,94,0.10)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: open ? 3 : "auto",
                      color: "primary.main",
                    }}
                  >
                    <Tooltip title="Home" arrow>
                      <HomeRounded />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="primary.main" fontWeight={900}>
                        Home
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              {(isGuest ? [
                "Explore Events",
              ] : [
                "Explore Events",
                "Search Events",
                "Create Events",
                "Nearby Events",
                "AI Selection",
                "RSVP Events",
                "Events Manager",
              ]).map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  onClick={() => {
                    // update the selected option
                    setTextOption(text);
                    // disable jobsSearch global results to false in redux
                    dispatch(handleIsJobsGlobalResults(false));
                  }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 44,
                        px: 2,
                        mb: 0.5,
                        borderRadius: "8px",
                        background: text === textOption ? "rgba(214,178,94,0.14)" : "transparent",
                        "&:hover": {
                          background: text === textOption ? "rgba(214,178,94,0.18)" : "rgba(255,255,255,0.05)",
                        },
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
                          sx={{width:22,height:22}}
                        />
                      ) : index === 1 ? (
                        <FindInPageRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 2 ? (
                        <Add
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 3 ? (
                        <MyLocationRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 4 ? (
                        <AutoAwesome
                        color={text === textOption ? "primary" : "inherit"}
                      />
                       
                      ) :index===5 ? (
                        <CheckCircle
                        color={text === textOption ? "primary" : "inherit"}
                      />
                        
                      ):(
                        <Settings
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
            )}
            {open && !isGuest && (
              <Box sx={{ px: 1.5, mt: "auto", mb: 2 }}>
                <Box
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.16)",
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(191,164,106,0.08))"
                      : "linear-gradient(135deg, rgba(214,178,94,0.08), rgba(139,111,42,0.05))",
                    p: 1.5,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <HubRounded color="primary" sx={{ fontSize: 18 }} />
                    <Typography variant="caption" color="primary.main" fontWeight={900}>
                      EVENT OPERATIONS
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={900} mt={0.75}>
                    Turn sessions into network signal.
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={0.75} mt={0.75}>
                    <InsightsRounded color="primary" sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      RSVP, stream, and review host analytics from one panel.
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            )}


          </Drawer>
             <Box
          sx={{
            minHeight: "calc(100vh - 56px)",
            width: {
              xs: "100%",
              lg: isDrawerPane ? `calc(100% - ${open ? drawerWidth : 70}px)` : "100%",
            },
            ml: {
              xs: 0,
              lg: isDrawerPane ? `${open ? drawerWidth : 70}px` : 0,
            },
            overflow: "visible",
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
                alignItems: "start",
                borderRadius: panelRadius,
                backgroundColor: theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.74)",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                p: { xs: 1, md: 1.75, lg: 2 },
                pt: { xs: 7.5, md: 7.5 },
                pb: { xs: 13, md: 14, lg: 15 },
              }}
            >
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(13,13,13,0.94), rgba(214,178,94,0.08), rgba(191,164,106,0.10))"
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
                      <EventAvailableRounded sx={{ color: "primary.main", fontSize: 18 }} />
                      <Typography variant="overline" color="primary.main">
                        Tech Event Network
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={900} lineHeight={1.12}>
                      {textOption}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                      Discover meetups, workshops, launches, and community sessions built for developers, founders, and technical teams.
                    </Typography>
                  </Box>
                  {!isGuest && (
                    <Button
                      disableElevation
                      variant="contained"
                      onClick={() => setTextOption("Create Events")}
                      startIcon={<Add />}
                      sx={{ minWidth: { xs: "100%", sm: 154, md: 138 } }}
                    >
                      Create Event
                    </Button>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {eventMetrics.map(([label, value, helper]) => (
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
                {eventQuickModes.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                    {eventQuickModes.map((mode) => (
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
                    mt: 2,
                  }}
                >
                  {eventGuidance.map(([title, copy]) => (
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

              <React.Fragment>
                {/* all jobs and verified jobs and Nearby that have no external link */}
                {(textOption === "Explore Events" ||
                  textOption === "Nearby Events" ||
                  textOption === "Create Events" ||
                  textOption === "AI Selection" ||
                  textOption === "RSVP Events"||
                  textOption === "Events Manager" ||
                  textOption === "Search Events") && (
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
                        {eventsData?.length > 0 && !isEventsStats &&
                          eventsData?.map((event,index) => (
                          
                            <Box
                              key={event?._id}
                              sx={{
                                width: "100%",
                                minWidth: 0,
                              }}
                            >
                              <EventItem 
                              isLastIndex={index===eventsData?.length-1}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              event={event}
                              eventsData={eventsData}
                              isDarkMode={isDarkMode}
                              setErrorMessage={setErrorMessage}
                              isEventsManager={textOption==="Events Manager"}
                              isRSVP={textOption === "RSVP Events"}
                              setIsEventsStats={setIsEventsStats}
                              setFocusedEvent={setFocusedEvent}
                              canLoadMore={textOption === "Explore Events" && !window.location.href?.includes("?")}
                              />
                            </Box>
                           
                          ))}

                          {/* rendered if events stats is true */}
                          {isEventsStats && focusedEvent && (
                           <Box sx={{ gridColumn: "1 / -1" }}>
                            <EventStatsLayout 
                            setIsEventsStats={setIsEventsStats}
                            focusedEvent={focusedEvent}/>
                           </Box>
                          )}

                          {/* rendered if are no events  */}
                          {eventsData?.length<1 && (
                            <Box 
                            minHeight={'70vh'}
                            display={'flex'}
                            justifyContent={'center'}
                            color={'text.secondary'}
                            flexDirection={'column'}
                            gap={2}
                            alignItems={'center'}
                            sx={{
                              gridColumn: "1 / -1",
                              borderRadius: "8px",
                              border: "1px solid rgba(255,255,255,0.08)",
                              background: "rgba(255,255,255,0.035)",
                            }}
                            >
                            {/* no events */}
                            <Typography variant="body1" fontWeight={800}>
                              No events found
                            </Typography>
                            <Typography variant="caption" color="text.secondary" textAlign="center">
                              This event view has no published sessions yet.
                            </Typography>
                            {/* show refresh button */}
                            <Button 
                            disableElevation
                            onClick={handleRefreshData}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius:3 }}
                            startIcon={<Refresh/>}
                            >refresh</Button>
                            </Box>
                          )}

                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            </Box>
          </Box>

           {/* open modal event */}
            {openModalEvent && 
            <EventsAddModal
            openModalEventAdd={openModalEvent}
            setOpenModalEventAdd={setOpenModalEvent}
            />}


            {/* holds the notification and messaging drawer */}
            {isOpenMessageDrawer && (
            <ParentNotifMessageDrawer />
            )}

           {/* holds the profile drawer which contains user account info */}
           {isOpenDrawerProfile && (
             <ProfileDrawer />
           )}

          {/* show job search for event alert */}
          {openAlert && (
             <AlertJobSearch
             openAlert={openAlert}
             setOpenAlert={setOpenAlert}
             isFullView={true}
             isEventSearch={true}
           />
          )}
          {/* alert general of the error message */}
          {errorMessage && (
            <AlertGeneral 
            title={'something went wrong!'}
            message={errorMessage}
            isError={true}
            openAlertGeneral={errorMessage}
            setErrorMessage={setErrorMessage}
            defaultIcon={<InfoRounded/>}
            />
          )}
         
          {/* show success snackbar when redux snack state is updated */}
          {messageSnack && <SnackBarSuccess message={messageSnack} />}
        </Box>
      </Suspense>
  );
}
