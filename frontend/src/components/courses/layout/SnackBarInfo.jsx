import { PlayArrowRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { useSelector } from "react-redux";

export default function SnackBarInfo({
  snackInfo,
  openSnack = true,
  setOpenSnack,
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };
  // snackbar info
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: CustomDeviceTablet() && isTabSideBar ? "right" : "center",
      }}
      open={openSnack}
      autoHideDuration={4000}
      onClose={handleClose}
      message={
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
        >
          <PlayArrowRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2" fontWeight={"bold"}>
            {snackInfo}
          </Typography>
        </Box>
      }
    />
  );
}
