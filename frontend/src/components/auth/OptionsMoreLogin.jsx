import {
  BusinessRounded,
  InfoRounded,
  PersonRounded,
  PolicyRounded,
} from "@mui/icons-material";
import { Box, Divider, ListItemText, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
function OptionsMoreLogin({
  setOpenModalInfo,
  setOpenModalTerms,
  handleClose,
}) {
  const navigate = useNavigate();
  // navigae to the registration personal
  const handleRegisterPersonal = () => {
    navigate("/auth/register/personal");
  };

  // navigae to the registration business
  const handleRegisterBusiness = () => {
    navigate("/auth/register/business");
  };

  // navigate to the edit mode of the specified post
  const handlePostEdit = () => {
    navigate("/account/posts/edit");
  };

  //handle toggling of the modal accounts
  const handleShowingModalInfo = () => {
    setOpenModalInfo(true);
    // close the menu item
    handleClose();
  };

  // handle toggling of the terms or service modal
  const handleShowingModalTerms = () => {
    setOpenModalTerms(true);
    // close the menu item
    handleClose();
  };

  return (
    <Box>
      <MenuItem onClick={handleRegisterPersonal}>
        <ListItemText>
          <PersonRounded color="primary" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Personal Account</small>} />
      </MenuItem>
      <Divider component={"div"} />

      <MenuItem onClick={handleRegisterBusiness}>
        <ListItemText>
          <BusinessRounded color="primary" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Business Account </small>} />
      </MenuItem>

      <Divider component={"div"} />

      <MenuItem onClick={handleShowingModalInfo}>
        <ListItemText>
          <InfoRounded color="success" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Help Information </small>} />
      </MenuItem>
      <Divider component={"div"} />

      <MenuItem onClick={handleShowingModalTerms}>
        <ListItemText>
          <PolicyRounded color="warning" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Terms of Service </small>} />
      </MenuItem>
    </Box>
  );
}

export default OptionsMoreLogin;
