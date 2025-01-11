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
import DevLogo from "../../images/dev.jpeg";

export const ChatBotLayout = () => {
  const [message, setMessage] = useState("");
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
          <Typography
            variant="body2"
            color={"text.secondary"}
            className="border p-2 rounded"
          >
            Dear Shimmita, I'm here for your inquiries about our services how
            may I help?
          </Typography>
        </Box>

        {/* user chat */}
        <Box
          display={"flex"}
          gap={1}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Avatar sx={{ width: 24, height: 24 }} src={DevLogo} alt="" />

          <Typography
            variant="body2"
            color={"text.primary"}
            className="border p-2 rounded"
          >
            what's metatron all about
          </Typography>
        </Box>

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
          <Typography
            variant="body2"
            color={"text.secondary"}
            className="border p-2 rounded"
          >
            Metatron is a tech oriented platform aimed to bridge the gap between
            prodigy technocrats and amature ones by providing a socio-tech
            cultural environment for interaction. Our services includes:
            worldwide rendering of verfied jobs in tech, providing excellent
            tech courses from expertise for free though some paid, global
            hosting of diverse tech events, providing live hackathons and
            codility tests, user project demonstration for global visibility
            ranging from Cybersecurity, Machine Learning, Software Development,
            Cloud Computing and more.
          </Typography>
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
