import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Flag from "./images/KE.png";
import AppLogo from "./images/logo_sm.png";
const HomePageLazy = lazy(() => import("./components/account/HomePage"));
const RecoverAuthLay = lazy(() => import("./components/auth/RecoverAuth"));
const RegistrationAuthLazy = lazy(() =>
  import("./components/auth/RegistrationAuth")
);
const AuthCheckLazy = lazy(() => import("./components/account/AuthCheck"));

const LoginAuthLazy = lazy(() => import("./components/auth/LoginAuth"));

const App = () => {
  return (
    <React.Fragment>
      <Suspense
        fallback={
          <Box color={"text.primary"} alignItems="center" height="90vh">
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={"column"}
              height={"90vh"}
            >
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={AppLogo}
                alt="logo"
              />

              <Typography
                color={"primary"}
                gutterBottom
                variant="body1"
                fontWeight={"bold"}
              >
                METATRON
              </Typography>
              <Box mt={1} display={"flex"} justifyContent={"center"}>
                <CircularProgress size={"2rem"} />
              </Box>
            </Box>

            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <Avatar sx={{ width: 40, height: 40 }} src={Flag} alt="flag" />
            </Box>
          </Box>
        }
      >
        <Router>
          <Routes>
            <Route
              exact
              path="/*"
              element={<AuthCheckLazy>{<HomePageLazy />}</AuthCheckLazy>}
            />
            <Route exact path={"/auth/login"} element={<LoginAuthLazy />} />
            <Route
              exact
              path={"/auth/register"}
              element={<RegistrationAuthLazy />}
            />
            <Route exact path={"/auth/recover"} element={<RecoverAuthLay />} />
          </Routes>
        </Router>
      </Suspense>
    </React.Fragment>
  );
};

export default App;
