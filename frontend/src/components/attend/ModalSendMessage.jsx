import { CloseRounded, SendRounded } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { useSelector } from "react-redux";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const style = {
  position: "absolute",
  bottom: 0,
  left: CustomDeviceIsSmall() || CustomDeviceTablet() ? "50%" : "62%",
  transform: "translate(-50%, -50%)",
  width: CustomDeviceIsSmall() ? 350 : 500,
  boxShadow: 24,
  borderRadius: 2,
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
  // redux states access
  const { currentMode } = useSelector((state) => state.appUI);

  return (
    <Modal
      open={showModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{}}
    >
      <Box sx={style}>
        <Box
          className="shadow-lg rounded"
          display={"flex"}
          alignItems={"center"}
          bgcolor={"backgrond.default"}
          justifyContent={"space-between"}
          gap={1}
        >
          {/* text input */}
          <TextField
            fullWidth
            className={"rounded-start"}
            sx={{
              backgroundColor: currentMode==='dark' ? "black" : "white",
            }}
            label={`max ${messageMax - messageInput.length}`}
            variant="filled"
            error={messageInput.length > messageMax}
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
            placeholder="comment..."
          />
          <Box display={"flex"} gap={1} pr={1} alignItems={"center"}>
            {/* icon send */}
            <IconButton size="small" className="border">
              <SendRounded sx={{ width: 24, height: 24 }} />
            </IconButton>

            {/* close messages */}
            <IconButton
              size="small"
              className="border"
              onClick={handleShowModal}
            >
              <CloseRounded sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
