import { AdsClickRounded, EmailRounded } from "@mui/icons-material";
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
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const MessageContainer = lazy(() => import("./MessageContainer"));
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

export default function Messaging() {
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

  // return the appropriate size of the drawer
  const drawerSize = () => {
    let screenSize = window.screen.availWidth;
    // smallest device size
    if (screenSize <= 350) return 280;

    // medium device size
    if (screenSize > 350 && screenSize < 600) return 330;

    // tablet size at portrait
    if (CustomDeviceTablet()) return 420;

    // very large screen for tablets at landscape size and laptops
    return 450;
  };

  return (
    <React.Fragment>
      <Drawer anchor={"right"} open={isOpenMessageDrawer} onClose={handleClose}>
        <Box
          width={drawerSize()}
          bgcolor={"background.default"}
          height={"100vh"}
        >
          {/* display when message/notif item not clicked */}
          {!messageNotifClicked ? (
            <AppBar position="sticky" color="transparent">
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
                        <Typography
                          alignItems={"center"}
                          gap={1}
                          display={"flex"}
                          sx={{ paddingRight: 10 }}
                          variant="body2"
                        >
                          <span>
                            <AdsClickRounded sx={{ height: 17, width: 17 }} />
                          </span>
                          <span style={{ fontWeight: "bold" }}>
                            <Badge color="warning" variant="dot">
                              Promoted
                            </Badge>
                          </span>
                        </Typography>
                      }
                    />

                    <StyledTab
                      label={
                        <Typography
                          alignItems={"center"}
                          gap={1}
                          display={"flex"}
                          variant="body2"
                        >
                          <span>
                            <EmailRounded sx={{ height: 17, width: 17 }} />
                          </span>
                          <span style={{ fontWeight: "bold" }}>
                            <Badge color="warning" variant="dot">
                              Inbox
                            </Badge>
                          </span>
                        </Typography>
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
                <MessageContainer
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
