import { Box } from "@mui/material";
import React from "react";
import CreatedEvent from "./layout/CreatedEvent";

const CreatedContainer = () => {
  // array for live events simulation
  const items = Array.from({ length: 20 }, (_, i) => i);

  return (
    <>
      <Box bgcolor={"background.default"}>
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
