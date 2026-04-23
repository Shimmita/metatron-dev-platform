import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { appColors } from "./colors";

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
      borderRadius: 14,
    },

    typography: {
      fontFamily: ["Inter", "Poppins", "Segoe UI", "sans-serif"].join(","),

      h1: { fontWeight: 700, letterSpacing: "-0.04em" },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      /* ─── Global Body ─── */
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
          },
        },
      },

      /* ─── AppBar (Glass Nav) ─── */
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "rgba(6,13,24,0.8)",
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
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          },
        },
      },

      /* ─── Dialogs (Modal consistency) ─── */
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: appColors.bgCard,
            backdropFilter: "blur(30px)",
            border: `1px solid ${appColors.border}`,
            borderRadius: 20,
          },
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            background: "transparent",
            color: appColors.textPrimary,
            fontWeight: 600,
          },
        },
      },

      /* ─── Buttons (Metatron Style) ─── */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 20px",
          },

          contained: {
            background: `linear-gradient(135deg, #0FA88F, #14D2BE)`,
            boxShadow: `0 8px 25px ${appColors.glow}`,

            "&:hover": {
              boxShadow: `0 12px 35px ${appColors.glow}`,
            },
          },
        },
      },

      /* ─── Inputs (GLOBAL FIX 🔥) ─── */
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            background: appColors.bgInput,
            borderRadius: 12,

            "& fieldset": {
              borderColor: appColors.border,
            },

            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.3)",
            },

            "&.Mui-focused fieldset": {
              borderColor: appColors.primary,
            },

            "&.Mui-focused": {
              boxShadow: `0 0 0 3px ${appColors.glow}`,
            },
          },

          input: {
            color: "#FFFFFF",
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: appColors.textMuted,
          },
        },
      },

      /* ─── Alerts ─── */
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            background: "rgba(20,210,190,0.1)",
            border: `1px solid ${appColors.primary}`,
            color: appColors.textPrimary,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides
          : {
          px: 1.5,
          py: 1,
          borderRadius: "10px",
          mx: 0.5,
          my: 0.3,
          transition: "all 0.2s ease",

          "&:hover": {
            background: "rgba(20,210,190,0.08)",
          },
        },
      },
      

        /* ─── Tooltip ─── */
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              background: "#0D1B2A",
              border: `1px solid ${appColors.border}`,
            },
          },
        },
      },
    });

  return responsiveFontSizes(theme);
};

export default createAppTheme;