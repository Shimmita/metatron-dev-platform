import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { handleScrolledDown } from "../../../redux/AppUI";

import {
  CallEndRounded,
  MessageRounded,
  MicRounded,
  PanToolRounded,
  PeopleRounded,
  ScreenShareRounded,
  VideocamRounded,
  ViewSidebarRounded,
} from "@mui/icons-material";
import video from "../../../video.mp4";
import AttendantsContainer from "../AttendantsContainer";
import "../LiveAttend.css";
import MessageContainer from "../MessageContainer";

function LaptopDesktop() {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showPeople, setShowPeople] = React.useState(true);
  const [showMessage, setShowMessage] = React.useState(false);
  const [useCamera, setUseCamera] = React.useState(false);
  const [useAudio, setUseAudio] = React.useState(false);
  const [shareScreen, setShareScreen] = React.useState(false);
  const [raiseHand, setRaiseHand] = React.useState(false);
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();

  dispatch(handleScrolledDown(true));

  // function to toggle the showing of the sidebar
  const handleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  // handle showing of people
  const handleShowPeople = () => {
    setShowPeople(!showPeople);
    // make show messages false
    setShowMessage(!showMessage);
  };

  // handle showing of messages
  const handleShowMessages = () => {
    setShowMessage((prev) => !prev);

    // make show people false
    handleShowPeople();
  };

  // handle use camera
  const handleUseCamera = () => {
    setUseCamera(!useCamera);
  };

  // handle use Audio

  const handleUseAudio = () => {
    setUseAudio(!useAudio);
  };

  // handle sharing screen
  const handleShareScreen = () => {
    setShareScreen(!shareScreen);
  };

  // handle raised hand
  const handleRaisedHand = () => {
    setRaiseHand(!raiseHand);
  };

  return (
    <Box width={"100%"} height={"90vh"}>
      <Box maxHeight={"70vh"}
      >
        <Box display={"flex"} gap={2}>
          {/* sidebar live */}
          <Box
            flex={1}
            p={2}
            className="shadow rounded-2 "
            bgcolor={"background.default"}
            display={showSidebar ? "block" : "none"}
          >
            {/* title sidebar */}
            <Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {/* attendance */}
                <Box>
                  <Tooltip
                    title={showPeople ? "hide attendants" : "show attendants"}
                    arrow
                  >
                    <IconButton className="border" onClick={handleShowPeople}>
                      <PeopleRounded
                        color={showPeople ? "primary" : "inherit"}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* show/hide message sidebar */}
                <Box>
                  <Tooltip
                    title={showMessage ? "hide messages" : "show messages"}
                    arrow
                  >
                    <IconButton className="border" onClick={handleShowMessages}>
                      <MessageRounded
                        color={showMessage ? "primary" : "inherit"}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography
                variant="body2"
                fontWeight={"bold"}
                p={1}
                color={"primary"}
                textAlign={"center"}
                textTransform={"uppercase"}
              >
                {showPeople ? "Attendance Room (300)" : "Comment Room"}
              </Typography>

              {/* sidebar  container */}
              <Box mt={1} className="rounded">
                {showPeople ? <AttendantsContainer /> : <MessageContainer />}
              </Box>
            </Box>
          </Box>

          {/* feed live container */}
          <Box
            flex={3}
            p={2}
            className="rounded-2 shadow"
            bgcolor={"background.default"}
          >
            <Box>
              {/* live title */}
              <Typography
                variant="body2"
                fontWeight={"bold"}
                textAlign={"center"}
                textTransform={"uppercase"}
                gutterBottom
                color={"primary"}
              >
                Live Software Devlopment Event
              </Typography>

              {/* live subtitle */}
              <Typography
                variant="body2"
                fontWeight={"bold"}
                textAlign={"center"}
                textTransform={"capitalize"}
              >
                Kotlin Multiplatform (KMP)
              </Typography>
            </Box>

            {/* live screen feed */}
            <Box
              display={"flex"}
              justifyContent={"center"}
              className="video-container"
            >
              {/* video container */}
              <video
                className="rounded-2"
                width={"100%"}
                src={video}
                autoPlay
                controls
              >
                <Typography color={"error"}>video not supported</Typography>
              </video>
            </Box>

            {/* controls here */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={2}
            >
              {/* toggle button when clicked hide sidebar */}
              <Box>
                <Box>
                  <Tooltip
                    title={showSidebar ? "close sidebar" : "show sidebar"}
                    arrow
                  >
                    <IconButton className="border" onClick={handleShowSidebar}>
                      <ViewSidebarRounded
                        color={showSidebar ? "primary" : "inherit"}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box>
                {/* event controls  */}
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  {/* toggle show of video camera */}
                  <Box>
                    <Tooltip
                      title={useCamera ? "close camera" : "open camera"}
                      arrow
                    >
                      <IconButton className="border" onClick={handleUseCamera}>
                        <VideocamRounded
                          color={useCamera ? "primary" : "inherit"}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* toggle microphone on */}
                  <Box>
                    <Tooltip title={useAudio ? "close mic" : "open mic"} arrow>
                      <IconButton className="border" onClick={handleUseAudio}>
                        <MicRounded color={useAudio ? "primary" : "inherit"} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* share screen/show video camera */}
                  <Box>
                    <Tooltip
                      title={
                        shareScreen ? "close share-screen" : "share-screen"
                      }
                      arrow
                    >
                      <IconButton
                        className="border"
                        onClick={handleShareScreen}
                      >
                        <ScreenShareRounded
                          color={shareScreen ? "primary" : "inherit"}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* help/raise hand */}
                  <Box>
                    <Tooltip
                      title={raiseHand ? "close raise-hand" : "raise-hand"}
                      arrow
                    >
                      <IconButton className="border" onClick={handleRaisedHand}>
                        <PanToolRounded
                          color={raiseHand ? "primary" : "inherit"}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* end meeting container */}
              <Box>
                <Box>
                  <Tooltip title="leave-meeting" arrow>
                    <IconButton onClick={handleShowSidebar}>
                      <CallEndRounded
                        sx={{ width: 28, height: 28 }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LaptopDesktop;
