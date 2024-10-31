import { Check, SchoolRounded } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AccordionLectures({ lectures }) {
  return (
    <Box>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <SchoolRounded sx={{ width: 24, height: 24 }} />{" "}
            <Typography variant="body2">What You Will Learn</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {lectures &&
            lectures.map((val, index) => (
              <Stack direction={"row"} gap={2} alignItems={"center"}>
                <Check sx={{ width: 20, height: 20 }} color="success" />
                <Typography variant="body2">{val}</Typography>
              </Stack>
            ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
