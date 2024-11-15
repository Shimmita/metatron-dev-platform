import { Home, SchoolRounded, Work } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const BottomNav = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  // return home or default card page
  const handleReturnHome = () => {
    navigate("/");
  };

  // return job page
  const handleJobContent = () => {
    navigate("/jobs");
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
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <Tooltip title="home" arrow>
          <BottomNavigationAction
            label="Home"
            icon={<Home sx={{ width: 34, height: 34 }} />}
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
