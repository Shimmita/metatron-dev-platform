import {
  AssignmentTurnedInRounded,
  ArticleRounded,
  AutoAwesomeRounded,
  BookmarkRounded,
  CalendarMonthRounded,
  DashboardRounded,
  FolderRounded,
  GroupsRounded,
  PeopleAltRounded,
  PsychologyRounded,
  RocketLaunchRounded,
  SchoolRounded,
  Smartphone,
  TrendingUpRounded,
  VerifiedUserRounded,
  WorkRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appColors, appGradients } from "../../utils/colors";
import AlertGeneral from "../alerts/AlertGeneral";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";
import StepperStats from "./StepperStats";


const BoxAvatarContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
});

const getRequestMessage = (err, fallback = "Unable to load insights.") => {
  if (err?.code === "ERR_NETWORK") return "Server is unreachable. Please try again later.";
  const payload = err?.response?.data || err;
  if (typeof payload === "string") return payload;
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  return fallback;
};

const Sidebar = () => {
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [dataInsights, setDataInsights] = useState([]);
  const [dataTools, setDataTools] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    currentMode,
    isSidebarRighbar,
    isTabSideBar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const { position } = useSelector((state) => state.currentBottomNav);

  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = currentMode === "dark";
  const cardRadius = `${Math.max(theme.shape.borderRadius - 2, 8)}px`;
  const selectedSkills = Array.isArray(user?.selectedSkills) ? user.selectedSkills : [];
  const selectedSkillsCount = selectedSkills.length;
  const displayedSkills = selectedSkills.slice(0, 6);
  const hiddenSkillsCount = Math.max(selectedSkillsCount - displayedSkills.length, 0);
  const userLocation = [user?.county, CustomCountryName(user?.country)].filter(Boolean).join(" / ");
  const profileSignalScore = isGuest
    ? 0
    : Math.round((
      (user?.avatar ? 1 : 0) +
      (user?.specialisationTitle ? 1 : 0) +
      (selectedSkillsCount > 0 ? 1 : 0) +
      (user?.network_count > 0 ? 1 : 0)
    ) / 4 * 100);
  const guestOverviewItems = [
    {
      label: "Tech gigs",
      value: "Preview roles",
      icon: <WorkRounded fontSize="small" />,
    },
    {
      label: "Learning paths",
      value: "Browse courses",
      icon: <SchoolRounded fontSize="small" />,
    },
    {
      label: "Live network",
      value: "Explore events",
      icon: <CalendarMonthRounded fontSize="small" />,
    },
  ];
  const profileCompletionItems = isGuest
    ? guestOverviewItems
    : [
      {
        label: "Skill graph",
        value: selectedSkillsCount > 0 ? `${selectedSkillsCount} skills` : "Add skills",
        icon: <PsychologyRounded fontSize="small" />,
      },
      {
        label: "Network proof",
        value: `${user?.network_count || 0} connections`,
        icon: <GroupsRounded fontSize="small" />,
      },
      {
        label: "Credential status",
        value: user?.isVerified ? "Verified" : "Build trust",
        icon: <VerifiedUserRounded fontSize="small" />,
      },
    ];

  const platformReadiness = isGuest
    ? [
      "Browse the dashboard, tech gigs, courses, events, and public content before signing in",
      "Create an account to apply for gigs, enroll in courses, RSVP for events, and post updates",
      "Build a developer profile recruiters, mentors, and technical communities can understand quickly",
    ]
    : [
      "Complete profile visibility for recruiters and instructors",
      "Keep skills current for stronger AI course and job matching",
      "Use certifications and milestones as proof of professional growth",
    ];

  useLayoutEffect(() => {
    if (dataInsights.length > 0) {
      return;
    }

    setIsFetching(true);

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/insights/all`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setDataInsights(Array.isArray(res.data.insights) ? res.data.insights : []);
          setDataTools(Array.isArray(res.data.tools) ? res.data.tools : []);
        }
      })
      .catch((err) => {
        setErrorMessage(getRequestMessage(err));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [dataInsights.length]);

  const primaryNavItems = [
    {
      label: "Home",
      description: "Dashboard, signals and platform activity",
      icon: <DashboardRounded fontSize="small" />,
      route: "/explore",
    },
    {
      label: "Jobs",
      description: "Verified openings and hiring activity",
      icon: <WorkRounded fontSize="small" />,
      route: "/jobs",
    },
    {
      label: "Courses",
      description: "Upskilling paths and instructor-led learning",
      icon: <SchoolRounded fontSize="small" />,
      route: "/courses/available",
    },
    {
      label: "Events",
      description: "Webinars, meetups and professional sessions",
      icon: <CalendarMonthRounded fontSize="small" />,
      route: "/events",
    },
    {
      label: "Community",
      description: "Posts, people and collaboration updates",
      icon: <GroupsRounded fontSize="small" />,
      route: "/community",
    },
    {
      label: "People",
      description: "Builders, mentors and technical operators",
      icon: <PeopleAltRounded fontSize="small" />,
      route: "/explore",
    },
    {
      label: "Projects",
      description: "Proof-of-work and shipped ideas",
      icon: <FolderRounded fontSize="small" />,
      route: "/explore",
    },
    {
      label: "Resources",
      description: "Guides, posts and practical references",
      icon: <ArticleRounded fontSize="small" />,
      route: "/explore",
    },
    {
      label: "AI Assistant",
      description: "Personal guidance and build support",
      icon: <AutoAwesomeRounded fontSize="small" />,
      route: "/explore",
      badge: "NEW",
    },
  ];
  const spaceItems = [
    {
      label: "Dashboard",
      description: "Your private career workspace",
      icon: <DashboardRounded fontSize="small" />,
      route: "/explore",
    },
    {
      label: "Saved Items",
      description: "Jobs, courses, events and references",
      icon: <BookmarkRounded fontSize="small" />,
      route: "/explore",
    },
  ];

  return (
    <Box
      sx={{
        width: { sm: 210, md: 260, lg: 248, xl: 260 },
        flexBasis: { lg: 248, xl: 260 },
        flexShrink: 0,
        mt: { sm: 1.5, md: 2 },
        display: {
          xs: "none",
          sm: "none",
          md: "none",
          lg: isSidebarRighbar && isTabSideBar && position === 0 ? "block" : "none",
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
            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : appColors.border,
            overflow: "visible",
            borderRadius: `${theme.shape.borderRadius + 6}px ${theme.shape.borderRadius + 6}px 0 0`,
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
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
          <BoxAvatarContent>
            <Box
              width={"100%"}
              px={2}
              py={2.5}
              sx={{
                background: isDarkMode
                  ? "linear-gradient(180deg, rgba(214,178,94,0.12) 0%, rgba(15, 23, 42, 0) 100%)"
                  : "linear-gradient(180deg, rgba(214,178,94,0.08) 0%, transparent 100%)",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {isLoadingRequest ? (
                <Box width={"100%"}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Skeleton variant="circular" width={70} height={70} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Stack spacing={2.5}>
                  {!isGuest && (
                    <Box
                      sx={{
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: isDarkMode ? "rgba(214,178,94,0.22)" : "rgba(139,111,42,0.18)",
                        background: isDarkMode
                          ? "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(214,178,94,0.07))"
                          : "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,248,229,0.84))",
                        boxShadow: isDarkMode
                          ? "0 18px 42px rgba(0,0,0,0.28)"
                          : "0 14px 34px rgba(139,111,42,0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ p: 1.25 }}>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Box sx={{ position: "relative", flexShrink: 0 }}>
                            <Avatar
                              alt={user?.name || "Profile"}
                              src={user?.avatar}
                              sx={{
                                width: 64,
                                height: 64,
                                background: "linear-gradient(135deg,#8B6F2A,#D6B25E,#FFF2C2)",
                                color: "#080808",
                                fontWeight: 950,
                                border: "3px solid",
                                borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.95)",
                                boxShadow: "0 12px 26px rgba(214,178,94,0.22)",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                right: -2,
                                bottom: -2,
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                color: "#080808",
                                background: user?.isVerified
                                  ? "linear-gradient(135deg,#8B6F2A,#D6B25E,#FFF2C2)"
                                  : isDarkMode ? "#1f2937" : "#F7F3EA",
                                border: "2px solid",
                                borderColor: isDarkMode ? "#111" : "#fff",
                              }}
                            >
                              <VerifiedUserRounded sx={{ fontSize: 14 }} />
                            </Box>
                          </Box>

                          <Box minWidth={0} flex={1}>
                            <Stack direction="row" alignItems="center" spacing={0.75} mb={0.35}>
                              <Typography
                                variant="body1"
                                fontWeight={950}
                                color="text.primary"
                                noWrap
                                sx={{ lineHeight: 1.12, fontSize: "1rem" }}
                              >
                                {user?.name || "Developer Profile"}
                              </Typography>
                              <Tooltip title={user?.isVerified ? "Verified profile" : "Verification pending"} arrow>
                                <Box
                                  sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    background: user?.isVerified ? "#D6B25E" : "text.disabled",
                                  }}
                                />
                              </Tooltip>
                            </Stack>
                            <Typography
                              variant="caption"
                              color="primary.main"
                              fontWeight={900}
                              sx={{ display: "block", lineHeight: 1.25 }}
                            >
                              {user?.specialisationTitle || "Set your specialization"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              sx={{ display: "block", mt: 0.35, fontWeight: 750 }}
                            >
                              {userLocation || "Location not set"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            mt: 1.35,
                            p: 1,
                            borderRadius: "8px",
                            background: isDarkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.7)",
                            border: "1px solid",
                            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(139,111,42,0.12)",
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={900}>
                              Profile Signal
                            </Typography>
                            <Typography variant="caption" color="primary.main" fontWeight={950}>
                              {profileSignalScore}%
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              mt: 0.75,
                              height: 6,
                              borderRadius: 999,
                              overflow: "hidden",
                              background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(139,111,42,0.12)",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${profileSignalScore}%`,
                                height: "100%",
                                background: "linear-gradient(90deg,#8B6F2A,#D6B25E,#FFF2C2)",
                              }}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            mt: 1,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 0.75,
                          }}
                        >
                          {profileCompletionItems.map((item) => (
                            <Box
                              key={item.label}
                              sx={{
                                p: 0.85,
                                minWidth: 0,
                                borderRadius: "8px",
                                background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(247,243,234,0.72)",
                                border: "1px solid",
                                borderColor: isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(139,111,42,0.1)",
                              }}
                            >
                              <Box sx={{ color: "primary.main", display: "flex", mb: 0.45 }}>
                                {item.icon}
                              </Box>
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", fontWeight: 850 }}>
                                {item.label}
                              </Typography>
                              <Typography variant="caption" color="text.primary" noWrap sx={{ display: "block", fontWeight: 950 }}>
                                {item.value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {user?.account !== "Organisation" && (
                        <Box
                          sx={{
                            px: 1.25,
                            py: 1.1,
                            borderTop: "1px solid",
                            borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(139,111,42,0.12)",
                            background: isDarkMode ? "rgba(0,0,0,0.16)" : "rgba(255,255,255,0.46)",
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} mb={0.9}>
                            <Stack direction="row" alignItems="center" spacing={0.6} minWidth={0}>
                              <PsychologyRounded sx={{ color: "primary.main", fontSize: 17, flexShrink: 0 }} />
                              <Typography variant="caption" color="text.secondary" fontWeight={950} noWrap>
                                Core Stack
                              </Typography>
                            </Stack>
                            <Typography variant="caption" color="primary.main" fontWeight={950}>
                              {selectedSkillsCount || "0"}
                            </Typography>
                          </Stack>

                          {selectedSkillsCount > 0 ? (
                            <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.65}>
                              {displayedSkills.map((skill, index) => (
                                <Tooltip title={skill} arrow key={`${skill}-${index}`}>
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.55,
                                      maxWidth: "100%",
                                      px: 0.75,
                                      py: 0.45,
                                      borderRadius: "8px",
                                      background: isDarkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.84)",
                                      border: "1px solid",
                                      borderColor: isDarkMode ? "rgba(214,178,94,0.16)" : "rgba(139,111,42,0.16)",
                                    }}
                                  >
                                    <Avatar
                                      alt={skill}
                                      src={getImageMatch(skill)}
                                      sx={{ width: 18, height: 18, bgcolor: "background.default" }}
                                    />
                                    <Typography variant="caption" fontWeight={900} noWrap sx={{ maxWidth: 82 }}>
                                      {skill}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              ))}
                              {hiddenSkillsCount > 0 && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    px: 0.8,
                                    py: 0.45,
                                    borderRadius: "8px",
                                    color: "#080808",
                                    background: "linear-gradient(135deg,#8B6F2A,#D6B25E,#FFF2C2)",
                                    fontSize: 11,
                                    fontWeight: 950,
                                  }}
                                >
                                  +{hiddenSkillsCount}
                                </Box>
                              )}
                            </Stack>
                          ) : (
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: "8px",
                                background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(247,243,234,0.72)",
                                border: "1px dashed",
                                borderColor: isDarkMode ? "rgba(214,178,94,0.22)" : "rgba(139,111,42,0.2)",
                              }}
                            >
                              <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                                Add your primary skills to sharpen course, job, and collaborator matching.
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}

                  {isGuest && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: cardRadius,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Typography variant="overline" color="primary" fontWeight={900} sx={{ display: "block", lineHeight: 1 }}>
                        Visitor Access
                      </Typography>
                      <Typography variant="body2" fontWeight={800} mt={0.75}>
                        Explore the developer marketplace.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Preview roles, courses, events, and community content. Sign in when you are ready to apply, enroll, RSVP, connect, or publish.
                      </Typography>
                      <Button
                        onClick={() => navigate("/auth/login")}
                        size="small"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1.25, borderRadius: cardRadius, fontWeight: 900 }}
                      >
                        Sign in to unlock actions
                      </Button>
                    </Box>
                  )}

                </Stack>
              )}
            </Box>

            <Box width={"100%"} px={1.5} pb={2}>
              <Box
                sx={{
                  borderRadius: cardRadius,
                  borderColor: "divider",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)", p: 1.5,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <TrendingUpRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
                  <Typography fontWeight={600} fontSize={13} color="#FFFDF7">
                    Growth Pathways
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {primaryNavItems.map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => navigate(item.route)}
                      startIcon={item.icon}
                      fullWidth
                      variant="text"
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        borderRadius: cardRadius,
                        px: 1.25,
                        py: 1,
                        color: "text.primary",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.25s ease",

                        "&:hover": {
                          background: "rgba(214,178,94,0.08)",
                          borderColor: "rgba(214,178,94,0.4)",
                          transform: "translateY(-1px)",
                        }
                      }}
                    >
                        <Box textAlign={"left"}>
                        <Box display="flex" alignItems="center" gap={0.75}>
                          <Typography variant="body2" fontWeight={850}>
                            {item.label}
                          </Typography>
                          {item.badge && (
                            <Box
                              component="span"
                              sx={{
                                px: 0.7,
                                py: 0.1,
                                borderRadius: "6px",
                                background: "linear-gradient(135deg,#8B6F2A,#D6B25E,#FFF2C2)",
                                color: "#080808",
                                fontSize: 9,
                                fontWeight: 950,
                              }}
                            >
                              {item.badge}
                            </Box>
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>

                <Divider sx={{ my: 1.4, borderColor: "rgba(255,255,255,0.08)" }} />

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,253,247,0.52)",
                    fontWeight: 950,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Your Space
                </Typography>
                <Stack spacing={1}>
                  {spaceItems.map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => navigate(item.route)}
                      startIcon={item.icon}
                      fullWidth
                      variant="text"
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        borderRadius: cardRadius,
                        px: 1.25,
                        py: 1,
                        color: "text.primary",
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        "&:hover": {
                          background: "rgba(214,178,94,0.08)",
                          borderColor: "rgba(214,178,94,0.4)",
                        },
                      }}
                    >
                      <Box textAlign="left">
                        <Typography variant="body2" fontWeight={850}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Box mt={1.5}>
                <Box
                  sx={{
                    borderRadius: cardRadius,
                    borderColor: "divider",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    p: 1.5,
                  }}
                >
                  <Typography variant="body2" fontWeight={700} mb={1}>
                    Platform insights
                  </Typography>
                  <Box display={"flex"} justifyContent={"center"}>
                    {!isFetching && (
                      <StepperStats
                        isDarkMode={isDarkMode}
                        errorMessage={errorMessage}
                        isFetching={isFetching}
                        dataInsights={dataInsights}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box mt={1.5}>
                <Box
                  sx={{
                    borderRadius: cardRadius,
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)"
                      : "rgba(255,255,255,0.8)",
                    border: "1px solid",
                    borderColor: "divider",
                    backdropFilter: "blur(20px)",
                    p: 2, // Increased padding for a more professional "breathable" feel
                  }}
                >
                  <Typography variant="overline" color="primary" fontWeight={900} sx={{ display: 'block', lineHeight: 1 }}>
                    Intelligence Feed
                  </Typography>
                  <Typography variant="body2" fontWeight={800} sx={{ mt: 0.5 }}>
                    Market-Dominant Stack
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2, opacity: 0.7 }}>
                    Real-time demand across hiring & community clusters.
                  </Typography>

                  <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(70px, 1fr))" // Structured grid for better alignment
                    gap={1}
                  >
                    {dataTools.map((tool) => (
                      <Tooltip key={tool.title} title={tool.title} arrow placement="top">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 1.2,
                            px: 0.5,
                            borderRadius: 2, // Slightly tighter radius for the items
                            bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                            border: "1px solid transparent",
                            transition: "all 0.2s ease-in-out",
                            cursor: "default",
                            "&:hover": {
                              bgcolor: "rgba(214,178,94, 0.08)",
                              borderColor: "rgba(214,178,94, 0.3)",
                              transform: "translateY(-2px)",
                              "& .tool-icon": {
                                filter: "drop-shadow(0 0 8px rgba(214,178,94, 0.4))"
                              }
                            },
                          }}
                        >
                          <Avatar
                            className="tool-icon"
                            sx={{
                              width: 28,
                              height: 28,
                              mb: 0.8,
                              transition: "filter 0.2s ease",
                              bgcolor: 'transparent'
                            }}
                            src={getImageMatch(tool.title)}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              color: "text.secondary",
                              textAlign: "center",
                              textTransform: "uppercase",
                              letterSpacing: "0.02em"
                            }}
                          >
                            {tool.title?.length > 8 ? `${tool.title.substring(0, 7)}.` : tool.title}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box mt={1.5}>
                <Box
                  sx={{
                    borderRadius: cardRadius,
                    p: 1.5,
                    color: theme.palette.primary.contrastText,
                    background: appGradients.primary,
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    Cross-platform access
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.92 }}>
                    Mobile and desktop companion apps are on the roadmap for professional workflows.
                  </Typography>
                  <Button
                    onClick={() => setOpenMobileApp(true)}
                    size="small"
                    sx={{
                      mt: 1.2,
                      color: theme.palette.primary.contrastText,
                      borderColor: "rgba(255,255,255,0.45)",
                    }}
                    variant="outlined"
                  >
                    Learn more
                  </Button>
                </Box>
              </Box>

              <Box mt={1.5}>
                <Box
                  sx={{
                    borderRadius: cardRadius,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    p: 1.5,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1.25}>
                    <AssignmentTurnedInRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={700}>
                      Professional readiness
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    {profileCompletionItems.map((item) => (
                      <Box
                        key={item.label}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                        sx={{
                          borderRadius: cardRadius,
                          px: 1,
                          py: 0.85,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                          <Box sx={{ color: "#D6B25E", display: "flex" }}>{item.icon}</Box>
                          <Typography variant="caption" noWrap>
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Box mt={1.5}>
                <Box
                  sx={{
                    borderRadius: cardRadius,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    p: 1.5,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <WorkspacePremiumRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={700}>
                      Trust layer
                    </Typography>
                  </Box>
                  <Stack spacing={0.9}>
                    {platformReadiness.map((item) => (
                      <Box key={item} display="flex" alignItems="flex-start" gap={1}>
                        <RocketLaunchRounded sx={{ color: "#D6B25E", fontSize: 15, mt: 0.25 }} />
                        <Typography variant="caption" color="text.secondary">
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </BoxAvatarContent>
        </Box>
      </Box>

      <AlertGeneral
        title={"Mobile App"}
        message={
          "Mobile application is still under development once completed by our esteemed software engineers, it will be rolled out."
        }
        openAlertGeneral={openMobileApp}
        setOpenAlertGeneral={setOpenMobileApp}
        defaultIcon={<Smartphone />}
      />
    </Box>
  );
};

export default Sidebar;
