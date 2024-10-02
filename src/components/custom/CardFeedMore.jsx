import {
  CloudDownloadRounded,
  CopyAllRounded,
  PersonAddRounded,
  ShareRounded,
} from "@mui/icons-material";
import { Box, ListItemButton, ListItemText, MenuItem } from "@mui/material";
import React from "react";
function CardFeedMore() {
  return (
    <>
      <Box borderRadius={5}>
        <MenuItem>
          <ListItemButton LinkComponent={"a"} href="#home">
            <ListItemText>
              <CopyAllRounded color="primary" className="mx-2" />
            </ListItemText>
            <ListItemText primary={<small>copy this link</small>} />
          </ListItemButton>
        </MenuItem>

        <MenuItem>
          <ListItemButton LinkComponent={"a"} href="#home">
            <ListItemText>
              <PersonAddRounded color="primary" className="mx-2" />
            </ListItemText>
            <ListItemText primary={<small>follow devshim</small>} />
          </ListItemButton>
        </MenuItem>
        <MenuItem>
          <ListItemButton LinkComponent={"a"} href="#home">
            <ListItemText>
              <CloudDownloadRounded color="primary" className="mx-2" />
            </ListItemText>
            <ListItemText primary={<small>download media</small>} />
          </ListItemButton>
        </MenuItem>
      </Box>
    </>
  );
}

export default CardFeedMore;
