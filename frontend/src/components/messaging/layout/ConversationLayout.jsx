import { Visibility, DoneAllRounded } from "@mui/icons-material";
import { Badge, Box, CardActionArea, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useMemo } from "react";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getElapsedTime } from "../../utilities/getElapsedTime";

export default function ConversationLayout({
  conversation,
  handleConversationClicked,
  currentUserName,
  currentUserID,
  setFocusedConversation,
  isDarkMode = false
}) {
  
  // ─── DATA RESOLVERS ───
  const { partnerName, partnerAvatar } = useMemo(() => {
    const isCurrentUserSender = currentUserName?.toLowerCase() === conversation?.senderName?.toLowerCase();
    return {
      partnerName: isCurrentUserSender ? conversation?.targetName : conversation?.senderName,
      partnerAvatar: isCurrentUserSender ? conversation?.targetAvatar : conversation?.senderAvatar
    };
  }, [currentUserName, conversation]);

  const isUnread = currentUserID !== conversation?.lastSenderId && !conversation?.isTargetRead;

  const truncateMessage = () => {
    const lastMessage = conversation?.lastMessage || "";
    let limit = 37;
    if (CustomDeviceSmallest()) limit = 12;
    else if (CustomDeviceIsSmall()) limit = 18;
    else if (CustomDeviceTablet()) limit = 30;
    
    return lastMessage.length > limit ? `${lastMessage.substring(0, limit)}...` : lastMessage;
  };

  return (
    <Box
      sx={{
        mb: 1,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: isUnread ? "rgba(20, 210, 190, 0.3)" : "divider",
        bgcolor: isUnread 
          ? (isDarkMode ? "rgba(20, 210, 190, 0.05)" : "rgba(20, 210, 190, 0.03)")
          : "transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          borderColor: "primary.main",
          transform: "translateX(4px)"
        }
      }}
    >
      <CardActionArea
        onClick={() => {
          setFocusedConversation(conversation);
          handleConversationClicked();
        }}
        sx={{ p: 1.5 }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          {/* AVATAR CLUSTER */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            invisible={!isUnread}
            sx={{ 
              '& .MuiBadge-badge': { 
                bgcolor: '#14D2BE', 
                boxShadow: `0 0 0 2px ${isDarkMode ? '#121212' : '#fff'}`,
                width: 10,
                height: 10,
                borderRadius: '50%'
              } 
            }}
          >
            <Avatar
              alt={partnerName}
              src={partnerAvatar}
              variant="rounded"
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "divider"
              }}
            />
          </Badge>

          {/* CONTENT CLUSTER */}
          <Box flex={1} minWidth={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography
                variant="body2"
                fontWeight={isUnread ? 900 : 700}
                sx={{ 
                  color: isUnread ? "primary.main" : "text.primary",
                  fontSize: "0.85rem",
                  letterSpacing: "-0.01em"
                }}
              >
                {partnerName?.toUpperCase()}
              </Typography>
              
              <Typography variant="caption" sx={{ opacity: 0.5, fontSize: "0.65rem", fontWeight: 600 }}>
                {getElapsedTime(conversation?.updatedAt)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography
                variant="caption"
                sx={{
                  color: isUnread ? "text.primary" : "text.secondary",
                  fontWeight: isUnread ? 600 : 400,
                  fontSize: "0.75rem",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "85%"
                }}
              >
                {truncateMessage()}
              </Typography>

              {/* Status Indicators */}
              {currentUserID === conversation?.lastSenderId && (
                <Box display="flex" alignItems="center">
                  {conversation?.isTargetRead ? (
                    <DoneAllRounded sx={{ fontSize: 14, color: 'primary.main' }} />
                  ) : (
                    <Visibility sx={{ fontSize: 14, opacity: 0.3 }} />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Box>
  );
}