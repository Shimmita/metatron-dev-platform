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
      // ─── Base Scaling ───
      fontSize: 13, // Global base reduction (MUI default is 14)
      htmlFontSize: 16,
      fontFamily: ["Inter", "Poppins", "Segoe UI", "sans-serif"].join(","),

      // ─── Refined Variant Scaling ───
      h1: { fontSize: "2.125rem", fontWeight: 700, letterSpacing: "-0.04em" },
      h2: { fontSize: "1.75rem", fontWeight: 700 },
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
            color: palette.text.primary,
            fontSize: "0.875rem", // Ensures the root body inherits the smaller scale
          },
        },
      },

      /* ─── AppBar (Glass Nav) ─── */
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? "rgba(6,13,24,0.8)" : "rgba(255,255,255,0.8)",
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
            boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.05)",
          },
        },
      },

      /* ─── Buttons (Metatron Style) ─── */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "8px 16px", // Tightened padding for smaller font
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

      /* ─── Menu Items ─── */
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "0.825rem",
            px: 1.5,
            py: 0.8,
            borderRadius: "8px",
            mx: 0.5,
            my: 0.2,
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(20,210,190,0.08)",
            },
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
    },
  });

  return responsiveFontSizes(theme);
};

export default createAppTheme;