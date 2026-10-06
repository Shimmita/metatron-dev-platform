import React from "react";
import {
  HomeOutlined, HomeRounded,
  SchoolOutlined, SchoolRounded,
  TvRounded, TvTwoTone,
  WorkOutlineOutlined, WorkRounded,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleShowingSpeedDial, handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";

const BottomNav = () => {
  const { isSidebarRighbar, currentMode } = useSelector((state) => state.appUI);
  const { position } = useSelector((state) => state.currentBottomNav);

  const isDarkMode = currentMode === "dark";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavClick = (path, pos, action) => {
    dispatch(updateCurrentBottomNav(pos));
    navigate(path);
    if (action === "home") {
      if (!isSidebarRighbar) dispatch(handleSidebarRightbar());
      dispatch(handleShowingSpeedDial(true));
    } else {
      dispatch(handleShowingSpeedDial(false));
      if (isSidebarRighbar) dispatch(handleSidebarRightbar());
    }
  };

  const navItems = [
    { label: "Home", path: "/explore", pos: 0, icon: <HomeOutlined />, activeIcon: <HomeRounded />, title: "Dashboard Feed", action: "home" },
    { label: "Jobs", path: "/jobs", pos: 1, icon: <WorkOutlineOutlined />, activeIcon: <WorkRounded />, title: "Tech Jobs" },
    { label: "Courses", path: "/courses/available", pos: 3, icon: <SchoolOutlined />, activeIcon: <SchoolRounded />, title: "Tech Courses" },
    { label: "Events", path: "/events", pos: 2, icon: <TvTwoTone />, activeIcon: <TvRounded />, title: "Tech Events" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 10, lg: 16 },
        left: "50%",
        transform: "translateX(-50%)",
        width: "auto",
        zIndex: 1300,
        pointerEvents: "none",
        display: "block",
      }}
    >
      <BottomNavigation
        value={position}
        showLabels
        sx={{
          pointerEvents: "auto",
          width: { xs: "calc(100vw - 24px)", sm: 500, lg: 560 },
          maxWidth: "calc(100vw - 32px)",
          height: { xs: 66, lg: 58 },
          borderRadius: "8px",
          px: { xs: 0.75, lg: 1 },
          background: isDarkMode 
            ? "rgba(5, 5, 5, 0.9)" 
            : "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(18px) saturate(150%)",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(214,178,94,0.24)" : "rgba(148,109,31,0.2)",
          boxShadow: isDarkMode 
            ? "0 18px 46px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" 
            : "0 14px 34px rgba(139,111,42,0.16), inset 0 1px 0 rgba(255,255,255,0.82)",
          
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            flex: "1 1 0",
            padding: { xs: "6px 0", lg: "4px 0" },
            color: isDarkMode ? "rgba(255,255,255,0.58)" : "rgba(18,18,18,0.62)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "8px",

            "&:hover": {
              color: "#D6B25E",
              background: isDarkMode ? "rgba(214,178,94,0.06)" : "rgba(214,178,94,0.1)",
            },
            
            "&.Mui-selected": {
              color: "#D6B25E",
              background: isDarkMode ? "rgba(214,178,94,0.1)" : "rgba(214,178,94,0.14)",
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: "0.7rem", lg: "0.66rem" },
                fontWeight: 800,
                mt: 0.5
              },
              "& svg": {
                transform: "scale(1.1) translateY(-2px)",
                color: "#D6B25E"
              }
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: { xs: "0.65rem", lg: "0.62rem" },
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0
            }
          }
        }}
      >
        {navItems.map((item) => (
          <Tooltip key={item.label} title={item.title} arrow disableInteractive>
            <BottomNavigationAction
              value={item.pos}
              label={item.label}
              onClick={() => handleNavClick(item.path, item.pos, item.action)}
              icon={React.cloneElement(position === item.pos ? item.activeIcon : item.icon, {
                sx: { fontSize: 24, transition: "inherit" }
              })}
            />
          </Tooltip>
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
