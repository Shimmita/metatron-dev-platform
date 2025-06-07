import { AddOutlined, ArrowForwardRounded, Check, Remove, SchoolRounded } from "@mui/icons-material";
import { Box, Fade, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AccordionLectures({ lectures }) {
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
            <SchoolRounded sx={{ width: 23, height: 23 }} />{" "}
            <Typography variant="body2">Course Topics Outline</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {lectures?.map((val) => (
              <Stack direction={"row"}
               gap={2} 
               alignItems={"center"}
               key={val}
               >
                <ArrowForwardRounded
                  sx={{ width: 20, height: 20 }}
                  color="success"
                />
                <Typography variant="caption">{val}</Typography>
              </Stack>
            ))}

          {/* bonus certs and internship links */}
          <Box mt={2}>
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <Check sx={{ width: 20, height: 20 }} color="success" />
              <Typography variant="caption">Certificate of Completion</Typography>
            </Stack>
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <Check sx={{ width: 20, height: 20 }} color="success" />
              <Typography variant="caption">Internship Connections</Typography>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
