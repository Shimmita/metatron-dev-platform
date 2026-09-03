import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Feed from "../feed/Feed";
import Navbar from "../navbar/Navbar";
import Righbar from "../rightbar/Righbar";
import Sidebar from "../sidebar/Sidebar";

function Homepage() {
  const location = useLocation();
  const isWorkspaceRoute = [
    "/jobs",
    "/events",
    "/courses/available",
    "/courses/instructor",
  ].some((route) => location.pathname.startsWith(route));

  useEffect(() => {
    const handleSidebarWheel = (event) => {
      if (window.innerWidth < 900 || event.ctrlKey || event.deltaY === 0) {
        return;
      }

      const activeRail = event.target?.closest?.("[data-metatron-rail='true']");
      if (!activeRail) {
        return;
      }

      const rails = Array.from(document.querySelectorAll("[data-metatron-rail='true']"));
      if (!rails.length) {
        return;
      }

      event.preventDefault();
      rails.forEach((rail) => {
        const maxScrollTop = rail.scrollHeight - rail.clientHeight;
        if (maxScrollTop <= 1) {
          return;
        }

        const nextScrollTop = Math.max(
          0,
          Math.min(maxScrollTop, rail.scrollTop + event.deltaY)
        );
        rail.scrollTop = nextScrollTop;
      });
    };

    window.addEventListener("wheel", handleSidebarWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleSidebarWheel);
    };
  }, []);

  return (
    <Box
      color={"text.primary"}
      bgcolor={"background.default"}
      minHeight={"100vh"}
      sx={{
        height: { lg: "100vh" },
        overflow: { lg: "hidden" },
        backgroundImage: (theme) =>
          theme.palette.mode === "dark"
            ? [
              "linear-gradient(90deg, rgba(32,214,199,0.03) 1px, transparent 1px)",
              "linear-gradient(rgba(32,214,199,0.03) 1px, transparent 1px)",
              "linear-gradient(135deg, rgba(32,214,199,0.12), transparent 34%, rgba(242,184,75,0.06) 72%, rgba(124,58,237,0.10))",
            ].join(",")
            : "linear-gradient(180deg, #F8FAFC 0%, #EEF7FF 100%)",
        backgroundSize: "42px 42px, 42px 42px, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <Box
        sx={{
          width: "100%",
          maxWidth: isWorkspaceRoute ? "none" : "1740px",
          mx: "auto",
          px: isWorkspaceRoute ? { xs: 0, lg: 0 } : { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
          pb: { xs: 10, lg: 4 },
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: { xs: 0, sm: 1.5, md: 2, lg: 2.5 },
          overflowX: "hidden",
          height: { lg: "calc(100vh - 56px)" },
          overflowY: { lg: "hidden" },
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
