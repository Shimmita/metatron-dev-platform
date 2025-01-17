import { Close, FavoriteRounded, SendRounded } from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCurrentPostReaction } from "../../../redux/CurrentPostReactions";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import MiniProfileLayout from "./MiniProfileLayout";

export default function PostReaction({ reaction }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isMiniProfile, setIsMiniProfile] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const max_message_count = 50;

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // getting the current reactionID
  const { _id } = reaction;

  // handle deletion of the current notification post_reaction
  const handleDeleteReaction = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .delete(
        `http://localhost:5000/metatron/api/v1/posts/reactions/delete/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // update the redux of of reactions to reflect the current changes
          dispatch(deleteCurrentPostReaction(reaction));
          // update the snackbar notification message in the redux
          dispatch(updateNotificationSnackBar(res.data));
        }
      })
      .catch((err) => {
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
  };

  // handle fetch user details
  const handleShowMiniProfile = () => {
    // show user miniprofile view instead of their post reaction
    setIsMiniProfile((prev) => !prev);
  };

  return (
    <React.Fragment>
      {isMiniProfile ? (
        <React.Fragment>
          {/* user miniprofile */}
          <Box className={showMessageInput ? "border mb-1" : "border mb-2"}>
            <MiniProfileLayout
              handleShowMiniProfile={handleShowMiniProfile}
              userId={reaction?.userId}
              showMessageInput={showMessageInput}
              setShowMessageInput={setShowMessageInput}
            />
          </Box>

          {/* message input */}
          {showMessageInput && (
            <Box className="border border-top-0 p-1" width={"100%"}>
              {/* close the message box  */}
              <Box display={"flex"} justifyContent={"flex-end"} width={"100%"}>
                <IconButton onClick={() => setShowMessageInput(false)}>
                  <Close sx={{ width: 14, height: 14 }} color="primary" />
                </IconButton>
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={1}
              >
                {/*input field */}
                <TextField
                  id="standard-text-field-message"
                  variant="standard"
                  fullWidth
                  value={userMessage}
                  label={max_message_count - userMessage.length}
                  className="w-100"
                  onChange={(e) => setUserMessage(e.target.value)}
                  error={userMessage.length > max_message_count.length}
                  placeholder="message..."
                />
                {/* send button */}
                {userMessage && (
                  <IconButton>
                    <SendRounded sx={{ width: 16, height: 16 }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
        </React.Fragment>
      ) : (
        <List
          sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar onClick={handleShowMiniProfile}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  {/* user name */}
                  <Typography
                    fontWeight={"bold"}
                    variant="body2"
                    width={"100%"}
                  >
                    {reaction?.name}
                  </Typography>
                  {/*delete button +progress if is fetch */}
                  {isFetching ? (
                    <CircularProgress size={"10px"} />
                  ) : (
                    <IconButton size="small" onClick={handleDeleteReaction}>
                      <Close sx={{ width: 15, height: 15 }} />
                    </IconButton>
                  )}
                </Box>
              }
              secondary={
                <CardActionArea>
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        display: "inline",
                        alignItems: "center",
                      }}
                    >
                      {reaction?.title} <br />
                      <FavoriteRounded
                        sx={{ width: 13, height: 13 }}
                        color="primary"
                      />{" "}
                      {reaction?.message}
                    </Typography>
                    {` — ${reaction?.minimessage}`}
                  </React.Fragment>
                </CardActionArea>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}
    </React.Fragment>
  );
}
