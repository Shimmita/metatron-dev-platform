import { DeleteRounded } from "@mui/icons-material";
import { Box, CardActionArea, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import devImage from "../../images/dev.jpeg";
import "./Messaging.css";

export default function MessageWindow() {
  return (
    <List sx={{ bgcolor: "background.paper" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="container-messages"
      >
        {/* message conntent */}
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  fontWeight={"bold"}
                  color={"primary"}
                  variant="subtitle2"
                >
                  Warrior Michael
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color={"primary"}
                  >
                    I'll be in your neighborhood town...
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </CardActionArea>

        {/* delete icon */}
        <IconButton>
          <DeleteRounded className="delete-message-btn" color="primary" />
        </IconButton>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="container-messages"
      >
        {/* message content */}
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Vikran Krishna</Typography>}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  ></Typography>
                  {"Wish I could come, but I'm out of town…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </CardActionArea>
        {/* delete icon */}
        <IconButton>
          <DeleteRounded className="delete-message-btn" color="primary" />
        </IconButton>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="container-messages"
      >
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Yahya Ishmael</Typography>}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  ></Typography>
                  {"Do you have Paris recommendations?…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </CardActionArea>

        {/* delete icon */}
        <IconButton>
          <DeleteRounded className="delete-message-btn" color="primary" />
        </IconButton>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="container-messages"
      >
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Yahya Ishmael</Typography>}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  ></Typography>
                  {"Do you have Paris recommendations?…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </CardActionArea>

        {/* delete icon */}
        <IconButton>
          <DeleteRounded className="delete-message-btn" color="primary" />
        </IconButton>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="container-messages"
      >
        <CardActionArea>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={devImage} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Yahya Ishmael</Typography>}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  ></Typography>
                  {"Do you have Paris recommendations?…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </CardActionArea>

        {/* delete icon */}
        <IconButton>
          <DeleteRounded className="delete-message-btn" color="primary" />
        </IconButton>
      </Box>
    </List>
  );
}
