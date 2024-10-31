import {
  Avatar,
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppLogo from "./images/logo_sm.png";


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
  // theme change
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
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
                element={
                  <AuthCheckLazy>
                    {<HomePageLazy mode={mode} setMode={setMode} />}
                  </AuthCheckLazy>
                }
              />


              <Route
                exact
                path={"/auth/login"}
                element={<LoginAuthLazy mode={mode} setMode={setMode} />}
              />
              <Route
                exact
                path={"/auth/login/business"}
                element={<LoginBusinessAuth mode={mode} setMode={setMode} />}
              />
              <Route
                exact
                path={"/auth/register/personal"}
                element={<RegistrationAuthLazy />}
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
