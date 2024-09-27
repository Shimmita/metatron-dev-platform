import { Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleScrolledDown } from "../../redux/AppUI";
import LiveLayout from "./layout/LiveLayout";

const EventsLive = () => {
  // array for live events simulation
  const items = Array.from({ length: 10 }, (_, i) => i);
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();

  dispatch(handleScrolledDown(true));
// dark mode
  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <>
      <Box p={2} bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}>
        {items.length > 0 &&
          items.map((items, index) => (
            <Box key={index}>
              <LiveLayout />
            </Box>
          ))}
      </Box>
    </>
  );
};

export default EventsLive;
