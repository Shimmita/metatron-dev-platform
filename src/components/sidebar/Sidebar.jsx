import {
  AccountBox,
  AndroidRounded,
  Apple,
  DarkMode,
  Diversity3Rounded,
  ExpandLess,
  ExpandMore,
  Home,
  Lightbulb,
  MenuRounded,
  MonetizationOn,
  People,
  PostAdd,
  SchoolRounded,
  Settings,
  Smartphone
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CardActionArea,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  styled,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

import { resetDarkMode } from "../../redux/AppUI";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import EventsTablet from "../events/EventsIsTablet";
import AccountLevelStep from "../level/AccountLevel";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import "./Sidebar.css";
const Sidebar = ({ setMode, mode }) => {
  const [openAccountMore, setOpenAccountMore] = useState(false);
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const navigate = useNavigate();

  // screen width
  const screenWidth = window.screen.availWidth;

  // redux states
  const { isDarkMode, isSidebarRighbar } = useSelector((state) => state.appUI);

  const dispatch = useDispatch();

  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });

  // return home
  const handleReturnHome = () => {
    navigate("/");
  };

  // show posts
  const handleShowMyPost = () => {
    navigate("/account/posts");
  };

  // show people
  const handleShowMyPeople = () => {
    navigate("/account/people");
  };

  // show settings
  const handleShowSettings = () => {
    navigate("/account/settings");
  };

  // show premium
  const handleShowPremium = () => {
    navigate("/account/premium");
  };
  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // alter the light/ dark mode
    dispatch(resetDarkMode());
  };

  // handle show about page
  const handleShowAboutPage = () => {
    navigate("/about");
  };

  // return the screen width in parcentage for wider screens
  // to handle correct positioning issues with middle content feed

  const correctWidthInPercentage = () => {
    if (screenWidth > 1200 && screenWidth <= 1400) {
      return "21%";
    }

    return;
  };

  // fun to make the sidebar equidistant from the feed in relation to the rightbar
  // for larger screens like laptops above 1400
  const equidistantSidebar = (screen) => {
    if (screenWidth > 1400) {
      return "8%";
    }
    return;
  };

  // simulate loading of the request
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);

  return (
    <Box
      mt={CustomDeviceTablet() && 1}
      flex={CustomDeviceTablet() ? 1 : 2}
      p={CustomDeviceTablet() ? 1 : 2}
      marginLeft={equidistantSidebar()}
      sx={{
        display: {
          xs: "none",
          sm: CustomDeviceTablet()
            ? isSidebarRighbar
              ? "block"
              : "none"
            : "none",
          md: isSidebarRighbar ? "block" : "none",
          marginRight: CustomDeviceTablet() && "5rem",
        },
      }}
    >
      <Box position={"fixed"} width={correctWidthInPercentage()}>
        <Box>
          <Box bgcolor={"background.default"} className="shadow rounded mt-0">
            {isLoadingRequest ? (
              <Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <Skeleton variant="circular" width={70} height={70} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={screenWidth > 1250 ? 300 : 250}
                  height={"20vh"}
                />
              </Box>
            ) : (
              <React.Fragment>
                <BoxAvatarContent>
                  <Box>
                    <Box width={"100%"} className="profile-header rounded">
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

                    <Box>
                      <Typography
                        textAlign={"center"}
                        fontWeight={"bold"}
                        gutterBottom
                        color={"primary"}
                      >
                        SHIMITA DOUGLAS
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        maxWidth={screenWidth > 1250 ? 300 : 250}
                        className="px-2 navbar-text "
                        textTransform={"capitalize"}
                        textAlign={"center"}
                        color={"text.secondary"}
                        variant="body2"
                      >
                        Software Engineer specialized in React, Nodejs, Python
                        and Android
                      </Typography>
                    </Box>
                  </Box>
                </BoxAvatarContent>

                {/* connections */}
                <CardActionArea>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    className="px-2 mt-2"
                    p={1}
                    justifyContent={"space-between"}
                  >
                    <Box pl={1} alignItems={"center"} display={"flex"} gap={1}>
                      <Tooltip title={"view"}>
                        <Diversity3Rounded color="primary" />
                      </Tooltip>
                      <Typography
                        color={"text.secondary"}
                        fontWeight={"bold"}
                        variant="body2"
                      >
                        Connections
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={"bold"}
                        color={"primary"}
                        variant="body2"
                      >
                        520
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
              </React.Fragment>
            )}
          </Box>

          <Box
            bgcolor={"background.default"}
            className="p-1 shadow rounded mt-3"
          >
            <Typography
              alignItems={"center"}
              display={"flex"}
              justifyContent={"center"}
              gap={2}
              className=" mt-2"
              fontWeight={"bold"}
              textAlign={"center"}
              color={"primary"}
            >
              <span className="pt-1">NAVIGATION MENU </span>{" "}
              <MenuRounded sx={{ width: 23, height: 23 }} />
            </Typography>

            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"35vh"} />
            ) : (
              <List>
                <ListItemButton onClick={handleReturnHome}>
                  <ListItemIcon>
                    <Home color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2"> Homepage</Typography>}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={(e) => setOpenAccountMore(!openAccountMore)}
                >
                  <ListItemIcon>
                    <AccountBox color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">Account Status </Typography>
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
                        primary={
                          <Typography variant="body2">Friends</Typography>
                        }
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
                        primary={
                          <Typography variant="body2">Premium</Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Collapse>

                {/* about */}
                <ListItemButton onClick={handleShowAboutPage}>
                  <ListItemIcon>
                    <Lightbulb color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">About Metatron</Typography>
                    }
                  />
                </ListItemButton>

                {/* install app */}

                <ListItemButton
                  onClick={(e) => setOpenMobileApp(!openMobileApp)}
                >
                  <ListItemIcon>
                    <Smartphone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">Download App </Typography>
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
                        <AndroidRounded color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">Android</Typography>
                        }
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
                      <Typography variant="body2">
                        <Typography variant="body2">Change Theme</Typography>
                      </Typography>
                    }
                  />
                  <Switch
                    checked={isDarkMode}
                    onChange={(e) =>
                      setMode(mode === "light" ? "dark" : "light")
                    }
                  />
                </ListItemButton>
                {/* show account level status */}
                <Box mt={1}>
                  <AccountLevelStep />
                </Box>
              </List>
            )}
          </Box>
          {/* box for Events displayed for tablets only */}
          {CustomDeviceTablet() && (
            <>
              <Box
                bgcolor={"background.default"}
                className="mt-3 shadow p-1 rounded"
              >
                <Typography
                  gutterBottom
                  alignItems={"center"}
                  display={"flex"}
                  gap={2}
                  fontWeight={"bold"}
                  justifyContent={"center"}
                  color={"primary"}
                >
                  <span className="pt-1">LEARNING EVENTS </span>{" "}
                  <SchoolRounded sx={{ width: 23, height: 23 }} />
                </Typography>

                {isLoadingRequest ? (
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"20vh"}
                  />
                ) : (
                  <EventsTablet />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
