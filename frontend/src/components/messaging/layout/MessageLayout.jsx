import { DeleteRounded } from "@mui/icons-material";
import { Box, CardActionArea, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import devImage from "../../../images/dev.jpeg";

export default function MessageLayout() {
  return (
    <List sx={{ bgcolor: "background.paper" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {/* message conntent */}
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} variant="rounded" />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Warrior Michael</Typography>}
              secondary={"I'll be in your neighborhood town... "}
            />
          </ListItem>
        </CardActionArea>

        {/* delete icon */}
        <IconButton>
          <DeleteRounded color="primary" />
        </IconButton>
      </Box>
    </List>
  );
}
