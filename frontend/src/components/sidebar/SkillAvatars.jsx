import { WbIncandescentRounded } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { getImageMatch } from "../utilities/getImageMatch";

export default function SkillAvatars({ user, isDarkMode }) {
  return (
    <Box display={"flex"} justifyContent={"center"} mb={1}>
      <Stack gap={1}>
        {/* skills avatars */}
        <Box display={"flex"} justifyContent={"center"}>
          <AvatarGroup max={user?.selectedSkills?.length}>
            {/* loop through the skills and their images matched using custom fn */}
            {user?.selectedSkills?.map((skill, index) => (
              <Tooltip title={skill} arrow  key={index}
>
                <Avatar
                  alt={skill}
                  className="border"
                  sx={{ width: 30, height: 30 }}
                  src={getImageMatch(skill)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        {/* name */}
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          color={isDarkMode ? "whitesmoke" : "inherit"}
        >
           {user?.name}
        </Typography>

        {/* specialization */}
        <Typography
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
          color={isDarkMode ? "whitesmoke" : "inherit"}
        >
          <WbIncandescentRounded
            color="primary"
            sx={{ width: 20, height: 20, color: isDarkMode && "yellow" }}
          />
          {user?.specialisationTitle}
          <WbIncandescentRounded
            color="primary"
            sx={{ width: 20, height: 20, color: isDarkMode && "yellow" }}
          />
        </Typography>

        {/* about */}
        <Box
          maxWidth={275}
          display={"flex"}
          justifyContent={"center"}
          px={"4px"}
        >
          {user?.about && user?.about ? (
            <Typography
              textTransform={"capitalize"}
              variant="caption"
              p={1}
              width={"100%"}
              color={"text.secondary"}
            >
              {user?.about}
            </Typography>
          ) : (
            <Typography
              textTransform={"capitalize"}
              variant="body2"
              width={"100%"}
              color={"text.secondary"}
              textAlign={"center"}
            >
              ** No About **
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
