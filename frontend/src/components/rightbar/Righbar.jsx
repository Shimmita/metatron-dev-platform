import { InsightsRounded } from "@mui/icons-material";
import { Backdrop, Box, Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import BasicSpeedDial from "../custom/SpeedDial";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CoursesContainer from "./CoursesContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";
import "./Rightbar.css";

const RightbarAll = () => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [corouselCounter, setCorouselCounter] = React.useState(0);
  const navigate=useNavigate()
  const dispatch=useDispatch()

  // redux states
  const { isDarkMode, isDefaultBottomNav, isSidebarRighbar } = useSelector(
    (state) => state.appUI
  );

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
      marginRight={window.screen.availWidth > 1200 ? "5%" : "0"}
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
        className={'rounded'}
        maxHeight={"85vh"}
        sx={{
          border: "1px solid",
          borderColor:"divider",
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
        <Box bgcolor={"background.default"} className=" rounded  ">
          <Box>
            {/*  top jobs */}
            <Stack gap={1}  display={corouselCounter === 0 ? "block" : "none"}>
              <JobsContainer />
              {/* shown on smartphones and tablets only */}
              {CustomDeviceIsSmall()|| CustomDeviceTablet() && (
                <Box display={'flex'} justifyContent={'center'} width={'auto'}>
                <Button startIcon={<InsightsRounded/>} onClick={handleNavigateJobs} size="small" sx={{ textTransform:'capitalize', borderRadius:4}} >more jobs</Button>
                </Box>
              )}
            </Stack>

            {/* connect request */}
            <Box display={corouselCounter === 1 ? "block" : "none"}>
              <RequestContainer />
            </Box>

            {/* featured posts */}
            <Box display={corouselCounter === 2 ? "block" : "none"}>
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

        {/* events to be implemented later as latest feature */}
        {/* <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            ml={1}
            mt={"3px"}
          >
            <Typography fontWeight={"bold"} color={"primary"}>
              DEV SPACE EVENTS
            </Typography>
            <SchoolRounded color="primary" sx={{ width: 24, height: 24 }} />
          </Box>

          <Box display={"flex"} justifyContent={"center"} mt={1}>
            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"30vh"} />
            ) : (
              <RightBarEvents />
            )}
          </Box>
        </Box> */}
      </Box>

      {/* display speed dial in feed section only for mobile and no landscape */}
      {window.screen.availWidth > 900 && (
        <Box>
          {/* show speed dial if not scrolling down */}
          {isDefaultBottomNav && (
            <React.Fragment>
              <Backdrop open={openBackdrop} />
              <Box position={"fixed"} sx={{ left: 0, right: 1, bottom: 55 }}>
                <BasicSpeedDial setOpenBackdrop={setOpenBackdrop} />
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RightbarAll;
