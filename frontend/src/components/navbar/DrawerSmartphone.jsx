import {
  AccountBox,
  AddRounded,
  AndroidRounded,
  Apple,
  BookmarkRounded,
  CalendarMonthRounded,
  Diversity3Rounded,
  EventNoteRounded,
  ExpandLess,
  ExpandMore,
  Home,
  InfoRounded,
  Lightbulb,
  LightModeOutlined,
  LightModeRounded,
  LiveTvRounded,
  MonetizationOn,
  PostAdd,
  SchoolRounded,
  Settings,
  Smartphone,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CardActionArea,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
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
import FlagLogo from "../../images/KE.png";
import AppLogo from "../../images/logo_sm.png";
import { resetDarkMode } from "../../redux/AppUI";
import AccountLevelStep from "../level/AccountLevel";
import SkillAvatars from "../sidebar/SkillAvatars";

const DrawerSmartphone = ({
  openDrawer,
  setOpenDrawer,
  mode,
  setMode,
  openModalEventAdd,
  setOpenModalEventAdd,
}) => {
  const [openAccountMore, setOpenAccountMore] = useState(false);
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);
  // screen width
  const screenWidth = window.screen.availWidth;

  const navigate = useNavigate();

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });

  //   handle closing of the drawer
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // show posts
  const handleShowMyPost = () => {
    navigate("/account/posts");
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
    setMode(mode === "light" ? "dark" : "light");
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };

  // handle show about page
  const handleShowAboutPage = () => {
    navigate("/about");
    handleCloseDrawer();
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

  // show people
  const handleShowMyNetwork = () => {
    navigate("/account/people");
    handleCloseDrawer();
  };
  // navigate home

  // return home
  const handleReturnHome = () => {
    navigate("/");
    handleCloseDrawer();
  };

  return (
    <Drawer open={openDrawer} onClose={(e) => setOpenDrawer(false)}>
      <Box
        maxWidth={300}
        height={"100%"}
        bgcolor={"background.default"}
        color={"text.primary"}
      >
        <AppBar  position="sticky" elevation={0}>
          <Toolbar
          variant="dense"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Avatar alt="logo" src={AppLogo} sx={{ width: 35, height: 35 }} />
            <Typography variant="body2">FREE</Typography>
          </Toolbar>
        </AppBar>

        <BoxAvatarContent>
          <Box>
            <Box
              width={"100%"}
              className={isDarkMode ? "profile-header" : undefined}
            >
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
              <Box
                width={screenWidth > 1250 ? 300 : 250}
                display={"flex"}
                justifyContent={"center"}
                mt={1}
                pb={1}
              >
                <SkillAvatars />
              </Box>
            </Box>
          </Box>
        </BoxAvatarContent>

        {/* connections */}
        <CardActionArea onClick={handleShowMyNetwork}>
          <Box
            display={"flex"}
            mt={2}
            alignItems={"center"}
            className="px-2"
            p={1}
            justifyContent={"space-between"}
          >
            <Box pl={1} alignItems={"center"} display={"flex"} gap={1}>
              <Tooltip title={"view"}>
                <Diversity3Rounded color="primary" />
              </Tooltip>
              <Typography variant="body2">Network</Typography>
            </Box>

            <Box>
              <Typography fontWeight={"bold"} color={"primary"} variant="body2">
                500
              </Typography>
            </Box>
          </Box>
        </CardActionArea>

        <Typography
          fontWeight={"bold"}
          mt={3}
          textAlign={"center"}
          color={"primary"}
        >
          NAVIGATION MENU
        </Typography>

        <List>
          <ListItemButton onClick={handleReturnHome}>
            <ListItemIcon>
              <Home color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2"> Homepage</Typography>}
            />
          </ListItemButton>

          <ListItemButton onClick={(e) => setOpenAccountMore(!openAccountMore)}>
            <ListItemIcon>
              <AccountBox color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2">Account Status</Typography>}
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

              <ListItemButton sx={{ pl: 8 }} onClick={handleShowSettings}>
                <ListItemIcon>
                  <Settings color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">Settings</Typography>}
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
              primary={<Typography variant="body2">Learning Events</Typography>}
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
                  <LiveTvRounded color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" display={"flex"} gap={2}>
                      Live Stream
                    </Typography>
                  }
                />
                <Typography variant="body2" color={"text.secondary"}>
                  100
                </Typography>
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
                      Upcoming
                    </Typography>
                  }
                />
                <Typography variant="body2" color={"text.secondary"}>
                  20
                </Typography>
              </ListItemButton>

              <ListItemButton sx={{ pl: 8 }} onClick={handleEventsBookMarks}>
                <ListItemIcon>
                  <BookmarkRounded color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" display={"flex"} gap={2}>
                      Bookmarks
                    </Typography>
                  }
                />
                <Typography variant="body2" color={"text.secondary"}>
                  10
                </Typography>
              </ListItemButton>

              <ListItemButton sx={{ pl: 8 }} onClick={handleEventsAdd}>
                <ListItemIcon>
                  <EventNoteRounded color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">Create Event</Typography>
                  }
                />
                <AddRounded sx={{ color: "grey" }} />
              </ListItemButton>
            </List>
          </Collapse>

          {/* about */}
          <ListItemButton onClick={handleShowAboutPage}>
            <ListItemIcon>
              <Lightbulb color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2">About Metatron</Typography>}
            />
          </ListItemButton>

          <ListItemButton onClick={(e) => setOpenMobileApp(!openMobileApp)}>
            <ListItemIcon>
              <Smartphone color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2">Download App </Typography>}
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
                  <AndroidRounded color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">Android</Typography>}
                />
              </ListItemButton>

              <ListItemButton sx={{ pl: 8 }}>
                <ListItemIcon>
                  <Apple color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">iOS</Typography>}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* change theme */}
          <ListItem>
            <ListItemIcon>
              {isDarkMode ? (
                <LightModeRounded color="primary" />
              ) : (
                <LightModeOutlined color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <Typography variant="body2">Change Theme</Typography>
                </Typography>
              }
            />
            <Switch
              size="small"
              checked={isDarkMode}
              onChange={handleShowDarkMode}
            />
          </ListItem>
          <Divider component={"li"} className="mt-2" />

          {/* show account level status */}
          <Box p={2} mt={1}>
            <AccountLevelStep />
          </Box>
          {/* slogan */}
          <Box p={2}>
            <Box display={"flex"} alignItems={"center"}>
              <Avatar src={FlagLogo} alt="flag" />
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                m={"0 auto"}
              >
                <Typography
                  fontWeight={"bold"}
                  color={"text.secondary"}
                  className="w-100"
                  textAlign={"center"}
                  variant="body2"
                >
                  Best IT Platform
                </Typography>

                <Button
                  endIcon={<InfoRounded />}
                  color="success"
                  disableElevation
                  sx={{ textTransform: "capitalize" }}
                >
                  Free Version
                </Button>
              </Box>
            </Box>
          </Box>
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerSmartphone;
