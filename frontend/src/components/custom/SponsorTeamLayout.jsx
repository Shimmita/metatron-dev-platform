import { FavoriteRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

const SponsorTeamLayout = () => {
  return (
    <Box mb={2}>
      <Box display={"flex"} gap={2}>
        {/* fav icon */}
        <FavoriteRounded sx={{ width: 18, height: 18 }} color="primary" />
        {/* name of the sponsor */}
        <Typography variant="body2" color={"text.secondary"}>
          Google Ads
        </Typography>
      </Box>
    </Box>
  );
};

export default SponsorTeamLayout;
