import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSidebarRightbar,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import CardFeed from "../custom/CardFeed";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedDefaultContent = () => {
  // for follow/connect people people
  const items = Array.from({ length: 20 });

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { isSidebarRighbar } = useSelector((state) => state.appUI);

  useState(() => {
    // always default sidebar and rightbar showing for larger screens
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  }, []);

  // handle showing of default bottom nav
  useState(() => {
    dispatch(resetDefaultBottomNav());
  });

  return (
    <Box>
      {items &&
        items.map((_, index) => {
          return (
            <Box key={index}>
              <Box className="mb-3">
                {/* corousel of top pics */}
                {(CustomDeviceIsSmall() || CustomDeviceTablet()) &&
                index === 0 ? (
                  <MobileTabCorousel />
                ) : null}
              </Box>

              <Box>
                {/* feed card containing posts */}
                <CardFeed />
              </Box>
              {/* show refresh button when the item is last */}
              {index === items.length - 1 && (
                <Box display={"flex"} justifyContent={"center"} m={2}>
                  <Button
                    className="rounded-5"
                    size="medium"
                    sx={{ textTransform: "capitalize" }}
                    variant="contained"
                  >
                    Browse
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default FeedDefaultContent;
