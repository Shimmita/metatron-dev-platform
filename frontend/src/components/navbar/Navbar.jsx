import {
  Close,
  EmailRounded,
  ErrorOutline,
  KeyboardArrowDownRounded,
  FilterListRounded,
  MenuRounded,
  NotificationsRounded,
  Person,
  SearchRounded
} from "@mui/icons-material";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { Suspense, useLayoutEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../images/logo_sm.png";
import {
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showMessagingDrawer,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentConnectNotif } from "../../redux/CurrentConnectNotif";
import { updateConversations } from "../../redux/CurrentConversations";
import {
  resetClearCurrentGlobalSearch,
  updateCurrentGlobalSearchResults,
} from "../../redux/CurrentGlobalSearch";
import { updateCurrentGroupsCommunities } from "../../redux/CurrentGroups";
import { updateCurrentJobFeedBack } from "../../redux/CurrentJobFeedBack";
import { updateCurrentPostReactions } from "../../redux/CurrentPostReactions";
import { updateCurrentReport } from "../../redux/CurrentPostReported";
import { updateCurrentProfileViews } from "../../redux/CurrentProfileView";
import AlertFilterFeed from "../alerts/AlertFilterFeed";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertGlobalSearch from "../alerts/AlertGlobalSearch";
import AlertSuccess from "../alerts/AlertSuccess";
import LogoutAlert from "../alerts/LogoutAlert";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import PeopleModal from "../modal/PeopleModal";
import PostDetailedModal from "../modal/PostDetailedModal";
import PostEditModal from "../modal/PostEditModal";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import DrawerSmartphone from './DrawerSmartphone';
const MetatronToolBar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "1420px",
  margin: "0 auto",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "100%",
  },
}));

const SearchBar = styled("div")(({ theme }) => ({
  paddingBottom: "2px",
  paddingTop: "2px",
  paddingLeft: "8px",
}));

const IconsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    gap: "22px",
  },
}));

const LogoContent = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});


// search bar option
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.white, 0.075),
  border: "1px solid rgba(214,178,94,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
    borderColor: "rgba(214,178,94,0.34)",
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));



const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(9),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '42ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
}));

