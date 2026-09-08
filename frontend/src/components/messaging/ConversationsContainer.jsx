import { Add, ForumRounded, MarkEmailUnreadRounded, SearchRounded } from "@mui/icons-material";
import { Box, Fab, Stack, Typography, InputBase } from "@mui/material";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { appColors } from "../../utils/colors";
import { panelSx, scrollAreaSx } from "./communicationStyles";
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
  const unreadCount = useMemo(
    () =>
      conversations?.filter(
        (conversation) => currentUserID !== conversation?.lastSenderId && !conversation?.isTargetRead
      )?.length || 0,
    [conversations, currentUserID]
  );

  const handleOpenFocusedConversation = () => {
    setMessageClicked(true);
    setMessageNotifClicked(true); // Signal to parent to hide global tabs
  };

  const handleFabClicked = useCallback(() => {
    setFabNewConversation((prev) => !prev);
  }, []);

  const handleConversationClicked = async (selectedConversation = focusedConversation) => {
    if (selectedConversation) {
      setFocusedConversation(selectedConversation);
      if (currentUserID === selectedConversation?.lastSenderId || selectedConversation?.isTargetRead) {
        handleOpenFocusedConversation();
      } else {
        try {
          setIsFetching(true);
          const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/last/${selectedConversation?._id}`
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
    <Box sx={{ position: 'relative', height: '100%', display: "flex", flexDirection: "column" }}>
      {fabNewConversation ? (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <NewConversation handleFabClicked={handleFabClicked} />
        </Box>
      ) : (
        <React.Fragment>
          {!messageClicked && (
            <Box sx={{ px: { xs: 0.5, sm: 0.75 }, pb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      background: isDarkMode ? "rgba(214,178,94,0.12)" : "rgba(214,178,94,0.08)",
                    }}
                  >
                    <ForumRounded sx={{ color: 'primary.main', fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={900}>
                      Message Inbox
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {conversations?.length || 0} conversations
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={(theme) => ({ ...panelSx(theme), px: 1, py: 0.65, minWidth: 76 })}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Unread
                  </Typography>
                  <Typography variant="body2" fontWeight={900} color="primary.main">
                    {unreadCount}
                  </Typography>
                </Box>
              </Stack>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.6,
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
            sx={{
              flex: 1,
              minHeight: 0,
              pb: !messageClicked ? 8 : 0,
              ...scrollAreaSx,
              transition: 'all 0.3s ease'
            }}
          >
            {!messageClicked ? (
              <Stack p={0.5} spacing={0.75}>
                {conversations?.length > 0 ? (
                  conversations.map((conversation) => (
                    <ConversationLayout
                      conversation={conversation}
                      handleConversationClicked={() => handleConversationClicked(conversation)}
                      key={conversation._id || conversation}
                      currentUserName={user?.name}
                      currentUserID={currentUserID}
                      setFocusedConversation={setFocusedConversation}
                      isDarkMode={isDarkMode}
                    />
                  ))
                ) : (
                  <Box
                    sx={(theme) => ({
                      ...panelSx(theme),
                      p: 3,
                      minHeight: 220,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    })}
                  >
                    <MarkEmailUnreadRounded sx={{ fontSize: 34, color: appColors.primary, mb: 1 }} />
                    <Typography variant="body2" fontWeight={900}>
                      No active conversations yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 260, mt: 0.5 }}>
                      Start a focused thread with a recruiter, mentor, or developer in your network.
                    </Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Box sx={{ height: "100%" }}>
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

          {!messageClicked && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 18,
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
                  bgcolor: appColors.primary,
                  color: '#031018',
                  fontWeight: 900,
                  fontSize: '0.76rem',
                  px: 2.4,
                  borderRadius: "8px",
                  boxShadow: '0 12px 28px rgba(214,178,94, 0.28)',
                  '&:hover': {
                    bgcolor: appColors.primarySoft,
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(214,178,94, 0.3)'
                  }
                }}
              >
                <Add sx={{ mr: 0.75, fontSize: 18 }} />
                New Message
              </Fab>
            </Box>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}
