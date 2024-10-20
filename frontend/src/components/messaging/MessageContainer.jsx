import { Box } from "@mui/material";
import React from "react";
import MessageLayout from "./layout/MessageLayout";

export default function MessageContainer() {
  // items array container
  const messageItems = Array.from({ length: 20 });
  return (
    <Box height={"92vh"}>
      <Box
        height={"88vh"}
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
        {messageItems.length > 0 &&
          messageItems.map((_, index) => <MessageLayout key={index} />)}
      </Box>
    </Box>
  );
}
