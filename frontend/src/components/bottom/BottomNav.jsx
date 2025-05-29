import { CachedRounded, Home, SchoolRounded, VideoCameraBackRounded, Work } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
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
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomLandScape from "../utilities/CustomLandscape";

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
  
  // larger devices, beyond tablet
  const isBeyondTablets=CustomLandScape() || CustomLandscapeWidest()

  return (
    <Paper sx={{ position: "fixed",
     bottom: 0,
      left: 0,
       right: 0,
         }}>
      <BottomNavigation
        showLabels={true}
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
        <Tooltip title="Home" arrow  
        style={{
              marginLeft:
                CustomDeviceTablet() && isTabSideBar && "30%",
            }}>
          <BottomNavigationAction
            label="Home"
            icon={
              isPostSearch ? (
                <CachedRounded color="info" sx={{ width: 30, height: 30 }} />
              ) : (
                <Home sx={{ width: 32, height: 32}} />
              )
            }
            onClick={handleReturnHome}
          />
        </Tooltip>

        <Tooltip title="Tech Jobs" arrow>
          <BottomNavigationAction
            onClick={handleJobContent}
            label="Jobs"
            icon={<Work sx={{ width: 29, height: 29 }} />}
          />
        </Tooltip>

        
        {/* online courses */}
        <Tooltip title="Tech Courses" arrow>
          <BottomNavigationAction
            onClick={handleOpenCourses}
            label="Courses"
            icon={<SchoolRounded sx={{ width: 32, height: 32 }} />}
          />
        </Tooltip>

         {/* tech events */}
         <Tooltip 
         title="Tech Events"
          arrow
          sx={{ marginRight:isBeyondTablets && position===0 && 12 }}>
          <BottomNavigationAction
            onClick={handleJobContent}
            label="Events"
            icon={<VideoCameraBackRounded sx={{ width: 28, height: 28 }} />}
          />
        </Tooltip>

      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
