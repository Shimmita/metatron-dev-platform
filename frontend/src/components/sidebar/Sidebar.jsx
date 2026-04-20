import {
  CalendarMonthRounded,
  SchoolRounded,
  Smartphone,
  TrendingUpRounded,
  WorkRounded,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Divider,
  FormHelperText,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appColors, appGradients } from "../../utils/colors";
import AlertGeneral from "../alerts/AlertGeneral";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { getImageMatch } from "../utilities/getImageMatch";
import StepperStats from "./StepperStats";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.5s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.5)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const BoxAvatarContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
});

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
  const { user, isGuest, usersCount } = useSelector((state) => state.currentUser);
  const { position } = useSelector((state) => state.currentBottomNav);

  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = currentMode === "dark";
  const cardRadius = `${Math.max(theme.shape.borderRadius - 2, 8)}px`;

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
          setDataInsights(res.data.insights);
          setDataTools(res.data.tools);
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server is unreachable ");
          return;
        }
        setErrorMessage(err?.response?.data || "Unable to load insights.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [dataInsights.length]);

  const primaryNavItems = [
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
  ];

  return (
    <Box
      sx={{
        width: { md: 280, lg: 310, xl: 330 },
        flexShrink: 0,
        mt: { md: 2 },
        display: {
          xs: "none",
          sm: CustomDeviceTablet()
            ? isSidebarRighbar && isTabSideBar && position === 0
              ? "block"
              : "none"
            : "none",
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
            borderRadius: `${theme.shape.borderRadius + 6}px ${theme.shape.borderRadius + 6}px 0 0`,
            width: "100%",
          }}
        >
          <BoxAvatarContent>
            <Box
              width={"100%"}
              px={1.5}
              py={2}
              sx={{
                background: isDarkMode
                  ? "linear-gradient(180deg, rgba(15,76,129,0.3), rgba(8,21,38,0.2))"
                  : appGradients.soft,
              }}
            >
              {isLoadingRequest ? (
                <Box width={"100%"}>
                  <Box mb={1} display={"flex"} justifyContent={"center"}>
                    <Skeleton variant="circular" width={80} height={80} />
                  </Box>
                  <Skeleton variant="rectangular" height={"20vh"} />
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Box display={"flex"} alignItems={"center"} gap={2}>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar
                        alt={user?.name || "Profile"}
                        src={user?.avatar}
                        sx={{
                          width: 80,
                          height: 80,
                          color: theme.palette.common.white,
                          backgroundColor: theme.palette.primary.main,
                        }}
                      />
                    </StyledBadge>

                    <Box flex={1}>
                      <Typography
                        variant={"body1"}
                        fontWeight={700}
                        color={"text.primary"}
                        sx={{ lineHeight: 1.2 }}
                      >
                        {user?.name || "Guest Mode"}
                      </Typography>

                      <Typography
                        variant="caption"
                        textTransform={"none"}
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {user?.specialisationTitle || "Login or Register"}
                      </Typography>

                      {isGuest ? (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "success.main", mt: 0.5 }}
                        >
                          {usersCount}+ professionals on the platform
                        </Typography>
                      ) : (
                        <Box mt={1}>
                          <FormHelperText sx={{ px: 0, mx: 0, mb: 0.4 }}>
                            {user?.county} {user?.county && user?.country ? "•" : ""}{" "}
                            {CustomCountryName(user?.country)}
                          </FormHelperText>
                          <FormHelperText sx={{ px: 0, mx: 0 }}>
                            {user?.network_count || 0} professional connections
                          </FormHelperText>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {!isGuest && user?.account !== "Organisation" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Skill profile
                      </Typography>
                      <Box mt={1} display={"flex"} alignItems={"center"} gap={1}>
                        <AvatarGroup max={user?.selectedSkills?.length || 0}>
                          {user?.selectedSkills?.map((skill, index) => (
                            <Tooltip title={skill} arrow key={index}>
                              <Avatar
                                alt={skill}
                                className="border"
                                sx={{ width: 28, height: 28 }}
                                src={getImageMatch(skill)}
                              />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
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
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  p: 1.5,
                }}
              >
                <Box display={"flex"} alignItems={"center"} gap={1} mb={1.5}>
                  <TrendingUpRounded color="primary" fontSize="small" />
                  <Typography fontWeight={700} variant="body2">
                    Professional pathways
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
                        bgcolor: isDarkMode ? "rgba(15,76,129,0.16)" : "rgba(15,76,129,0.05)",
                      }}
                    >
                      <Box textAlign={"left"}>
                        <Typography variant="body2" fontWeight={700}>
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
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
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
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                    p: 1.5,
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    Top tools in demand
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Technologies showing up most often across hiring, learning, and community activity.
                  </Typography>

                  <Divider sx={{ my: 1.25 }} />

                  <Box
                    alignItems={"center"}
                    gap={1.5}
                    mt={1}
                    justifyContent={"center"}
                    display={"flex"}
                    flexWrap={"wrap"}
                  >
                    {dataTools.map((tool) => (
                      <Box
                        key={tool.title}
                        justifyContent={"center"}
                        flexDirection={"column"}
                        display={"flex"}
                        alignItems={"center"}
                        sx={{
                          minWidth: 64,
                          px: 0.75,
                          py: 0.5,
                          borderRadius: cardRadius,
                          bgcolor: isDarkMode
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(15,76,129,0.04)",
                        }}
                      >
                        <Tooltip title={tool.title} arrow>
                          <Avatar sx={{ width: 30, height: 30 }} src={getImageMatch(tool.title)} />
                        </Tooltip>
                        <FormHelperText
                          sx={{
                            fontSize: "0.68rem",
                            color: "text.secondary",
                            textAlign: "center",
                          }}
                        >
                          {tool.title?.substring(0, 10)}
                        </FormHelperText>
                      </Box>
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
        setOpenAlertGenral={setOpenMobileApp}
        defaultIcon={<Smartphone />}
      />
    </Box>
  );
};

export default Sidebar;
