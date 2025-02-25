import {
  BusinessRounded,
  CoffeeRounded,
  Home,
  LightModeOutlined,
  LightModeRounded,
  LogoutRounded,
  PsychologyRounded,
  Smartphone,
  SupportAgentRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Divider,
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

import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import logoCompany from "../../images/logo_sm.png";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { handleShowChatBot } from "../../redux/CurrentChatBot";
import EventsTablet from "../events/EventsIsTablet";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const AlertSponsorship = lazy(() => import("../alerts/AlertSponsorship"));
const AlertSupport = lazy(() => import("../alerts/AlertSupport"));
const SkillAvatars = lazy(() => import("./SkillAvatars"));
const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Sidebar = () => {
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [openSupportAlert, setOpenAlertSupport] = useState(false);

  // redux sates
  const {
    isDarkMode,
    isSidebarRighbar,
    isTabSideBar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

  const { user } = useSelector((state) => state.currentUser);

  // alert logout controls
  const [openAlertLogout, setOpenAlertLogout] = useState(false);
  const [openSponsorAlert, setOpenSponsorAlert] = useState(false);

  const navigate = useNavigate();
  // screen width
  const screenWidth = window.screen.availWidth;

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
    // update the bottom nav counter
    dispatch(updateCurrentBottomNav(0));
    navigate("/");
  };

  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
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

  // handle logout
  const handleLogout = () => {
    setOpenAlertLogout(true);
  };

  // handle showing of technical support
  const handleTechnicalSupport = () => {
    setOpenAlertSupport(true);
  };

  let businessAccount = false;

  // handle showing of the sponsorship program
  const handleShowingSponsorship = () => {
    setOpenSponsorAlert(true);
  };

  // handle the display of the metatron ai assistant
  const handleShowAiBot = () => {
    // close the drawer
    dispatch(handleShowChatBot());
  };

  return (
    <Box
      height={"90vh"}
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
      <Box
        position={"fixed"}
        className={
          CustomDeviceIsSmall() ||
          (CustomDeviceTablet() ? "shadow rounded" : "rounded")
        }
        width={correctWidthInPercentage()}
        maxHeight={"88vh"}
        sx={{
          border:
            (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
              ? "1px solid"
              : "1px solid",
          borderColor:
            (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
              ? "divider"
              : "divider",
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
        <Box width={CustomLandscapeWidest() ? 300 : undefined}>
          <Box bgcolor={"background.default"} className=" rounded mt-0">
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
                    <Box className={isDarkMode && "bg-dark rounded-top"}>
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        p={1}
                      >
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar
                            alt={user?.name?.split(" ")[0]}
                            src={
                              !businessAccount
                                ? devImage || logoCompany
                                : logoCompany || logoCompany
                            }
                            sx={{ width: 70, height: 70 }}
                          />
                        </StyledBadge>
                      </Box>
                      <Box display={"flex"} justifyContent={"center"} pb={2}>
                        {!businessAccount ? (
                          <React.Fragment>
                            {/* shown for personal a/c */}
                            <SkillAvatars user={user} isDarkMode={isDarkMode} />
                          </React.Fragment>
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
                                  color={
                                    isDarkMode ? "black" : "text.secondary"
                                  }
                                >
                                  Software and Machine Learning Development
                                  Company In Kenya
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </BoxAvatarContent>
              </React.Fragment>
            )}
          </Box>
          {/* divider */}
          <Divider component={"div"} className="mb-2" />

          <Box bgcolor={"background.default"} className="p-1">
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              pt={1}
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

                {/* install app */}
                <ListItemButton
                  onClick={(e) => setOpenMobileApp(!openMobileApp)}
                >
                  <ListItemIcon>
                    <Smartphone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">Download</Typography>}
                  />
                </ListItemButton>

                {/* metatron ai chat */}
                <ListItemButton onClick={handleShowAiBot}>
                  <ListItemIcon>
                    <PsychologyRounded
                      sx={{ width: 26, height: 26 }}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">Dynamo AI</Typography>}
                  />
                </ListItemButton>
              </List>
            )}
          </Box>

          {/* box for Events displayed for tablets only */}
          {CustomDeviceTablet() && (
            <React.Fragment>
              {/* divider be shown on tablets */}
              <Divider component={"div"} className="mb-2" />

              <Box bgcolor={"background.default"} className="p-1">
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography fontWeight={"bold"} color={"primary"}>
                    DEV SPACE EVENTS
                  </Typography>
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
            </React.Fragment>
          )}

          <Divider component={"div"} className="mt-1" />

          {/* slogan */}
          {isLoadingRequest ? (
            <Box bgcolor={"background.default"} className="mt-3  p-2 rounded">
              <Skeleton variant="rectangular" width={"100%"} height={"10vh"} />
            </Box>
          ) : (
            <Box bgcolor={"background.default"}>
              <List>
                <ListItem>
                  {!businessAccount ? (
                    <>
                      {/* personal a/c */}
                      <ListItemIcon>
                        <Avatar
                          src={logoCompany}
                          sx={{ width: 32, height: 32 }}
                          alt="logo"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            width={175}
                            fontWeight={"bold"}
                            variant="body1"
                            color={"primary"}
                            sx={{ textTransform: "uppercase" }}
                          >
                            {" "}
                            Best IT Platform
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
                <ListItemButton onClick={handleTechnicalSupport}>
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

                {/* sponsor us */}
                <ListItemButton onClick={handleShowingSponsorship}>
                  <ListItemIcon>
                    <CoffeeRounded color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">Sponsor Platform</Typography>
                    }
                  />
                </ListItemButton>

                {/* change theme */}
                <ListItemButton onClick={handleShowDarkMode}>
                  <ListItemIcon>
                    {isDarkMode ? (
                      <LightModeRounded color="warning" />
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
                  <Switch disableRipple size="small" checked={isDarkMode} />
                </ListItemButton>
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {/* control showing of sponsorship alert */}
      <AlertSponsorship
        openSponsorAlert={openSponsorAlert}
        setOpenSponsorAlert={setOpenSponsorAlert}
        isLaunchPage={true}
      />

      {/* alert technical support */}
      <AlertSupport
        openSupportAlert={openSupportAlert}
        setOpenAlertSupport={setOpenAlertSupport}
      />

      {/* logout alert */}
      <LogoutAlert
        openAlertLogout={openAlertLogout}
        setOpenAlertLogout={setOpenAlertLogout}
      />
    </Box>
  );
};

export default Sidebar;
