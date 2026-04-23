import {
  HomeOutlined,
  HomeRounded,
  SchoolOutlined,
  SchoolRounded,
  TvRounded,
  TvTwoTone,
  WorkOutlineOutlined,
  WorkRounded,
} from "@mui/icons-material";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Tooltip,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  handleShowingSpeedDial,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const BottomNav = () => {
  const { isSidebarRighbar, currentMode, isTabSideBar } = useSelector(
    (state) => state.appUI
  );

  const { position } = useSelector((state) => state.currentBottomNav);

  const isDarkMode = currentMode === "dark";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ─── Navigation Handlers ─── */
  const handleReturnHome = () => {
    if (!isSidebarRighbar) dispatch(handleSidebarRightbar());
    dispatch(handleShowingSpeedDial(true));
    navigate("/");
  };

  const handleJobContent = () => {
    navigate("/jobs");
    if (isSidebarRighbar) dispatch(handleSidebarRightbar());
  };

  const handleNavigateEvents = () => {
    navigate("/events");
    if (isSidebarRighbar) dispatch(handleSidebarRightbar());
  };

  const handleOpenCourses = () => {
    navigate("/courses/available");
    if (isSidebarRighbar) dispatch(handleSidebarRightbar());
  };

  /* ─── Icon Styling ─── */
  const iconStyle = (active) => ({
    width: 26,
    height: 26,
    color: active ? "#14D2BE" : "rgba(255,255,255,0.55)",
    transition: "all 0.25s ease",
  });

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 1200,
      }}
    >
      <BottomNavigation
        value={position}
        onChange={(e, newValue) =>
          dispatch(updateCurrentBottomNav(newValue))
        }
        showLabels
        sx={{
          width: "95%",
          maxWidth: 420,
          borderRadius: "18px",
          px: 1,
          py: 0.5,

          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",

          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            transition: "all 0.25s ease",

            "&.Mui-selected": {
              color: "#14D2BE",
              transform: "translateY(-2px)",
            },
          },
        }}
      >
        {/* HOME */}
        <Tooltip
          title="Home"
          arrow
          style={{
            marginLeft:
              CustomDeviceTablet() && isTabSideBar ? "30%" : undefined,
          }}
        >
          <BottomNavigationAction
            label="Home"
            onClick={handleReturnHome}
            icon={
              position === 0 ? (
                <HomeRounded sx={iconStyle(true)} />
              ) : (
                <HomeOutlined sx={iconStyle(false)} />
              )
            }
          />
        </Tooltip>

        {/* JOBS */}
        <Tooltip title="Tech Jobs" arrow>
          <BottomNavigationAction
            label="Jobs"
            onClick={handleJobContent}
            icon={
              position === 1 ? (
                <WorkRounded sx={iconStyle(true)} />
              ) : (
                <WorkOutlineOutlined sx={iconStyle(false)} />
              )
            }
          />
        </Tooltip>

        {/* EVENTS */}
        <Tooltip title="Tech Events" arrow>
          <BottomNavigationAction
            label="Events"
            onClick={handleNavigateEvents}
            icon={
              position === 2 ? (
                <TvRounded sx={iconStyle(true)} />
              ) : (
                <TvTwoTone sx={iconStyle(false)} />
              )
            }
          />
        </Tooltip>

        {/* COURSES */}
        <Tooltip title="Tech Courses" arrow>
          <BottomNavigationAction
            label="Courses"
            onClick={handleOpenCourses}
            icon={
              position === 3 ? (
                <SchoolRounded sx={iconStyle(true)} />
              ) : (
                <SchoolOutlined sx={iconStyle(false)} />
              )
            }
          />
        </Tooltip>
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;