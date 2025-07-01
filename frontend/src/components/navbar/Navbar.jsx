import {
  Close,
  DarkModeRounded,
  EmailRounded,
  ErrorOutline,
  MenuRounded,
  NotificationsRounded,
  SearchRounded,
  SortRounded
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, Suspense, useLayoutEffect, useState } from "react";

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
import { updateCurrentJobFeedBack } from "../../redux/CurrentJobFeedBack";
import { updateCurrentPostReactions } from "../../redux/CurrentPostReactions";
import { updateCurrentReport } from "../../redux/CurrentPostReported";
import { updateCurrentProfileViews } from "../../redux/CurrentProfileView";
import AlertAboutMetatron from "../alerts/AlertAboutMetatron";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertSponsorship from "../alerts/AlertSponsorship";
import LogoutAlert from "../alerts/LogoutAlert";
import PostDetailedModal from "../modal/PostDetailedModal";
import PostEditModal from "../modal/PostEditModal";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import AlertFilterFeed from "../alerts/AlertFilterFeed";
import SpecialisationTech from "../data/SpecialisationTech";
const PeopleModal = lazy(() => import("../modal/PeopleModal"));
const AlertGlobalSearch = lazy(() => import("../alerts/AlertGlobalSearch"));
const ProfileDrawer = lazy(() => import("../profile/drawer/ProfileDrawer"));
const EventsAddModal = lazy(() => import("../modal/EventsAddModal"));
const ParentNotifMessageDrawer = lazy(() =>
  import("../messaging/ParentNotifMessageDrawer")
);
const DrawerSmartphone = lazy(() => import("./DrawerSmartphone"));


const MetatronToolBar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

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
    gap: "30px",
  },
}));

