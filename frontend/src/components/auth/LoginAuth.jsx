import {
  Close,
  Lock,
  PersonAddRounded,
  TravelExploreRounded,
  Visibility,
  VisibilityOff
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
import { appColors } from "../../utils/colors";
import OptionsMoreLogin from "./OptionsMoreLogin";

const ModalPolicyTerms = lazy(() => import("./ModalPolicyTerms"));
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

/* ─── Ambient orb ─────────────────────────────────────────────────── */
const Orb = ({ top, left, right, bottom, size, color, delay = "0s" }) => (
  <Box sx={{
    position: "absolute", top, left, right, bottom,
    width: size, height: size, borderRadius: "50%",
    background: color, filter: "blur(90px)", opacity: 0.45,
    animation: `orbPulse 9s ease-in-out ${delay} infinite`,
    pointerEvents: "none",
    "@keyframes orbPulse": {
      "0%,100%": { transform: "scale(1)", opacity: 0.45 },
      "50%": { transform: "scale(1.15)", opacity: 0.65 },
    },
  }} />
);

/* ─── Dot grid ───────────────────────────────────────────────────── */
const DotGrid = () => (
  <Box sx={{
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(20,210,190,0.1) 1px, transparent 1px)",
    backgroundSize: "28px 28px", pointerEvents: "none",
  }} />
);

/* ─── Stat counter ───────────────────────────────────────────────── */
const StatCount = ({ value, label }) => (
  <Box sx={{
    px: 2.5, py: 1.5, borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${appColors.border}`,
    minWidth: 90, textAlign: "center",
  }}>
    <Typography sx={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 22, fontWeight: 700,
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
    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: appColors.primary, flexShrink: 0 }} />
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

  const { currentMode } = useSelector((s) => s.appUI);
  const { isGuest } = useSelector((s) => s.currentUser);
  const isDarkMode = currentMode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const openMore = Boolean(anchorEl);

  useLayoutEffect(() => { if (!isGuest) navigate("/explore"); }, [isGuest, navigate]);

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
      sx={{ background: appColors.bgDark, position: "relative", overflow: "hidden" }}
    >
      <Orb top="-8%" left="-6%" size={480} color="radial-gradient(circle,rgba(20,210,190,0.32),transparent)" delay="0s" />
      <Orb bottom="-6%" right="-4%" size={380} color="radial-gradient(circle,rgba(15,76,129,0.45),transparent)" delay="4s" />
      <Orb top="35%" left="42%" size={260} color="radial-gradient(circle,rgba(200,169,110,0.1),transparent)" delay="2s" />
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
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative", zIndex: 1, px: { xs: 2, md: 6 }, py: { xs: 5, md: 6 } }}
      >
        <Box display="flex" width="100%" maxWidth={1080} alignItems="center" gap={{ xs: 0, md: 10 }}>

          {/* ── Left panel ── */}
          {isDesktop && (
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box sx={{ width: 28, height: 2, bgcolor: appColors.primary, borderRadius: 1 }} />
                <Typography sx={{ fontSize: 10, letterSpacing: "0.2em", color: appColors.primary, textTransform: "uppercase" }}>
                  Platform Access
                </Typography>
              </Box>

              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: { md: 42, lg: 50 }, fontWeight: 700,
                lineHeight: 1.1, mb: 2, color: appColors.textPrimary,
              }}>
                Build Your Tech Career
                <Box component="span" sx={{ display: "block", color: appColors.primary }}>
                  With AI Precision.
                </Box>
              </Typography>

              <Typography sx={{ fontSize: 14, color: appColors.textSecondary, maxWidth: 380, lineHeight: 1.8, mb: 4.5 }}>
                Metatron connects developers to verified opportunities, tracks growth, and enhances
                your career using AI-driven insights.
              </Typography>

              {["AI Job Matching & Recommendations", "Verified Tech Opportunities", "Career Growth Tracking", "Developer Intelligence Ecosystem"].map((f) => (
                <Feature key={f} label={f} />
              ))}

              <Box display="flex" gap={1.5} mt={5}>
                <StatCount value="10K+" label="Developers" />
                <StatCount value="5K+" label="Jobs Posted" />
                <StatCount value="98%" label="Verified" />
              </Box>

              <Box mt={6} display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 48, height: 1, bgcolor: appColors.primary, opacity: 0.4 }} />
                <Typography sx={{ fontSize: 10, color: appColors.textMuted, letterSpacing: "0.15em" }}>
                  METATRON © {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* ── Login card ── */}
          <Box flex={{ xs: 1, md: "0 0 420px" }} maxWidth={{ xs: "100%", md: 420 }}>
            <Box sx={{
              background: "rgba(255,255,255,0.045)",
              backdropFilter: "blur(30px)",
              border: `1px solid ${appColors.border}`,
              borderRadius: "20px",
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
                  width: 58, height: 58, borderRadius: "14px",
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
                  Welcome back
                </Typography>
                <Typography sx={{ fontSize: 12, color: appColors.textSecondary, mt: 0.5 }}>
                  Sign in to your Metatron account
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