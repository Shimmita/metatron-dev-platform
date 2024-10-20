import {
  DeleteRounded,
  EditRounded,
  OpenInFullRounded,
} from "@mui/icons-material";
import { Box, Divider, ListItemText, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
function OptionsMore() {
  const navigate = useNavigate();
  // navigate to the post details
  const handlePostDetails = () => {
    navigate("/account/posts/details");
  };
  // navigate to the edit mode of the specified post

  const handlePostEdit = () => {
    navigate("/account/posts/edit");
  };

  return (
    <>
      <Box>
        <MenuItem onClick={handlePostDetails}>
          <ListItemText>
            <OpenInFullRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Open</small>} />
        </MenuItem>
        <Divider component={"div"} />

        <MenuItem onClick={handlePostEdit}>
          <ListItemText>
            <EditRounded color="primary" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Edit </small>} />
        </MenuItem>

        <Divider component={"div"} />

        <MenuItem>
          <ListItemText>
            <DeleteRounded color="warning" className="mx-2" />
          </ListItemText>
          <ListItemText primary={<small>Delete </small>} />
        </MenuItem>
      </Box>
    </>
  );
}

export default OptionsMore;
