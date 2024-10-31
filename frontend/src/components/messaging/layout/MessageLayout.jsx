import { Box, CardActionArea, Divider, Menu } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import ImageSender from "../../../images/aws.jpeg";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import MoreMessageLayout from "./MoreMessageLayout";

export default function MessageLayout({ handleMessageClicked }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const message = "Dear Anderson, we are excited to inform you that ";

  // function to reduct nessage header or summary
  const handleMessageSummary = () => {
    if (CustomDeviceSmallest()) {
      return message.substring(0, 12) + "...";
    }
    if (CustomDeviceIsSmall()) {
      return message.substring(0, 18) + "...";
    }

    if (CustomDeviceTablet()) {
      return message.substring(0, 30) + "...";
    }
    return message.substring(0, 37) + "...";
  };

  return (
    <List
      sx={{ bgcolor: "background.paper", opacity: openMenu ? 0.5 : 1 }}
      id="more-btn"
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
        width={"100%"}
      >
        {/* message conntent */}
        <CardActionArea onClick={handleClickMoreVertPost}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="image" src={ImageSender} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" color="initial">
                  {" "}
                  Amazon Web Services
                </Typography>
              }
              secondary={handleMessageSummary()}
            />
          </ListItem>
        </CardActionArea>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{ "aria-labelledby": "more-btn" }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MoreMessageLayout handleMessageClicked={handleMessageClicked} />
        </Menu>

        {/* time stamp */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            Monday 20/10/2024
          </Typography>
        </Box>
      </Box>

      <Divider component={"li"} />
    </List>
  );
}
