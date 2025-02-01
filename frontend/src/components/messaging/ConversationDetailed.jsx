import { Close, MoreVertRounded } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  Stack,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MoreMessageLayout from "./layout/MoreMessageLayout";

// input base
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const ConversationDetailed = ({
  handleConversationClicked,
  focusedConveration,
  currentUserName,
  currentUserID,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [conversationMessges, setConversationMessages] = useState([]);

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // accessing the redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  // controls more info for message
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMoreMessage = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // determine the name and avatar of the conversation displayed.
  const handleTopBarNameAvatar = () => {
    // this prevents currently user being displayed on topbar of conversation
    if (
      currentUserName?.toLowerCase() ===
      focusedConveration?.senderName?.toLowerCase()
    ) {
      return [focusedConveration?.targetName, focusedConveration?.targetAvatar];
    }

    // return the sender name and avatar
    return [focusedConveration?.senderName, focusedConveration?.senderAvatar];
  };

  // axios default credentials
  axios.defaults.withCredentials = true;

  // fetch or get all conversations done by the current user
  useEffect(() => {
    if (conversationMessges?.length > 0) {
      console.log("returning");
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing get request for all mesages with coversationId.
    axios
      .get(
        `http://localhost:5000/metatron/api/v1/conversations/users/message/${focusedConveration._id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the states of conversations
        setConversationMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable!");
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [conversationMessges, focusedConveration]);

  const handleDateDisplay = () => {
    const parent = focusedConveration?.updatedAt?.split("T")[0]?.split("-");
    return `${parent[parent.length - 1]}/${parent[parent.length - 2]}/${
      parent[0]
    }`;
  };

  // handle sending of the reply to the backend
  const handleSendReplyMessage = async () => {
    const messageObject = {
      conversationId: focusedConveration._id,
      content: replyContent,
      senderId: currentUserID,
    };

    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsFetching(true);

      // api request
      const response = await axios.post(
        `http://localhost:5000/metatron/api/v1/conversations/users/message/create`,
        messageObject
      );
      // if response data means sent message thus back to conversation page
      if (response.data) {
        // set conversation to the response returned from the server which is last message sent
        setConversationMessages((prev) => [...prev, response.data]);

        // clear the reply
        setReplyContent("");
      }
    } catch (err) {
      // error occured during fetch query
      console.error(err);
    } finally {
      // close is fetching
      setIsFetching(false);
    }
  };

  return (
    <Box bgcolor={"background.default"} height={"99vh"}>
      {/* toolbar like */}
      <AppBar position="sticky" color="transparent">
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* avatar */}
          <Avatar
            sx={{ height: 34, width: 34 }}
            src={handleTopBarNameAvatar()[1]}
            alt={handleTopBarNameAvatar()[0]}
          />
          {/* name of the sender */}
          <Typography
            variant="body2"
            fontWeight={"bold"}
            color="text.secondary"
          >
            {handleTopBarNameAvatar()[0]}
          </Typography>
          {/* close btn */}
          <IconButton onClick={handleConversationClicked}>
            <Close sx={{ height: 14, width: 14 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        p={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        maxHeight={"95vh"}
        gap={3}
      >
        <Box>
          {conversationMessges &&
            conversationMessges.map((message, index) => (
              <Stack key={index} gap={2}>
                {/* current user message styling */}
                {message.senderId === currentUserID ? (
                  <Box display={"flex"} justifyContent={"flex-start"}>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        p: 1,
                        m: 1,
                        borderRadius: 1,
                        bgcolor: "lightblue",
                      }}
                    >
                      {/* message content */}
                      <Box>
                        {/* more button */}
                        <Box display={"flex"} justifyContent={"flex-end"}>
                          <IconButton
                            size="small"
                            onClick={handleClickMoreMessage}
                            aria-label="more"
                          >
                            <MoreVertRounded sx={{ width: 12, height: 12 }} />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" fontWeight={"bold"}>
                          {message?.content}
                        </Typography>

                        {/* more message options, delete and update */}
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleCloseMenu}
                          MenuListProps={{ "aria-labelledby": "more-button" }}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MoreMessageLayout />
                        </Menu>
                      </Box>

                      {/* caption */}
                      <Box
                        mt={"2px"}
                        display={"flex"}
                        justifyContent={"flex-end"}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "x-small",
                          }}
                        >
                          {" "}
                          {handleDateDisplay(message?.createdAt)}{" "}
                          {message?.createdAt?.split(".")[0]?.split("T")[1]}{" "}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <Box
                      sx={{
                        p: 1,
                        m: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        bgcolor: "whitesmoke",
                      }}
                    >
                      {/* message content */}
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={"bold"}
                          color={"text.secondary"}
                        >
                          {message?.content}
                        </Typography>
                      </Box>

                      {/* caption */}
                      <Box
                        mt={"2px"}
                        display={"flex"}
                        justifyContent={"flex-end"}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "x-small",
                          }}
                        >
                          {" "}
                          {handleDateDisplay(message?.createdAt)}{" "}
                          {message?.createdAt?.split(".")[0]?.split("T")[1]}{" "}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Stack>
            ))}
        </Box>

        <Box className="mx-1 rounded" bgcolor={!isDarkMode && "whitesmoke"}>
          {/* message input */}
          <StyledInputBase
            multiline
            fullWidth
            sx={{ padding: "20px" }}
            disabled={isFetching}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="write message ..."
            inputProps={{ "aria-label": "search" }}
          />
          <Box display={"flex"} justifyContent={"flex-end"} mr={1}>
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Button
                variant="outlined"
                disabled={isFetching}
                size="small"
                sx={{ borderRadius: "20px", fontSize: "10px" }}
              >
                AI
              </Button>

              <Button
                variant="outlined"
                size="small"
                disabled={replyContent?.length < 1 || isFetching}
                onClick={handleSendReplyMessage}
                color="success"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationDetailed;
