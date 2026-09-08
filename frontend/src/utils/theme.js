import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { appColors, appGradients } from "./colors";

const createAppTheme = (mode = "dark") => {
  const isDark = mode === "dark";

  const palette = {
    mode,
    primary: {
      main: appColors.primary,
      dark: appColors.primaryDark,
      light: appColors.primarySoft,
      contrastText: "#080808",
    },
    secondary: {
      main: appColors.secondary,
      contrastText: "#080808",
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
      primary: isDark ? appColors.textPrimary : "#171717",
      secondary: isDark ? appColors.textSecondary : "#3A3326",
    },
    divider: appColors.divider,
  };

  let theme = createTheme({
    palette,
    shape: {
      borderRadius: 8,
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
              ? appGradients.page
              : appGradients.soft,
            color: palette.text.primary,
            fontSize: "0.875rem", // Ensures the root body inherits the smaller scale
          },
        },
      },

      /* ─── AppBar (Glass Nav) ─── */
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? "rgba(5,5,5,0.88)" : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(24px) saturate(140%)",
            borderBottom: `1px solid ${appColors.border}`,
            boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.42)" : "0 10px 32px rgba(20,15,5,0.08)",
          },
        },
      },

      /* ─── Cards (Glassmorphism) ─── */
      MuiCard: {
        styleOverrides: {
          root: {
            background: isDark
              ? "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(214,178,94,0.045))"
              : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(247,243,234,0.9))",
            backdropFilter: "blur(26px) saturate(150%)",
            border: `1px solid ${appColors.border}`,
            borderRadius: 8,
            boxShadow: isDark ? "0 22px 58px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 14px 38px rgba(20,15,5,0.08)",
          },
        },
      },

      /* ─── Buttons (Metatron Style) ─── */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px", // Tightened padding for smaller font
            fontWeight: 800,
            letterSpacing: 0,
          },
          contained: {
            background: appGradients.primary,
            boxShadow: `0 8px 25px ${appColors.glow}`,
            color: "#080808",
            "&:hover": {
              boxShadow: `0 12px 35px ${appColors.glow}`,
              filter: "brightness(1.05)",
            },
          },
          outlined: {
            borderColor: appColors.border,
            color: isDark ? appColors.textPrimary : "#171717",
            background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.72)",
            "&:hover": {
              borderColor: appColors.primary,
              background: isDark ? "rgba(214,178,94,0.09)" : "rgba(214,178,94,0.12)",
            },
          },
        },
      },

      /* ─── Inputs ─── */
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            background: isDark ? appColors.bgInput : "rgba(255,255,255,0.82)",
            borderRadius: 12,
            fontSize: "0.85rem", // Smaller input text
            "& fieldset": { borderColor: appColors.border },
            "&:hover fieldset": { borderColor: appColors.primary },
            "&.Mui-focused fieldset": { borderColor: appColors.primary },
            "&.Mui-focused": { boxShadow: `0 0 0 3px ${appColors.glow}` },
          },
          input: {
            color: isDark ? "#FFFFFF" : "#171717",
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
            background: isDark
              ? "linear-gradient(180deg, #0B0B0B 0%, #050505 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F7F3EA 100%)",
            backgroundColor: isDark ? "#0B0B0B" : "#FFFFFF",
            backdropFilter: "none",
            border: `1px solid ${appColors.border}`,
            boxShadow: isDark
              ? "0 24px 70px rgba(0,0,0,0.72), 0 0 0 1px rgba(214,178,94,0.08)"
              : "0 22px 55px rgba(20,15,5,0.16)",
            marginTop: "8px",
            borderRadius: 8,
            overflow: "hidden",
            color: isDark ? appColors.textPrimary : "#171717",
          },
        },
      },

      MuiPopover: {
        styleOverrides: {
          paper: {
            background: isDark
              ? "linear-gradient(180deg, #0B0B0B 0%, #050505 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F7F3EA 100%)",
            backgroundColor: isDark ? "#0B0B0B" : "#FFFFFF",
            backdropFilter: "none",
            border: `1px solid ${appColors.border}`,
            boxShadow: isDark
              ? "0 24px 70px rgba(0,0,0,0.72), 0 0 0 1px rgba(214,178,94,0.08)"
              : "0 22px 55px rgba(20,15,5,0.16)",
            borderRadius: 8,
            color: isDark ? appColors.textPrimary : "#171717",
          },
        },
      },

      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            background: isDark
              ? "linear-gradient(180deg, #0B0B0B 0%, #050505 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F7F3EA 100%)",
            backgroundColor: isDark ? "#0B0B0B" : "#FFFFFF",
            border: `1px solid ${appColors.border}`,
            borderRadius: 8,
            boxShadow: isDark
              ? "0 24px 70px rgba(0,0,0,0.72)"
              : "0 22px 55px rgba(20,15,5,0.16)",
            color: isDark ? appColors.textPrimary : "#171717",
            overflow: "hidden",
          },
          listbox: {
            padding: 6,
            background: "transparent",
            maxHeight: 280,
            "& .MuiAutocomplete-option": {
              borderRadius: 8,
              margin: "3px 0",
              minHeight: 38,
              fontSize: "0.825rem",
              color: isDark ? appColors.textSecondary : "#3A3326",
              '&[aria-selected="true"]': {
                background: "rgba(214,178,94,0.20)",
                color: isDark ? appColors.textPrimary : "#171717",
              },
              "&.Mui-focused": {
                background: "rgba(214,178,94,0.14)",
                color: isDark ? appColors.textPrimary : "#171717",
              },
            },
          },
          noOptions: {
            color: isDark ? appColors.textSecondary : "#3A3326",
            background: isDark ? "#0B0B0B" : "#FFFFFF",
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
            color: isDark ? "#F7F3EA" : "#171717",
            backgroundColor: "transparent",

            "&:hover": {
              background: "rgba(214,178,94,0.16)",
              color: isDark ? appColors.primarySoft : appColors.primaryDark,
            },
            "&.Mui-selected": {
              background: "rgba(214,178,94,0.22)",
              color: isDark ? appColors.textPrimary : "#171717",
              "&:hover": {
                background: "rgba(214,178,94,0.28)",
              },
            },
          },
        },
      },

      /* ─── Tooltip ─── */
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: "#080808",
            border: `1px solid ${appColors.border}`,
            color: appColors.textPrimary,
            fontSize: "0.7rem", // Smaller tooltips
          },
        },
      },

      /* ─── Dialogs, Alerts & Modal Surfaces ─── */
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "rgba(0,0,0,0.78)" : "rgba(12,10,5,0.34)",
            backdropFilter: "blur(12px) saturate(120%)",
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            background: isDark
              ? "linear-gradient(180deg, rgba(13,13,13,0.98), rgba(5,5,5,0.94))"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,243,234,0.96))",
            backdropFilter: "blur(28px)",
            border: `1px solid ${isDark ? appColors.border : "rgba(139,111,42,0.18)"}`,
            borderRadius: 8,
            boxShadow: isDark
              ? "0 28px 90px rgba(0,0,0,0.68), 0 0 0 1px rgba(214,178,94,0.08)"
              : "0 24px 70px rgba(20,15,5,0.16)",
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
            background: isDark ? "rgba(12,12,12,0.88)" : "rgba(255,255,255,0.94)",
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

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 800,
            borderColor: appColors.border,
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.82)",
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isDark
              ? "linear-gradient(180deg, rgba(5,5,5,0.98), rgba(17,17,17,0.96))"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,243,234,0.96))",
            borderColor: appColors.border,
          },
        },
      },

      MuiSpeedDial: {
        styleOverrides: {
          fab: {
            background: appGradients.primary,
            color: "#080808",
            boxShadow: `0 18px 46px ${appColors.glow}`,
            "&:hover": {
              background: appGradients.accent,
            },
          },
        },
      },

      MuiFab: {
        styleOverrides: {
          root: {
            background: appGradients.primary,
            color: "#080808",
            boxShadow: `0 18px 46px ${appColors.glow}`,
            "&:hover": {
              background: appGradients.accent,
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default createAppTheme;
