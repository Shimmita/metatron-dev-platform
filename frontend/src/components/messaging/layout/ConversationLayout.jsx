import { Visibility } from "@mui/icons-material";
import { Badge, Box, CardActionArea, Divider } from "@mui/material";
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
  currentUserID,
  setFocusedConversation,
}) {
  // function to reduce message header or summary
  const handleMessageSummary = () => {
    const lastMessage = conversation?.lastMessage;
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

  // handle last conversation message display font based on the last sender
  const handleLastMessageFontWeight = () => {

    if (currentUserID !== conversation?.lastSenderId) {
      if (!conversation?.isTargetRead) {
        return true;
      } 
    }
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
        {/* message content */}
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={handleConversationNameAvatar()[0]}
              src={handleConversationNameAvatar()[1]}
            />
          </ListItemAvatar>
          <CardActionArea
            onClick={() => {
              // set the current conversation to be the one focused on
              setFocusedConversation(conversation);

              // handle UI display switching
              handleConversationClicked();
            }}
            className="p-2"
          >
            {/* bold message when last message not read by the target */}
            {handleLastMessageFontWeight() ? (
              <ListItemText
                primary={
                  <Badge
                    badgeContent={1}
                    color="primary"
                    className={!CustomDeviceIsSmall() && "pe-3"}
                  >
                    <Typography
                      variant="body2"
                      gutterBottom
                      fontWeight={"bold"}
                    >
                      {handleConversationNameAvatar()[0]}
                    </Typography>
                  </Badge>
                }
                secondary={<Typography>{handleMessageSummary()}</Typography>}
              />
            ) : (
              <ListItemText
                primary={
                  <Typography variant="body2" gutterBottom>
                    {handleConversationNameAvatar()[0]}
                  </Typography>
                }
                secondary={handleMessageSummary()}
              />
            )}
          </CardActionArea>
        </ListItem>

        {/* target viewed last message status and time stamp */}
        <Box mr={1}>
          {/* time  */}
          <Box display={"flex"} alignItems={"center"} gap={"3px"}>
            {conversation?.isTargetRead &&
            currentUserID === conversation?.lastSenderId ? (
              <React.Fragment>
                <Box>
                  <Visibility sx={{ width: 15, height: 15 }} color="primary" />
                </Box>
                {/* time elapsed */}
                <Typography
                  gutterBottom
                  variant="caption"
                  color="text.secondary"
                  className="pt-2"
                >
                  {getElapsedTime(conversation?.updatedAt)}
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* time elapsed */}
                <Typography
                  gutterBottom
                  variant="caption"
                  color="text.secondary"
                  className="pt-2"
                >
                  {getElapsedTime(conversation?.updatedAt)} ago
                </Typography>
              </React.Fragment>
            )}
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
