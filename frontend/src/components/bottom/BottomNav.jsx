import { CachedOutlined, CachedRounded, HomeOutlined, HomeRounded, SchoolOutlined, SchoolRounded, TvRounded, TvTwoTone, WorkOutlineOutlined, WorkRounded } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Tooltip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleShowingSpeedDial,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const BottomNav = () => {
  // redux states
  const { isSidebarRighbar,currentMode } = useSelector((state) => state.appUI);
  // update is dark const
  const isDarkMode=currentMode==='dark'

  const { position } = useSelector((state) => state.currentBottomNav);
  const { isPostSearch } = useSelector((state) => state.currentPosts);


  const navigate = useNavigate();
  const dispatch = useDispatch();

    // accessing the redux state values
    const { isTabSideBar } = useSelector((state) => state.appUI);

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

  // handle events page
  const handleNavigateEvents=()=>{
    navigate("/events")
    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  }

  // handle corses page
  const handleOpenCourses = () => {
  
     // disable sidebar
     if (isSidebarRighbar) {
      
      dispatch(handleSidebarRightbar());
    }
    navigate("/courses/available");
  };



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
              marginLeft:CustomDeviceTablet() && isTabSideBar && "30%"
            }}>
          <BottomNavigationAction
            label="Home"
            icon={
              isPostSearch ? (
                <>
                {isDarkMode ? (
                  <CachedOutlined  sx={{ width: 28, height: 28 }} />
                ):(
                  <CachedRounded  sx={{ width: 28, height: 28 }} />
                )}
                </>
              ) : (
                <>
                {isDarkMode ? (
                  <HomeOutlined sx={{ width: 29, height: 29}} />
                ):(
                  <HomeRounded sx={{ width: 29, height: 29}} />
                )}
                
                </>
              )
            }
            onClick={handleReturnHome}
          />
        </Tooltip>

        <Tooltip title="IT Jobs" arrow>
          <BottomNavigationAction
            onClick={handleJobContent}
            label="Jobs"
            icon={<>
            {isDarkMode ? (
               <WorkOutlineOutlined sx={{ width: 28, height: 28 }} />
            ):(
              <WorkRounded sx={{ width: 28, height: 28 }} />
            )}
           
            </>}
          />
        </Tooltip>


           {/* tech events */}
         <Tooltip 
         title="IT Events"
          arrow
          >
          <BottomNavigationAction
            onClick={handleNavigateEvents}
            label="Events"
            icon={<>
            {isDarkMode ?(
               <TvRounded sx={{ width: 26, height: 26 }} />
            ):(
              <TvTwoTone sx={{ width: 26, height: 26 }} />
            )}
           
            </>}
          />
        </Tooltip>

        
        {/* online courses */}
        <Tooltip title="Tech Courses" arrow>
          <BottomNavigationAction
            onClick={handleOpenCourses}
            label="Courses"
            icon={<>
            {isDarkMode ? (
              <SchoolOutlined sx={{ width: 30, height: 30 }} />
            ):(
              <SchoolRounded sx={{ width: 30, height: 30 }} />
            )}
            
            </>}
          />
        </Tooltip>

      </BottomNavigation>

    </Paper>
  );
};

export default BottomNav;
