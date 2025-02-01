import { DeleteRounded, EditRounded } from "@mui/icons-material";
import {
  Box,
  Divider,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
function MoreMessageLayout({ handleMessageClicked }) {
  return (
    <Box bgcolor={"color.default"} >
      <MenuItem onClick={handleMessageClicked}>
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

      <MenuItem>
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
