import {
  PeopleRounded,
  SchoolRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import { Backdrop, Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import BasicSpeedDial from "../custom/SpeedDial";
import useScrolledDown from "../hooks/useScrolledDown";
import ConnectRequest from "./ConnectRequest";
import RightBarEvents from "./RightBarEvents";
import TopDailyPosts from "./TopDailyPost";

const RightbarAll = ({ mode }) => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  // redux states
  const { isScrolledDown, isSidebarRighbar } = useSelector(
    (state) => state.appUI
  );

  // run the listening component hook
  useScrolledDown();

  return (
    <Box
      flex={2}
      marginRight={window.screen.availWidth > 1200 ? "5%" : "0"}
      p={2}
      sx={{
        display: {
          xs: "none",
          sm: "none",
          md: isSidebarRighbar ? "block" : "none",
        },
      }}
    >
      <Box position={"fixed"} color={"text.primary"} className="mt-0">
        {/* connection requests */}
        <Box
          bgcolor={"background.default"}
          className="shadow rounded pe-2 mb-3 "
        >
          <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
            <Typography
              display={"flex"}
              gap={3}
              fontWeight={"bold"}
              gutterBottom
              color={"primary"}
            >
              <span className="pt-1">CONNECT REQUEST</span>
              <PeopleRounded />
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <ConnectRequest />
          </Box>
        </Box>
        {/* trending post */}
        <Box bgcolor={"background.default"} className="shadow rounded pe-2 ">
          <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
            <Typography
              display={"flex"}
              gap={4}
              fontWeight={"bold"}
              color={"primary"}
            >
              <span className="pt-1">TRENDING POSTS</span>
              <WhatshotRounded />
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"center"}>
            <TopDailyPosts />
          </Box>
        </Box>

        {/* events */}

        <Box bgcolor={"background.default"} className="shadow mt-3 rounded ">
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              display={"flex"}
              gap={3}
              fontWeight={"bold"}
              gutterBottom
              color={"primary"}
            >
              <span className="pt-1">LEARNING EVENTS</span>{" "}
              <SchoolRounded sx={{ width: 24, height: 24 }} />
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"center"} mt={1}>
            <RightBarEvents />
          </Box>
        </Box>
      </Box>

      {/* display speed dial in feed section only for mobile and no landscape */}
      {window.screen.availWidth > 900 && (
        <Box>
          {/* show speed dial if not scrolling down */}
          {!isScrolledDown && (
            <>
              <Backdrop open={openBackdrop} />
              <Box position={"fixed"} sx={{ left: 0, right: 1, bottom: 55 }}>
                <BasicSpeedDial setOpenBackdrop={setOpenBackdrop} />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RightbarAll;
