import {
  Close,
  Lock,
  PersonAddRounded,
  TravelExploreRounded,
  Visibility,
  VisibilityOff,
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
import { resetDarkMode } from "../../redux/AppUI";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import OptionsMoreLogin from "./OptionsMoreLogin";

const ModalPolicyTerms = lazy(() => import("./ModalPolicyTerms"));
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

/* ─── Design tokens (unchanged) ─── */
const C = {
  bg: "#060D18",
  bgCard: "rgba(255,255,255,0.045)",
  bgInput: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.09)",
  borderFocus: "rgba(20,210,190,0.55)",
  navBg: "rgba(6,13,24,0.82)",
  teal: "#14D2BE",
  tealDim: "rgba(20,210,190,0.18)",
  tealGlow: "rgba(20,210,190,0.28)",
  gold: "#C8A96E",
  textPri: "#F0F4FA",
  textSec: "rgba(240,244,250,0.55)",
  textHint: "rgba(240,244,250,0.35)",
};

/* ─── Ambient orb (unchanged) ─── */
const Orb = ({ top, left, size, color, delay = "0s" }) => (
  <Box
    sx={{
      position: "absolute",
      top, left,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(90px)",
      opacity: 0.45,
      animation: `orbPulse 8s ease-in-out ${delay} infinite`,
      pointerEvents: "none",
      "@keyframes orbPulse": {
        "0%, 100%": { transform: "scale(1)", opacity: 0.45 },
        "50%": { transform: "scale(1.15)", opacity: 0.65 },
      },
    }}
  />
);

/* ─── Dot-grid backdrop (unchanged) ─── */
const DotGrid = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(circle, rgba(20,210,190,0.12) 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
      pointerEvents: "none",
    }}
  />
);

