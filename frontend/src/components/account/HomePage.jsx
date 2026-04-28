import { Box } from "@mui/material";
import Feed from "../feed/Feed";
import Navbar from "../navbar/Navbar";
import Righbar from "../rightbar/Righbar";
import Sidebar from "../sidebar/Sidebar";

function Homepage() {
  return (
    <Box color={"text.primary"} bgcolor={"background.default"} minHeight={"100vh"}>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          maxWidth: "1680px",
          mx: "auto",
          px: { xs: 1, sm: 2, lg: 3 },
          pb: { xs: 10, md: 4 },
          display: "flex",
          flexWrap: { xs: "nowrap", sm: "wrap", md: "nowrap" },
          alignItems: "flex-start",
          gap: { sm: 2, md: 2, lg: 3 },
        }}
      >
        <Sidebar />
        <Feed />
        <Righbar />
      </Box>
    </Box>
  );
}

export default Homepage;
