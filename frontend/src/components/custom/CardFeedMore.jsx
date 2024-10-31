import {
  DownloadForOfflineRounded,
  EmailRounded,
  PersonAddRounded
} from "@mui/icons-material";
import { Box, ListItemText, MenuItem } from "@mui/material";
import React from "react";
function CardFeedMore() {
  return (
    <>
      <Box borderRadius={5}>
        <MenuItem>
          <ListItemText>
            <EmailRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={"Inbox Shimmita"} />
        </MenuItem>
        <MenuItem>
          <ListItemText>
            <PersonAddRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={"Follow Shimmita"} />
        </MenuItem>
        <MenuItem>
          <ListItemText>
            <DownloadForOfflineRounded color="success" className="mx-2" />
          </ListItemText>
          <ListItemText primary={"Download Media"} />
        </MenuItem>
      </Box>
    </>
  );
}

export default CardFeedMore;
