import {
  Add,
  BarChartRounded,
  HighlightOffOutlined,
  InfoRounded,
  LibraryBooksRounded,
  ListRounded,
  Menu,
  NotificationsRounded,
  SearchOutlined,
  SettingsRounded,
  WorkRounded
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  InputBase,
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
import React, { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  showMessagingDrawer,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import PostJobModal from "../modal/PostJobModal";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import ApplicantsTable from "./layout/ApplicantsTable";
import JobLayoutHiring from "./layout/JobLayoutHiring";
import JobStatsLayout from "./layout/JobStatsLayouts";
import ManageJobsTable from "./layout/ManageJobsTable";
import AlertGeneral from "../alerts/AlertGeneral";

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


// search bar option
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));


export default function AllJobsHiringManager() {
    // track axios progress
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openJobPostModal,setOpenJobPostModal]=useState(false)
    const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
    

  // track theme
  const theme = useTheme();

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
  const isDarkMode=currentMode==='dark'

  const { jobs } = useSelector((state) => state.currentJobs);
  const { user } = useSelector((state) => state.currentUser);
  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { reportedPost } = useSelector((state) => state.currentReportedPost);
  const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
  const { profile_views } = useSelector((state) => state.currentProfileView);
  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);

  const { messageSnack } = useSelector((state) => state.currentSnackBar);

  // trigger redux update
  const dispatch = useDispatch();

  // statistics tracker
  const[isMyStats,setIsMyStats]=useState(false)

  // job application table
  const[isApplicantsTable,setIsApplicantsTable]=useState(false)

  // manage jobs posted
  const[isManageJobsTable,setIsManageJobsTable]=useState(false)

  // selected option
  const [textOption, setTextOption] = useState(
    isJobSearchGlobal ? "Search Jobs" : "Your Jobs"
  );

  // false right bar is no of use this route
  useLayoutEffect(()=>{
     // updating right bar show false
     if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  },[dispatch,isSidebarRighbar])
  

  // holds drawer status
  const [isDrawerPane, setIsDrawerPane] = useState(true);
  
  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet()) &&  true
  );

  // focused job for assessment and fetch prospective applicants
  const[focusedJob,setFocusedJob]=useState({})

  // navigate to other routes
  const navigate=useNavigate()


   // show the notification and messaging triggered by redux
    const handleShowMessageDrawer = () => {
      dispatch(showMessagingDrawer());
    };

   // handle navigation to hiring pane
   const handleNavigateJobSeeker=()=>{
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
    useLayoutEffect(()=>{
       // updating right bar show false
       if (isSidebarRighbar) {
        dispatch(handleSidebarRightbar());
      }
    },[dispatch,isSidebarRighbar])

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
      if (textOption === "Create Jobs") {
        setOpenJobPostModal(true)
        return
      }

      // show the manage jobs table
      if (textOption==="Manage Jobs") {
        setIsManageJobsTable(true)
        return
      }
  

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "Your Jobs" || textOption === "Assess Jobs") {

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

    // fetch all jobs that have been verified
    if (textOption === "Assess applicants") {


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
              "server unreachable"
            );
            return;
          }
          setErrorMessage(err?.response.data);
          setOpenAlertGeneral(true)

        })
        .finally(() => {
          setIsFetching(false);
          // false myStats
          setIsMyStats(false)
        });
    }


  }, [dispatch, textOption, user, isJobSearchGlobal]);


  // handle display of the drawer pane
  const handleShowDrawerPane = () => {
    setIsDrawerPane((prev) => !prev);
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
        height={(CustomLandScape()|| CustomLandscapeWidest()) ?"86vh":"90vh"}
         display={"flex"} 
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
              <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  textAlign={"center"}
                  textTransform={"uppercase"}
                  ml={open && 22}
                  
                >
                  Metatron Jobs
                </Typography>

                {/* current navigation counter */}
                <Box display={"flex"} justifyContent={"center"} >
                  <Typography
                   variant="caption" 
                   textTransform={'capitalize'}
                   ml={open && 22}>
                    - {textOption} -
                  </Typography>
                </Box>
              </Box>

              <Box display={'flex'}
               gap={2}
                alignItems={'center'} 
                justifyContent={'flex-end'}>

              {/* displayed on tabs and big screens */}
              {!CustomDeviceIsSmall() && (
                  <Search>
                  <SearchIconWrapper>
                    <SearchOutlined />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              )}

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
                  alignItems={'center'}
                  >
                  {/* title hiring */}
                  <Typography variant="body2" 
                  sx={{color:'white'}} 
                  mb={1}
                  textTransform={'uppercase'}>
                    hiring Manager
                  </Typography>
                  {/* name of the current user */}
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
                <Tooltip title={'close'} arrow>
                <ListItemButton size="small" onClick={handleShowDrawerPane}>
                  <ListItemIcon>
                  <HighlightOffOutlined sx={{width:24,height:24}}/>
                  </ListItemIcon>
                </ListItemButton>
                </Tooltip>
              </Stack>
            )}
         
            {/* job seeker options */}
            <List>
              {[
                "Your Jobs",
                "Assess Jobs",
                "Create Jobs",
                "Manage Jobs",
                "Job Statistics",
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
                        <ListRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 2 ? (
                        <Add
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 3 ? (
                        <SettingsRounded
                        color={text === textOption ? "primary" : "inherit"}
                      />
                       
                      ) : (
                        <BarChartRounded
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
          
            {/* divider */}
            <Divider component={'div'} className={'p-1'}/>
            {open ? (
              <>
              {/* hiring section */}
            <Button size="small" sx={{mt:1}} onClick={handleNavigateJobSeeker}> jobseeker </Button>
              </>
            ):(
              <ListItemButton size="small" onClick={handleNavigateJobSeeker}>
              <Tooltip title={"i'm hiring"} arrow>
              <ListItemIcon>
              <LibraryBooksRounded sx={{width:24,height:24}}/>
              </ListItemIcon>
              </Tooltip>
            </ListItemButton>
            )}
         
             {/* divider */}
             <Divider component={'div'} className={'p-1'}/>

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

                {/* if is applicants table vs jobs layout */}
                {isApplicantsTable ? (
                  <ApplicantsTable setIsApplicantsTable={setIsApplicantsTable} focusedJob={focusedJob} />
                ):isManageJobsTable ? (
                  <ManageJobsTable setIsManageJobsTable={setIsManageJobsTable} MyPostedJobs={jobs}/>
                ) :(
                  <React.Fragment>
                  {/* all jobs and verified jobs and Nearby that have no external link */}
                {(textOption === "Your Jobs" ||
                  textOption === "Assess Jobs" ||
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
                              ):(
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
            defaultIcon={<InfoRounded/>}
            />
          )}
  
          {/* show success snackbar when redux snack state is updated */}
          {messageSnack && <SnackBarSuccess message={messageSnack} />}
        </Box>
      </Suspense>
  );
}
