import {
  AutoAwesomeOutlined,
  DarkModeRounded,
  HighlightOffOutlined,
  InfoRounded,
  LocalLibraryOutlined,
  ManageSearchOutlined,
  Menu,
  PictureAsPdfOutlined,
  PrintRounded,
  Refresh,
  SchoolOutlined,
  SupportAgentRounded,
  VideoLibraryOutlined,
  WavesOutlined
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
import React, { Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
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
import CertificatesTable from "./layout/CertificatesTable";
import CourseLayout from "./layout/CourseLayout";
import CoursePlayer from "./layout/CoursePlayer";
  
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


    
  export default function CoursesMainContainer() {
    const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
    const [generalTitle,setGeneralTitle]=useState("")
    const [messageGeneral,setMessageGeneral]=useState("")
    const [focusedCourse,setFocusedCourse]=useState(null)
    const [isCert,setIsCert]=useState(false)
    const [certData,setCertData]=useState(null)

    // redux states
    const {  
      isDefaultSpeedDial, 
      isJobSearchGlobal,
      isSidebarRighbar,
      isOpenDrawerProfile,
      isOpenMessageDrawer,
      currentMode
     } = useSelector(
      (state) => state.appUI
    );

    const isDarkMode=currentMode==='dark'

    // array for simulation of courses
    const { user } = useSelector((state) => state.currentUser);
    const {courses}=useSelector((state)=>state.currentCourses);

    const { messageSnack } = useSelector((state) => state.currentSnackBar);
    const theme = useTheme();
   
    // smartphones and below
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
    
    const navigate=useNavigate()
      const dispatch = useDispatch();
  
    const [textOption, setTextOption] = useState(
      isJobSearchGlobal ? "Course Search" : "Explore Courses"
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
  
  
       // UI theme dark light tweaking effect
      const handleShowDarkMode = () => {
        // update the redux theme boolean state
        dispatch(resetDarkMode());
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
    


    // fetch courses on launch
    useLayoutEffect(() => {
      // set is certificate to false default
      setIsCert(false)

      // search query was global thus, no pop-up and prevent
      // data overriding from search refetch
      if (isJobSearchGlobal) {
        setOpenAlert(false)
        return
      }
        // show search courses alert when its the one focused
        if (textOption === "Course Search") {
          setOpenAlert(true);
          return;
        }
    
        // set is fetching to true
        setIsFetching(true);
    
        // fetch all courses, governed by pagination of 12 each fetch
        if (textOption === "Explore Courses") {
    
          axios
            .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/${user?._id}`, {
              withCredentials: true,
            })
            .then((res) => {
              // update the redux of current events
              if (res?.data) {
                dispatch(updateCurrentCourses(res.data))
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
            });
        }
    
        // performing post request for popular courses
        if (textOption === "Popular Courses") {
          axios.post(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/popular/`,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update the redux of current post
              if (res?.data) {
                dispatch(updateCurrentCourses(res.data));
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
                  "server unreachable!"
                );
                return;
              }
              setErrorMessage(err?.response.data);
            })
            .finally(() => {
              setIsFetching(false);
            });
        }

      
    
        // handle getting of the recommended courses
        if (textOption === "AI Selection") {
    
          const userSkills=user?.selectedSkills
          
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/recommended/${user?._id}`,
              userSkills ,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update the redux of current events
              if (res?.data) {
                dispatch(updateCurrentCourses(res.data));
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
            });
    
        }

                
       // get all pdf resources on courses
      if (textOption === "PDF Resources" ) {
    
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/pdf/resources}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            // update the redux of current events
            if (res?.data) {
              dispatch(updateCurrentCourses(res.data));
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
          });
    
      }
    
      // fetch enrolled courses only
      if (textOption==="Enrolled Courses") {
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/enrolled/${user?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            // update the redux of current events
            if (res?.data) {
              dispatch(updateCurrentCourses(res.data));
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
          });
      }


      // courses enrolled fetching
      if (textOption==="My Certifications") {
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/certs/${user?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res?.data) {
              // populate cert data
              setCertData(res.data)

              // true certificate
              setIsCert(true)
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
          });
      }

      }, [dispatch, textOption, user,isJobSearchGlobal]);



      // handle navigate to instructor page
      const handleNavigateInstructor=()=>{
          // set is fetching true
          setIsFetching(true)
      
          axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/instructor/${user?._id}`, {
                    withCredentials: true,
                  })
                  .then((res) => {
                    // if the length is greater than 0 then navigate hiring pane since 
                    // are jobs user posted
                    if (res?.data?.length>0) {
                      navigate("/courses/instructor")
                    } else{
                      // don't navigate alert you have not posted any jobs
                      setGeneralTitle("Metatron Instructor Page")
                      setMessageGeneral("You have not posted any courses yet, upload your course and the page will be ready!")
                      setOpenAlertGeneral(true)
                    }
                  })
                  .catch(async (err) => {
                      console.log(err)

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

  
    return (
        <Suspense
          fallback={
            <Box 
            maxHeight={"88vh"} 
            display={"flex"} 
            justifyContent={"center"}>
              <Box display={"flex"} justifyContent={"center"}>
                <CircularProgress size={20} />
              </Box>
            </Box>
          }
        >
          <Box
          maxHeight={'85vh'} 
          display={"flex"} 
          width={window.screen.availWidth-18}
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
              {/* title */}
              <Typography variant="body2" 
              sx={{color:'white'}} 
              fontWeight={'bold'}
              textTransform={'uppercase'}
              display={'flex'}
              alignItems={'center'}
              gap={0.3}
              mb={1}
              >
                <LocalLibraryOutlined/>
                Tech Student
               </Typography>

               {/* user name */}
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
                  "Explore Courses",
                  "Course Search",
                 // "Popular Courses",
                  "AI Selection",
                  //"PDF Resources",
                  "Enrolled Courses",
                  "My Certifications",
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
                            sx={{width:24,height:24}}
                          />
                        ) : index === 10 ? (
                          <WavesOutlined
                            color={text === textOption ? "primary" : "inherit"}
                            sx={{width:20,height:20}}
                          />
                        ) :index===2 ? (
                          <AutoAwesomeOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{width:26,height:26}}
                        />
                          
                        ):index===11 ? (
                          <PictureAsPdfOutlined
                          color={text === textOption ? "primary" : "inherit"}
                        />) :index===3 ? (
                          <VideoLibraryOutlined
                          color={text === textOption ? "primary" : "inherit"}
                        />): (
                          <PrintRounded 
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
  
            {/* navigates to instructor page */}
           {open ? (
             <Box 
             width={'100%'}
             display={'flex'} 
             justifyContent={'center'}>
                <Button 
                size="small" 
                startIcon={<SupportAgentRounded/>}
                color="secondary"
                disableElevation
                sx={{my:1, px:1,
                 borderRadius:5,
                  width:'90%',
                  fontWeight:'bold', 
                  border:'1px solid', 
                  borderColor:'divider'}}
                onClick={handleNavigateInstructor}>
                 I'M Instructor
                </Button>
                </Box>
           ):(
              <ListItemButton size="small" >
                <Tooltip title={"Instructor Page"} arrow>
                <ListItemIcon 
                onClick={handleNavigateInstructor}>
                <SupportAgentRounded 
                color="secondary" 
                sx={{width:24,height:24}}/>
                </ListItemIcon>
                </Tooltip>
              </ListItemButton>
          )}

  
        </Drawer>
        <Box 
        height={'88vh'} 
        width={"100%"}
        display={"flex"}
          justifyContent={"center"}
          >
        
            <Box
              p={2}
              display={"flex"}
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
                  {(textOption === "Explore Courses" ||
                    textOption === "Course Search" ||
                    //textOption === "Popular Courses" ||
                    textOption === "AI Selection" ||
                    textOption === "Enrolled Courses"||
                    textOption === "My Certifications") && (
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

                      {!isCert  ? (
                      <>
                      {/* focused course */}
                      {focusedCourse && (
                        <CoursePlayer 
                        openPlayer={focusedCourse}
                        course={focusedCourse}
                        setText={setTextOption}
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
                        <>
                        {/* certs table */}
                        {isCert && (
                          <CertificatesTable  
                            certsData={certData}
                          />
                        )}
                        </>
                      )}

                        
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              </Box>
              </Box>
           
  
            {/* open alert general for no courses */}
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
              isCourseSearch={true}
            />
            )}
          
          {/* alert error message */}
          {errorMessage && (
              <AlertGeneral openAlertGeneral={errorMessage} 
              title={'something went wrong'}
              setErrorMessage={setErrorMessage}
              message={messageGeneral}
              defaultIcon={<InfoRounded/>}
              isError={true}
              />
          )}
  
            {/* show success snackbar when redux snack state is updated */}
            {messageSnack && <SnackBarSuccess message={messageSnack} />}
          </Box>
        </Suspense>
    );
  }
  