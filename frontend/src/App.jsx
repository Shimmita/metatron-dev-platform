import {
  Avatar,
  Box,
  createTheme,
  ThemeProvider,
  Typography
} from "@mui/material";
import { lazy, Suspense } from "react";
import { Vortex } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AppLogo from "./images/logo_sm.png";
const CertificateVerification=lazy(()=>import("./components/auth/CertificateVerification")) ;
const RegPersonalCompletion = lazy(() =>
  import("./components/auth/RegPersonalCompletion")
);


const HomePageLazy = lazy(() => import("./components/account/HomePage"));
const RecoverAuthLazy = lazy(() => import("./components/auth/RecoverAuth"));
const RegistrationAuthLazy = lazy(() =>
  import("./components/auth/RegistrationAuth")
);
const AuthCheckLazy = lazy(() => import("./components/account/AuthCheck"));
const EmailVerificationAuth=lazy(()=>import("./components/auth/EmailVerification"))

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
      <Box
      bgcolor={currentMode==='dark' ? "background.default" :"#E6F7FF"} 
      color={"text.primary"}>
        {/* error boundary to catch errors from lazily loaded components */}
        <Suspense
          fallback={
            <Box color={"text.primary"} alignItems="center">
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
                height={"100vh"}
              >
              
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={AppLogo}
                  alt=""
                />

                <Typography
                  color={"primary"}
                  gutterBottom
                  variant="h5"
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
                color={'primary'} >
                Ultimate Tech Platform
                </Typography>
                </Box>

                 <Box 
                 display={"flex"} 
                 justifyContent={"center"}>
                  <Vortex width={50}/>
                </Box>

               
              </Box>
            </Box>
          }
        >
          
            <Routes>
              <Route
                exact
                path="/*"
                element={
                  <AuthCheckLazy>
                    <HomePageLazy />
                  </AuthCheckLazy>
                }
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
