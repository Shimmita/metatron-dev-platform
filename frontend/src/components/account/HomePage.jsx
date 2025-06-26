import { Box, Stack } from "@mui/material";
import { lazy } from "react";
import Navbar from "../navbar/Navbar";
const Righbar = lazy(() => import("../rightbar/Righbar"));
const Sidebar = lazy(() => import("../sidebar/Sidebar"));
const Feed = lazy(() => import("../feed/Feed"));

function Homepage() {

  return (
    <Box color={"text.primary"}>
      <Navbar />
      <Stack
      direction={"row"}
      justifyContent={"space-around"}
      >
        <Sidebar />
        <Feed />
        <Righbar />
      </Stack>
    </Box>
  );
}

export default Homepage;
