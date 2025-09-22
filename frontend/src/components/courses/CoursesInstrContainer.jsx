import {
  HighlightOffOutlined,
  InfoRounded,
  Menu,
  NotificationsRounded,
  Refresh,
  Settings,
  SupportAgentRounded,
  UploadFileRounded
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
import React, { Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  showMessagingDrawer,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentCourses } from "../../redux/CurrentCourses";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CourseLayout from "./layout/CourseLayout";
import CoursePlayer from "./layout/CoursePlayer";
import ManageCoursesTable from "./layout/ManageCoursesTable";
  
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
    const [focusedCourse,setFocusedCourse]=useState(null)
    const [isCourseManager,setIsCourseManager]=useState(false)
    
    // redux states
    const { 
      currentMode, 
      isDefaultSpeedDial, 
      isSidebarRighbar,
      isOpenDrawerProfile,
      isOpenMessageDrawer
     } = useSelector(
      (state) => state.appUI
    );

    // update is dark const
  const isDarkMode=currentMode==='dark'
  
  
    const { user } = useSelector((state) => state.currentUser);
    const { post_reactions } = useSelector((state) => state.currentPostReactions);
    const { reportedPost } = useSelector((state) => state.currentReportedPost);
    const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
    const { profile_views } = useSelector((state) => state.currentProfileView);
    const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
    const {courses}=useSelector((state)=>state.currentCourses);
    
  
  
    const { messageSnack } = useSelector((state) => state.currentSnackBar);
    const theme = useTheme();
      // trigger redux update
      const dispatch = useDispatch();
    
    const navigate=useNavigate()
      // smartphones and below
        const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
    const [textOption, setTextOption] = useState("Uploaded Courses");
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
       // true tem, and the redux will reverse
        dispatch(handleSidebarRightbar(true));
    },[dispatch,isSidebarRighbar])
    
    
    // navigate back to student courses
    const handleNavigateAvailableCourses=()=>{
        navigate("/courses/available")
    }


    useLayoutEffect(()=>{
        // set is fetching true
          setIsFetching(true)
          setIsCourseManager(false)

          if (textOption==="Manage Courses") {
            setIsCourseManager(true)
            setIsFetching(false)
            return
          }

          if(textOption==="Uploaded Courses"){
            axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/instructor/${user?._id}`, {
                    withCredentials: true,
                  })
                  .then((res) => {
                    // update the redux with the current jobs
                  dispatch(updateCurrentCourses(res.data))
                  })
                  .catch(async (err) => {
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
    },[dispatch,user?._id,textOption])
    
  
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
                    fontWeight={'bold'}
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    ml={open && 22}
                  >
                    Metatron Courses
                  </Typography>
  
                  {/* current navigation counter */}
                 <Box display={"flex"} justifyContent={"center"}>
                    <Typography 
                    variant="caption" 
                    fontWeight={'bold'}
                    textTransform={'capitalize'}
                     ml={open && 22}>
                      - {textOption} -
                    </Typography>
                  </Box>
                </Box>
  
                <Box display={'flex'} gap={2} alignItems={'center'} justifyContent={'flex-end'}>
          
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
              fontWeight={'bold'}
              gap={1}
              >
              <SupportAgentRounded/>
              Instructor
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
                  "Uploaded Courses",
                  "Manage Courses",
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
                          <UploadFileRounded
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:25,height:25}}
                          />
                        ) :  (
                          <Settings
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:25,height:25}}
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
                  {(textOption === "Uploaded Courses" ||
                    textOption === "Manage Courses") && (
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
                        {!isCourseManager ? (
                          <>
                            {/* focused course */}
                          {focusedCourse && (
                            <CoursePlayer 
                            openPlayer={focusedCourse}
                            course={focusedCourse}
                            setFocusedCourse={setFocusedCourse}
                            />
                          )} 

                        {/* content will go here */}
                        {courses?.length>0 && !focusedCourse && courses?.map((course)=>(
                          <CourseLayout 
                          key={course?._id} 
                          isDarkMode={isDarkMode}
                          courseItem={course}
                          setFocusedCourse={setFocusedCourse}
                          />
                        ))}

                      {/* rendered if are no events  */}
                        {courses?.length<1 && (
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
                            no more courses posted
                          </Typography>
                          {/* show refresh button */}
                          <Button 
                          disableElevation
                          onClick={()=>setTextOption("Explore Courses")}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius:3 }}
                          startIcon={<Refresh/>}
                          >refresh</Button>
                          </Box>
                        )}
                          </>
                        ):(
                          <ManageCoursesTable 
                            coursesData={courses}
                            setCourseManager={setIsCourseManager}
                            setTextOption={setTextOption}
                          />
                        )}
                        
                          
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
  