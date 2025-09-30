import { InsightsRounded } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import FeaturedEventsContainer from "./FeaturedEventsContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";

const RightbarAll = () => {
  // backdrop state
  const [corouselCounter, setCorouselCounter] = React.useState(0);
  const navigate=useNavigate()
  const dispatch=useDispatch()

  // redux states
  const {currentMode, isSidebarRighbar } = useSelector(
    (state) => state.appUI
  );
    const isDarkMode=currentMode==='dark'

  const { isGuest } = useSelector((state) => state.currentUser);
  


  const handleNavigateJobs=()=>{
    navigate("/jobs"); 
    // update the bottom index to match jobs
    dispatch(updateCurrentBottomNav(1))
    // disable sidebar
      if (isSidebarRighbar) {
        dispatch(handleSidebarRightbar());
      }
  }

  return (
    <Box
      height={"90vh"}
      flex={2}
      marginRight={CustomLandscapeWidest() ? "5%" : "0"}
      p={2}
      sx={{
        display: {
          xs: "none",
          sm: "none",
          md: isSidebarRighbar ? "block" : "none",
        },
      }}
    >
      <Box
        position={"fixed"}
        maxHeight={"80vh"}
        className='shadow'
        sx={{
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* connect suggestion  */}
        <Box 
        sx={{ 
          border:isDarkMode && "1px solid",
          borderColor:"divider",
         }}
        bgcolor={"background.default"} 
        className="rounded-2">
          <Box>
            {/*  top jobs */}
            <Stack gap={1}  display={corouselCounter === 0 ? "block" : "none"}>
              <JobsContainer />
              {/* shown on smartphones and tablets only */}
              {(CustomDeviceIsSmall()|| CustomDeviceTablet()) && (
                <Box display={'flex'} justifyContent={'center'} width={'auto'}>
                <Button startIcon={<InsightsRounded/>} 
                onClick={handleNavigateJobs} size="small" 
                sx={{ textTransform:'capitalize', borderRadius:4}} >more jobs</Button>
                </Box>
              )}
            </Stack>

            {/* not shown if user is guest */}
            {!isGuest && (
              <React.Fragment>
            {/* connect request */}
            <Box display={corouselCounter === 1 ? "block" : "none"}>
              <RequestContainer />
            </Box>
              {/* featured events */}
            <Box display={corouselCounter === 2 ? "block" : "none"}>
              <FeaturedEventsContainer />
            </Box>
              {/* featured posts */}
            <Box display={corouselCounter === 3 ? "block" : "none"}>
              <FeaturedPostContainer />
            </Box>
              </React.Fragment>
            )}
          
            {/* popular courses */}
            {/* <Box display={corouselCounter === 3 ? "block" : "none"}>
              <CoursesContainer />
            </Box> */}
          </Box>
          {/* stepper controller, not shown when user is guest */}
          {!isGuest && (
              <Box 
          display={"flex"} 
          justifyContent={"center"}>
            <RightBarStepper
              corouselCounter={corouselCounter}
              setCorouselCounter={setCorouselCounter}
            />
          </Box>
          )}
        
        </Box>
      </Box>     
    </Box>
  );
};

export default RightbarAll;
