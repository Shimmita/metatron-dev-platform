import { MessageRounded } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showProfileDrawerMessageInput,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import { updateTempUserIDRedux } from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";

export default function UserNetworkLayout({ network }) {
  // redux states
  const { isOpenDrawerProfile } = useSelector((state) => state.appUI);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // handle sending of the message
  const handleSendMessage = () => {
    if (CustomDeviceIsSmall()) {
      // navigate user profile specially smalller devices + mesaging true
      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));

      //close the drewer if is open for small devices
      if (isOpenDrawerProfile) {
        dispatch(showUserProfileDrawer());
      }
      navigate("users/profile/" + network?._id);
    } else {
      // update the temp user state in redux with the userID passed
      dispatch(updateTempUserIDRedux(network?._id));

      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));

      //  open drawer profile if is not open for large screens and tabs ++
      if (!isOpenDrawerProfile) {
        dispatch(showUserProfileDrawer());
      }
    }
  };
  return (
    <List>
      <ListItem
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={network?.name}
          secondary={
            <Typography variant="body2" color={"text.secondary"}>
              {network?.specialisationTitle} <br />{" "}
              {CustomCountryName(network?.country)} | {network?.county}
            </Typography>
          }
        />

        <IconButton onClick={handleSendMessage}>
          <Tooltip title={"message"} arrow>
            <MessageRounded color="primary" />
          </Tooltip>
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
