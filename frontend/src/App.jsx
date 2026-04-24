import {
  Avatar,
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  Typography
} from "@mui/material";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import GuestCheck from "./components/account/GuestCheck";
import HomePageLazy from "./components/account/HomePage";
import LoginAuth from "./components/auth/LoginAuth";
import AppLogo from "./images/logo_sm.png";
import { appGradients } from "./utils/colors";
import getAppTheme from "./utils/theme";
import { RotatingLines } from "react-loader-spinner";

/* LAZY */
const CertificateVerification = lazy(() =>
  import("./components/auth/CertificateVerification")
);
const RegPersonalCompletion = lazy(() =>
  import("./components/auth/RegPersonalCompletion")
);
const RecoverAuthLazy = lazy(() =>
  import("./components/auth/RecoverAuth")
);
const RegistrationAuthLazy = lazy(() =>
  import("./components/auth/RegistrationAuth")
);
const EmailVerificationAuth = lazy(() =>
  import("./components/auth/EmailVerification")
);

const App = () => {
  const { currentMode } = useSelector((state) => state.appUI);

  const theme = getAppTheme(currentMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* GLOBAL STYLES */}
      <GlobalStyles
        styles={{
          "html, body, #root": {
            minHeight: "100%",
            overflowX: "hidden",
          },
          body: {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : appGradients.soft,
            color: theme.palette.text.primary,
            minHeight: "100vh",
            scrollbarWidth: "none",
          },
          "*::-webkit-scrollbar": {
            display: "none",
          },
          "::selection": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
          },
        }}
      />

      {/* APP ROOT */}
      <Box minHeight="100vh">
        <Suspense fallback={<AppLoader theme={theme} />}>
          <Routes>
            <Route
              path="/*"
              element={
                <GuestCheck>
                  <HomePageLazy />
                </GuestCheck>
              }
            />

            <Route path="/auth/login" element={<LoginAuth />} />
            <Route
              path="/auth/register/personal"
              element={<RegistrationAuthLazy />}
            />
            <Route
              path="/auth/register/personal/completion"
              element={<RegPersonalCompletion />}
            />
            <Route
              path="/auth/verification"
              element={<EmailVerificationAuth />}
            />
            <Route path="/auth/recover" element={<RecoverAuthLazy />} />
            <Route path="/cert/verify" element={<CertificateVerification />} />
          </Routes>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

const AppLoader = ({ theme }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    minHeight="100vh"
    sx={{
      background:
        theme.palette.mode === "dark"
          ? theme.palette.background.default
          : appGradients.soft,
      gap: 2,
    }}
  >
    <Avatar
      src={AppLogo}
      sx={{
        width: 90,
        height: 90,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    />

    <Typography fontWeight={700} color="primary" variant="h4">
      METATRON
    </Typography>

    <Typography fontSize={13} color="text.secondary">
      Initializing Platform...
    </Typography>

    <RotatingLines width={40} strokeColor="#14D2BE" />
  </Box>
);

export default App;