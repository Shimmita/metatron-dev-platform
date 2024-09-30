import {
  AccountBox,
  AddRounded,
  BookmarkRounded,
  CalendarMonthRounded,
  Close,
  DarkMode,
  Download,
  Email,
  ExpandLess,
  ExpandMore,
  Lightbulb,
  LiveTvRounded,
  MenuRounded,
  MonetizationOn,
  Notifications,
  People,
  PeopleRounded,
  PersonAddRounded,
  PostAdd,
  QuestionMark,
  Report,
  SchoolRounded,
  SearchRounded,
  Settings,
  Smartphone,
  Support
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import AppLogo from "../../images/logo_sm.png";
import { resetDarkMode, showMessagingDrawer } from "../../redux/AppUI";
import AccountLevelStep from "../level/AccountLevel";
import Messaging from "../messaging/Messaging";
import EventsAddModal from "../modal/EventsAddModal";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

//fix the appbar contents not showing full when set fixed
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Navbar = ({ setMode, mode }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAccountMore, setOpenAccountMore] = useState(false);
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);

  // control opening of the events modal
  const [openModalEventAdd, setOpenModalEventAdd] = useState(false);

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navigate = useNavigate();

  const handleShowMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
  };

  // screen width
  const screenWidth = window.screen.availWidth;

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

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

  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // show posts
  const handleShowMyPost = () => {
    navigate("/account/posts");
    handleCloseDrawer();
  };

  // show people
  const handleShowMyPeople = () => {
    navigate("/account/people");
    handleCloseDrawer();
  };

  // show settings
  const handleShowSettings = () => {
    navigate("/account/settings");
    handleCloseDrawer();
  };

  // show premium
  const handleShowPremium = () => {
    navigate("/account/premium");
    handleCloseDrawer();
  };
  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // alter the light/ dark mode
    dispatch(resetDarkMode());
  };

  // show frequent questions
  const handleShowQuestions = () => {
    navigate("/help/quiz");
    handleCloseDrawer();
  };

  // handle show report user
  const handleShowReportUser = () => {
    navigate("/help/report");
    handleCloseDrawer();
  };

  // handle show assistance email
  const handleShowEmailAssist = () => {
    navigate("/help/email");
    handleCloseDrawer();
  };

  // handle show about page
  const handleShowAboutPage = () => {
    navigate("/about");
    handleCloseDrawer();
  };

  // home page
  const handleHome = () => navigate("/");

  // show the messaing drawer bdy the help of redux toolkit
  const handleShowMessageDrawer = () => {
    dispatch(showMessagingDrawer());
  };

  // events
  const handleEventsLive = () => {
    navigate("events/live");
    handleCloseDrawer();
  };

  const handleEventsAdd = () => {
    setOpenModalEventAdd(!openModalEventAdd);
    // close the drawer
    handleCloseDrawer();
  };

  const handleEventsUpcoming = () => {
    navigate("events/upcoming");
    handleCloseDrawer();
  };
  const handleEventsBookMarks = () => {
    navigate("events/bookmarks");
    handleCloseDrawer();
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" elevation={5} enableColorOnDark>
        <MetatronToolBar>
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
                  <Typography fontWeight={"bold"}>METATRON</Typography>
                </IconButton>
              </Tooltip>
            </Box>
          </LogoContent>

          {/* show logo content on the small devices searchIcon  not clicked */}
          {!showMobileSearch && (
            <LogoContent
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
              }}
            >
              {/* show menu on small devices only not tab+laps+desk */}
              {!CustomDeviceTablet() && (
                <IconButton onClick={(e) => setOpenDrawer(!openDrawer)}>
                  <MenuRounded style={{ color: "white" }} />
                </IconButton>
              )}
              {/* tablet show KE Flag not on smaller Devices */}
              {CustomDeviceTablet() ? (
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <Avatar
                    alt="KE"
                    src={AppLogo}
                    sx={{ width: 38, height: 38 }}
                  />

                  <Tooltip arrow title={"home"}>
                    <IconButton onClick={handleHome} style={{ color: "white" }}>
                      <Typography fontWeight={"bold"}>METATRON</Typography>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Tooltip arrow title={"home"}>
                  <IconButton onClick={handleHome} style={{ color: "white" }}>
                    <Typography fontWeight={"bold"}>METATRON</Typography>
                  </IconButton>
                </Tooltip>
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
                <form className="d-flex  ps-5 ms-5">
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
              <>
                <Tooltip arrow title={"notifications"}>
                  <Badge badgeContent={1} color="error">
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={handleShowMessageDrawer}
                    >
                      <Notifications
                        sx={{ width: 25, height: 25, color: "white" }}
                      />
                    </IconButton>
                  </Badge>
                </Tooltip>
                &nbsp;
                <Tooltip arrow title={"profile"}>
                  <IconButton>
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      src={devImage}
                      alt={"user image"}
                    />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </IconsContainer>
        </MetatronToolBar>

        {/* drawer  tablet and samall screen */}
        <Drawer open={openDrawer} onClose={(e) => setOpenDrawer(false)}>
          <Box
            maxWidth={300}
            height={"100%"}
            bgcolor={"background.default"}
            color={"text.primary"}
          >
            <AppBar position="sticky" elevation={0}>
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignContent: "center",
                }}
              >
                <Avatar alt="KE" src={AppLogo} sx={{ width: 28, height: 28 }} />
                <Typography variant="body2">METATRON</Typography>|
                <Typography variant="body2">FREE PLAN</Typography>
              </Toolbar>
            </AppBar>

            <BoxAvatarContent>
              <Box width={"100%"} className="profile-header">
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={1}
                >
                  <Avatar
                    alt={"user image"}
                    src={devImage}
                    sx={{ width: 70, height: 70, marginTop: 0 }}
                  />
                </Box>
              </Box>

              <Typography
                textAlign={"center"}
                fontWeight={"bold"}
                color={"primary"}
              >
                SHIMITA DOUGLAS
              </Typography>

              <Typography
                maxWidth={screenWidth > 1250 ? 300 : 250}
                className="px-2"
                textTransform={"capitalize"}
                color={"text.secondary"}
                variant="body2"
              >
                Software developer specialized in React, Nodejs, Django and
                Android
              </Typography>

              <Box
                width={250}
                p={1}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
              >
                {/* following */}
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box alignItems={"center"} display={"flex"} gap={1}>
                    <Tooltip title={"view"}>
                      <IconButton size="small" className="border">
                        <PersonAddRounded color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Following</Typography>
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={"bold"}
                      color={"primary"}
                      variant="body2"
                    >
                      100
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  {/* followers */}
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Box alignItems={"center"} display={"flex"} gap={1}>
                      <Tooltip title={"view"}>
                        <IconButton size="small" className="border">
                          <PeopleRounded color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2">Followers</Typography>
                    </Box>
                    <Box>
                      <Typography
                        fontWeight={"bold"}
                        color={"primary"}
                        variant="body2"
                      >
                        1800
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </BoxAvatarContent>

            <Typography
              fontWeight={"bold"}
              mt={3}
              textAlign={"center"}
              color={"primary"}
            >
              NAVIGATION MENU
            </Typography>

            <List>
              <ListItemButton
                onClick={(e) => setOpenAccountMore(!openAccountMore)}
              >
                <ListItemIcon>
                  <AccountBox color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Account Update</Typography>
                  }
                />
                {openAccountMore ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse
                className=" border-top"
                in={openAccountMore}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowMyPost}>
                    <ListItemIcon>
                      <PostAdd color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2">Posts</Typography>}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowMyPeople}>
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2">Friends</Typography>}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowSettings}>
                    <ListItemIcon>
                      <Settings color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Settings</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowPremium}>
                    <ListItemIcon>
                      <MonetizationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2">Premium</Typography>}
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton onClick={(e) => setOpenEvents(!openEvents)}>
                <ListItemIcon>
                  <SchoolRounded color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Learning Events</Typography>
                  }
                />
                {openEvents ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse
                className=" border-top"
                in={openEvents}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 8 }} onClick={handleEventsLive}>
                    <ListItemIcon>
                      <LiveTvRounded color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" display={"flex"} gap={2}>
                          <span>Live Stream</span> <span>70</span>{" "}
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleEventsUpcoming}>
                    <ListItemIcon>
                      <CalendarMonthRounded
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" display={"flex"} gap={2}>
                          <span>Upcoming</span> <span>200</span>{" "}
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 8 }}
                    onClick={handleEventsBookMarks}
                  >
                    <ListItemIcon>
                      <BookmarkRounded color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" display={"flex"} gap={2}>
                          <span>Bookmarks</span> <span>10</span>{" "}
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleEventsAdd}>
                    <ListItemIcon>
                      <AddRounded color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Create Event</Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton onClick={(e) => setOpenHelp(!openHelp)}>
                <ListItemIcon>
                  <Support color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Help Center Menu</Typography>
                  }
                />
                {openHelp ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse
                className=" border-top"
                in={openHelp}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowAboutPage}>
                    <ListItemIcon>
                      <Lightbulb color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">About Us</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowReportUser}>
                    <ListItemIcon>
                      <Report color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Report User </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 8 }} onClick={handleShowQuestions}>
                    <ListItemIcon>
                      <QuestionMark color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Frequent Quizes</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 8 }}
                    onClick={handleShowEmailAssist}
                  >
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          Assistance Email
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton onClick={(e) => setOpenMobileApp(!openMobileApp)}>
                <ListItemIcon>
                  <Smartphone color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Install App Menu</Typography>
                  }
                />
                {openMobileApp ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse
                className=" border-top"
                in={openMobileApp}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 8 }}>
                    <ListItemIcon>
                      <Download color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Download</Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton
                LinkComponent={"a"}
                href="#home"
                onClick={handleShowDarkMode}
              >
                <ListItemIcon>
                  <DarkMode color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Change Theme</Typography>
                  }
                />
                <Switch
                  checked={isDarkMode}
                  onChange={(e) => setMode(mode === "light" ? "dark" : "light")}
                />
              </ListItemButton>
              <Divider component={"li"} />
              {/* show account level status */}
              <Box paddingLeft={1} paddingRight={1} mt={1}>
                <AccountLevelStep />
              </Box>
            </List>
          </Box>
        </Drawer>

        {/* notif and messaging to the left for large screens and right on tabs and top on small devices */}
        <Messaging />

        {/* EventsAdd Modal to be displayed if toggled */}
        <EventsAddModal
          openModalEventAdd={openModalEventAdd}
          setOpenModalEventAdd={setOpenModalEventAdd}
        />
      </AppBar>

      {/* fix the contents to be shown fully */}
      <Offset />
    </React.Fragment>
  );
};

export default Navbar;
