import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import SnackBarNotifications from "../snackbar/SnackBarNotifications";
import NotifAccordionLayout from "./layout/NotifAccordionLayout";

function NotificationContainer() {
  // redux states access
  const { messageNotification } = useSelector((state) => state.currentSnackBar);
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
        <NotifAccordionLayout />
      </Box>

      {/* show snackbar for notifications for info */}
      {messageNotification && (
        <SnackBarNotifications message={messageNotification} />
      )}
    </Box>
  );
}

export default NotificationContainer;
