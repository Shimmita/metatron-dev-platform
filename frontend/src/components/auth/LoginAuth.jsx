import {
  AutoAwesomeRounded,
  EventAvailableRounded,
  GroupsRounded,
  Close,
  Lock,
  PersonAddRounded,
  SchoolRounded,
  TravelExploreRounded,
  Visibility,
  VisibilityOff,
  WorkRounded
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
  useMediaQuery,
  useTheme,
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

/* ─── Dot grid ───────────────────────────────────────────────────── */
const DotGrid = () => (
  <Box sx={{
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(90deg, rgba(32,214,199,0.04) 1px, transparent 1px), linear-gradient(rgba(32,214,199,0.04) 1px, transparent 1px)",
    backgroundSize: "34px 34px", pointerEvents: "none",
  }} />
);

/* ─── Stat counter ───────────────────────────────────────────────── */
const StatCount = ({ value, label, icon }) => (
  <Box sx={{
    px: 2, py: 1.4, borderRadius: "8px",
    background: "rgba(255,255,255,0.055)",
    border: `1px solid ${appColors.border}`,
    minWidth: 116, textAlign: "left",
  }}>
    <Box sx={{ color: appColors.primary, display: "flex", mb: 1 }}>{icon}</Box>
    <Typography sx={{
      fontSize: 21, fontWeight: 900,
      color: appColors.textPrimary, lineHeight: 1,
    }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.1em", mt: 0.4 }}>
      {label}
    </Typography>
  </Box>
);

/* ─── Feature row ─────────────────────────────────────────────────── */
const Feature = ({ label }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={1.4}>
    <Box sx={{ width: 18, height: 2, borderRadius: 1, bgcolor: appColors.primary, flexShrink: 0 }} />
    <Typography sx={{ fontSize: 13, color: appColors.textSecondary }}>{label}</Typography>
  </Box>
);

/* ─── Shared input sx ─────────────────────────────────────────────── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: appColors.textPrimary,
    background: "rgba(255,255,255,0.06)",
    borderRadius: "10px",
    transition: "box-shadow 0.25s",
    "& fieldset": { borderColor: appColors.border, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.22)" },
    "&.Mui-focused fieldset": { borderColor: appColors.primary, borderWidth: "1px" },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${appColors.glow}` },
  },
  "& .MuiInputLabel-root": { color: appColors.textMuted, fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: appColors.primary },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0A1625 inset",
    WebkitTextFillColor: appColors.textPrimary,
  },
};

/* ─── Divider with label ──────────────────────────────────────────── */
const RuleDivider = ({ label }) => (
  <Box display="flex" alignItems="center" gap={1.5} my={2.5}>
    <Box flex={1} height="1px" bgcolor={appColors.divider} />
    <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Box flex={1} height="1px" bgcolor={appColors.divider} />
  </Box>
);

/* ═══════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════ */
const LoginAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { isGuest } = useSelector((s) => s.currentUser);

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

  useLayoutEffect(() => { if (!isGuest) navigate("/explore"); }, [isGuest, navigate]);

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
            developers: 0,
            techGigs: 0,
            events: 0,
            courses: 0,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

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

  const onKeyDown = (e) => { if (e.key === "Enter" && !isFetching) handleLogin(); };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        background: appGradients.page,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(32,214,199,0.14), transparent 34%, rgba(242,184,75,0.06) 67%, rgba(124,58,237,0.11))",
          pointerEvents: "none",
        },
      }}
    >
      <DotGrid />

      {/* ════ NAVBAR ════ */}
      <Box
        component="nav"
        sx={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: { xs: 2.5, md: 5 }, py: "13px",
          background: "rgba(6,13,24,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${appColors.border}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Avatar src={logo} sx={{ width: 30, height: 30 }} />
          <Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 16, fontWeight: 700, color: appColors.textPrimary,
              letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1,
            }}>
              METATRON
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: "0.2em", color: appColors.primary, textTransform: "uppercase" }}>
              Developer Intelligence
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Explore as guest" arrow>
            <Button
              size="small"
              onClick={() => navigate("/explore")}
              startIcon={<TravelExploreRounded sx={{ width: 14, height: 14 }} />}
              sx={{
                borderRadius: "9px", px: 1.5, py: 0.6,
                fontSize: 11.5, fontWeight: 500, textTransform: "none",
                border: `1px solid ${appColors.divider}`,
                color: appColors.textSecondary,
                background: "rgba(255,255,255,0.04)",
                "&:hover": { background: "rgba(20,210,190,0.08)", color: appColors.primary, borderColor: "rgba(20,210,190,0.3)" },
              }}
            >
              Explore
            </Button>
          </Tooltip>

          <Tooltip title="Register" arrow>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: appColors.textMuted, "&:hover": { color: appColors.primary } }}>
              <PersonAddRounded sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ════ MAIN ════ */}
      <Box
        flex={1}
        display="flex"
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="center"
        sx={{ position: "relative", zIndex: 1, px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
          maxWidth={1180}
          alignItems={{ xs: "stretch", md: "center" }}
          gap={{ xs: 3, md: 8, lg: 10 }}
        >

          {/* ── Left panel ── */}
          {isDesktop && (
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box sx={{ width: 28, height: 2, bgcolor: appColors.primary, borderRadius: 1 }} />
                <Typography sx={{ fontSize: 10, letterSpacing: "0.2em", color: appColors.primary, textTransform: "uppercase" }}>
                  Developer Growth Operating System
                </Typography>
              </Box>

              <Typography sx={{
                fontSize: { md: 42, lg: 54 }, fontWeight: 900,
                lineHeight: 1.04, mb: 2, color: appColors.textPrimary,
              }}>
                One platform for tech gigs,
                <Box component="span" sx={{ display: "block", color: appColors.primary }}>
                  courses, events, and content.
                </Box>
              </Typography>

              <Typography sx={{ fontSize: 14, color: appColors.textSecondary, maxWidth: 520, lineHeight: 1.8, mb: 4 }}>
                Metatron helps developers discover credible opportunities, build marketable skills,
                join high-signal communities, and publish proof of work in one professional workspace.
              </Typography>

              {["Verified tech gigs and hiring signals", "Course paths mapped to real developer roles", "Events, communities, and mentors for momentum", "Content publishing for project credibility"].map((f) => (
                <Feature key={f} label={f} />
              ))}

              <Box display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap={1.25} mt={5} maxWidth={620}>
                <StatCount value={metricValue(platformTotals.developers)} label="Developers" icon={<GroupsRounded fontSize="small" />} />
                <StatCount value={metricValue(platformTotals.techGigs)} label="Active gigs" icon={<WorkRounded fontSize="small" />} />
                <StatCount value={metricValue(platformTotals.courses)} label="Courses" icon={<SchoolRounded fontSize="small" />} />
                <StatCount value={metricValue(platformTotals.events)} label="Events" icon={<EventAvailableRounded fontSize="small" />} />
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  maxWidth: 620,
                  borderRadius: "8px",
                  border: `1px solid ${appColors.border}`,
                  background: "rgba(255,255,255,0.045)",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AutoAwesomeRounded sx={{ color: appColors.accent, fontSize: 18 }} />
                  <Typography sx={{ fontSize: 13, color: appColors.textPrimary, fontWeight: 800 }}>
                    Career Growth Hub
                  </Typography>
                </Box>
                <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1}>
                  {[
                    ["Jobs", "Apply to verified roles"],
                    ["Courses", "Build practical skill paths"],
                    ["Events", "Meet builders and teams"],
                    ["Posts", "Publish proof of work"],
                  ].map(([title, copy]) => (
                    <Box key={title} sx={{ borderRadius: "8px", p: 1.2, background: "rgba(255,255,255,0.035)", border: `1px solid ${appColors.divider}` }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 800, color: appColors.textPrimary }}>
                        {title}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: appColors.textMuted, mt: 0.25 }}>
                        {copy}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box mt={6} display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 48, height: 1, bgcolor: appColors.primary, opacity: 0.4 }} />
                <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.15em" }}>
                  METATRON © {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          )}

          {!isDesktop && (
            <Box mt={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <Box sx={{ width: 24, height: 2, bgcolor: appColors.primary, borderRadius: 1 }} />
                <Typography sx={{ fontSize: 10, letterSpacing: "0.18em", color: appColors.primary, textTransform: "uppercase" }}>
                  Metatron Dev
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1.05, color: appColors.textPrimary }}>
                Tech gigs, courses, events, and content.
              </Typography>
              <Typography sx={{ fontSize: 13, color: appColors.textSecondary, mt: 1.5, lineHeight: 1.7 }}>
                A professional growth workspace for developers building career signal.
              </Typography>
            </Box>
          )}

          {/* ── Login card ── */}
          <Box flex={{ xs: 1, md: "0 0 420px" }} maxWidth={{ xs: "100%", md: 420 }}>
            <Box sx={{
              background: "rgba(255,255,255,0.045)",
              backdropFilter: "blur(30px)",
              border: `1px solid ${appColors.border}`,
              borderRadius: "8px",
              p: { xs: 3, sm: 4 },
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Inner glow */}
              <Box sx={{
                position: "absolute", top: -60, left: "50%",
                transform: "translateX(-50%)",
                width: 260, height: 160, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(20,210,190,0.12), transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Header */}
              <Box textAlign="center" mb={4} sx={{ position: "relative" }}>
                <Box sx={{
                  width: 58, height: 58, borderRadius: "8px",
                  border: `1px solid ${appColors.border}`,
                  background: "rgba(20,210,190,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 2,
                }}>
                  <Avatar src={logo} sx={{ width: 42, height: 42 }} />
                </Box>
                <Typography sx={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: 20,
                  color: appColors.textPrimary, letterSpacing: "0.02em",
                }}>
                  Access Metatron Dev
                </Typography>
                <Typography sx={{ fontSize: 12, color: appColors.textSecondary, mt: 0.5 }}>
                  Continue into your developer workspace
                </Typography>
              </Box>

              {/* Alert */}
              <Collapse in={!!message}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2, borderRadius: "10px",
                    background: "rgba(20,210,190,0.08)",
                    border: "1px solid rgba(20,210,190,0.22)",
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

              {/* Inputs */}
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Email"
                  fullWidth required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  sx={inputSx}
                />
                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Password *</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    label="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)} edge="end"
                          sx={{ color: appColors.textMuted, "&:hover": { color: appColors.primary } }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              {/* Utility links */}
              <Box display="flex" justifyContent="space-between" mt={1.2}>
                <Typography component={Link} to="/cert/verify"
                  sx={{ fontSize: 11.5, color: appColors.textMuted, textDecoration: "none", "&:hover": { color: appColors.primary } }}>
                  Verify certificate
                </Typography>
                <Typography component={Link} to="/auth/recover"
                  sx={{ fontSize: 11.5, color: appColors.textMuted, textDecoration: "none", "&:hover": { color: appColors.primary } }}>
                  Forgot password?
                </Typography>
              </Box>

              <RuleDivider label="secure login" />

              {/* Primary CTA */}
              <Button
                fullWidth variant="contained"
                disabled={isFetching}
                onClick={handleLogin}
                startIcon={isFetching ? <CircularProgress size={15} sx={{ color: "#fff" }} /> : <Lock fontSize="small" />}
                sx={{
                  py: 1.4, borderRadius: "10px",
                  fontWeight: 600, fontSize: 13.5,
                  letterSpacing: "0.04em", textTransform: "none",
                  background: "linear-gradient(135deg, #0FA88F, #14D2BE)",
                  boxShadow: `0 8px 28px ${appColors.glow}`,
                  transition: "all 0.25s",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0BBFA5, #1EE8D2)",
                    boxShadow: "0 12px 36px rgba(20,210,190,0.42)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&.Mui-disabled": { background: "rgba(255,255,255,0.06)", color: appColors.textMuted },
                }}
              >
                {isFetching ? "Signing in…" : "Continue"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl} open={openMore} onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { background: "#0D1B2A", border: `1px solid ${appColors.border}`, borderRadius: "12px", mt: 1 } }}
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
    </Box >
  );
};

export default LoginAuth;
