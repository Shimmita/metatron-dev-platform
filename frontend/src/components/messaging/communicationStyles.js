import { appColors, appGradients } from "../../utils/colors";

export const drawerPaperSx = (theme) => ({
  width: { xs: "100vw", sm: 420, md: 460 },
  maxWidth: "100vw",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg, rgba(5,8,18,0.98), rgba(11,18,32,0.98))"
      : "linear-gradient(180deg, rgba(248,250,252,0.98), rgba(238,247,255,0.98))",
  backdropFilter: "blur(24px)",
  borderLeft: "1px solid",
  borderColor: theme.palette.mode === "dark" ? appColors.border : "rgba(15,23,42,0.12)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "-18px 0 54px rgba(0,0,0,0.46)"
      : "-18px 0 54px rgba(15,23,42,0.16)",
  overflow: "hidden",
});

export const scrollAreaSx = {
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": { width: 5 },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(32,214,199,0.22)",
    borderRadius: 8,
  },
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(32,214,199,0.22) transparent",
};

export const panelSx = (theme) => ({
  borderRadius: "8px",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? appColors.border : "rgba(15,23,42,0.1)",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.045)"
      : "rgba(255,255,255,0.86)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 16px 42px rgba(0,0,0,0.22)"
      : "0 16px 42px rgba(15,23,42,0.08)",
});

export const notificationCardSx = (theme, tone = "default") => {
  const toneBorder = {
    default: theme.palette.mode === "dark" ? appColors.border : "rgba(15,23,42,0.1)",
    success: "rgba(34,197,94,0.26)",
    warning: "rgba(245,158,11,0.28)",
    danger: "rgba(239,68,68,0.3)",
  };

  const toneBg = {
    default: theme.palette.mode === "dark" ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.9)",
    success: theme.palette.mode === "dark" ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.07)",
    warning: theme.palette.mode === "dark" ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.07)",
    danger: theme.palette.mode === "dark" ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.07)",
  };

  return {
    borderRadius: "8px",
    px: 1.5,
    py: 1.35,
    alignItems: "flex-start",
    border: "1px solid",
    borderColor: toneBorder[tone],
    background: toneBg[tone],
    transition: "background 180ms ease, border-color 180ms ease, transform 180ms ease",
    "&:hover": {
      borderColor: "rgba(32,214,199,0.36)",
      background:
        theme.palette.mode === "dark"
          ? "rgba(32,214,199,0.075)"
          : "rgba(32,214,199,0.07)",
      transform: "translateY(-1px)",
    },
  };
};

export const avatarSx = {
  width: 42,
  height: 42,
  borderRadius: "8px",
  border: `1px solid ${appColors.border}`,
  background: appGradients.primary,
  color: "#fff",
};

export const iconButtonSx = (theme, tone = "default") => ({
  width: 30,
  height: 30,
  borderRadius: "8px",
  border: "1px solid",
  borderColor:
    tone === "danger"
      ? "rgba(239,68,68,0.24)"
      : theme.palette.mode === "dark"
      ? appColors.border
      : "rgba(15,23,42,0.12)",
  color: tone === "danger" ? appColors.error : "text.secondary",
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.72)",
  "&:hover": {
    color: tone === "danger" ? appColors.error : appColors.primary,
    borderColor: tone === "danger" ? "rgba(239,68,68,0.42)" : "rgba(32,214,199,0.4)",
    background: tone === "danger" ? "rgba(239,68,68,0.1)" : "rgba(32,214,199,0.1)",
  },
});

export const metaPillSx = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  minHeight: 24,
  px: 0.85,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? appColors.divider : "rgba(15,23,42,0.1)",
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.76)",
  color: "text.secondary",
});
