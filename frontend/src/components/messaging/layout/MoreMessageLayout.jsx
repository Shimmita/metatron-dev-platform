import { DeleteRounded, EditRounded } from "@mui/icons-material";
import {
  Box,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { appColors } from "../../../utils/colors";
function MoreMessageLayout({
  setIsEditingMessage,
  handleCloseMenu,
  handleDeletingOfMessage,
  messagePassed,
  setReplyContent,
}) {
  // handle when editing option clicked
  const handleEditing = () => {
    //setIsEditing true
    setIsEditingMessage(true);

    // update the reply content to reflect the content of messagePaged
    setReplyContent(messagePassed?.content);
    // close menu popup
    handleCloseMenu();
  };

  // handle deletion by calling the parent function aimed for deletion
  const handleMessageDelete = () => {
    // call parent method for deletion to occur
    handleDeletingOfMessage();
    handleCloseMenu();
  };

  return (
    <Box sx={{ p: 0.5, minWidth: 150 }}>
      <MenuItem
        onClick={handleEditing}
        sx={{
          borderRadius: "8px",
          minHeight: 38,
          "&:hover": { background: "rgba(214,178,94,0.1)" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <EditRounded sx={{ width: 15, height: 15, color: appColors.primary }} />
          <ListItemText primary={<Typography variant="caption" fontWeight={800}>Edit message</Typography>} />
        </Stack>
      </MenuItem>

      <MenuItem
        onClick={handleMessageDelete}
        sx={{
          borderRadius: "8px",
          minHeight: 38,
          "&:hover": { background: "rgba(239,68,68,0.1)" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <DeleteRounded sx={{ width: 15, height: 15, color: appColors.error }} />
          <ListItemText primary={<Typography variant="caption" fontWeight={800}>Delete message</Typography>} />
        </Stack>
      </MenuItem>
    </Box>
  );
}

export default MoreMessageLayout;
