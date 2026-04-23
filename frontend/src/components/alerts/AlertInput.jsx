import { useTheme } from "@emotion/react";
import { Close, SendRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  DialogContentText,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearConversations } from "../../redux/CurrentConversations";
import { updateMessageConnectRequest } from "../../redux/CurrentSnackBar";

export default function AlertInputMessage({
  openAlert,
  setOpenAlert,
  targetId,
  targetName,
  targetAvatar,
  targetSpecialisation,
}) {
  const [isSending, setIsSending] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.currentUser);

  const handleClose = () => setOpenAlert(false);

  const handleSendingMessage = async () => {
    const conversation = {
      senderId: user._id,
      content: textMessage,
      participants: [user._id, targetId],
    };

    try {
      setIsSending(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/create`,
        conversation
      );

      if (response.data) {
        dispatch(resetClearConversations());
        dispatch(updateMessageConnectRequest("Message sent"));
      }
    } catch (err) {
      if (err?.code === "ERR_NETWORK") {
        dispatch(updateMessageConnectRequest("Server unreachable"));
      } else {
        dispatch(updateMessageConnectRequest(err?.response?.data));
      }
    } finally {
      setIsSending(false);
      setTextMessage("");
      handleClose();
    }
  };

  const theme = useTheme();

  return (
    <Dialog
      open={openAlert}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" gap={1.5} alignItems="center">
          <Avatar src={targetAvatar} sx={{ width: 36, height: 36 }} />

          <Box>
            <Typography fontSize={13} fontWeight={600}>
              {targetName}
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              {targetSpecialisation}
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* CONTENT */}
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: 12,
            color: "text.secondary",
            mb: 1,
          }}
        >
          Send a quick message
        </DialogContentText>

        {/* INPUT */}
        <Box
          sx={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            px: 1,
            py: 1,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <InputBase
            multiline
            fullWidth
            minRows={4}
            maxRows={6}
            placeholder="Write your message..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            disabled={isSending}
          />
        </Box>
      </DialogContent>

      {/* ACTION */}
      <Box px={2} pb={2}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SendRounded />}
          disabled={textMessage.trim() === "" || isSending}
          onClick={handleSendingMessage}
          sx={{
            borderRadius: "12px",
            background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
            color: "#fff",
          }}
        >
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </Box>
    </Dialog>
  );
}