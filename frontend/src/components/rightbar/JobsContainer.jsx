import { WorkRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import React from "react";
import FeaturedJobs from "./layouts/FeaturedJobs";

export default function JobsContainer() {
  const screenWidth = window.screen.availWidth;
  // simulation of the items in the list
  const items = Array.from(new Array(3));

  // get the rightbar expanded appropritately
  const rightBarExpaned = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
    return;
  };

  return (
    <>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          mb={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
        >
          <Typography fontWeight={"bold"} color={"primary"}>
            FEATURED JOBS
          </Typography>
          <WorkRounded color="primary" sx={{ width: 20, height: 20 }} />
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpaned(),
        }}
      >
        <Box>
          {items.map((item, index) => (
            <Box key={index}>
              <FeaturedJobs />
            </Box>
          ))}
        </Box>
      </List>
    </>
  );
}
