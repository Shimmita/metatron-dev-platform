import {
  GavelRounded,
  InfoRounded,
  PersonAddRounded,
  SecurityRounded
} from "@mui/icons-material";
import { Box, Divider, ListItemText, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
function OptionsMoreLogin({
  setOpenModalInfo,
  setOpenModalTerms,
  handleClose,
  setShowPrivacy,
}) {
  const navigate = useNavigate();
  // navigae to the registration personal
  const handleRegisterPersonal = () => {
    navigate("/auth/register/personal");
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
    // aimes modal to terms of service than privacy 
    setShowPrivacy(false);
    // close the menu item
    handleClose();
  };

  // show modal terms but privacy policy section
  const handleShowingModalTermsPrivacy = () => {
    setOpenModalTerms(true);
    // aims modal to display privacy than terms of services
    setShowPrivacy(true);
    // close the menu item
    handleClose();
  };

  return (
    <Box>
      <MenuItem onClick={handleRegisterPersonal}>
        <ListItemText>
          <PersonAddRounded color="primary" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Register Account</small>} />
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
          <GavelRounded color="secondary" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Terms of Service </small>} />
      </MenuItem>

      <Divider component={"div"} />

      <MenuItem onClick={handleShowingModalTermsPrivacy}>
        <ListItemText>
          <SecurityRounded color="primary" className="mx-2" />
        </ListItemText>
        <ListItemText primary={<small>Privacy and Policy </small>} />
      </MenuItem>
    </Box>
  );
}

export default OptionsMoreLogin;
