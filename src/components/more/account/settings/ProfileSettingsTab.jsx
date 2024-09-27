import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { lazy, Suspense } from "react";
const DeleteAccount = lazy(() => import("./DeleteAccountSettings"));
const PrivacySettings = lazy(() => import("./PrivacySettings"));
const DetailsSettings = lazy(() => import("./DetailsSettings"));

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
    padding: theme.typography.pxToRem(0),

    color: "gray",
    "&.Mui-selected": {
      color: "inherit",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function ProfileSettingsTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box height={"92vh"} bgcolor={"background.default"} color={"text.primary"}>
      <Box className="d-flex justify-content-center align-items-center">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs"
          className="fw-light"
        >
          <StyledTab label={<Typography variant="body2">details</Typography>} />
          <StyledTab label={<Typography variant="body2">privacy</Typography>} />
          <StyledTab label={<Typography variant="body2">delete</Typography>} />
        </StyledTabs>
      </Box>

      {/* content of each tab goes here */}
      <Box
        height={"70vh"}
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
        mt={2}
        className="w-100"
      >
        <Suspense fallback={<p className="text-text-center">loading...</p>}>
          {value === 0 && <DetailsSettings />}
          {value === 1 && <PrivacySettings />}
          {value === 2 && <DeleteAccount />}
        </Suspense>
      </Box>
    </Box>
  );
}
