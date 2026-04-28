import React from "react";
import {
  AutoAwesome,
  BarChartRounded,
  CloudDoneRounded,
  DocumentScannerRounded,
  FindInPageRounded,
  HighlightOffOutlined,
  Menu,
  MyLocationRounded,
  TravelExploreRounded,
  VerifiedRounded,
  WorkRounded,
  ChevronLeft as ChevronLeftIcon,
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
    },
  })
);

export default function GlobalDrawer({
  open,
  setOpen,
  isDrawerPane,
  setIsDrawerPane,
  textOption,
  setTextOption,
  isDarkMode,
  user,
  isGuest,
  dispatch,
  handleIsJobsGlobalResults,
  handleNavigateHiring,
}) {
  const navItems = [
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

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{
        display: isDrawerPane ? "block" : "none",
        "& .MuiDrawer-paper": {
          background: isDarkMode ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      {/* ─── HUD HEADER ─── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", px: 2, height: 70 }}>
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
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* ─── NAVIGATION LIST ─── */}
      <List sx={{ px: 1, pt: 1 }}>
        {/* Exit Logic */}
        {!open && (
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton onClick={() => setIsDrawerPane(false)} sx={{ justifyContent: "center", borderRadius: "10px" }}>
              <Tooltip title="Exit Sector" placement="right">
                <HighlightOffOutlined sx={{ color: "error.main" }} />
              </Tooltip>
            </ListItemButton>
          </ListItem>
        )}

        {navItems
          .filter((item) => !isGuest || item.text === "Explore Jobs")
          .map((item) => {
          const isActive = textOption === item.text;
          const showItem = item.isHR ? !isGuest : true; // Only show HR if not guest

          if (!showItem) return null;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.isHR) {
                    handleNavigateHiring();
                  } else {
                    setTextOption(item.text);
                    dispatch(handleIsJobsGlobalResults(false));
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "rgba(20, 210, 190, 0.15)" : "transparent",
                  
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
    </StyledDrawer>
  );
}
