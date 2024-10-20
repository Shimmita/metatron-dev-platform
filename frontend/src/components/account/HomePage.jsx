import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import { lazy, useState } from "react";
import Navbar from "../navbar/Navbar";
const Righbar = lazy(() => import("../rightbar/Righbar"));
const Sidebar = lazy(() => import("../sidebar/Sidebar"));
const Feed = lazy(() => import("../feed/Feed"));

function Homepage() {
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar setMode={setMode} mode={mode} />
        <Stack direction={"row"} justifyContent={"space-around"}>
          <Sidebar setMode={setMode} mode={mode} />
          <Feed />
          <Righbar />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default Homepage;
