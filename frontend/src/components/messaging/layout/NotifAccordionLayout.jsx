import {
  EmojiEmotionsRounded,
  PeopleRounded,
  WarningRounded
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
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentConnectNotif } from "../../../redux/CurrentConnectNotif";
import { updateCurrentPostReactions } from "../../../redux/CurrentPostReactions";
import { updateCurrentReport } from "../../../redux/CurrentPostReported";
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



export default function NotifAccordionLayout() {
  // accordion controllers
  const [openReaction, setOpenReaction] = useState(true);
  const [openConnect, setOpenConnect] = useState(true);
  const [openReported, setOpenReported] = useState(true);

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // get redux states
  const { user } = useSelector((state) => state.currentUser);

  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector(
    (state) => state.currentConnectNotif
  );
  const { reportedPost } = useSelector((state) => state.currentReportedPost);

  // extracting current user ID
  const { _id } = user;

  // dispatch
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // get all possoble post reaction notifications based on current userID
  useLayoutEffect(() => {
    if (post_reactions?.length > 1) {
      return;
    }

    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(`http://localhost:5000/metatron/api/v1/posts/reactions/all/${_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPostReactions(res.data));
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable please try again later to complete your request"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, _id, post_reactions]);

  // get all connect requests sent by users to the current user as being target
  useLayoutEffect(() => {
    if (connectNotifications?.length > 1) {
      return;
    }

    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(
        `http://localhost:5000/metatron/api/v1/connections/connection/all/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux for connectNotif
        if (res?.data) {
          dispatch(updateCurrentConnectNotif(res.data));
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable please try again later");
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, connectNotifications, _id]);

  // get all posts reports that targets this currently logged in user
  useLayoutEffect(() => {
    if (reportedPost?.length > 1) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(`http://localhost:5000/metatron/api/v1/posts/report/get/${_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux for post
        if (res?.data) {
          dispatch(updateCurrentReport(res.data));
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable");
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, reportedPost, _id]);

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
