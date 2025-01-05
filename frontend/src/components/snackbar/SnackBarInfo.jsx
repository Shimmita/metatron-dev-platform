import { PlayArrowRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

export default function SnackBarInfo({
  snackInfo,
  openSnack = true,
  setOpenSnack,
  isManagementSnack = false,
  setIsManagementSnack,
  managementMSG = "",
}) {
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  const [openSnackLast, setOpenSnackLast] = useState(false);
  const [lastShown, setLastShown] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
    // open the snack last if not shown previously
    if (!lastShown) {
      setOpenSnackLast(true);
    }
  };

  // handle closing of cert+intern info snack displya
  const handleCLosingSnackLast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackLast(false);
    // close the parent snack
    setOpenSnack(false);
    // set last is shown to true
    setLastShown(true);
  };

  // close management snack
  const handleCloseManagementSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // close the snack bar
    setIsManagementSnack(false);
  };

  return (
    <React.Fragment>
      {/* for course management info */}
      {isManagementSnack ? (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal:
              CustomDeviceTablet() && isTabSideBar ? "right" : "center",
          }}
          open={isManagementSnack}
          autoHideDuration={3000}
          onClose={handleCloseManagementSnack}
          message={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={1}
            >
              <Typography variant="body2" fontWeight={"bold"}>
                {managementMSG}
              </Typography>
            </Box>
          }
        />
      ) : (
        <React.Fragment>
          {/* for course selection option and default info */}
          {openSnackLast && !lastShown ? (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal:
                  CustomDeviceTablet() && isTabSideBar ? "right" : "center",
              }}
              open={openSnackLast}
              autoHideDuration={3000}
              onClose={handleCLosingSnackLast}
              message={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Typography variant="body2" fontWeight={"bold"}>
                    paid courses have certficate of completion
                  </Typography>
                </Box>
              }
            />
          ) : (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal:
                  CustomDeviceTablet() && isTabSideBar ? "right" : "center",
              }}
              open={openSnack}
              autoHideDuration={4000}
              onClose={handleClose}
              message={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
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
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
