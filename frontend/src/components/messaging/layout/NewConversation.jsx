import { Close, PersonSearchRounded, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomCountryName from "../../utilities/CustomCountryName";
import { resetClearConversations } from "../../../redux/CurrentConversations";
import { appColors } from "../../../utils/colors";
import { avatarSx, iconButtonSx, panelSx, scrollAreaSx } from "../communicationStyles";

function NewConversation({ handleFabClicked }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearched, setUserSearched] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isClosedDropDown, setIsClosedDropDown] = useState(false);
  const [showMessageArea, setShowMessageArea] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  // track the state of network request by display progress
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);


  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      try {
        // set is fetching to true
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/search/result/user`,
          {
            params: { search: value },
          }
        );
        setSuggestions(response.data);
      } catch (err) {
        // error occurred during fetch query
        console.error(err);
      } finally {
        // close is fetching
        setIsFetching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // handle the display of the drop down containing search suggestions
  const handleDisplayDropdown = () => {
    setIsClosedDropDown((prev) => !prev);
  };

  //  handle submission of the conversation
  const handleSubmitConversation = async (event) => {
    // prevent default form submission
    event.preventDefault();

    // conversationObject
    const conversation = {
      senderId: user._id,
      content: messageContent,
      participants: [user._id, userSearched._id],
    };

    // call api request to post data to the backend
    try {
      // set is fetching to true
      setIsUploading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/create`,
        conversation
      );
      if (response.data) {
        // reset clear all the current conversation messages for redux to trigger refetch
        dispatch(resetClearConversations())
        
        // revere the state which will display conversations
        handleFabClicked();
      }
    } catch (err) {
      // error occurred during fetch query
      console.error(err);
    } finally {
      // close is fetching
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        sx={{ px: 1, py: 1.25, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Box minWidth={0}>
          <Typography variant="caption" color="primary.main" fontWeight={900}>
            NEW THREAD
          </Typography>
          <Typography variant="body2" fontWeight={900}>
            Compose Conversation
          </Typography>
        </Box>
        <IconButton sx={iconButtonSx} onClick={handleFabClicked}>
          <Close sx={{ width: 15, height: 15 }} />
        </IconButton>
      </Stack>

      <Stack sx={{ flex: 1, minHeight: 0, p: { xs: 1, sm: 1.5 }, ...scrollAreaSx }} spacing={1.5}>
        <Box sx={(theme) => ({ ...panelSx(theme), p: 1.5 })}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1.25}>
            <PersonSearchRounded sx={{ width: 18, height: 18, color: appColors.primary }} />
            <Typography variant="body2" fontWeight={900}>
              Choose Recipient
            </Typography>
          </Stack>
          <TextField
            label="Search developers, recruiters, mentors"
            fullWidth
            size="small"
            variant="outlined"
            value={searchTerm}
            disabled={isUploading}
            onChange={handleSearch}
            autoComplete="off"
          />

          {isFetching && (
            <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Searching network...
              </Typography>
            </Stack>
          )}

          {!isFetching && isClosedDropDown && suggestions?.length > 0 && (
            <Box display="flex" justifyContent="center" mt={1.25}>
              <Button size="small" onClick={handleDisplayDropdown} sx={{ textTransform: "none", fontWeight: 800 }}>
                Show results
              </Button>
            </Box>
          )}

          {!isFetching && !isClosedDropDown && suggestions?.length > 0 && (
            <Box sx={{ mt: 1.25, maxHeight: 330, ...scrollAreaSx }}>
              {suggestions.map((availableuser) => (
                <MenuItem
                  key={availableuser._id}
                  disabled={availableuser._id === user._id}
                  onClick={() => {
                    setSearchTerm(`${availableuser?.name}`);
                    if (availableuser._id !== user._id) {
                      setUserSearched(availableuser);
                    }
                    setShowMessageArea(true);
                  }}
                  sx={(theme) => ({
                    ...panelSx(theme),
                    mb: 0.75,
                    p: 0,
                    overflow: "hidden",
                    whiteSpace: "normal",
                  })}
                >
                  <ListItem sx={{ px: 1.25, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={availableuser.avatar} alt={availableuser?.name} sx={avatarSx} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={900}>
                          {availableuser?.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {availableuser?.specialisationTitle || "Tech professional"}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" display="block">
                            {CustomCountryName(availableuser?.country)} | {availableuser?.county}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </MenuItem>
              ))}
              <Divider component="div" sx={{ my: 1 }} />
              <Box display="flex" justifyContent="center">
                <Button size="small" disabled={isUploading} onClick={handleDisplayDropdown} sx={{ textTransform: "none" }}>
                  Hide results
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {showMessageArea && (
          <Box component="form" onSubmit={handleSubmitConversation} sx={(theme) => ({ ...panelSx(theme), p: 1.5 })}>
            <Typography variant="caption" color="primary.main" fontWeight={900}>
              MESSAGE
            </Typography>
            <TextField
              placeholder={
                userSearched?.name?.length > 1
                  ? `Write your message to ${userSearched?.name?.split(" ")[0]}...`
                  : "Write your message..."
              }
              multiline
              minRows={7}
              maxRows={12}
              disabled={isUploading}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              fullWidth
              sx={{ mt: 1 }}
            />
            <Box display="flex" justifyContent="flex-end" mt={1.25}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || messageContent.trim().length < 1}
                endIcon={isUploading ? <CircularProgress size={14} /> : <Send sx={{ width: 16, height: 16 }} />}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 900 }}
              >
                {isUploading ? "Sending" : "Send Message"}
              </Button>
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default NewConversation;
