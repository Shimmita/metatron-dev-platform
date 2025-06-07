import {
  AddOutlined,
  CallOutlined,
  EmailOutlined,
  GitHub,
  LinkedIn,
  Remove,
  SchoolOutlined,
  SupportAgentRounded
} from "@mui/icons-material";
import { Avatar, Box, Fade, IconButton, Tooltip } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import InstructorLogo from "../../../images/dev.jpeg";

export default function AccordionInstructor({ instructor }) {
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
          {!expanded ? (
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <SupportAgentRounded sx={{ width: 24, height: 24 }} />
              <Typography variant="body2">Instructor Details</Typography>
            </Box>
          ) : (
            <Box
              display={"flex"}
              gap={2}
              width={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <SupportAgentRounded sx={{ width: 20, height: 20 }} />
              <Typography variant="body2">Instructor Details</Typography>
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails>
          {/* image+name */}
          <Box display={"flex"} justifyContent={"center"}>
            <Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Avatar
                  src={InstructorLogo}
                  sx={{ width: 50, height: 50 }}
                  alt={"image"}
                />
              </Box>
              <Box width={"100%"}>
              {/* instructors name */}
                <Typography
                  gutterBottom
                  textAlign={"center"}
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  variant="caption"
                >
                  {instructor}
                </Typography>
                <br/>
                {/* instructor specialisation */}
                <Typography
                  textAlign={"center"}
                  variant="caption"
                  gutterBottom
                  color="text.secondary"
                >
                  Cybersecurity Engineer
                </Typography>
                {/* instructor handles and more courses */}
                <Box 
                mt={1}
                display={"flex"} 
                alignItems={'center'}
                gap={1}
                >
                  {/* email */}
                  <Tooltip title={'email'} arrow>
                  <IconButton>
                    <EmailOutlined sx={{ width:15,height:15 }}/>
                  </IconButton>
                  </Tooltip>

                  {/* call */}
                  <Tooltip title={'call'} arrow>
                  <IconButton>
                    <CallOutlined sx={{ width:15,height:15 }}/>
                  </IconButton>
                  </Tooltip>

                  {/* github */}
                  <Tooltip title={'GitHub'} arrow>
                  <IconButton>
                    <GitHub sx={{ width:15,height:15 }}/>
                  </IconButton>
                  </Tooltip>

                  {/* linkedin */}
                  <Tooltip title={'LinkedIn'} arrow>
                  <IconButton>
                    <LinkedIn sx={{ width:15,height:15 }}/>
                  </IconButton>
                  </Tooltip>

                  {/* more courses */}
                  <Tooltip title={'other courses'}>
                  <IconButton >
                    <SchoolOutlined sx={{ width:15,height:15 }}/>
                  </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
