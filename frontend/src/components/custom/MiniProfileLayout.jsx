import { Close, Diversity3Rounded } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showMessagingDrawer,
  showProfileDrawerMessageInput,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import { updateNotificationSnackBar } from "../../redux/CurrentSnackBar";
import {
  updateTempUserIDRedux,
  updateUserCurrentUserRedux,
} from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../utilities/getImageMatch";

export default function MiniProfileLayout({ handleShowMiniProfile, userId }) {
  const [isFetching, setIsFetching] = useState(true);
  const [miniProfileData, setMiniProfileData] = useState();
  const [errorPresent, setErrorPresent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // axios default credentials
  axios.defaults.withCredentials = true;

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

  // checks for if current user is friends
  const isFriends =miniProfileData?.network?.includes(currentUserId);

  useEffect(() => {
    // fetch details of the liked or reacted user based on their id also the id of the current user
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/specific/${userId}/${currentUserId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setMiniProfileData(res.data);
        }
      })
      .catch((err) => {
        // there is an error
        setErrorPresent(true);
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          dispatch(updateNotificationSnackBar("Network Error"));
          return;
        }
        // update the snackbar notification of error from the server
        dispatch(updateNotificationSnackBar(err?.response.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [userId,currentUserId, dispatch]);

  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

  const handleViewFullProfile = () => {
    if (CustomDeviceIsSmall()) {
      // close the messaging drawer since this view is displayed on it
      dispatch(showMessagingDrawer());

      // navigate to the new window for smaller devices
      navigate("users/profile/" + userId);
    } else {
      // update the temp user state in redux with the userID passed
      dispatch(updateTempUserIDRedux(userId));

      // close the messaging drawer since this view is displayed on it
      dispatch(showMessagingDrawer());

      // open the profile drawer for larger views like tabs ++
      dispatch(showUserProfileDrawer());
    }
  };

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
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/create`,
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

    // performing delete request and passing id of the currently user and that of miniprofile user being
    // viewed
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${userId}`
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

  // handle sending of the message
  const handleSendMessage = () => {
    if (CustomDeviceIsSmall()) {
      // navigate user profile specially smaller devices + messaging true
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

  const handleClose = () => {
    // clear any messages info
    setMessage("");
  };

  // handle clearing of the message
  const handleClearMessage = () => {
    setMessage("");
  };

  return (
    <React.Fragment>
      {/* message from backend of connect request */}
      {message && (
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
                  <Close fontSize="inherit" sx={{ width: 15, height: 15 }} />
                </IconButton>
              }
            >
              {message}
            </Alert>
          </Collapse>
      )}

      {/* error present of fetching user details */}
      {errorPresent && (
        <React.Fragment>
          <Collapse in={errorPresent || false}>
            <Alert
              severity="warning"
              onClick={() => {
                setErrorPresent(false);
                // closes the whole layout based on the state present
                handleShowMiniProfile();
              }}
              action={
                <IconButton aria-label="close" color="inherit" size="small">
                  <Close fontSize="inherit" sx={{ width: 15, height: 15 }} />
                </IconButton>
              }
            >
              problem encountered please try again!
            </Alert>
          </Collapse>

          {/* divider */}
          <Divider component={"div"} className="p-2" />
        </React.Fragment>
      )}

      {/* show skeleton when loading else results */}
      {isFetching && (
        <Box display={"flex"} justifyContent={"center"} p={1}>
          <Skeleton
            sx={{ bgcolor: "grey.500" }}
            variant="rectangular"
            className="rounded"
            width={"70%"}
            height={"15vh"}
          />
        </Box>
      )}

      {/* show details if present after success backend results */}
      {miniProfileData && (
        <Box mb={1}>
          {/* close button */}
          <Box>
            <IconButton onClick={handleShowMiniProfile}>
              <Close sx={{ width: 15, height: 15 }} color="primary" />
            </IconButton>
          </Box>
          <Box display={"flex"} justifyContent={"center"}>
            <Stack gap={1}>
              {/* avatar */}
              <Box display={"flex"} justifyContent={"center"}>
                <Avatar src="" alt="" />
              </Box>
              {/* name of the user */}
              <Box display={"flex"} justifyContent={"center"}>
                <Typography
                  variant="body2"
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                >
                  {miniProfileData?.name}
                </Typography>
              </Box>
              {/* specialisation */}
              <Box display={"flex"} justifyContent={"center"}>
                <Typography variant="body2" color={"text.secondary"}>
                  {miniProfileData?.specialisationTitle}
                </Typography>
              </Box>
              {/* country and location */}
              <Box display={"flex"} justifyContent={"center"} gap={1}>
                {/* country */}
                <Typography variant="body2" color={"text.secondary"}>
                  {/* call this if only miniprofile data present */}
                  {miniProfileData &&
                    handleCountryName(miniProfileData?.country)}
                </Typography>
                |{/* state or county */}
                <Typography variant="body2" color={"text.secondary"}>
                  {miniProfileData?.county}
                </Typography>
                |
                <Typography
                  variant="body2"
                  color={"text.secondary"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                >
                  {miniProfileData?.network_count}
                  <Diversity3Rounded sx={{ width: 20, height: 20 }} />
                </Typography>
              </Box>

              {/* contact buttons */}
              <Box display={"flex"} justifyContent={"center"} gap={2}>
                {/* button view profile */}
                <Tooltip title={"profile"} arrow>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleViewFullProfile}
                    disabled={isFetching || message}
                    size="small"
                    sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                  >
                    Profile
                  </Button>
                </Tooltip>

                {/* button send message */}
                <Tooltip title={"message"} arrow>
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    onClick={handleSendMessage}
                    sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                  >
                    Message
                  </Button>
                </Tooltip>

                {/* add friends if not friends */}
                <Tooltip title={isFriends ? "connect" : "disconnect"} arrow>
                  {isFriends ? (
                    <Button
                      variant="contained"
                      disableElevation
                      disabled={message || isFetching}
                      onClick={handleRequestUnfriend}
                      size="small"
                      color="warning"
                      sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                    >
                      disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disableElevation
                      disabled={message || isFetching}
                      onClick={handleRequestConnecting}
                      size="small"
                      sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                    >
                      connect
                    </Button>
                  )}
                </Tooltip>
              </Box>

              {/* divider */}
              <Divider className="p-1" component={"div"} />
              {/* skills avatars */}
              <Box display={"flex"} justifyContent={"center"}>
                <AvatarGroup max={miniProfileData?.selectedSkills?.length}>
                  {/* loop through the skills and their images matched using custom fn */}
                  {miniProfileData?.selectedSkills?.map((skill, index) => (
                    <Tooltip title={skill} arrow key={skill}>
                      <Avatar
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

              {/* caption joined date */}
              <Box display={"flex"} justifyContent={"center"}>
                <Typography variant="caption" color={"text.secondary"}>
                  Joined:{miniProfileData?.createdAt?.split("T")[0]}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}
