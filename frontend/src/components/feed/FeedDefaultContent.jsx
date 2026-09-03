import {
  ArticleRounded,
  CalendarMonthRounded,
  RocketLaunchRounded,
  SchoolRounded,
  TrendingUpRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
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
  const { user } = useSelector((state) => state.currentUser);

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
    { label: "Active gigs", value: metricValue(platformTotals.techGigs), status: "Jobs DB", icon: <WorkRounded fontSize="small" /> },
    { label: "Events", value: metricValue(platformTotals.events), status: "Events DB", icon: <CalendarMonthRounded fontSize="small" /> },
    { label: "Courses", value: metricValue(platformTotals.courses), status: "Courses DB", icon: <SchoolRounded fontSize="small" /> },
    { label: "Build posts", value: metricValue(platformTotals.posts), status: "Posts DB", icon: <ArticleRounded fontSize="small" /> },
  ];
  const focusCards = [
    {
      title: "Career Signal",
      copy: "Keep projects, skills, and activity aligned with verified hiring demand.",
      action: "Open Jobs",
      route: "/jobs",
      nav: 1,
      icon: <TrendingUpRounded fontSize="small" />,
    },
    {
      title: "Learning Path",
      copy: "Stack courses around the roles, frameworks, and systems you want next.",
      action: "View Courses",
      route: "/courses/available",
      nav: 3,
      icon: <SchoolRounded fontSize="small" />,
    },
    {
      title: "Tech Rooms",
      copy: "Find meetups, workshops, and launch sessions across the developer network.",
      action: "See Events",
      route: "/events",
      nav: 2,
      icon: <CalendarMonthRounded fontSize="small" />,
    },
  ];

  const handleDashboardRoute = (route, navPosition) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(navPosition));
  };

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
        px: { xs: 1, sm: 2 },
        width: "100%",
        maxWidth: { xs: "100%", lg: 760, xl: 860 },
        mx: "auto",
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
              p: { xs: 2, sm: 2.5 },
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(10,18,32,0.92), rgba(11,18,32,0.78) 54%, rgba(32,214,199,0.10))"
                : "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(238,247,255,0.86))",
              boxShadow: isDarkMode
                ? "0 20px 60px rgba(0,0,0,0.28)"
                : "0 16px 36px rgba(15,76,129,0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(90deg, rgba(32,214,199,0.04) 1px, transparent 1px), linear-gradient(rgba(32,214,199,0.04) 1px, transparent 1px)",
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
                      Metatron Dev Command
                    </Typography>
                  </Stack>
                  <Typography variant="h4" fontWeight={900} lineHeight={1.12}>
                    Good to see you, {firstName}.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.75} maxWidth={560}>
                    Jobs, learning, events, and developer content are organized into one growth workspace.
                  </Typography>
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
                  mt: 2.5,
                }}
              >
                {dashboardStats.map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: isDarkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.92)",
                      p: 1.25,
                      minHeight: 84,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box sx={{ color: "primary.main", display: "flex" }}>{stat.icon}</Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        {stat.status}
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={900} mt={1}>
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: 1.25,
              mt: 1.5,
            }}
          >
            {focusCards.map((card) => (
              <Box
                key={card.title}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: isDarkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.9)",
                  p: 1.5,
                  minHeight: 150,
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

          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2.5} mb={-0.5}>
            <Box>
              <Typography variant="body1" fontWeight={900}>
                Developer Signal Feed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Projects, insights, launches, and practical community updates.
              </Typography>
            </Box>
          </Stack>

          {/* 🔥 LOADER */}
          {isFetching && (
            <Stack alignItems="center" mt={6} spacing={1}>
              <RotatingLines width={32} strokeColor="#14D2BE" />
              <Typography variant="caption" color="text.secondary">
                Loading your feed...
              </Typography>
            </Stack>
          )}

          {/* 🔥 ERROR */}
          {errorMessage && (
            <Box textAlign="center" mt={4}>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </Box>
          )}



          {/* 🔥 FEED */}
          {!isFetching && posts?.length > 0 && (
            <Stack spacing={2} mt={2}>
              {/* MOBILE OVERVIEW */}
              {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                <Box
                  sx={{
                    borderRadius: "12px",
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
        </>
      )}
    </Box>
  );
};

export default FeedDefaultContent;
