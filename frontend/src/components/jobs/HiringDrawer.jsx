import {
    Add,
    ArrowBackRounded,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    DocumentScannerRounded,
    HelpRounded,
    HighlightOffOutlined,
    Menu,
    SettingsRounded,
    TipsAndUpdatesRounded,
    WorkRounded
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
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import { appColors } from "../../utils/colors";

const DRAWER_WIDTH = 260;

// Metatron Styled Drawer for smooth expansion
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
            background: theme.palette.mode === 'dark' ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderRight: `1px solid ${theme.palette.divider}`,
        },
    })
);

export default function HiringDrawer({
    open,
    setOpen,
    isDrawerPane,
    setIsDrawerPane,
    isDarkMode,
    user,
    textOption,
    setTextOption,
    dispatch,
    handleIsJobsGlobalResults,
    handleNavigateJobSeeker
}) {
    const theme = useTheme();

    // Navigation Map for cleaner logic
    const hiringItems = [
        { text: "My Posted Jobs", icon: <WorkRounded sx={{ fontSize: 20 }} /> },
        { text: "Upload New Job", icon: <Add sx={{ fontSize: 22 }} /> },
        { text: "Jobs Assessment", icon: <DocumentScannerRounded sx={{ fontSize: 20 }} /> },
        { text: "Jobs Management", icon: <SettingsRounded sx={{ fontSize: 20 }} /> },
        { text: "About H.R Page", icon: <HelpRounded sx={{ fontSize: 20 }} /> },
        { text: "Examine H.R Tips", icon: <TipsAndUpdatesRounded sx={{ fontSize: 20 }} /> },
        { text: "Back To Jobs", icon: <ArrowBackRounded sx={{ fontSize: 20 }} /> },
    ];

    return (
        <StyledDrawer variant="permanent" open={open} sx={{ display: isDrawerPane ? "block" : "none" }}>
            {/* ─── HUD HEADER ─── */}
            <Box
                sx={{
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "space-between" : "center",
                    px: 2,
                    background: isDarkMode ? "rgba(20, 210, 190, 0.05)" : "rgba(25, 118, 210, 0.05)",
                    borderBottom: `1px solid ${isDarkMode ? "rgba(20, 210, 190, 0.2)" : "rgba(0,0,0,0.1)"}`,
                }}
            >
                {!open ? (
                    <IconButton onClick={() => setOpen(true)}>
                        <Menu sx={{ color: "primary.main" }} />
                    </IconButton>
                ) : (
                    <>
                        <Stack>
                            <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 1 }}>
                                HIRING MANAGER
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: isDarkMode ? "white" : "black" }}>
                                {user?.name?.substring(0, 13)}
                            </Typography>
                        </Stack>
                        <IconButton onClick={() => setOpen(false)}>
                            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </>
                )}
            </Box>

            {/* ─── ACTION LIST ─── */}
            <List sx={{ px: 1, py: 2 }}>
                {!open && (
                    <ListItemButton
                        onClick={() => setIsDrawerPane(false)}
                        sx={{ justifyContent: "center", borderRadius: "10px", mb: 2 }}
                    >
                        <Tooltip title="Close Sector" placement="right">
                            <HighlightOffOutlined sx={{ color: "error.main" }} />
                        </Tooltip>
                    </ListItemButton>
                )}

                {hiringItems.map((item) => {
                    const isActive = textOption === item.text;
                    const isBackToJobs = item.text === "Back To Jobs";

                    return (
                        <React.Fragment key={item.text}>
                            {/* Divider with metallic spacing */}
                            {isBackToJobs && (
                                <Divider
                                    sx={{
                                        my: 1,
                                        borderColor: appColors.divider,
                                        opacity: 0.6,
                                    }}
                                />
                            )}

                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => {
                                        setTextOption(item.text);
                                        if (isBackToJobs) {
                                            handleNavigateJobSeeker();
                                        } else {
                                            dispatch(handleIsJobsGlobalResults(false));
                                        }
                                    }}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                        borderRadius: "10px",
                                        backgroundColor: isActive ? `${appColors.primary}1F` : "transparent", // 12% opacity
                                        border: isActive
                                            ? `1px solid ${appColors.primary}4D`
                                            : "1px solid transparent",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? `${appColors.primary}1F`
                                                : `${appColors.primary}14`, // 8% hover
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: isActive ? "primary.main" : appColors.textSecondary,
                                        }}
                                    >
                                        <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                                            {item.icon}
                                        </Tooltip>
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            "& .MuiTypography-root": {
                                                fontSize: "0.85rem",
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? "primary.main" : appColors.textPrimary,
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </React.Fragment>
                    );
                })}

            </List>

        </StyledDrawer>
    );
}