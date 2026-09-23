import {
  AddRounded,
  AutoAwesomeRounded,
  GroupsRounded,
  InfoRounded,
  LockRounded,
  RefreshRounded,
  RemoveCircleOutlineRounded,
  SearchRounded,
  TrendingUpRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleShowingSpeedDial,
  handleSidebarRightbar,
  resetDarkMode,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentGroupsCommunities } from "../../redux/CurrentGroups";
import AlertGeneral from "../alerts/AlertGeneral";
import ParentNotifMessageDrawer from "../messaging/ParentNotifMessageDrawer";
import GlobalAppBar from "../navbar/GlobalNavBar";
import ProfileDrawer from "../profile/drawer/ProfileDrawer";
import MetatronSnackbar from "../snackbar/MetatronSnackBar";
import { getImageMatch } from "../utilities/getImageMatch";
import GroupCommunityDetails from "./GroupCommunityDetails";

const panelSx = {
  border: "1px solid rgba(214,178,94,0.16)",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.035)",
  minWidth: 0,
};

const railSx = {
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  "&::-webkit-scrollbar": { display: "none" },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const sortOptions = [
  { value: "activity", label: "Most Active" },
  { value: "members", label: "Members" },
  { value: "posts", label: "Posts" },
  { value: "name", label: "Name" },
];

const filterOptions = [
  { value: "all", label: "All" },
  { value: "joined", label: "Joined" },
  { value: "discover", label: "Discover" },
];

const getGroupImage = (name = "") =>
  name.includes("System Design and Principles")
    ? null
    : getImageMatch(name.split(","), false, true);

export default function CommunityPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentMode,
    isOpenDrawerProfile,
    isOpenMessageDrawer,
    isSidebarRighbar,
  } = useSelector((state) => state.appUI);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { groups } = useSelector((state) => state.currentGroups);
  const { messageSnack } = useSelector((state) => state.currentSnackBar);

  const isDarkMode = currentMode === "dark";
  const communities = useMemo(() => Array.isArray(groups) ? groups : [], [groups]);

  const [isFetching, setIsFetching] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [focusedGroup, setFocusedGroup] = useState(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("activity");

  const userId = isGuest ? "guest" : user?._id;

  useLayoutEffect(() => {
    dispatch(updateCurrentBottomNav(4));
    dispatch(handleShowingSpeedDial(false));
    dispatch(handleSidebarRightbar(true));
    dispatch(handleIsJobsGlobalResults(false));
  }, [dispatch, isSidebarRighbar]);

  const fetchCommunities = (preferredGroupId) => {
    if (!userId) return;

    setIsFetching(true);
    setErrorMessage("");

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/all/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const nextGroups = Array.isArray(res?.data) ? res.data : [];
        dispatch(updateCurrentGroupsCommunities(nextGroups));

        const nextSelected =
          nextGroups.find((group) => group._id === preferredGroupId) ||
          nextGroups.find((group) => group.isMember) ||
          nextGroups[0] ||
          null;

        setSelectedGroup(nextSelected);

        if (preferredGroupId && nextSelected?._id) {
          fetchGroupDetails(nextSelected);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data.login) {
          window.location.reload();
          return;
        }
        setErrorMessage(
          err?.code === "ERR_NETWORK"
            ? "Server unreachable. Please try again later."
            : err?.response?.data || "Unable to load communities."
        );
      })
      .finally(() => setIsFetching(false));
  };

  const fetchGroupDetails = (group) => {
    if (!userId || !group?._id) return;

    setSelectedGroup(group);
    setIsFetching(true);
    setErrorMessage("");

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/all/${userId}/${group._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setFocusedGroup(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data.login) {
          window.location.reload();
          return;
        }
        setErrorMessage(
          err?.code === "ERR_NETWORK"
            ? "Server unreachable. Please try again later."
            : err?.response?.data || "Unable to load community details."
        );
      })
      .finally(() => setIsFetching(false));
  };

  useEffect(() => {
    fetchCommunities(selectedGroup?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (selectedGroup?._id) {
      fetchGroupDetails(selectedGroup);
    } else {
      setFocusedGroup(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup?._id]);

  const handleJoinCommunity = (group) => {
    if (isGuest) {
      navigate("/auth/login");
      return;
    }

    setIsActionLoading(true);
    setErrorMessage("");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/join`,
        { userId: user?._id, groupId: group._id },
        { withCredentials: true }
      )
      .then((res) => {
        setInfoMessage(res?.data || `Joined ${group.name}.`);
        fetchCommunities(group._id);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          err?.code === "ERR_NETWORK"
            ? "Server unreachable. Please try again later."
            : err?.response?.data || "Unable to join community."
        );
      })
      .finally(() => setIsActionLoading(false));
  };

  const handleLeaveCommunity = (group) => {
    if (isGuest) {
      navigate("/auth/login");
      return;
    }

    setIsActionLoading(true);
    setErrorMessage("");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/leave`,
        { userId: user?._id, groupId: group._id },
        { withCredentials: true }
      )
      .then((res) => {
        setInfoMessage(res?.data || `Left ${group.name}.`);
        fetchCommunities(group._id);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          err?.code === "ERR_NETWORK"
            ? "Server unreachable. Please try again later."
            : err?.response?.data || "Unable to leave community."
        );
      })
      .finally(() => setIsActionLoading(false));
  };

  const filteredCommunities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return communities
      .filter((group) => {
        if (activeFilter === "joined" && !group.isMember) return false;
        if (activeFilter === "discover" && group.isMember) return false;
        if (!normalizedQuery) return true;
        return group.name?.toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === "members") return Number(b.total || 0) - Number(a.total || 0);
        if (sortBy === "posts") return Number(b.post_count || 0) - Number(a.post_count || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (Number(b.total || 0) + Number(b.post_count || 0) * 3) - (Number(a.total || 0) + Number(a.post_count || 0) * 3);
      });
  }, [activeFilter, communities, query, sortBy]);

  const memberGroups = communities.filter((group) => group.isMember);
  const totalMembers = communities.reduce((total, group) => total + Number(group.total || 0), 0);
  const totalPosts = communities.reduce((total, group) => total + Number(group.post_count || 0), 0);
  const topCommunity = communities
    .slice()
    .sort((a, b) => Number(b.post_count || 0) - Number(a.post_count || 0))[0];
  const recommendedGroups = communities
    .filter((group) => !group.isMember)
    .slice()
    .sort((a, b) => {
      const bScore = Number(b.total || 0) + Number(b.post_count || 0) * 3;
      const aScore = Number(a.total || 0) + Number(a.post_count || 0) * 3;
      return bScore - aScore;
    })
    .slice(0, 3);
  const activeCommunity = focusedGroup?.group || selectedGroup;
  const activeMembers = focusedGroup?.users || [];
  const maxActivityScore = Math.max(
    1,
    ...communities.map((group) => Number(group.total || 0) + Number(group.post_count || 0) * 3)
  );

  const handleShowDarkMode = () => {
    dispatch(resetDarkMode());
  };

  const handleShowingProfileDrawer = () => {
    dispatch(showUserProfileDrawer());
  };

  const handleNavigateLogin = () => {
    navigate("/auth/login");
  };

  return (
    <Suspense
      fallback={
        <Box height="88vh" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={24} />
        </Box>
      }
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(5,8,18,0.98), rgba(10,10,10,0.98))"
            : "linear-gradient(180deg, #F7F3EA, #F7F3EA)",
        }}
      >
        <GlobalAppBar
          open={false}
          handleNavigateLogin={handleNavigateLogin}
          handleShowDarkMode={handleShowDarkMode}
          handleRefreshData={() => fetchCommunities(selectedGroup?._id)}
          handleShowDrawerPane={() => {}}
          handleShowingProfileDrawer={handleShowingProfileDrawer}
          isDrawerPane={false}
          isDarkMode={isDarkMode}
          textOption="Community"
          title="METATRON COMMUNITY"
          subtitle="Builder Network"
          isGuest={isGuest}
          user={user}
        />

        <Box
          sx={{
            minHeight: { xs: "100dvh", lg: "100vh" },
            height: { xs: "100dvh", lg: "100vh" },
            boxSizing: "border-box",
            px: { xs: 1, sm: 1.5, md: 2.5 },
            pt: { xs: 7, md: 7.5 },
            pb: { xs: 10, lg: 2 },
            overflow: "hidden",
          }}
        >
          <Box
            data-metatron-rail="true"
            sx={{
              maxWidth: 1440,
              mx: "auto",
              height: "100%",
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0, 1fr) 300px" },
              gridTemplateRows: { xs: "auto minmax(0, 1fr)", lg: "1fr" },
              gap: { xs: 1, sm: 1.25, lg: 2 },
              alignItems: { xs: "stretch", lg: "start" },
              overflowY: "hidden",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Stack
              data-metatron-rail="true"
              spacing={{ xs: 1, lg: 1.5 }}
              sx={{
                height: { xs: "auto", lg: "100%" },
                minHeight: 0,
                pr: { lg: 0.25 },
                overflowY: { xs: "visible", lg: "auto" },
                overflowX: "hidden",
                overscrollBehavior: "contain",
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <Box sx={{ ...panelSx, p: { xs: 1.35, sm: 1.6 }, display: { xs: "none", sm: "block" } }}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Avatar sx={{ bgcolor: "rgba(214,178,94,0.16)", color: "#D6B25E" }}>
                    <GroupsRounded />
                  </Avatar>
                  <Box minWidth={0}>
                    <Typography variant="h6" fontWeight={950} lineHeight={1.12}>
                      Community
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.45}>
                      Join focused tech groups, follow useful proof-of-work, and find builders around your stack.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)", lg: "repeat(2, 1fr)" },
                    gap: 1,
                    mt: 1.5,
                  }}
                >
                  {[
                    ["Groups", communities.length],
                    ["Joined", memberGroups.length],
                    ["Members", totalMembers],
                    ["Posts", totalPosts],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ ...panelSx, p: 1, background: "rgba(214,178,94,0.055)" }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={900}>
                        {label}
                      </Typography>
                      <Typography fontWeight={950}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {!isGuest && memberGroups.length > 0 && (
                <Box sx={{ ...panelSx, p: 1.2, display: { xs: "none", md: "block" } }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={900}>
                    Your Communities
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mt={1}>
                    {memberGroups.slice(0, 8).map((group) => (
                      <Chip
                        key={group._id || group.name}
                        clickable
                        color={selectedGroup?._id === group._id ? "primary" : "default"}
                        label={group.name}
                        onClick={() => fetchGroupDetails(group)}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ ...panelSx, p: { xs: 1, sm: 1.2 } }}>
                <Stack spacing={1}>
                  <TextField
                    size="small"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search communities"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRounded fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {filterOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        clickable
                        color={activeFilter === option.value ? "primary" : "default"}
                        onClick={() => setActiveFilter(option.value)}
                      />
                    ))}
                  </Stack>

                  <Stack direction={{ xs: "row", lg: "column" }} spacing={1}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Sort"
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      variant="outlined"
                      size="small"
                      disabled={!query && activeFilter === "all" && sortBy === "activity"}
                      onClick={() => {
                        setQuery("");
                        setActiveFilter("all");
                        setSortBy("activity");
                      }}
                      sx={{
                        borderRadius: "8px",
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        minWidth: { xs: 84, sm: 118, lg: "auto" },
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Box>

              <Box
                sx={{
                  ...panelSx,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  flex: "0 0 auto",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={900}>
                      Directory
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {filteredCommunities.length} of {communities.length} groups
                    </Typography>
                  </Box>
                  <Tooltip title="Refresh communities">
                    <IconButton size="small" onClick={() => fetchCommunities(selectedGroup?._id)}>
                      {isFetching ? <CircularProgress size={16} /> : <RefreshRounded fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack
                  direction={{ xs: "row", lg: "column" }}
                  spacing={{ xs: 1, lg: 0.85 }}
                  sx={{
                    minHeight: 0,
                    overflowX: { xs: "auto", lg: "visible" },
                    overflowY: "hidden",
                    pb: { xs: 0.25, lg: 0 },
                    "&::-webkit-scrollbar": { display: "none" },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {isFetching && communities.length === 0 && [0, 1, 2, 3].map((item) => (
                    <Box key={item} sx={{ ...panelSx, p: 1, display: "flex", gap: 1, alignItems: "center" }}>
                      <Skeleton variant="circular" width={38} height={38} />
                      <Box flex={1}>
                        <Skeleton width="76%" />
                        <Skeleton width="44%" />
                      </Box>
                    </Box>
                  ))}

                  {!filteredCommunities.length && !isFetching && (
                    <Stack spacing={1} alignItems="center" textAlign="center" py={3}>
                      <SearchRounded sx={{ color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        No communities match your current filters.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setQuery("");
                          setActiveFilter("all");
                        }}
                      >
                        Clear Search
                      </Button>
                    </Stack>
                  )}

                  {filteredCommunities.map((group) => {
                    const isSelected = selectedGroup?._id === group._id;
                    const activityScore = Number(group.total || 0) + Number(group.post_count || 0) * 3;
                    const activityWidth = Math.max(8, Math.round((activityScore / maxActivityScore) * 100));

                    return (
                      <Box
                        key={group._id}
                        onClick={() => fetchGroupDetails(group)}
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "nowrap",
                          width: { xs: "min(78vw, 260px)", lg: "100%" },
                          flex: { xs: "0 0 min(78vw, 260px)", lg: "0 0 auto" },
                          minHeight: 58,
                          p: 1,
                          borderRadius: "8px",
                          border: "1px solid",
                          borderColor: isSelected ? "rgba(214,178,94,0.46)" : "transparent",
                          bgcolor: isSelected ? "rgba(214,178,94,0.10)" : "transparent",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.045)" },
                        }}
                      >
                        <Avatar
                          src={getGroupImage(group.name)}
                          sx={{ width: 38, height: 38, bgcolor: "rgba(214,178,94,0.12)", flex: "0 0 auto" }}
                        />
                        <Box minWidth={0} flex={1}>
                          <Typography variant="body2" fontWeight={900} noWrap>
                            {group.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {group.total || 0} members · {group.post_count || 0} posts
                          </Typography>
                          <Box
                            sx={{
                              width: "100%",
                              height: 4,
                              mt: 0.65,
                              borderRadius: 999,
                              bgcolor: "rgba(255,255,255,0.08)",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${activityWidth}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: "linear-gradient(90deg,#8B6F2A,#D6B25E)",
                              }}
                            />
                          </Box>
                        </Box>
                        <Stack direction="row" spacing={0.5} sx={{ flex: "0 0 auto" }}>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                fetchGroupDetails(group);
                              }}
                              sx={{ border: "1px solid", borderColor: "divider" }}
                            >
                              <VisibilityRounded sx={{ width: 17, height: 17 }} />
                            </IconButton>
                          </Tooltip>
                          {group.isMember ? (
                            <Tooltip title="Leave">
                              <IconButton
                                size="small"
                                disabled={isActionLoading}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLeaveCommunity(group);
                                }}
                                sx={{ border: "1px solid", borderColor: "divider" }}
                              >
                                <RemoveCircleOutlineRounded sx={{ width: 17, height: 17 }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title={isGuest ? "Sign in to join" : "Join"}>
                              <IconButton
                                size="small"
                                disabled={isActionLoading}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleJoinCommunity(group);
                                }}
                                sx={{ border: "1px solid", borderColor: "divider" }}
                              >
                                {isGuest ? <LockRounded sx={{ width: 17, height: 17 }} /> : <AddRounded sx={{ width: 17, height: 17 }} />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>

            <Stack
              spacing={{ xs: 1, lg: 1.5 }}
              minWidth={0}
              sx={{
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  ...panelSx,
                  p: { xs: 1.25, sm: 1.5 },
                  display: { xs: "none", md: "block" },
                  background:
                    "linear-gradient(135deg, rgba(214,178,94,0.14), rgba(255,255,255,0.035))",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                  gap={1.5}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AutoAwesomeRounded sx={{ color: "#D6B25E" }} />
                      <Typography fontWeight={950}>Community Control Room</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Explore groups by real participation signals, preview active posts, and keep your joined circles intentional.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {topCommunity && (
                      <Chip icon={<TrendingUpRounded />} label={`Trending: ${topCommunity.name}`} />
                    )}
                    {!isGuest && <Chip color="success" label={`${memberGroups.length} joined`} />}
                    {activeCommunity && (
                      <Chip label={`Viewing: ${activeCommunity.name}`} />
                    )}
                  </Stack>
                </Stack>
              </Box>

              {activeCommunity && (
                <Box sx={{ ...panelSx, p: { xs: 1, sm: 1.2 }, flex: "0 0 auto" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Box minWidth={0}>
                      <Typography variant="caption" color="text.secondary" fontWeight={900}>
                        Active Community
                      </Typography>
                      <Typography fontWeight={950} noWrap>
                        {activeCommunity.name}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ flex: "0 0 auto" }}>
                      {activeCommunity.isMember ? (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={isActionLoading}
                          startIcon={<RemoveCircleOutlineRounded />}
                          onClick={() => handleLeaveCommunity(activeCommunity)}
                          sx={{ borderRadius: "8px", fontWeight: 900, minWidth: 82 }}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={isActionLoading}
                          startIcon={isGuest ? <LockRounded /> : <AddRounded />}
                          onClick={() => handleJoinCommunity(activeCommunity)}
                          sx={{
                            borderRadius: "8px",
                            color: "#080808",
                            fontWeight: 900,
                            minWidth: 82,
                            background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
                          }}
                        >
                          {isGuest ? "Sign In" : "Join"}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {focusedGroup ? (
                <Box sx={{ flex: "1 1 0", minHeight: 0, overflow: "hidden" }}>
                  <GroupCommunityDetails
                    focusedGroup={focusedGroup}
                    userId={isGuest ? null : user?._id}
                    handleJoinCommunity={handleJoinCommunity}
                    handleLeaveCommunity={handleLeaveCommunity}
                  />
                </Box>
              ) : (
                <Box sx={{ ...panelSx, p: 4, textAlign: "center" }}>
                  {isFetching ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Stack spacing={1} alignItems="center">
                      <GroupsRounded sx={{ width: 46, height: 46, color: "text.secondary" }} />
                      <Typography fontWeight={900}>Select a community</Typography>
                      <Typography variant="body2" color="text.secondary" maxWidth={440}>
                        Choose a group from the directory to see its members, posts, and membership actions.
                      </Typography>
                    </Stack>
                  )}
                </Box>
              )}

            </Stack>

            <Stack
              data-metatron-rail="true"
              spacing={1.5}
              minWidth={0}
              sx={{
                display: { xs: "none", lg: "flex" },
                height: { lg: "100%" },
                minHeight: 0,
                pr: { lg: 0.25 },
                ...railSx,
              }}
            >
              <Box sx={{ ...panelSx, p: 1.2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={900}>
                  Members
                </Typography>
                <Stack spacing={0.75} mt={1}>
                  {activeMembers.length === 0 && (
                    <Typography variant="body2" color="text.secondary" py={1}>
                      Select a community to see active members.
                    </Typography>
                  )}

                  {activeMembers.slice(0, 5).map((member) => (
                    <Box
                      key={member?._id || member?.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: "8px",
                        bgcolor: "rgba(255,255,255,0.035)",
                      }}
                    >
                      <Avatar src={member?.avatar} alt={member?.name} sx={{ width: 34, height: 34 }} />
                      <Box minWidth={0} flex={1}>
                        <Typography variant="body2" fontWeight={900} noWrap>
                          {member?.name || "Community member"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {member?.specialisationTitle || "Builder"}
                        </Typography>
                      </Box>
                      {user?._id === member?._id && <Chip size="small" label="You" />}
                    </Box>
                  ))}
                </Stack>
              </Box>

              {recommendedGroups.length > 0 && (
                <Box sx={{ ...panelSx, p: 1.2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={900}>
                    Recommended Next
                  </Typography>
                  <Stack spacing={0.85} mt={1}>
                    {recommendedGroups.map((group) => (
                      <Box
                        key={group._id || group.name}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "nowrap",
                          gap: 1,
                          p: 1,
                          borderRadius: "8px",
                          bgcolor: "rgba(255,255,255,0.035)",
                        }}
                      >
                        <Avatar src={getGroupImage(group.name)} sx={{ width: 32, height: 32, flex: "0 0 auto" }} />
                        <Box minWidth={0} flex={1}>
                          <Typography variant="body2" fontWeight={850} noWrap>
                            {group.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {group.total || 0} members
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleJoinCommunity(group)}
                          sx={{ borderRadius: "8px", fontWeight: 800, minWidth: 64, flex: "0 0 auto" }}
                        >
                          {isGuest ? "Sign In" : "Join"}
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ ...panelSx, p: 1.4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={900}>
                  Community Playbook
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 1,
                  }}
                >
                  {[
                    ["Join deliberately", "Pick groups that match the stack you are building or learning now."],
                    ["Post proof", "Share shipped work, notes, demos, and technical lessons where they fit."],
                    ["Follow signal", "Use member and post activity to find useful builders faster."],
                  ].map(([title, copy]) => (
                    <Box key={title} sx={{ ...panelSx, p: 1.1 }}>
                      <Typography variant="body2" fontWeight={900}>{title}</Typography>
                      <Typography variant="caption" color="text.secondary">{copy}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>

        {isOpenMessageDrawer && <ParentNotifMessageDrawer />}
        {isOpenDrawerProfile && <ProfileDrawer />}

        {errorMessage && (
          <AlertGeneral
            title="Community action failed"
            message={errorMessage}
            isError={true}
            openAlertGeneral={errorMessage}
            setErrorMessage={setErrorMessage}
            defaultIcon={<InfoRounded />}
          />
        )}

        {infoMessage && (
          <AlertGeneral
            title="Community updated"
            message={infoMessage}
            openAlertGeneral={infoMessage}
            setOpenAlertGeneral={setInfoMessage}
            defaultIcon={<GroupsRounded />}
          />
        )}

        {messageSnack && <MetatronSnackbar open={messageSnack} message={messageSnack} />}
      </Box>
    </Suspense>
  );
}
