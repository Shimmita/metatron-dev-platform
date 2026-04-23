import {
  Close,
  EmailRounded,
  GitHub,
  Language,
  LinkedIn,
  LocationOnRounded,
  PeopleRounded,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  IconButton,
  Skeleton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageMatch } from "../utilities/getImageMatch";
import AlertInputMessage from "./AlertInputMessage";
import { appColors } from "../../utils/colors";

/* ─── Transition ────────────────────────────────────────────────────── */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ─── Online pulse badge ────────────────────────────────────────────── */
const OnlineBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: appColors.success,
    color: appColors.success,
    boxShadow: `0 0 0 2px #081220`,
    "&::after": {
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      borderRadius: "50%",
      animation: "mpRipple 1.4s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes mpRipple": {
    "0%":   { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.6)", opacity: 0 },
  },
}));

/* ─── Action button ─────────────────────────────────────────────────── */
const ActionBtn = ({ icon, label, onClick, disabled }) => (
  <Tooltip title={label} arrow>
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 36, height: 36,
          borderRadius: "9px",
          border: `1px solid ${disabled ? "rgba(255,255,255,0.05)" : appColors.border}`,
          background: disabled ? "transparent" : "rgba(255,255,255,0.04)",
          color: disabled ? "rgba(255,255,255,0.12)" : "rgba(240,244,250,0.55)",
          transition: "all 0.2s",
          "&:hover": disabled ? {} : {
            color: appColors.primary,
            borderColor: appColors.glow,
            background: "rgba(20,210,190,0.1)",
            transform: "translateY(-2px)",
            boxShadow: `0 4px 12px ${appColors.glow}`,
          },
        }}
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
);

/* ─── Inline stat ───────────────────────────────────────────────────── */
const InlineStat = ({ icon, value }) => (
  <Box display="flex" alignItems="center" gap={0.6}>
    <Box sx={{ color: appColors.primary, display: "flex", alignItems: "center" }}>{icon}</Box>
    <Typography sx={{ fontSize: 12, color: appColors.textSecondary }}>{value}</Typography>
  </Box>
);

