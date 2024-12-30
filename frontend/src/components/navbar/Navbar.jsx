import {
  Close,
  FullscreenExitRounded,
  FullscreenRounded,
  MenuRounded,
  Notifications,
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

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import AppLogo from "../../images/logo_sm.png";
import { showMessagingDrawer, showTabSideBar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const EventsAddModal = lazy(() => import("../modal/EventsAddModal"));
const Messaging = lazy(() => import("../messaging/Messaging"));
const DrawerSmartphone = lazy(() => import("./DrawerSmartphone"));

//fix the appbar contents not showing full when set fixed
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Navbar = ({ setMode, mode }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // control opening of the events modal
  const [openModalEventAdd, setOpenModalEventAdd] = useState(false);

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // redux states
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleShowMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
  };

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

  // home page
  const handleHome = () => {
    // update the bottom nav counter
    dispatch(updateCurrentBottomNav(0));
    navigate("/");
  };

  // show the messaing drawer bdy the help of redux toolkit
  const handleShowMessageDrawer = () => {
    dispatch(showMessagingDrawer());
  };

  // handle full screen by collapsing side bar and showing menu on nav
  const handleFullscreenClicked = () => {
    setFullScreen((prev) => !prev);
    // alter display of sidebar from the redux
    dispatch(showTabSideBar());
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
                <>
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
                </>
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
                <form className="d-flex">
                  <Box>
                    <input
                      type="text"
                      placeholder={"search..."}
                      className="form-control w-100 border-0 text-secondary rounded-5"
                    />
                  </Box>

                  <Box>
                    <IconButton type="submit">
                      <SearchRounded
                        sx={{ width: 20, height: 20, color: "white" }}
                      />
                    </IconButton>
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
                <form className="d-flex gap-1 ps-5">
                  <Box>
                    <input
                      type="text"
                      placeholder={"search..."}
                      className="form-control w-100 border-0 text-secondary"
                    />
                  </Box>

                  <Box>
                    <IconButton type="submit">
                      <SearchRounded
                        sx={{ width: 20, height: 20, color: "white" }}
                      />
                    </IconButton>
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
                <Badge variant="dot" color="warning">
                  <Tooltip arrow title={"notifications"}>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={handleShowMessageDrawer}
                    >
                      <Notifications
                        sx={{ width: 27, height: 27, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Badge>
                <Tooltip arrow title={"profile"}>
                  <IconButton>
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

          {/* notif and messaging to the left for large screens and right on tabs and top on small devices */}
          <Messaging />

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
