import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { appColors, appGradients } from "./colors";

const createAppTheme = (mode = "dark") => {
  const isDark = mode === "dark";

  const palette = {
    mode,
    primary: {
      main: appColors.primary,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: appColors.secondary,
    },
    success: { main: appColors.success },
    warning: { main: appColors.warning },
    error: { main: appColors.error },
    info: { main: appColors.info },
    background: {
      default: isDark ? appColors.bgDark : appColors.surfaceAlt,
      paper: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
    },
    text: {
      primary: isDark ? appColors.textPrimary : "#0F172A",
      secondary: isDark ? appColors.textSecondary : "#475569",
    },
    divider: appColors.divider,
  };

  let theme = createTheme({
    palette,
    shape: {
      borderRadius: 10,
    },
    typography: {
      // ─── Base Scaling ───
      fontSize: 13, // Global base reduction (MUI default is 14)
      htmlFontSize: 16,
      fontFamily: ["Inter", "Poppins", "Segoe UI", "sans-serif"].join(","),

      // ─── Refined Variant Scaling ───
      h1: { fontSize: "2.125rem", fontWeight: 800, letterSpacing: "0" },
      h2: { fontSize: "1.75rem", fontWeight: 800, letterSpacing: "0" },
      h3: { fontSize: "1.5rem", fontWeight: 600 },
      h4: { fontSize: "1.25rem", fontWeight: 600 },
      h5: { fontSize: "1.1rem", fontWeight: 600 },
      h6: { fontSize: "0.95rem", fontWeight: 600 },

      subtitle1: { fontSize: "0.9rem", lineHeight: 1.5 },
      subtitle2: { fontSize: "0.8rem", fontWeight: 600 },
      body1: { fontSize: "0.875rem", lineHeight: 1.6 }, // Standard text now slightly smaller
      body2: { fontSize: "0.775rem", lineHeight: 1.6 }, // Caption-like text

      button: {
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.825rem",
      },
      caption: {
        fontSize: "0.7rem",
        letterSpacing: "0.02em",
      },
      overline: {
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
      }
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            backgroundImage: isDark
              ? "linear-gradient(180deg, #050812 0%, #08111F 48%, #0B1220 100%)"
              : "linear-gradient(180deg, #F8FAFC 0%, #EEF7FF 100%)",
            color: palette.text.primary,
            fontSize: "0.875rem", // Ensures the root body inherits the smaller scale
          },
        },
      },

      /* ─── AppBar (Glass Nav) ─── */
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? "rgba(5,8,18,0.86)" : "rgba(255,255,255,0.86)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${appColors.border}`,
          },
        },
      },

      /* ─── Cards (Glassmorphism) ─── */
      MuiCard: {
        styleOverrides: {
          root: {
            background: appColors.bgCard,
            backdropFilter: "blur(25px)",
            border: `1px solid ${appColors.border}`,
            borderRadius: 8,
            boxShadow: isDark ? "0 18px 44px rgba(0,0,0,0.46)" : "0 10px 30px rgba(0,0,0,0.05)",
          },
        },
      },

      /* ─── Buttons (Metatron Style) ─── */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px", // Tightened padding for smaller font
          },
          contained: {
            background: appGradients.primary,
            boxShadow: `0 8px 25px ${appColors.glow}`,
            "&:hover": {
              boxShadow: `0 12px 35px ${appColors.glow}`,
            },
          },
        },
      },

      /* ─── Inputs ─── */
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            background: appColors.bgInput,
            borderRadius: 12,
            fontSize: "0.85rem", // Smaller input text
            "& fieldset": { borderColor: appColors.border },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
            "&.Mui-focused fieldset": { borderColor: appColors.primary },
            "&.Mui-focused": { boxShadow: `0 0 0 3px ${appColors.glow}` },
          },
          input: {
            color: isDark ? "#FFFFFF" : "#0F172A",
            padding: "10px 14px",
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: appColors.textMuted,
            fontSize: "0.85rem",
          },
        },
      },

      /* ─── Menus & Popovers (Readability Fix) ─── */
      MuiMenu: {
        styleOverrides: {
          paper: {
            // Increase opacity slightly (from 0.04 to 0.12 or higher) to block noise
            background: isDark
              ? "rgba(15, 23, 42, 0.85)" // Solid enough to block background text
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)", // Heavy blur to diffuse underlying noise
            border: `1px solid ${appColors.border}`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            marginTop: "8px",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "0.825rem",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "8px",
            margin: "4px 6px",
            transition: "all 0.2s ease",
            // Ensure text is high contrast
            color: isDark ? "#F8FAFC" : "#0F172A",

            "&:hover": {
              background: "rgba(20, 210, 190, 0.15)", // Metatron turquoise tint
              color: "#14D2BE",
            },
            "&.Mui-selected": {
              background: "rgba(20, 210, 190, 0.2)",
              "&:hover": {
                background: "rgba(20, 210, 190, 0.25)",
              },
            },
          },
        },
      },

      /* ─── Tooltip ─── */
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: "#0D1B2A",
            border: `1px solid ${appColors.border}`,
            fontSize: "0.7rem", // Smaller tooltips
          },
        },
      },

      /* ─── Dialogs, Alerts & Modal Surfaces ─── */
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "rgba(3,7,18,0.72)" : "rgba(15,23,42,0.22)",
            backdropFilter: "blur(10px)",
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            background: isDark
              ? "linear-gradient(180deg, rgba(11,18,32,0.98), rgba(5,8,18,0.94))"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
            backdropFilter: "blur(28px)",
            border: `1px solid ${isDark ? appColors.border : "rgba(15,76,129,0.14)"}`,
            borderRadius: 8,
            boxShadow: isDark
              ? "0 28px 90px rgba(0,0,0,0.62)"
              : "0 24px 70px rgba(15,76,129,0.18)",
            overflow: "hidden",
            maxHeight: "calc(100dvh - 24px)",
            margin: 12,
          },
        },
      },

      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "18px",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(148,163,184,0.28)",
              borderRadius: 999,
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(148,163,184,0.28) transparent",
          },
        },
      },

      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: "14px 18px 18px",
            gap: 8,
            borderTop: `1px solid ${appColors.divider}`,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${appColors.border}`,
            background: isDark ? "rgba(15,23,42,0.86)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(18px)",
            alignItems: "center",
          },
          message: {
            fontSize: "0.78rem",
            lineHeight: 1.5,
          },
          action: {
            alignItems: "center",
            paddingTop: 0,
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default createAppTheme;
