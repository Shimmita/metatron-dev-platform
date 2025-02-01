import { WbIncandescentRounded } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { getImageMatch } from "../utilities/getImageMatch";

export default function SkillAvatars({ user, isDarkMode }) {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box>
        {/* name */}
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          color={!isDarkMode ? "white" : "black"}
          gutterBottom
        >
          {user?.name}
        </Typography>

        {/* specialisation */}
        <Typography
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gutterBottom
          gap={1}
          color={!isDarkMode ? "lightgray" : "black"}
        >
          <WbIncandescentRounded
            sx={{ width: 20, height: 20, color: "yellow" }}
          />
          {user?.specialisationTitle}
          <WbIncandescentRounded
            sx={{ width: 20, height: 20, color: "yellow" }}
          />
        </Typography>

        {/* skills avatars */}
        <Box display={"flex"} justifyContent={"center"}>
          <AvatarGroup max={user?.selectedSkills?.length}>
            {/* loop through the skills and their images matched using custim fn */}
            {user?.selectedSkills?.map((skill, index) => (
              <Tooltip title={skill} arrow>
                <Avatar
                  key={index}
                  alt={skill}
                  className="border"
                  sx={{ width: 30, height: 30 }}
                  src={getImageMatch(skill)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
      </Box>
    </Box>
  );
}
