import { Box, Tab, Tabs } from "@mui/material";
import React, { lazy } from "react";
import JobsApplicantsLayout from "./layout/JobsApplicantsLayout";
const JobsAppliedLayout = lazy(() => import("./layout/JobsAppliedLayout"));

function JobsAppliedContainer() {
  const items = Array.from({ length: 10 });
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box height={"90vh"}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab className="fw-bold pe-5" label="Applied Jobs" />
            <Tab className="fw-bold" label="Posted Jobs" />
          </Tabs>
        </Box>
        <Box
          height={"82vh"}
          sx={{
            overflow: "auto",
            // Hide scrollbar for Chrome, Safari and Opera
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for IE, Edge and Firefox
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <React.Fragment>
            {/* jobs applied at 0 */}
            {value === 0 ? (
              <React.Fragment>
                {items.map((_, index) => (
                  <JobsAppliedLayout key={index} />
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* jobs posted by the current user as recruiter */}
                {items.map((_, index) => (
                  <JobsApplicantsLayout key={index} />
                ))}
              </React.Fragment>
            )}
          </React.Fragment>
        </Box>
      </Box>
    </>
  );
}

export default JobsAppliedContainer;
