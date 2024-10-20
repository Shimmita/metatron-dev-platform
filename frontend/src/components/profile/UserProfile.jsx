import {
  Diversity3Rounded,
  LaptopRounded,
  Message,
  PersonAdd,
  StarRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import devImage from "../../images/dev.jpeg";
import { handleScrolledDown } from "../../redux/AppUI";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
const UserPost = lazy(() => import("./UserPostContainer"));
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

  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleScrolledDown(true));
  });

  // handle going back using history
  const handleGoBack = () => {
    window.history.back();
  };

  // simulate loading of requests
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);

  return (
    <Box
      height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}
      color={"text.primary"}
    >
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          className="shadow"
          variant="text"
          onClick={handleGoBack}
          sx={{ borderRadius: "20px" }}
        >
          Back
        </Button>
      </Box>

      <Box
        height={"78vh"}
        className="shadow rounded p-1"
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
        {isLoadingRequest ? (
          <Box width={"100%"}>
            <Box display={"flex"} justifyContent={"center"} mb={1}>
              <Skeleton
                animation="wave"
                variant="circular"
                width={60}
                height={60}
              />
            </Box>

            <Box>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={"70vh"}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Box>
              <Box display={"flex"} mt={1} justifyContent={"center"}>
                <Avatar
                  src={devImage}
                  alt="user-image"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>

              <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Typography fontWeight={"bold"} mt={1} variant="body1">
                  Shimmita Douglas
                </Typography>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                mb={2}
                gap={1}
                alignItems={"center"}
              >
                <LaptopRounded sx={{ width: 17, height: 17 }} />
                <Typography color={"text.secondary"} variant="body2">
                  Software Engineer
                </Typography>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                mb={2}
                gap={1}
                alignItems={"center"}
              >
                <StarRounded sx={{ width: 20, height: 20 }} />
                <Typography color={"text.secondary"} variant="body2">
                  Nodejs | Python | React | Android
                </Typography>
              </Box>

              <Divider component={"div"} />

              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                m={2}
              >
                <Tooltip arrow title={"connect"}>
                  <Button
                    disableElevation
                    startIcon={<PersonAdd />}
                    sx={{ borderRadius: 5, fontWeight: "bold" }}
                  >
                    <Typography variant="body2">
                      <small
                        style={{
                          fontSize: "small",
                          textTransform: "capitalize",
                        }}
                      >
                        connect
                      </small>
                    </Typography>
                  </Button>
                </Tooltip>

                <Tooltip arrow title={"network"}>
                  <Button
                    disableElevation
                    startIcon={<Diversity3Rounded />}
                    sx={{ borderRadius: 5, fontWeight: "bold" }}
                  >
                    <Typography variant="body2">
                      <small
                        style={{
                          fontSize: "small",
                          textTransform: "capitalize",
                        }}
                      >
                        300
                      </small>
                    </Typography>
                  </Button>
                </Tooltip>

                <Tooltip arrow title={"send message"}>
                  <Button
                    disableElevation
                    startIcon={<Message />}
                    sx={{ borderRadius: 5, fontWeight: "bold" }}
                  >
                    <Typography variant="body2">
                      <small
                        style={{
                          fontSize: "small",
                          textTransform: "capitalize",
                        }}
                      >
                        Message
                      </small>
                    </Typography>
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Divider component={"div"} />

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
        )}
      </Box>
    </Box>
  );
}
