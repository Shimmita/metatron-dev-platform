import { Close, InfoRounded, MoreVertRounded } from "@mui/icons-material";
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
import AlertGeneral from "../alerts/AlertGeneral";

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
  const [conversationMessages, setConversationMessages] = useState([]);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [messageFocused, setMessageFocused] = useState();

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
  

  // accessing the redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'


  // controls more info for message
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMoreMessage = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // determine the name and avatar of the conversation displayed.
  const handleTopBarNameAvatar = () => {
    // this prevents currently user being displayed on top-bar of conversation
    if (
      currentUserName?.toLowerCase() ===
      focusedConveration?.senderName?.toLowerCase()
    ) {
      return [`TO: ${focusedConveration?.targetName}`, focusedConveration?.targetAvatar];
    }

    // return the sender name and avatar
    return [`FROM: ${focusedConveration?.senderName}`, focusedConveration?.senderAvatar];
  };

  // axios default credentials
  axios.defaults.withCredentials = true;

  // fetch or get all conversations done by the current user
  useEffect(() => {
    if (conversationMessages?.length > 0) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing get request for all messages with conversationId.
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/${focusedConveration?._id}`,
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
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [conversationMessages, focusedConveration]);

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
      senderName:currentUserName
    };

    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsFetching(true);

      // api request
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/create`,
        messageObject
      );
      // if response data means sent message thus back to conversation page
      if (response.data) {
        // set conversation to the response returned from the server which is last message sent
        setConversationMessages((prev) => [...prev, response.data]);
      }
    } catch (err) {
      // error occurred during fetch query
      console.error(err);
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true)
    } finally {
      // close is fetching
      setIsFetching(false);
       // clear the reply
       setReplyContent("");
    }
  };

  // handle updating or editing of the message content
  const handleUpdateMessageContent = async () => {
    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsFetching(true);

      // api request
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/update/${messageFocused._id}`,
        { content: replyContent }
      );
      // if response data means sent message thus back to conversation page
      if (response.data) {
        // set conversation messages to [] this will re-render the ui and request the server data of messages
        setConversationMessages([]);

        // clear the reply
        setReplyContent("");
      }
    } catch (err) {
      // error occurred during fetch query
      console.error(err);
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true)
    } finally {
      // close is fetching
      setIsFetching(false);
    }
  };

  // handle deletion of the message based on its ID
  const handleDeletingOfMessage = async () => {
    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsFetching(true);

      // api request
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/delete/${messageFocused._id}`,
        { content: replyContent }
      );
      // if response data means sent message thus back to conversation page
      if (response.data) {
        // set conversation messages to [] this will re-render the ui and request the server data of messages
        setConversationMessages([]);
      }
    } catch (err) {
      // error occurred during fetch query
      console.error(err);
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true)
    } finally {
      // close is fetching
      setIsFetching(false);
    }
  };


  return (
    <Box 
    bgcolor={"background.default"} 
    height={"99vh"}>
      {/* toolbar like */}
      <AppBar 
      position="sticky" 
      color="transparent">
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
            alt={handleTopBarNameAvatar()[0]?.split(" ")[1]}
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
          {
            conversationMessages?.map((message) => (
              <Stack key={message} gap={2}>
                {/* current user message styling */}
                {message.senderId === currentUserID ? (
                  <Box>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        p: 1,
                        m: 1,
                        borderRadius: 1,
                        bgcolor: isDarkMode ? "gray" : "lightblue",
                      }}
                    >
                      {/* message content */}
                      <Box>
                        {/* more button */}
                        <Box display={"flex"} justifyContent={"flex-end"}>
                          <IconButton
                            size="small"
                            aria-label="more"
                            onClick={(event) => {
                              // call show more function
                              handleClickMoreMessage(event);

                              // set message passed to the current message
                              setMessageFocused(message);
                            }}
                          >
                            <MoreVertRounded sx={{ width: 12, height: 12 }} />
                          </IconButton>
                        </Box>
                        <Box>
                          <Typography variant="caption" fontWeight={"bold"}>
                            {message?.content}
                          </Typography>
                        </Box>
                        {/* caption  owner ref edited and time */}
                        <Box
                          mt={1}
                          mr={1}
                          display={"flex"}
                          gap={1}
                          alignItems={"center"}
                        >
                          {/*owner reference */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: "x-small",
                            }}
                          >
                            {"( You )"}
                          </Typography>

                          {/* edited or not */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: "x-small",
                            }}
                          >
                            {message?.isEdited && "edited"}
                          </Typography>

                          {/* caption time */}
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
                          <MoreMessageLayout
                            setIsEditingMessage={setIsEditingMessage}
                            handleCloseMenu={handleCloseMenu}
                            messagePassed={messageFocused}
                            setReplyContent={setReplyContent}
                            handleDeletingOfMessage={handleDeletingOfMessage}
                          />
                        </Menu>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        p: 1,
                        m: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        bgcolor: !isDarkMode ? "whitesmoke" : "black",
                      }}
                    >
                      {/* message content */}
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight={"bold"}
                          color={isDarkMode ? "text.primary" : "text.secondary"}
                        >
                          {message?.content}
                        </Typography>
                      </Box>

                      {/* caption owner ref edited and time */}
                      <Box
                        mt={1}
                        mr={1}
                        display={"flex"}
                        justifyContent={"flex-end"}
                        alignItems={"center"}
                        gap={1}
                      >
                        {/*owner reference */}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "x-small",
                            textTransform: "capitalize",
                          }}
                        >
                          {`( ${
                            focusedConveration?.senderName
                              ?.toLowerCase()
                              ?.split(" ")[0]
                          } )`}
                        </Typography>

                        {/* edited or not */}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "x-small",
                          }}
                        >
                          {message?.isEdited && "edited"}
                        </Typography>

                        {/* caption time */}
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
              {isEditingMessage ? (
                <React.Fragment>
                  <Button
                    variant="outlined"
                    disabled={isFetching}
                    onClick={() => {
                      // false message editing
                      setIsEditingMessage(false);

                      // clear the reply content
                      setReplyContent("");
                    }}
                    size="small"
                    sx={{ borderRadius: "20px", fontSize: "10px" }}
                  >
                    close
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    disabled={replyContent?.length < 1 || isFetching}
                    onClick={handleUpdateMessageContent}
                    color="success"
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    update
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
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
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

       {/* alert general of the error message */}
        {errorMessage && (
          <AlertGeneral
          title={'something went wrong!'}
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded/>}
          />
        )}

    </Box>
  );
};

export default ConversationDetailed;
