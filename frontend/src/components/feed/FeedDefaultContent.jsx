import {
  AddCircleRounded,
  ArrowForwardRounded,
  ArticleRounded,
  AutoGraphRounded,
  BoltRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  ChecklistRounded,
  ConnectWithoutContactRounded,
  DataObjectRounded,
  ErrorOutlineRounded,
  FilterListRounded,
  HubRounded,
  InsightsRounded,
  PersonSearchRounded,
  PlayCircleRounded,
  PublicRounded,
  QueryStatsRounded,
  RocketLaunchRounded,
  SchoolRounded,
  TrendingUpRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import { lazy, useEffect, useMemo, useState } from "react";
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

const PostTechModal = lazy(() => import("../modal/PostTechModal"));
const FEED_PAGE_SIZE = 12;
const goldGradient = "linear-gradient(135deg, #8B6F2A 0%, #D6B25E 54%, #FFF2C2 100%)";

const MiniSparkline = ({ values = [32, 58, 42, 74, 52, 86], size = "small" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-end",
      gap: size === "small" ? 0.35 : 0.5,
      height: size === "small" ? 20 : 34,
      minWidth: size === "small" ? 44 : 70,
    }}
  >
    {values.map((value, index) => (
      <Box
        key={`${value}-${index}`}
        sx={{
          width: size === "small" ? 4 : 6,
          height: `${value}%`,
          minHeight: 5,
          borderRadius: 999,
          background:
            index === values.length - 1
              ? goldGradient
              : "linear-gradient(180deg, rgba(214,178,94,0.9), rgba(214,178,94,0.18))",
          boxShadow: index === values.length - 1 ? "0 0 14px rgba(214,178,94,0.34)" : "none",
        }}
      />
    ))}
  </Box>
);

