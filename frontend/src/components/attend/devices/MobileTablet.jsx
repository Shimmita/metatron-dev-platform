import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";

import {
  CallEndRounded,
  MessageRounded,
  MicRounded,
  PanToolRounded,
  PeopleRounded,
  ScreenShareRounded,
  VideocamRounded,
} from "@mui/icons-material";
import video from "../../../video.mp4";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import AttendantsContainer from "../AttendantsContainer";
import "../LiveAttend.css";
import MessageContainer from "../MessageContainer";
import BottomNavMobileLive from "../bottomnavlive/BottomNavMobileLive";

function MobileTablet() {
  const [showPeople, setShowPeople] = React.useState(true);
  const [showMessage, setShowMessage] = React.useState(false);
  const [useCamera, setUseCamera] = React.useState(false);
  const [useAudio, setUseAudio] = React.useState(false);
  const [shareScreen, setShareScreen] = React.useState(false);
  const [raiseHand, setRaiseHand] = React.useState(false);
  // modal for adding comments
  const [showModal, setShowModal] = React.useState(false);

  // handle showing of people
  const handleShowPeople = () => {
    setShowPeople(true);
    // show messaging false
    setShowMessage(false);
  };

  // handle showing of messages
  const handleShowMessages = () => {
    setShowMessage(true);
    // show people false
    setShowPeople(false);
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
    <Box width={"100%"} height={"93vh"} bgcolor={"background.default"}>
      {/* container */}
      <Box maxHeight={"70vh"}>
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
          mb={1}
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

        {/* container people and chat */}
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={CustomDeviceIsSmall() ? "center" : "space-between"}
          >
            {/* decide the controls display for smaller device most are on btmnav */}
            {CustomDeviceIsSmall() ? (
              <>
                {/* video controls at center */}
                <Box>
                  <Box display={"flex"} alignItems={"center"} gap={2}>
                    {/* toggle show of video camera */}
                    <Box>
                      <Tooltip
                        title={useCamera ? "close camera" : "open camera"}
                        arrow
                      >
                        <IconButton
                          className="border"
                          onClick={handleUseCamera}
                        >
                          <VideocamRounded
                            sx={{ width: 20, height: 20 }}
                            color={useCamera ? "primary" : "inherit"}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* toggle microphone on */}
                    <Box>
                      <Tooltip
                        title={useAudio ? "close mic" : "open mic"}
                        arrow
                      >
                        <IconButton className="border" onClick={handleUseAudio}>
                          <MicRounded
                            sx={{ width: 20, height: 20 }}
                            color={useAudio ? "primary" : "inherit"}
                          />
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
                            sx={{ width: 20, height: 20 }}
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
                        <IconButton
                          className="border"
                          onClick={handleRaisedHand}
                        >
                          <PanToolRounded
                            sx={{ width: 20, height: 20 }}
                            color={raiseHand ? "primary" : "inherit"}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <>
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

                {/* video controls at center */}
                <Box>
                  <Box display={"flex"} alignItems={"center"} gap={2}>
                    {/* toggle show of video camera */}
                    <Box>
                      <Tooltip
                        title={useCamera ? "close camera" : "open camera"}
                        arrow
                      >
                        <IconButton
                          className="border"
                          onClick={handleUseCamera}
                        >
                          <VideocamRounded
                            color={useCamera ? "primary" : "inherit"}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* toggle microphone on */}
                    <Box>
                      <Tooltip
                        title={useAudio ? "close mic" : "open mic"}
                        arrow
                      >
                        <IconButton className="border" onClick={handleUseAudio}>
                          <MicRounded
                            color={useAudio ? "primary" : "inherit"}
                          />
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
                        <IconButton
                          className="border"
                          onClick={handleRaisedHand}
                        >
                          <PanToolRounded
                            color={raiseHand ? "primary" : "inherit"}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* end meeting */}
                    <Box>
                      <Tooltip title="leave-meeting" arrow>
                        <IconButton className="border">
                          <CallEndRounded
                            sx={{ width: 28, height: 28 }}
                            color="error"
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
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
              </>
            )}
          </Box>

          {/* divider */}
          <Divider component={"div"} className="p-1" />

          <Typography
            variant="body2"
            fontWeight={"bold"}
            p={1}
            color={"primary"}
            textAlign={"center"}
            textTransform={"uppercase"}
          >
            {showPeople ? "Attendance Room (300)" : "Comment Room (20)"}
          </Typography>

          {/* sidebar  container */}
          <Box mt={1} className="rounded">
            {showPeople ? (
              <AttendantsContainer />
            ) : (
              <MessageContainer
                showModal={showModal}
                setShowModal={setShowModal}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* bottomNav for Smartphones only due to space constraints */}
      {CustomDeviceIsSmall() ? (
        <Box>
          <BottomNavMobileLive
            handleShowPeople={handleShowPeople}
            handleShowMessages={handleShowMessages}
            setShowModal={setShowModal}
          />
        </Box>
      ) : null}
    </Box>
  );
}

export default MobileTablet;
