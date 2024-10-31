import { Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleScrolledDown } from "../../redux/AppUI";
import CreatedEvent from "./layout/CreatedEvent";

const CreatedContainer = () => {
  // array for live events simulation
  const items = Array.from({ length: 20 }, (_, i) => i);
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  dispatch(handleScrolledDown(true));

  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <>
      <Box bgcolor={isDarkMode ? "background.default" : "##D9D8E7"}>
        {items.length > 0 &&
          items.map((items, index) => (
            <Box key={index}>
              <CreatedEvent />
            </Box>
          ))}
      </Box>
    </>
  );
};

export default CreatedContainer;
