import { WbIncandescentRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function SkillAvatars() {
  const { user } = useSelector((state) => state.currentUser);
  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box>
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          color={!isDarkMode ? "white" : "black"}
          gutterBottom
        >
          {user.name}
        </Typography>
        <Typography
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
          color={!isDarkMode ? "lightgray" : "black"}
        >
          <WbIncandescentRounded sx={{ width: 20, height: 20 }} />
          {user.specialisationTitle}
          <WbIncandescentRounded sx={{ width: 20, height: 20 }} />
        </Typography>
      </Box>
    </Box>
  );
}
