import { Message } from "@mui/icons-material";
import { Box, Fab, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationDetailed from "./ConversationDetailed";
import ConversationLayout from "./layout/ConversationLayout";
import NewConversation from "./layout/NewConversation";
import { resetClearConversations } from "../../redux/CurrentConversations";

export default function ConversationsContainer({ setMessageNotifClicked }) {
  // axios default credentials
  axios.defaults.withCredentials = true;

    // hold the message clicked bool
    const [messageClicked, setMessageClicked] = useState(false);

    // control showing of new conversation when fab is clicked
    const [fabNewConversation, setFabNewConversation] = useState(false);

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [focusedConveration, setFocusedConversation] = useState();

  // get redux states
  const { user } = useSelector((state) => state.currentUser);
  const { conversations } = useSelector((state) => state.currentConversation);
  const dispatch=useDispatch()

  // extracting user id
  const { _id: currentUserID } = user;


  // handle complete opening the focused conversation
  const handleOpenFocusedConversation = () => {

    // show message details and hide all messages
    setMessageClicked((prev) => !prev);

    // hide the inbox and notification bars when message details is focused
    // from the top most parent level
    setMessageNotifClicked((prev) => !prev);
  };

  // handle fab clicked to show new conversation
  const handleFabClicked = useCallback(() => {
    setFabNewConversation((prev) => !prev);
  }, []);

  // handle message clicked
  const handleConversationClicked = async () => {

  

    if (focusedConveration) {
      // update the attribute sender or target read the conversation based on the current user
      // usually the current user should not be the one updated but target,
      if (
        currentUserID === focusedConveration?.lastSenderId ||
        focusedConveration?.isTargetRead
      ) {
        // proceed to conversation details since last conversation message was read or user is the sender
        handleOpenFocusedConversation();
      } else {
        // update that the target of the last message is viewed before opening the full conversation

        try {
          // set is fetching to true
          setIsFetching(true);

          // api request
          const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/last/${focusedConveration?._id}`
          );
          // if response data means updated the isTargetRead thus lets now open the conversation details
          if (response.data) {
            // proceed to conversation details since the owner is the current user
            handleOpenFocusedConversation();
          }
        } catch (err) {
          // error occurred during fetch query
          console.error(err);
        } finally {
          // close is fetching
          setIsFetching(false);
        }
      }
    }
  };

  return (
    <Box>
      {/* display new conversation component when fab clicked */}
      {fabNewConversation ? (
        <Box mt={1}>
          <NewConversation
            handleFabClicked={handleFabClicked}
          />
        </Box>
      ) : (
        <React.Fragment>
          <Box
            height={!messageClicked ? "70vh" : "90vh"}
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
            {/* if message not clicked display all conversations summarily */}
            {!messageClicked ? (
              <Box pt={2} pb={2}>
                {
                  conversations?.map((conversation, index) => (
                    <ConversationLayout
                      conversation={conversation}
                      handleConversationClicked={handleConversationClicked}
                      key={conversation}
                      currentUserName={user?.name}
                      currentUserID={currentUserID}
                      setFocusedConversation={setFocusedConversation}
                    />
                  ))}
              </Box>
            ) : (
              // show message details and pass props for altering its state of visibility
              <Box>
                <ConversationDetailed
                  handleConversationClicked={handleConversationClicked}
                  focusedConveration={focusedConveration}
                  currentUserName={user?.name}
                  currentUserID={user?._id}
                />
              </Box>
            )}
          </Box>

          {/* display a floating action btn */}
          {!messageClicked && (
            <Tooltip arrow title={"new conversation"}>
              <Fab
                color="primary"
                aria-label="start a new message conversation"
                disabled={isFetching}
                onClick={handleFabClicked}
                sx={{ left: "46%", mt: 10 }}
              >
                <Message />
              </Fab>
            </Tooltip>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}
