import {
  Close,
  Diversity1Outlined,
  EmailOutlined,
  FullscreenExitRounded,
  FullscreenRounded,
  MenuRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, Suspense, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import AppLogo from "../../images/logo_sm.png";
import {
  handleShowingSpeedDial,
  handleSidebarRightbar,
  showMessagingDrawer,
  showTabSideBar,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import {
  resetClearCurrentGlobalSearch,
  updateCurrentGlobalSearchResults,
} from "../../redux/CurrentGlobalSearch";
import AlertSponsorship from "../alerts/AlertSponsorship";
import AlertSupport from "../alerts/AlertSupport";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import AlertAboutMetatron from "../alerts/AlertAboutMetatron";
const PeopleModal = lazy(() => import("../modal/PeopleModal"));
const AlertGlobalSearch = lazy(() => import("../alerts/AlertGlobalSearch"));
const ProfileDrawer = lazy(() => import("../profile/drawer/ProfileDrawer"));
const EventsAddModal = lazy(() => import("../modal/EventsAddModal"));
const ParentNotifMessageContainer = lazy(() =>
  import("../messaging/ParentContainer")
);
const DrawerSmartphone = lazy(() => import("./DrawerSmartphone"));

//fix the appbar contents not showing full when set fixed
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

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

const Navbar = ({ setMode, mode }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [openAlertResults, setOpenAlertResults] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  // axios default credentials
  axios.defaults.withCredentials = true;
  // control opening of the events modal
  const [openModalEventAdd, setOpenModalEventAdd] = useState(false);

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navigate = useNavigate();

  // redux states
  const dispatch = useDispatch();
  // get redux states
  const { user } = useSelector((state) => state.currentUser);
  const { isPeopleModal, peopleData } = useSelector(
    (state) => state.currentModal
  );

  const handleShowMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
    // clear search term
    setSearchTerm("");
  };

  // redux state UI
  const {
    isSidebarRighbar,
    isDefaultSpeedDial,
    isOpenSponsorAlert,
    isOpenSupportAlert,
    isOpenAboutMetatron,
  } = useSelector((state) => state.appUI);

  // home page
  const handleHome = () => {
    // update the sidbar to be shown always
    // always default sidebar and rightbar showing for larger screens
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // show speed dial if aint visible
    if (!isDefaultSpeedDial) {
      dispatch(handleShowingSpeedDial(true));
    }

    // update the bottom nav counter
    dispatch(updateCurrentBottomNav(0));
    // navigate home page
    navigate("/");
  };

  // show the notificationa and messaing triggered by redux
  const handleShowMessageDrawer = () => {
    dispatch(showMessagingDrawer());
  };

  const handleShowingProfileDrawer = () => {
    dispatch(showUserProfileDrawer());
  };

  // handle full screen by collapsing side bar and showing menu on nav
  const handleFullscreenClicked = () => {
    setFullScreen((prev) => !prev);
    // alter display of sidebar from the redux
    dispatch(showTabSideBar());
  };

  // handle search global
  const handleSubmitGlobalSearch = (event) => {
    // prevent default form submission
    event.preventDefault();

    // clear any redux states of global search if present
    dispatch(resetClearCurrentGlobalSearch());

    // activate fetching
    setIsFetching(true);

    // start the put request axios
    axios
      .get(
        `http://localhost:5000/metatron/api/v1/global/search/${searchTerm}`,
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
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Avatar alt="KE" src={AppLogo} sx={{ width: 40, height: 40 }} />
              <Tooltip title={"home"} arrow>
                <IconButton onClick={handleHome} style={{ color: "white" }}>
                  <Typography variant="h6" fontWeight={"bold"}>
                    METATRON
                  </Typography>
                </IconButton>
              </Tooltip>
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
                      variant={CustomDeviceSmallest() ? "body2" : "body1"}
                      fontWeight={"bold"}
                    >
                      METATRON
                    </Typography>
                  </IconButton>
                </React.Fragment>
              ) : (
                <Box display={"flex"} ml={0} alignItems={"center"} gap={1}>
                  {/* tablet show app logo not on smaller Devices */}

                  {fullScreen ? (
                    // show meu when in full screen to use drawer as sidebar
                    <IconButton onClick={(e) => setOpenDrawer(!openDrawer)}>
                      <MenuRounded style={{ color: "white" }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleHome}>
                      <Avatar
                        alt="KE"
                        src={AppLogo}
                        sx={{ width: 38, height: 38 }}
                      />
                    </IconButton>
                  )}

                  {/* app title for tablets */}
                  {fullScreen ? (
                    <IconButton onClick={handleHome}>
                      <Typography
                        variant="h6"
                        fontWeight={"bold"}
                        style={{ color: "white" }}
                      >
                        METATRON
                      </Typography>
                    </IconButton>
                  ) : (
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      style={{ color: "white" }}
                    >
                      METATRON
                    </Typography>
                  )}

                  {/* fullscreen when clicked sidabar tabs collapse and menu be seen */}
                  <IconButton onClick={handleFullscreenClicked}>
                    {!fullScreen ? (
                      <FullscreenRounded style={{ color: "white" }} />
                    ) : (
                      <FullscreenExitRounded style={{ color: "white" }} />
                    )}
                  </IconButton>
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

                  <Box>
                    {isFetching ? (
                      <CircularProgress
                        size={18}
                        sx={{ color: "white", ml: 1 }}
                      />
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

            {/* display connection count for largets screens only */}
            {!(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
              <Tooltip arrow title={"connections"}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Box>
                    <Diversity1Outlined sx={{ color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={"bold"}
                      color="white"
                    >
                      {user?.network_count}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>
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
                    ? 5
                    : 2
                }
              >
                <Badge badgeContent={1} color="warning">
                  <Tooltip arrow title={"notifications"}>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={handleShowMessageDrawer}
                    >
                      <EmailOutlined
                        sx={{ width: 25, height: 25, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Badge>

                <Tooltip arrow title={"profile"}>
                  <IconButton onClick={handleShowingProfileDrawer}>
                    <Avatar
                      sx={{ width: 28, height: 28 }}
                      src={devImage}
                      alt={"user image"}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </IconsContainer>
        </MetatronToolBar>

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

        {/* alert technical support */}
        {isOpenSupportAlert && (
          <AlertSupport openSupportAlert={isOpenSupportAlert} />
        )}

        {/* show modal connect with people or people search results */}
        <PeopleModal
          openPeopleModal={isPeopleModal}
          PeopleConnect={peopleData}
        />

        {/* show alert search results global */}
        <AlertGlobalSearch
          openAlert={openAlertResults}
          setOpenAlert={setOpenAlertResults}
          message={responseMessage}
          setMessage={setResponseMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

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
          <DrawerSmartphone
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            mode={mode}
            setMode={setMode}
            openModalEventAdd={openModalEventAdd}
            setOpenModalEventAdd={setOpenModalEventAdd}
          />

          {/* holds the notification and messaging drawe */}
          <ParentNotifMessageContainer />

          {/* holds the profile drawer which contains user account info */}
          <ProfileDrawer />

          {/* EventsAdd Modal to be displayed if toggled */}
          <EventsAddModal
            openModalEventAdd={openModalEventAdd}
            setOpenModalEventAdd={setOpenModalEventAdd}
          />
        </Suspense>
      </AppBar>

      {/* fix the contents to be shown fully */}
      <Offset />
    </React.Fragment>
  );
};

export default Navbar;
