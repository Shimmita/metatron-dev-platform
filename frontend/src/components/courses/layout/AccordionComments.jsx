import { MessageRounded } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Fade } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import StudentCommentLayout from "./StudentCommentLayout";

export default function AccordionComments({}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const items = Array.from({ length: 4 });

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
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <MessageRounded sx={{ width: 20, height: 20 }} />{" "}
            <Typography variant="body2">Students Comments</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* students comment count */}
          <Box width={"100%"} mb={2} display={"flex"} justifyContent={"center"}>
            <Typography variant="body2" fontSize={"smaller"}>
              {" "}
              {items.length} Students Commented
            </Typography>
          </Box>
          {/* actual comments */}
          {items.map((data, index) => (
            <Box key={index} mb={2}>
              <StudentCommentLayout />

              {/* show more button when its the last element */}
              {items.length - 1 === index && (
                <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "lowercase" }}
                  >
                    more
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
