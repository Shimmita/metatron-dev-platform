import { LiveTvRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { lazy } from "react";
import { useDispatch } from "react-redux";
import { handleScrolledDown } from "../../redux/AppUI";
const LiveLayout = lazy(() => import("./layout/LiveLayout"));

const EventsLive = () => {
  // array for live events simulation
  const items = Array.from({ length: 10 }, (_, i) => i);
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();

  dispatch(handleScrolledDown(true));
  return (
    <>
      <Box bgcolor={"background.default"} height={"92vh"}>
        <Box
          mb={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          position={"sticky"}
        >
          <Typography fontWeight={"bold"} color={"primary"} className="pt-1">
            LIVE EVENTS
          </Typography>
          <LiveTvRounded color="warning" sx={{ width: 23, height: 23 }} />
        </Box>

        <Box
          height={"80vh"}
          sx={{
            overflow: "auto",
            // Hide scrollbar for Chrome, Safari and Opera
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for IE, Edge and Firefox
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box mt={1}>
            {items.length > 0 &&
              items.map((items, index) => (
                <Box key={index}>
                  <LiveLayout />
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EventsLive;
