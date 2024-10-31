import { Box } from "@mui/material";
import React from "react";
import NotifLayout from "./layout/NotifLayout";

function NotificationContainer() {
  const items = Array.from({ length: 10 });
  return (
    <Box >
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
        <Box >
          {items &&
            items.map((val, index) => (
              <Box >
                <NotifLayout key={index} />
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default NotificationContainer;
