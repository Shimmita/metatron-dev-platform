import {
  BarChart,
  CheckCircleRounded,
  Delete,
  Done,
  InfoOutlined,
  LockRounded,
  LocationOnRounded,
  OpenInNewRounded,
  ScheduleRounded,
  ShareRounded,
  SmartDisplayRounded,
  UnfoldLessRounded,
  UnfoldMoreRounded
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentEvents } from "../../../redux/CurrentEvents";
import { resetClearCurrentEventsTop } from "../../../redux/CurrentEventsTop";
import { updateCurrentSnackBar } from "../../../redux/CurrentSnackBar";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
import MetatronSnackbar from "../../snackbar/MetatronSnackBar";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getImageMatch } from "../../utilities/getImageMatch";
import { resolveVisualAsset } from "../../utilities/resolveVisualAsset";

const getRequestMessage = (err, fallback = "Unable to update event.") => {
  if (err?.code === "ERR_NETWORK") return "Server unreachable. Please try again later.";
  const payload = err?.response?.data || err;
  if (typeof payload === "string") return payload;
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  return fallback;
};
const EVENT_PAGE_SIZE = 12;
const appendUniqueById = (current = [], incoming = []) => {
  const seen = new Set(current.map((item) => item?._id).filter(Boolean));
  return [
    ...current,
    ...incoming.filter((item) => {
      if (!item?._id || seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    }),
  ];
};
const firstName = (value = "") => value.trim().split(/\s+/)[0] || "Host";

function EventItem({
  isDarkMode = false,
  event,
  setErrorMessage,
  isEventsManager = false,
  setIsEventsStats,
  setFocusedEvent,
  canLoadMore = true,
  isRSVP = false,
  isLastIndex = false,
  setPageNumber,
  pageNumber,
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [openMiniProfile, setOpenMiniProfile] = useState(false);
  const [openHostInfo, setOpenHostInfo] = useState(false);
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const infiniteScrollRef = useRef(null);
  const lastRequestedPageRef = useRef(0);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { events: eventsData } = useSelector((state) => state.currentEvents);
  const isUserMadeRSVP = event?.users?.value.some(
    (currentId) => currentId === user?._id
  );
  const isMyOwnEvent = event?.ownerId === user?._id;
  const isExternalEvent = Boolean(event?.externalEvent || (event?.source?.name && `${event?.ownerId || ""}`.startsWith("external-")));
  const canViewExternalEvent = Boolean(isExternalEvent && isUserMadeRSVP && event?.hostLink);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const dateFormat = new Date(event?.dateHosted);
  const formattedDate = dateFormat.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dispatch = useDispatch();

  const handleGuestRSVP = () => {
    setErrorMessage("access denied, please login to continue with your request!");
  };

  // RSVP create
  const handleCreateRSVP = () => {
    const rsvpObject = {
      userId: user?._id,
      eventId: event?._id,
      userName: user?.name,
      userEmail: user?.email,
      userGender: user?.gender,
      userCountry: CustomCountryName(user?.country),
      userAvatar: user?.avatar,
    };
    setIsFetching(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/create/rsvp/`, rsvpObject, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentSnackBar(res.data.message));
          const serverEventObject = res.data.data;
          const filteredEvents = eventsData?.filter((item) => item._id !== event?._id);
          dispatch(updateCurrentEvents([serverEventObject, ...filteredEvents]));
        }
      })
      .catch((err) => {
        if (err?.response?.data?.login) window.location.reload();
        setErrorMessage(getRequestMessage(err, "Unable to RSVP for this event."));
      })
      .finally(() => setIsFetching(false));
  };

  // RSVP delete
  const handleDeleteRSVP = () => {
    setIsFetching(true);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/delete/rsvp/${user?._id}/${event?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentSnackBar(res.data.message));
          dispatch(updateCurrentEvents(res.data.data));
        }
      })
      .catch((err) => {
        if (err?.response?.data?.login) window.location.reload();
        setErrorMessage(getRequestMessage(err, "Unable to remove this RSVP."));
      })
      .finally(() => setIsFetching(false));
  };

  // Delete own event
  const handleDeleteMyEvent = () => {
    setIsFetching(true);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/delete/event/${user?._id}/${event?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentSnackBar(res.data.message));
          dispatch(updateCurrentEvents(res.data.data));
          dispatch(resetClearCurrentEventsTop());
        }
      })
      .catch((err) => {
        if (err?.response?.data?.login) window.location.reload();
        setErrorMessage(getRequestMessage(err, "Unable to delete this event."));
      })
      .finally(() => setIsFetching(false));
  };

  const handleEventsStats = () => {
    if (isEventsManager) {
      setFocusedEvent(event);
      setIsEventsStats(true);
    }
  };

  const handleFetchMoreData = useCallback(() => {
    if (!hasMoreEvents || isFetching || isGuest) return;
    if (lastRequestedPageRef.current === pageNumber) return;

    lastRequestedPageRef.current = pageNumber;
    setIsFetching(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/?page=${pageNumber}&limit=${EVENT_PAGE_SIZE}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          if (res.data.length > 0) {
            dispatch(updateCurrentEvents(appendUniqueById(eventsData || [], res.data)));
            if (res.data.length < EVENT_PAGE_SIZE) {
              setHasMoreEvents(false);
            }
          } else {
            setHasMoreEvents(false);
          }
        }
        setPageNumber((prev) => prev + 1);
      })
      .catch((err) => {
        if (err?.response?.data?.login) window.location.reload();
        setErrorMessage(getRequestMessage(err, "Unable to load more events."));
      })
      .finally(() => setIsFetching(false));
  }, [dispatch, eventsData, hasMoreEvents, isFetching, isGuest, pageNumber, setErrorMessage, setPageNumber]);

  useEffect(() => {
    if (!isLastIndex || !canLoadMore || !hasMoreEvents || isFetching || isGuest) return undefined;
    const target = infiniteScrollRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleFetchMoreData();
        }
      },
      { root: null, rootMargin: "420px 0px", threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canLoadMore, handleFetchMoreData, hasMoreEvents, isFetching, isGuest, isLastIndex]);

  const handleShowMiniProfile = () => {
    if (isExternalEvent) {
      setOpenHostInfo((prev) => !prev);
      return;
    }
    setOpenMiniProfile(true);
  };

  const handleStreamEvent = () => window.open(event?.hostLink, "_blank", "noopener,noreferrer");

  const handleGetEventLink = async () => {
    const urlEvent = `${window.location.href}?id=${event?._id}`;
    try {
      await navigator.clipboard.writeText(urlEvent);
      setIsCopiedStatus(true);
      setTimeout(() => setIsCopiedStatus(false), 2000);
    } catch (err) {
      console.error("Failed to Copy: ", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={2}
      mb={isLastIndex ? 4 : 2}
      flexDirection="column"
      mt={1}
      sx={{ width: "100%", minWidth: 0, alignItems: "center" }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
          background: isDarkMode
            ? "rgba(15, 23, 42, 0.8)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(214,178,94, 0.2)" : "rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "primary.main",
            boxShadow: isDarkMode
              ? "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(214,178,94, 0.1)"
              : "0 20px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* ─── HUD HEADER ─── */}
        <Box
          sx={{
            p: 1.75,
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(214,178,94, 0.15), transparent)"
              : "linear-gradient(135deg, rgba(214,178,94, 0.05), transparent)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}>
              {event?.skills?.map((skill, index) => (
                <Tooltip title={skill} key={index} arrow>
                  <Avatar src={getImageMatch(skill)} />
                </Tooltip>
              ))}
            </AvatarGroup>
            <Typography variant="overline" sx={{ fontWeight: 800, color: "primary.main" }}>
              {event?.category}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1, lineHeight: 1.2, color: isDarkMode ? "#fff" : "#171717" }}>
            {event?.title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, opacity: 0.8 }}>
            <ScheduleRounded sx={{ fontSize: 14, color: "primary.main" }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formattedDate}
            </Typography>
          </Stack>
        </Box>

        <CardContent sx={{ px: 1.75, pt: 0, pb: 1.75 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.82rem",
                opacity: 0.8,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              {event?.about}
            </Typography>

            <ButtonBase
              onClick={handleToggleExpand}
              sx={{
                mt: 1,
                color: "primary.main",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                "&:hover": { opacity: 0.7 }
              }}
            >
              {isExpanded ? (
                <><UnfoldLessRounded sx={{ fontSize: 14, mr: 0.5 }} /> Show Less</>
              ) : (
                <><UnfoldMoreRounded sx={{ fontSize: 14, mr: 0.5 }} /> Read Full</>
              )}
            </ButtonBase>
          </Box>

          {/* ─── FULL DETAILS COLLAPSE ─── */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: isDarkMode ? "rgba(214,178,94, 0.05)" : "rgba(214,178,94, 0.05)",
                border: "1px dashed rgba(214,178,94, 0.3)"
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main", display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoOutlined sx={{ fontSize: 14, mr: 0.5 }} /> EVENT INTEL
              </Typography>

              <Typography variant="caption" component="div" sx={{ mb: 1, fontWeight: 600 }}>
                TOPICS COVERED:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {event?.topics?.map((topic) => (
                  <Typography variant="caption" key={topic} component="li" sx={{ opacity: 0.9 }}>
                    {topic}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Collapse>


          {/* ─── OWNER INFO ─── */}
          <ButtonBase
            onClick={!isGuest || isExternalEvent ? handleShowMiniProfile : undefined}
            component="div" // Ensures layout stays consistent with Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              width: "100%", // Ensures the hit area covers the full width
              borderRadius: "8px",
              textAlign: "left", // Reset text align for ButtonBase
              bgcolor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: "1px solid transparent",
              transition: "all 0.2s ease-in-out",
              cursor: isGuest && !isExternalEvent ? "default" : "pointer",
              "&:hover": {
                bgcolor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                borderColor: isDarkMode ? "rgba(214,178,94, 0.3)" : "rgba(214,178,94, 0.2)",
                transform: isGuest && !isExternalEvent ? "none" : "translateY(-1px)",
              },
            }}
          >
            {/* Host Avatar with Status Glow */}
            <Avatar
              src={resolveVisualAsset(event?.ownerAvatar, event?.topics?.[0] || event?.skills?.[0])}
              sx={{
                width: 34,
                height: 34,
                border: "2px solid",
                borderColor: "primary.main",
                boxShadow: isDarkMode ? "0 0 8px rgba(214,178,94, 0.2)" : "none",
              }}
            />

            <Box sx={{ ml: 1.5, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: "0.6rem",
                  color: "primary.main",
                  letterSpacing: 0.5,
                }}
              >
                Host
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: "0.78rem" }}>
                {firstName(event?.ownerName)}
              </Typography>
            </Box>

            <Box sx={{ ml: "auto", textAlign: "right" }}>
              <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                <LocationOnRounded sx={{ fontSize: 12, opacity: 0.6, color: "primary.main" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>
                  {event?.location?.state}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.5, fontSize: "0.65rem", display: "block" }}>
                {CustomCountryName(event?.location?.country)}
              </Typography>
            </Box>
          </ButtonBase>

          {isExternalEvent && (
            <Collapse in={openHostInfo} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  mt: 1,
                  p: 1.35,
                  borderRadius: "8px",
                  bgcolor: isDarkMode ? "rgba(214,178,94, 0.06)" : "rgba(214,178,94, 0.07)",
                  border: "1px solid rgba(214,178,94,0.22)",
                }}
              >
                <Typography variant="caption" sx={{ display: "block", color: "primary.main", fontWeight: 900 }}>
                  {event?.ownerName || "Event Host"}
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 0.6, opacity: 0.78, lineHeight: 1.45 }}>
                  {event?.hostAbout || event?.ownerSpecialize || "This host publishes the official details for this external technology event."}
                </Typography>
              </Box>
            </Collapse>
          )}

          <Divider sx={{ my: 2, opacity: 0.1 }} />

          {/* ─── RSVP STATUS PILL ─── */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                fontSize: "0.65rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                bgcolor: isUserMadeRSVP ? "rgba(214,178,94, 0.1)" : "rgba(0,0,0,0.05)",
                color: isUserMadeRSVP ? "#D6B25E" : "text.secondary",
              }}
            >
              {isUserMadeRSVP ? `RSVP Confirmed (+${event?.users?.count})` : `${event?.users?.count} Attending`}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, opacity: 0.1 }} />

          {/* ─── ACTION MATRIX ─── */}
          <Stack spacing={1}>
            {isRSVP || isEventsManager ? (
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  startIcon={isRSVP ? isExternalEvent ? <OpenInNewRounded /> : <SmartDisplayRounded /> : <BarChart />}
                  onClick={isRSVP ? handleStreamEvent : handleEventsStats}
                  sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }}
                >
                  {isRSVP ? isExternalEvent ? "View Event" : "Stream" : "Analytics"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<Delete />}
                  onClick={isRSVP ? handleDeleteRSVP : handleDeleteMyEvent}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 800,
                    textTransform: "none",
                    borderColor: "rgba(214,178,94,0.28)",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.main",
                      background: "rgba(214,178,94,0.08)",
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleGetEventLink}
                  startIcon={isCopiedStatus ? <Done /> : <ShareRounded />}
	                  sx={{ borderRadius: "10px", fontWeight: 800, minWidth: "100px", color: isCopiedStatus ? "primary.main" : "inherit" }}
                >
                  {isCopiedStatus ? "Linked" : "Share"}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isFetching || isMyOwnEvent || (isUserMadeRSVP && !canViewExternalEvent)}
                  onClick={isGuest ? handleGuestRSVP : canViewExternalEvent ? handleStreamEvent : handleCreateRSVP}
                  startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : canViewExternalEvent ? <OpenInNewRounded /> : isGuest ? <LockRounded /> : <CheckCircleRounded />}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 800,
                    background: isUserMadeRSVP ? "rgba(214,178,94, 0.2)" : "primary.main",
                  }}
                >
                  {isMyOwnEvent ? "Owner" : canViewExternalEvent ? "View Event" : isUserMadeRSVP ? "Joined" : "RSVP Now"}
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {isLastIndex && canLoadMore && (
        <Box ref={infiniteScrollRef} sx={{ display: "flex", justifyContent: "center", mt: 1, minHeight: 38 }}>
          {isGuest ? (
            <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
              Sign in to keep exploring more events.
            </Typography>
          ) : isFetching ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Loading more events...
              </Typography>
            </Stack>
          ) : !hasMoreEvents && (
            <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
              no more events available at the moment
            </Typography>
          )}
        </Box>
      )}

      {/* show snack success when link copied */}
      {isCopiedStatus && (
        <MetatronSnackbar
          open={isCopiedStatus}
          message={"Event link copied to clipboard!"}
          handleClose={setIsCopiedStatus}

        />
      )}

      {/* Profile HUD Alert */}
      {openMiniProfile && !isExternalEvent && (
        <AlertMiniProfileView openAlert={openMiniProfile} setOpenAlert={setOpenMiniProfile} userId={event?.ownerId} />
      )}
    </Box>
  );
}

export default EventItem;