/* ─── Skeleton ──────────────────────────────────────────────────────── */
const ProfileSkeleton = () => (
  <Box p={2.5}>
    {/* header row */}
    <Box display="flex" gap={2} alignItems="center" mb={2}>
      <Skeleton variant="circular" width={62} height={62} sx={{ bgcolor: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
      <Box flex={1}>
        <Skeleton variant="text" width="65%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
        <Skeleton variant="text" width="45%" height={15} sx={{ bgcolor: "rgba(255,255,255,0.07)", mt: 0.5 }} />
        <Skeleton variant="text" width="55%" height={14} sx={{ bgcolor: "rgba(255,255,255,0.07)", mt: 0.5 }} />
      </Box>
    </Box>
    <Skeleton variant="rounded" width="100%" height={52} sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: "10px", mb: 1.5 }} />
    <Box display="flex" justifyContent="center" gap={1.5}>
      {[1,2,3,4].map(i => (
        <Skeleton key={i} variant="rounded" width={36} height={36} sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: "9px" }} />
      ))}
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════ */
export default function AlertMiniProfileView({ openAlert, setOpenAlert, userId }) {
  const [miniProfileData, setMiniProfileData] = useState(null);
  const [isFetching, setIsFetching]           = useState(true);
  const [error, setError]                     = useState("");
  const [isOnline, setIsOnline]               = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);

  const { user }      = useSelector((s) => s.currentUser);
  const { _id: currentUserId } = user || {};

  const isFriends = miniProfileData?.network?.includes(currentUserId);
  const isSelf    = userId === currentUserId;
  const isOrg     = miniProfileData?.account === "Organisation";
  const hasGit    = miniProfileData?.gitHub?.length > 2;
  const hasLi     = miniProfileData?.linkedin?.length > 2;
  const hasWeb    = miniProfileData?.portfolio?.length > 2;

  useLayoutEffect(() => {
    if (!userId || !currentUserId) return;
    setIsFetching(true);
    setError("");
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/specific/${userId}/${currentUserId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setMiniProfileData(res?.data?.user);
        setIsOnline(res?.data?.isOnline);
      })
      .catch((err) => {
        setError(err?.code === "ERR_NETWORK" ? "Server unreachable" : "Failed to load profile");
      })
      .finally(() => setIsFetching(false));
  }, [userId, currentUserId]);

  const handleClose = () => { setOpenAlert(false); setError(""); };

  const getCountryName = (country) => {
    const p = country?.split(" ");
    return p?.length < 4 ? p?.[1] : `${p?.[1]} ${p?.[2]}`;
  };

  /* relation */
  const relationLabel  = isSelf ? "You" : isFriends ? "Connected" : null;
  const relationColor  = isSelf ? appColors.accent : appColors.primary;
  const relationBg     = isSelf ? "rgba(200,169,110,0.12)" : "rgba(20,210,190,0.1)";
  const relationBorder = isSelf ? "rgba(200,169,110,0.28)" : "rgba(20,210,190,0.28)";

  return (
    <>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            background: "rgba(8,18,32,0.92)",
            backdropFilter: "blur(40px)",
            border: `1px solid ${appColors.border}`,
            borderRadius: "18px",
            boxShadow: `0 28px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07)`,
            width: "100%",
            maxWidth: 400,
            minWidth: { xs: "88vw", sm: 360 },
            overflow: "hidden",
            position: "relative",
          },
        }}
        sx={{ "& .MuiBackdrop-root": { backdropFilter: "blur(6px)", background: "rgba(6,13,24,0.65)" } }}
      >
        {/* Top teal glow */}
        <Box sx={{
          position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
          width: 220, height: 130, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,210,190,0.13), transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Close */}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute", top: 10, right: 10, zIndex: 20,
            width: 26, height: 26, borderRadius: "7px",
            border: `1px solid ${appColors.divider}`,
            color: appColors.textMuted,
            "&:hover": { color: appColors.textPrimary, borderColor: appColors.border },
          }}
        >
          <Close sx={{ width: 12, height: 12 }} />
        </IconButton>

        {/* ── Content ── */}
        <Box sx={{ position: "relative", zIndex: 1 }}>

          {isFetching && <ProfileSkeleton />}

          {/* Error */}
          {!isFetching && error && (
            <Box p={3} textAlign="center">
              <Typography sx={{ fontSize: 13, color: appColors.warning }}>{error}</Typography>
              <Typography sx={{ fontSize: 11, color: appColors.textMuted, mt: 0.5 }}>
                Check your connection and try again.
              </Typography>
            </Box>
          )}

          {/* No data */}
          {!isFetching && !error && !miniProfileData && (
            <Box p={3} textAlign="center">
              <Typography sx={{ fontSize: 13, color: appColors.textSecondary }}>No profile found.</Typography>
            </Box>
          )}

          {/* ── Profile ── */}
          {!isFetching && miniProfileData && (
            <Box>

              {/* ━━ HEADER ROW ━━ */}
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  p: "18px 20px 16px",
                  borderBottom: `1px solid ${appColors.divider}`,
                }}
              >
                {/* Avatar */}
                {isOnline ? (
                  <OnlineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      src={miniProfileData?.avatar}
                      alt={miniProfileData?.name}
                      sx={{
                        width: 62, height: 62, flexShrink: 0,
                        border: `1.5px solid rgba(20,210,190,0.5)`,
                        boxShadow: `0 0 0 3px rgba(20,210,190,0.12)`,
                      }}
                    />
                  </OnlineBadge>
                ) : (
                  <Avatar
                    src={miniProfileData?.avatar}
                    alt={miniProfileData?.name}
                    sx={{
                      width: 62, height: 62, flexShrink: 0,
                      border: `1.5px solid ${appColors.border}`,
                    }}
                  />
                )}

                {/* Identity */}
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 16, fontWeight: 700,
                        color: appColors.textPrimary,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {miniProfileData?.name}
                    </Typography>

                    {relationLabel && (
                      <Box sx={{
                        px: 1, py: "1px",
                        borderRadius: "20px",
                        background: relationBg,
                        border: `1px solid ${relationBorder}`,
                        flexShrink: 0,
                      }}>
                        <Typography sx={{ fontSize: 9, color: relationColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          {relationLabel}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography sx={{ fontSize: 11.5, color: appColors.textSecondary, mt: 0.3 }}>
                    {miniProfileData?.specialisationTitle || "—"}
                  </Typography>

                  {/* Inline stats row */}
                  <Box display="flex" flexWrap="wrap" gap={1.5} mt={0.8}>
                    <InlineStat
                      icon={<LocationOnRounded sx={{ width: 11, height: 11 }} />}
                      value={`${miniProfileData?.county || "—"}, ${getCountryName(miniProfileData?.country) || "—"}`}
                    />
                    <InlineStat
                      icon={<PeopleRounded sx={{ width: 11, height: 11 }} />}
                      value={`${miniProfileData?.network_count ?? 0} connections`}
                    />
                  </Box>
                </Box>
              </Box>

              {/* ━━ SKILLS (personal only) ━━ */}
              {!isOrg && miniProfileData?.selectedSkills?.length > 0 && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    px: "20px", py: "11px",
                    borderBottom: `1px solid ${appColors.divider}`,
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", flexShrink: 0 }}>
                    Skills
                  </Typography>
                  <AvatarGroup
                    max={5}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 28, height: 28,
                        fontSize: 10,
                        border: `1px solid ${appColors.border}`,
                        background: "#0D1B2A",
                      },
                    }}
                  >
                    {miniProfileData?.selectedSkills?.map((skill) => (
                      <Tooltip title={skill} key={skill} arrow>
                        <Avatar alt={skill} src={getImageMatch(skill)} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
              )}

              {/* ━━ ABOUT ━━ */}
              {miniProfileData?.about ? (
                <Box
                  sx={{
                    px: "20px", py: "12px",
                    borderBottom: `1px solid ${appColors.divider}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12, color: appColors.textSecondary,
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {miniProfileData.about}
                  </Typography>
                </Box>
              ) : null}

              {/* ━━ FOOTER: joined + actions ━━ */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: "20px", py: "12px" }}
              >
                <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.08em" }}>
                  Joined {miniProfileData?.createdAt?.split("T")[0] ?? "—"}
                </Typography>

                <Box display="flex" gap={1}>
                  <ActionBtn
                    icon={<EmailRounded sx={{ width: 15, height: 15 }} />}
                    label="Message"
                    onClick={() => setOpenAlertMessage(true)}
                    disabled={isSelf}
                  />
                  <ActionBtn
                    icon={<GitHub sx={{ width: 15, height: 15 }} />}
                    label="GitHub"
                    onClick={() => window.open(miniProfileData?.gitHub, "__blank__")}
                    disabled={!hasGit}
                  />
                  <ActionBtn
                    icon={<LinkedIn sx={{ width: 15, height: 15 }} />}
                    label="LinkedIn"
                    onClick={() => window.open(miniProfileData?.linkedin, "__blank__")}
                    disabled={!hasLi}
                  />
                  <ActionBtn
                    icon={<Language sx={{ width: 15, height: 15 }} />}
                    label="Portfolio"
                    onClick={() => window.open(miniProfileData?.portfolio, "__blank__")}
                    disabled={!hasWeb}
                  />
                </Box>
              </Box>

            </Box>
          )}
        </Box>
      </Dialog>

      {openAlertMessage && (
        <AlertInputMessage
          openAlert={openAlertMessage}
          setOpenAlert={setOpenAlertMessage}
          targetId={miniProfileData?._id}
          targetName={miniProfileData?.name}
          targetSpecialisation={miniProfileData?.specialisationTitle}
          targetAvatar={miniProfileData?.avatar}
        />
      )}
    </>
  );
}