import { Add } from "@mui/icons-material";
import { Box, Fab, Stack } from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import ConversationDetailed from "./ConversationDetailed";
import ConversationLayout from "./layout/ConversationLayout";
import NewConversation from "./layout/NewConversation";

export default function ConversationsContainer({ setMessageNotifClicked }) {

    // hold the message clicked bool
    const [messageClicked, setMessageClicked] = useState(false);

    // control showing of new conversation when fab is clicked
    const [fabNewConversation, setFabNewConversation] = useState(false);

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [focusedConversation, setFocusedConversation] = useState();

  // get redux states
  const { user } = useSelector((state) => state.currentUser);
  const { conversations } = useSelector((state) => state.currentConversation);
  const { currentMode } = useSelector(
      (state) => state.appUI
    );

  // extracting user id
  const { _id: currentUserID } = user;

  // controls dark theme
  const isDarkMode=currentMode==='dark'

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

  

    if (focusedConversation) {
      // update the attribute sender or target read the conversation based on the current user
      // usually the current user should not be the one updated but target,
      if (
        currentUserID === focusedConversation?.lastSenderId ||
        focusedConversation?.isTargetRead
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
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/last/${focusedConversation?._id}`
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
              <Stack p={1} gap={1}>
                {
                  conversations?.map((conversation, index) => (
                    <ConversationLayout
                      conversation={conversation}
                      handleConversationClicked={handleConversationClicked}
                      key={conversation}
                      currentUserName={user?.name}
                      currentUserID={currentUserID}
                      setFocusedConversation={setFocusedConversation}
                      isDarkMode={isDarkMode}
                    />
                  ))}
              </Stack>
            ) : (
              // show message details and pass props for altering its state of visibility
              <Box>
                <ConversationDetailed
                  handleConversationClicked={handleConversationClicked}
                  focusedConveration={focusedConversation}
                  currentUserName={user?.name}
                  currentUserID={user?._id}
                />
              </Box>
            )}
          </Box>

          {/* display a floating action btn */}
          {!messageClicked && (
              <Fab
                color="primary"
                variant="extended"
                aria-label="floating button"
                size="small"
                disabled={isFetching}
                onClick={handleFabClicked}
                sx={{ left: "35%", paddingRight:1}}
              >
                <Add sx={{ mr: 1 }}/>
                Compose
              </Fab>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}
