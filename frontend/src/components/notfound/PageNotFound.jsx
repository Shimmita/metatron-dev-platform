import { MoodBadRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  handleSidebarRightbar,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const PageNotFound = ({ mesage = "" }) => {
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();

  // redux states access
  const { isSidebarRighbar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);

  // check the state of the  sidebar and rightbar false it if true
  // be no showing due to limited space and UI spreading fitness

  useEffect(() => {
    if (user && !isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
      dispatch(resetDefaultBottomNav(true));
    }
    return;
  });
  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      height={"90vh"}
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        p={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ border: "1px solid", borderColor: "divider" }}
        className={(CustomDeviceIsSmall()|| CustomDeviceTablet()) && "shadow"}
      >
        <Box>
          <Box mb={1} display={"flex"} justifyContent={"center"}>
            <MoodBadRounded sx={{ width: 30, height: 30 }} color="primary" />
          </Box>
          <Box>
            <Typography textAlign={"center"} variant="h5">
              Page Not Found !
            </Typography>
          </Box>

          {/* display error message here */}
          <Box display={"flex"} justifyContent={"center"}>
            <Typography variant="body2" color={"text.secondary"}>
              {mesage}
            </Typography>
          </Box>
          <hr />
          <Typography
            variant="body1"
            color={"text.secondary"}
            textAlign={"center"}
            display={"flex"}
            gap={1}
            alignItems={"center"}
          >
            Go Back
            <Link
              style={{ textDecoration: "none", fontWeight: "bold" }}
              to={"/"}
            >
              Home
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PageNotFound;
