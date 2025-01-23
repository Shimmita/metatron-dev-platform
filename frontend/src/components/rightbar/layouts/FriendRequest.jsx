import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
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
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import SnackbarConnect from "../../snackbar/SnackbarConnect";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getElapsedTime } from "../../utilities/getElapsedTime";

function FriendRequest({
  isLoadingRequest = false,
  connect_request,
  isAcceptFriends = false,
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
  // id of the user requesting connect
  const { _id: targetID } = connect_request || {};

  const {
    _id: currentUserId,
    name,
    avatar,
    country,
    county,
    specialisationTitle: title,
  } = user || {};

  // handle the connect request
  const handleSendConnectRequest = () => {
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

    // performing post request and passing
    axios
      .post(
        isAcceptFriends
          ? `http://localhost:5000/metatron/api/v1/connections/connection/accept/${currentUserId}/${targetID}`
          : `http://localhost:5000/metatron/api/v1/connections/connection/create`,
        dataUserAcknowLedging
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateMessageConnectRequest(res.data));

          // update redux by remove the user from request friend list.
          dispatch(updateCurrentConnectID(targetID));
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

  // handle showing of the user profile
  const handleShowMiniProfile = useCallback(() => {
    setShowMiniProfile(true);
  }, []);

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
                      <Typography variant="caption" color={"text.secondary"}>
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

                      {/* action bitn */}
                      <Stack direction={"row"} gap={'3px'} alignItems={"center"}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={handleSendConnectRequest}
                        >
                          <Add sx={{ width: 15, height: 15 }} />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={handleSendConnectRequest}
                        >
                          <Remove sx={{ width: 14, height: 14 }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ) : (
                    <React.Fragment>
                      {/* action btn */}
                      <IconButton
                        size="small"
                        color="primary"
                        className="border"
                        onClick={handleSendConnectRequest}
                      >
                        <Add sx={{ width: 17, height: 17 }} />
                      </IconButton>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}

      {/* will display miniprofile if state is true */}
      <AlertMiniProfileView
        openAlert={showMiniProfile}
        userId={targetID}
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
