import { Box } from "@mui/material";
import React from "react";
import CoursesContainer from "./CoursesContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";

const MobileTabCorousel = () => {
  // backdrop state
  const [corouselCounter, setCorouselCounter] = React.useState(0);

  return (
    <Box color={"text.primary"}>
      {/* connect suggestion  */}
      <Box bgcolor={"background.default"} className="shadow rounded ">
        <Box>
          {/* jobs */}
          <Box display={corouselCounter === 0 ? "block" : "none"}>
            <JobsContainer />
          </Box>
          {/* featured courses */}
          <Box display={corouselCounter === 1 ? "block" : "none"}>
            <RequestContainer />
          </Box>
          
          {/* popular courses */}
          <Box display={corouselCounter === 2 ? "block" : "none"}>
            <CoursesContainer />
          </Box>

          {/* connect request */}
          <Box display={corouselCounter === 3 ? "block" : "none"}>
            <FeaturedPostContainer />
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
