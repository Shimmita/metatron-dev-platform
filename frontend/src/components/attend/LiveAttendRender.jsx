import { Box } from "@mui/material";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleDefaultBottomNav,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const LaptopDesktop = lazy(() => import("./devices/LaptopDesktop"));
const MobileTablet = lazy(() => import("./devices/MobileTablet"));

export default function LiveAttendRender() {
  const dispatch = useDispatch();
  // redux states access
  const { isSidebarRighbar, isDefaultBottomNav } = useSelector(
    (state) => state.appUI
  );
  // check the state of the  sidebar and rightbar false it if true
  // be no showing due to limited space and UI spreading fitness
  if (isSidebarRighbar) {
    dispatch(handleSidebarRightbar());
  }

  // hide showing of the default bottom nav
  useState(() => {
    if (isDefaultBottomNav) {
      dispatch(handleDefaultBottomNav());
    }
  });

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
