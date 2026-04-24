import { PlayArrowRounded, InfoRounded } from "@mui/icons-material";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const SnackBarInfo = ({
  snackInfo,
  openSnack = true,
  setOpenSnack,
  isManagementSnack = false,
  setIsManagementSnack,
  managementMSG = "",
}) => {
  const { isTabSideBar } = useSelector((state) => state.appUI);

  const isOpen = isManagementSnack || openSnack;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    if (isManagementSnack) {
      setIsManagementSnack(false);
    } else {
      setOpenSnack(false);
    }
  };

  const message = isManagementSnack
    ? managementMSG
    : snackInfo || "Courses include completion certificates";

  const icon = isManagementSnack ? (
    <InfoRounded sx={{ width: 18, height: 18 }} />
  ) : (
    <PlayArrowRounded sx={{ width: 20, height: 20 }} />
  );

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3500}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal:
          CustomDeviceTablet() && isTabSideBar ? "right" : "center",
      }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        icon={icon}
        sx={{
          borderRadius: "12px",
          backdropFilter: "blur(12px)",
          background: "rgba(20,210,190,0.1)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontSize={13} fontWeight={600}>
            {message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default React.memo(SnackBarInfo);