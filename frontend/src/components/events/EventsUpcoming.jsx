import { CalendarMonthRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { lazy } from "react";
import { useDispatch } from "react-redux";
import { handleScrolledDown } from "../../redux/AppUI";
const UpcomingLayout = lazy(() => import("./layout/UpcomingLayout"));

const EventsUpcoming = () => {
  // array for live events simulation
  const items = Array.from({ length: 20 }, (_, i) => i);
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
            UPCOMING EVENTS
          </Typography>
          <CalendarMonthRounded
            color="primary"
            sx={{ width: 22, height: 22 }}
          />
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
                  <UpcomingLayout />
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EventsUpcoming;