const LogoContent = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Navbar = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [openAlertResults, setOpenAlertResults] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertGeneral,setOpenAlertGeneral]=useState(false)
  const [openAlertFilter,setOpenAlertFilter]=useState(false)
  const [feedOptions,setFeedOption]=useState(SpecialisationTech)

  // axios default credentials
  axios.defaults.withCredentials = true;
  // control opening of the events modal
  const [openModalEventAdd, setOpenModalEventAdd] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const { isPeopleModal, peopleData } = useSelector(
    (state) => state.currentModal
  );

    const { user } = useSelector((state) => state.currentUser);
    const { post_reactions } = useSelector((state) => state.currentPostReactions);
    const { reportedPost } = useSelector((state) => state.currentReportedPost);
    const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
    const { profile_views } = useSelector((state) => state.currentProfileView);
    const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
    const { conversations } = useSelector((state) => state.currentConversation);

    // get count of conversation messages where target read is false
    const conversationsCount=conversations?.filter(conversation=>conversation?.isTargetRead===false && conversation?.senderName!==user?.name)?.length 
  
  // extracting current user ID
  const { _id: currentUserId } = user;

  // redux state UI
  const {
    currentMode,
    isSidebarRighbar,
    isDefaultSpeedDial,
    isOpenSponsorAlert,
    isOpenAboutMetatron,
    isOpenDrawerProfile,
    isOpenMessageDrawer,
    isPostEditModal,
    isPostFullDetailModal,
    isLogoutAlert
  } = useSelector((state) => state.appUI);
   const isDarkMode=currentMode==='dark'

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
    navigate("/");
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
    if (searchTerm.length<1) {
     setOpenAlertGeneral(true)
     setErrorMessage("please type in the search box and search for resources!")
     return
    }
 
    // clear any redux states of global search if present
    dispatch(resetClearCurrentGlobalSearch());

    // activate fetching
    setIsFetching(true);

    // start the put request axios
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
            `${
              res.data.users.count + res.data.posts.count + res.data.jobs.count
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
        // update the snackbar notification of error from the server
        setResponseMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle showing of the filter dialog to customize feed results
  const handleShowContentFilter=()=>{
    setOpenAlertFilter(true)
  }
  

  // get all possible post reaction notifications based on current userID
  useLayoutEffect(() => {
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
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable "
          );
          return;
        }
        setErrorMessage(err?.response.data);

        // open alert general
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);

  // get all connect requests sent by users to the current user as being target
  useLayoutEffect(() => {
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
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable please try again later");
          return;
        }
        setErrorMessage(err?.response.data);

        // open alert general
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);

  // get all posts reports that targets this currently logged in user
  useLayoutEffect(() => {
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
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable");
          return;
        }
        setErrorMessage(err?.response.data);
        // open alert general
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, currentUserId]);


  // fetch or get all conversations done by the current user
    useLayoutEffect(() => {
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
         dispatch(updateConversations(res?.data)) ;
        })
        .catch((err) => {
          console.log(err);
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("server is unreachable!");
            return;
          }
          setErrorMessage(err?.response.data);
          // open alert general
        setOpenAlertGeneral(true)
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }, [currentUserId, dispatch]);


    // get all profile views data from the backend
    useLayoutEffect(() => {
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
         dispatch(updateCurrentProfileViews(res?.data)) ;
        })
        .catch((err) => {
          console.log(err);
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("server is unreachable!");
            return;
          }
          setErrorMessage(err?.response.data);
          // open alert general
        setOpenAlertGeneral(true)
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }, [currentUserId, dispatch]);


    // fetching of all job feedback 
    useLayoutEffect(() => {
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
         dispatch(updateCurrentJobFeedBack(res?.data)) ;
         // open alert general
        setOpenAlertGeneral(true)
        })
        .catch((err) => {
          console.log(err);
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("server is unreachable!");
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }, [currentUserId, dispatch]);

  return (
    <React.Fragment>
      <AppBar position="fixed" elevation={5}>
        <MetatronToolBar variant="dense">
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
              <Avatar alt="KE" 
              src={AppLogo} 
              sx={{ width: 40, height: 40 }} />
                <Button onClick={handleHome} >
                  <Typography variant="h6" fontWeight={"bold"} sx={{ color:'white' }}>
                    METATRON
                  </Typography>
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
                    <MenuRounded style={{ color: "white" }} />
                  </IconButton>
                  <IconButton onClick={handleHome} style={{ color: "white" }}>
                    {/* app title small devices */}
                    <Typography
                      fontWeight={"bold"}
                      sx={{ fontsize:'medium' }}
                    >
                      METATRON
                    </Typography>
                  </IconButton>
                </React.Fragment>
              ) : (
                <Box display={"flex"} ml={0} alignItems={"center"} gap={1}>
                  {/* tablet show app logo not on smaller Devices */}
                    <IconButton onClick={handleHome}>
                      <Avatar
                        alt=""
                        src={AppLogo}
                        sx={{ width: 38, height: 38 }}
                      />
                    </IconButton>

                  {/* app title for tablets */}
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      style={{ color: "white" }}
                    >
                      METATRON
                    </Typography>
                  

                </Box>
              )}
            </LogoContent>
          )}

          {/* visible on lg screens always */}
          {window.screen.availWidth > 500 && (
            <SearchBar>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form className="d-flex" onSubmit={handleSubmitGlobalSearch}>
                  <Box>
                    <input
                      type="text"
                      disabled={isFetching}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={"search..."}
                      className="form-control w-100 border-0 text-secondary rounded-5"
                    />
                  </Box>
                  
                  <Box 
                  display={'flex'} 
                  alignItems={'center'}
                  ml={1}
                  gap={1}
                  >
                    {isFetching ? (
                      <CircularProgress
                        size={18}
                        sx={{ color: "white", ml: 1 }}
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
                       title={'sort'} 
                       arrow
                        >
                      <IconButton
                      onClick={handleShowContentFilter}
                    >
                      <SortRounded
                        sx={{ width: 20, height: 20, color: "white" }}
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

          {/* show search bar on small devices when necessary */}
          {showMobileSearch && (
            <SearchBar>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form
                  className="d-flex gap-1 ps-5"
                  onSubmit={handleSubmitGlobalSearch}
                >
                  <Box>
                    <input
                      type="text"
                      disabled={isFetching}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={"search..."}
                      className="form-control w-100 border-0 text-secondary"
                    />
                  </Box>

                  <Box>
                    {isFetching ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <IconButton
                        type="submit"
                        disabled={searchTerm?.length < 2}
                      >
                        <SearchRounded
                          sx={{ width: 20, height: 20, color: "white" }}
                        />
                      </IconButton>
                    )}
                  </Box>
                </form>

                {/* // filter icon */}
                 <Tooltip
                      title={'sort'} 
                      arrow
                      >
                    <IconButton
                    onClick={handleShowContentFilter}
                  >
                    <SortRounded
                      sx={{ width: 20, height: 20, color: "white" }}
                    />
                  </IconButton>
                  </Tooltip>

                <IconButton onClick={handleShowMobileSearch}>
                  <Close sx={{ width: 18, height: 18, color: "whitesmoke" }} />
                </IconButton>
              </Box>
            </SearchBar>
          )}

          <IconsContainer>
            {window.screen.availWidth < 500 && (
              <Box>
                {/* display when search not clicked */}
                {!showMobileSearch && (
                  <IconButton onClick={handleShowMobileSearch}>
                    <SearchRounded style={{ color: "white" }} />
                  </IconButton>
                )}
              </Box>
            )}

            {/* change theme trigger */}
            {!CustomDeviceIsSmall() && (
                    <IconButton  onClick={handleShowDarkMode}> 
                    <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
                    <DarkModeRounded
                  
                      sx={{ color: "white", height:25, width:25 }}
                    />
                  </Tooltip> 
                  </IconButton>
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
                {/* notifications icon */}
                <Tooltip 
                arrow 
                title={"notifications"} 
                className={CustomDeviceIsSmall() ? 'me-1':'me-3'}
                >
                <Badge badgeContent={post_reactions?.length + reportedPost?.length + connectNotifications?.length + profile_views?.length +job_feedback?.length } color="warning">
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={()=>handleShowMessageDrawer(0)}
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
                className={!CustomDeviceIsSmall() && 'me-2'}
                color="warning">
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={()=>handleShowMessageDrawer(1)}
                  >
                    <EmailRounded
                      sx={{ width: 22, height: 22,  color: "white" }}
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
                      sx={{ width: 30, height: 30 }}
                      src={user?.avatar}
                      alt={''}
                    />
                  </IconButton>
                </Tooltip>
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

          {/* EventsAdd Modal to be displayed if toggled */}
         {openModalEventAdd && (
           <EventsAddModal
           openModalEventAdd={openModalEventAdd}
           setOpenModalEventAdd={setOpenModalEventAdd}
         />
         )}

         {/* show logout alert */}
         {isLogoutAlert && (
          <LogoutAlert/>
         )}

          {/* alert general when is an error */}
        {errorMessage &&(
          <AlertGeneral
           isError={true} 
           setErrorMessage={setErrorMessage}
           title={"Error"}
           message={errorMessage}
           defaultIcon={<ErrorOutline/>}
           openAlertGeneral={openAlertGeneral}
           setOpenAlertGeneral={setOpenAlertGeneral}
           />
        )}

        {/* control showing of the about us alert */}
        {isOpenAboutMetatron && (
          <AlertAboutMetatron openAboutMetatron={isOpenAboutMetatron} />
        )}

        {/* control showing of sponsorship alert */}
        {isOpenSponsorAlert && (
          <AlertSponsorship
            openSponsorAlert={isOpenSponsorAlert}
            isLaunchPage={true}
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
              <PostEditModal/>
            )}

            {/* show alert post detailed modal when triggered by redux */}
            {isPostFullDetailModal && (
              <PostDetailedModal/>
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
          feedData={feedOptions}
          />
        )}


        </Suspense>
      </AppBar>

      {/* fix the contents to be shown fully */}
      <Box mb={5.5}/>
    </React.Fragment>
  );
};

export default Navbar;
