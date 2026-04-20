import {
  CalendarMonthRounded,
  Diversity3Rounded,
  InsightsRounded,
  SchoolRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { appColors, appGradients } from "../../utils/colors";
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
  const { isGuest } = useSelector((state) => state.currentUser);
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

  return (
    <Box
      sx={{
        width: { md: 300, lg: 330, xl: 350 },
        flexShrink: 0,
        mt: { md: 2 },
        display: {
          xs: "none",
          sm: "none",
          md: position === 0 ? "block" : "none",
        },
      }}
    >
      <Box
        className="shadow"
        sx={{
          position: "sticky",
          top: { md: 88 },
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <Box
          bgcolor={"background.paper"}
          sx={{
            border: "1px solid",
            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : appColors.border,
            boxShadow: isDarkMode
              ? "0 18px 45px rgba(0,0,0,0.18)"
              : "0 20px 40px rgba(15,76,129,0.08)",
            overflow: "visible",
            borderRadius: `${theme.shape.borderRadius + 6}px`,
            width: "100%",
          }}
        >
          <Box
            px={2}
            py={2}
            sx={{
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(15,76,129,0.32), rgba(8,21,38,0.14))"
                : appGradients.soft,
            }}
          >
            <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
              <InsightsRounded color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={700}>
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
                    bgcolor:
                      activeSection === index
                        ? "primary.main"
                        : isDarkMode
                          ? "rgba(15,76,129,0.14)"
                          : "rgba(15,76,129,0.05)",
                    color: activeSection === index ? "primary.contrastText" : "text.primary",
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
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                p: 1.5,
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                {currentSection.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentSection.description}
              </Typography>
              <Box mt={1.2}>
                <Button
                  onClick={currentSection.onClick}
                  size="small"
                  startIcon={<InsightsRounded fontSize="small" />}
                  sx={{ borderRadius: cardRadius }}
                >
                  {currentSection.cta}
                </Button>
              </Box>
            </Box>

            <Box
              mt={1.5}
              sx={{
                borderRadius: cardRadius,
                overflow: "hidden",
              }}
            >
              {currentSection.content}
            </Box>

            {CustomDeviceIsSmall() && currentSection.key === "jobs" && (
              <Box display={"flex"} justifyContent={"center"} width={"auto"} mt={1}>
                <Button
                  startIcon={<InsightsRounded />}
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
