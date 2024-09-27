import { AddCommentRounded } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import React from "react";
import MessageLayout from "./MessageLayout";
import ModalSendMessage from "./ModalSendMessage";

function MessageContainer() {
  const [showModal, setShowModal] = React.useState(false);

  // array simulation of the messages
  const messages = Array.from({ length: 30 }, (_, i) => i);

  // handle showing of modal when fab is clicked
  const handleShowingModal = () => {
    setShowModal(!showModal);
  };
  return (
    <Box
      sx={{
        overflowX: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
      className="attendee-messages"
    >
      <Box>
        {/* messages render container */}
        <Box>
          {messages &&
            messages.map((mesage, index) => (
              <Box key={index}>
                <MessageLayout />
              </Box>
            ))}
        </Box>

        {/* fab/textInput modal container*/}
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
          }}
        >
          <Fab onClick={handleShowingModal} size="medium" color="success">
            <AddCommentRounded />
          </Fab>
        </Box>
      </Box>

      {/* show modal when fab is clicked */}
      <ModalSendMessage showModal={showModal} setShowModal={setShowModal} />
    </Box>
  );
}

export default MessageContainer;
