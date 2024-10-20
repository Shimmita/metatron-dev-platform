import { LaptopRounded, StarRounded } from "@mui/icons-material";
import { Avatar, Button, Divider, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import devImage from "../../../../images/dev.jpeg";
import { handleScrolledDown } from "../../../../redux/AppUI";
import CustomDeviceIsSmall from "../../../utilities/CustomDeviceIsSmall";
const MyPostContainer = lazy(() => import("./MyPostContainer"));
const MyAbout = lazy(() => import("./MyPostAbout"));
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

export default function MyPostProfile() {
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
    <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          variant="text"
          className="shadow"
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
          msOverflowStyle: "none",
          scrollbarWidth: "none",
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
                <Typography
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  variant="body2"
                >
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
                <Typography
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  variant="body2"
                >
                  Nodejs | Python | React | Android
                </Typography>
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
                {value === 0 && <MyPostContainer />}
                {value === 1 && <MyAbout />}
              </Suspense>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
