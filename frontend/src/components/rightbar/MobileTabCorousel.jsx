import { Box } from "@mui/material";
import React from "react";
import useScrolledDown from "../hooks/useScrolledDown";
import CoursesContainer from "./CoursesContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";
import FeaturedPostContainer from "./FeaturedPostContainer";

const MobileTabCorousel = ({ mode }) => {
  // backdrop state
  const [corouselCounter, setCorouselCounter] = React.useState(1);

  // run the listening component hook
  useScrolledDown();

  return (
    <Box color={"text.primary"}>
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
    </Box>
  );
};

export default MobileTabCorousel;
