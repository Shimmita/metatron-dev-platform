import { InsightsRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import FeaturedEventsContainer from "./FeaturedEventsContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";

const MobileTabCorousel = () => {
  // backdrop state
  const [corouselCounter, setCorouselCounter] = React.useState(0);
   // redux states
    const {  isSidebarRighbar, currentMode} = useSelector(
      (state) => state.appUI
    );
    const isDarkMode=currentMode==='dark'


    const dispatch=useDispatch()
    const navigate=useNavigate()
  

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
     color={"text.primary"}
     className={'rounded'}
     sx={{ 
      border:isDarkMode && "1px solid",
      borderColor:"divider",
      }}
     >
      <Box
       className={'rounded'}
       bgcolor={"background.default"} 
      >
        <Box>
          {/*  top jobs */}
          <Box gap={1}  display={corouselCounter === 0 ? "block" : "none"}>
              <JobsContainer />
              <Box display={'flex'} justifyContent={'center'} width={'auto'}>

              <Button startIcon={<InsightsRounded/>} onClick={handleNavigateJobs} size="small" sx={{ textTransform:'capitalize', borderRadius:4}} >more jobs</Button>
              </Box>
            </Box>

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

          {/* popular courses */}
          {/* <Box display={corouselCounter === 3 ? "block" : "none"}>
            <CoursesContainer />
          </Box> */}
        </Box>
        {/* stepper controller */}
        <Box display={"flex"} justifyContent={"center"}>
          <RightBarStepper
            corouselCounter={corouselCounter}
            setCorouselCounter={setCorouselCounter}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileTabCorousel;
