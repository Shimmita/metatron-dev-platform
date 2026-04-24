import {
  BookmarkRounded,
  GridViewRounded,
  MessageRounded,
  PeopleRounded,
  PersonAddRounded,
  PersonRemoveRounded,
  SendRounded,
  CloseRounded,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  resetClearShowMessageInput,
  resetDefaultBottomNav,
} from "../../../redux/AppUI";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import { updateUserCurrentUserRedux } from "../../../redux/CurrentUser";

import PostDetailsInDrawer from "../../post/PostDetailsInDrawer";
import SnackbarConnect from "../../snackbar/SnackbarConnect";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getImageMatch } from "../../utilities/getImageMatch";
import UserPostFavoriteContainer from "./UserPostFavoriteContainer";
import { appColors } from "../../../utils/colors";
const UserNetwork          = lazy(() => import("../UserNetwork"));
const PostDetailsContainer = lazy(() => import("../../post/PostDetailsContiner"));
const UserPostContainDrawer = lazy(() => import("./UserPostContainDrawer"));

/* ─── Tab definition ────────────────────────────────────────────────── */
const TABS = [
  { label: "Posts",    icon: <GridViewRounded  sx={{ width: 14, height: 14 }} /> },
  { label: "Saved",    icon: <BookmarkRounded  sx={{ width: 14, height: 14 }} /> },
  { label: "People",   icon: <PeopleRounded    sx={{ width: 14, height: 14 }} /> },
];

