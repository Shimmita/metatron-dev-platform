import { SchoolRounded } from "@mui/icons-material";
import { Backdrop, Box, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicSpeedDial from "../custom/SpeedDial";
import useScrolledDown from "../hooks/useScrolledDown";
import CoursesContainer from "./CoursesContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarEvents from "./RightBarEvents";
import RightBarStepper from "./RightBarStepper";

const RightbarAll = () => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [corouselCounter, setCorouselCounter] = React.useState(1);

  // redux states
  const { isScrolledDown, isSidebarRighbar } = useSelector(
    (state) => state.appUI
  );

  // run the listening component hook
  useScrolledDown();

  // simulate loading of the request
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);

  return (
    <Box
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
      <Box position={"fixed"} color={"text.primary"} className="mt-0">
        {/* connect suggestion  */}
        <Box bgcolor={"background.default"} className="shadow rounded pe-2 ">
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

        {/* events */}
        <Box bgcolor={"background.default"} className="shadow mt-3 rounded ">
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              display={"flex"}
              gap={5}
              fontWeight={"bold"}
              gutterBottom
              color={"primary"}
            >
              <span className="pt-1">LEARNING EVENTS</span>{" "}
              <SchoolRounded sx={{ width: 24, height: 24 }} />
            </Typography>
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
          {!isScrolledDown && (
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
