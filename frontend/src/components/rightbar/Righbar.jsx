import {
  AutoAwesomeRounded,
  SchoolRounded,
  TouchAppRounded,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicSpeedDial from "../custom/SpeedDial";
import CoursesContainer from "./CoursesContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarEvents from "./RightBarEvents";
import RightBarStepper from "./RightBarStepper";
import "./Rightbar.css";
import { handleShowChatBot } from "../../redux/CurrentChatBot";

const RightbarAll = () => {
  // backdrop state
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [corouselCounter, setCorouselCounter] = React.useState(0);
  const dispatch = useDispatch();

  // handle showing of the chat bot controlled by the redux state
  const handleChatBot = () => {
    dispatch(handleShowChatBot());
  };

  // redux states
  const {
    isDefaultBottomNav,
    isSidebarRighbar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

  return (
    <Box
      height={"100vh"}
      flex={2}
      marginRight={window.screen.availWidth > 1200 ? "5%" : "0"}
      p={2}
      sx={{
        display: {
          xs: "none",
          sm: "none",
          md: isSidebarRighbar ? "block" : "none",
        },
      }}
    >
      <Box
        position={"fixed"}
        color={"text.primary"}
        className="mt-0 shadow rounded"
        maxHeight={"82vh"}
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
        {/* connect suggestion  */}
        <Box bgcolor={"background.default"} className=" rounded pe-2 ">
          <Box>
            {/* jobs */}
            <Box display={corouselCounter === 0 ? "block" : "none"}>
              <JobsContainer />
            </Box>

            {/* popular courses */}
            <Box display={corouselCounter === 1 ? "block" : "none"}>
              <CoursesContainer />
            </Box>

            {/* featured courses */}
            <Box display={corouselCounter === 2 ? "block" : "none"}>
              <FeaturedPostContainer />
            </Box>

            {/* connect request */}
            <Box display={corouselCounter === 3 ? "block" : "none"}>
              <RequestContainer />
            </Box>
          </Box>
          {/* stepper controller */}
          <Box display={"flex"} justifyContent={"center"}>
            <RightBarStepper
              corouselCounter={corouselCounter}
              setCorouselCounter={setCorouselCounter}
            />
          </Box>
        </Box>

        {/* divider */}
        <Divider className="mb-2" component={"div"} />

        {/* events */}
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            pt={2}
          >
            <Typography fontWeight={"bold"} color={"primary"}>
              GREAT TECH EVENTS
            </Typography>
            <SchoolRounded color="primary" sx={{ width: 24, height: 24 }} />
          </Box>

          <Box display={"flex"} justifyContent={"center"} mt={1}>
            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"30vh"} />
            ) : (
              <RightBarEvents />
            )}
          </Box>
        </Box>
        {/* divider */}
        <Divider className="mb-2" component={"div"} />
        {/* Ai Chatbot */}
        <Stack>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            pt={2}
          >
            <Typography fontWeight={"bold"} color={"primary"}>
              METATRON AI AGENT
            </Typography>
            <AutoAwesomeRounded
              color="primary"
              sx={{ width: 26, height: 26 }}
            />
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            {isLoadingRequest ? (
              <Skeleton variant="rectangular" width={"100%"} height={"5vh"} />
            ) : (
              <Button
                size="small"
                className="item-scale"
                startIcon={<TouchAppRounded />}
                onClick={handleChatBot}
                variant="text"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                Lets Chat
              </Button>
            )}
          </Box>
        </Stack>
      </Box>

      {/* display speed dial in feed section only for mobile and no landscape */}
      {window.screen.availWidth > 900 && (
        <Box>
          {/* show speed dial if not scrolling down */}
          {isDefaultBottomNav && (
            <>
              <Backdrop open={openBackdrop} />
              <Box position={"fixed"} sx={{ left: 0, right: 1, bottom: 55 }}>
                <BasicSpeedDial setOpenBackdrop={setOpenBackdrop} />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RightbarAll;
