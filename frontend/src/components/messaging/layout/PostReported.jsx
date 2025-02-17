import {
  BarChartRounded,
  Close,
  Flag,
  FlagRounded,
  SendRounded,
} from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import { showMessagingDrawer } from "../../../redux/AppUI";
import { deleteCurrentPostReaction } from "../../../redux/CurrentPostReactions";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import MiniProfileLayout from "../../custom/MiniProfileLayout";
import { getElapsedTime } from "../../utilities/getElapsedTime";

export default function PostReported({ report, isLastItem }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isMiniProfile, setIsMiniProfile] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const navigate = useNavigate();
  const max_message_count = 50;

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // getting the current reactionID
  const { _id } = report;

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
          dispatch(deleteCurrentPostReaction(report));
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

  // navigate to post details routed page, alse close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messageing by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("posts/details/" + report?.postId);
  };

  return (
    <React.Fragment>
      {isMiniProfile ? (
        <React.Fragment>
          {/* user miniprofile */}
          <Box  className={showMessageInput ? " mb-1" : " mb-2"}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}>
            <MiniProfileLayout
              handleShowMiniProfile={handleShowMiniProfile}
              userId={report?.reporterId}
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
                  label={
                    <React.Fragment>
                      <Typography variant="caption" className="ms-2">
                        message {max_message_count - userMessage.length}
                      </Typography>
                    </React.Fragment>
                  }
                  className="w-100"
                  onChange={(e) => setUserMessage(e.target.value)}
                  error={userMessage.length > max_message_count}
                  placeholder="..."
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
              <Avatar src="" alt="">
                <Typography
                  variant="body2"
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                >
                  {report?.reporter_name[0]}
                </Typography>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  {/* reporter name */}
                  <Typography
                    fontWeight={"bold"}
                    variant="body2"
                    width={"100%"}
                  >
                    {report?.reporter_name}
                  </Typography>
                  {/*delete button +progress if is fetch */}
                  {isFetching ? (
                    <CircularProgress size={"10px"} />
                  ) : (
                    <Box display={"flex"} gap={"3px"} alignItems={"center"}>
                      {/* time elapsed since post created */}
                      <Typography variant="caption">
                        {getElapsedTime(report?.createdAt)}
                      </Typography>
                      {/* delete reaction */}
                      <IconButton size="small" onClick={handleDeleteReaction}>
                        <Close sx={{ width: 15, height: 15 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              }
              secondary={
                <CardActionArea onClick={handleNavigatePostDetailsRoute}>
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
                      {/* reporter speciality */}
                      <Typography variant="body2" gutterBottom>
                        {report?.reporter_speciality}
                      </Typography>{" "}
                      {/* post title */} " {report?.post_title} " <br />
                      {/* report about */}
                      <FlagRounded
                        sx={{ width: 16, height: 16 }}
                        color="info"
                        className="me-1"
                      />
                      {/* message  */}
                      {report?.report_title}
                      {/* minimessage of post section */}
                    </Typography>
                    {` — ${report?.report_message}`}

                    {/* box telling stats of report cases or count times */}
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      mt={1}
                      gap={1}
                    >
                      {/* stats svg */}
                      <Box>
                        <BarChartRounded sx={{ width: 16, height: 16 }} />
                      </Box>
                      <Box
                        sx={{
                          pe: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                          color: "text.secondary",
                          "& svg": {
                            m: 1,
                          },
                        }}
                      >
                        {/* likes count */}
                        <Flag sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="px-1">
                          post reported {report?.report_count} times
                        </Typography>
                      </Box>
                    </Box>
                  </React.Fragment>
                </CardActionArea>
              }
            />
          </ListItem>
          {/* show divider is is not last item */}
          {!isLastItem && <Divider variant="inset" component="li" />}
        </List>
      )}
    </React.Fragment>
  );
}
