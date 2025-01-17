import {
  EmailRounded,
  GitHub,
  OpenInBrowserRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar, Box, Button, Divider, Fade, Rating } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import InstructorLogo from "../../../images/dev.jpeg";

export default function AccordionInstructor({ instructor }) {
  const [expanded, setExpanded] = React.useState(false);
  const items = Array.from(new Array(3));

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
          expandIcon={<ArrowDropDownIcon />}
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
          <Box mt={1} display={"flex"} justifyContent={"center"}>
            <Box>
              <Box mb={1} display={"flex"} justifyContent={"center"}>
                <Avatar
                  src={InstructorLogo}
                  sx={{ width: 50, height: 50 }}
                  alt={"image"}
                />
              </Box>
              {/* instructors name */}
              <Box width={"100%"}>
                <Typography
                  gutterBottom
                  textAlign={"center"}
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  variant="body2"
                >
                  {instructor}
                </Typography>
                {/* instructor specialisation */}
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  gutterBottom
                  color="text.secondary"
                >
                  Cybersecurity Engineer
                </Typography>
                {/* instructor skills */}
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  color="text.secondary"
                >
                  Ethical Hacker | Linux | Python | C++
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Box
              display={"flex"}
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {/* email */}
              <Box display={"flex"} alignItems={"center"}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  size="small"
                  startIcon={<EmailRounded />}
                >
                  Email
                </Button>
              </Box>

              {/* website */}
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  size="small"
                  startIcon={<OpenInBrowserRounded />}
                >
                  Website
                </Button>
              </Box>

              {/* github */}
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  size="small"
                  startIcon={<GitHub />}
                >
                  GitHub
                </Button>
              </Box>
            </Box>
          </Box>

          {/* lectures posted */}
          <Typography
            gutterBottom
            mt={2}
            variant="body2"
            color={"text.secondary"}
          >
            {" "}
            Other Courses
          </Typography>

          {/* list all courses posted by the instructor */}
          <ul>
            {items.map((val, index) => (
              <>
                <Box
                  width={"100%"}
                  display={"flex"}
                  gap={1}
                  p={1}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {/* course name */}
                  <Typography
                    component={"li"}
                    variant="body2"
                    gutterBottom
                    key={index}
                    color="text.secondary"
                  >
                    Reverse Engineering
                  </Typography>

                  {/* rating */}
                  <Rating
                    name="feedback"
                    size="small"
                    value={4}
                    readOnly
                    precision={0.5}
                  />

                  {/* link view */}
                  <Button
                    disableElevation
                    size="small"
                    sx={{ fontSize: "12px", borderRadius: "20px" }}
                  >
                    view
                  </Button>
                </Box>
                {/* divider */}
                {index !== items.length - 1 && (
                  <Divider component={"div"} className="m-1" />
                )}
              </>
            ))}
            {/* see more  button */}
            <Box mt={1} display={"flex"} justifyContent={"center"}>
              <Button
                sx={{ textTransform: "lowercase", borderRadius: "10px" }}
                variant="text"
                size="small"
              >
                more courses
              </Button>
            </Box>
          </ul>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
