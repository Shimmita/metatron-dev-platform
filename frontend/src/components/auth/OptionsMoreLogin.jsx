import {
  GavelRounded,
  InfoRounded,
  PersonAddRounded,
  SecurityRounded,
} from "@mui/icons-material";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function OptionsMoreLogin({
  setOpenModalInfo,
  setOpenModalTerms,
  handleClose,
  setShowPrivacy,
}) {
  const navigate = useNavigate();

  const handleRegisterPersonal = () => {
    navigate("/auth/register/personal");
    handleClose();
  };

  const handleShowingModalInfo = () => {
    setOpenModalInfo(true);
    handleClose();
  };

  const handleShowingModalTerms = () => {
    setOpenModalTerms(true);
    setShowPrivacy(false);
    handleClose();
  };

  const handleShowingModalTermsPrivacy = () => {
    setOpenModalTerms(true);
    setShowPrivacy(true);
    handleClose();
  };

  // reusable menu item
  const MenuOption = ({ icon, label, onClick }) => (
    <MenuItem
      onClick={onClick}
      sx={{
        borderRadius: "10px",
        mx: 1,
        my: 0.5,
        px: 1.5,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        transition: "0.2s ease",
        "&:hover": {
          background: "rgba(255,255,255,0.08)",
          transform: "translateX(3px)",
        },
      }}
    >
      {icon}

      <Typography fontSize={13} fontWeight={500}>
        {label}
      </Typography>
    </MenuItem>
  );

  return (
    <Box px={1} py={1}>
      <MenuOption
        icon={<PersonAddRounded color="primary" />}
        label="Register Account"
        onClick={handleRegisterPersonal}
      />

      <Divider sx={{ my: 0.5, opacity: 0.3 }} />

      <MenuOption
        icon={<InfoRounded color="success" />}
        label="Help Information"
        onClick={handleShowingModalInfo}
      />

      <Divider sx={{ my: 0.5, opacity: 0.3 }} />

      <MenuOption
        icon={<GavelRounded color="secondary" />}
        label="Terms of Service"
        onClick={handleShowingModalTerms}
      />

      <Divider sx={{ my: 0.5, opacity: 0.3 }} />

      <MenuOption
        icon={<SecurityRounded color="primary" />}
        label="Privacy Policy"
        onClick={handleShowingModalTermsPrivacy}
      />
    </Box>
  );
}

export default OptionsMoreLogin;