import { ArrowBack, Message, PersonAdd } from "@mui/icons-material";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import { handleScrolledDown } from "../../redux/AppUI";
const UserPost = lazy(() => import("./UserPost"));
const UserAbout = lazy(() => import("./UserAbout"));
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
    padding: theme.typography.pxToRem(2),

    color: "gray",
    "&.Mui-selected": {
      color: "primary",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function UserProfile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // go back exact place on the home page
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };

  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleScrolledDown(true));
  });
  return (
    <Box height={"92vh"} bgcolor={"background.default"} color={"text.primary"}>
      <IconButton onClick={handleHome}>
        <ArrowBack />
      </IconButton>

      <Box
        height={"82vh"}
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
      >
        <Box className="p-2">
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar
              src={devImage}
              alt="user-image"
              sx={{ width: 70, height: 70 }}
            />
          </Box>

          <Box display={"flex"} justifyContent={"center"} mb={2}>
            <Typography className="fw-bold ps-2" variant="body1">
              Young ML
            </Typography>
          </Box>

          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={5}
            m={2}
          >
            <Button
              disableElevation
              startIcon={<PersonAdd />}
              variant="contained"
              sx={{ borderRadius: 5, fontWeight: "bold" }}
              size="small"
            >
              <Typography variant="caption">
                <small style={{ fontSize: "x-small" }}>Follow</small>
              </Typography>
            </Button>

            <Button
              disableElevation
              startIcon={<Message />}
              variant="outlined"
              sx={{ borderRadius: 5, fontWeight: "bold" }}
              size="small"
            >
              <Typography variant="caption">
                <small style={{ fontSize: "x-small" }}>Message</small>
              </Typography>
            </Button>
          </Box>
          <Box display={"flex"} justifyContent={"center"} mb={1}>
            <Typography variant="body2" >
              Life is a gift from God gotta use it well
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"space-between"} mt={1} px={2}>
            <Typography variant="body2">
              Following <span className="ps-1 fw-bold">50k</span>
            </Typography>
            <Typography variant="body2">
              Followers <span className="ps-1 fw-bold">20k</span>
            </Typography>
          </Box>
        </Box>

        <Box className="mt-2 d-flex justify-content-center align-items-center">
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="styled tabs"
          >
            <StyledTab
              className="pe-3"
              label={
                <Typography className="pe-5 fw-bold" variant="body2">
                  Post
                </Typography>
              }
            />
            <StyledTab
              className="ps-3"
              label={
                <Typography className="ps-5 fw-bold" variant="body2">
                  About
                </Typography>
              }
            />
          </StyledTabs>
        </Box>

        {/* content of each tab goes here */}
        <Box>
          <Suspense fallback={<div>loading...</div>}>
            {value === 0 && <UserPost />}
            {value === 1 && <UserAbout />}
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
