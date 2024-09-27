import { Backdrop, Box, Divider, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import BasicSpeedDial from "../custom/SpeedDial";
import useScrolledDown from "../hooks/useScrolledDown";
import RightBarEvents from "./RightBarEvents";
import TopDailyPosts from "./TopDailyPost";

const RightbarAll = ({ mode }) => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const { isScrolledDown } = useSelector((state) => state.appUI);

  // run the listening component hook
  useScrolledDown();

  // return the best width for the rightbar
  return (
    <Box
      flex={2}
      marginRight={window.screen.availWidth > 1200 ? "5%" : "0"}
      p={2}
      sx={{ display: { xs: "none", sm: "none", md: "none" } }}
    >
      <Box position={"fixed"} color={"text.primary"} className="mt-0">
        <Box bgcolor={"background.default"} className="shadow rounded pe-2 ">
          <Box display={"flex"} justifyContent={"center"}>
            <Typography fontWeight={"bold"} color={"primary"} className="mt-2">
              TOP TRENDING POST
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <TopDailyPosts />
          </Box>
        </Box>
        {/* show divider in dark mode */}
        {mode === "dark" && (
          <Divider component={"div"} variant="inset" className="p-2" />
        )}

        <Box bgcolor={"background.default"} className="shadow mt-3 rounded ">
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              fontWeight={"bold"}
              gutterBottom
              color={"primary"}
              className="mt-2"
            >
              EVENTS AND COURSES
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
