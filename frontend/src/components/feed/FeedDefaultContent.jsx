import {
  AddCircleRounded,
  ArticleRounded,
  CalendarMonthRounded,
  ErrorOutlineRounded,
  InsightsRounded,
  RocketLaunchRounded,
  SchoolRounded,
  TrendingUpRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleLoadingPostLaunch,
  handleShowingSpeedDial,
  resetAll,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import {
  resetClearCurrentPosts,
  updateCurrentPosts,
} from "../../redux/CurrentPosts";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { formatMetric } from "../../utils/formatMetric";

import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { posts } = useSelector((state) => state.currentPosts);
  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );
  const { user, isGuest } = useSelector((state) => state.currentUser);

  const [postDetailedData, setPostDetailedData] = useState();
  const [platformTotals, setPlatformTotals] = useState({
    techGigs: null,
    events: null,
    courses: null,
    posts: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = currentMode === "dark";
  const firstName = user?.name?.split(" ")?.[0] || "Builder";
  const metricValue = (value) => value === null || value === undefined ? "..." : formatMetric(value);
  const dashboardStats = [
    { label: "Active gigs", value: metricValue(platformTotals.techGigs), status: "Jobs", icon: <WorkRounded fontSize="small" /> },
    { label: "Events", value: metricValue(platformTotals.events), status: "Events", icon: <CalendarMonthRounded fontSize="small" /> },
    { label: "Courses", value: metricValue(platformTotals.courses), status: "Courses", icon: <SchoolRounded fontSize="small" /> },
    { label: "Build posts", value: metricValue(platformTotals.posts), status: "Posts", icon: <ArticleRounded fontSize="small" /> },
  ];
  const focusCards = [
    {
      title: "Career Signal",
      copy: "Keep projects, skills, and activity aligned with verified hiring demand.",
      action: "Open Jobs",
      route: "/jobs",
      nav: 1,
      metricKey: "techGigs",
      icon: <TrendingUpRounded fontSize="small" />,
    },
    {
      title: "Learning Path",
      copy: "Stack courses around the roles, frameworks, and systems you want next.",
      action: "View Courses",
      route: "/courses/available",
      nav: 3,
      metricKey: "courses",
      icon: <SchoolRounded fontSize="small" />,
    },
    {
      title: "Tech Rooms",
      copy: "Find meetups, workshops, and launch sessions across the developer network.",
      action: "See Events",
      route: "/events",
      nav: 2,
      metricKey: "events",
      icon: <CalendarMonthRounded fontSize="small" />,
    },
  ].filter((card) => platformTotals[card.metricKey] === null || Number(platformTotals[card.metricKey]) > 0);

  const handleDashboardRoute = (route, navPosition) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(navPosition));
  };
  const feedStatusChips = [
    isGuest ? "Guest preview" : "Member workspace",
    `${metricValue(platformTotals.posts)} build posts`,
    "Live career signal",
  ];

  // ensure speed dial is visible
  if (!isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(true));
  }

  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetClearCurrentPosts());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/insights/all`, {
        withCredentials: true,
      })
      .then((res) => {
        if (isMounted && res?.data?.totals) {
          setPlatformTotals(res.data.totals);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlatformTotals({
            techGigs: 0,
            events: 0,
            courses: 0,
            posts: 0,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // FETCH POSTS
  useEffect(() => {
    if (posts?.length > 0) return;

    setIsFetching(true);
    dispatch(handleLoadingPostLaunch(true));

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
          setPageNumber((prev) => prev + 1);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.login) {
          window.location.reload();
        }

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server unreachable. Try again later.");
          return;
        }

        setErrorMessage(err?.response?.data);
      })
      .finally(() => {
        setIsFetching(false);
        dispatch(resetAll());
      });
  }, [dispatch, posts]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        px: { xs: 1, sm: 1.25, lg: 0 },
        width: "100%",
        maxWidth: { xs: "100%", lg: 540, xl: 580 },
        mx: "auto",
        pb: { xs: 1, lg: 2 },
      }}
    >
      {/* 🔥 POST DETAIL VIEW */}
      {postDetailedData ? (
        <Box
          sx={{
            mt: { xs: 1, sm: 1.5 },
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              mt: { xs: 1.5, md: 2 },
              p: { xs: 1.5, sm: 2 },
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(5,5,5,0.96), rgba(18,18,18,0.92) 52%, rgba(214,178,94,0.13))"
                : "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(238,247,255,0.86))",
              boxShadow: isDarkMode
                ? "0 20px 60px rgba(0,0,0,0.28)"
                : "0 16px 36px rgba(139,111,42,0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(90deg, rgba(214,178,94,0.04) 1px, transparent 1px), linear-gradient(rgba(214,178,94,0.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                gap={2}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box minWidth={0}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <RocketLaunchRounded sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography variant="overline" color="primary.main">
                      Metatron Dev Console
                    </Typography>
                  </Stack>
                    <Typography variant="h5" fontWeight={900} lineHeight={1.12}>
                    Build, learn, connect, and move faster, {firstName}.
                  </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.75} maxWidth={500}>
                    A focused technology feed for project drops, hiring signals, courses, events, and practical community momentum.
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mt={1.5}>
                    {feedStatusChips.map((chip) => (
                      <Chip
                        key={chip}
                        size="small"
                        label={chip}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 800,
                          color: "primary.main",
                          border: "1px solid rgba(214,178,94,0.22)",
                          background: "rgba(214,178,94,0.08)",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Button
                  disableElevation
                  variant="contained"
                  onClick={() => handleDashboardRoute("/jobs", 1)}
                  startIcon={<WorkRounded fontSize="small" />}
                  sx={{ flexShrink: 0, minWidth: { xs: "100%", sm: 150, md: 140 } }}
                >
                  Find Gigs
                </Button>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                  gap: 1,
                  mt: 2,
                }}
              >
                {dashboardStats.map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: isDarkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.92)",
                      p: 1,
                      minHeight: 76,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box sx={{ color: "primary.main", display: "flex" }}>{stat.icon}</Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        {stat.status}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={900} mt={0.75}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {focusCards.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                gap: 1,
                mt: 1.25,
              }}
            >
              {focusCards.map((card) => (
              <Box
                key={card.title}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: isDarkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.9)",
                  p: 1.15,
                  minHeight: 124,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ color: "primary.main", display: "flex", mb: 1 }}>{card.icon}</Box>
                <Typography variant="body2" fontWeight={800}>
                  {card.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, flex: 1 }}>
                  {card.copy}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleDashboardRoute(card.route, card.nav)}
                  sx={{ justifyContent: "flex-start", px: 0, mt: 1, color: "primary.main" }}
                >
                  {card.action}
                </Button>
              </Box>
              ))}
            </Box>
          )}

          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2.5} mb={-0.5}>
            <Box>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <InsightsRounded sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography variant="body1" fontWeight={900}>
                  Developer Signal Feed
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Projects, insights, launches, and practical community updates.
              </Typography>
            </Box>
          </Stack>

          {/* 🔥 LOADER */}
          {isFetching && (
            <Stack alignItems="center" mt={6} spacing={1}>
              <RotatingLines width={32} strokeColor="#D6B25E" />
              <Typography variant="caption" color="text.secondary">
                Loading your feed...
              </Typography>
            </Stack>
          )}

          {/* 🔥 ERROR */}
          {errorMessage && (
            <Box
              mt={3}
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(214,178,94,0.22)",
                background: "rgba(214,178,94,0.08)",
                px: 1.5,
                py: 1.25,
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <ErrorOutlineRounded sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography color="text.primary" variant="body2" fontWeight={800}>
                  {typeof errorMessage === "string" ? errorMessage : "Unable to load this feed request."}
                </Typography>
              </Stack>
            </Box>
          )}



          {/* 🔥 FEED */}
          {!isFetching && posts?.length > 0 && (
            <Stack spacing={2} mt={2}>
              {/* MOBILE OVERVIEW */}
              {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                <Box
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    p: 1,
                  }}
                >
                  <MobileTabCorousel />
                </Box>
              )}

              {/* POSTS */}
              {posts.map((post, index) => (
                <CardFeed
                  key={index}
                  post={post}
                  posts={posts}
                  isLastIndex={index === posts.length - 1}
                  setPostDetailedData={setPostDetailedData}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              ))}
            </Stack>
          )}

          {!isFetching && (!posts || posts?.length < 1) && (
            <Box
              sx={{
                mt: 2,
                minHeight: 280,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(13,13,13,0.94), rgba(214,178,94,0.08))"
                  : "rgba(255,255,255,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Stack alignItems="center" spacing={1.2} maxWidth={360}>
                <AddCircleRounded sx={{ color: "primary.main", fontSize: 34 }} />
                <Typography variant="body1" fontWeight={900}>
                  No build posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When developers publish milestones, projects, and technical insights, they will appear here.
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default FeedDefaultContent;
