import {
  AccountBoxRounded,
  Close,
  Diversity3Rounded,
  MessageRounded,
  PersonAdd,
  PersonRemoveRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showProfileDrawerMessageInput,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import {
  updateTempUserIDRedux,
  updateUserCurrentUserRedux,
} from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { getImageMatch } from "../utilities/getImageMatch";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function AlertMiniProfileView({
  openAlert,
  setOpenAlert,
  userId,
}) {
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const [miniProfileData, setMiniProfileData] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const {
    _id: currentUserId,
    name,
    avatar,
    country,
    county,
    specialisationTitle: title,
  } = user || {};

  // axios default credentials
  axios.defaults.withCredentials = true;

  // checks for if current user is friends
  const isFriends =
    miniProfileData && miniProfileData?.network?.includes(currentUserId);

  useEffect(() => {
    // fetch details of the liked or reacted user based on their id
    axios
      .get(`http://localhost:5000/metatron/api/v1/users/all/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setMiniProfileData(res.data);
        }
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setMessage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [userId, dispatch]);

  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

  // fetch the online status of the user from the backend that checks on
  // user session database collection  /all/online/:userID
  useEffect(() => {
    // update is fetching true
    setIsFetching(true);

    // get online status of the user from the backend
    axios
      .get(`http://localhost:5000/metatron/api/v1/users/all/online/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setIsOnline(res.data.isOnline);
        }
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setMessage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [userId]);

  // handle when user clicks adds user btn
  const handleRequestConnecting = () => {
    const dataUserAcknowLedging = {
      senderId: currentUserId,
      targetId: userId,
      country: CustomCountryName(country),
      state: county,
      name,
      avatar,
      title,
      message: "requesting to connect",
    };

    // set is fetching to true
    setIsFetching(true);

    // performing post request and passing
    axios
      .post(
        `http://localhost:5000/metatron/api/v1/connections/connection/create`,
        dataUserAcknowLedging
      )
      .then((res) => {
        // update the message state
        if (res?.data && res.data) {
          setMessage(res.data);
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessage("server is unreachable check your internet");
          return;
        }
        setMessage(err?.response?.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle unfriending a user
  const handleRequestUnfriend = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing delete request and passing id of the currenly user and that of miniprofile user being
    // viewed
    axios
      .delete(
        `http://localhost:5000/metatron/api/v1/connections/connection/unfriend/${currentUserId}/${userId}`
      )
      .then((res) => {
        // update the message state
        if (res?.data && res.data) {
          // update the message
          setMessage(res.data.message);

          // update the miniprofile of  user who is target info from backend
          setMiniProfileData(res.data.targetUser);

          // update the redux state of the currently logged in user from backend who is sender user
          dispatch(updateUserCurrentUserRedux(res.data.senderUser));
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessage("server is unreachable check your internet");
          return;
        }
        // error message
        setMessage(err?.response?.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  const handleClose = () => {
    // close alert
    setOpenAlert(false);

    // clear any messages info
    setMessage("");
  };

  // handle clearing of the message
  const handleClearMessage = () => {
    setMessage("");
  };

  // navigate to full proile using the current userId

  /*   open drawer to display full user profile if user temp display it firs else 
small devices display on separate window. big devices just drawer it.
*/
  const handleViewFullProfile = () => {
    if (CustomDeviceIsSmall()) {
      navigate("users/profile/" + userId);
    } else {
      // update the temp user state in redux with the userID passed
      dispatch(updateTempUserIDRedux(userId));

      // open the profile drawer for larger views like tabs ++
      dispatch(showUserProfileDrawer());
    }
    // close the alert
    handleClose();
  };

  // handle sending of the message
  const handleSendMessage = () => {
    if (CustomDeviceIsSmall()) {
      // navigate user profile specially smalller devices + mesaging true
      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));
      navigate("users/profile/" + userId);
    } else {
      // update the temp user state in redux with the userID passed
      dispatch(updateTempUserIDRedux(userId));

      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));

      // open the profile drawer for larger views like tabs ++
      dispatch(showUserProfileDrawer());
    }

    // close the alert
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          marginLeft:
            CustomDeviceTablet() && isTabSideBar
              ? "36%"
              : CustomLandscapeWidest()
              ? "-3%"
              : undefined,
        }}
      >
        <DialogContent dividers>
          {/* message from backend present display this */}
          {message && (
            <React.Fragment>
              <Collapse in={message || false}>
                <Alert
                  severity="info"
                  onClose={handleClose}
                  className="rounded"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleClearMessage}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Collapse>
            </React.Fragment>
          )}

          {/* show circular progress */}
          {isFetching && (
            <Box display={"flex"} justifyContent={"center"} p={1}>
              <CircularProgress size={20} />
            </Box>
          )}
          {/* render miniprofile layout */}
          <Box mb={1} mt={1}>
            <Box display={"flex"} justifyContent={"center"}>
              <Stack gap={1}>
                {/* avatar */}
                <Box display={"flex"} justifyContent={"center"}>
                  {/* show this avatar only when user is online */}
                  {isOnline && isOnline ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar src="" alt="" sx={{ width: 45, height: 45 }}>
                        <Typography
                          variant="body2"
                          textTransform={"uppercase"}
                          fontWeight={"bold"}
                        >
                          {miniProfileData?.name[0]}
                        </Typography>
                      </Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar src="" alt="" sx={{ width: 45, height: 45 }}>
                      <Typography
                        variant="body2"
                        textTransform={"uppercase"}
                        fontWeight={"bold"}
                      >
                        {miniProfileData?.name[0]}
                      </Typography>
                    </Avatar>
                  )}
                </Box>
                {/* name of the user */}
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  <Typography
                    variant="body2"
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    fontWeight={"bold"}
                  >
                    {miniProfileData?.name}
                  </Typography>

                  {/* friends status */}
                  {isFriends && (
                    <Box mb={1} display={"flex"} justifyContent={"center"}>
                      <Typography variant="caption" color={"text.secondary"}>
                        ( You are friends )
                      </Typography>
                    </Box>
                  )}

                  {/* displayed if the current user is the one being checked */}
                  {userId === currentUserId && (
                    <Box display={"flex"} justifyContent={"center"}>
                      <Typography
                        variant="caption"
                        textTransform={"capitalize"}
                        fontWeight={"bold"}
                        color={"text.secondary"}
                      >
                        ( You )
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* specialisation */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.specialisationTitle}
                  </Typography>
                </Box>
                {/* country and location */}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={3}
                  alignItems={"center"}
                >
                  {/* country */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {/* call this if only miniprofile data present */}
                    {miniProfileData &&
                      handleCountryName(miniProfileData?.country)}
                  </Typography>
                  {/* divider vert */}
                  <Divider
                    component={"div"}
                    variant="middle"
                    orientation="vertical"
                    className="p-1"
                  />
                  {/* state or county */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.county}
                  </Typography>

                  {/* divider vert */}
                  <Divider
                    component={"div"}
                    variant="middle"
                    orientation="vertical"
                    className="p-1"
                  />

                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    {/* network connection count */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pt: "1px" }}
                    >
                      {miniProfileData?.network_count}
                    </Typography>

                    {/* diversity network icon */}
                    <Diversity3Rounded sx={{ width: 20, height: 20 }} />
                  </Box>
                </Box>

                {/* divider */}
                <Divider component={"div"} className="pb-1" />

                {/* contact buttons */}
                <Box display={"flex"} justifyContent={"space-between"} gap={5}>
                  {/* button view profile */}
                  <Tooltip title={"profile"} arrow>
                    <IconButton
                      disabled={message}
                      onClick={handleViewFullProfile}
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <AccountBoxRounded
                        color={message ? "inherit" : "primary"}
                      />
                    </IconButton>
                  </Tooltip>

                  {/* button send message */}
                  <Tooltip title={"message"} arrow>
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={userId === currentUserId || message}
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <MessageRounded
                        color={
                          userId === currentUserId || message
                            ? "inherit"
                            : "primary"
                        }
                      />
                    </IconButton>
                  </Tooltip>

                  {/* add friends if */}
                  {message?.trim().toLowerCase() === "you already friends!" ? (
                    <Tooltip title={"disconnect"} arrow>
                      <IconButton
                        disabled={userId === currentUserId}
                        onClick={handleRequestUnfriend}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                      >
                        <PersonRemoveRounded color={"warning"} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={"connect"} arrow>
                      <IconButton
                        disabled={userId === currentUserId || message}
                        onClick={handleRequestConnecting}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                      >
                        <PersonAdd
                          color={
                            userId === currentUserId || message
                              ? "inherit"
                              : "primary"
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {/* divider */}
                <Divider component={"div"} className="pb-1" />
                {/* skills avatars */}
                <Box display={"flex"} justifyContent={"center"} mt={1}>
                  <AvatarGroup max={miniProfileData?.selectedSkills?.length}>
                    {/* loop through the skills and their images matched using custim fn */}
                    {miniProfileData?.selectedSkills?.map((skill, index) => (
                      <Tooltip title={skill} arrow>
                        <Avatar
                          key={index}
                          alt={skill}
                          className="border"
                          sx={{ width: 34, height: 34 }}
                          src={getImageMatch(skill)}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>

                {/* divider */}
                <Divider className="p-1" component={"div"} />
                {/* user about */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="caption"
                    maxWidth={300}
                    color="text.secondary"
                  >
                    {miniProfileData?.about || "** No About**"}
                  </Typography>
                </Box>

                <Divider className="p-1" component={"div"} />

                {/* caption joined date */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="caption" color={"text.secondary"}>
                    Joined:{miniProfileData?.createdAt?.split("T")[0]}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
