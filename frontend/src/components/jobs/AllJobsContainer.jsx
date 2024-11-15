import { Box, Divider, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertJobSearch from "../alerts/AlertJobSearch";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomTabsWidth from "../utilities/CustomTabsWidth";
import JobsAppliedContainer from "./JobsAppliedContainer";
import JobLayout from "./layout/JobLayout";

export default function AllJobsContainer() {
  const [openAlert, setOpenAlert] = useState(false);
  // array items
  const jobs = Array.from({ length: 20 });
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  // tab controls
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // open alert
    if (value === 2) {
      setOpenAlert(true);
    }
  }, [value]);

  return (
    <Box height={"90vh"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        width={CustomTabsWidth()}
        minWidth={"100%"}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant="scrollable"
          scrollButtons="auto"
          aria-label="tab bar"
        >
          {/* constant tabs */}
          <Tab
            className="fw-bold"
            label={"All Jobs"}
            aria-label={"all available jobs"}
          />
          <Tab
            className="fw-bold"
            label={"Manage Jobs"}
            aria-label={"view job application history"}
          />

          <Tab
            className="fw-bold"
            label={"Search"}
            aria-label={"search for jobs "}
          />
        </Tabs>
      </Box>

      {/* container scrollable */}
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
          {/* all jobs */}
          {value === 0 && (
            <>
              {jobs.map((_, index) => (
                <>
                  <JobLayout key={index} isDarkMode={isDarkMode} />
                  {/* divider */}
                  {isDarkMode && !CustomDeviceIsSmall() && (
                    <Box display={"flex"} justifyContent={"center"} mb={2}>
                      <Divider component={"div"} className={"w-75"} />
                    </Box>
                  )}
                  {CustomDeviceIsSmall() && (
                    <Box display={"flex"} justifyContent={"center"} mb={2}>
                      <Divider component={"div"} className={"w-100"} />
                    </Box>
                  )}
                </>
              ))}
            </>
          )}

          {/* manage jobs */}
          {value === 1 && (
            <Box mt={2}>
              <JobsAppliedContainer />
            </Box>
          )}
        </React.Fragment>
      </Box>

      {/* show job search alert */}
      <AlertJobSearch
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setValue={setValue}
      />
    </Box>
  );
}
