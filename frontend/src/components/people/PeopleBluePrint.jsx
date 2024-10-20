import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import devImage from "../../images/dev.jpeg";

export default function PeopleBluePrint() {
  return (
    <List sx={{ width: "100%", maxWidth: 350, bgcolor: "background.paper" }}>
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
            <PersonAdd color="primary" sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Box>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
