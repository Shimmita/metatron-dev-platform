import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import "@fontsource/poppins";
import { Avatar, Box, Typography } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import process from "process";

import App from "./App";
import { persistor, store } from "./redux/AppStore";
import reportWebVitals from "./reportWebVitals";
import AppLogo from "./images/logo_sm.png";

window.process = process;

/* 🔥 BOOT LOADER */
const BootLoader = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    minHeight="100vh"
    sx={{
      background:
        "radial-gradient(circle at 50% 20%, rgba(214,178,94,0.22), transparent 34%), linear-gradient(180deg, #050505 0%, #0B0B0B 58%, #111111 100%)",
      gap: 2,
    }}
  >
    <Avatar
      src={AppLogo}
      sx={{
        width: 90,
        height: 90,
        boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 42px rgba(214,178,94,0.18)",
        border: "1px solid rgba(214,178,94,0.28)",
        bgcolor: "rgba(255,255,255,0.05)",
      }}
    />

    <Typography fontWeight={900} color="primary" variant="h4" sx={{ letterSpacing: 4 }}>
      METATRON
    </Typography>

    <Typography fontSize={13} color="rgba(255,253,247,0.68)">
      Preparing your workspace...
    </Typography>

    <RotatingLines width={40} strokeColor="#D6B25E" />
  </Box>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<BootLoader />} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
