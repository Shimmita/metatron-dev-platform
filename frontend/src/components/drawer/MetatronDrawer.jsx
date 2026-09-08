import React from "react";
import {
  AutoAwesome,
  BarChartRounded,
  CloudDoneRounded,
  DocumentScannerRounded,
  FindInPageRounded,
  HomeRounded,
  Menu,
  MyLocationRounded,
  TravelExploreRounded,
  VerifiedRounded,
  WorkRounded,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { handleShowingSpeedDial, handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";

const DRAWER_WIDTH = 240;
const HR_COLOR = "#FFD700";

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
      width: open ? DRAWER_WIDTH : 70,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.standard,
      }),
      overflowX: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
    },
  })
);

export default function GlobalDrawer({
  open,
  setOpen,
  isDrawerPane,
  textOption,
  setTextOption,
  isDarkMode,
  user,
  isGuest,
  dispatch,
  handleIsJobsGlobalResults,
  handleNavigateHiring,
}) {
  const navigate = useNavigate();

  const navItems = [
    { text: "Home", icon: <HomeRounded />, isHome: true },
    { text: "Explore Jobs", icon: <WorkRounded /> },
    { text: "AI Selection", icon: <AutoAwesome /> },
    { text: "Search Jobs", icon: <FindInPageRounded /> },
    { text: "Verified Jobs", icon: <VerifiedRounded /> },
    { text: "External Jobs", icon: <TravelExploreRounded /> },
    { text: "Nearby Jobs", icon: <MyLocationRounded /> },
    { text: "Applications", icon: <CloudDoneRounded /> },
    { text: "My Statistics", icon: <BarChartRounded /> },
    { text: "Metatron H.R", icon: <DocumentScannerRounded />, isHR: true },
  ];

  const handleNavigateHome = () => {
    dispatch(updateCurrentBottomNav(0));
    dispatch(handleSidebarRightbar(true));
    dispatch(handleShowingSpeedDial(true));
    dispatch(handleIsJobsGlobalResults(false));
    navigate("/explore");
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{
        display: { xs: "none", lg: isDrawerPane ? "block" : "none" },
        "& .MuiDrawer-paper": {
          background: isDarkMode ? "rgba(8,8,8,0.98)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      {/* ─── HUD HEADER ─── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", px: 2, height: 56 }}>
        {!open ? (
          <IconButton onClick={() => setOpen(true)}>
            <Menu sx={{ color: "primary.main" }} />
          </IconButton>
        ) : (
          <>
            <Stack>
              <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 1 }}>WELCOME </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.name?.split(" ")[0] || "Guest"}</Typography>
            </Stack>
            <IconButton onClick={() => setOpen(false)}>
              <Menu sx={{ color: "primary.main", fontSize: 20 }} />
            </IconButton>
          </>
        )}
      </Box>

      {open && <Divider sx={{ opacity: 0.1 }} />}

      {/* ─── NAVIGATION LIST ─── */}
      {open && (
      <List sx={{ px: 1, pt: 1, flex: 1 }}>
        {navItems
          .filter((item) => !isGuest || item.isHome || item.text === "Explore Jobs")
          .map((item) => {
          const isActive = textOption === item.text;
          const showItem = item.isHR ? !isGuest : true; // Only show HR if not guest

          if (!showItem) return null;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.isHome) {
                    handleNavigateHome();
                  } else if (item.isHR) {
                    handleNavigateHiring();
                  } else {
                    setTextOption(item.text);
                    dispatch(handleIsJobsGlobalResults(false));
                  }
                }}
                sx={{
                  minHeight: 44,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "rgba(214,178,94, 0.15)" : "transparent",
                  
                  // 🔥 HR UNIQUE OVERRIDE
                  ...(item.isHR && {
                    mt: 2, // Separation from standard list
                    border: `1px solid rgba(255, 215, 0, 0.2)`,
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.08)",
                      borderColor: HR_COLOR,
                      boxShadow: "0 0 10px rgba(255, 215, 0, 0.2)",
                    },
                  }),
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0, 
                  mr: open ? 2 : "auto", 
                  justifyContent: "center",
                  color: item.isHR ? HR_COLOR : (isActive ? "primary.main" : "text.secondary")
                }}>
                  <Tooltip title={!open ? item.text : ""} placement="right">
                    {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                  </Tooltip>
                </ListItemIcon>
                
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: item.isHR ? 800 : (isActive ? 700 : 500),
                      color: item.isHR ? HR_COLOR : "inherit",
                      letterSpacing: item.isHR ? "0.5px" : "normal"
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      )}
      {open && !isGuest && (
        <Box sx={{ px: 1.5, mt: "auto", mb: 2 }}>
          <Box
            sx={{
              borderRadius: "8px",
              border: "1px solid rgba(214,178,94,0.16)",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(255,255,255,0.06))"
                : "linear-gradient(135deg, rgba(214,178,94,0.08), rgba(139,111,42,0.04))",
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="primary.main" fontWeight={900}>
              CAREER OPERATIONS
            </Typography>
            <Typography variant="body2" fontWeight={900} mt={0.5}>
              Build a sharper application lane.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Move from discovery to tracked applications, then review statistics weekly.
            </Typography>
          </Box>
        </Box>
      )}
    </StyledDrawer>
  );
}