/* ─── Styled tab bar ────────────────────────────────────────────────── */
const TabBar = ({ value, onChange }) => (
  <Box
    display="flex"
    sx={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "10px",
      border: `1px solid ${appColors.divider}`,
      p: "3px",
      gap: "3px",
    }}
  >
    {TABS.map((tab, i) => {
      const active = value === i;
      return (
        <Box
          key={tab.label}
          onClick={() => onChange(i)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={0.6}
          sx={{
            flex: 1, py: "7px", px: 1,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.22s",
            background: active ? "rgba(20,210,190,0.12)" : "transparent",
            border: `1px solid ${active ? "rgba(20,210,190,0.3)" : "transparent"}`,
          }}
        >
          <Box sx={{ color: active ? appColors.primary : appColors.textMuted, display: "flex" }}>
            {tab.icon}
          </Box>
          <Typography
            sx={{
              fontSize: 11, fontWeight: active ? 600 : 400,
              color: active ? appColors.primary : appColors.textMuted,
              letterSpacing: "0.04em",
            }}
          >
            {tab.label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

/* ─── Action button ─────────────────────────────────────────────────── */
const ProfileActionBtn = ({ icon, label, onClick, disabled, variant = "default" }) => {
  const styles = {
    default: {
      bg: "rgba(255,255,255,0.05)",
      border: appColors.divider,
      color: appColors.textSecondary,
      hoverBg: "rgba(20,210,190,0.1)",
      hoverBorder: "rgba(20,210,190,0.35)",
      hoverColor: appColors.primary,
    },
    danger: {
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.18)",
      color: "rgba(239,68,68,0.8)",
      hoverBg: "rgba(239,68,68,0.14)",
      hoverBorder: "rgba(239,68,68,0.4)",
      hoverColor: "#EF4444",
    },
  }[variant];

  return (
    <Button
      fullWidth
      size="small"
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: "9px",
        py: 0.85, fontSize: 11.5,
        fontWeight: 500,
        textTransform: "none",
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        transition: "all 0.22s",
        "&:hover": { background: styles.hoverBg, borderColor: styles.hoverBorder, color: styles.hoverColor },
        "&.Mui-disabled": { opacity: 0.35, color: styles.color },
      }}
    >
      {label}
    </Button>
  );
};

/* ─── Skill avatars ─────────────────────────────────────────────────── */
const SkillRow = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <Box display="flex" alignItems="center" gap={1.2}>
      <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", flexShrink: 0 }}>
        Skills
      </Typography>
      <AvatarGroup
        max={skills.length}
        sx={{
          "& .MuiAvatar-root": {
            width: 24, height: 24, fontSize: 9,
            border: `1px solid ${appColors.border}`,
            background: "#0D1B2A",
          },
        }}
      >
        {skills.map((skill) => (
          <Tooltip title={skill} key={skill} arrow>
            <Avatar alt={skill} src={getImageMatch(skill)} />
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  );
};

/* ─── Message composer ──────────────────────────────────────────────── */
const MessageComposer = ({ value, onChange, onSend, onClose, isSending }) => (
  <Box
    sx={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${appColors.divider}`,
      borderRadius: "12px",
      overflow: "hidden",
    }}
  >
    <InputBase
      multiline
      fullWidth
      minRows={3}
      maxRows={6}
      value={value}
      onChange={onChange}
      disabled={isSending}
      placeholder="Write a message…"
      sx={{
        px: 2, pt: 1.5, pb: 1,
        fontSize: 13,
        color: appColors.textPrimary,
        "& textarea::placeholder": { color: appColors.textMuted, opacity: 1 },
      }}
    />
    <Box
      display="flex"
      justifyContent="flex-end"
      gap={1}
      sx={{
        px: 1.5, py: 1,
        borderTop: `1px solid ${appColors.divider}`,
        background: "rgba(0,0,0,0.15)",
      }}
    >
      <IconButton
        size="small"
        onClick={onClose}
        disabled={isSending}
        sx={{
          width: 30, height: 30, borderRadius: "7px",
          border: `1px solid ${appColors.divider}`,
          color: appColors.textMuted,
          "&:hover": { color: appColors.textPrimary },
        }}
      >
        <CloseRounded sx={{ width: 13, height: 13 }} />
      </IconButton>
      <Button
        size="small"
        onClick={onSend}
        disabled={value.trim().length < 1 || isSending}
        endIcon={isSending ? <CircularProgress size={10} /> : <SendRounded sx={{ width: 12, height: 12 }} />}
        sx={{
          borderRadius: "7px", px: 1.5, py: 0.5,
          fontSize: 11, fontWeight: 600,
          textTransform: "none",
          background: value.trim().length > 0 ? "rgba(20,210,190,0.15)" : "transparent",
          border: `1px solid ${value.trim().length > 0 ? "rgba(20,210,190,0.35)" : appColors.divider}`,
          color: value.trim().length > 0 ? appColors.primary : appColors.textMuted,
          "&:hover": { background: "rgba(20,210,190,0.22)", borderColor: "rgba(20,210,190,0.5)" },
          "&.Mui-disabled": { opacity: 0.35 },
        }}
      >
        Send
      </Button>
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════ */
export default function UserProfileDrawer({ profileData }) {
  const dispatch = useDispatch();

  const { user }                        = useSelector((s) => s.currentUser);
  const { messageConnectRequestSent }   = useSelector((s) => s.currentSnackBar);
  const { isMessageProfile }            = useSelector((s) => s.appUI);

  const [postDetailedData, setPostDetailedData]     = useState(null);
  const [isPostDetailedDrawer, setIsPostDetailedDrawer] = useState(false);
  const [isPostEditMode, setIsPostEditMode]         = useState(false);
  const [isConnecting, setIsConnecting]             = useState(false);
  const [isFriend, setIsFriend]                     = useState(false);
  const [profileSection, setProfileSection]         = useState(0);
  const [showMessage, setShowMessage]               = useState(isMessageProfile || false);
  const [messageContent, setMessageContent]         = useState("");

  const isCurrentUser = user._id === profileData?._id;
  const isOrg         = profileData?.account === "Organisation";

  const {
    _id: currentUserId, name, avatar,
    country, county,
    specialisationTitle: title,
  } = user || {};
  const { _id: targetID } = profileData || {};

  useEffect(() => {
    if (user?.network?.includes(profileData?._id)) setIsFriend(true);
  }, [profileData, user]);

  useEffect(() => { dispatch(resetDefaultBottomNav(true)); });

  /* ── Actions ── */
  const handleShowMessage = () => {
    setMessageContent("");
    setShowMessage((p) => !p);
    dispatch(resetClearShowMessageInput());
  };

  const dispatchError = (err) =>
    dispatch(updateMessageConnectRequest(
      err?.code === "ERR_NETWORK" ? "Server unreachable, check your internet" : err?.response?.data
    ));

  const handleConnect = () => {
    setIsConnecting(true);
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/create`, {
      senderId: currentUserId, targetId: targetID,
      country: CustomCountryName(country), state: county,
      name, avatar, title,
      message: "requesting to connect",
    })
      .then((res) => { if (res?.data) dispatch(updateMessageConnectRequest(res.data)); })
      .catch(dispatchError)
      .finally(() => setIsConnecting(false));
  };

  const handleUnfriend = () => {
    setIsConnecting(true);
    axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${profileData?._id}`)
      .then((res) => {
        if (res?.data) {
          dispatch(updateUserCurrentUserRedux(res.data.senderUser));
          dispatch(updateMessageConnectRequest(res.data.message));
          setIsFriend(false);
        }
      })
      .catch(dispatchError)
      .finally(() => setIsConnecting(false));
  };

  const handleSendMessage = async () => {
    try {
      setIsConnecting(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/create`,
        { senderId: user._id, content: messageContent, participants: [user._id, profileData._id] }
      );
      if (res.data) {
        dispatch(updateMessageConnectRequest("Message sent"));
        setMessageContent("");
      }
    } catch (err) { dispatchError(err); }
    finally { setIsConnecting(false); }
  };

  /* ── Post detail view ── */
  if (postDetailedData) {
    return isPostDetailedDrawer ? (
      <PostDetailsInDrawer
        postDetailedData={postDetailedData}
        setPostDetailedData={setPostDetailedData}
        isDrawerFocused
      />
    ) : (
      <PostDetailsContainer
        postDetailedData={postDetailedData}
        setPostDetailedData={setPostDetailedData}
        isDrawerFocused
        isPostEditMode={isPostEditMode}
        setIsPostEditMode={setIsPostEditMode}
      />
    );
  }

  /* ── Main render ── */
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": { width: 3 },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(20,210,190,0.2)",
          borderRadius: 2,
          "&:hover": { background: "rgba(20,210,190,0.4)" },
        },
      }}
    >
      {/* ━━ HERO — avatar + identity ━━ */}
      <Box
        sx={{
          position: "relative",
          px: 2, pt: 2.5, pb: 2,
          borderBottom: `1px solid ${appColors.divider}`,
          background: "rgba(20,210,190,0.025)",
        }}
      >
        {/* subtle top-center glow */}
        <Box sx={{
          position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
          width: 180, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,210,190,0.09), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={1.5}>
          <Avatar
            src={profileData?.avatar}
            alt={profileData?.name}
            sx={{
              width: 72, height: 72,
              border: `2px solid rgba(20,210,190,0.45)`,
              boxShadow: `0 0 0 4px rgba(20,210,190,0.1)`,
            }}
          />
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 16, fontWeight: 700,
            color: appColors.textPrimary,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          {profileData?.name}
        </Typography>

        {/* Role */}
        <Typography sx={{ fontSize: 12, color: appColors.textSecondary, textAlign: "center", mt: 0.4 }}>
          {profileData?.specialisationTitle}
        </Typography>

        {/* Location + network row */}
        <Box display="flex" justifyContent="center" gap={2} mt={1} flexWrap="wrap">
          {profileData?.county && (
            <Typography sx={{ fontSize: 11, color: appColors.textMuted }}>
              📍 {profileData.county}
            </Typography>
          )}
          {profileData?.network_count !== undefined && (
            <Typography sx={{ fontSize: 11, color: appColors.textMuted }}>
              👥 {profileData.network_count} connections
            </Typography>
          )}
        </Box>

        {/* Skills */}
        {!isOrg && profileData?.selectedSkills?.length > 0 && (
          <Box display="flex" justifyContent="center" mt={1.5}>
            <SkillRow skills={profileData.selectedSkills} />
          </Box>
        )}

        {/* About */}
        {profileData?.about && (
          <Typography
            sx={{
              fontSize: 12, color: appColors.textSecondary,
              textAlign: "center", mt: 1.5, lineHeight: 1.7,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {profileData.about}
          </Typography>
        )}
      </Box>

      {/* ━━ ACTION BUTTONS (other users only) ━━ */}
      {!isCurrentUser && (
        <Box
          display="flex"
          gap={1}
          sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${appColors.divider}` }}
        >
          <ProfileActionBtn
            icon={<MessageRounded sx={{ width: 14, height: 14 }} />}
            label="Message"
            onClick={handleShowMessage}
            disabled={showMessage}
          />
          {isFriend ? (
            <ProfileActionBtn
              icon={<PersonRemoveRounded sx={{ width: 14, height: 14 }} />}
              label="Remove"
              onClick={handleUnfriend}
              disabled={isConnecting}
              variant="danger"
            />
          ) : (
            <ProfileActionBtn
              icon={<PersonAddRounded sx={{ width: 14, height: 14 }} />}
              label="Connect"
              onClick={handleConnect}
              disabled={isConnecting}
            />
          )}
        </Box>
      )}

      {/* ━━ MESSAGE COMPOSER ━━ */}
      {showMessage && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${appColors.divider}` }}>
          <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", mb: 1 }}>
            Send Message
          </Typography>
          <MessageComposer
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onSend={handleSendMessage}
            onClose={handleShowMessage}
            isSending={isConnecting}
          />
        </Box>
      )}

      {/* ━━ TAB BAR ━━ */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <TabBar value={profileSection} onChange={setProfileSection} />
      </Box>

      {/* ━━ TAB CONTENT ━━ */}
      <Box>
        <Suspense
          fallback={
            <Box p={2} display="flex" flexDirection="column" gap={1.5}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={72}
                  sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "10px" }} />
              ))}
            </Box>
          }
        >
          {profileSection === 0 && (
            <UserPostContainDrawer
              userId={profileData?._id}
              setPostDetailedData={setPostDetailedData}
              setIsPostEditMode={setIsPostEditMode}
              setIsPostDetailedDrawer={setIsPostDetailedDrawer}
            />
          )}
          {profileSection === 1 && (
            <UserPostFavoriteContainer
              userId={profileData?._id}
              setPostDetailedData={setPostDetailedData}
              setIsPostEditMode={setIsPostEditMode}
              setIsPostDetailedDrawer={setIsPostDetailedDrawer}
            />
          )}
          {profileSection === 2 && (
            <UserNetwork otherUserID={!isCurrentUser ? profileData?._id : null} />
          )}
        </Suspense>
      </Box>

      {/* Snackbar */}
      {messageConnectRequestSent && <SnackbarConnect message={messageConnectRequestSent} />}
    </Box>
  );
}