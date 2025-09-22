import { Box, Stack } from "@mui/material";
import Feed from "../feed/Feed";
import Navbar from "../navbar/Navbar";
import Righbar from "../rightbar/Righbar";
import Sidebar from "../sidebar/Sidebar";

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
