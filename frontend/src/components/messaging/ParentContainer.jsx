import {
  AppBar,
  Badge,
  styled,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessagingDrawer } from "../../redux/AppUI";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const ConversationContainer = lazy(() => import("./ConversationsContainer"));
const NotificationContainer = lazy(() => import("./NotificationContainer"));

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
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function ParentContainer() {
  const [value, setValue] = React.useState(0);
  // this will define display of inbox and notif bars appropriately
  const [messageNotifClicked, setMessageNotifClicked] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // redux states
  const { isOpenMessageDrawer } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(showMessagingDrawer());

    // restore message and notif states to default
    setMessageNotifClicked((prev) => (prev === true ? false : false));
  };

  return (
    <React.Fragment>
      <Drawer anchor={"right"} open={isOpenMessageDrawer} onClose={handleClose}>
        <Box
          width={
            CustomDeviceSmallest()
              ? 270
              : CustomDeviceIsSmall()
              ? 330
              : CustomDeviceTablet()
              ? 420
              : 450
          }
          bgcolor={"background.default"}
          height={"100vh"}
        >
          {/* display when message/notif item not clicked */}
          {!messageNotifClicked ? (
            <AppBar position="sticky">
              <Toolbar
                variant="dense"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs"
                  >
                    <StyledTab
                      label={
                        <Badge color="warning" variant="dot" className="me-5">
                          <Typography
                            fontWeight={"bold"}
                            className={value === 0 && "border-bottom pb-1"}
                            variant="body2"
                            sx={{ color: "white" }}
                          >
                            Notification
                          </Typography>
                        </Badge>
                      }
                    />

                    <StyledTab
                      label={
                        <Badge color="warning" variant="dot" className="ms-3">
                          <Typography
                            fontWeight={"bold"}
                            className={value === 1 && "border-bottom pb-1"}
                            variant="body2"
                            sx={{ color: "white" }}
                          >
                            Messages
                          </Typography>
                        </Badge>
                      }
                    />
                  </StyledTabs>
                </Box>
              </Toolbar>
            </AppBar>
          ) : null}

          <Box>
            <Suspense
              fallback={
                <Box height={"90vh"}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    loading...
                  </Box>
                </Box>
              }
            >
              {/* display notification */}
              {value === 0 && <NotificationContainer />}
              {/* display messages content and passing props */}
              {value === 1 && (
                <ConversationContainer
                  setMessageNotifClicked={setMessageNotifClicked}
                />
              )}
            </Suspense>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
