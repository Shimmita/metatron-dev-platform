import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AccordionActions, Avatar, Box, Button, Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import Logo from "../../../images/logo_sm.png";

export default function NotifLayout() {
  return (
    <Box>
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Avatar src={Logo} sx={{ width: 30, height: 30 }} alt={"image"} />
            <Typography
              variant="body2"
              fontWeight={"bold"}
              color={"text.secondary"}
            >
              Explore Live Events
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color={"text.secondary"}>
            Unlock infinit learning opportunities in the IT industry by
            participating in many learning events of your choice and gain more
            knowledge from experienced tech enthisiasts!
          </Typography>
        </AccordionDetails>

        <AccordionActions>
          <Button
            size="small"
            color="success"
            variant="outlined"
            sx={{ textTransform: "capitalize", borderRadius: "20px" }}
          >
            Explore
          </Button>
          <Button
            size="small"
            color="warning"
            sx={{ textTransform: "capitalize", borderRadius: "20px" }}
          >
            Delete
          </Button>
        </AccordionActions>
      </Accordion>
      <Divider component={"div"} />
    </Box>
  );
}
