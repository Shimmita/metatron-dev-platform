import {
  CoffeeRounded,
  DarkModeRounded,
  Smartphone,
  SupportAgentRounded,
  TipsAndUpdatesRounded
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  styled,
  Typography
} from "@mui/material";

import {
  resetDarkMode,
  showAboutMetatron,
  showSponsorAlert,
  showSupportAlert,
} from "../../redux/AppUI";

import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import devImage from "../../images/dev.jpeg";
import logoCompany from "../../images/logo_sm.png";
import { handleShowChatBot } from "../../redux/CurrentChatBot";
import AlertGeneral from "../alerts/AlertGeneral";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const SkillAvatars = lazy(() => import("./SkillAvatars"));

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

  // redux sates
  const {
    isDarkMode,
    isSidebarRighbar,
    isTabSideBar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

  const { user } = useSelector((state) => state.currentUser);

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

  };

  // fun to make the sidebar equidistant from the feed in relation to the rightbar
  // for larger screens like laptops above 1400
  const equidistantSidebar = (screen) => {
    if (screenWidth > 1400) {
      return "8%";
    }
  };

  // handle showing of technical support
  const handleTechnicalSupport = () => {
    dispatch(showSupportAlert(true));
  };

  let businessAccount = false;

  // handle showing of the sponsorship program
  const handleShowingSponsorship = () => {
    dispatch(showSponsorAlert(true));
  };

  // handle the display of the metatron ai assistant
  const handleShowAiBot = () => {
    // close the drawer
    dispatch(handleShowChatBot());
  };

  // handle showing about metatron platform
  const handleShowAboutMetatron = () => {
    dispatch(showAboutMetatron(true));
  };

  // handle showing of the alert mobile app not yet developed
  const handleMobileApp=()=>{
    setOpenMobileApp(prev=>!prev)
  }
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
          <Box bgcolor={"background.default"} className=" rounded">
            {isLoadingRequest ? (
              <Box width={"100%"}>
                <Box mb={1} display={"flex"} justifyContent={"center"}>
                  <Skeleton variant="circular" width={80} height={80} />
                </Box>
                <Skeleton variant="rectangular" height={"20vh"} />
              </Box>
            ) : (
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
                          sx={{ width: 100, height: 100, mt: 1 }}
                        />
                      </StyledBadge>
                    </Box>
                    <Box display={"flex"} justifyContent={"center"} pb={2}>
                      <SkillAvatars user={user} isDarkMode={isDarkMode} />
                    </Box>
                  </Box>
                </Box>
              </BoxAvatarContent>
            )}
          </Box>

          <Divider component="div" />
          <Box bgcolor={"background.default"} p={1}>
            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"35vh"} />
            ) : (
              <List>
                {/* metatron ai chat */}
                {/* <ListItemButton onClick={handleShowAiBot}>
                  <ListItemIcon>
                    <ChatBubbleRounded sx={{ width: 27, height: 27 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">Metatron Agent</Typography>
                    }
                  />
                </ListItemButton> */}

                {/* customer help */}
                <ListItemButton onClick={handleTechnicalSupport}>
                  <ListItemIcon>
                    <SupportAgentRounded
                      color="primary"
                      sx={{ width: 28, height: 28 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">Technical Team</Typography>
                    }
                  />
                </ListItemButton>

                {/* install app */}
                <ListItemButton onClick={handleMobileApp}>
                  <ListItemIcon>
                    <Smartphone
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">Download App</Typography>
                    }
                  />
                </ListItemButton>

                {/* sponsor us */}
                <ListItemButton onClick={handleShowingSponsorship}>
                  <ListItemIcon>
                    <CoffeeRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">Sponsor Team</Typography>
                    }
                  />
                </ListItemButton>

                {/* about metatron */}
                <ListItemButton onClick={handleShowAboutMetatron}>
                  <ListItemIcon>
                    <TipsAndUpdatesRounded
                      color="primary"
                      sx={{ width: 28, height: 28 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">About Metatron</Typography>
                    }
                  />
                </ListItemButton>

                {/* change theme */}
                <ListItemButton onClick={handleShowDarkMode}>
                  <ListItemIcon>
                    <DarkModeRounded
                      sx={{ width: 28, height: 28 }}
                      color={isDarkMode ? "warning" : undefined}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {isDarkMode ? "Try Light Mode" : "Try Dark Mode"}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </List>
            )}
          </Box>

          {/* events to be implemented later */}
          {/* box for Events displayed for tablets only */}
          {/* {CustomDeviceTablet() && (
            <React.Fragment>
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
          )} */}
        </Box>
      </Box>

      {/* alert General for mobile app under development */}
      <AlertGeneral
        title={"Mobile App"}
        message={"Mobile application is still under development once completed by our esteemed software engineers, it will be rolled out."}
        openAlertGeneral={openMobileApp}
        setOpenAlertGenral={setOpenMobileApp}
        defaultIcon={<Smartphone/>}
      />
    </Box>
  );
};

export default Sidebar;
