import { Close, Edit, Send } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomCountryName from "../../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";

const Search = styled("div")(({ theme }) => ({
  border: "1px solid",
  borderColor: "gray",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  height: "20%",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: CustomDeviceIsSmall()
    ? "32ch"
    : CustomDeviceTablet()
    ? "40ch"
    : "45ch",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
  },
}));

function NewConversation({ handleFabClicked, setAvailableUserConversations }) {
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

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      try {
        // set is fetching to true
        setIsFetching(true);
        const response = await axios.get(
          `http://localhost:5000/metatron/api/v1/users/all/search/result/user`,
          {
            params: { search: value },
          }
        );
        setSuggestions(response.data);
      } catch (err) {
        // error occured during fetch query
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

    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsUploading(true);
      const response = await axios.post(
        `http://localhost:5000/metatron/api/v1/conversations/users/create`,
        conversation
      );
      //update the conversation with the one returned from the backend
      if (response.data) {
        // set conversations to [] this will refresh whole conversations from server
        setAvailableUserConversations([]);
        // revere the state which will display conversations
        handleFabClicked();
      }
    } catch (err) {
      // error occured during fetch query
      console.error(err);
    } finally {
      // close is fetching
      setIsUploading(false);
    }
  };

  return (
    <Box width={"100%"}>
      <Box display={"flex"} alignItems={"center"}>
        {/* icon button */}
        <Box ml={3}>
          <IconButton onClick={handleFabClicked}>
            <Close sx={{ width: 17, height: 17 }} />
          </IconButton>
        </Box>
        {/* info */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"}>
          <Typography variant="caption" textAlign={"center"}>
            New Conversation
          </Typography>
        </Box>
      </Box>
      {/* divider */}
      <Divider component={"div"} />

      <Stack
        display={"flex"}
        justifyContent={"center"}
        mt={2}
        width={"100%"}
        maxHeight={"92vh"}
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
        {/* user search entry */}
        <Box p={2}>
          <TextField
            label="search users"
            fullWidth
            value={searchTerm}
            disabled={isUploading}
            className="ms-3"
            onChange={handleSearch}
            autoComplete="off"
            style={{ marginBottom: "1rem", width: "85%" }}
          />

          {isFetching ? (
            <CircularProgress size={18} />
          ) : (
            <React.Fragment>
              {/* control showing of dropdwon */}
              {isClosedDropDown && suggestions?.length > 0 ? (
                <Stack direction={"row"} justifyContent={"center"}>
                  <Button
                    variant="text"
                    size="small"
                    disabled={isUploading}
                    onClick={handleDisplayDropdown}
                    sx={{
                      textTransform: "lowercase",
                      fontSize: "small",
                    }}
                  >
                    open dropdown
                  </Button>
                </Stack>
              ) : (
                <React.Fragment>
                  {suggestions && suggestions && (
                    <Box
                      maxHeight={330}
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
                      {suggestions.map((availableuser) => (
                        <MenuItem
                          key={availableuser._id}
                          onClick={() => {
                            // extaract the name of the currently selected user
                            setSearchTerm(`${availableuser?.name}`);

                            // update the value of user being searched
                            if (availableuser._id !== user._id) {
                              setUserSearched(availableuser);
                            } else {
                              // clear serach term
                              setSearchTerm("");
                              // clear user
                              setUserSearched();
                              // alert the user
                              alert("you can't send message to yourself!");
                            }

                            // set show message area since user wants to write message
                            setShowMessageArea((prev) => !prev);
                          }}
                        >
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                src={availableuser.avatar}
                                alt={availableuser?.name}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {availableuser?.name}
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    variant="body2"
                                    gutterBottom
                                    component={"span"}
                                    display={"inline-block"}
                                    gap={2}
                                    alignItems={"center"}
                                  >
                                    {CustomCountryName(availableuser?.country)}{" "}
                                    | {availableuser?.county}
                                  </Typography>

                                  <Typography variant="body2" gutterBottom>
                                    {availableuser?.specialisationTitle}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        </MenuItem>
                      ))}
                      {/* close or hide dropdown panel */}
                      {suggestions && suggestions.length > 0 && (
                        <Stack direction={"row"} justifyContent={"center"}>
                          <Button
                            variant="text"
                            size="small"
                            disabled={isUploading}
                            onClick={handleDisplayDropdown}
                            sx={{
                              textTransform: "lowercase",
                              fontSize: "small",
                            }}
                          >
                            close dropdown
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {/* input for writing messsage that will be sent to the user and create
          conversation if not present */}

          {showMessageArea && (
            <Stack width={"100%"} mt={2} gap={1}>
              <form onSubmit={handleSubmitConversation}>
                <Search className="rounded">
                  <SearchIconWrapper>
                    <Edit sx={{ width: 17, height: 17 }} color="primary" />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={
                      userSearched?.name?.length > 5
                        ? `write your message to ${
                            userSearched?.name?.split(" ")[0]
                          } ...`
                        : "write your message ..."
                    }
                    inputProps={{ "aria-label": "search" }}
                    multiline
                    minRows={10}
                    maxRows={20}
                    disabled={isUploading}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    required
                    fullWidth
                  />
                </Search>
                {/* send btn */}
                {isUploading ? (
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    mt={2}
                    gap={2}
                    alignItems={"center"}
                  >
                    <CircularProgress
                      size={20}
                      aria-labelledby="loading progress"
                    />
                    <Typography
                      variant="caption"
                      color={"text.secondary"}
                      fontWeight={"bold"}
                    >
                      sending...
                    </Typography>
                  </Box>
                ) : (
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <IconButton type="submit">
                      <Send />
                    </IconButton>
                  </Box>
                )}
              </form>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default NewConversation;
