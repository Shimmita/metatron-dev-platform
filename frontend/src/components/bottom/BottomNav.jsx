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
      if (isSidebarRighbar) dispatch(handleSidebarRightbar());
    }
  };

  const navItems = [
    { label: "Home", path: "/explore", icon: <HomeOutlined />, activeIcon: <HomeRounded />, title: "Home", action: "home" },
    { label: "Jobs", path: "/jobs", icon: <WorkOutlineOutlined />, activeIcon: <WorkRounded />, title: "Tech Jobs" },
    { label: "Events", path: "/events", icon: <TvTwoTone />, activeIcon: <TvRounded />, title: "Tech Events" },
    { label: "Courses", path: "/courses/available", icon: <SchoolOutlined />, activeIcon: <SchoolRounded />, title: "Tech Courses" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20, // Raised slightly for a better "floating" feel
        left: "50%",
        transform: "translateX(-50%)", // Perfect centering logic
        width: "auto",
        zIndex: 1300,
        pointerEvents: "none", // Ensures it doesn't block clicks in the gap
      }}
    >
      <BottomNavigation
        value={position}
        showLabels
        sx={{
          pointerEvents: "auto", // Restore clicks for the nav itself
          width: "90vw",
          maxWidth: 400,
          height: 65,
          borderRadius: "24px",
          px: 1,
          background: isDarkMode 
            ? "rgba(15, 23, 42, 0.85)" 
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          boxShadow: isDarkMode 
            ? "0 10px 30px rgba(0,0,0,0.5)" 
            : "0 10px 30px rgba(15, 76, 129, 0.15)",
          
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 0",
            color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            
            "&.Mui-selected": {
              color: "#14D2BE",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.7rem",
                fontWeight: 800,
                mt: 0.5
              },
              "& svg": {
                transform: "scale(1.1) translateY(-2px)",
                color: "#14D2BE"
              }
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.65rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05rem"
            }
          }
        }}
      >
        {navItems.map((item, index) => (
          <Tooltip key={index} title={item.title} arrow disableInteractive>
            <BottomNavigationAction
              label={item.label}
              onClick={() => handleNavClick(item.path, index, item.action)}
              icon={React.cloneElement(position === index ? item.activeIcon : item.icon, {
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
