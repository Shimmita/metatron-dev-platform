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
        "linear-gradient(180deg, rgba(15,76,129,0.95), rgba(35,181,221,0.15), transparent)",
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
      Preparing your workspace...
    </Typography>

    <RotatingLines width={40} strokeColor="#14D2BE" />
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