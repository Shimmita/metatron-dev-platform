import { Message } from "@mui/icons-material";
import { Box, Fab, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationDetailed from "./ConversationDetailed";
import ConversationLayout from "./layout/ConversationLayout";
import NewConversation from "./layout/NewConversation";

export default function ConversationsContainer({ setMessageNotifClicked }) {
  const [availableUserConversations, setAvailableUserConversations] = useState(
    []
  );

  const [focusedConveration, setFocusedConversation] = useState();

  // api request monitors
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // get redux states
  const { user } = useSelector((state) => state.currentUser);

  // extracting user id
  const { _id: currentUserID } = user;

  // axios default credentials
  axios.defaults.withCredentials = true;

  // fetch or get all conversations done by the current user
  useEffect(() => {
    // return if are conversations
    if (availableUserConversations.length > 0) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(
        `http://localhost:5000/metatron/api/v1/conversations/users/all/${currentUserID}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the states of conversations
        setAvailableUserConversations(res.data);
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
  }, [currentUserID, availableUserConversations]);

  // hold the message clicked bool
  const [messageClicked, setMessageClicked] = useState(false);

  // controll showing of new conversation when fab is clicked
  const [fabNewConversation, setFabNewConversation] = useState(false);

  // handle message clicked
  const handleConversationClicked = () => {
    // show message details and hide all messages
    setMessageClicked((prev) => !prev);

    // hide the inbox and notif bars when message details is focused
    // from the top most parent level
    setMessageNotifClicked((prev) => !prev);
  };

  // handle fab clicked to show new conversation
  const handleFabClicked = useCallback(() => {
    setFabNewConversation((prev) => !prev);
  }, []);

  return (
    <Box>
      {/* display new conversation component when fab clicked */}
      {fabNewConversation ? (
        <Box mt={1}>
          <NewConversation
            handleFabClicked={handleFabClicked}
            setAvailableUserConversations={setAvailableUserConversations}
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
            {/* if message not clicked display all message summarily */}
            {!messageClicked ? (
              <Box pt={2} pb={2}>
                {availableUserConversations &&
                  availableUserConversations.map((conversation, index) => (
                    <ConversationLayout
                      conversation={conversation}
                      key={index}
                      handleConversationClicked={handleConversationClicked}
                      currentUserName={user?.name}
                      setFocusedConversation={setFocusedConversation}
                    />
                  ))}
              </Box>
            ) : (
              // show message details and pass props for altering its state of visbility
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
