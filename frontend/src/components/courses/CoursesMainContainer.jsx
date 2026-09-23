import {
  AutoAwesomeOutlined,
  HomeRounded,
  InfoRounded,
  LocalLibraryOutlined,
  Menu,
  Person,
  PictureAsPdfOutlined,
  PrintRounded,
  Refresh,
  SchoolOutlined,
  SupportAgentRounded,
  VideoLibraryOutlined,
  WavesOutlined
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
import React, { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { updateCurrentCourses } from "../../redux/CurrentCourses";
import { appGradients } from "../../utils/colors";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertJobSearch from "../alerts/AlertJobSearch";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import PageSearchAction from "../navbar/PageSearchAction";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import SnackBarSuccess from "../snackbar/SnackBarSuccess";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CertificatesTable from "./layout/CertificatesTable";
import CourseLayout from "./layout/CourseLayout";
import CoursePlayer from "./layout/CoursePlayer";

const drawerWidth = CustomDeviceIsSmall() ? 200 : 250;
const COURSE_PAGE_SIZE = 12;
const appendUniqueById = (current = [], incoming = []) => {
  const seen = new Set(current.map((item) => item?._id).filter(Boolean));
  return [
    ...current,
    ...incoming.filter((item) => {
      if (!item?._id || seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    }),
  ];
};

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
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const [generalTitle, setGeneralTitle] = useState("")
  const [messageGeneral, setMessageGeneral] = useState("")
  const [focusedCourse, setFocusedCourse] = useState(null)
  const [isCert, setIsCert] = useState(false)
  const [certData, setCertData] = useState(null)
  const [pageNumber, setPageNumber] = useState(2)
  const [hasMoreCourses, setHasMoreCourses] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const courseInfiniteScrollRef = useRef(null)
  const lastRequestedPageRef = useRef(0)

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

  const isDarkMode = currentMode === 'dark'

  // array for simulation of courses
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { courses } = useSelector((state) => state.currentCourses);

  const { messageSnack } = useSelector((state) => state.currentSnackBar);
  const theme = useTheme();
  const panelRadius = `${theme.shape.borderRadius}px`;

  // smartphones and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [textOption, setTextOption] = useState(
    !isGuest && isJobSearchGlobal ? "Course Search" : "Explore Courses"
  );
  const [isDrawerPane, setIsDrawerPane] = useState(isMobile ? false : true);
  const [open, setOpen] = useState(!isMobile);

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
  useLayoutEffect(() => {
    // true tem, and the redux will reverse
    dispatch(handleSidebarRightbar(true));
  }, [dispatch, isSidebarRighbar])



  // fetch courses on launch
  useLayoutEffect(() => {
    // update bottom nav position
    dispatch(updateCurrentBottomNav(3))

    // set is certificate to false default
    setIsCert(false)

    // search query was global thus, no pop-up and prevent
    // data overriding from search refetch
    if (!isGuest && isJobSearchGlobal) {
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

      // get the full pathname
      const pathName = window.location.href
      // init job id

      let courseId = ""
      if (pathName?.includes("?")) {
        courseId = pathName?.split("?")[1]?.split("=")[1]

        // axios query
        axios
          .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/specific/${user?._id}/${courseId}`, {
            withCredentials: true,
          }).then(res =>
            dispatch(updateCurrentCourses(res.data))
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
          });
      }
      else {
        axios
          .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/${user?._id || "guest"}?page=1&limit=${COURSE_PAGE_SIZE}`, {
            withCredentials: true,
          })
          .then((res) => {
            // update the redux of current events
            if (res?.data) {
              dispatch(updateCurrentCourses(res.data))
              setPageNumber(2)
              setHasMoreCourses(res.data.length === COURSE_PAGE_SIZE)
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

      const userSkills = user?.selectedSkills

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/recommended/${user?._id}`,
          userSkills,
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
    if (textOption === "PDF Resources") {

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
    if (textOption === "Enrolled Courses") {
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
    if (textOption === "My Certifications") {
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

  }, [dispatch, textOption, user, isGuest, isJobSearchGlobal]);

  const handleFetchMoreCourses = useCallback(() => {
    if (isGuest || isFetchingMore || !hasMoreCourses || textOption !== "Explore Courses" || focusedCourse) return;
    if (lastRequestedPageRef.current === pageNumber) return;

    lastRequestedPageRef.current = pageNumber;
    setIsFetchingMore(true);

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/${user?._id || "guest"}?page=${pageNumber}&limit=${COURSE_PAGE_SIZE}`, {
        withCredentials: true,
      })
      .then((res) => {
        const nextCourses = Array.isArray(res?.data) ? res.data : [];
        if (nextCourses.length > 0) {
          dispatch(updateCurrentCourses(appendUniqueById(courses || [], nextCourses)));
          setPageNumber((prev) => prev + 1);
        }
        if (nextCourses.length < COURSE_PAGE_SIZE) {
          setHasMoreCourses(false);
        }
      })
      .catch((err) => {
        if (err?.response?.data.login) {
          window.location.reload();
          return;
        }
        setErrorMessage(err?.code === "ERR_NETWORK" ? "server unreachable" : err?.response?.data);
      })
      .finally(() => setIsFetchingMore(false));
  }, [courses, dispatch, focusedCourse, hasMoreCourses, isFetchingMore, isGuest, pageNumber, textOption, user?._id]);

  useEffect(() => {
    if (isGuest || !hasMoreCourses || isFetching || isFetchingMore || textOption !== "Explore Courses" || focusedCourse || isCert) return undefined;
    const target = courseInfiniteScrollRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleFetchMoreCourses();
        }
      },
      { root: null, rootMargin: "420px 0px", threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [focusedCourse, handleFetchMoreCourses, hasMoreCourses, isCert, isFetching, isFetchingMore, isGuest, textOption]);



  // handle navigate to instructor page
  const handleNavigateInstructor = () => {
    // set is fetching true
    setIsFetching(true)

    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/instructor/${user?._id}`, {
      withCredentials: true,
    })
      .then((res) => {
        // if the length is greater than 0 then navigate hiring pane since 
        // are jobs user posted
        if (res?.data?.length > 0) {
          navigate("/courses/instructor")
        } else {
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

  // handle navigate to login
  const handleNavigateLogin = () => {
    navigate("/auth/login")
  }

  const handleNavigateHome = () => {
    dispatch(updateCurrentBottomNav(0));
    dispatch(handleSidebarRightbar(true));
    dispatch(handleShowingSpeedDial(true));
    dispatch(handleIsJobsGlobalResults(false));
    navigate("/explore");
  }

  const handleOpenSearch = () => {
    dispatch(handleIsJobsGlobalResults(false));
    setTextOption("Course Search");
    setOpenAlert(true);
  }

  const courseMetrics = [
    ["Learning assets", isCert ? certData?.length || 0 : courses?.length || 0, "Items in this view"],
    ["Workspace", textOption, "Current learning lane"],
    ["Credential", isCert ? "Certificate" : "Course", "Progress artifact"],
    ["Access", isGuest ? "Guest" : "Member", "Platform role"],
  ];

  const courseQuickModes = [
    { label: "AI Selection", icon: <AutoAwesomeOutlined /> },
    { label: "Enrolled Courses", icon: <VideoLibraryOutlined /> },
    { label: "My Certifications", icon: <PrintRounded /> },
  ].filter(() => !isGuest);

  const courseGuidance = [
    ["Choose by outcome", "Prioritize courses that build a role-ready project, not only a topic list."],
    ["Learn in loops", "Watch, build, ship, then return to the lessons with better questions."],
    ["Prove progress", "Use certificates and enrolled tracks to show consistent learning momentum."],
  ];


  return (
    <Suspense
      fallback={
        <Box
          minHeight={"88vh"}
          display={"flex"}
          justifyContent={"center"}>
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
          borderRadius: panelRadius,
          overflow: "visible",
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

            {/* main jobs title and the current selection */}
            <Box sx={{ flex: 1, minWidth: 0, px: { xs: 0.75, sm: 1 } }}>
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
                Metatron Learn
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

            <Box display={'flex'} gap={1} alignItems={'center'} justifyContent={'flex-end'}>
              <PageSearchAction
                label="Courses"
                helper="Skill, specialization, provider"
                count={isCert ? certData?.length || 0 : courses?.length || 0}
                onClick={handleOpenSearch}
                isDarkMode={isDarkMode}
              />
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
                  startIcon={<Person />}
                >
                  Signin
                </Button>
              ) : (
                <React.Fragment>
                  {/* dark mode */}
                    {/* <IconButton
                    onClick={handleShowDarkMode}>
                    <Tooltip arrow title={isDarkMode ? "Light" : "Dark"}>
                      <DarkModeRounded
                        sx={{ color: "white", height: 24, width: 24, }}
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
                  <Menu sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            )}

            {open && (
              <Box display={'flex'} gap={1} alignItems={'center'}>
                {/* icon right or left arrow */}
                <IconButton onClick={handleDrawerClose}>
                  <Menu sx={{ color: 'white' }} />
                </IconButton>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}>
                  {/* title */}
                  <Typography variant="body2"
                    sx={{ color: 'white' }}
                    fontWeight={'bold'}
                    textTransform={'uppercase'}
                    display={'flex'}
                    alignItems={'center'}
                    gap={0.3}
                    mb={1}
                  >
                    <LocalLibraryOutlined />
                    Tech Student
                  </Typography>

                  {/* user name */}
                  <Typography
                    fontWeight={'bold'}
                    variant="caption"
                    sx={{ color: 'white' }}
                  >
                    - {user?.name?.substring(0, 13) || "Guest Mode"} -
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
              "Explore Courses",
            ] : [
              "Explore Courses",
              // "Popular Courses",
              "AI Selection",
              //"PDF Resources",
              "Enrolled Courses",
              "My Certifications",
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
                        <SchoolOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{ width: 25, height: 25 }}
                        />
                      ) : index === 8 ? (
                        <WavesOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{ width: 20, height: 20 }}
                        />
                      ) : index === 1 ? (
                        <AutoAwesomeOutlined
                          color={text === textOption ? "primary" : "inherit"}
                          sx={{ width: 26, height: 26 }}
                        />

                      ) : index === 9 ? (
                        <PictureAsPdfOutlined
                          color={text === textOption ? "primary" : "inherit"}
                        />) : index === 2 ? (
                          <VideoLibraryOutlined
                            color={text === textOption ? "primary" : "inherit"}
                          />) : (
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
              </ListItem>
            ))}
          </List>
          )}

          {open && !isGuest && (
            <Box
              width={'100%'}
              display={'flex'}
              justifyContent={'center'}>
              <Button
                size="small"
                startIcon={<SupportAgentRounded />}
                color="secondary"
                disableElevation
                sx={{
                  my: 1, px: 1,
                  borderRadius: 5,
                  width: '90%',
                  fontWeight: 'bold',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
                onClick={handleNavigateInstructor}>
                I'M Instructor
              </Button>
            </Box>
          )}
          {open && !isGuest && (
            <Box sx={{ px: 1.5, mt: "auto", mb: 2 }}>
              <Box
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(214,178,94,0.16)",
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(242,184,75,0.08))"
                    : "linear-gradient(135deg, rgba(214,178,94,0.08), rgba(139,111,42,0.05))",
                  p: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <LocalLibraryOutlined color="primary" sx={{ fontSize: 18 }} />
                  <Typography variant="caption" color="primary.main" fontWeight={900}>
                    LEARNING SYSTEM
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={900} mt={0.75}>
                  Build a visible skill trail.
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.75}>
                  Explore, enroll, complete, then surface certificates as proof of progress.
                </Typography>
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
                  ? "linear-gradient(135deg, rgba(13,13,13,0.94), rgba(214,178,94,0.08), rgba(242,184,75,0.10))"
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
                    <SchoolOutlined sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography variant="overline" color="primary.main">
                      Tech Learning Studio
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={900} lineHeight={1.12}>
                    {textOption}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={760}>
                    Build role-ready skills through practical courses, AI-guided recommendations, certificates, and instructor-led tracks.
                  </Typography>
                </Box>
                {!isGuest && (
                  <Button
                    disableElevation
                    variant="contained"
                    onClick={handleNavigateInstructor}
                    startIcon={<SupportAgentRounded />}
                    sx={{ minWidth: { xs: "100%", sm: 170, md: 154 } }}
                  >
                    Instructor Hub
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
                {courseMetrics.map(([label, value, helper]) => (
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
              {courseQuickModes.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {courseQuickModes.map((mode) => (
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
                {courseGuidance.map(([title, copy]) => (
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
              {(textOption === "Explore Courses" ||
                textOption === "Course Search" ||
                //textOption === "Popular Courses" ||
                textOption === "AI Selection" ||
                textOption === "Enrolled Courses" ||
                textOption === "My Certifications") && (
                  <React.Fragment>
                    {isFetching ? (
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"100%"}
                        flexDirection={"column"}
                        sx={{ gridColumn: "1 / -1" }}
                      >
                        <CircularProgress size={"30px"} />
                      </Box>
                    ) : (
                      <React.Fragment>

                        {!isCert ? (
                          <>
                            {/* focused course */}
                            {focusedCourse && (
                              <Box sx={{ gridColumn: "1 / -1" }}>
                                <CoursePlayer
                                  openPlayer={focusedCourse}
                                  course={focusedCourse}
                                  setText={setTextOption}
                                  setFocusedCourse={setFocusedCourse}
                                />
                              </Box>
                            )}

                            {/* content will go here */}
                            {courses?.length > 0 && !focusedCourse && courses?.map((course) => (
                              <CourseLayout
                                key={course?._id}
                                isDarkMode={isDarkMode}
                                courseItem={course}
                                setFocusedCourse={setFocusedCourse}
                                setErrorMessage={setErrorMessage}
                              />
                            ))}

                            {courses?.length > 0 && !focusedCourse && textOption === "Explore Courses" && (
                              <Box
                                ref={courseInfiniteScrollRef}
                                sx={{
                                  gridColumn: "1 / -1",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  minHeight: 46,
                                  mt: 1,
                                }}
                              >
                                {isGuest ? (
                                  <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
                                    Sign in to keep exploring more courses.
                                  </Typography>
                                ) : isFetchingMore ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <CircularProgress size={18} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                      Loading more courses...
                                    </Typography>
                                  </Stack>
                                ) : !hasMoreCourses && (
                                  <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
                                    no more courses available at the moment
                                  </Typography>
                                )}
                              </Box>
                            )}

                            {/* rendered if are no events  */}
                            {courses?.length < 1 && (
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
                                  No courses found
                                </Typography>
                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                  This learning view has no published courses yet.
                                </Typography>
                                {/* show refresh button */}
                                <Button
                                  disableElevation
                                  onClick={() => setTextOption("Explore Courses")}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 3 }}
                                  startIcon={<Refresh />}
                                >refresh</Button>
                              </Box>
                            )}
                          </>
                        ) : (
                          <>
                            {/* certs table */}
                            {isCert && (
                              <Box sx={{ gridColumn: "1 / -1", minWidth: 0 }}>
                                <CertificatesTable
                                  certsData={certData}
                                />
                              </Box>
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
            defaultIcon={<InfoRounded />}
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
            defaultIcon={<InfoRounded />}
            isError={true}
          />
        )}

        {/* show success snackbar when redux snack state is updated */}
        {messageSnack && <SnackBarSuccess message={messageSnack} />}
      </Box>
    </Suspense>
  );
}
