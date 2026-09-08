import React, { lazy, Suspense } from "react";
import {
  Avatar,
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  Typography,
  Stack,
  Fade
} from "@mui/material";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

import GuestCheck from "./components/account/GuestCheck";
import HomePageLazy from "./components/account/HomePage";
import LoginAuth from "./components/auth/LoginAuth";
import AppLogo from "./images/logo_sm.png";
import { appGradients } from "./utils/colors";
import getAppTheme from "./utils/theme";

/* LAZY LOADED MODULES */
const CertificateVerification = lazy(() => import("./components/auth/CertificateVerification"));
const RegPersonalCompletion = lazy(() => import("./components/auth/RegPersonalCompletion"));
const RecoverAuthLazy = lazy(() => import("./components/auth/RecoverAuth"));
const RegistrationAuthLazy = lazy(() => import("./components/auth/RegistrationAuth"));
const EmailVerificationAuth = lazy(() => import("./components/auth/EmailVerification"));

const App = () => {
  const { currentMode } = useSelector((state) => state.appUI);
  const theme = getAppTheme(currentMode);
  const isDarkMode = currentMode === "dark";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* ─── GLOBAL SYSTEM OVERRIDES ─── */}
      <GlobalStyles
        styles={{
          "html, body, #root": {
            height: "100%",
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            // Smooth transitions for theme switching
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
          body: {
            background: isDarkMode 
              ? theme.palette.background.default 
              : appGradients.soft,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
          "*": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          "*::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0,
          },
          "*::-webkit-scrollbar-thumb": {
            background: "transparent",
          },
          ".MuiDialog-paper, .MuiDialogContent-root, .MuiDrawer-paper, .MuiPopover-paper, .MuiMenu-paper, .MuiModal-root": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          ".MuiDialog-paper::-webkit-scrollbar, .MuiDialogContent-root::-webkit-scrollbar, .MuiDrawer-paper::-webkit-scrollbar, .MuiPopover-paper::-webkit-scrollbar, .MuiMenu-paper::-webkit-scrollbar, .MuiModal-root::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0,
          },
          "::selection": {
            backgroundColor: theme.palette.primary.main,
            color: "#080808",
          },
          ".MuiPaper-root": {
            backgroundImage: "none",
          },
          ".MuiAvatar-root": {
            boxShadow: "0 0 0 1px rgba(214,178,94,0.18)",
          },
          ".MuiIconButton-root": {
            transition: "background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease",
          },
          ".MuiIconButton-root:hover": {
            color: "#D6B25E",
            backgroundColor: "rgba(214,178,94,0.10)",
          },
          ".MuiTab-root.Mui-selected": {
            color: "#D6B25E",
          },
          ".MuiTabs-indicator": {
            backgroundColor: "#D6B25E",
          },
          ".MuiTableCell-head": {
            color: "#F8E7B0",
            fontWeight: 900,
            background: "rgba(214,178,94,0.08)",
          },
          ".MuiTableRow-root:hover": {
            backgroundColor: "rgba(214,178,94,0.055)",
          },
          ".btn-primary, .btn-info, .btn-success": {
            color: "#080808",
            background: "linear-gradient(135deg, #8B6F2A 0%, #D6B25E 55%, #FFF2C2 100%)",
            borderColor: "rgba(214,178,94,0.56)",
            boxShadow: "0 12px 30px rgba(214,178,94,0.18)",
          },
          ".btn-primary:hover, .btn-info:hover, .btn-success:hover": {
            color: "#080808",
            background: "linear-gradient(135deg, #D6B25E 0%, #FFF2C2 100%)",
            borderColor: "rgba(214,178,94,0.72)",
          },
          ".btn-outline-primary, .btn-outline-success": {
            color: "#D6B25E",
            borderColor: "rgba(214,178,94,0.44)",
          },
          ".btn-outline-primary:hover, .btn-outline-success:hover": {
            color: "#080808",
            backgroundColor: "#D6B25E",
            borderColor: "#D6B25E",
          },
          ".text-primary, .text-success": {
            color: "#D6B25E !important",
          },
          ".bg-primary, .bg-success": {
            backgroundColor: "#D6B25E !important",
            color: "#080808 !important",
          },
          ".border-primary, .border-success": {
            borderColor: "rgba(214,178,94,0.62) !important",
          },
          ".alert-success": {
            color: "#F8E7B0",
            backgroundColor: "rgba(214,178,94,0.12)",
            borderColor: "rgba(214,178,94,0.36)",
          },
          ".MuiAlert-standardSuccess, .MuiAlert-filledSuccess, .MuiAlert-outlinedSuccess": {
            color: "#F8E7B0",
            backgroundColor: "rgba(214,178,94,0.12)",
            borderColor: "rgba(214,178,94,0.36)",
          },
          ".MuiSvgIcon-colorSuccess": {
            color: "#D6B25E",
          },
        }}
      />

      <Box sx={{ minHeight: "100vh", position: "relative" }}>
        <Suspense fallback={<AppLoader isDarkMode={isDarkMode} />}>
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <GuestCheck>
                  <HomePageLazy />
                </GuestCheck>
              }
            />

            {/* Main Application Shell */}
            <Route
              path="/*"
              element={
                <GuestCheck>
                  <HomePageLazy />
                </GuestCheck>
              }
            />

            {/* Authentication & Verification Routes */}
            <Route path="/auth/login" element={<LoginAuth />} />
            <Route path="/auth/register/personal" element={<RegistrationAuthLazy />} />
            <Route path="/auth/register/personal/completion" element={<RegPersonalCompletion />} />
            <Route path="/auth/verification" element={<EmailVerificationAuth />} />
            <Route path="/auth/recover" element={<RecoverAuthLazy />} />
            <Route path="/cert/verify" element={<CertificateVerification />} />
          </Routes>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

/* ─── SYSTEM INITIALIZATION SPLASH ─── */
const AppLoader = ({ isDarkMode }) => (
  <Fade in timeout={800}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
        background: isDarkMode ? appGradients.page : appGradients.soft,
        gap: 3,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Avatar
          src={AppLogo}
          sx={{
            width: 100,
            height: 100,
            boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 42px rgba(214,178,94,0.18)",
            border: "2px solid rgba(214,178,94, 0.2)",
            p: 1,
            bgcolor: "rgba(255,255,255,0.05)"
          }}
        />
        
        <Box textAlign="center">
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: "0.5rem", 
              color: "#D6B25E",
              textTransform: "uppercase",
              textShadow: "0 0 20px rgba(214,178,94, 0.3)"
            }}
          >
            METATRON
          </Typography>
          <Typography 
            variant="overline" 
            sx={{ opacity: 0.6, letterSpacing: "0.2rem", fontWeight: 700 }}
          >
            Intelligence Platform
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 4 }}>
        <RotatingLines width="24" strokeColor="#D6B25E" strokeWidth="4" />
        <Typography 
          sx={{ 
            fontSize: 12, 
            fontWeight: 800, 
            opacity: 0.5, 
            textTransform: "uppercase",
            letterSpacing: "0.1rem"
          }}
        >
          Booting System Core...
        </Typography>
      </Stack>
    </Box>
  </Fade>
);

export default App;
