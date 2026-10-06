const severityStyles = {
  success: {
    color: "#F8E7B0",
    bg: "rgba(214,178,94,0.13)",
    border: "rgba(214,178,94,0.4)",
    shadow: "rgba(214,178,94,0.2)",
  },
  info: {
    color: "#D6B25E",
    bg: "rgba(214,178,94,0.12)",
    border: "rgba(214,178,94,0.36)",
    shadow: "rgba(214,178,94,0.18)",
  },
  warning: {
    color: "#F0B93A",
    bg: "rgba(240,185,58,0.13)",
    border: "rgba(240,185,58,0.38)",
    shadow: "rgba(240,185,58,0.18)",
  },
  error: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.38)",
    shadow: "rgba(239,68,68,0.18)",
  },
};

export const snackbarSx = {
  zIndex: 10000,
  px: { xs: 1.5, sm: 2 },
  "& .MuiSnackbar-root": {
    maxWidth: "100%",
  },
};

export const snackbarAlertSx = (severity = "info") => {
  const tone = severityStyles[severity] || severityStyles.info;

  return {
    width: { xs: "calc(100vw - 24px)", sm: 420 },
    maxWidth: "calc(100vw - 24px)",
    minWidth: 0,
    borderRadius: "8px",
    px: 1.5,
    py: 1,
    color: "text.primary",
    fontWeight: 800,
    background: (theme) =>
      theme.palette.mode === "dark"
        ? `linear-gradient(135deg, rgba(5,5,5,0.96), ${tone.bg})`
        : `linear-gradient(135deg, rgba(255,255,255,0.98), ${tone.bg})`,
    border: "1px solid",
    borderColor: tone.border,
    backdropFilter: "blur(20px)",
    boxShadow: `0 18px 48px rgba(0,0,0,0.36), 0 0 24px ${tone.shadow}`,
    alignItems: "center",
    "& .MuiAlert-icon": {
      color: tone.color,
      opacity: 1,
      mr: 1.25,
    },
    "& .MuiAlert-message": {
      minWidth: 0,
      py: 0.25,
      lineHeight: 1.5,
      fontSize: "0.78rem",
      letterSpacing: 0,
      wordBreak: "break-word",
    },
    "& .MuiAlert-action": {
      alignItems: "center",
      pt: 0,
      pl: 1,
      mr: -0.5,
    },
    "& .MuiIconButton-root": {
      width: 28,
      height: 28,
    },
  };
};
