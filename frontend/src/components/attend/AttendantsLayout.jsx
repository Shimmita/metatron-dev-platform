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

        {/* index */}
        <Typography textAlign={"center"} color={"black"} variant="body2">
          {index}
        </Typography>
        {/* name */}
        <Typography
          fontWeight={"bold"}
          color={"primary"}
          gutterBottom
          textAlign={"center"}
          variant="body2"
        >
          Jonathan
        </Typography>

        {/* occupation of the user */}
        <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
          <Typography
            color={"text.secondary"}
            fontWeight={"bold"}
            gutterBottom
            variant="caption"
          >
            Software Dev
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default AttendantsLayout;
