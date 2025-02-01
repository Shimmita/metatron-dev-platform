import { Box, CardActionArea, Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getElapsedTime } from "../../utilities/getElapsedTime";

export default function ConversationLayout({
  conversation,
  handleConversationClicked,
  currentUserName,
  setFocusedConversation,
}) {
  // function to reduct nessage header or summary
  const handleMessageSummary = () => {
    const lastMessage = conversation && conversation?.lastMessage;
    if (CustomDeviceSmallest()) {
      return lastMessage.substring(0, 12) + "...";
    }
    if (CustomDeviceIsSmall()) {
      return lastMessage.substring(0, 18) + "...";
    }

    if (CustomDeviceTablet()) {
      return lastMessage.substring(0, 30) + "...";
    }
    return lastMessage.substring(0, 37) + "...";
  };

  const handleDateDisplay = () => {
    const parent = conversation?.updatedAt?.split("T")[0]?.split("-");
    return `${parent[parent.length - 1]}/${parent[parent.length - 2]}/${
      parent[0]
    }`;
  };

  // determine the name and avatar of the conversation displayed.
  const handleConversationNameAvatar = () => {
    // this prevents currently user being display front of conversation
    if (
      currentUserName?.toLowerCase() === conversation?.senderName?.toLowerCase()
    ) {
      return [conversation?.targetName, conversation?.targetAvatar];
    }

    // return the sender name and avatar
    return [conversation?.senderName, conversation?.senderAvatar];
  };

  return (
    <List sx={{ bgcolor: "background.paper" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
        width={"100%"}
      >
        {/* message conntent */}
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={handleConversationNameAvatar()[0]}
              src={handleConversationNameAvatar()[1]}
            />
          </ListItemAvatar>
          <CardActionArea
            onClick={() => {
              // handle UI display swithcing
              handleConversationClicked();

              // set the current conversation to be the one focused on
              setFocusedConversation(conversation);
            }}
            className="p-2"
          >
            <ListItemText
              primary={
                <Typography variant="body2" gutterBottom>
                  {handleConversationNameAvatar()[0]}
                </Typography>
              }
              secondary={handleMessageSummary()}
            />
          </CardActionArea>
        </ListItem>

        {/* time stamp */}
        <Box mr={2}>
          {/* time  */}
          <Box>
            <Typography gutterBottom variant="caption" color="text.secondary">
              {getElapsedTime(conversation?.updatedAt)} ago
            </Typography>
          </Box>

          {/* date */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              {handleDateDisplay()}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider component={"li"} />
    </List>
  );
}
