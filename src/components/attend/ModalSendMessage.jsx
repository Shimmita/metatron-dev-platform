import { CloseRounded, SendRounded } from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";

const style = {
  position: "absolute",
  bottom: 0,
  left: "62%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function ModalSendMessage({ showModal, setShowModal }) {
  // max size of message
  const messageMax = 50;
  // control showing of fab and input text
  const [messageInput, setMessageInput] = React.useState("");

  // handle display of modal
  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Box>
      <Modal
        open={showModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            className="shadow-lg rounded bg-white"
            display={"flex"}
            alignItems={"center"}
            p={1}
            justifyContent={"space-between"}
            gap={1}
          >
            {/* text input */}
            <TextField
              fullWidth
              label={`message max ${messageMax - messageInput.length}`}
              variant="standard"
              color="success"
              error={messageInput.length > messageMax}
              onChange={(e) => setMessageInput(e.target.value)}
              value={messageInput}
              placeholder="write your message..."
            />
            {/* icon send */}
            <Tooltip arrow title='send'>
              <IconButton className="border">
                <SendRounded color={"success"} sx={{ width: 24, height: 24 }} />
              </IconButton>
            </Tooltip>

            {/* close messages */}
            <Tooltip arrow title="close">
              <IconButton className="border" onClick={handleShowModal}>
                <CloseRounded sx={{ width: 24, height: 24 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
