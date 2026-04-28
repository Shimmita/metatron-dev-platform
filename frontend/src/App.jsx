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
          "::selection": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
          },
        }}
      />

      <Box sx={{ minHeight: "100vh", position: "relative" }}>
        <Suspense fallback={<AppLoader isDarkMode={isDarkMode} />}>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LoginAuth />} />

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
        background: isDarkMode ? "#0F172A" : appGradients.soft, // Custom slate dark for loader
        gap: 3,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Avatar
          src={AppLogo}
          sx={{
            width: 100,
            height: 100,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            border: "2px solid rgba(20, 210, 190, 0.2)",
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
              color: "#14D2BE",
              textTransform: "uppercase",
              textShadow: "0 0 20px rgba(20, 210, 190, 0.3)"
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
        <RotatingLines width="24" strokeColor="#14D2BE" strokeWidth="4" />
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
