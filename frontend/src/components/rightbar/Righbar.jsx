import {
  AutoAwesomeRounded,
  CalendarMonthRounded,
  ChecklistRtlRounded,
  Diversity3Rounded,
  InsightsRounded,
  RocketLaunchRounded,
  SchoolRounded,
  VerifiedUserRounded,
  WorkRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentCoursesTop } from "../../redux/CurrentCoursesTop";
import { updateCurrentEventsTop } from "../../redux/CurrentEventsTop";
import { updateCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { appColors } from "../../utils/colors";
import CoursesContainer from "./CoursesContainer";
import FeaturedEventsContainer from "./FeaturedEventsContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";

const RightbarAll = () => {
  const [activeSection, setActiveSection] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { currentMode, isSidebarRighbar } = useSelector((state) => state.appUI);
  const { isGuest, user } = useSelector((state) => state.currentUser);
  const { position } = useSelector((state) => state.currentBottomNav);
  const { jobsTop } = useSelector((state) => state.currentJobsTop);
  const { coursesTop } = useSelector((state) => state.currentCoursesTop);
  const { eventsTop } = useSelector((state) => state.currentEventsTop);

  const isDarkMode = currentMode === "dark";
  const cardRadius = `${Math.max(theme.shape.borderRadius - 2, 8)}px`;
  const hasData = (items) => Array.isArray(items) && items.length > 0;
  const isPreviewLoading = [jobsTop, coursesTop, eventsTop].some((items) => items === null);
  const isPreviewFetchInFlight = React.useRef(false);

  React.useEffect(() => {
    if (!isGuest && !user?._id) {
      return;
    }

    if ([jobsTop, coursesTop, eventsTop].every((items) => Array.isArray(items))) {
      return;
    }

    if (isPreviewFetchInFlight.current) {
      return;
    }

    let isMounted = true;
    isPreviewFetchInFlight.current = true;
    const userId = isGuest ? "guest" : user?._id;
    const currentJobs = Array.isArray(jobsTop) ? jobsTop : [];
    const currentCourses = Array.isArray(coursesTop) ? coursesTop : [];
    const currentEvents = Array.isArray(eventsTop) ? eventsTop : [];

    Promise.allSettled([
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/top/${userId}`, { withCredentials: true }),
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/top`, { withCredentials: true }),
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/top`, { withCredentials: true }),
    ]).then(([jobsResult, coursesResult, eventsResult]) => {
      if (!isMounted) return;

      dispatch(updateCurrentJobsTop(jobsResult.status === "fulfilled" ? jobsResult.value?.data || [] : currentJobs));
      dispatch(updateCurrentCoursesTop(coursesResult.status === "fulfilled" ? coursesResult.value?.data || [] : currentCourses));
      dispatch(updateCurrentEventsTop(eventsResult.status === "fulfilled" ? eventsResult.value?.data || [] : currentEvents));
    }).finally(() => {
      isPreviewFetchInFlight.current = false;
    });

    return () => {
      isMounted = false;
    };
  }, [coursesTop, dispatch, eventsTop, isGuest, jobsTop, user?._id]);

  const handleNavigate = (route, bottomIndex) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(bottomIndex));

    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  };

  const liveSections = [
    ...(hasData(jobsTop) ? [{
      key: "jobs",
      label: "Jobs",
      description: "Current openings matched to platform demand.",
      icon: <WorkRounded fontSize="small" />,
      cta: "View all jobs",
      onClick: () => handleNavigate("/jobs", 1),
      content: <JobsContainer />,
    }] : []),
    ...(hasData(coursesTop) ? [{
      key: "courses",
      label: "Courses",
      description: "Learning tracks that support career progression.",
      icon: <SchoolRounded fontSize="small" />,
      cta: "Browse courses",
      onClick: () => handleNavigate("/courses/available", 3),
      content: <CoursesContainer />,
    }] : []),
    ...(hasData(eventsTop) ? [{
      key: "events",
      label: "Events",
      description: "Professional sessions, showcases and community events.",
      icon: <CalendarMonthRounded fontSize="small" />,
      cta: "See events",
      onClick: () => handleNavigate("/events", 2),
      content: <FeaturedEventsContainer />,
    }] : []),
    ...(!isGuest
      ? [
        {
          key: "network",
          label: "Network",
          description: "People and collaboration opportunities around you.",
          icon: <Diversity3Rounded fontSize="small" />,
          cta: "Grow your network",
          onClick: () => {},
          content: <RequestContainer />,
        },
      ]
      : []),
  ];
  const fallbackSection = {
    key: "overview",
    label: isPreviewLoading ? "Loading" : "Overview",
    description: isPreviewLoading
      ? "Checking live platform signals from the database."
      : "No live opportunity previews are available yet.",
    icon: <InsightsRounded fontSize="small" />,
    cta: isGuest ? "Sign in" : "Refresh",
    onClick: () => {
      if (isGuest) {
        navigate("/auth/login");
        return;
      }

      dispatch(updateCurrentJobsTop(null));
      dispatch(updateCurrentCoursesTop(null));
      dispatch(updateCurrentEventsTop(null));
    },
    content: (
      <Box
        sx={{
          p: 1.5,
          minHeight: 110,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: cardRadius,
          background: "linear-gradient(135deg, rgba(214,178,94,0.12), rgba(255,255,255,0.025))",
        }}
      >
        <Typography variant="body2" fontWeight={800} color="#FFFDF7">
          {isPreviewLoading ? "Loading live previews" : "Workspace ready"}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,253,247,0.68)", mt: 0.5 }}>
          {isPreviewLoading
            ? "Jobs, courses, and events will appear here when records are available."
            : "The rail stays available for toolkit and next-action guidance."}
        </Typography>
      </Box>
    ),
  };
  const sections = liveSections.length > 0 ? liveSections : [fallbackSection];

  React.useEffect(() => {
    if (activeSection >= sections.length) {
      setActiveSection(0);
    }
  }, [activeSection, sections.length]);

  const currentSection = sections[activeSection] || sections[0];
  const professionalTools = [
    {
      label: "AI matching",
      description: "Courses, jobs and events can be ranked around the user's skill profile.",
      icon: <AutoAwesomeRounded fontSize="small" />,
    },
    {
      label: "Credential wallet",
      description: "Certifications and completed learning paths become portable proof.",
      icon: <WorkspacePremiumRounded fontSize="small" />,
    },
    {
      label: "Verified activity",
      description: "Profile trust grows through projects, milestones and platform history.",
      icon: <VerifiedUserRounded fontSize="small" />,
    },
  ];

  const actionQueue = [
    user?.selectedSkills?.length ? "Review recommended courses" : "Add skills for better recommendations",
    isGuest ? "Create an account to unlock networking" : "Check new connection requests",
    "Track certificates and instructor-led progress",
  ];

  return (
    <Box
      sx={{
        width: { sm: 230, md: 280, lg: 300, xl: 316 },
        flexShrink: 0,
        mt: { sm: 1.5, md: 2 },
        display: {
          xs: "none",
          sm: "none",
          md: "none",
          lg: isSidebarRighbar && position === 0 ? "block" : "none",
        },
      }}
    >
      <Box
        className="shadow"
        sx={{
          position: { lg: "sticky" },
          top: { lg: 64 },
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <Box
          data-metatron-rail="true"
          sx={{
            border: "1px solid",
            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : appColors.border,
            boxShadow: isDarkMode
              ? "0 18px 45px rgba(0,0,0,0.18)"
              : "0 20px 40px rgba(139,111,42,0.08)",
            overflow: "visible",
            borderRadius: `${theme.shape.borderRadius + 6}px ${theme.shape.borderRadius + 6}px 0 0`,
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(25px)",
            maxHeight: "calc(100vh - 76px)",
            overflowY: "auto",
            overscrollBehavior: "contain",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box
            px={2}
            py={2}
            sx={{
              background: "linear-gradient(180deg, rgba(214,178,94,0.15), transparent)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
              <InsightsRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
              <Typography variant="body2" fontWeight={700} color="#FFFDF7">
                Career dashboard
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Discover the next move in your tech journey
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.75}>
              Curated opportunities across hiring, learning, events, and networking, organized for faster, clearer decisions.
            </Typography>
          </Box>

          <Box px={1.5} py={1.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {sections.map((section, index) => (
                <Button
                  key={section.key}
                  onClick={() => setActiveSection(index)}
                  startIcon={section.icon}
                  variant={activeSection === index ? "contained" : "text"}
                  sx={{
                    borderRadius: cardRadius,
                    px: 1.5,
                    py: 0.9,
                    background:
                      activeSection === index
                        ? "linear-gradient(135deg,#8B6F2A,#D6B25E)"
                        : "rgba(255,255,255,0.03)",

                    border: "1px solid rgba(255,255,255,0.08)",
                    color: activeSection === index ? "#fff" : "rgba(255,255,255,0.7)",

                    transition: "all 0.25s ease",

                    "&:hover": {
                      background: "rgba(214,178,94,0.08)",
                      borderColor: "rgba(214,178,94,0.4)",
                    },
                    flexShrink: 0,
                  }}
                >
                  {section.label}
                </Button>
              ))}
            </Stack>

            <Box
              mt={1.5}
              sx={{
                borderRadius: cardRadius,
                borderColor: "divider",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)", p: 1.5,
              }}
            >
              <Typography variant="body2"
                sx={{
                  color: "#FFFDF7",
                  fontWeight: 600,
                }}>
                {currentSection.label}
              </Typography>
              <Typography variant="caption" sx={{
                color: "rgba(255,253,247,0.65)",
              }}>
                {currentSection.description}
              </Typography>
              <Box mt={1.2}>
                <Button
                  onClick={currentSection.onClick}
                  size="small"
                  startIcon={<InsightsRounded sx={{ color: "#D6B25E", fontSize: 18 }} />}
                  sx={{
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
                    color: "#fff",
                    px: 2,

                    "&:hover": {
                      background: "linear-gradient(135deg,#8B6F2A,#FFF2C2)",
                    }
                  }}
                >
                  {currentSection.cta}
                </Button>
              </Box>
            </Box>

            <Box
              mt={1.5}
              sx={{
                borderRadius: cardRadius,
                height: "100%",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {currentSection.content}
            </Box>

            <Box
              mt={1.5}
              sx={{
                borderRadius: cardRadius,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                p: 1.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1.25}>
                <ChecklistRtlRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={700} color="#FFFDF7">
                  Professional toolkit
                </Typography>
              </Box>
              <Stack spacing={1}>
                {professionalTools.map((tool) => (
                  <Box
                    key={tool.label}
                    display="flex"
                    gap={1}
                    sx={{
                      borderRadius: cardRadius,
                      px: 1,
                      py: 1,
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Box sx={{ color: "#D6B25E", display: "flex", mt: 0.2 }}>
                      {tool.icon}
                    </Box>
                    <Box minWidth={0}>
                      <Typography variant="caption" fontWeight={700} color="#FFFDF7">
                        {tool.label}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: "rgba(255,253,247,0.65)" }}>
                        {tool.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              mt={1.5}
              sx={{
                borderRadius: cardRadius,
                background: "linear-gradient(135deg, rgba(214,178,94,0.18), rgba(214,178,94,0.08))",
                border: "1px solid rgba(214,178,94,0.22)",
                p: 1.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <RocketLaunchRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={700} color="#FFFDF7">
                  Next best actions
                </Typography>
              </Box>
              <Stack spacing={0.8}>
                {actionQueue.map((action) => (
                  <Typography key={action} variant="caption" sx={{ color: "rgba(255,253,247,0.72)" }}>
                    {action}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RightbarAll;
