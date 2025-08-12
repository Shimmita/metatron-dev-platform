import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import process from "process";
import App from "./App";
import { persistor, store } from "./redux/AppStore"; // Import the modified store and persistor
import reportWebVitals from "./reportWebVitals";
import "@fontsource/poppins"; 
import { Box, FormHelperText } from "@mui/material";


window.process = process;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/*  PersistGate to handle rehydration */}
      <PersistGate loading={
        <Box 
        width={'100%'}
        justifyContent={'center'}
        display={'flex'}>
        <FormHelperText>
          loading...
        </FormHelperText>
        </Box>
      } persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