const MetricGraph = ({ label, value, helper, bars = [44, 72, 56, 88, 68, 94] }) => (
  <Box
    sx={{
      borderRadius: "8px",
      border: "1px solid rgba(214,178,94,0.18)",
      background: "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(255,255,255,0.045))",
      p: 1,
      minWidth: 0,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
      <Box minWidth={0}>
        <Typography variant="caption" color="text.secondary" fontWeight={900}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={950} lineHeight={1.05} noWrap>
          {value}
        </Typography>
      </Box>
      <MiniSparkline values={bars} />
    </Stack>
    <Typography variant="caption" color="text.secondary" display="block" mt={0.7} lineHeight={1.35}>
      {helper}
    </Typography>
  </Box>
);

const HeroVisual = ({ topSkill, topLearningCategory, opportunityCount, metricValue }) => (
  <Box
    sx={{
      position: "relative",
      minHeight: { xs: 230, md: 270 },
      borderRadius: "8px",
      border: "1px solid rgba(214,178,94,0.18)",
      background:
        "radial-gradient(circle at 35% 15%, rgba(214,178,94,0.24), transparent 32%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(5,5,5,0.38))",
      overflow: "hidden",
      p: { xs: 1.3, sm: 1.6 },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(90deg, rgba(214,178,94,0.06) 1px, transparent 1px), linear-gradient(rgba(214,178,94,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.8,
      }}
    />
    {["Build", "Learn", "Connect", "Grow"].map((label, index) => (
      <Box
        key={label}
        sx={{
          position: "absolute",
          top: [18, 48, 106, 152][index],
          right: [24, 130, 14, 104][index],
          px: 1,
          py: 0.55,
          borderRadius: "8px",
          border: "1px solid rgba(214,178,94,0.26)",
          background: index % 2 === 0 ? goldGradient : "rgba(255,255,255,0.08)",
          color: index % 2 === 0 ? "#080808" : "#FFFDF7",
          fontWeight: 900,
          fontSize: 11,
          boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
          transform: `rotate(${[-8, 8, -7, 7][index]}deg)`,
          zIndex: 2,
          display: { xs: index === 2 ? "none" : "block", sm: "block" },
        }}
      >
        {label}
      </Box>
    ))}
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        width: { xs: "78%", sm: "70%" },
        minHeight: 178,
        mt: { xs: 3.5, sm: 4.5 },
        ml: { xs: 0.5, sm: 1.2 },
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.13)",
        background: "linear-gradient(145deg, rgba(10,14,22,0.96), rgba(4,4,4,0.82))",
        boxShadow: "0 30px 70px rgba(0,0,0,0.42), 0 0 34px rgba(214,178,94,0.12)",
        p: 1.4,
        transform: "perspective(900px) rotateY(-10deg) rotateX(4deg)",
      }}
    >
      <Stack direction="row" spacing={0.5} mb={1.2}>
        {[0, 1, 2].map((dot) => (
          <Box key={dot} sx={{ width: 7, height: 7, borderRadius: "50%", background: dot === 0 ? "#D6B25E" : "rgba(255,255,255,0.22)" }} />
        ))}
      </Stack>
      {[
        "const future = {",
        "  build: true,",
        `  skill: '${topSkill}',`,
        `  learn: '${topLearningCategory}',`,
        `  opportunities: ${metricValue(opportunityCount)}`,
        "};",
      ].map((line, index) => (
        <Typography
          key={line}
          variant="caption"
          sx={{
            display: "block",
            fontFamily: "monospace",
            color: index === 0 || index === 5 ? "rgba(255,253,247,0.58)" : index === 4 ? "#F8E7B0" : "rgba(255,253,247,0.82)",
            lineHeight: 1.7,
            whiteSpace: "nowrap",
          }}
        >
          {line}
        </Typography>
      ))}
      <Box mt={1.1}>
        <MiniSparkline values={[34, 52, 46, 70, 62, 90, 76, 96]} size="large" />
      </Box>
    </Box>
    <Typography
      variant="caption"
      sx={{
        position: "absolute",
        left: 18,
        bottom: 14,
        zIndex: 1,
        color: "rgba(255,253,247,0.58)",
        fontWeight: 900,
      }}
    >
      Build. Learn. Connect. Grow.
    </Typography>
  </Box>
);

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(2);
  const [activeFeedFilter, setActiveFeedFilter] = useState("all");
  const [openPostModal, setOpenPostModal] = useState(false);

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
  const userSkills = Array.isArray(user?.selectedSkills) ? user.selectedSkills : [];
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
    { label: "Active jobs", value: metricValue(platformTotals.techGigs), status: "+12%", spark: [36, 58, 44, 72, 62, 86], icon: <WorkRounded fontSize="small" /> },
    { label: "Courses", value: metricValue(platformTotals.courses), status: "+8%", spark: [30, 48, 62, 54, 78, 82], icon: <SchoolRounded fontSize="small" /> },
    { label: "Upcoming events", value: metricValue(platformTotals.events), status: "+25%", spark: [22, 42, 38, 68, 58, 92], icon: <CalendarMonthRounded fontSize="small" /> },
    { label: "Build posts", value: metricValue(platformTotals.posts), status: "+18%", spark: [28, 36, 52, 48, 70, 94], icon: <ArticleRounded fontSize="small" /> },
  ];
  const profileSignals = [
    {
      label: "Specialisation",
      ready: Boolean(user?.specialisationTitle),
      value: user?.specialisationTitle || "Not set",
    },
    {
      label: "Skills",
      ready: userSkills.length > 0,
      value: userSkills.length ? `${userSkills.length} selected` : "Add core stack",
    },
    {
      label: "Repository",
      ready: Boolean(user?.gitHub),
      value: user?.gitHub ? "Linked" : "Missing",
    },
    {
      label: "Portfolio",
      ready: Boolean(user?.portfolio || user?.linkedin),
      value: user?.portfolio || user?.linkedin ? "Visible" : "Missing",
    },
  ];
  const completedProfileSignals = profileSignals.filter((signal) => signal.ready).length;
  const analyticsCards = [
    {
      label: "Opportunity Index",
      value: metricValue(opportunityCount),
      helper: `${metricValue(platformTotals.techGigs)} active jobs, ${metricValue(analytics.upcomingEvents ?? platformTotals.events)} upcoming events, ${metricValue(platformTotals.courses)} courses`,
      icon: <AutoGraphRounded fontSize="small" />,
      bars: [36, 56, 42, 76, 64, 92],
    },
    {
      label: "Remote Access",
      value: `${analytics.remoteJobShare ?? 0}%`,
      helper: `${metricValue(analytics.remoteJobs)} active remote roles available`,
      icon: <PublicRounded fontSize="small" />,
      bars: [24, 42, 52, 66, 58, 74],
    },
    {
      label: "External Reach",
      value: metricValue(rawMetric(analytics.externalJobs) + rawMetric(analytics.externalEvents) + rawMetric(analytics.externalCourses)),
      helper: "Global links from jobs, events, and courses",
      icon: <HubRounded fontSize="small" />,
      bars: [30, 48, 44, 68, 78, 88],
    },
    {
      label: "Community Pulse",
      value: metricValue(analytics.totalEngagement),
      helper: `${metricValue(analytics.eventRsvps)} RSVPs and ${metricValue(analytics.courseStudents)} learners tracked`,
      icon: <BoltRounded fontSize="small" />,
      bars: [34, 38, 58, 62, 84, 96],
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
      title: "Find a Job",
      copy: "Opportunities from top companies, startup teams, and technical operators.",
      action: "Explore Jobs",
      route: "/jobs",
      nav: 1,
      metricKey: "techGigs",
      icon: <TrendingUpRounded fontSize="small" />,
    },
    {
      title: "Learn Skills",
      copy: "Courses from industry experts, mapped to the stacks builders actually use.",
      action: "Browse Courses",
      route: "/courses/available",
      nav: 3,
      metricKey: "courses",
      icon: <SchoolRounded fontSize="small" />,
    },
    {
      title: "Join Events",
      copy: "Workshops, meetups, webinars, and rooms where real opportunities start.",
      action: "View Events",
      route: "/events",
      nav: 2,
      metricKey: "events",
      icon: <CalendarMonthRounded fontSize="small" />,
    },
  ].filter((card) => platformTotals[card.metricKey] === null || Number(platformTotals[card.metricKey]) > 0);
  const quickActions = [
    {
      title: "Share Build",
      copy: "Publish a milestone, architecture note, launch update, or proof-of-work drop.",
      action: "Create Post",
      icon: <DataObjectRounded fontSize="small" />,
      onClick: () => isGuest ? navigate("/auth/login") : setOpenPostModal(true),
    },
    {
      title: "Track Demand",
      copy: "Compare active roles against your stack and spot the next useful move.",
      action: "Open Jobs",
      icon: <PersonSearchRounded fontSize="small" />,
      onClick: () => handleDashboardRoute("/jobs", 1),
    },
    {
      title: "Sharpen Stack",
      copy: "Move from signal to courses, certificates, and deeper technical practice.",
      action: "View Courses",
      icon: <ChecklistRounded fontSize="small" />,
      onClick: () => handleDashboardRoute("/courses/available", 3),
    },
    {
      title: "Connect",
      copy: "Find people, communities, sessions, and collaborators around real work.",
      action: "See Events",
      icon: <ConnectWithoutContactRounded fontSize="small" />,
      onClick: () => handleDashboardRoute("/events", 2),
    },
  ];

  const handleDashboardRoute = (route, navPosition) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(navPosition));
  };
  const feedStatusChips = [
    isGuest ? "Guest preview" : "Member workspace",
    `${metricValue(platformTotals.posts)} build posts`,
    "Live career signal",
  ];
  const feedFilterOptions = useMemo(() => {
    const categoryCounts = new Map();
    const hasDocuments = posts?.some((post) => post?.post_documents?.length > 0);

    posts?.forEach((post) => {
      const category = post?.post_category?.main;
      if (!category) return;
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });

    const categoryOptions = [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, count]) => ({
        key: `category:${category}`,
        label: category,
        count,
      }));

    return [
      { key: "all", label: "All", count: posts?.length || 0 },
      ...(hasDocuments
        ? [{ key: "documents", label: "Documents", count: posts.filter((post) => post?.post_documents?.length > 0).length }]
        : []),
      ...categoryOptions,
    ];
  }, [posts]);
  const visiblePosts = useMemo(() => {
    if (activeFeedFilter === "all") return posts || [];
    if (activeFeedFilter === "documents") {
      return (posts || []).filter((post) => post?.post_documents?.length > 0);
    }
    if (activeFeedFilter.startsWith("category:")) {
      const category = activeFeedFilter.replace("category:", "");
      return (posts || []).filter((post) => post?.post_category?.main === category);
    }
    return posts || [];
  }, [activeFeedFilter, posts]);

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
          : { xs: "100%", lg: 680, xl: 760 },
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(280px, 0.82fr)" },
                  gap: { xs: 2, md: 2.5 },
                  alignItems: "stretch",
                }}
              >
                <Box minWidth={0} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1.1}>
                    <RocketLaunchRounded sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography
                      variant="overline"
                      color="primary.main"
                      sx={{ letterSpacing: "0.18em", fontWeight: 950 }}
                    >
                      A Platform For Builders
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h3"
                    fontWeight={950}
                    lineHeight={1.02}
                    sx={{
                      maxWidth: 560,
                      fontSize: { xs: "2rem", sm: "2.45rem", md: "2.7rem" },
                    }}
                  >
                    Build Your Next Big{" "}
                    <Box
                      component="span"
                      sx={{
                        background: goldGradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Opportunity
                    </Box>
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1.2} maxWidth={540}>
                    Discover jobs, learn new skills, attend events, connect with amazing people, and showcase your work all in one place.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => handleDashboardRoute("/jobs", 1)}
                      sx={{ px: 2.4, minHeight: 42 }}
                    >
                      Explore Opportunities
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PlayCircleRounded />}
                      onClick={() => isGuest ? navigate("/auth/login") : setOpenPostModal(true)}
                      sx={{ px: 2.1, minHeight: 42 }}
                    >
                      Create Proof
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mt={2}>
                    {feedStatusChips.map((chip) => (
                      <Chip
                        key={chip}
                        size="small"
                        label={chip}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 900,
                          color: "primary.main",
                          border: "1px solid rgba(214,178,94,0.24)",
                          background: "rgba(214,178,94,0.08)",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                <HeroVisual
                  topSkill={topSkill}
                  topLearningCategory={topLearningCategory}
                  opportunityCount={opportunityCount}
                  metricValue={metricValue}
                />
              </Box>

              <Box
                sx={{
                  mt: 1.25,
                  borderRadius: "8px",
                  border: "1px solid rgba(214,178,94,0.16)",
                  background: isDarkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.76)",
                  p: 1.15,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                  <Typography variant="caption" color="text.secondary" fontWeight={900}>
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={900}>
                    {Math.round((completedProfileSignals / profileSignals.length) * 100)}%
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(139,111,42,0.12)",
                  }}
                >
                  <Box
                    sx={{
                      width: `${(completedProfileSignals / profileSignals.length) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #8B6F2A, #D6B25E, #FFF2C2)",
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  {isGuest ? "Sign in to unlock matching, saved items, applications, and builder proof." : `Welcome back, ${firstName}. Stronger profiles create better discovery and collaboration loops.`}
                </Typography>
              </Box>

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
                      background: isDarkMode
                        ? "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(214,178,94,0.055))"
                        : "rgba(255,255,255,0.92)",
                      p: 1.15,
                      minHeight: 86,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box
                        sx={{
                          color: "#080808",
                          display: "flex",
                          width: 34,
                          height: 34,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          background: goldGradient,
                          boxShadow: "0 12px 28px rgba(214,178,94,0.16)",
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <MiniSparkline values={stat.spark} />
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" gap={1} mt={0.75}>
                      <Box minWidth={0}>
                        <Typography variant="h5" fontWeight={950} lineHeight={1}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="primary.main" fontWeight={950}>
                        {stat.status}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
                  gap: 1,
                  mt: 1.25,
                }}
              >
                {quickActions.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: isDarkMode
                        ? "linear-gradient(135deg, rgba(214,178,94,0.11), rgba(255,255,255,0.04))"
                        : "rgba(255,255,255,0.84)",
                      p: 1.15,
                      minHeight: 138,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box
                        sx={{
                          color: "#080808",
                          display: "flex",
                          width: 36,
                          height: 36,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          background: goldGradient,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <ArrowForwardRounded sx={{ color: "primary.main", fontSize: 18, opacity: 0.78 }} />
                    </Stack>
                    <Typography variant="body2" fontWeight={900} mt={1}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, flex: 1, lineHeight: 1.45 }}>
                      {item.copy}
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={item.onClick}
                      sx={{ justifyContent: "flex-start", px: 0, mt: 1, color: "primary.main", fontWeight: 950 }}
                    >
                      {item.action}
                    </Button>
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
                  <MetricGraph
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    helper={item.helper}
                    bars={item.bars}
                  />
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

              {!isGuest && (
                <Box
                  sx={{
                    mt: 1.25,
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.16)",
                    background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.78)",
                    p: 1.15,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} mb={1}>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <ChecklistRounded sx={{ color: "primary.main", fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={900}>
                        Credibility Matrix
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                      Proof readiness
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
                      gap: 1,
                    }}
                  >
                    {profileSignals.map((signal) => (
                      <Box
                        key={signal.label}
                        sx={{
                          borderRadius: "8px",
                          border: signal.ready
                            ? "1px solid rgba(214,178,94,0.22)"
                            : "1px solid rgba(255,255,255,0.08)",
                          background: signal.ready
                            ? "rgba(214,178,94,0.08)"
                            : isDarkMode
                              ? "rgba(255,255,255,0.035)"
                              : "rgba(247,243,234,0.7)",
                          p: 1,
                          minWidth: 0,
                        }}
                      >
                        <Stack direction="row" alignItems="center" gap={0.6}>
                          <CheckCircleRounded
                            sx={{
                              color: signal.ready ? "primary.main" : "text.disabled",
                              fontSize: 15,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" fontWeight={900} noWrap>
                            {signal.label}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color={signal.ready ? "primary.main" : "text.secondary"} fontWeight={900} noWrap display="block" mt={0.6}>
                          {signal.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
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
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(214,178,94,0.045))"
                    : "rgba(255,255,255,0.9)",
                  p: 1.15,
                  minHeight: 124,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    color: "#080808",
                    display: "flex",
                    mb: 1,
                    width: 34,
                    height: 34,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    background: goldGradient,
                  }}
                >
                  {card.icon}
                </Box>
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
                  endIcon={<ArrowForwardRounded />}
                  sx={{ justifyContent: "flex-start", px: 0, mt: 1, color: "primary.main", fontWeight: 950 }}
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

          {feedFilterOptions.length > 1 && (
            <Box
              sx={{
                mt: 1.5,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.86)",
                p: 1,
              }}
            >
              <Stack direction="row" alignItems="center" gap={0.75} mb={1}>
                <FilterListRounded sx={{ color: "primary.main", fontSize: 17 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={900}>
                  Feed Filters
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {feedFilterOptions.map((option) => {
                  const isActive = activeFeedFilter === option.key;

                  return (
                    <Chip
                      key={option.key}
                      clickable
                      size="small"
                      label={`${option.label} ${option.count}`}
                      onClick={() => setActiveFeedFilter(option.key)}
                      sx={{
                        borderRadius: "8px",
                        maxWidth: "100%",
                        fontWeight: 850,
                        color: isActive ? "#080808" : "text.secondary",
                        background: isActive
                          ? "linear-gradient(135deg, #8B6F2A, #D6B25E, #FFF2C2)"
                          : isDarkMode
                            ? "rgba(255,255,255,0.045)"
                            : "rgba(139,111,42,0.06)",
                        border: "1px solid rgba(214,178,94,0.16)",
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

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
              {visiblePosts.map((post, index) => (
                <CardFeed
                  key={post?._id || index}
                  post={post}
                  posts={posts}
                  isLastIndex={activeFeedFilter === "all" && index === visiblePosts.length - 1}
                  setPostDetailedData={setPostDetailedData}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              ))}

              {visiblePosts.length === 0 && (
                <Box
                  sx={{
                    minHeight: 220,
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.16)",
                    background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.88)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Stack alignItems="center" spacing={1} maxWidth={360}>
                    <FilterListRounded sx={{ color: "primary.main", fontSize: 30 }} />
                    <Typography variant="body2" fontWeight={900}>
                      No posts match this signal yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Switch filters or publish a relevant build note to establish the lane.
                    </Typography>
                  </Stack>
                </Box>
              )}
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
      {openPostModal && (
        <PostTechModal
          openModalTech={openPostModal}
          setOpenModalTech={setOpenPostModal}
        />
      )}
    </Box>
  );
};

export default FeedDefaultContent;
