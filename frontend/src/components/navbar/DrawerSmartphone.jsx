import {
  AddRounded,
  BookmarkRounded,
  CalendarMonthRounded,
  CoffeeRounded,
  EventNoteRounded,
  ExpandLess,
  ExpandMore,
  LightModeOutlined,
  LightModeRounded,
  LiveTvRounded,
  LogoutRounded,
  PsychologyRounded,
  SchoolRounded,
  Smartphone,
  SupportAgentRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import { default as logoCompany } from "../../images/logo_sm.png";
import { resetDarkMode } from "../../redux/AppUI";
import { handleShowChatBot } from "../../redux/CurrentChatBot";
import SkillAvatars from "../sidebar/SkillAvatars";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const AlertSponsorship = lazy(() => import("../alerts/AlertSponsorship"));
const AlertSupport = lazy(() => import("../alerts/AlertSupport"));
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

const DrawerSmartphone = ({
  openDrawer,
  setOpenDrawer,
  openModalEventAdd,
  setOpenModalEventAdd,
}) => {
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);
  // alert logout controls
  const [openAlertLogout, setOpenAlertLogout] = useState(false);
  const [openSupportAlert, setOpenAlertSupport] = useState(false);
  const [openSponsorAlert, setOpenSponsorAlert] = useState(false);

  const navigate = useNavigate();

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);

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

  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
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

  // simulate bs a/c and personal a/c transition
  let businessAccount = false;

  // handle logout
  const handleLogout = () => {
    setOpenAlertLogout(true);
  };
  // handle showing of technical support
  const handleTechnicalSupport = () => {
    setOpenAlertSupport(true);
  };

  // handle showing of the sponsorship program
  const handleShowingSponsorship = () => {
    setOpenSponsorAlert(true);
  };

  // handle the display of the metatron ai assistant
  const handleShowAiBot = () => {
    // close the drawer
    setOpenDrawer(false);
    dispatch(handleShowChatBot());
  };

  return (
    <Drawer open={openDrawer} onClose={(e) => setOpenDrawer(false)}>
      <Box maxWidth={300} height={"100%"} bgcolor={"background.default"}>
        <BoxAvatarContent>
          <Box>
            <Box width={"100%"} className={isDarkMode && "bg-dark rounded-top"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                className="p-1 pt-4"
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
                    alt={"user image"}
                    src={
                      !businessAccount
                        ? devImage || logoCompany
                        : logoCompany || logoCompany
                    }
                    sx={{ width: 70, height: 70 }}
                  />
                </StyledBadge>
              </Box>
              <Box
                width={CustomLandscapeWidest() ? 300 : 250}
                display={"flex"}
                justifyContent={"center"}
                mt={1}
                pb={1}
              >
                {!businessAccount ? (
                  <>
                    {/* shown for personal a/c */}
                    <SkillAvatars isDarkMode={isDarkMode} user={user} />
                  </>
                ) : (
                  <>
                    {/* shown for businesss a/c */}
                    <Box width={CustomLandscapeWidest() ? 260 : 250}>
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
                          gap={1}
                          color={isDarkMode ? "black" : "text.secondary"}
                        >
                          Software and Machine Learning Development Company In
                          Kenya
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
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
          <ListItemButton onClick={(e) => setOpenMobileApp(!openMobileApp)}>
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

          {/* sponsor us */}
          <ListItemButton onClick={handleShowingSponsorship}>
            <ListItemIcon>
              <CoffeeRounded color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  <Typography variant="body2">Sponsor Platform</Typography>
                </Typography>
              }
            />
          </ListItemButton>

          <ListItemButton onClick={(e) => setOpenEvents(!openEvents)}>
            <ListItemIcon>
              <SchoolRounded color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">Dev Space Events</Typography>
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

          {/* divider */}
          <Divider component={"div"} className="p-1" />

          {/* more */}

          <Box bgcolor={"background.default"}>
            <List>
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
        </List>
      </Box>

      {/* control showing of sponsorship alert */}
      <AlertSponsorship
        openSponsorAlert={openSponsorAlert}
        setOpenSponsorAlert={setOpenSponsorAlert}
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
    </Drawer>
  );
};

export default DrawerSmartphone;
