import { AddCommentRounded } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import React from "react";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
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
      maxHeight={`${
        CustomDeviceIsSmall() || CustomDeviceTablet() ? "38vh" : "70vh"
      }`}
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
            right: "45%",
            bottom: 5,
          }}
        >
          <Fab onClick={handleShowingModal} size="medium" color="primary">
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
