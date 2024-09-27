import { Box } from "@mui/material";
import React from "react";
import CustomLandScape from "../utilities/CustomLandscape";
import FeedCardContainer from "./FeedCardContainer";

const FeedDefaultContent = () => {
  return (
    <Box>
      <Box mt={CustomLandScape() ? "11px" : "3px"}>
        <FeedCardContainer />
      </Box>
    </Box>
  );
};

export default FeedDefaultContent;
