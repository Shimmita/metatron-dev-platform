import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Fade } from "@mui/material";
import { WarningRounded, HomeRounded } from "@mui/icons-material";
import { handleSidebarRightbar, resetDefaultBottomNav } from "../../redux/AppUI";

const PageNotFound = ({ message = "The requested sector is currently unreachable." }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSidebarRighbar, currentMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  const isDarkMode = currentMode === 'dark';

  // ─── SYSTEM RECOVERY LOGIC ───
  useLayoutEffect(() => {
    // Reset UI state for a clean redirect/view
    if (user && !isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
    dispatch(resetDefaultBottomNav(true));

    /* Note: If you want an INSTANT redirect, uncomment the line below.
       Otherwise, keep the UI below for a professional error state.
    */
    // navigate("/"); 

  }, [dispatch, isSidebarRighbar, user]);

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 3
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Diagnostic Icon */}
          <Box
            sx={{
              p: 3,
              borderRadius: "50%",
              background: isDarkMode ? "rgba(255, 152, 0, 0.1)" : "rgba(255, 152, 0, 0.05)",
              border: "1px dashed #ff9800",
              animation: "pulse 2s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 0.8 },
                "50%": { transform: "scale(1.1)", opacity: 1 },
                "100%": { transform: "scale(1)", opacity: 0.8 },
              },
            }}
          >
            <WarningRounded sx={{ fontSize: 60, color: "#ff9800" }} />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 2, mb: 1 }}>
              404: Not Found
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.6, maxWidth: 400 }}>
              {message}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<HomeRounded />}
            onClick={() => navigate("/explore")}
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: 800,
              bgcolor: "#14D2BE",
              "&:hover": { bgcolor: "#0fbba8" }
            }}
          >
            Return to Base
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
};

export default PageNotFound;
