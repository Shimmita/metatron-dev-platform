import { SchoolRounded } from "@mui/icons-material";
import { Backdrop, Box, Divider, Skeleton, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import BasicSpeedDial from "../custom/SpeedDial";
import CoursesContainer from "./CoursesContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarEvents from "./RightBarEvents";
import RightBarStepper from "./RightBarStepper";

const RightbarAll = () => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [corouselCounter, setCorouselCounter] = React.useState(0);

  // redux states
  const {
    isDefaultBottomNav,
    isSidebarRighbar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

  return (
    <Box
      height={"100vh"}
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
        color={"text.primary"}
        className="mt-0 shadow rounded"
        maxHeight={"80vh"}
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
        <Box bgcolor={"background.default"} className=" rounded pe-2 ">
          <Box>
            {/* jobs */}
            <Box display={corouselCounter === 0 ? "block" : "none"}>
              <JobsContainer />
            </Box>

            {/* popular courses */}
            <Box display={corouselCounter === 1 ? "block" : "none"}>
              <CoursesContainer />
            </Box>

            {/* featured courses */}
            <Box display={corouselCounter === 2 ? "block" : "none"}>
              <FeaturedPostContainer />
            </Box>

            {/* connect request */}
            <Box display={corouselCounter === 3 ? "block" : "none"}>
              <RequestContainer />
            </Box>
          </Box>
          {/* stepper controller */}
          <Box display={"flex"} justifyContent={"center"}>
            <RightBarStepper
              corouselCounter={corouselCounter}
              setCorouselCounter={setCorouselCounter}
            />
          </Box>
        </Box>

        {/* divider */}
        <Divider className="mb-2" component={"div"} />

        {/* events */}
        <Box bgcolor={"background.default"} className="rounded ">
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
              pt={2}
            >
              <Typography fontWeight={"bold"} color={"primary"}>
                LEARNING EVENTS
              </Typography>
              <SchoolRounded color="primary" sx={{ width: 24, height: 24 }} />
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"center"} mt={1}>
            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"30vh"} />
            ) : (
              <RightBarEvents />
            )}
          </Box>
        </Box>
      </Box>

      {/* display speed dial in feed section only for mobile and no landscape */}
      {window.screen.availWidth > 900 && (
        <Box>
          {/* show speed dial if not scrolling down */}
          {isDefaultBottomNav && (
            <>
              <Backdrop open={openBackdrop} />
              <Box position={"fixed"} sx={{ left: 0, right: 1, bottom: 55 }}>
                <BasicSpeedDial setOpenBackdrop={setOpenBackdrop} />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RightbarAll;
