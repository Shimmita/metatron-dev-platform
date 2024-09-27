import { StarsRounded } from "@mui/icons-material";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import logo from "../../images/dev.jpeg";

function AttendantsLayout({ index }) {
  return (
    <Box m={1} padding={1}>
      <Tooltip arrow title={"Jonathan James"}>
        {/* avatar user */}
        <Box mb={1} gap={1} display={"flex"} justifyContent={"center"}>
          {/* image */}
          <Avatar src={logo} alt="image" />
        </Box>

        {/* firstname of the user */}
        <Box display={"flex"} justifyContent={"center"}>
          <Typography
            fontWeight={"bold"}
            color={"primary"}
            gutterBottom
            variant="body2"
          >
            {index} Jonathan
          </Typography>
        </Box>

        {/* occupation of the user */}
        <Box
          gap={1}
          alignItems={"center"}
          display={"flex"}
          justifyContent={"center"}
        >
          <StarsRounded color="primary" sx={{ width: 16, height: 16 }} />
          <Typography
            color={"text.secondary"}
            fontWeight={"bold"}
            gutterBottom
            variant="caption"
          >
            ML/AI Eng
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default AttendantsLayout;
