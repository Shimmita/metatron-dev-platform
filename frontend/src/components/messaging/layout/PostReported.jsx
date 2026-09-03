import { BarChartRounded, Close, Flag, FlagRounded } from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip
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
import { updateCurrentReportID } from "../../../redux/CurrentPostReported";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import {
  avatarSx,
  iconButtonSx,
  metaPillSx,
  notificationCardSx,
} from "../communicationStyles";

export default function PostReported({ report }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isMiniProfile, setIsMiniProfile] = useState(false);
  const navigate = useNavigate();

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // getting the current reactionID
  const { _id } = report;

  // handle deletion of the current notification post_reaction
  const handleDeleteReportReaction = () => {
    console.log("delete");

    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/report/delete/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // update the redux of of reactions to reflect the current changes
          dispatch(updateCurrentReportID(report?._id));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle fetch user details
  const handleShowMiniProfile = () => {
    // show user mini-profile view instead of their post reaction
    setIsMiniProfile((prev) => !prev);
  };

  // navigate to post details routed page, else close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messaging by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("/posts/details/" + report?.postId);
  };

  return (
    <List sx={{ width: "100%", py: 0.5, bgcolor: "transparent" }}>
      <ListItem sx={(theme) => notificationCardSx(theme, "danger")}>
        <ListItemAvatar onClick={handleShowMiniProfile} sx={{ minWidth: 52 }}>
          <Tooltip title="View reporter profile" arrow>
            <Avatar
              src={report?.reporter_avatar}
              variant="rounded"
              sx={avatarSx}
              alt={report?.name?.split(" ")[0]}
              aria-label="avatar"
            />
          </Tooltip>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
              <Box minWidth={0}>
                <Typography fontWeight={900} variant="body2" noWrap>
                  {report?.reporter_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getElapsedTime(report?.createdAt)}
                </Typography>
              </Box>
              <Tooltip title="Clear report" arrow>
                <IconButton
                  size="small"
                  onClick={handleDeleteReportReaction}
                  disabled={isFetching}
                  sx={(theme) => iconButtonSx(theme, "danger")}
                >
                  {isFetching ? <CircularProgress size={13} /> : <Close sx={{ width: 13, height: 13 }} />}
                </IconButton>
              </Tooltip>
            </Stack>
          }
          secondary={
            <CardActionArea onClick={handleNavigatePostDetailsRoute} sx={{ borderRadius: "8px", mt: 0.8, p: 0.75 }}>
              <Stack spacing={0.8}>
                <Typography variant="caption" color="text.secondary">
                  {report?.reporter_speciality || "Platform member"}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={900}>
                  {report?.post_title}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <FlagRounded sx={{ width: 16, height: 16, color: "error.main" }} />
                  <Typography variant="caption" color="text.primary" fontWeight={800}>
                    {report?.report_title}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {report?.report_message}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.75} justifyContent="space-between">
                  <Box sx={metaPillSx}>
                    <Flag sx={{ width: 13, height: 13 }} />
                    <Typography variant="caption">Reported {report?.report_count || 0} times</Typography>
                  </Box>
                  <BarChartRounded sx={{ width: 15, height: 15, color: "text.disabled" }} />
                </Stack>
              </Stack>
            </CardActionArea>
          }
        />
      </ListItem>

      {isMiniProfile && (
        <AlertMiniProfileView
          openAlert={isMiniProfile}
          setOpenAlert={setIsMiniProfile}
          userId={report?.reporterId}
        />
      )}
    </List>
  );
}
