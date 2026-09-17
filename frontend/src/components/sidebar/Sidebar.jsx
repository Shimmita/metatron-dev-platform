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
  AvatarGroup,
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
  const selectedSkillsCount = user?.selectedSkills?.length || 0;
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
      route: "/explore",
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
              px={2} // Increased padding for better breathing room
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
                  {/* ─── IDENTITY BLOCK ─── */}
                  {!isGuest && (
                    <Box display={"flex"} alignItems={"center"} gap={2.5}>

                      <Avatar
                        alt={user?.name || "Profile"}
                        src={user?.avatar}
                        sx={{
                          width: 70,
                          height: 70,
                          background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
                          boxShadow: isDarkMode
                            ? "0 0 25px rgba(214,178,94,0.2)"
                            : "0 8px 16px rgba(214,178,94,0.15)",
                          border: "2px solid",
                          borderColor: "background.paper"
                        }}
                      />

                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant="body1"
                          fontWeight={900}
                          color="text.primary"
                          sx={{ lineHeight: 1.1, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                        >
                          {user?.name || "Guest Mode"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="primary"
                          fontWeight={700}
                          sx={{ display: "block", mt: 0.3, opacity: 0.9, textTransform: 'uppercase', fontSize: '0.65rem' }}
                        >
                          {user?.specialisationTitle}
                        </Typography>

                        {/* Metadata Badges */}
                        <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                          <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {user?.county && `${user.county} •`} {CustomCountryName(user?.country)}
                          </Typography>
                          <Typography variant="caption" sx={{ width: '100%', opacity: 0.8, fontWeight: 800, color: 'text.secondary', fontSize: '0.65rem' }}>
                            {user?.network_count || 0} NETWORK CONNECTIONS
                          </Typography>
                        </Box>
                      </Box>
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

                  {/* ─── TECH STACK BLOCK ─── */}
                  {!isGuest && user?.account !== "Organisation" && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 900, fontSize: '0.65rem', display: 'block', mb: 1 }}>
                        Verified Capabilities
                      </Typography>

                      <Box display={"flex"} alignItems={"center"} gap={1.5}>
                        <AvatarGroup
                          max={5}
                          sx={{
                            '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 12, border: '2px solid', borderColor: 'background.paper' }
                          }}
                        >
                          {user?.selectedSkills?.map((skill, index) => (
                            <Tooltip title={skill} arrow key={index}>
                              <Avatar
                                alt={skill}
                                sx={{ bgcolor: 'background.default' }}
                                src={getImageMatch(skill)}
                              />
                            </Tooltip>
                          ))}
                        </AvatarGroup>

                        {user?.selectedSkills?.length > 5 && (
                          <Typography variant="caption" fontWeight={700} color="primary">
                            +{user.selectedSkills.length - 5} MORE
                          </Typography>
                        )}
                      </Box>
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