/* ─── Thin divider with label (unchanged) ─── */
const Divider = ({ label }) => (
  <Box display="flex" alignItems="center" gap={1.5} my={2.5}>
    <Box flex={1} height="1px" bgcolor={C.border} />
    <Typography sx={{ fontSize: 11, color: C.textHint, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Box flex={1} height="1px" bgcolor={C.border} />
  </Box>
);

/* ─── Shared input sx (unchanged) ─── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    transition: "all 0.25s ease",

    "& input": {
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "0.02em",
    },

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.15)",
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#14D2BE",
      borderWidth: "1px",
    },

    "&.Mui-focused": {
      background: "rgba(20,210,190,0.06)",
      boxShadow: "0 0 0 3px rgba(20,210,190,0.25)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: 500,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#14D2BE",
  },

  "& .MuiInputLabel-root.MuiFormLabel-filled": {
    color: "rgba(255,255,255,0.8)",
  },

  "& input::placeholder": {
    color: "rgba(255,255,255,0.45)",
    opacity: 1,
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 100px rgba(255,255,255,0.08) inset`,
    WebkitTextFillColor: "#FFFFFF",
  },
};

/* ─── Main component ─── */
const LoginAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { currentMode } = useSelector((s) => s.appUI);
  const { isGuest } = useSelector((s) => s.currentUser);

  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("example123");
  const [showPassword, setShowPassword] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [focused, setFocused] = useState(null);

  const openMore = Boolean(anchorEl);

  useLayoutEffect(() => { if (!isGuest) navigate("/explore"); }, [isGuest, navigate]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const toggleDarkMode = () => dispatch(resetDarkMode());

  const handleLogin = async () => {
    setIsFetching(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signin/personal`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data?.email_verified) {
        dispatch(updateUserCurrentUserRedux(res.data));
        navigate("/explore");
      } else {
        navigate(`/auth/verification?${res.data}`);
      }
    } catch (err) {
      if (err?.code === "ERR_NETWORK") { setMessage("Server unreachable"); return; }
      if (err?.response?.data === "verification code sent to your email") setIsVerify(true);
      setMessage(err?.response?.data || "Login failed");
    } finally {
      setIsFetching(false);
    }
  };

  const handleVerify = () => navigate(`/auth/verification?${email}`);

  /* ── Render ── */
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{ background: C.bg, position: "relative", overflow: "hidden" }}
    >
      {/* Ambient orbs */}
      <Orb top="-10%" left="-8%" size={520} color="radial-gradient(circle, rgba(20,210,190,0.35), transparent)" delay="0s" />
      <Orb top="55%" left="70%" size={400} color="radial-gradient(circle, rgba(15,76,129,0.5), transparent)" delay="3s" />
      <Orb top="30%" left="40%" size={280} color="radial-gradient(circle, rgba(200,169,110,0.12), transparent)" delay="5s" />
      <DotGrid />

      {/* ── Navbar ── */}
      <Box
        component="nav"
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 3, md: 5 },
          py: 2,
          background: C.navBg,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: "pointer" }} onClick={() => navigate("/explore")}>
          <Avatar src={logo} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "0.04em",
                color: C.textPri,
                lineHeight: 1,
              }}
            >
              METATRON
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: "0.22em", color: C.teal, textTransform: "uppercase" }}>
              Developer Platform
            </Typography>
          </Box>
        </Box>

        {/* Nav actions */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title="Register">
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: C.textSec, "&:hover": { color: C.teal } }}
            >
              <PersonAddRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ xs: 2, md: 6 }}
        py={5}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box display="flex" width="100%" maxWidth={1080} alignItems="center" gap={{ xs: 0, md: 10 }}>

          {/* Left panel – refined value proposition */}
          {isDesktop && (
            <Box flex={1} color={C.textPri}>
              {/* Eyebrow */}
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box sx={{ width: 28, height: 2, bgcolor: C.teal, borderRadius: 1 }} />
                <Typography sx={{ fontSize: 11, letterSpacing: "0.2em", color: C.teal, textTransform: "uppercase" }}>
                  Welcome to Metatron
                </Typography>
              </Box>

              {/* Headline – stronger language */}
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: { md: 46, lg: 54 },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 2,
                  color: C.textPri,
                }}
              >
                Your All-in-One
                <Box component="span" sx={{ display: "block", color: C.teal }}>
                  Tech Ecosystem.
                </Box>
              </Typography>

              <Typography sx={{ fontSize: 15, color: C.textSec, maxWidth: 360, lineHeight: 1.75, mb: 5 }}>
                Job board, events hub, and learning platform — built for developers, engineers, and IT professionals.
              </Typography>

              {/* Feature pills – turned into benefits */}
              {[
                { label: "Connect with a global developer community", dot: C.teal },
                { label: "Access and apply to top IT jobs", dot: C.teal },
                { label: "AI‑powered career insights & tools", dot: C.gold },
                { label: "Build your portfolio & get certified", dot: C.teal },
              ].map(({ label, dot }) => (
                <Box key={label} display="flex" alignItems="center" gap={1.5} mb={1.5}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: dot, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, color: C.textSec }}>{label}</Typography>
                </Box>
              ))}

              {/* Bottom accent line */}
              <Box mt={6} display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 48, height: 1, bgcolor: C.teal, opacity: 0.4 }} />
                <Typography sx={{ fontSize: 11, color: C.textHint, letterSpacing: "0.15em" }}>
                  METATRON © {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* ── Login card – refined headings ── */}
          <Box flex={{ xs: 1, md: "0 0 420px" }} maxWidth={{ xs: "100%", md: 420 }}>
            <Box
              sx={{
                background: C.bgCard,
                backdropFilter: "blur(30px)",
                border: `1px solid ${C.border}`,
                borderRadius: "20px",
                p: { xs: 3.5, md: 4.5 },
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Card inner top-left glow */}
              <Box
                sx={{
                  position: "absolute",
                  top: -60, left: -60,
                  width: 200, height: 200,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${C.tealDim}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Card header – clearer call to action */}
              <Box textAlign="center" mb={3.5} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: 64, height: 64,
                    borderRadius: "16px",
                    border: `1px solid ${C.border}`,
                    background: "rgba(20,210,190,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 2,
                  }}
                >
                  <Avatar src={logo} sx={{ width: 44, height: 44 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontWeight: 700, fontSize: 22,
                    color: C.textPri, letterSpacing: "0.02em",
                  }}
                >
                  Sign In to Metatron
                </Typography>
                <Typography sx={{ fontSize: 13, color: C.textSec, mt: 0.5 }}>
                  Access your developer dashboard and all platform features.
                </Typography>
              </Box>

              {/* Alert */}
              <Collapse in={!!message}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2, borderRadius: "10px",
                    background: "rgba(20,210,190,0.1)",
                    border: `1px solid rgba(20,210,190,0.25)`,
                    color: C.textPri,
                    "& .MuiAlert-icon": { color: C.teal },
                  }}
                  action={
                    <IconButton size="small" onClick={() => setMessage("")} sx={{ color: C.textSec }}>
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Collapse>

              {/* Form */}
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAddRounded sx={{ color: "rgba(255,255,255,0.5)" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Password *</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock sx={{ color: "rgba(255,255,255,0.5)" }} />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              {/* Utility links */}
              <Box display="flex" justifyContent="space-between" mt={1.5} mb={0.5}>
                <Typography
                  component={Link}
                  to="/cert/verify"
                  sx={{ fontSize: 12, color: C.textHint, textDecoration: "none", "&:hover": { color: C.teal } }}
                >
                  Validate Certification
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/recover"
                  sx={{ fontSize: 12, color: C.textHint, textDecoration: "none", "&:hover": { color: C.teal } }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Divider label="secure authentication" />

              {/* CTA */}
              <Button
                fullWidth
                variant="contained"
                disabled={isFetching}
                onClick={isVerify ? handleVerify : handleLogin}
                startIcon={isFetching ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Lock fontSize="small" />}
                sx={{
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "none",
                  background: `linear-gradient(135deg, #0FA88F 0%, ${C.teal} 100%)`,
                  boxShadow: `0 8px 28px ${C.tealGlow}`,
                  transition: "all 0.25s",
                  "&:hover": {
                    background: `linear-gradient(135deg, #0BBFA5 0%, #1EE8D2 100%)`,
                    boxShadow: `0 12px 36px rgba(20,210,190,0.42)`,
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&.Mui-disabled": { background: "rgba(255,255,255,0.08)", color: C.textHint },
                }}
              >
                {isVerify ? "Verify Email" : "Sign In"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/explore")}
                startIcon={<TravelExploreRounded fontSize="small" />}
                sx={{
                  mt: 1.25,
                  py: 1.35,
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none",
                  color: C.textPri,
                  borderColor: "rgba(20,210,190,0.38)",
                  background: "rgba(20,210,190,0.04)",
                  "&:hover": {
                    borderColor: C.teal,
                    background: "rgba(20,210,190,0.1)",
                  },
                }}
              >
                Explore as Guest
              </Button>

              {/* Register link */}
              <Typography textAlign="center" mt={2.5} sx={{ fontSize: 13, color: C.textHint }}>
                No account?{" "}
                <Box
                  component="span"
                  sx={{ color: C.teal, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  Create one
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Menu & modals */}
      <Menu
        anchorEl={anchorEl}
        open={openMore}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { background: "#0D1B2A", border: `1px solid ${C.border}`, borderRadius: "12px", mt: 1 },
        }}
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