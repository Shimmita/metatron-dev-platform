import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { appColors } from "./colors";

const createAppTheme = (mode = "light") => {
  const palette = {
    mode,
    primary: {
      main: appColors.brandBlue,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: appColors.brandAccent,
      contrastText: "#FFFFFF",
    },
    success: {
      main: appColors.success,
    },
    warning: {
      main: appColors.warning,
    },
    info: {
      main: appColors.info,
    },
    background: {
      default: mode === "dark" ? appColors.surfaceDark : appColors.backgroundLight,
      paper: mode === "dark" ? "#0F172A" : appColors.surface,
    },
    text: {
      primary: mode === "dark" ? "#F8FAFC" : appColors.textPrimary,
      secondary: mode === "dark" ? "#CBD5E1" : appColors.textSecondary,
    },
    divider: appColors.divider,
  };

  let theme = createTheme({
    palette,
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: ["Poppins", "Segoe UI", "sans-serif"].join(","),
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
      h1: {
        fontWeight: 700,
        letterSpacing: "-0.05em",
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      body1: {
        color: palette.text.primary,
      },
      body2: {
        color: palette.text.secondary,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            minHeight: "100vh",
            fontFamily: ["Poppins", "Segoe UI", "sans-serif"].join(","),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,76,129,0.18)"}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,76,129,0.12)"}`,
            boxShadow: mode === "dark" ? "0 18px 45px rgba(0,0,0,0.16)" : "0 20px 40px rgba(15,76,129,0.08)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            borderRadius: 20,
            boxShadow: mode === "dark" ? "0 22px 48px rgba(0,0,0,0.4)" : "0 25px 60px rgba(15,76,129,0.12)",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: "20px 24px",
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "24px",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: "16px 24px 24px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: "10px 20px",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 10,
            backgroundColor: appColors.brandBlue,
            color: "#FFFFFF",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: "hidden",
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};

export default createAppTheme;
