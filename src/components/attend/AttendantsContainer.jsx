import { Box } from "@mui/material";
import React from "react";
import AttendantsLayout from "./AttendantsLayout";

function AttendantsContainer() {
  // array simulation of the attendants
  const attendants = Array.from({ length: 30 }, (_, i) => i);
  return (
    <Box
      className="attendants-container"
      sx={{
        overflowX: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {attendants &&
        attendants.map((attendant, index) => (
          <Box key={index} className='shadow rounded'>
            {/* current attendant */}
            <AttendantsLayout index={index + 1} />
          </Box>
        ))}
    </Box>
  );
}

export default AttendantsContainer;
