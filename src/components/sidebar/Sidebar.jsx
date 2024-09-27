import {
  AccountBox,
  DarkMode,
  Download,
  Email,
  ExpandLess,
  ExpandMore,
  Home,
  Lightbulb,
  MonetizationOn,
  People,
  PostAdd,
  QuestionMark,
  Report,
  Settings,
  Smartphone,
  Support,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { resetDarkMode } from "../../redux/AppUI";

import React, { useState } from "react";
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
  const [openHelp, setOpenHelp] = useState(false);
  const navigate = useNavigate();

  // screen width
  const screenWidth = window.screen.availWidth;

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

  // show frequent questions
  const handleShowQuestions = () => {
    navigate("/help/quiz");
  };

  // handle show report user
  const handleShowReportUser = () => {
    navigate("/help/report");
  };

  // handle show assistance email
  const handleShowEmailAssist = () => {
    navigate("/help/email");
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

  return (
    <Box
      mt={CustomDeviceTablet() && 1}
      flex={CustomDeviceTablet() ? 1 : 2}
      p={CustomDeviceTablet() ? 1 : 2}
      marginLeft={equidistantSidebar()}
      sx={{
        display: {
          xs: "none",
          sm: CustomDeviceTablet() ? "none" : "none",
          md: "none",
          marginRight: CustomDeviceTablet() && "5rem",
        },
      }}
    >
      <Box position={"fixed"} width={correctWidthInPercentage()}>
        <Box bgcolor={"background.default"} className="shadow rounded mt-0">
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
              variant="body2"
            >
              Software developer specialized in React, Nodejs, Django and
              Android
            </Typography>
          </BoxAvatarContent>

          <Box>
            <Table aria-label="table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">Following</Typography>{" "}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">Followers</Typography>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">100K</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">10K</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        <Box bgcolor={"background.default"} className="p-1 shadow rounded mt-3">
          <Typography
            className=" mt-2"
            fontWeight={"bold"}
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

            <ListItemButton
              onClick={(e) => setOpenAccountMore(!openAccountMore)}
            >
              <ListItemIcon>
                <AccountBox color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Account </Typography>}
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

            <ListItemButton onClick={(e) => setOpenHelp(!openHelp)}>
              <ListItemIcon>
                <Support color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Help Center </Typography>}
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
                    primary={<Typography variant="body2">About</Typography>}
                  />
                </ListItemButton>

                <ListItemButton sx={{ pl: 8 }} onClick={handleShowReportUser}>
                  <ListItemIcon>
                    <Report color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">Report</Typography>}
                  />
                </ListItemButton>

                <ListItemButton sx={{ pl: 8 }} onClick={handleShowQuestions}>
                  <ListItemIcon>
                    <QuestionMark color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">Q & A</Typography>}
                  />
                </ListItemButton>

                <ListItemButton sx={{ pl: 8 }} onClick={handleShowEmailAssist}>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">Email</Typography>}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={(e) => setOpenMobileApp(!openMobileApp)}>
              <ListItemIcon>
                <Smartphone color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Install App </Typography>}
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
                    primary={<Typography variant="body2">Download</Typography>}
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
                  <Typography variant="body2">
                    <Typography variant="body2">Change Theme</Typography>
                  </Typography>
                }
              />
              <Switch
                checked={isDarkMode}
                onChange={(e) => setMode(mode === "light" ? "dark" : "light")}
              />
            </ListItemButton>
            {/* show account level status */}
            <Box mt={1}>
              <AccountLevelStep />
            </Box>
          </List>
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
                fontWeight={"bold"}
                className="text-center mt-2"
                color={"primary"}
              >
                EVENTS AND COURSES
              </Typography>
              <EventsTablet />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
