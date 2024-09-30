import { EmailRounded, NotificationsRounded } from "@mui/icons-material";
import { Badge, styled, Tab, Tabs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessagingDrawer } from "../../redux/AppUI";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import MessagesWindow from "./MessagesWindow";
import NotificationWindow from "./NotificationWindow";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // redux states
  const { isOpenMessageDrawer } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(showMessagingDrawer());
  };

  // return the appropriate size of the drawer
  const drawerSize = () => {
    let screenSize = window.screen.availWidth;
    // smallest device size
    if (screenSize <= 350) return 280;

    // medium device size
    if (screenSize > 350 && screenSize < 600) return 300;

    // tablet size at portrait
    if (CustomDeviceTablet()) return 380;

    // very large screen for tablets at landscape size and laptops
    return 400;
  };

  return (
    <div>
      <React.Fragment>
        <Drawer
          anchor={"right"}
          open={isOpenMessageDrawer}
          onClose={handleClose}
        >
          <Box
            width={drawerSize()}
            p={2}
            borderRadius={5}
            bgcolor={"background.default"}
            height={"100vh"}
          >
            <Box className="d-flex justify-content-center align-items-center">
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
                        <EmailRounded sx={{ height: 17, width: 17 }} />
                      </span>
                      <span style={{ fontWeight: "bold" }}>
                        <Badge color="primary" variant="dot">
                          Inbox
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
                        <NotificationsRounded sx={{ height: 18, width: 18 }} />
                      </span>
                      <span className="pe-2" style={{ fontWeight: "bold" }}>
                        <Badge color="primary" variant="dot">
                          Notification
                        </Badge>
                      </span>
                    </Typography>
                  }
                />
              </StyledTabs>
            </Box>
            <Divider component={"div"} className="p-1" />
            <Box>
              {/* display messages content */}
              {value === 0 && <MessagesWindow />}

              {/* display notification */}
              {value === 1 && <NotificationWindow />}
            </Box>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
