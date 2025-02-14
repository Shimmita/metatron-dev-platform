import { DeleteRounded, EditRounded } from "@mui/icons-material";
import {
  Box,
  Divider,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
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
    <Box bgcolor={"color.default"}>
      <MenuItem onClick={handleEditing}>
        <ListItemText>
          <EditRounded
            sx={{ width: 15, height: 15 }}
            color="primary"
            className="mx-3"
          />
        </ListItemText>
        <ListItemText
          primary={<Typography variant="caption">Edit</Typography>}
        />
      </MenuItem>
      {/* divider */}
      <Box display={"flex"} justifyContent={"center"} width={"100%"}>
        <Divider component={"div"} className="w-75" />
      </Box>

      <MenuItem onClick={handleMessageDelete}>
        <ListItemText>
          <DeleteRounded
            sx={{ width: 15, height: 15 }}
            color="warning"
            className="mx-3"
          />
        </ListItemText>
        <ListItemText
          primary={<Typography variant="caption">Delete</Typography>}
        />
      </MenuItem>
    </Box>
  );
}

export default MoreMessageLayout;
