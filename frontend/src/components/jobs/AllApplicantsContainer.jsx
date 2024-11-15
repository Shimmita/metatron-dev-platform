import { Box, Tab, Tabs } from "@mui/material";
import React, { lazy } from "react";
import CustomTabsWidth from "../utilities/CustomTabsWidth";
const AlertFeedbackApplicants = lazy(() =>
  import("../alerts/AlertFeedbackApplicants")
);
const AllApplicantsLayout = lazy(() => import("./layout/AllApplicantsLayout"));

function AllApplicantsContainer() {
  const items = Array.from({ length: 10 });
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box height={"90vh"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          maxWidth={CustomTabsWidth()}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            variant="scrollable"
          >
            <Tab className="fw-bold" label="All 200" />
            <Tab className="fw-bold" label="Rejected 100" />
            <Tab className="fw-bold" label="Proceed 50" />
          </Tabs>
        </Box>
        <Box
          height={"80vh"}
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
                  <AllApplicantsLayout key={index} index={index + 1} />
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>not available</p>
              </React.Fragment>
            )}
          </React.Fragment>
        </Box>
        {/* show alert notification */}
        <AlertFeedbackApplicants />
      </Box>
    </>
  );
}

export default AllApplicantsContainer;
