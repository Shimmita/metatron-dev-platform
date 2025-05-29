import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { MenuItem, Stack, TextField } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import React from "react";
import AllCountries from "../data/AllCountries";
import SubsectionJob from "../data/SubsectionJobs";

const datePostedArray = [
  "Today",
  "Yesterday",
  "Three Days",
  "One Week",
  "Two Weeks",
];
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function AccordionSearchOptions({
  country,
  setCountry,
  entry,
  setJobEntry,
  datePosted,
  setDatePosted,
  isFetching,
  successMessage,
  errorMessage,
}) {
  const [expanded, setExpanded] = React.useState(false);

  // countries
  const countriesOption = AllCountries.map((val) => {
    let country = val.label;
    return country;
  }).sort((a, b) => a.localeCompare(b));

  const handleChange = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" />
        <AccordionDetails>
          <Stack gap={2} display={"flex"} justifyContent={"center"}>
            {/* date posted */}
            <TextField
              variant="standard"
              select
              value={datePosted}
              disabled={isFetching || errorMessage || successMessage}
              label="Period"
              fullWidth
              onChange={(e) => setDatePosted(e.target.value)}
            >
              {datePostedArray?.map((expert_level) => (
                  <MenuItem key={expert_level} value={expert_level}>
                    <small style={{ fontSize: "small" }}>{expert_level}</small>
                  </MenuItem>
                ))}
            </TextField>

            {/* level of entry */}
            <TextField
              variant="standard"
              select
              value={entry}
              label="Expertise"
              disabled={isFetching || errorMessage || successMessage}
              fullWidth
              onChange={(e) => setJobEntry(e.target.value.trim())}
            >
              {SubsectionJob?.Expert_Level.map((expert_level) => (
                  <MenuItem key={expert_level} value={expert_level?.split(" ")[0]}>
                    <small style={{ fontSize: "small" }}>{expert_level}</small>
                  </MenuItem>
                ))}
            </TextField>
            {/* country */}
            <TextField
              variant="standard"
              select
              value={country}
              label="Location"
              disabled={isFetching || errorMessage || successMessage}
              fullWidth
              onChange={(e) => setCountry(e.target.value?.trim())}
            >
              {countriesOption?.map((documents_req) => (
                  <MenuItem key={documents_req} value={documents_req}>
                    <small style={{ fontSize: "small" }}>{documents_req}</small>
                  </MenuItem>
                ))}
            </TextField>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
