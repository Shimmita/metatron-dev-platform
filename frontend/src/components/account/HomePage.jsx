import { Box } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Feed from "../feed/Feed";
import Navbar from "../navbar/Navbar";
import Righbar from "../rightbar/Righbar";
import Sidebar from "../sidebar/Sidebar";

function Homepage() {
  const location = useLocation();
  const { isPostDetailed } = useSelector((state) => state.appUI);
  const isWorkspaceRoute = [
    "/jobs",
    "/events",
    "/courses/available",
    "/courses/instructor",
  ].some((route) => location.pathname.startsWith(route));
  const isFocusedPostRoute = location.pathname.startsWith("/posts/details");
  const isFocusedPostShell = !isWorkspaceRoute && (isPostDetailed || isFocusedPostRoute);

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
              "linear-gradient(90deg, rgba(214,178,94,0.03) 1px, transparent 1px)",
              "linear-gradient(rgba(214,178,94,0.03) 1px, transparent 1px)",
              "linear-gradient(135deg, rgba(214,178,94,0.12), transparent 34%, rgba(242,184,75,0.06) 72%, rgba(191,164,106,0.10))",
            ].join(",")
            : "linear-gradient(180deg, #F7F3EA 0%, #F7F3EA 100%)",
        backgroundSize: "42px 42px, 42px 42px, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    >
      {!isWorkspaceRoute && !isFocusedPostShell && <Navbar />}
      <Box
        sx={{
          width: "100%",
          maxWidth: isWorkspaceRoute
            ? "none"
            : isFocusedPostShell
              ? { xs: "100%", lg: "1160px", xl: "1240px" }
              : { xs: "100%", lg: "1128px", xl: "1188px" },
          mx: "auto",
          px: isWorkspaceRoute
            ? { xs: 0, lg: 0 }
            : isFocusedPostShell
              ? { xs: 0.75, sm: 1.25, lg: 2 }
              : { xs: 1, sm: 1.5, md: 2, lg: 1.5, xl: 0 },
          pb: isFocusedPostShell ? { xs: 1, lg: 2 } : { xs: 10, lg: 4 },
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: isFocusedPostShell ? 0 : { xs: 0, sm: 1.5, md: 2, lg: 2 },
          overflowX: "hidden",
          height: { lg: isWorkspaceRoute || isFocusedPostShell ? "100vh" : "calc(100vh - 56px)" },
          overflowY: { lg: "hidden" },
        }}
      >
        {!isFocusedPostShell && <Sidebar />}
        <Feed />
        {!isFocusedPostShell && <Righbar />}
      </Box>
    </Box>
  );
}

export default Homepage;
