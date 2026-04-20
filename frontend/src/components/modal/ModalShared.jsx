/**
 * ModalShared.jsx
 *
 * Single source of truth for every modal in the platform.
 * Import what you need — nothing more.
 *
 * Usage
 * ------
 * import {
 *   StyledModal, HeaderBar, ModalBody,
 *   SectionCard, SectionTitle,
 *   StyledInput, StatusBanner,
 *   useModalWidth,
 * } from "./ModalShared";
 */

import { Close } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  FormHelperText,
  IconButton,
  Modal,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { appColors, appGradients } from "../../utils/colors";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Centred, blurred-backdrop modal wrapper */
export const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/** Hidden-but-accessible file input */
export const StyledInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

/** Primary-coloured top bar shared by all modals */
export const HeaderBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${appColors.surfaceDark} 100%)`
      : appGradients.primary,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 2, 1.75),
  flexWrap: "wrap",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.2)"
  }`,
}));

/** Card that wraps each logical form section */
export const SectionCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.88))"
      : "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,76,129,0.12)"
  }`,
  borderRadius: theme.shape.borderRadius + 4,
  padding: theme.spacing(2.25),
  marginBottom: theme.spacing(2),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 18px 34px rgba(0,0,0,0.18)"
      : "0 14px 30px rgba(15,76,129,0.08)",
}));

/** Pill-shaped section label */
export const SectionTitle = styled(Typography)(({ theme }) => ({
  display: "inline-block",
  marginBottom: theme.spacing(1.25),
  fontWeight: 700,
  fontSize: "0.78rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,76,129,0.08)",
  color: theme.palette.primary.main,
  padding: theme.spacing(0.55, 1.25),
  borderRadius: 999,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,76,129,0.14)"
  }`,
}));

// ─── Scrollable body ──────────────────────────────────────────────────────────

/**
 * Inner scrollable container for modal content.
 * Hides the scrollbar on all engines without losing scroll ability.
 */
export const ModalBody = styled(Box)({
  maxHeight: "74vh",
  overflowY: "auto",
  padding: "12px 14px 18px",
  // hide scrollbar — Chrome/Safari
  "&::-webkit-scrollbar": { display: "none" },
  // hide scrollbar — IE/Edge/Firefox
  msOverflowStyle: "none",
  scrollbarWidth: "none",
});

// ─── Status banner (error + loading) ─────────────────────────────────────────

/**
 * Renders an inline error alert OR a centred spinner.
 * Place this once, directly below <HeaderBar />, in every modal.
 *
 * Props
 *   errorMessage   string  — current error text (falsy = hidden)
 *   onDismiss      fn      — called when the user clicks the alert
 *   isUploading    bool    — show spinner when true and no error
 */
export const StatusBanner = ({ errorMessage, onDismiss, isUploading }) => {
  if (!errorMessage && !isUploading) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={1}
      px={2}
    >
      {errorMessage ? (
        <Collapse in={Boolean(errorMessage)} style={{ width: "100%" }}>
          <Alert
            severity="warning"
            variant="outlined"
            onClick={onDismiss}
            sx={{ borderRadius: 2, cursor: "pointer", fontSize: "0.8rem" }}
            action={
              <IconButton size="small" color="inherit" onClick={onDismiss}>
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            <FormHelperText sx={{ m: 0 }}>{errorMessage}</FormHelperText>
          </Alert>
        </Collapse>
      ) : (
        <CircularProgress size={24} thickness={4} />
      )}
    </Box>
  );
};

// ─── Standard header ──────────────────────────────────────────────────────────

/**
 * Drop-in header bar used by every modal.
 *
 * Props
 *   title        string  — primary title line (e.g. job title or "Job Upload")
 *   subtitle     string  — secondary line (e.g. organisation name)
 *   onClose      fn
 *   disableClose bool    — disable close while uploading or error is shown
 */
export const ModalHeader = ({
  title,
  subtitle,
  onClose,
  disableClose = false,
}) => {
  const theme = useTheme();

  return (
    <HeaderBar>
      {/* Brand logo */}
      <Avatar
        src={AppLogo}
        alt="logo"
        sx={{
          width: 40,
          height: 40,
          bgcolor: theme.palette.secondary.main,
          flexShrink: 0,
        }}
      />

      {/* Titles */}
      <Box flex={1} minWidth={0}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ lineHeight: 1.3, wordBreak: "break-word" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.88,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            display="block"
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Close */}
      <Tooltip title="Close" arrow>
        <span>
          {/* span wrapper keeps tooltip working even when button is disabled */}
          <IconButton
            size="small"
            onClick={onClose}
            disabled={disableClose}
            sx={{
              border: "1px solid rgba(255,255,255,0.35)",
              color: "inherit",
              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
            }}
          >
            <Close sx={{ fontSize: 14 }} />
          </IconButton>
        </span>
      </Tooltip>
    </HeaderBar>
  );
};

// ─── Outer shell ──────────────────────────────────────────────────────────────

/**
 * The white/dark card that wraps the entire modal content.
 * Handles responsive width automatically.
 *
 * Props
 *   children   ReactNode
 *   open       bool
 *   onClose    fn  (optional — backdrop click won't close; use ModalHeader)
 *   sx         object (extra sx overrides)
 */
export const ModalShell = ({ children, open, sx = {}, ...rest }) => {
  const theme = useTheme();
  const { isTabSideBar } = useSelector((s) => s.appUI);

  // Responsive width
  const width = (() => {
    if (CustomLandscapeWidest()) return "44%";
    if (CustomLandScape()) return "48%";
    if (CustomDeviceTablet() && !isTabSideBar) return "58%";
    if (CustomDeviceTablet()) return "90%";
    return "96%";
  })();

  // Sidebar offset on landscape tablet
  const marginLeft = (() => {
    if (CustomDeviceTablet() && isTabSideBar) return "36%";
    if (CustomLandScape()) return "-1%";
    if (CustomLandscapeWidest()) return "0%";
    return undefined;
  })();

  return (
    <StyledModal
      keepMounted
      open={open}
      sx={{ backdropFilter: "blur(6px)", marginLeft, ...sx }}
      {...rest}
    >
      <Box
        width={width}
        sx={{
          outline: "none",
          maxWidth: "980px",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.shape.borderRadius * 2}px`,
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 56px rgba(0,0,0,0.45)"
              : "0 20px 48px rgba(15,76,129,0.14)",
        }}
      >
        {children}
      </Box>
    </StyledModal>
  );
};
