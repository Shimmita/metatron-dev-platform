import { PersonRemove } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import devImage from "../../../../images/dev.jpeg";

export default function FriendsCard() {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem>
        <ListItemAvatar>
          <IconButton>
            <Avatar alt="user image" src={devImage} />
          </IconButton>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="body2">Albert Einstein</Typography>}
          secondary="@AlbertStar"
        />

        <Box pl={8} display={"flex"} justifyContent={"flex-end"}>
          <IconButton className="border">
            <PersonRemove color="primary"  sx={{ width: 15, height: 15 }} />
          </IconButton>
        </Box>
      </ListItem>

      <Divider variant="inset" component="li" />
    </List>
  );
}
