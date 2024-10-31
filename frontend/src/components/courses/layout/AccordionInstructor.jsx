import {
  EmailRounded,
  GitHub,
  OpenInBrowserRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar, Box, Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import InstructorLogo from "../../../images/dev.jpeg";

export default function AccordionInstructor({ instructor }) {
  return (
    <Box>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <SupportAgentRounded sx={{ width: 24, height: 24 }} />
            <Typography variant="body2">Instructor Details</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* image+name */}
          <Box mt={1} display={"flex"} justifyContent={"center"}>
            <Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Avatar src={InstructorLogo} alt={"image"} />
              </Box>

              <Box display={"flex"} justifyContent={"center"}>
                <Typography mt={1} variant="body2" >
                  {instructor}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* github */}
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Button
                sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                size="small"
                startIcon={<GitHub />}
              >
                GitHub
              </Button>
            </Box>
            {/* website */}
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Button
                sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                size="small"
                startIcon={<OpenInBrowserRounded />}
              >
                Website
              </Button>
            </Box>

            {/* email */}
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Button
                sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                size="small"
                startIcon={<EmailRounded />}
              >
                Email
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
