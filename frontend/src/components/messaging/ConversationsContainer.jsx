import { Add, ForumRounded, SearchRounded } from "@mui/icons-material";
import { Box, Fab, Stack, Typography, InputBase, IconButton } from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import ConversationDetailed from "./ConversationDetailed";
import ConversationLayout from "./layout/ConversationLayout";
import NewConversation from "./layout/NewConversation";

export default function ConversationsContainer({ setMessageNotifClicked }) {
  const [messageClicked, setMessageClicked] = useState(false);
  const [fabNewConversation, setFabNewConversation] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [focusedConversation, setFocusedConversation] = useState();

  const { user } = useSelector((state) => state.currentUser);
  const { conversations } = useSelector((state) => state.currentConversation);
  const { currentMode } = useSelector((state) => state.appUI);

  const { _id: currentUserID } = user;
  const isDarkMode = currentMode === 'dark';

  const handleOpenFocusedConversation = () => {
    setMessageClicked(true);
    setMessageNotifClicked(true); // Signal to parent to hide global tabs
  };

  const handleFabClicked = useCallback(() => {
    setFabNewConversation((prev) => !prev);
  }, []);

  const handleConversationClicked = async () => {
    if (focusedConversation) {
      if (currentUserID === focusedConversation?.lastSenderId || focusedConversation?.isTargetRead) {
        handleOpenFocusedConversation();
      } else {
        try {
          setIsFetching(true);
          const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/last/${focusedConversation?._id}`
          );
          if (response.data) handleOpenFocusedConversation();
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetching(false);
        }
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {fabNewConversation ? (
        <Box p={1}>
          <NewConversation handleFabClicked={handleFabClicked} />
        </Box>
      ) : (
        <React.Fragment>
          {/* ─── INBOX HEADER ─── */}
          {!messageClicked && (
            <Box p={2} pb={1}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ForumRounded sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" fontWeight={900} letterSpacing="0.05rem">
                   Chat Window
                </Typography>
              </Stack>
              
              {/* Subtle Search bar within the inbox */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <SearchRounded sx={{ fontSize: 18, opacity: 0.4, mr: 1 }} />
                <InputBase 
                  placeholder="Search communications..." 
                  sx={{ fontSize: '0.75rem', flex: 1, fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}

          <Box
            height={!messageClicked ? "calc(100vh - 180px)" : "100vh"}
            sx={{
              overflowY: "auto",
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {!messageClicked ? (
              <Stack p={1} spacing={0.5}>
                {conversations?.map((conversation) => (
                  <ConversationLayout
                    conversation={conversation}
                    handleConversationClicked={handleConversationClicked}
                    key={conversation._id || conversation}
                    currentUserName={user?.name}
                    currentUserID={currentUserID}
                    setFocusedConversation={setFocusedConversation}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </Stack>
            ) : (
              <Box>
                <ConversationDetailed
                  handleConversationClicked={() => {
                    setMessageClicked(false);
                    setMessageNotifClicked(false);
                  }}
                  focusedConveration={focusedConversation}
                  currentUserName={user?.name}
                  currentUserID={user?._id}
                />
              </Box>
            )}
          </Box>

          {/* ─── METATRON FAB ─── */}
          {!messageClicked && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
              }}
            >
              <Fab
                variant="extended"
                size="medium"
                disabled={isFetching}
                onClick={handleFabClicked}
                sx={{
                  bgcolor: '#14D2BE',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1rem',
                  px: 3,
                  boxShadow: '0 8px 20px rgba(20, 210, 190, 0.3)',
                  '&:hover': {
                    bgcolor: '#0FA88F',
                    transform: 'scale(1.05)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(20, 210, 190, 0.3)'
                  }
                }}
              >
                <Add sx={{ mr: 1, fontSize: 18 }} />
                Message
              </Fab>
            </Box>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}