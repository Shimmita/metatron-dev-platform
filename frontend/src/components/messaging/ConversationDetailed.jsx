import { ArrowBackIosNewRounded, InfoRounded, MoreVertRounded, SendRounded } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appColors, appGradients } from "../../utils/colors";
import AlertGeneral from "../alerts/AlertGeneral";
import { iconButtonSx, panelSx, scrollAreaSx } from "./communicationStyles";
import MoreMessageLayout from "./layout/MoreMessageLayout";

/* ─── Metatron design tokens ─── */
const C = {
  glassBg: appColors.bgCard,
  glassBorder: appColors.border,
  glassShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 20px ${appColors.glow}`,
  teal: appColors.primary,
  tealLight: appColors.primarySoft,
  tealDark: appColors.primaryDark,
  gold: appColors.accent,
  textPrimary: appColors.textPrimary,
  textSecondary: appColors.textSecondary,
  textMuted: appColors.textMuted,
  success: appColors.success,
  warning: appColors.warning,
  error: appColors.error,
};

/* ─── Styled input base (matches global) ─── */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
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

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false);

  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === "dark";

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMoreMessage = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  /* determine the name and avatar for the top bar (the other participant) */
  const handleTopBarNameAvatar = () => {
    if (focusedConveration?.adminThread) {
      const isAdminViewer = `${currentUserID}` === `${focusedConveration?.adminUserId}`;
      return [
        isAdminViewer ? `TO: ${focusedConveration?.targetName}` : "FROM: Admin",
        isAdminViewer ? focusedConveration?.targetAvatar : focusedConveration?.senderAvatar,
      ];
    }

    if (
      currentUserName?.toLowerCase() ===
      focusedConveration?.senderName?.toLowerCase()
    ) {
      return [
        `TO: ${focusedConveration?.targetName}`,
        focusedConveration?.targetAvatar,
      ];
    }
    return [
      `FROM: ${focusedConveration?.senderName}`,
      focusedConveration?.senderAvatar,
    ];
  };

  const handleMessageAuthorLabel = (message, isOwnMessage) => {
    if (isOwnMessage) return "You";
    if (focusedConveration?.adminThread) {
      const isAdminViewer = `${currentUserID}` === `${focusedConveration?.adminUserId}`;
      return isAdminViewer ? focusedConveration?.targetName?.split(" ")[0] : "Admin";
    }
    return focusedConveration?.senderName?.split(" ")[0];
  };

  axios.defaults.withCredentials = true;

  /* fetch conversation messages */
  useEffect(() => {
    if (conversationMessages?.length > 0) return;
    setIsFetching(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/${focusedConveration?._id}`,
        { withCredentials: true }
      )
      .then((res) => setConversationMessages(res.data))
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") setErrorMessage("Server unreachable!");
        else setErrorMessage(err?.response.data);
        setOpenAlertGeneral(true);
      })
      .finally(() => setIsFetching(false));
  }, [conversationMessages, focusedConveration]);

  const handleDateDisplay = (dateStr) => {
    const parent = dateStr?.split("T")[0]?.split("-");
    return parent
      ? `${parent[parent.length - 1]}/${parent[parent.length - 2]}/${parent[0]}`
      : "";
  };

  /* send a new message */
  const handleSendReplyMessage = async () => {
    const messageObject = {
      conversationId: focusedConveration._id,
      content: replyContent,
      senderId: currentUserID,
      senderName: currentUserName,
    };
    try {
      setIsFetching(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/create`,
        messageObject
      );
      if (response.data)
        setConversationMessages((prev) => [...prev, response.data]);
    } catch (err) {
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true);
    } finally {
      setIsFetching(false);
      setReplyContent("");
    }
  };

  /* update a message */
  const handleUpdateMessageContent = async () => {
    try {
      setIsFetching(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/update/${messageFocused._id}`,
        { content: replyContent }
      );
      if (response.data) {
        setConversationMessages([]); // trigger re-fetch
        setReplyContent("");
        setIsEditingMessage(false);
      }
    } catch (err) {
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true);
    } finally {
      setIsFetching(false);
    }
  };

  /* delete a message */
  const handleDeletingOfMessage = async () => {
    try {
      setIsFetching(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/message/delete/${messageFocused._id}`
      );
      if (response.data) setConversationMessages([]); // re-fetch
    } catch (err) {
      setErrorMessage(err?.response.data);
      setOpenAlertGeneral(true);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: isDarkMode ? appColors.bgDark : appColors.surfaceAlt,
        position: "relative",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: isDarkMode
            ? `linear-gradient(135deg, ${appColors.bgDark}DD, ${appColors.secondarySoft}88)`
            : appGradients.primary,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${appColors.border}`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${appColors.glow}`,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            minHeight: "56px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.1} minWidth={0}>
            <Avatar
              sx={{ width: 38, height: 38, borderRadius: "8px", border: "1px solid rgba(255,255,255,0.28)" }}
              src={handleTopBarNameAvatar()[1]}
              alt={handleTopBarNameAvatar()[0]?.split(" ")[1]}
            />
            <Box minWidth={0}>
              <Typography variant="body2" fontWeight={900} color="white" noWrap>
                {handleTopBarNameAvatar()[0]}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)" }}>
                Secure career thread
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleConversationClicked} sx={{ color: "white", borderRadius: "8px" }}>
            <ArrowBackIosNewRounded sx={{ width: 15, height: 15 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: { xs: 1, sm: 1.5 },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, pr: 0.5, ...scrollAreaSx }}>
          {conversationMessages?.length > 0 ? (
            conversationMessages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUserID;
              return (
                <Box key={index} display="flex" justifyContent={isOwnMessage ? "flex-end" : "flex-start"} mb={1}>
                  <Box
                    sx={(theme) => ({
                      maxWidth: { xs: "88%", sm: "78%" },
                      p: 1.15,
                      border: `1px solid ${appColors.border}`,
                      borderRadius: "8px",
                      background: isOwnMessage
                        ? `linear-gradient(135deg, ${appColors.primaryDark}66, ${appColors.primary}44)`
                        : panelSx(theme).background,
                      backdropFilter: "blur(16px)",
                      position: "relative",
                      overflowWrap: "anywhere",
                    })}
                  >
                    {isOwnMessage && (
                      <Box display="flex" justifyContent="flex-end" mb={0.25}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            handleClickMoreMessage(e);
                            setMessageFocused(message);
                          }}
                          sx={(theme) => ({ ...iconButtonSx(theme), width: 26, height: 26 })}
                        >
                          <MoreVertRounded sx={{ width: 14, height: 14 }} />
                        </IconButton>
                      </Box>
                    )}
                    <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                      {message?.content}
                    </Typography>
                    <Box mt={0.9} display="flex" gap={0.8} alignItems="center" justifyContent="flex-end" flexWrap="wrap">
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "capitalize" }}>
                        {handleMessageAuthorLabel(message, isOwnMessage)}
                      </Typography>
                      {message?.isEdited && (
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          edited
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {handleDateDisplay(message?.createdAt)}{" "}
                        {message?.createdAt?.split(".")[0]?.split("T")[1]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box
              sx={(theme) => ({
                ...panelSx(theme),
                minHeight: 220,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {isFetching ? "Loading conversation..." : "No messages in this thread yet."}
              </Typography>
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{ "aria-labelledby": "more-button" }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: (theme) => ({
                ...panelSx(theme),
                borderRadius: "8px",
                mt: 1,
                overflow: "hidden",
              }),
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

        <Box
          sx={(theme) => ({
            ...panelSx(theme),
            borderRadius: "8px",
            border: `1px solid ${appColors.border}`,
            backdropFilter: "blur(30px)",
            p: 1,
          })}
        >
          <StyledInputBase
            multiline
            fullWidth
            disabled={isFetching}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a message..."
            inputProps={{ "aria-label": "message input" }}
            sx={{
              px: 1,
              py: 0.5,
              fontSize: 13,
              maxHeight: 140,
              overflowY: "auto",
            }}
          />
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Box display="flex" gap={1} alignItems="center">
              {isEditingMessage ? (
                <>
                  <Button
                    variant="outlined"
                    disabled={isFetching}
                    onClick={() => {
                      setIsEditingMessage(false);
                      setReplyContent("");
                    }}
                    size="small"
                    sx={{
                      borderRadius: "8px",
                      fontSize: 11,
                      color: C.textSecondary,
                      borderColor: C.glassBorder,
                      "&:hover": { borderColor: C.teal },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={replyContent?.length < 1 || isFetching}
                    onClick={handleUpdateMessageContent}
                    sx={{
                      borderRadius: "8px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.success,
                      borderColor: C.success,
                      "&:hover": {
                        backgroundColor: `${C.success}14`,
                      },
                    }}
                  >
                    Update
                  </Button>
                </>
              ) : (

                <Button
                  variant="contained"
                  size="small"
                  disabled={replyContent?.length < 1 || isFetching}
                  onClick={handleSendReplyMessage}
                  endIcon={<SendRounded sx={{ width: 14, height: 14 }} />}
                  sx={{
                    borderRadius: "8px",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: `${C.success}14`,
                    },
                  }}
                >
                  Send
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Error alert */}
      {errorMessage && (
        <AlertGeneral
          title="Something went wrong!"
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded />}
        />
      )}
    </Box>
  );
};

export default ConversationDetailed;
