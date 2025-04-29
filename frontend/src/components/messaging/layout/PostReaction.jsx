import {
  BarChartRounded,
  Close,
  FavoriteRounded,
  Flag,
  ForumRounded,
  GitHub,
} from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
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

export default function PostReaction({ reaction, isLastItem }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isMiniProfile, setIsMiniProfile] = useState(false);
  const navigate = useNavigate();

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
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/reactions/delete/${_id}`,
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

  // navigate to post details routed page, alse close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messageing by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("posts/details/" + reaction?.postId);
  };

  return (
    <React.Fragment>
      {isMiniProfile ? (
        <React.Fragment>
          {/* user miniprofile */}
          <Box
            className={"mb-2"}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <MiniProfileLayout
              handleShowMiniProfile={handleShowMiniProfile}
              userId={reaction?.userId}
            />
          </Box>
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
                  {reaction?.name[0]}
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
                    <Box display={"flex"} gap={"3px"} alignItems={"center"}>
                      {/* time elapsed since post created */}
                      <Typography variant="caption">
                        {getElapsedTime(reaction?.createdAt)}
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
                      {reaction?.title} <br />
                      {reaction?.message?.toLowerCase().includes("liked") && (
                        <FavoriteRounded
                          sx={{ width: 14, height: 14 }}
                          color="primary"
                          className="me-1"
                        />
                      )}
                      {reaction?.message?.toLowerCase().includes("github") && (
                        <GitHub
                          sx={{ width: 14, height: 14 }}
                          color="primary"
                          className="me-1"
                        />
                      )}
                      {reaction?.message
                        ?.toLowerCase()
                        .includes("commented") && (
                        <ForumRounded
                          sx={{ width: 14, height: 14 }}
                          color="primary"
                          className="me-1"
                        />
                      )}
                      {/* message  */}
                      {reaction?.message}
                      {/* minimessage of post section */}
                    </Typography>
                    {` — ${reaction?.minimessage}`}

                    {/* post counters */}
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
                        <FavoriteRounded sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption">
                          {reaction?.likes}
                        </Typography>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* github counts */}
                        <GitHub sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption">
                          {reaction?.github}
                        </Typography>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* comments count */}
                        <ForumRounded sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="pe-1">
                          {reaction?.comments}
                        </Typography>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* flags or number reports */}
                        <Flag sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="pe-1">
                          {reaction?.report_count}
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
