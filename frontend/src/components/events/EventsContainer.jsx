import {
  Add,
  AutoAwesome,
  CheckCircle,
  DarkModeRounded,
  FindInPageRounded,
  HighlightOffOutlined,
  InfoRounded,
  Menu,
  MyLocationRounded,
  Refresh,
  Settings,
  WorkRounded
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AppBar,
  Avatar,
  Button,
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
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import EventsAddModal from "../modal/EventsAddModal";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import EventItem from "./layout/EventItem";
import EventStatsLayout from "./layout/EventStatsLayout";

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




export default function EventsContainer() {
  const [openModalEvent,setOpenModalEvent]=useState(false)
  const [isEventsStats,setIsEventsStats]=useState(false)
  const [focusedEvent,setFocusedEvent]=useState(null)
  const [pageNumber,setPageNumber]=useState(1)
  
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

  const { user } = useSelector((state) => state.currentUser);
  const { events:eventsData } = useSelector((state) => state.currentEvents);


  const { messageSnack } = useSelector((state) => state.currentSnackBar);
  const theme = useTheme();

    // trigger redux update
    const dispatch = useDispatch();
  // smartphones and below
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const[isMyStats,setIsMyStats]=useState(false)

  const [textOption, setTextOption] = useState(
    isJobSearchGlobal ? "Search Events" : "Explore Events"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false:true);
  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet()) && true
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
    // don't fetch any if isJob-search-events global to avoid overriding  data
    if (isJobSearchGlobal) {
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
    const country = user.country.split(" ")[1];

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "Explore Events") {

      axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all`, {
          withCredentials: true,
        })
        .then((res) => {
          // update the redux of current events
          if (res?.data) {
            dispatch(updateCurrentEvents(res.data))
          } 
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
          if (err?.response?.data.login) {
            window.location.reload();
          }
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage(
              "server unreachable!"
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

  }, [dispatch, textOption, user, isJobSearchGlobal]);


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
        display={"flex"} 
        maxHeight={'85vh'}
         sx={{
          width:isMyStats ? window.screen.availWidth-32:undefined,
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
          <AppBar position="fixed" open={open}>
            <Toolbar
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1.5,
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
                  textTransform={"uppercase"}
                >
                  Metatron
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography 
                  variant="caption"
                   textTransform={'capitalize'}
                   >
                    {textOption} 
                  </Typography>
                </Box>
              </Box>
              ):(
                <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  fontWeight={'bold'}
                  textAlign={"center"}
                  textTransform={"uppercase"}
                  
                  ml={open ? 30: 24}
                >
                  Metatron Events
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography 
                  variant="caption"
                  fontWeight={'bold'}
                  textTransform={'capitalize'}
                  ml={open ? 30: 24}>
                    - {textOption} -
                  </Typography>
                </Box>
              </Box>
              )}
              <Box 
              display={'flex'}
                gap={2} 
                alignItems={'center'} 
                justifyContent={'flex-end'}>
              

                {/* dark mode */}
                <IconButton  
                onClick={handleShowDarkMode}> 
                  <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
                  <DarkModeRounded
                
                    sx={{ color: "white", height:24, width:24,}}
                  />
                </Tooltip> 
                </IconButton>


              {/* profile */}
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
                backgroundColor:isDarkMode ? '#272727' :"#1976D2"
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
               {theme.direction === "rtl" ? (
                 <ChevronRightIcon  sx={{ color:'white' }}/>
               ) : (
                 <ChevronLeftIcon sx={{ color:'white' }} />
               )}
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
              - {user?.name} -
              </Typography>
              </Box>

           </Box>
              )}
            </DrawerHeader>
            <Divider className=" w-100" component={"div"} />

            {/* show hide drawer visibility when drawer is not expanded */}
            {!open && (
              <Stack justifyContent={"center"} mt={1}>
                {/* hide drawer visibility */}
                <ListItemButton size="small" onClick={handleShowDrawerPane}>
                  <ListItemIcon>
                  <HighlightOffOutlined sx={{width:24,height:24}}/>
                  </ListItemIcon>
                </ListItemButton>
              </Stack>
            )}

            <List>
              {[
                "Explore Events",
                "Search Events",
                "Create Events",
                "Nearby Events",
                "AI Selection",
                "RSVP Events",
                "Events Manager",
              ].map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{ display: "block" }}
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
                   <Divider component={"li"} />
                </ListItem>
              ))}
            </List>


          </Drawer>
             <Box 
        height={'88vh'} 
        width={"100%"}
        display={"flex"}
          justifyContent={"center"}
          >
         
            <Box
              display={"flex"}
              mt={!CustomDeviceIsSmall() ? 1:undefined}
              gap={2}
              maxHeight={CustomDeviceIsSmall() || CustomDeviceTablet() ?"88vh":"80vh"}
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
                              mt={CustomDeviceIsSmall() && 2} 
                              key={event?._id}>
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
                              />
                            </Box>
                           
                          ))}

                          {/* rendered if events stats is true */}
                          {isEventsStats && focusedEvent && (
                           <Box>
                            <EventStatsLayout 
                            setIsEventsStats={setIsEventsStats}
                            focusedEvent={focusedEvent}/>
                           </Box>
                          )}

                          {/* rendered if are no events  */}
                          {eventsData?.length<1 && (
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
                              no more events posted
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
