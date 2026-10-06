import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { SendOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

export const ChatBotLayout = () => {
  const [message, setMessage] = useState("");

  // get redux states
  const { user } = useSelector((state) => state.currentUser);

  const handleSendingRequest = () => {
    // clear the msg and send the message
    setMessage("");
  };
  return (
    <Stack
      width={"100%"}
      height={"45vh"}
      p={2}
      gap={2}
      justifyContent={"space-between"}
    >
      <Stack
        gap={2}
        maxHeight={"42vh"}
        maxWidth={400}
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
        {/* bot chat */}
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <Avatar sx={{ width: 24, height: 24 }}>
            <Typography
              variant="caption"
              color={"text.secondary"}
              fontWeight={"bold"}
              textTransform={"uppercase"}
            >
              Ai
            </Typography>
          </Avatar>

          <Box
            className={"rounded p-2"}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="body2" color={"text.secondary"}>
              Hi, {user?.name} I'm your one stop agent concerning our services
            </Typography>
          </Box>
        </Box>
      </Stack>

      {/* user input */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        alignItems={"center"}
      >
        {/* input text */}
        <TextField
          fullWidth
          value={message}
          className="w-100"
          placeholder="chat here..."
          onChange={(e) => setMessage(e.target.value)}
          variant="standard"
          maxRows={2}
          multiline
        />
        {/* send button */}
        {message && (
          <IconButton onClick={handleSendingRequest}>
            <SendOutlined sx={{ width: 18, height: 18 }} />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};
