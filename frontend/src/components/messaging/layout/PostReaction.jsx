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
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showMessagingDrawer } from "../../../redux/AppUI";
import { deleteCurrentPostReaction } from "../../../redux/CurrentPostReactions";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import { appColors } from "../../../utils/colors";
import {
  avatarSx,
  iconButtonSx,
  metaPillSx,
  notificationCardSx,
} from "../communicationStyles";

export default function PostReaction({ reaction }) {
  const [isFetching, setIsFetching] = useState(false);
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  
  const navigate = useNavigate();

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // getting the current reactionID
  const { _id } = reaction;


  // handle showing of the user profile
  const handleShowMiniProfile = useCallback(() => {
    setShowMiniProfile(true);
  }, []);

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

  // navigate to post details routed page, else close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messaging by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("posts/details/" + reaction?.postId);
  };

  const ReactionIcon = reaction?.message?.toLowerCase().includes("github")
    ? GitHub
    : reaction?.message?.toLowerCase().includes("commented")
    ? ForumRounded
    : FavoriteRounded;

  return (
    <List sx={{ width: "100%", py: 0.5, bgcolor: "transparent" }}>
      <ListItem sx={(theme) => notificationCardSx(theme, "default")}>
        <ListItemAvatar onClick={handleShowMiniProfile} sx={{ minWidth: 52 }}>
          <Tooltip title="View profile" arrow>
            <Avatar
              variant="rounded"
              src={reaction?.avatar}
              sx={avatarSx}
              alt={reaction?.name?.split(" ")[0]}
              aria-label="avatar"
            />
          </Tooltip>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
              <Box minWidth={0}>
                <Typography variant="body2" fontWeight={900} noWrap>
                  {reaction?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getElapsedTime(reaction?.createdAt)}
                </Typography>
              </Box>
              <Tooltip title="Clear notification" arrow>
                <IconButton size="small" onClick={handleDeleteReaction} disabled={isFetching} sx={iconButtonSx}>
                  {isFetching ? <CircularProgress size={13} /> : <Close sx={{ width: 13, height: 13 }} />}
                </IconButton>
              </Tooltip>
            </Stack>
          }
          secondary={
            <CardActionArea onClick={handleNavigatePostDetailsRoute} sx={{ borderRadius: "8px", mt: 0.8, p: 0.75 }}>
              <Stack spacing={0.75}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <ReactionIcon sx={{ width: 16, height: 16, color: appColors.primary }} />
                  <Typography variant="caption" color="text.primary" fontWeight={800}>
                    {reaction?.message}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.primary" fontWeight={800}>
                  {reaction?.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reaction?.minimessage}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {reaction?.county} | {CustomCountryName(reaction?.country)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
                  <Box sx={metaPillSx}>
                    <FavoriteRounded sx={{ width: 13, height: 13 }} />
                    <Typography variant="caption">{reaction?.likes || 0}</Typography>
                  </Box>
                  <Box sx={metaPillSx}>
                    <GitHub sx={{ width: 13, height: 13 }} />
                    <Typography variant="caption">{reaction?.github || 0}</Typography>
                  </Box>
                  <Box sx={metaPillSx}>
                    <ForumRounded sx={{ width: 13, height: 13 }} />
                    <Typography variant="caption">{reaction?.comments || 0}</Typography>
                  </Box>
                  <Box sx={metaPillSx}>
                    <Flag sx={{ width: 13, height: 13 }} />
                    <Typography variant="caption">{reaction?.report_count || 0}</Typography>
                  </Box>
                  <BarChartRounded sx={{ width: 15, height: 15, color: "text.disabled" }} />
                </Stack>
              </Stack>
            </CardActionArea>
          }
        />
      </ListItem>

      {showMiniProfile && (
        <AlertMiniProfileView
          openAlert={showMiniProfile}
          setOpenAlert={setShowMiniProfile}
          userId={reaction?.userId}
        />
      )}
    </List>
  );
}
