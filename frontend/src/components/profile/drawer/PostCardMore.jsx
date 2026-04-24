import { DeleteRounded, Refresh } from "@mui/icons-material";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import React from "react";

export const PostCardMore = ({
  handleUpdateMyPost,
  handleDeleteMyPost,
}) => {

  const MenuOption = ({ icon, label, onClick, danger = false }) => (
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
          background: danger
            ? "rgba(244,67,54,0.12)"
            : "rgba(255,255,255,0.08)",
          transform: "translateX(3px)",
        },
      }}
    >
      {icon}

      <Typography
        fontSize={13}
        fontWeight={500}
        color={danger ? "error.main" : "text.primary"}
      >
        {label}
      </Typography>
    </MenuItem>
  );

  return (
    <Box px={1} py={1}>
      <MenuOption
        icon={<Refresh sx={{ width: 20, height: 20 }} />}
        label="Update Post"
        onClick={handleUpdateMyPost}
      />

      <Divider sx={{ my: 0.5, opacity: 0.3 }} />

      <MenuOption
        icon={<DeleteRounded sx={{ width: 20, height: 20 }} />}
        label="Delete Post"
        onClick={handleDeleteMyPost}
        danger
      />
    </Box>
  );
};