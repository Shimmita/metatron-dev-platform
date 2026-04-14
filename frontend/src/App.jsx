import {
  Avatar,
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  Typography
} from "@mui/material";
import { lazy, Suspense } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import HomePageLazy from "./components/account/HomePage";
import LoginAuth from "./components/auth/LoginAuth";
import AppLogo from "./images/logo_sm.png";
import GuestCheck from "./components/account/GuestCheck";
import getAppTheme from "./utils/theme";
import { appGradients } from "./utils/colors";
const CertificateVerification=lazy(()=>import("./components/auth/CertificateVerification")) ;
const RegPersonalCompletion = lazy(() =>
  import("./components/auth/RegPersonalCompletion")
);
const RecoverAuthLazy = lazy(() => import("./components/auth/RecoverAuth"));
const RegistrationAuthLazy = lazy(() =>
  import("./components/auth/RegistrationAuth")
);
const EmailVerificationAuth=lazy(()=>import("./components/auth/EmailVerification"))

const App = () => {
  // global dark mode state from redux
  const { currentMode } = useSelector((state) => state.appUI);
  const theme = getAppTheme(currentMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html, body, #root": {
            minHeight: "100%",
            overflowX: "hidden",
          },
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minHeight: "100vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          "*": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          "*::-webkit-scrollbar": {
            width: 0,
            height: 0,
            display: "none",
          },
          "::selection": {
            backgroundColor: theme.palette.primary.light,
            color: "#ffffff",
          },
        }}
      />

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}>
        {/* error boundary to catch errors from lazily loaded components */}
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : appGradients.soft,
                color: theme.palette.text.primary,
                p: 2,
              }}
            >
              
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={AppLogo}
                  alt=""
                />

                <Typography
                  color={"primary"}
                  gutterBottom
                  variant="h4"
                  fontWeight={"bold"}
                >
                  METATRON
                </Typography>

                <Box 
                display={'flex'}
                justifyContent={'center'}
                >
                <Typography 
                variant="caption" 
                fontWeight={'bold'}
                color={'primary'} >
                Ultimate Tech Platform
                </Typography>
                </Box>

                  <Box 
                  display={"flex"} 
                  justifyContent={"center"}>
                  <BallTriangle width={50}/>
                </Box>

              </Box>
          }
        >
          
            <Routes>
              <Route
                exact
                path="/*"
                element={
                  <GuestCheck>
                    <HomePageLazy/>
                    </GuestCheck>
                }
              />
              
              {/* login route */}
              <Route
                exact
                path="/auth/login"
                element={<LoginAuth/>}
              />
              <Route
                exact
                path={"/auth/register/personal"}
                element={<RegistrationAuthLazy />}
              />
              {/* completion of reg for a user/ac signing with auth provider */}
              <Route
                exact
                path={"/auth/register/personal/completion"}
                element={<RegPersonalCompletion />}
              />

            {/* email verification */}
            <Route
            exact
            path={"/auth/verification"}
            element={<EmailVerificationAuth/>}
            />

            {/* account recovery, forgot password route */}
              <Route
                exact
                path={"/auth/recover"}
                element={<RecoverAuthLazy />}
              />

              {/* cert verification */}
              <Route
                exact
                path="/cert/verify"
                element={
                  <CertificateVerification/>
                }
              />
            </Routes>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

export default App;
