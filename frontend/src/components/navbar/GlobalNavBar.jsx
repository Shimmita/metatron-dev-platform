import { HomeRounded, Menu, Person } from "@mui/icons-material";
import { AppBar, Avatar, Box, Button, Divider, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleIsJobsGlobalResults, handleShowingSpeedDial, handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";

// Styled AppBar for smooth transition with the sidebar
const MetatronBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: `rgba(15, 23, 42, 0.75)`, // Deep navy glass base
  backdropFilter: "blur(20px) saturate(180%)",
  borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  boxShadow: open 
    ? "none" 
    : "0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(20, 210, 190, 0.1)",
  transition: theme.transitions.create(["margin", "width", "background"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - 240px)`, // Match your drawer width
    marginLeft: `240px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function GlobalAppBar({ 
  open, 
  isDarkMode, 
  handleShowDrawerPane, 
  textOption, 
  isGuest, 
  user, 
  handleNavigateLogin, 
  handleShowDarkMode, 
  handleShowingProfileDrawer 
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    dispatch(updateCurrentBottomNav(0));
    dispatch(handleSidebarRightbar(true));
    dispatch(handleShowingSpeedDial(true));
    dispatch(handleIsJobsGlobalResults(false));
    navigate("/explore");
  };

  return (
    <MetatronBar position="fixed" open={open} elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 70,
        }}
      >
        {/* Left: Menu Trigger */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleShowDrawerPane}
            edge="start"
            sx={{ 
              mr: 2, 
              color: "primary.main",
              display: { xs: "none", lg: "inline-flex" },
              ...(open && { display: "none" }) 
            }}
          >
            <Menu />
          </IconButton>
        </Box>

        {/* Center: Branding & Sector Info */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: "0.2rem",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #FFFFFF, #14D2BE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            METATRON JOBS
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1rem",
              color: "primary.main",
              opacity: 0.8,
              mt: -0.5
            }}
          >
            {textOption || "Tech Gig Marketplace"}
          </Typography>
        </Box>

        {/* Right Actions: HUD Controls */}
        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title="Back to Home">
            <IconButton
              onClick={handleNavigateHome}
              sx={{
                border: "1px solid rgba(255,255,255,0.10)",
                color: "primary.main",
                width: 38,
                height: 38,
                "&:hover": { background: "rgba(20,210,190,0.08)" },
              }}
            >
              <HomeRounded sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          {isGuest ? (
            <Button
              variant="outlined"
              size="small"
              onClick={handleNavigateLogin}
              startIcon={<Person />}
              sx={{
                borderRadius: "8px",
                borderColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": { borderColor: "primary.main", background: "rgba(20,210,190,0.05)" }
              }}
            >
              Sign In
            </Button>
          ) : (
            <>
              <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
                  {/*  <IconButton
                  onClick={handleShowDarkMode}
                  sx={{ border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <DarkModeRounded sx={{ fontSize: 20, color: "primary.main" }} />
                </IconButton> */}
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center', opacity: 0.1 }} />

              <Tooltip title="Neural Profile">
                <IconButton onClick={handleShowingProfileDrawer} sx={{ p: 0.5 }}>
                  <Avatar 
                    src={user?.avatar} 
                    sx={{ 
                      width: 34, 
                      height: 34, 
                      border: '2px solid', 
                      borderColor: 'primary.main',
                      boxShadow: '0 0 10px rgba(20, 210, 190, 0.3)'
                    }} 
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </MetatronBar>
  );
}
