import { BookmarkRounded } from "@mui/icons-material";
import { Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSidebarRightbar,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
const CreatedContainer = lazy(() => import("./CreatedContainer"));
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

export default function EventsBookMarks() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // simulate loading of requests
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  const dispatch = useDispatch();

  const { isSidebarRighbar } = useSelector((state) => state.appUI);

  useEffect(() => {
    // check the state of the  sidebar and rightbar false it if true
    // show sidebar since can be hidden when user navigates to live event attend thus need restore
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);

  // handle showing of default bottom nav
  useState(() => {
    dispatch(resetDefaultBottomNav());
  });
  return (
    <Box height={"92vh"}>
      <Box
        mb={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        <Typography fontWeight={"bold"} color={"primary"}>
          EVENT BOOKMARKS
        </Typography>
        <BookmarkRounded color="primary" sx={{ width: 20, height: 20 }} />
      </Box>

      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs"
        >
          <StyledTab
            className="ps-3"
            label={
              <Typography className="pe-5 fw-bold" variant="body2">
                Created (Host)
              </Typography>
            }
          />
          <StyledTab
            className="ps-3"
            label={
              <Typography className="ps-5 fw-bold" variant="body2">
                Booked (Join)
              </Typography>
            }
          />
        </StyledTabs>
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
        {isLoadingRequest ? (
          <Box width={"100%"}>
            <Box>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={"70vh"}
              />
            </Box>
          </Box>
        ) : (
          <Box mt={2}>
            {value === 0 && <CreatedContainer />}
            {value === 1 && <p>No bookmarked event</p>}
          </Box>
        )}
      </Box>
    </Box>
  );
}
