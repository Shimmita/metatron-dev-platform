import { Diversity3Rounded, PersonAddRounded } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  Pagination,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetDefaultBottomNav } from "../../../redux/AppUI";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomLandScape from "../../utilities/CustomLandscape";
const FriendsContainer = lazy(() => import("./friends/FriendsContainer"));
const FriendsConnectContainer = lazy(() =>
  import("./friends/FriendsConnectContainer")
);

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

export default function AccountFriends() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // redux to stop showing of the speed dial
  const dispatch = useDispatch();

  // use effect hook
  useEffect(() => {
    // track scrolled down
    dispatch(resetDefaultBottomNav(true));
  });

  return (
    <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
      <Suspense
        fallback={
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <CircularProgress size={"2rem"} />
          </Box>
        }
      >
        <Box p={2} className="shadow rounded">
          <Box className="d-flex justify-content-center align-items-center">
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="styled tabs"
            >
              <StyledTab
                className="me-5"
                label={
                  <Button
                    color="inherit"
                    startIcon={<Diversity3Rounded />}
                    style={{
                      textTransform: "capitalize",
                      fontSize: "medium",
                      fontWeight: "bold",
                    }}
                  >
                    Network
                  </Button>
                }
              />

              <StyledTab
                label={
                  <Button
                    color="inherit"
                    endIcon={<PersonAddRounded />}
                    style={{
                      textTransform: "capitalize",
                      fontSize: "medium",
                      fontWeight: "bold",
                    }}
                  >
                    Connect
                  </Button>
                }
              />
            </StyledTabs>
          </Box>
          <Divider className="m-2" component={"div"} />
          <Box
            height={CustomLandScape() ? "62vh" : "70vh"}
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
            {/* content of each tab goes here */}
            <Box>
              <Box>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box className="w-auto">
                    {value === 0 && <FriendsContainer />}
                    {value === 1 && <FriendsConnectContainer />}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* pagination */}
          <Box mt={3} display={"flex"} justifyContent={"center"}>
            <Pagination
              size={
                CustomDeviceIsSmall()
                  ? "small"
                  : CustomLandScape()
                  ? "medium"
                  : "large"
              }
              count={500}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Box>
      </Suspense>
    </Box>
  );
}
