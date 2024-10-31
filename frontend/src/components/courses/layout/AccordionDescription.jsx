import { DescriptionRounded } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AccordionDescription({ description }) {
  return (
    <Box>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <DescriptionRounded sx={{ width: 24, height: 24 }} />{" "}
            <Typography variant="body2">Course Description</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">{description}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
