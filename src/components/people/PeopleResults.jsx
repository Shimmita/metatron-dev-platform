import React from "react";
import { Box } from "@mui/material";
import PeopleBluePrint from "./PeopleBluePrint";

export default function PeopleResults() {
  const items = Array.from({ length: 20 }, (_, i) => i);

  return (
    <Box spacing={2}>
      <Box display={"flex"} justifyContent={"center"}>
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: 360,
            gap: 1,
            padding: 1,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <>
            {items.map((item, index) => (
              <PeopleBluePrint key={index} />
            ))}
          </>
        </Box>
      </Box>
    </Box>
  );
}
