import { Add, Close } from "@mui/icons-material";
import {
  AvatarGroup,
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import devImage from "../../../images/dev.jpeg";
import { updateCurrentConnectID } from "../../../redux/CurrentConnect";
import { updateCurrentConnectNotifID } from "../../../redux/CurrentConnectNotif";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import { updateUserCurrentUserRedux } from "../../../redux/CurrentUser";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import SnackbarConnect from "../../snackbar/SnackbarConnect";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import { getImageMatch } from "../../utilities/getImageMatch";

function FriendRequest({
  isLoadingRequest = false,
  connect_request,
  isAcceptFriends = false,
  isLastItem = false,
}) {
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );

  const {
    _id: currentUserId,
    name,
    avatar,
    country,
    county,
    specialisationTitle: title,
  } = user || {};

  // handle creating of the connect request
  const handleSendConnectRequest = () => {
    // id of the target user requesting connect. its still the id of the connect request object
    const { _id: targetID } = connect_request || {};

    const dataUserAcknowLedging = {
      senderId: currentUserId,
      targetId: targetID,
      country: CustomCountryName(country),
      state: county,
      name,
      avatar,
      title,
      message: "requesting to connect",
    };

    // set is fetching to true
    setIsFetching(true);

    // performing post request and passing data for body request
    axios
      .post(
        `http://localhost:5000/metatron/api/v1/connections/connection/create`,
        dataUserAcknowLedging
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateMessageConnectRequest(res.data));

          // update redux by remove the user from request friend list by passing the ID
          // of the connect suggestion object.
          dispatch(updateCurrentConnectID(targetID));
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }
        dispatch(updateMessageConnectRequest(err?.response?.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle showing of the user profile
  const handleShowMiniProfile = useCallback(() => {
    setShowMiniProfile(true);
  }, []);

  // handle accept friend request from senders which came in notif section
  // handle the connect request
  const handleAcceptConnectRequestFriends = () => {
    // accept option, the current user should add the senderid in their network
    // connect request is for validation that the request exists in the db and updating db connectRequests
    const { _id: connectRequestID, senderId } = connect_request || {};

    // set is fetching to true
    setIsFetching(true);

    // performing post request and passing
    axios
      .post(
        `http://localhost:5000/metatron/api/v1/connections/connection/accept/${connectRequestID}/${senderId}/${currentUserId}`
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          // update the current logged in user redux since their network count changed
          dispatch(updateUserCurrentUserRedux(res.data.targetUser));

          // update message of snackbar in redux
          dispatch(updateMessageConnectRequest(res.data.message));

          // update redux by remove the user from request friend list.
          dispatch(updateCurrentConnectNotifID(connectRequestID));
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }

        dispatch(updateMessageConnectRequest(err?.response?.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle rejecting the user from acceting the connect request

  // id of the connect request object
  const { _id: connectRequestID } = connect_request || {};

  const handleRejectConnectRequest = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing post request and passing
    axios
      .post(
        `http://localhost:5000/metatron/api/v1/connections/connection/reject/${connectRequestID}`
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateMessageConnectRequest(res.data));

          // update redux by remove the user from request friend list.
          dispatch(updateCurrentConnectNotifID(connectRequestID));
        }
      })
      .catch(async (err) => {
        alert(err?.response?.data);
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }
        dispatch(
          updateMessageConnectRequest(
            "server is unreachable check your internet."
          )
        );
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // check if the user is the current user
  const isCurrentUser = connectRequestID == currentUserId;
  return (
    <React.Fragment>
      {isLoadingRequest ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Skeleton animation="wave" variant="circular" />
            </ListItemAvatar>
            <CardActionArea>
              <ListItemText
                primary={<Skeleton width={"70%"} animation="wave" />}
                secondary={<Skeleton width={"50%"} animation="wave" />}
              />
            </CardActionArea>

            <Box ml={2}>
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: "20px" }}
                width={35}
                height={15}
              />
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar onClick={handleShowMiniProfile}>
              {isAcceptFriends ? (
                <Avatar
                  src={devImage}
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                  }}
                  alt={connect_request?.name?.split(" ")[0]}
                  aria-label="avatar"
                />
              ) : (
                <Avatar
                  src={devImage}
                  variant="rounded"
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    width: 40,
                    height: 40,
                  }}
                  alt={connect_request?.name?.split(" ")[0]}
                  aria-label="avatar"
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{ color: "text.primary" }}
                  fontWeight={"bold"}
                  variant="body2"
                >
                  {connect_request?.name}
                </Typography>
              }
              secondary={
                <Box>
                  {/* location of the user */}
                  {isAcceptFriends ? (
                    <React.Fragment>
                      <Typography variant="caption" color={"text.secondary"}>
                        {connect_request?.country} | {connect_request?.state}
                      </Typography>

                      <Typography variant="body2" color={"text.secondary"}>
                        {connect_request?.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={"text.secondary"}
                        fontWeight={"bold"}
                      >
                        - is {connect_request?.message} -
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography variant="caption" color={"text.secondary"}>
                        {CustomCountryName(connect_request?.country)} |{" "}
                        {connect_request?.county}
                      </Typography>

                      {/* specialisation of the user */}
                      <Typography variant="body2" color={"text.secondary"}>
                        {connect_request?.specialisationTitle}
                      </Typography>

                      {/* skills of the user */}
                      <Box display={"flex"} mt={"2px"}>
                        <AvatarGroup
                          max={connect_request?.selectedSkills?.length}
                        >
                          {/* loop through the skills and their images matched using custim fn */}
                          {connect_request?.selectedSkills?.map(
                            (skill, index) => (
                              <Tooltip title={skill} arrow>
                                <Avatar
                                  key={index}
                                  alt={skill}
                                  className="border"
                                  sx={{ width: 28, height: 28 }}
                                  src={getImageMatch(skill)}
                                />
                              </Tooltip>
                            )
                          )}
                        </AvatarGroup>
                      </Box>
                    </React.Fragment>
                  )}
                </Box>
              }
            />

            <Box>
              {isFetching ? (
                <CircularProgress size={16} />
              ) : (
                <React.Fragment>
                  {isAcceptFriends ? (
                    <Stack
                      justifyContent={"center"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {/* time  */}
                      <Box>
                        <Typography variant="caption">
                          {getElapsedTime(connect_request?.createdAt)}
                        </Typography>
                      </Box>

                      {/* action bitn accepting request */}
                      <Stack
                        direction={"row"}
                        gap={"3px"}
                        alignItems={"center"}
                      >
                        <Tooltip arrow title={"connect"}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handleAcceptConnectRequestFriends}
                          >
                            <Add sx={{ width: 15, height: 15 }} />
                          </IconButton>
                        </Tooltip>

                        {/* action btn rejecting request */}
                        <Tooltip arrow title={"dismiss"}>
                          <IconButton
                            size="small"
                            onClick={handleRejectConnectRequest}
                          >
                            <Close sx={{ width: 14, height: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  ) : (
                    <React.Fragment>
                      {/* action btn initiating lets connect to the target user */}
                      {isCurrentUser ? (
                        <Box display={"flex"} justifyContent={"center"}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            You
                          </Typography>
                        </Box>
                      ) : (
                        <Tooltip arrow title={"connect"}>
                          <IconButton
                            size="small"
                            color="primary"
                            className="border"
                            onClick={handleSendConnectRequest}
                          >
                            <Add sx={{ width: 17, height: 17 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </Box>
          </ListItem>
          {/* show divider is is not last item */}
          {!isLastItem && <Divider variant="inset" component="li" />}{" "}
        </List>
      )}

      {/* will display miniprofile if state is true */}
      <AlertMiniProfileView
        openAlert={showMiniProfile}
        userId={
          !isAcceptFriends ? connect_request._id : connect_request.senderId
        }
        setOpenAlert={setShowMiniProfile}
      />

      {/* snackbar detailing if there is a message */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </React.Fragment>
  );
}

export default React.memo(FriendRequest);
