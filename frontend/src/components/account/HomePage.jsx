import { Box, Stack } from "@mui/material";
import { lazy } from "react";
import Navbar from "../navbar/Navbar";
import { useOutletContext } from "react-router-dom";
const Righbar = lazy(() => import("../rightbar/Righbar"));
const Sidebar = lazy(() => import("../sidebar/Sidebar"));
const Feed = lazy(() => import("../feed/Feed"));

function Homepage({ mode, setMode }) {
  const testing = useOutletContext();
  console.log(testing);
  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <Navbar setMode={setMode} mode={mode} />
      <Stack direction={"row"} justifyContent={"space-around"}>
        <Sidebar setMode={setMode} mode={mode} />
        <Feed />
        <Righbar />
      </Stack>
    </Box>
  );
}

export default Homepage;