const Navbar = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [openAlertResults, setOpenAlertResults] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const [openAlertFilter, setOpenAlertFilter] = useState(false)

  // control opening of the events modal
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  redux states
  const { isPeopleModal, peopleData } = useSelector(
    (state) => state.currentModal
  );

  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { reportedPost } = useSelector((state) => state.currentReportedPost);
  const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
  const { profile_views } = useSelector((state) => state.currentProfileView);
  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
  const { conversations } = useSelector((state) => state.currentConversation);
  const { groups: groupData } = useSelector((state) => state.currentGroups);

  // extracting current user ID
  const currentUserId = isGuest ? false : user?._id

  // get count of conversation messages where target read is false
  const conversationsCount = conversations?.filter(conversation => conversation?.isTargetRead === false && conversation?.senderName !== user?.name)?.length

  // redux state UI
  const {
    currentMode,
    isSidebarRighbar,
    isDefaultSpeedDial,
    isOpenDrawerProfile,
    isOpenMessageDrawer,
    isPostEditModal,
    isPostFullDetailModal,
    isLogoutAlert
  } = useSelector((state) => state.appUI);
  const theme = useTheme();
  const isDarkMode = currentMode === 'dark';

  const handleShowMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
    // clear search term
    setSearchTerm("");
  };

  // UI theme dark light tweaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };


  // home page
  const handleHome = () => {
    // update the sidebar to be shown always
    // always default sidebar and right-bar showing for larger screens
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // show speed dial if ain't visible
    if (!isDefaultSpeedDial) {
      dispatch(handleShowingSpeedDial(true));
    }

    // update the bottom nav counter
    dispatch(updateCurrentBottomNav(0));
    // navigate home page
    navigate("/explore");
  };

  // show the notification and messaging triggered by redux
  const handleShowMessageDrawer = (position) => {

    dispatch(showMessagingDrawer(position));
  };

  const handleShowingProfileDrawer = () => {
    dispatch(showUserProfileDrawer());
  };


  // handle search global
  const handleSubmitGlobalSearch = (event) => {
    // prevent default form submission
    event.preventDefault();

    // alert user to type text in search box
    if (searchTerm.length < 1) {
      setOpenAlertGeneral(true)
      setErrorMessage("please type in the search box and search for resources!")
      return
    }

    // clear any redux states of global search if present
    dispatch(resetClearCurrentGlobalSearch());

    // activate fetching
    setIsFetching(true);

    // start the =get request axios, global search
    axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/global/search/${searchTerm}`,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        if (res?.data) {
          // set response message to total number of results
          setResponseMessage(
            `${res.data.users.count + res.data.posts.count
            + res.data.jobs.count + res.data.events.count
            + res.data.courses.count
            } results found`
          );

          // update current user redux
          dispatch(updateCurrentGlobalSearchResults(res.data));

          // set open alert results true
          setOpenAlertResults(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // open alert results with the error message
        setOpenAlertResults(true);
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setResponseMessage("failed to search network error");
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle showing of the filter dialog to customize feed results
  const handleShowContentFilter = () => {
    setOpenAlertFilter(true)
  }


  // only when authenticated run the hooks
  // get all possible post reaction notifications based on current userID
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing get request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/reactions/all/${currentUserId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPostReactions(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable "
          );
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);

  // get all connect requests sent by users to the current user as being target
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/all/${currentUserId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux for connectNotif
        if (res?.data) {
          dispatch(updateCurrentConnectNotif(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable please try again later");
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);

  // get all posts reports that targets this currently logged in user
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/report/get/${currentUserId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux for post
        if (res?.data) {
          dispatch(updateCurrentReport(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable");
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);


  // fetch or get all conversations done by the current user
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request under the id of the current user
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/all/${currentUserId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the states of conversations
        dispatch(updateConversations(res?.data));
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable!");
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [currentUserId, dispatch]);


  // get all profile views data from the backend
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request under the id of the current user
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/profile_views/${currentUserId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the states of conversations
        dispatch(updateCurrentProfileViews(res?.data));
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable!");
          return;
        }

      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [currentUserId, dispatch]);


  // fetching of all job feedback 
  useLayoutEffect(() => {
    if (!currentUserId) {
      return
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request under the id of the current user
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/feedback/${currentUserId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the states of conversations
        dispatch(updateCurrentJobFeedBack(res?.data));
        // open alert general
        setOpenAlertGeneral(true)
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable!");
          return;
        }
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [currentUserId, dispatch]);


  // useLayout effect, fetch data of groups
  useLayoutEffect(() => {
    // redux data present
    if (groupData) {
      return
    }

    // fetch to populate the redux groups
    axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/all/${user?._id}`,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        // update groups and communities data
        if (res?.data) {
          dispatch(updateCurrentGroupsCommunities(res.data))
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

      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [user?._id, dispatch, groupData])

  // handle navigate to login
  const handleNavigateLogin = () => {
    navigate("/auth/login")
  }

  return (
    <React.Fragment>
      <AppBar
        color="primary"
        position="fixed"
        elevation={0}
        sx={{
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(5,5,5,0.88)",
          backdropFilter: "blur(18px) saturate(150%)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.24)",
        }}>
        <MetatronToolBar variant="dense" sx={{ minHeight: { xs: 56, md: 56 }, py: 0 }}>
          {/* lg screen toolbar */}
          <LogoContent
            sx={{
              display: {
                xs: "none",
                md: "block",
                fontWeight: "bold",
              },
            }}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}>
              <Avatar alt="Metatron"
                src={AppLogo}
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid rgba(214,178,94,0.26)",
                  boxShadow: "0 0 22px rgba(214,178,94,0.16)",
                }}
              />

              <Button onClick={handleHome} sx={{ px: 0.5 }}>
                <Box textAlign="left">
                  <Typography
                    sx={{
                      fontWeight: 950,
                      fontSize: 18,
                      letterSpacing: "0.06em",
                      color: "#FFFDF7",
                      lineHeight: 1,
                    }}
                  >
                    METATRON
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 850,
                      fontSize: 10,
                      letterSpacing: "0.13em",
                      color: "rgba(255,253,247,0.62)",
                      lineHeight: 1.3,
                    }}
                  >
                    BUILD · LEARN · CONNECT · GROW
                  </Typography>
                </Box>
              </Button>
            </Box>
          </LogoContent>

          {/* show menu on small devices when searchIcon  not clicked */}
          {!showMobileSearch && (
            <LogoContent
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
              }}
            >
              {/* show menu on small devices only not tab+laps+desk */}
              {!CustomDeviceTablet() ? (
                <React.Fragment>
                  <IconButton onClick={(e) => setOpenDrawer(!openDrawer)}>
                    <MenuRounded sx={{ color: "white" }} />
                  </IconButton>
                  {/* app tile on smallest devices won't show 
                  only medium sized. show app logo on smallest devices
                  */}
                  {!CustomDeviceSmallest() ? (
                    <Button onClick={handleHome} >
                      <Typography
                        fontWeight={"bold"}
                        color={'white'}
                        sx={{ fontsize: 'medium' }}
                      >
                        METATRON
                      </Typography>
                    </Button>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={handleHome} >
                      <Avatar alt="KE"
                        src={AppLogo}
                        sx={{
                          width: 30, height: 30
                        }}
                      />
                    </IconButton>
                  )}

                </React.Fragment>
              ) : (
                <Box display={"flex"} ml={0} alignItems={"center"} gap={1}>
                  {/* tablet show app logo not on smaller Devices */}
                  <IconButton onClick={handleHome}>
                    <Avatar
                      alt=""
                      src={AppLogo}
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>

                  {/* app title for tablets */}
                  <Button>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: "0.05em",
                        color: "#FFFDF7",
                      }}
                    >
                      METATRON
                    </Typography>
                  </Button>

                </Box>
              )}
            </LogoContent>
          )}

          {/* visible on lap and ++ screens always */}
          {!(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
            <SearchBar sx={{
              ml: { md: 3, lg: 4 },
            }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: '100%'
                }}
              >
                <form className="d-flex" onSubmit={handleSubmitGlobalSearch}>
                  <Search>
                    <SearchRounded
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 20,
                        height: 20,
                        color: "rgba(255,253,247,0.62)",
                        pointerEvents: "none",
                      }}
                    />
                    <StyledInputBase
                      placeholder="Search jobs, courses, events, people..."
                      inputProps={{ 'aria-label': 'search' }}
                      sx={{
                        borderRadius: '8px',
                        fontSize: 'small'
                      }}
                      type="text"
                      disabled={isFetching}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        px: 0.8,
                        py: 0.25,
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,253,247,0.72)",
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      Ctrl + K
                    </Box>
                  </Search>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    ml={1}
                    gap={1}
                  >
                    {isFetching ? (
                      <CircularProgress
                        size={18}
                        sx={{ ml: 1 }}
                      />
                    ) : (
                      <React.Fragment>
                        {/* // search icon */}
                        <Tooltip title={'search'} arrow>
                          <IconButton
                            type="submit"
                          >
                            <SearchRounded
                              sx={{ width: 20, height: 20, color: "white" }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={'filter'}
                          arrow
                        >
                          <IconButton
                            onClick={handleShowContentFilter}
                          >
                            <FilterListRounded
                              sx={{ width: 22, height: 22, color: "white" }}
                            />
                          </IconButton>
                        </Tooltip>

                      </React.Fragment>

                    )}
                  </Box>
                </form>
              </Box>
            </SearchBar>
          )}

          {!showMobileSearch && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ display: { xs: "none", lg: "flex" }, ml: 2 }}
            >
              <Button
                onClick={handleHome}
                endIcon={<KeyboardArrowDownRounded />}
                sx={{ color: "#FFFDF7", fontWeight: 900, px: 1 }}
              >
                Explore
              </Button>
              <Button
                onClick={() => isGuest ? handleNavigateLogin() : navigate("/explore")}
                endIcon={<KeyboardArrowDownRounded />}
                sx={{ color: "#FFFDF7", fontWeight: 900, px: 1 }}
              >
                Create
              </Button>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.10)" }} />
            </Stack>
          )}

          {/* shown in small devices and tabs */}
          <Box
            justifyContent={'center'}
            alignItems={'center'}
            display={showMobileSearch ? "block" : "none"}
            width={'100%'}
            ml={CustomDeviceIsSmall() ? 2 : 20}
          >
            <SearchBar className="ms-5">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form
                  className="d-flex gap-1"
                  onSubmit={handleSubmitGlobalSearch}
                >
                  <Search>
                    <StyledInputBase
                      placeholder="search…"
                      inputProps={{ 'aria-label': 'search' }}
                      sx={{
                        borderRadius: '20px',
                        fontSize: 'small'
                      }}
                      type="text"
                      disabled={isFetching}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Search>

                  <Box>
                    {isFetching ? (
                      <CircularProgress size={18} />
                    ) : (
                      <IconButton
                        type="submit"
                        disabled={searchTerm?.length < 2}
                      >
                        <SearchRounded
                          sx={{ width: 22, height: 22, color: "white" }}
                        />
                      </IconButton>
                    )}
                  </Box>
                </form>
                <Tooltip
                  title={'filter'}
                  arrow
                >
                  <IconButton
                    onClick={handleShowContentFilter}
                  >
                    <FilterListRounded
                      sx={{ width: 20, height: 20, color: "white" }}
                    />
                  </IconButton>
                </Tooltip>

                <IconButton onClick={handleShowMobileSearch}>
                  <Close sx={{ width: 18, height: 18, color: "white" }} />
                </IconButton>
              </Box>
            </SearchBar>
          </Box>

          <IconsContainer>
            {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
              <Box
              >
                {/* display when search not clicked */}
                {!showMobileSearch && (
                  <IconButton onClick={handleShowMobileSearch}>
                    <SearchRounded sx={{ color: "white" }} />
                  </IconButton>
                )}
              </Box>
            )}


            {/* display when search not clicked */}
            {!showMobileSearch && (
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={
                  CustomDeviceTablet() ||
                    CustomLandscapeWidest() ||
                    CustomLandscapeWidest()
                    ? 4
                    : 2
                }
              >

                {!CustomDeviceIsSmall() && (
                  <React.Fragment>
                    {/* change theme trigger */}
                    {/* <Tooltip arrow title={isDarkMode ? "Light" : "Dark"}>
                      <IconButton onClick={handleShowDarkMode}>
                        <DarkModeRounded
                          sx={{ height: 24, width: 24, color: "white" }}
                        />
                      </IconButton>
                    </Tooltip> */}

                  </React.Fragment>
                )}

                {/* show login btn if no user,noId */}
                {currentUserId ? (
                  <React.Fragment>
                    {/* notifications icon */}
                    <Tooltip
                      arrow
                      title={"notifications"}
                      className={CustomDeviceIsSmall() ? 'me-1' : 'me-2'}
                    >
                      <Badge badgeContent={
                        post_reactions?.length +
                        reportedPost?.length +
                        connectNotifications?.length +
                        profile_views?.length +
                        job_feedback?.length || 0}
                        color="warning">
                        <IconButton
                          sx={{ padding: 0 }}
                          onClick={() => handleShowMessageDrawer(0)}
                        >
                          <NotificationsRounded
                            sx={{ width: 25, height: 25, color: "white" }}
                          />
                        </IconButton>
                      </Badge>
                    </Tooltip>

                    {/* messages icon */}
                    <Tooltip
                      arrow
                      title={"messages"}
                    >
                      <Badge
                        badgeContent={conversationsCount}
                        className={!CustomDeviceIsSmall() && 'me-1'}
                        color="warning">
                        <IconButton
                          sx={{ padding: 0 }}
                          onClick={() => handleShowMessageDrawer(1)}
                        >
                          <EmailRounded
                            sx={{ width: 22, height: 22, color: "white" }}
                          />
                        </IconButton>
                      </Badge>
                    </Tooltip>

                    {/* avatar for profile icon */}
                    <Tooltip
                      arrow
                      title={"profile"}>
                      <IconButton onClick={handleShowingProfileDrawer}>
                        <Avatar
                          sx={{ width: 32, height: 32 }}
                          src={user?.avatar}
                          alt={''}
                        />
                      </IconButton>
                    </Tooltip>
                  </React.Fragment>
                ) : (
                  <Button
                    size="medium"
                    onClick={handleNavigateLogin}
                    color="inherit"
                    startIcon={<Person sx={{ color: "white" }} />}
                  >
                    Signin
                  </Button>
                )}


              </Box>
            )}
          </IconsContainer>
        </MetatronToolBar>

        {/* use suspense to cover lazy loading as fallback error boundary */}
        <Suspense
          fallback={
            <Box
              color={"text.primary"}
              height={CustomDeviceIsSmall() ? "91.7vh" : "91"}
            >
              <Box mt={1} display={"flex"} justifyContent={"center"}>
                <CircularProgress size={"2rem"} />
              </Box>
            </Box>
          }
        >
          {/* drawer smartphones for sidebar purpose */}
          {openDrawer && (
            <DrawerSmartphone
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
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

          {/* show logout alert */}
          {isLogoutAlert && (
            <LogoutAlert />
          )}

          {/* alert general when is an error */}
          {errorMessage && (
            <AlertGeneral
              isError={true}
              setErrorMessage={setErrorMessage}
              title={"Error"}
              message={errorMessage}
              defaultIcon={<ErrorOutline />}
              openAlertGeneral={openAlertGeneral}
              setOpenAlertGeneral={setOpenAlertGeneral}
            />
          )}



          {/* show modal connect with people or people search results */}
          {isPeopleModal && (
            <PeopleModal
              openPeopleModal={isPeopleModal}
              PeopleConnect={peopleData}
            />
          )}

          {/* show alert post edit modal when triggered by redux */}
          {isPostEditModal && (
            <PostEditModal />
          )}

          {/* show alert post detailed modal when triggered by redux */}
          {isPostFullDetailModal && (
            <PostDetailedModal />
          )}

          {/* show alert search results global */}
          {openAlertResults && (
            <AlertGlobalSearch
              openAlert={openAlertResults}
              setOpenAlert={setOpenAlertResults}
              message={responseMessage}
              setMessage={setResponseMessage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {/* open alert filter */}
          {openAlertFilter && (
            <AlertFilterFeed
              openAlert={openAlertFilter}
              setOpenAlert={setOpenAlertFilter}
            />
          )}


          {/* display success alert */}
          <AlertSuccess />


        </Suspense>
      </AppBar>

      {/* fix the contents to be shown fully */}
      <Box pb={CustomDeviceTablet() ? 7 : 5.5} />
    </React.Fragment>
  );
};

export default Navbar;
