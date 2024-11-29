import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

import image from "../../images/dev.jpeg";

function MessageLayout() {
  return (
    <List className="w-100" sx={{ bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="image" src={image} sx={{ width: 30, height: 30 }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              display={"flex"}
              gap={1}
              alignItems={"center"}
              variant="body2"
              fontWeight={"bold"}
              color={"primary"}
            >
              Kumar Krishna
            </Typography>
          }
          secondary={"Kindly redo on SQl Delight installation I'm stuck"}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}

export default MessageLayout;
