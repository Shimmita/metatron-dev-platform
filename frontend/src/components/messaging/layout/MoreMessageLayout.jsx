import { Delete, FlagRounded, MarkEmailReadRounded } from "@mui/icons-material";
import { Box, ListItemText, MenuItem, Typography } from "@mui/material";
import React from "react";
function MoreMessageLayout({ handleMessageClicked }) {
  return (
    <>
      <Box bgcolor={"color.default"} borderRadius={5} p={1}>
        <MenuItem onClick={handleMessageClicked}>
          <ListItemText>
            <MarkEmailReadRounded
              sx={{ width: 15, height: 15 }}
              color="success"
              className="mx-2"
            />
          </ListItemText>
          <ListItemText
            primary={<Typography variant="caption">Read Message</Typography>}
          />
        </MenuItem>

        <MenuItem>
          <ListItemText>
            <FlagRounded
              sx={{ width: 15, height: 15 }}
              color="primary"
              className="mx-2"
            />
          </ListItemText>
          <ListItemText
            primary={
              <Typography variant="caption">Report Fraudster</Typography>
            }
          />
        </MenuItem>

        <MenuItem>
          <ListItemText>
            <Delete
              sx={{ width: 15, height: 15 }}
              color="warning"
              className="mx-2"
            />
          </ListItemText>
          <ListItemText
            primary={<Typography variant="caption">Delete Message</Typography>}
          />
        </MenuItem>
      </Box>
    </>
  );
}

export default MoreMessageLayout;
