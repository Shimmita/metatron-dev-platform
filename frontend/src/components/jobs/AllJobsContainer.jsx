import {
  AutoAwesome,
  BarChartRounded,
  CloudDoneRounded,
  DarkModeRounded,
  DocumentScannerRounded,
  FindInPageRounded,
  HighlightOffOutlined,
  InfoRounded,
  Menu,
  MyLocationRounded,
  Person,
  Refresh,
  TravelExploreRounded,
  VerifiedRounded,
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
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
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
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
  const [generalTitle,setGeneralTitle]=useState("")
  const [messageGeneral,setMessageGeneral]=useState("")
  const [pageNumber,setPageNumber]=useState(-1)
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
  const { user,isGuest } = useSelector((state) => state.currentUser);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);
  const theme = useTheme();
  
    // trigger redux update
    const dispatch = useDispatch();

  // smartphones and below
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const[isMyStats,setIsMyStats]=useState(false)

  const navigate=useNavigate()

  const [textOption, setTextOption] = useState(
    isJobSearchGlobal ? "Search Jobs" : "Explore Jobs"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false:true);
  const [open, setOpen] = useState(
    !(CustomDeviceIsSmall() || CustomDeviceTablet()||isGuest) 
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
  useLayoutEffect(()=>{
     // true tem, and the redux will reverse
    dispatch(handleSidebarRightbar(true));

  },[dispatch,isSidebarRighbar])
  

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
    if (isJobSearchGlobal) {
      // increase page number for bypassing similar jobs in the array of next fetch
      setPageNumber(prev=>prev+1)
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
    const country = user?.country?.split(" ")[1]||"";

    // set is fetching to true
    setIsFetching(true);

    // fetch all jobs if the request is so
    if (textOption === "Explore Jobs") {

        // get the full pathname
        const pathName=window.location.href
        // init job id

        let jobId=""

        // check existence of query
        if (pathName?.includes("?")) {
          jobId=pathName?.split("?")[1]?.split("=")[1]

          // axios query
          axios
            .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/specific/${user?._id}/${jobId}`, {
              withCredentials: true,
            }).then(res=>
              dispatch(updateCurrentJobs(res.data))
            ).catch(err=>{
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
        }else {

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
        setPageNumber((prev)=>prev+1)

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

      const userSkills=user?.selectedSkills
      
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/recommended/${user?._id}`,
          userSkills ,
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

  }, [dispatch, textOption, user, isJobSearchGlobal]);



   // handle navigation to hiring pane if the user has jobs he/she posted
  // as the recruiter
  const handleNavigateHiring=()=>{
    // set is fetching true
    setIsFetching(true)

     axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/posted/${user?.email}`, {
              withCredentials: true,
            })
            .then((res) => {
              // if the length is greater than 0 then navigate hiring pane since 
              // are jobs user posted
              if (res?.data?.length>0) {
                navigate('/jobs/hiring')
              } else{
                // don't navigate alert you have not posted any jobs
                setGeneralTitle("Metatron H.R")
                setMessageGeneral("seems you have not posted any jobs for evaluation. post and the system will help you in assessment!")
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
    const handleRefreshData=()=>{
      // set text to default explore events
      setTextOption('Explore Jobs')
    }

       // handle navigate to login
    const handleNavigateLogin=()=>{
      navigate("/auth/login")
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
              ):(
                <Box width={"100%"}>
                <Typography
                  noWrap
                  component="div"
                  textAlign={"center"}
                  fontWeight={'bold'}
                  textTransform={"uppercase"}
                  
                  ml={open ? 30: 24}
                >
                  Metatron Jobs
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
                  <IconButton  
                  onClick={handleShowDarkMode}> 
                    <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
                    <DarkModeRounded
                      sx={{ color: "white", height:24, width:24,}}
                    />
                  </Tooltip> 
                  </IconButton>
  
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
                  Job Applicant
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
                "Explore Jobs",
                "AI Selection",
                "Search Jobs",
                "Verified Jobs",
                "External Jobs",
                "Nearby Jobs",
                "Applications",
                "My Statistics",
              ].map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{ display: isGuest ? 'none':'block' }}
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
                      ) : index === 2 ? (
                        <FindInPageRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 3 ? (
                        <VerifiedRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) : index === 4 ? (
                        <TravelExploreRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ): index === 5 ? (
                        <MyLocationRounded
                          color={text === textOption ? "primary" : "inherit"}
                        />
                      ) 
                      : index === 1 ? (
                        <AutoAwesome
                        color={text === textOption ? "primary" : "inherit"}
                      />
                      
                      ) :index===6 ? (
                        <CloudDoneRounded
                        color={text === textOption ? "primary" : "inherit"}
                      />
                        
                      ):(
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
            {!isGuest && (
              <React.Fragment>
              {open ? (
              <Box 
              display={'flex'} 
              justifyContent={'center'}>
              {/* hiring section */}
            <Button 
            size="small" 
            startIcon={<DocumentScannerRounded/>}
            color="secondary"
            disableElevation
            sx={{my:1, px:1, borderRadius:5, fontWeight:'bold', border:'1px solid', borderColor:'divider'}}
            onClick={handleNavigateHiring}>
            Metatron H.R
            </Button>
              </Box>
            ):(
              <ListItemButton size="small" >
              <Tooltip title={"Metatron H.R"} arrow>
              <ListItemIcon onClick={handleNavigateHiring}>
              <DocumentScannerRounded color="secondary" sx={{width:24,height:24}}/>
              </ListItemIcon>
              </Tooltip>
            </ListItemButton>
            )}
                        
             {/* divider */}
            <Divider component={'div'} className={'p-1'}/>
              </React.Fragment>
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
                  textOption === "AI Selection" ||
                  textOption === "Applications"||
                  textOption === "My Statistics" ||
                  textOption === "External Jobs" ||
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
                        {jobs?.length > 0 &&
                          jobs?.map((job,index) => (
                            <>
                              {/* if is stats displays different layout else job layout */}
                              {isMyStats ? (
                                <JobStatsLayout
                                key={job?._id}
                                isDarkMode={isDarkMode}
                                job={job}
                                user={user}
                              />
                              ):(
                                <Box 
                                key={job?._id}>
                                <JobLayout
                                isLastIndex={index===jobs?.length-1}
                                pageNumber={pageNumber}
                                setPageNumber={setPageNumber}
                                isDarkMode={isDarkMode}
                                job={job}
                                jobs={jobs}
                                setErrorMessage={setErrorMessage}
                                isJobSearchGlobal={isJobSearchGlobal}
                              />
                              </Box>
                              )}
                          
                            </>
                          ))}

                           {/* rendered if are no jobs  */}
                          {jobs?.length<1 && (
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
          {/* alert general of the error message */}
          {errorMessage && (
            <AlertGeneral 
            title={'something went wrong!'}
            message={errorMessage}
            isError={true}
            openAlertGeneral={errorMessage}
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
