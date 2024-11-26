import {
  Avatar,
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AppLogo from "./images/logo_sm.png";
const RegPersonalCompletion = lazy(() =>
  import("./components/auth/RegPersonalCompletion")
);
const LoginBusinessAuth = lazy(() =>
  import("./components/auth/LoginBusinessAuth")
);
const RegistrationBusinessLazy = lazy(() =>
  import("./components/auth/RegistrationBusiness")
);
const HomePageLazy = lazy(() => import("./components/account/HomePage"));
const RecoverAuthLazy = lazy(() => import("./components/auth/RecoverAuth"));
const RegistrationAuthLazy = lazy(() =>
  import("./components/auth/RegistrationAuth")
);
const AuthCheckLazy = lazy(() => import("./components/account/AuthCheck"));

const LoginAuthLazy = lazy(() => import("./components/auth/LoginAuth"));

const App = () => {
  // global dark mode state from redux
  const { currentMode } = useSelector((state) => state.appUI);

  const darkTheme = createTheme({
    palette: {
      mode: currentMode,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        {/* error boundary to catch errors from lazily loaded components */}
        <Suspense
          fallback={
            <Box color={"text.primary"} alignItems="center">
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
                gap={2}
                height={"100vh"}
              >
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={AppLogo}
                  alt="logo"
                />

                <Typography
                  color={"primary"}
                  gutterBottom
                  variant="h5"
                  fontWeight={"bold"}
                >
                  METATRON
                </Typography>
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress size={"2rem"} />
                </Box>
              </Box>
            </Box>
          }
        >
          <>
            <Routes>
              <Route
                exact
                path="/*"
                element={<AuthCheckLazy>{<HomePageLazy />}</AuthCheckLazy>}
              />

              <Route exact path={"/auth/login"} element={<LoginAuthLazy />} />
              <Route
                exact
                path={"/auth/login/business"}
                element={<LoginBusinessAuth />}
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

              <Route
                exact
                path={"/auth/register/business"}
                element={<RegistrationBusinessLazy />}
              />

              <Route
                exact
                path={"/auth/recover"}
                element={<RecoverAuthLazy />}
              />
            </Routes>
          </>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

export default App;
