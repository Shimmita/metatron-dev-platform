import {
  AutoAwesomeRounded,
  Close,
  ConnectWithoutContactRounded,
  EventAvailableRounded,
  Lock,
  MoreHorizRounded,
  PersonAddRounded,
  SchoolRounded,
  TravelExploreRounded,
  Visibility,
  VisibilityOff,
  WorkRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { lazy, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../images/logo_sm.png";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import { appColors, appGradients } from "../../utils/colors";
import { formatMetric } from "../../utils/formatMetric";
import OptionsMoreLogin from "./OptionsMoreLogin";

const ModalPolicyTerms = lazy(() => import("./ModalPolicyTerms"));
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

const goldGradient = "linear-gradient(135deg, #8B6F2A 0%, #D6B25E 54%, #FFF2C2 100%)";

const DotGrid = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(90deg, rgba(214,178,94,0.045) 1px, transparent 1px), linear-gradient(rgba(214,178,94,0.045) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
      pointerEvents: "none",
    }}
  />
);

const SignalBars = ({ values = [28, 48, 36, 62, 54, 78, 68, 92] }) => (
  <Box display="flex" alignItems="flex-end" gap={0.7} height={54}>
    {values.map((value, index) => (
      <Box
        key={`${value}-${index}`}
        sx={{
          width: 9,
          height: `${value}%`,
          minHeight: 8,
          borderRadius: 999,
          background:
            index === values.length - 1
              ? goldGradient
              : "linear-gradient(180deg, rgba(214,178,94,0.9), rgba(214,178,94,0.16))",
          boxShadow: index === values.length - 1 ? "0 0 18px rgba(214,178,94,0.35)" : "none",
        }}
      />
    ))}
  </Box>
);

