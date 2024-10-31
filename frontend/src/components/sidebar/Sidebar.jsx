import {
  AccountBox,
  AndroidRounded,
  Apple,
  BusinessRounded,
  Diversity3Rounded,
  ExpandLess,
  ExpandMore,
  Home,
  Lightbulb,
  LightModeOutlined,
  LightModeRounded,
  LogoutRounded,
  MonetizationOn,
  PostAdd,
  SchoolRounded,
  Settings,
  Smartphone,
  StarRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  styled,
  Switch,
  Typography,
} from "@mui/material";

import { resetDarkMode } from "../../redux/AppUI";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import FlagLogo from "../../images/KE.png";
import LogoutAlert from "../alerts/LogoutAlert";
import EventsTablet from "../events/EventsIsTablet";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import SkillAvatars from "./SkillAvatars";
import("./Sidebar.css");

const Sidebar = ({ setMode, mode }) => {
  const [openAccountMore, setOpenAccountMore] = useState(false);
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const { isDarkMode, isSidebarRighbar, isTabSideBar } = useSelector(
    (state) => state.appUI
  );

  // alert logout controls
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  const navigate = useNavigate();
  // screen width
  const screenWidth = window.screen.availWidth;

  // redux states

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
  const handleShowMyNetwork = () => {
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
    setMode(mode === "light" ? "dark" : "light");
    // update the redux theme boolean state
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

  // handle logout
  const handleLogout = () => {
    setOpenAlertLogout(true);
  };

  let businessAccount = true;

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
            ? isSidebarRighbar && isTabSideBar
              ? "block"
              : "none"
            : "none",
          md: isSidebarRighbar ? "block" : "none",
          marginRight: CustomDeviceTablet() ? "6rem" : undefined,
        },
      }}
    >
      <Box position={"fixed"} width={correctWidthInPercentage()}>
        <Box width={CustomLandscapeWidest() ? 300 : undefined}>
          <Box bgcolor={"background.default"} className="shadow rounded mt-0">
            {isLoadingRequest ? (
              <Box width={"100%"}>
                <Box mb={1} display={"flex"} justifyContent={"center"}>
                  <Skeleton variant="circular" width={70} height={70} />
                </Box>
                <Skeleton variant="rectangular" height={"20vh"} />
              </Box>
            ) : (
              <React.Fragment>
                <BoxAvatarContent>
                  <Box width={"100%"}>
                    <Box className={isDarkMode ? "profile-header" : ""}>
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Avatar
                          alt={"user image"}
                          src={devImage}
                          sx={{ width: 60, height: 60 }}
                        />
                      </Box>
                      <Box display={"flex"} justifyContent={"center"} pb={2}>
                        {!businessAccount ? (
                          <>
                            {/* shown for personal a/c */}
                            <SkillAvatars />
                          </>
                        ) : (
                          <>
                            {/* shown for businesss a/c */}
                            <Box
                              p={1}
                              width={CustomLandscapeWidest() ? 260 : 250}
                            >
                              <Box>
                                <Typography
                                  fontWeight={"bold"}
                                  textAlign={"center"}
                                  variant="body2"
                                  gutterBottom
                                  textTransform={"uppercase"}
                                  color={isDarkMode ? "black" : "primary"}
                                >
                                  Metatron Foundation
                                </Typography>
                                <Typography
                                  textAlign={"center"}
                                  variant="body2"
                                  display={"flex"}
                                  alignItems={"center"}
                                  gap={1}
                                  color={
                                    isDarkMode ? "black" : "text.secondary"
                                  }
                                >
                                  <StarRounded sx={{ width: 12, height: 12 }} />
                                  Software and Machine Learning Development Company
                                  <StarRounded sx={{ width: 12, height: 12 }} />
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </BoxAvatarContent>

                {/* connections */}
                <List>
                  <ListItemButton onClick={handleShowMyNetwork}>
                    <ListItemIcon>
                      <Diversity3Rounded
                        color="primary"
                        sx={{ width: 26, height: 26 }}
                      />{" "}
                    </ListItemIcon>

                    {/* shown for personal */}
                    {!businessAccount ? (
                      <>
                        <ListItemText
                          primary={
                            <Typography variant="body2"> Network</Typography>
                          }
                        />
                        <Typography
                          fontWeight={"bold"}
                          color={"primary"}
                          variant="body2"
                        >
                          500
                        </Typography>
                      </>
                    ) : (
                      <>
                        {/* shown for business a/c */}
                        <ListItemText
                          primary={
                            <Typography variant="body2"> Followers</Typography>
                          }
                        />
                        <Typography
                          fontWeight={"bold"}
                          color={"primary"}
                          variant="body2"
                        >
                          500
                        </Typography>
                      </>
                    )}
                  </ListItemButton>
                </List>
              </React.Fragment>
            )}
          </Box>

          <Box
            bgcolor={"background.default"}
            className="p-1 shadow rounded mt-3"
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography fontWeight={"bold"} color={"primary"}>
                NAVIGATION MENU
              </Typography>
            </Box>

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
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={2}
                >
                  <Typography fontWeight={"bold"} color={"primary"}>
                    LEARNING EVENTS
                  </Typography>
                  <SchoolRounded
                    color="primary"
                    sx={{ width: 20, height: 20 }}
                  />
                </Box>

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

          {/* slogan */}

          {isLoadingRequest ? (
            <Box
              bgcolor={"background.default"}
              className="mt-3 shadow p-2 rounded"
            >
              <Skeleton variant="rectangular" width={"100%"} height={"10vh"} />
            </Box>
          ) : (
            <Box bgcolor={"background.default"} className="mt-3 shadow rounded">
              <List>
                <ListItem>
                  {!businessAccount ? (
                    <>
                      {/* personal a/c */}
                      <ListItemIcon>
                        <Avatar
                          src={FlagLogo}
                          sx={{ width: 26, height: 26 }}
                          alt="flag"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {" "}
                            Kenya's Best IT Platform
                          </Typography>
                        }
                      />
                    </>
                  ) : (
                    <>
                      {/* business a/c */}
                      <ListItemIcon>
                        <BusinessRounded color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {" "}
                            Business Account
                          </Typography>
                        }
                      />
                    </>
                  )}
                </ListItem>

                {/* customer help */}
                <ListItemButton onClick={handleReturnHome}>
                  <ListItemIcon>
                    <SupportAgentRounded color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">Technical Team</Typography>
                    }
                  />
                </ListItemButton>

                {/* Logout */}
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutRounded color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <Typography variant="body2">Account Logout</Typography>
                      </Typography>
                    }
                  />
                </ListItemButton>

                {/* change theme */}
                <ListItemButton onClick={handleShowDarkMode}>
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
                        <Typography variant="body2">Dark Theme</Typography>
                      </Typography>
                    }
                  />
                  <Switch disableRipple size="small" checked={isDarkMode} />
                </ListItemButton>
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {/* logout alert */}
      <LogoutAlert
        openAlertLogout={openAlertLogout}
        setOpenAlertLogout={setOpenAlertLogout}
      />
    </Box>
  );
};

export default Sidebar;
