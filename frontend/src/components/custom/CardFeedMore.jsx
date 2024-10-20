import {
  CopyAllRounded,
  DownloadForOfflineRounded,
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
            <CopyAllRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Copy Post Link </small>} />
        </MenuItem>

        <MenuItem>
          <ListItemText>
            <PersonAddRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Follow Shimmita</small>} />
        </MenuItem>
        <MenuItem>
          <ListItemText>
            <DownloadForOfflineRounded color="success" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Download Media</small>} />
        </MenuItem>
      </Box>
    </>
  );
}

export default CardFeedMore;
