import React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 20,
    width: "100%",
    backgroundColor: "transparent",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.caption,
    fontSize: theme.typography.pxToRem(13),
    padding: theme.typography.pxToRem(20),

    color: "gray",
    "&.Mui-selected": {
      color: "inherit",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function HelpReportUserTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <>
        <div className="d-flex justify-content-center w-100 align-items-center">
          {/* title */}
          <Typography
            variant={"caption"}
            className="w-100 fw-light text-center"
          >
            Help Center Report User
          </Typography>
        </div>
        {/* tabs */}
        <Box className="border-bottom p-0 d-flex justify-content-center align-items-center">
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="styled tabs"
            className="fw-light"
          >
            <StyledTab label={<Typography variant="body2">post</Typography>} />
            <StyledTab
              label={<Typography variant="body2">history</Typography>}
            />
            <StyledTab
              label={<Typography variant="body2">resolved</Typography>}
            />
          </StyledTabs>
        </Box>
      </>

      {/* content of each tab goes here */}
      <Box height={"70vh"}>
        {value === 0 && <p>Post Report</p>}
        {value === 1 && <p>Comment Report</p>}
      </Box>
    </Box>
  );
}
