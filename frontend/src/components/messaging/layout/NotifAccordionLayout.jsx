import {
  EmojiEmotionsRounded,
  PeopleRounded,
  WarningRounded,
} from "@mui/icons-material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box, Stack } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FriendRequest from "../../rightbar/layouts/FriendRequest";
import PostReaction from "./PostReaction";
import PostReported from "./PostReported";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function NotifAccordionLayout({
  reportedPost,
  connectNotifications,
  post_reactions,
}) {
  // accordion controllers
  const [openReaction, setOpenReaction] = useState(true);
  const [openConnect, setOpenConnect] = useState(true);
  const [openReported, setOpenReported] = useState(true);


 

  return (
    <Stack gap={2}>
      {/* accordion post reactions notif */}
      {post_reactions?.length > 0 && (
        <Accordion
          expanded={openReaction}
          onChange={() => setOpenReaction((prev) => !prev)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <EmojiEmotionsRounded color="primary" />
              <Typography
                component="span"
                variant="body2"
                fontWeight={"bold"}
                display={"flex"}
                alignItems={"center"}
              >
                Post Reactions{" "}
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                  color="text.secondary"
                  ml={5}
                >
                  {post_reactions?.length}
                </Typography>
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              maxHeight={"70vh"}
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
              {post_reactions?.map((reaction, index) => (
                <PostReaction
                  reaction={reaction}
                  key={index}
                  isLastItem={post_reactions?.length - 1 === index}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* connect request */}
      {connectNotifications?.length > 0 && (
        <Accordion
          expanded={openConnect}
          onChange={() => setOpenConnect((prev) => !prev)}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <PeopleRounded />
              <Typography
                component="span"
                variant="body2"
                fontWeight={"bold"}
                display={"flex"}
                alignItems={"center"}
              >
                Connect Request{" "}
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                  color="text.secondary"
                  ml={5}
                >
                  {connectNotifications?.length}
                </Typography>
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              maxHeight={"70vh"}
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
              {connectNotifications?.map((connect, index) => (
                <FriendRequest
                  key={index}
                  connect_request={connect}
                  isAcceptFriends={true}
                  isLastItem={connectNotifications?.length - 1 === index}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* post report overview */}
      {reportedPost?.length > 0 && (
        <Accordion
          expanded={openReported}
          onChange={() => setOpenReported((prev) => !prev)}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <WarningRounded color="info" />
              <Typography
                component="span"
                variant="body2"
                fontWeight={"bold"}
                display={"flex"}
                alignItems={"center"}
              >
                Post Reported{" "}
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                  color="text.secondary"
                  ml={5}
                >
                  {reportedPost?.length}
                </Typography>
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              maxHeight={"70vh"}
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
              {reportedPost?.map((report, index) => (
                <PostReported
                  key={index}
                  report={report}
                  isLastItem={reportedPost?.length - 1 === index}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* accordion advertisement */}
    </Stack>
  );
}
