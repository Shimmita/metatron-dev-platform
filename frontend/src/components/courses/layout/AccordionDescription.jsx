import { AddOutlined, DescriptionRounded, Remove } from "@mui/icons-material";
import { Box, Fade } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AccordionDescription({ description }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Box>
      <Accordion
        elevation={0}
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 1000 } }}
        sx={[
          expanded
            ? {
                "& .MuiAccordion-region": {
                  height: "auto",
                },
                "& .MuiAccordionDetails-root": {
                  display: "block",
                },
              }
            : {
                "& .MuiAccordion-region": {
                  height: 0,
                },
                "& .MuiAccordionDetails-root": {
                  display: "none",
                },
              },
        ]}
      >
        <AccordionSummary
          expandIcon={expanded ? <Remove sx={{ width:18,height:18 }}/> :<AddOutlined sx={{ width:18,height:18 }} />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <DescriptionRounded sx={{ width: 22, height: 22 }} />{" "}
            <Typography variant="body2">Course Description</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="caption">{description}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
