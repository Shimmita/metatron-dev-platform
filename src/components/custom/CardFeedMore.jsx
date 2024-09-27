import {
  CopyAllRounded,
  FlagRounded,
  PersonAddRounded,
  ShareRounded
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
              <FlagRounded color="primary" className="mx-2" />
            </ListItemText>
            <ListItemText primary={<small>report this post</small>} />
          </ListItemButton>
        </MenuItem>

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
              <ShareRounded color="primary" className="mx-2" />
            </ListItemText>
            <ListItemText primary={<small>share this post</small>} />
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
      </Box>
    </>
  );
}

export default CardFeedMore;
