import { Box } from "@mui/material";
import React, { useState } from "react";
import MessageLayout from "./layout/MessageLayout";
import MessageDetailed from "./MessageDetailed";

export default function MessageContainer({ setMessageNotifClicked }) {
  // hold the message clicked bool
  const [messageClicked, setMessageClicked] = useState(false);

  // items array container
  const messageItems = Array.from({ length: 10 });

  // handle message clicked
  const handleMessageClicked = () => {
    // show message details and hide all messages
    setMessageClicked((prev) => !prev);

    // hide the inbox and notif bars when message details is focused
    // from the top most parent level
    setMessageNotifClicked((prev) => !prev);
  };

  return (
    <Box>
      <Box
        height={"92vh"}
        sx={{
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* if message not clicked display all message summarily */}
        {!messageClicked ? (
          <Box pt={2} pb={2}>
            {messageItems.length > 0 &&
              messageItems.map((_, index) => (
                <MessageLayout
                  key={index}
                  handleMessageClicked={handleMessageClicked}
                />
              ))}
          </Box>
        ) : (
          // show message details and pass props for altering its state of visbility
          <Box>
            <MessageDetailed handleMessageClicked={handleMessageClicked} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
