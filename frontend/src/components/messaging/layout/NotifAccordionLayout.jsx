import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Avatar, Box, Stack } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logoApp from "../../../images/logo_sm.png";
import { updateCurrentConnectNotif } from "../../../redux/CurrentConnectNotif";
import { updateCurrentPostReactions } from "../../../redux/CurrentPostReactions";
import FriendRequest from "../../rightbar/layouts/FriendRequest";
import PostReaction from "./PostReaction";

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
  const [expanded, setExpanded] = React.useState("panel1");
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  // get redux states
  const { user } = useSelector((state) => state.currentUser);
  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector(
    (state) => state.currentConnectNotif
  );
  // extracting current user ID
  const { _id } = user;

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  // axios default credentials
  axios.defaults.withCredentials = true;

  // get all possoble post reaction notifications based on current userID
  useEffect(() => {
    if (post_reactions) {
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
  useEffect(() => {
    if (connectNotifications) {
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
        console.log("response", res.data);
        // update the redux for connectNotif
        if (res?.data) {
          dispatch(updateCurrentConnectNotif(res.data));
        }
      })
      .catch((err) => {
        console.log("error");
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

  return (
    <Stack gap={1}>
      {/* accordion post reactions notif */}
      {post_reactions?.length > 0 && (
        <Accordion
          expanded={post_reactions?.length > 0}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Avatar src={logoApp} alt="" />
              <Typography component="span" variant="body2" fontWeight={"bold"}>
                Post Reactions
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
                <PostReaction reaction={reaction} key={index} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* connect request */}
      {connectNotifications?.length > 0 && (
        <Accordion
          expanded={connectNotifications?.length > 0}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Avatar src={logoApp} alt="" />
              <Typography component="span" variant="body2" fontWeight={"bold"}>
                Connect Request
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
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* accordion metatron notifications */}

      {/* accordion advertisement */}
    </Stack>
  );
}
