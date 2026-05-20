import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
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
import { useDispatch } from "react-redux";
import { deleteCurrentProfileView } from "../../../redux/CurrentProfileView";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import { appColors } from "../../../utils/colors";

/* ─── Metatron token shortcuts (consistent with global theme) ─── */
const C = {
  teal: appColors.primary,
  tealSoft: `${appColors.primary}14`,
  tealHover: `${appColors.primary}0F`,
  tealBorder: `${appColors.primary}40`,
  bgCard: appColors.bgCard,
  border: appColors.border,
  textPrimary: appColors.textPrimary,
  textSecondary: appColors.textSecondary,
  textMuted: appColors.textMuted,
};

function ProfileViewReaction({ profile_view }) {
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  // handle showing of the user profile
  const handleShowMiniProfile = useCallback(() => {
    setShowMiniProfile(true);
  }, []);

  // handle clearing the profile view notification
  const handleDeleteReaction = () => {
    setIsFetching(true);
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/delete/profile_views/${profile_view?._id}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res?.data) {
          dispatch(deleteCurrentProfileView(profile_view));
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(updateNotificationSnackBar("Network Error"));
          return;
        }
        dispatch(updateNotificationSnackBar(err?.response.data));
      })
      .finally(() => setIsFetching(false));
  };

  return (
    <List
      sx={{
        width: "100%",
        py: 0.5,
        background: "transparent",
      }}
    >
      <ListItem
        sx={{
          borderRadius: "14px",
          px: 2,
          py: 1.5,
          background: C.bgCard,
          backdropFilter: "blur(25px)",
          border: `1px solid ${C.border}`,
          transition: "all 0.25s ease",
          "&:hover": {
            background: C.tealHover,
            borderColor: C.tealBorder,
          },
        }}
      >
        {/* Avatar – clickable to view mini profile */}
        <ListItemAvatar onClick={handleShowMiniProfile}>
          <Tooltip title="View profile" arrow placement="top">
            <Avatar
              src={profile_view?.avatar}
              variant="rounded"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: `1px solid rgba(255,255,255,0.12)`,
                color: "white",
              }}
              aria-label="avatar"
            />
          </Tooltip>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              {/* Name */}
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: C.textPrimary, fontSize: 13 }}
              >
                {profile_view?.name}
              </Typography>

              {/* Actions: time + clear button */}
              <Box display="flex" alignItems="center" gap={0.8}>
                <Typography variant="caption" sx={{ color: C.textMuted, fontSize: 11 }}>
                  {getElapsedTime(profile_view?.createdAt)}
                </Typography>
                <Tooltip title="Clear" arrow>
                  <IconButton
                    size="small"
                    disabled={isFetching}
                    onClick={handleDeleteReaction}
                    sx={{
                      border: `1px solid ${C.border}`,
                      color: C.textSecondary,
                      "&:hover": {
                        backgroundColor: "rgba(255,109,58,0.08)",
                        borderColor: "rgba(255,109,58,0.3)",
                        color: "#FF6D3A",
                      },
                    }}
                  >
                    {isFetching ? (
                      <CircularProgress size={13} sx={{ color: C.teal }} />
                    ) : (
                      <Close sx={{ width: 13, height: 13 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          }
          secondary={
            <Box mt={0.3}>
              <Typography variant="caption" sx={{ color: C.textSecondary, fontSize: 11.5 }}>
                {profile_view?.title}
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: C.textMuted, fontSize: 11 }}>
                {profile_view?.state} | {CustomCountryName(profile_view?.country)}
              </Typography>
              <br />
              <Typography
                variant="caption"
                sx={{ color: C.teal, fontSize: 11, fontStyle: "italic" }}
              >
                – viewed your profile –
              </Typography>
            </Box>
          }
          sx={{ ml: 1.5 }}
        />
      </ListItem>

      {/* Mini profile modal */}
      {showMiniProfile && (
        <AlertMiniProfileView
          openAlert={showMiniProfile}
          setOpenAlert={setShowMiniProfile}
          userId={profile_view?.senderId}
        />
      )}
    </List>
  );
}

export default React.memo(ProfileViewReaction);