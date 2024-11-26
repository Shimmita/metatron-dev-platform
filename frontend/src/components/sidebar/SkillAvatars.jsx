import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function SkillAvatars() {
  const { user } = useSelector((state) => state.currentUser);
  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box>
        <Typography color={!isDarkMode ? "inherit" : "black"} gutterBottom>
          {user.name}
        </Typography>
        <Typography color={!isDarkMode ? "text.secondary" : "gray"}>
          {user.specialisationTitle}
        </Typography>
      </Box>
    </Box>
  );
}
