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
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${appColors.bgPanel} 100%)`
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
      : "rgba(139,111,42,0.12)"
  }`,
  borderRadius: theme.shape.borderRadius + 4,
  padding: theme.spacing(2.25),
  marginBottom: theme.spacing(1.2),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 18px 34px rgba(0,0,0,0.18)"
      : "0 14px 30px rgba(139,111,42,0.08)",
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
      : "rgba(139,111,42,0.08)",
  color: theme.palette.primary.main,
  padding: theme.spacing(0.55, 1.25),
  borderRadius: 999,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(139,111,42,0.14)"
  }`,
}));

// ─── Scrollable body ──────────────────────────────────────────────────────────

/**
 * Inner scrollable container for modal content.
 * Hides the scrollbar on all engines without losing scroll ability.
 */
export const ModalBody = styled(Box)({
  maxHeight: "min(74vh, calc(100dvh - 150px))",
  overflowY: "auto",
  padding: "14px 16px 18px",
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(148,163,184,0.28)",
    borderRadius: 999,
  },
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(148,163,184,0.28) transparent",
});

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

export const ModalWorkflowSteps = ({ steps = [], activeStep = 0 }) => {
  const theme = useTheme();
  if (!steps.length) return null;

  const completedCount = steps.filter((step, index) => step.completed ?? index < activeStep).length;
  const progress = Math.min(100, Math.max(8, (completedCount / steps.length) * 100 || ((activeStep + 1) / steps.length) * 100));

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        borderBottom: "1px solid",
        borderColor: theme.palette.mode === "dark" ? appColors.divider : "rgba(139,111,42,0.1)",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.025)"
            : "rgba(255,255,255,0.64)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mb={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          Step {Math.min(activeStep + 1, steps.length)} of {steps.length}
        </Typography>
        <Typography variant="caption" color="primary.main" fontWeight={900}>
          {completedCount}/{steps.length} ready
        </Typography>
      </Box>

      <Box
        sx={{
          height: 4,
          borderRadius: 8,
          background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(139,111,42,0.1)",
          overflow: "hidden",
          mb: 1.25,
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 8,
            background: appGradients.primary,
            transition: "width 220ms ease",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: `repeat(${Math.min(steps.length, 4)}, minmax(0, 1fr))` },
          gap: 0.75,
        }}
      >
        {steps.map((step, index) => {
          const isDone = step.completed ?? index < activeStep;
          const isActive = index === activeStep && !isDone;

          return (
            <Box
              key={step.label}
              sx={{
                borderRadius: "8px",
                border: "1px solid",
                borderColor: isActive
                  ? "rgba(214,178,94,0.44)"
                  : theme.palette.mode === "dark"
                  ? appColors.divider
                  : "rgba(139,111,42,0.1)",
                background: isActive
                  ? "rgba(214,178,94,0.1)"
                  : isDone
                  ? "rgba(214,178,94,0.08)"
                  : "transparent",
                px: 1,
                py: 0.8,
                minHeight: 58,
              }}
            >
              <Typography variant="caption" color={isActive ? "primary.main" : "text.secondary"} fontWeight={900}>
                {index + 1}. {step.label}
              </Typography>
              {step.helper && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.35 }}>
                  {step.helper}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
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
    if (CustomLandscapeWidest()) return "min(92vw, 980px)";
    if (CustomLandScape()) return "min(92vw, 940px)";
    if (CustomDeviceTablet()) return "calc(100vw - 32px)";
    return "calc(100vw - 16px)";
  })();

  // Sidebar offset on landscape tablet
  const marginLeft = (() => {
    if (CustomDeviceTablet() && isTabSideBar) return "0%";
    return undefined;
  })();

  return (
    <StyledModal
      keepMounted
      open={open}
      sx={{
        backdropFilter: "blur(8px)",
        marginLeft,
        p: { xs: 1, sm: 2 },
        "& .MuiBackdrop-root": {
          background: "rgba(3,7,18,0.72)",
          backdropFilter: "blur(10px)",
        },
        ...sx,
      }}
      {...rest}
    >
      <Box
        width={width}
        sx={{
          outline: "none",
          maxWidth: "980px",
          maxHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 32px)" },
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.mode === "dark" ? appColors.border : "rgba(139,111,42,0.14)"}`,
          borderRadius: "8px",
          overflow: "hidden",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(13,13,13,0.98), rgba(5,8,18,0.94))"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
          backdropFilter: "blur(28px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 28px 90px rgba(0,0,0,0.62)"
              : "0 24px 70px rgba(139,111,42,0.18)",
        }}
      >
        {children}
      </Box>
    </StyledModal>
  );
};
