import {
  AddCircleRounded,
  ArticleRounded,
  AutoGraphRounded,
  BoltRounded,
  CalendarMonthRounded,
  ErrorOutlineRounded,
  HubRounded,
  InsightsRounded,
  PublicRounded,
  QueryStatsRounded,
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

const FEED_PAGE_SIZE = 12;

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(2);

  const { posts } = useSelector((state) => state.currentPosts);
  const { currentMode, isDefaultSpeedDial, isPostDetailed } = useSelector(
    (state) => state.appUI
  );
  const { user, isGuest } = useSelector((state) => state.currentUser);

  const [postDetailedData, setPostDetailedData] = useState();
  const [platformTotals, setPlatformTotals] = useState({
    developers: null,
    techGigs: null,
    jobs: null,
    events: null,
    courses: null,
    posts: null,
  });
  const [platformAnalytics, setPlatformAnalytics] = useState({
    analytics: {},
    leaders: {},
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = currentMode === "dark";
  const firstName = user?.name?.split(" ")?.[0] || "Builder";
  const metricValue = (value) => value === null || value === undefined ? "..." : formatMetric(value);
  const rawMetric = (value) => Number(value) || 0;
  const analytics = platformAnalytics.analytics || {};
  const leaders = platformAnalytics.leaders || {};
  const opportunityCount = analytics.opportunities ?? (
    rawMetric(platformTotals.techGigs) +
    rawMetric(platformTotals.events) +
    rawMetric(platformTotals.courses)
  );
  const topSkill = leaders.jobSkill?.label || leaders.userSkill?.label || "AI";
  const topBuildCategory = leaders.postCategory?.label || "Project builds";
  const topLearningCategory = leaders.courseCategory?.label || "Software Engineering";
  const topEventCategory = leaders.eventCategory?.label || "Tech meetups";
  const dashboardStats = [
    { label: "Active gigs", value: metricValue(platformTotals.techGigs), status: "Jobs", icon: <WorkRounded fontSize="small" /> },
    { label: "Events", value: metricValue(platformTotals.events), status: "Events", icon: <CalendarMonthRounded fontSize="small" /> },
    { label: "Courses", value: metricValue(platformTotals.courses), status: "Courses", icon: <SchoolRounded fontSize="small" /> },
    { label: "Build posts", value: metricValue(platformTotals.posts), status: "Posts", icon: <ArticleRounded fontSize="small" /> },
  ];
  const analyticsCards = [
    {
      label: "Opportunity Index",
      value: metricValue(opportunityCount),
      helper: `${metricValue(platformTotals.techGigs)} active jobs, ${metricValue(analytics.upcomingEvents ?? platformTotals.events)} upcoming events, ${metricValue(platformTotals.courses)} courses`,
      icon: <AutoGraphRounded fontSize="small" />,
    },
    {
      label: "Remote Access",
      value: `${analytics.remoteJobShare ?? 0}%`,
      helper: `${metricValue(analytics.remoteJobs)} active remote roles available`,
      icon: <PublicRounded fontSize="small" />,
    },
    {
      label: "External Reach",
      value: metricValue(rawMetric(analytics.externalJobs) + rawMetric(analytics.externalEvents) + rawMetric(analytics.externalCourses)),
      helper: "Global links from jobs, events, and courses",
      icon: <HubRounded fontSize="small" />,
    },
    {
      label: "Community Pulse",
      value: metricValue(analytics.totalEngagement),
      helper: `${metricValue(analytics.eventRsvps)} RSVPs and ${metricValue(analytics.courseStudents)} learners tracked`,
      icon: <BoltRounded fontSize="small" />,
    },
  ];
  const intelligenceCards = [
    {
      label: "Most Requested Skill",
      value: topSkill,
      helper: leaders.jobSkill?.count
        ? `${metricValue(leaders.jobSkill.count)} role signals mention it`
        : "Demand signal updates as jobs arrive",
      icon: <QueryStatsRounded fontSize="small" />,
    },
    {
      label: "Build Trend",
      value: topBuildCategory,
      helper: leaders.postCategory?.count
        ? `${metricValue(leaders.postCategory.count)} posts in this lane`
        : "Projects and milestone posts shape this lane",
      icon: <ArticleRounded fontSize="small" />,
    },
    {
      label: "Learning Demand",
      value: topLearningCategory,
      helper: `${analytics.externalCourseShare ?? 0}% of courses link to global providers`,
      icon: <SchoolRounded fontSize="small" />,
    },
    {
      label: "Live Network",
      value: topEventCategory,
      helper: `${metricValue(analytics.upcomingEvents)} upcoming sessions visible now`,
      icon: <CalendarMonthRounded fontSize="small" />,
    },
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
          setPlatformAnalytics({
            analytics: res.data.analytics || {},
            leaders: res.data.leaders || {},
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlatformTotals({
            developers: 0,
            techGigs: 0,
            jobs: 0,
            events: 0,
            courses: 0,
            posts: 0,
          });
          setPlatformAnalytics({
            analytics: {},
            leaders: {},
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
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all?page=1&limit=${FEED_PAGE_SIZE}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
          setPageNumber(2);
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
        minHeight: postDetailedData ? "100%" : "calc(100vh - 120px)",
        px: postDetailedData ? 0 : { xs: 1, sm: 1.25, lg: 0 },
        width: "100%",
        maxWidth: postDetailedData || isPostDetailed
          ? { xs: "100%", lg: 1160, xl: 1240 }
          : { xs: "100%", lg: 540, xl: 580 },
        mx: "auto",
        pb: postDetailedData ? 0 : { xs: 1, lg: 2 },
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
            isFullPageFocused
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

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  gap: 1,
                  mt: 1.25,
                }}
              >
                {analyticsCards.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(214,178,94,0.18)",
                      background: isDarkMode
                        ? "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(255,255,255,0.045))"
                        : "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(214,178,94,0.08))",
                      p: 1.15,
                      minHeight: 96,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Stack direction="row" alignItems="center" gap={0.75} minWidth={0}>
                        <Box sx={{ color: "primary.main", display: "flex" }}>{item.icon}</Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={900} noWrap>
                          {item.label}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="primary.main" fontWeight={900} noWrap>
                        {item.value}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1} lineHeight={1.45}>
                      {item.helper}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  mt: 1.25,
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: isDarkMode ? "rgba(5,8,18,0.34)" : "rgba(255,255,255,0.74)",
                  p: 1.15,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} mb={1}>
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <InsightsRounded sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={900}>
                      Signal Radar
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    {isGuest ? "Preview" : "Live"}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
                    gap: 1,
                  }}
                >
                  {intelligenceCards.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(247,243,234,0.72)",
                        p: 1,
                        minHeight: 92,
                        minWidth: 0,
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={0.75} mb={0.7}>
                        <Box sx={{ color: "primary.main", display: "flex", flexShrink: 0 }}>{item.icon}</Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={850} noWrap>
                          {item.label}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={900} noWrap>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.4} lineHeight={1.4}>
                        {item.helper}
                      </Typography>
                    </Box>
                  ))}
                </Box>
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
                  key={post?._id || index}
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
