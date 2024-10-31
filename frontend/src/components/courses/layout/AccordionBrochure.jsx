import {
  DownloadForOfflineRounded,
  MenuBookRounded,
  PictureAsPdfRounded
} from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AccordionActions, Box, Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AccordionBrochure({ brochure }) {
  return (
    <Box>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <PictureAsPdfRounded
              color="warning"
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2">Download Brochure</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Download or view the course brochure from the options provided
            below.
          </Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button
            startIcon={<MenuBookRounded />}
            color="success"
            sx={{
              borderRadius: "20px",
              fontSize: "12px",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            View Mode
          </Button>

          <Button
            startIcon={<DownloadForOfflineRounded />}
            color="success"
            sx={{
              borderRadius: "20px",
              fontSize: "12px",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            Download
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}