import { ArrowRightAlt, BarChartRounded } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function AccordionJobPostedStats() {
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
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Box
            display={"flex"}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
          >
            {/* charts Icon */}
            <BarChartRounded sx={{ width: 20, height: 20 }} />
            <Typography color={"text.secondary"} variant="body2">
              View Applicants Statistics
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={2}
          >
            {/* total applicants */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              <Typography variant="body2" color={"text.secondary"}>
                Total Applicants
              </Typography>
              {/* number of applicants */}
              <Typography variant="body2" color={"text.secondary"}>
                50
              </Typography>
            </Box>

            {/* male applicants */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
              gap={2}
            >
              <Typography variant="body2" color={"text.secondary"}>
                Total Male Applicants
              </Typography>
              {/* number of applicants */}
              <Typography ml={2} variant="body2" color={"text.secondary"}>
                30
              </Typography>
              {/* arrow right */}
              <ArrowRightAlt />
              {/* percentage */}
              <Typography variant="body2" color={"text.secondary"}>
                60%
              </Typography>
            </Box>
            {/* female applicant */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
              width={"100%"}
            >
              <Typography variant="body2" color={"text.secondary"}>
                Total Female Applicants
              </Typography>
              {/* number of applicants */}
              <Typography variant="body2" color={"text.secondary"}>
                20
              </Typography>
              {/* arrow right */}
              <ArrowRightAlt />
              {/* percentage */}
              <Typography variant="body2" color={"text.secondary"}>
                40%
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
