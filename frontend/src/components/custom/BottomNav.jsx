import { CachedRounded, Home, SchoolRounded, Work } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleShowingSpeedDial,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const BottomNav = () => {
  // redux states
  const { isSidebarRighbar } = useSelector((state) => state.appUI);

  const { position } = useSelector((state) => state.currentBottomNav);
  const { isPostSearch } = useSelector((state) => state.currentPosts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // return home or default card page
  const handleReturnHome = () => {
    // update the sidebar to be shown always
    // always default sidebar and right-bar showing for larger screens
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // show speed dial if ain't visible
    dispatch(handleShowingSpeedDial(true));

    // return home
    navigate("/");
  };

  // return job page
  const handleJobContent = () => {
    navigate("/jobs");

    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  };

  // return learning page
  const handleOpenCourses = () => {
    navigate("/courses/paid");
  };

  // accessing the redux state values
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels={false}
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        value={position}
        onChange={(event, newValue) => {
          // update the redux state value
          dispatch(updateCurrentBottomNav(newValue));
        }}
      >
        <Tooltip title="home" arrow>
          <BottomNavigationAction
            label="Home"
            icon={
              isPostSearch ? (
                <CachedRounded color="info" sx={{ width: 34, height: 34 }} />
              ) : (
                <Home sx={{ width: 34, height: 34 }} />
              )
            }
            style={{
              marginLeft:
                CustomDeviceTablet() && isTabSideBar ? "30%" : undefined,
            }}
            onClick={handleReturnHome}
          />
        </Tooltip>

        <Tooltip title="Jobs" arrow>
          <BottomNavigationAction
            onClick={handleJobContent}
            label="Jobs"
            icon={<Work sx={{ width: 30, height: 30 }} />}
          />
        </Tooltip>

        <Tooltip title="courses" arrow>
          <BottomNavigationAction
            onClick={handleOpenCourses}
            label="Courses"
            icon={<SchoolRounded sx={{ width: 34, height: 34 }} />}
          />
        </Tooltip>
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
