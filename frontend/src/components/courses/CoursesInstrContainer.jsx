import {
  BarChartRounded,
  DarkModeRounded,
  FavoriteOutlined,
  FiberNewOutlined,
  FlagOutlined,
  HighlightOffOutlined,
  InfoRounded,
  LocalLibraryOutlined,
  ManageAccountsOutlined,
  ManageSearchOutlined,
  Menu,
  MoneyOffOutlined,
  NotificationsRounded,
  SchoolOutlined,
  SubscriptionsOutlined,
  WavesOutlined
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Stack,
  Toolbar,
  Tooltip
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
import React, { Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from '../../images/dev.jpeg';
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showMessagingDrawer,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
  
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
  
  
  export default function CoursesInstrContainer() {
    const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
    const [generalTitle,setGeneralTitle]=useState("")
    const [messageGeneral,setMessageGeneral]=useState("")
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

    // update is dark const
  const isDarkMode=currentMode==='dark'
  
  
    const { jobs } = useSelector((state) => state.currentJobs);
    const { user } = useSelector((state) => state.currentUser);
    const { post_reactions } = useSelector((state) => state.currentPostReactions);
    const { reportedPost } = useSelector((state) => state.currentReportedPost);
    const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
    const { profile_views } = useSelector((state) => state.currentProfileView);
    const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
  
  
    const { messageSnack } = useSelector((state) => state.currentSnackBar);
    const theme = useTheme();
      // trigger redux update
      const dispatch = useDispatch();
  
    const[isMyStats,setIsMyStats]=useState(false)
  
    const navigate=useNavigate()
  
    const [textOption, setTextOption] = useState(
      isJobSearchGlobal ? "Search Jobs" : "Explore Jobs"
    );
    const [isDrawerPane, setIsDrawerPane] = useState(true);
    const [open, setOpen] = useState(
      !(CustomDeviceIsSmall() || CustomDeviceTablet()) && true
    );
   
  
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    // axios default credentials
    axios.defaults.withCredentials = true;
    
    const [openAlert, setOpenAlert] = useState(false);
  
     //   handle opening of drawer profile
     const handleShowingProfileDrawer = () => {
        dispatch(showUserProfileDrawer());
      };
  
       // handle display of the drawer pane
    const handleShowDrawerPane = () => {
      setIsDrawerPane((prev) => !prev);
    };
  
    // UI theme dark light tweaking effect
    const handleShowDarkMode = () => {
      // update the redux theme boolean state
      dispatch(resetDarkMode());
    };
    
  
    // show the notification and messaging triggered by redux
    const handleShowMessageDrawer = () => {
      dispatch(showMessagingDrawer());
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
       // updating right bar show false
       if (isSidebarRighbar) {
        dispatch(handleSidebarRightbar());
      }
    },[dispatch,isSidebarRighbar])
    
    
    // navigate back to student courses

    const handleNavigateAvailableCourses=()=>{
        navigate("/courses/available")
    }
    
  
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
          display={"flex"} 
          height={'85vh'}
           sx={{
            width:window.screen.availWidth-18,
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
                    textTransform={"uppercase"}
                    ml={open && 22}
                  >
                    Metatron Courses
                  </Typography>
  
                  {/* current navigation counter */}
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="caption" textTransform={'lowercase'} ml={open && 22}>
                      - {textOption} -
                    </Typography>
                  </Box>
                </Box>
  
                <Box display={'flex'} gap={2} alignItems={'center'} justifyContent={'flex-end'}>
                {/* alter theme */}
                <Box>
                  <IconButton onClick={handleShowDarkMode}>
                    <Tooltip arrow title={isDarkMode ? "Light" : "Dark"}>
                      <DarkModeRounded
                        sx={{ color:'white'}}
                      />
                    </Tooltip>
                  </IconButton>
                </Box>
  
  
                {/* notification and messaging */}
                <Badge badgeContent={post_reactions?.length + reportedPost?.length + connectNotifications?.length + profile_views?.length +job_feedback?.length } color="warning">
                  <Tooltip arrow title={"notifications"}>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={handleShowMessageDrawer}
                    >
                      <NotificationsRounded
                        sx={{ width: 25, height: 25, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Badge>
  
                {/* profile */}
                <Tooltip arrow title={"profile"}>
                  <IconButton onClick={handleShowingProfileDrawer}>
                  <Avatar
                      sx={{ width: 26, height: 26 }}
                      src={devImage}
                      alt={"user image"}
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
                  backgroundColor:isDarkMode ? "#272727":"#1976D2"
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

               <Typography variant="body2" 
               sx={{color:'white'}} 
               textTransform={'uppercase'}
               display={'flex'}
               alignItems={'center'}
               gap={1}
               >
                <LocalLibraryOutlined/>
                Student
               </Typography>
               <Typography variant="caption" 
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
                  "Explore Courses",
                  "Search Courses",
                  "Popular Courses",
                  "Recent Courses",
                  "Free Courses",
                  "Report Courses",
                  "Favorite Courses",
                  "Enrolled Courses",
                  "Student Manager",
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
                          <SchoolOutlined
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:25,height:25}}
                          />
                        ) : index === 1 ? (
                          <ManageSearchOutlined
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:25,height:25}}
                          />
                        ) : index === 2 ? (
                          <WavesOutlined
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:20,height:20}}
                          />
                        ) : index === 3 ? (
                          <FiberNewOutlined
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:26,height:26}}
                          />
                        ) : index === 4 ? (
                          <MoneyOffOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{width:24,height:24}}
                        />
                         
                        ) :index===5 ? (
                          <FlagOutlined
                          color={text === textOption ? "primary" : "inherit"}
                        />
                          
                        ):index===6 ? (
                          <FavoriteOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{width:21,height:21}}
                        />) :index===7 ? (
                          <SubscriptionsOutlined
                          color={text === textOption ? "primary" : "inherit"}
                        />) :(
                          <ManageAccountsOutlined
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
  
            {/* divider */}
            <Divider component={'div'} className={'p-1'}/>
            {/* navigates to instructor page */}
            {open && (
                <Button
                size="small" 
                sx={{mt:1,}} 
                onClick={handleNavigateAvailableCourses}>Courses Page</Button>
            )}
  
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
                  {(textOption === "Explore Jobs" ||
                    textOption === "Nearby Jobs" ||
                    textOption === "Verified Jobs" ||
                    textOption === "Recommend" ||
                    textOption === "Applications"||
                    textOption === "My Statistics" ||
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

                          {/* content will go here */}
                          
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              </Box>
            </Box>
  
            {/* open alert general for no jobs */}
            {openAlertGeneral && (
              <AlertGeneral openAlertGeneral={openAlertGeneral} 
              setOpenAlertGeneral={setOpenAlertGeneral}
              title={generalTitle}
              message={messageGeneral}
              defaultIcon={<InfoRounded/>}
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
  
            {/* show job search alert */}
            {openAlert && (
               <AlertJobSearch
               openAlert={openAlert}
               setOpenAlert={setOpenAlert}
               isFullView={true}
             />
            )}
           
  
            {/* show success snackbar when redux snack state is updated */}
            {messageSnack && <SnackBarSuccess message={messageSnack} />}
          </Box>
        </Suspense>
    );
  }
  