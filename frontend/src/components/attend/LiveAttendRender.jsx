import { Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import LaptopDesktop from "./devices/LaptopDesktop";
import MobileTablet from "./devices/MobileTablet";
import { handleSidebarRightbar } from "../../redux/AppUI";

export default function LiveAttendRender() {
  const dispatch = useDispatch();
  // redux states access
  const { isSidebarRighbar } = useSelector((state) => state.appUI);

  // check the state of the  sidebar and rightbar false it if true
  // be no showing due to limited space and UI spreading fitness
  if (isSidebarRighbar) {
    dispatch(handleSidebarRightbar());
  }

  return (
    <Box>
      {CustomDeviceIsSmall() || CustomDeviceTablet() ? (
        <MobileTablet />
      ) : (
        <LaptopDesktop />
      )}
    </Box>
  );
}
