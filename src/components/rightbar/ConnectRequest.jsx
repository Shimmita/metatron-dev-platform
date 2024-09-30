import { Box, CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import React from "react";
import devImage from "../../images/dev.jpeg";

export default function ConnectRequest() {
  return (
    <CardActionArea>
      <Box p={1} display={"flex"} justifyContent={"center"}>
        <AvatarGroup total={24}>
          <Avatar alt="image" src={devImage} />
          <Avatar alt="image" src={devImage} />
          <Avatar alt="image" src={devImage} />
          <Avatar alt="image" src={devImage} />
          <Avatar alt="image" src={devImage} />
          <Avatar alt="image" src={devImage} />
        </AvatarGroup>
      </Box>
    </CardActionArea>
  );
}