const MetricPill = ({ value, label, icon, compact = false }) => (
  <Box
    sx={{
      borderRadius: "8px",
      border: "1px solid rgba(214,178,94,0.18)",
      background: "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(255,255,255,0.035))",
      px: compact ? 1 : 1.2,
      py: compact ? 0.75 : 0.95,
      minWidth: 0,
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
      <Box sx={{ color: appColors.primary, display: "flex" }}>{icon}</Box>
      <Typography sx={{ color: appColors.textPrimary, fontWeight: 950, fontSize: compact ? 15 : 17, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
    <Typography
      sx={{
        color: appColors.textMuted,
        fontSize: compact ? 9.5 : 10,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        mt: 0.65,
      }}
      noWrap
    >
      {label}
    </Typography>
  </Box>
);

const SignalVisual = () => (
  <Box
    sx={{
      position: "relative",
      borderRadius: "8px",
      border: "1px solid rgba(214,178,94,0.2)",
      background:
        "radial-gradient(circle at 35% 12%, rgba(214,178,94,0.2), transparent 30%), linear-gradient(145deg, rgba(255,255,255,0.07), rgba(5,5,5,0.34))",
      overflow: "hidden",
      p: { xs: 1.2, md: 1.6 },
      minHeight: { xs: 128, md: 214 },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(90deg, rgba(214,178,94,0.055) 1px, transparent 1px), linear-gradient(rgba(214,178,94,0.055) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", md: "78%" },
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "linear-gradient(145deg, rgba(10,14,22,0.96), rgba(4,4,4,0.82))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        p: { xs: 1.1, md: 1.5 },
      }}
    >
      <Box display="flex" gap={0.55} mb={1}>
        {[0, 1, 2].map((dot) => (
          <Box key={dot} sx={{ width: 7, height: 7, borderRadius: "50%", background: dot === 0 ? appColors.primary : "rgba(255,255,255,0.22)" }} />
        ))}
      </Box>
      <Typography sx={{ color: appColors.textMuted, fontFamily: "monospace", fontSize: 11, lineHeight: 1.65 }}>
        opportunity.feed = &#123;
      </Typography>
      <Typography sx={{ color: appColors.textSecondary, fontFamily: "monospace", fontSize: 11, lineHeight: 1.65 }}>
        &nbsp;&nbsp;jobs: "curated",
      </Typography>
      <Typography sx={{ color: appColors.textSecondary, fontFamily: "monospace", fontSize: 11, lineHeight: 1.65 }}>
        &nbsp;&nbsp;courses: "career aligned",
      </Typography>
      <Typography sx={{ color: appColors.primarySoft, fontFamily: "monospace", fontSize: 11, lineHeight: 1.65 }}>
        &nbsp;&nbsp;events: "active"
      </Typography>
      <Typography sx={{ color: appColors.textMuted, fontFamily: "monospace", fontSize: 11, lineHeight: 1.65 }}>
        &#125;
      </Typography>
      <Box mt={{ xs: 1, md: 1.4 }}>
        <SignalBars />
      </Box>
    </Box>
    {["Jobs", "Courses", "Events"].map((label, index) => (
      <Box
        key={label}
        sx={{
          position: "absolute",
          right: [18, 74, 26][index],
          top: [22, 92, 152][index],
          display: { xs: "none", md: "block" },
          px: 1,
          py: 0.45,
          borderRadius: "8px",
          border: "1px solid rgba(214,178,94,0.24)",
          background: index === 0 ? goldGradient : "rgba(255,255,255,0.08)",
          color: index === 0 ? "#080808" : appColors.textPrimary,
          fontSize: 11,
          fontWeight: 950,
          transform: `rotate(${[-8, 7, -6][index]}deg)`,
        }}
      >
        {label}
      </Box>
    ))}
  </Box>
);

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: appColors.textPrimary,
    background: "rgba(255,255,255,0.06)",
    borderRadius: "8px",
    minHeight: 48,
    transition: "box-shadow 0.25s",
    "& fieldset": { borderColor: appColors.border, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.22)" },
    "&.Mui-focused fieldset": { borderColor: appColors.primary, borderWidth: "1px" },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${appColors.glow}` },
  },
  "& .MuiInputLabel-root": { color: appColors.textMuted, fontSize: 13 },
  "& .MuiInputLabel-root.Mui-focused": { color: appColors.primary },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0B0B0B inset",
    WebkitTextFillColor: appColors.textPrimary,
  },
};

const LoginAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isGuest } = useSelector((state) => state.currentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [platformTotals, setPlatformTotals] = useState({
    developers: null,
    techGigs: null,
    events: null,
    courses: null,
  });

  const openMore = Boolean(anchorEl);
  const metricValue = (value) => value === null || value === undefined ? "..." : formatMetric(value);
  const platformMetrics = [
    { value: metricValue(platformTotals.techGigs), label: "Tech roles", icon: <WorkRounded fontSize="small" /> },
    { value: metricValue(platformTotals.courses), label: "Learning paths", icon: <SchoolRounded fontSize="small" /> },
    { value: metricValue(platformTotals.events), label: "Live events", icon: <EventAvailableRounded fontSize="small" /> },
    { value: metricValue(platformTotals.developers), label: "IT network", icon: <ConnectWithoutContactRounded fontSize="small" /> },
  ];

  useLayoutEffect(() => {
    if (!isGuest) navigate("/explore");
  }, [isGuest, navigate]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);

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
          setPlatformTotals({ developers: 0, techGigs: 0, events: 0, courses: 0 });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async () => {
    setIsFetching(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signin/personal`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(updateUserCurrentUserRedux(res.data));
      navigate("/explore");
    } catch (err) {
      setMessage(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !isFetching) handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: appGradients.page,
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(214,178,94,0.14), transparent 34%, rgba(242,184,75,0.06) 67%, rgba(191,164,106,0.11))",
          pointerEvents: "none",
        },
      }}
    >
      <DotGrid />

      <Box
        component="nav"
        sx={{
          position: "relative",
          zIndex: 10,
          height: 56,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 2.5, md: 5 },
          background: "rgba(5,5,5,0.84)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${appColors.border}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.1} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Avatar src={logo} sx={{ width: 32, height: 32, boxShadow: "0 0 18px rgba(214,178,94,0.14)" }} />
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 950, color: appColors.textPrimary, letterSpacing: "0.06em", lineHeight: 1 }}>
              METATRON
            </Typography>
            <Typography sx={{ fontSize: 9.5, letterSpacing: "0.16em", color: appColors.textMuted, textTransform: "uppercase" }}>
              Build · Learn · Connect · Grow
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={0.75}>
          <Tooltip title="Explore as guest" arrow>
            <Button
              size="small"
              onClick={() => navigate("/explore")}
              startIcon={<TravelExploreRounded sx={{ width: 15, height: 15 }} />}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                borderRadius: "8px",
                px: 1.35,
                py: 0.55,
                fontSize: 12,
                color: appColors.textSecondary,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${appColors.divider}`,
                "&:hover": { background: "rgba(214,178,94,0.08)", color: appColors.primary, borderColor: "rgba(214,178,94,0.3)" },
              }}
            >
              Explore
            </Button>
          </Tooltip>
          <Button
            size="small"
            onClick={() => navigate("/auth/register/personal")}
            startIcon={<PersonAddRounded sx={{ width: 15, height: 15 }} />}
            sx={{
              borderRadius: "8px",
              px: 1.35,
              py: 0.55,
              fontSize: 12,
              color: "#080808",
              background: goldGradient,
              "&:hover": { filter: "brightness(1.04)", background: goldGradient },
            }}
          >
            Register
          </Button>
          <IconButton
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ color: appColors.textMuted, border: `1px solid ${appColors.divider}`, borderRadius: "8px" }}
          >
            <MoreHorizRounded sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.25, sm: 2, md: 5 },
          py: { xs: 1.25, md: 2.25 },
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1120,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 400px" },
            alignItems: "center",
            gap: { xs: 1.25, md: 2.25, lg: 3 },
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              minHeight: 0,
              borderRadius: "8px",
              border: `1px solid ${appColors.border}`,
              background: "linear-gradient(135deg, rgba(214,178,94,0.11), rgba(255,255,255,0.035))",
              backdropFilter: "blur(26px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
              p: { md: 2.35, lg: 2.75 },
              overflow: "visible",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1.4}>
              <AutoAwesomeRounded sx={{ color: appColors.primary, fontSize: 18 }} />
              <Typography sx={{ color: appColors.primary, fontSize: 11, fontWeight: 950, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Tech Opportunity Network
              </Typography>
            </Box>

            <Typography sx={{ color: appColors.textPrimary, fontWeight: 950, fontSize: { md: 38, lg: 46 }, lineHeight: 1.02, maxWidth: 610 }}>
              Sign in to discover your next tech move.
            </Typography>
            <Typography sx={{ color: appColors.textSecondary, fontSize: 13.5, lineHeight: 1.7, maxWidth: 560, mt: 1.4 }}>
              Find IT jobs, join relevant events, learn in-demand skills, connect with technocrats, and publish proof of work in one professional platform.
            </Typography>

            <Box mt={2}>
              <SignalVisual />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 1,
                mt: 2,
              }}
            >
              {platformMetrics.map((metric) => (
                <MetricPill key={metric.label} {...metric} />
              ))}
            </Box>

            <Box
              sx={{
                mt: "auto",
                pt: 1.8,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              {[
                ["Jobs", "Openings across software, data, cloud, support, and IT operations"],
                ["Courses", "Skill paths for practical career growth"],
                ["Events", "Meetups, panels, workshops, and hackathons"],
                ["Connect", "Peers, mentors, teams, and professional communities"],
              ].map(([title, body], index) => (
                <Box
                  key={title}
                  sx={{
                    borderRadius: "8px",
                    border: index === 0
                      ? "1px solid rgba(214,178,94,0.34)"
                      : `1px solid ${appColors.divider}`,
                    background: index === 0
                      ? "linear-gradient(135deg, rgba(214,178,94,0.18), rgba(255,255,255,0.045))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
                    boxShadow: index === 0
                      ? "0 18px 36px rgba(214,178,94,0.12)"
                      : "0 12px 28px rgba(0,0,0,0.18)",
                    p: 1.15,
                    minHeight: 104,
                    transform: [
                      "rotate(-2.4deg) translateY(4px)",
                      "rotate(1.8deg) translateY(-5px)",
                      "rotate(-1.4deg) translateY(5px)",
                      "rotate(2.2deg) translateY(-3px)",
                    ][index],
                    transformOrigin: "center",
                    transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: "0 auto 0 0",
                      width: 3,
                      background: index === 0
                        ? goldGradient
                        : "linear-gradient(180deg, rgba(214,178,94,0.65), rgba(214,178,94,0.08))",
                    },
                    "&:hover": {
                      transform: [
                        "rotate(-1.2deg) translateY(0)",
                        "rotate(0.8deg) translateY(-8px)",
                        "rotate(-0.6deg) translateY(1px)",
                        "rotate(1deg) translateY(-6px)",
                      ][index],
                      borderColor: "rgba(214,178,94,0.36)",
                      background: "linear-gradient(135deg, rgba(214,178,94,0.13), rgba(255,255,255,0.045))",
                    },
                  }}
                >
                  <Typography sx={{ color: appColors.textPrimary, fontWeight: 900, fontSize: 12 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: appColors.textMuted, fontSize: 11, mt: 0.3 }}>
                    {body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: 430, md: "none" },
              mx: "auto",
              borderRadius: "8px",
              border: `1px solid ${appColors.border}`,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
              p: { xs: 1.5, sm: 2.25, md: 2.35 },
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -40,
                width: 190,
                height: 190,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(214,178,94,0.16), transparent 68%)",
                pointerEvents: "none",
              }}
            />

            <Box sx={{ position: "relative" }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
                <Box>
                  <Typography sx={{ color: appColors.primary, fontWeight: 950, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    Secure Login
                  </Typography>
                  <Typography sx={{ color: appColors.textPrimary, fontWeight: 950, fontSize: { xs: 25, sm: 28 }, lineHeight: 1.08, mt: 0.55 }}>
                    Access Metatron
                  </Typography>
                  <Typography sx={{ color: appColors.textSecondary, fontSize: 12.5, mt: 0.55 }}>
                    Continue into your tech opportunity workspace.
                  </Typography>
                </Box>
                <Avatar src={logo} sx={{ width: 48, height: 48, display: { xs: "none", sm: "flex" } }} />
              </Box>

              <Box
                sx={{
                  display: { xs: "grid", md: "none" },
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 0.75,
                  mt: 1.35,
                }}
              >
                {platformMetrics.map((metric) => (
                  <MetricPill key={metric.label} {...metric} compact />
                ))}
              </Box>

              <Box
                sx={{
                  display: { xs: "block", md: "none" },
                  mt: 1.2,
                  "@media (max-height: 720px)": {
                    display: "none",
                  },
                }}
              >
                <SignalVisual />
              </Box>

              <Collapse in={!!message}>
                <Alert
                  severity="info"
                  sx={{
                    mt: 1.35,
                    mb: 1.25,
                    borderRadius: "8px",
                    background: "rgba(214,178,94,0.08)",
                    border: "1px solid rgba(214,178,94,0.22)",
                    color: appColors.textPrimary,
                    "& .MuiAlert-icon": { color: appColors.primary },
                  }}
                  action={
                    <IconButton size="small" onClick={() => setMessage("")} sx={{ color: appColors.textSecondary }}>
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Collapse>

              <Box display="flex" flexDirection="column" gap={1.35} mt={message ? 0 : 1.8}>
                <TextField
                  label="Email"
                  fullWidth
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={onKeyDown}
                  sx={inputSx}
                />
                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Password *</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={onKeyDown}
                    label="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((current) => !current)}
                          edge="end"
                          sx={{ color: appColors.textMuted, "&:hover": { color: appColors.primary } }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Box display="flex" justifyContent="flex-end" mt={0.85}>
                <Typography
                  component={Link}
                  to="/auth/recover"
                  sx={{ fontSize: 11.5, color: appColors.textMuted, textDecoration: "none", "&:hover": { color: appColors.primary } }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                disabled={isFetching}
                onClick={handleLogin}
                startIcon={isFetching ? <CircularProgress size={15} sx={{ color: "#080808" }} /> : <Lock fontSize="small" />}
                sx={{
                  mt: 1.5,
                  minHeight: 45,
                  borderRadius: "8px",
                  fontWeight: 950,
                  fontSize: 13.5,
                  color: "#080808",
                  background: goldGradient,
                  boxShadow: `0 10px 30px ${appColors.glow}`,
                  "&:hover": { background: goldGradient, filter: "brightness(1.04)", boxShadow: "0 14px 36px rgba(214,178,94,0.36)" },
                  "&.Mui-disabled": { background: "rgba(255,255,255,0.08)", color: appColors.textMuted },
                }}
              >
                {isFetching ? "Signing in..." : "Continue"}
              </Button>

              <Box
                sx={{
                  mt: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ color: appColors.textMuted, fontSize: 11.5 }}>
                  New to Metatron?
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/auth/register/personal")}
                  sx={{
                    borderRadius: "8px",
                    px: 1.2,
                    py: 0.45,
                    fontSize: 11.5,
                    color: appColors.primary,
                    border: `1px solid ${appColors.border}`,
                    background: "rgba(214,178,94,0.07)",
                    "&:hover": { borderColor: "rgba(214,178,94,0.42)", background: "rgba(214,178,94,0.11)" },
                  }}
                >
                  Create account
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={openMore}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { background: "#0B0B0B", border: `1px solid ${appColors.border}`, borderRadius: "8px", mt: 1 } }}
      >
        <OptionsMoreLogin
          handleClose={() => setAnchorEl(null)}
          setOpenModalInfo={setOpenModalInfo}
          setOpenModalTerms={setOpenModalTerms}
          setShowPrivacy={setShowPrivacy}
        />
      </Menu>

      <Backdrop open={isFetching} sx={{ zIndex: 9999, background: "rgba(6,13,24,0.7)", backdropFilter: "blur(4px)" }} />
      <ModalAccountInfo openModalInfo={openModalInfo} setOpenModalInfo={setOpenModalInfo} />
      <ModalPolicyTerms openModalTerms={openModalTerms} setOpenModalTerms={setOpenModalTerms} isShowPrivacy={showPrivacy} />
    </Box>
  );
};

export default LoginAuth;
