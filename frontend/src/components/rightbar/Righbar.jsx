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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { appColors } from "../../utils/colors";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
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

  const isDarkMode = currentMode === "dark";
  const cardRadius = `${Math.max(theme.shape.borderRadius - 2, 8)}px`;

  const handleNavigate = (route, bottomIndex) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(bottomIndex));

    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  };

  const sections = [
    {
      key: "jobs",
      label: "Jobs",
      description: "Current openings matched to platform demand.",
      icon: <WorkRounded fontSize="small" />,
      cta: "View all jobs",
      onClick: () => handleNavigate("/jobs", 1),
      content: <JobsContainer />,
    },
    {
      key: "courses",
      label: "Courses",
      description: "Learning tracks that support career progression.",
      icon: <SchoolRounded fontSize="small" />,
      cta: "Browse courses",
      onClick: () => handleNavigate("/courses/available", 3),
      content: <CoursesContainer />,
    },
    {
      key: "events",
      label: "Events",
      description: "Professional sessions, showcases and community events.",
      icon: <CalendarMonthRounded fontSize="small" />,
      cta: "See events",
      onClick: () => handleNavigate("/events", 2),
      content: <FeaturedEventsContainer />,
    },
    ...(!isGuest
      ? [
        {
          key: "network",
          label: "Network",
          description: "People and collaboration opportunities around you.",
          icon: <Diversity3Rounded fontSize="small" />,
          cta: "Grow your network",
          onClick: () => setActiveSection(3),
          content: <RequestContainer />,
        },
      ]
      : []),
  ];

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
        width: { sm: "100%", md: 300, lg: 330, xl: 350 },
        flexShrink: 0,
        mt: { sm: 1.5, md: 2 },
        display: {
          xs: "none",
          sm: CustomDeviceIsSmall() ? "none" : position === 0 ? "block" : "none",
          md: position === 0 ? "block" : "none",
        },
      }}
    >
      <Box
        className="shadow"
        sx={{
          position: { sm: "static", md: "sticky" },
          top: { md: 88 },
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : appColors.border,
            boxShadow: isDarkMode
              ? "0 18px 45px rgba(0,0,0,0.18)"
              : "0 20px 40px rgba(15,76,129,0.08)",
            overflow: "visible",
            borderRadius: `${theme.shape.borderRadius + 6}px ${theme.shape.borderRadius + 6}px 0 0`,
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(25px)",
            maxHeight: { sm: "60vh", md: "none" },
            overflowY: { sm: "auto", md: "visible" },
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
              background: "linear-gradient(180deg, rgba(20,210,190,0.15), transparent)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
              <InsightsRounded sx={{ color: "#14D2BE", fontSize: 18 }} />
              <Typography variant="body2" fontWeight={700} color="#F0F4FA">
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
                        ? "linear-gradient(135deg,#0FA88F,#14D2BE)"
                        : "rgba(255,255,255,0.03)",

                    border: "1px solid rgba(255,255,255,0.08)",
                    color: activeSection === index ? "#fff" : "rgba(255,255,255,0.7)",

                    transition: "all 0.25s ease",

                    "&:hover": {
                      background: "rgba(20,210,190,0.08)",
                      borderColor: "rgba(20,210,190,0.4)",
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
                  color: "#F0F4FA",
                  fontWeight: 600,
                }}>
                {currentSection.label}
              </Typography>
              <Typography variant="caption" sx={{
                color: "rgba(240,244,250,0.65)",
              }}>
                {currentSection.description}
              </Typography>
              <Box mt={1.2}>
                <Button
                  onClick={currentSection.onClick}
                  size="small"
                  startIcon={<InsightsRounded sx={{ color: "#14D2BE", fontSize: 18 }} />}
                  sx={{
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    color: "#fff",
                    px: 2,

                    "&:hover": {
                      background: "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
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
                <ChecklistRtlRounded sx={{ color: "#14D2BE", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={700} color="#F0F4FA">
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
                    <Box sx={{ color: "#14D2BE", display: "flex", mt: 0.2 }}>
                      {tool.icon}
                    </Box>
                    <Box minWidth={0}>
                      <Typography variant="caption" fontWeight={700} color="#F0F4FA">
                        {tool.label}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: "rgba(240,244,250,0.65)" }}>
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
                background: "linear-gradient(135deg, rgba(15,168,143,0.18), rgba(20,210,190,0.08))",
                border: "1px solid rgba(20,210,190,0.22)",
                p: 1.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <RocketLaunchRounded sx={{ color: "#14D2BE", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={700} color="#F0F4FA">
                  Next best actions
                </Typography>
              </Box>
              <Stack spacing={0.8}>
                {actionQueue.map((action) => (
                  <Typography key={action} variant="caption" sx={{ color: "rgba(240,244,250,0.72)" }}>
                    {action}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {CustomDeviceIsSmall() && currentSection.key === "jobs" && (
              <Box display={"flex"} justifyContent={"center"} width={"auto"} mt={1}>
                <Button
                  startIcon={<InsightsRounded sx={{ color: "#14D2BE", fontSize: 18 }} />}
                  onClick={() => handleNavigate("/jobs", 1)}
                  size="small"
                  sx={{ textTransform: "capitalize", borderRadius: cardRadius }}
                >
                  more jobs
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RightbarAll;
