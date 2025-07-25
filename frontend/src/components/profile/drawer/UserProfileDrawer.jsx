import {
  Diversity1Rounded,
  GradeRounded,
  InfoOutlined,
  LaptopRounded,
  Message,
  PeopleRounded,
  PersonAdd,
  PersonRemove,
  Star,
  UploadRounded
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetClearShowMessageInput,
  resetDefaultBottomNav,
} from "../../../redux/AppUI";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import { updateUserCurrentUserRedux } from "../../../redux/CurrentUser";
import PostDetailsInDrawer from "../../post/PostDetailsInDrawer";
import SnackbarConnect from "../../snackbar/SnackbarConnect";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getImageMatch } from "../../utilities/getImageMatch";
import UserPostFavoriteContainer from "./UserPostFavoriteContainer";
const UserNetwork =lazy(()=>import("../UserNetwork")) ;
const PostDetailsContainer = lazy(() =>
  import("../../post/PostDetailsContiner")
);
const UserAbout = lazy(() => import("../UserAbout"));
const UserPostContainDrawer = lazy(() => import("./UserPostContainDrawer"));
const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 20,
    width: "100%",
    backgroundColor: "transparent",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.caption,
    fontSize: theme.typography.pxToRem(13),
    padding: theme.typography.pxToRem(2),
    color: "gray",
    "&.Mui-selected": {
      color: "primary",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

// input base
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default function UserProfileDrawer({ profileData }) {
  const[isPostDetailedDrawer,setIsPostDetailedDrawer]=useState(false)
  // get redux states
  const { user } = useSelector((state) => state.currentUser);

  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );

  const { currentMode, isMessageProfile } = useSelector((state) => state.appUI);
   const isDarkMode=currentMode==='dark'
  // for full post details rendering
  const [postDetailedData, setPostDetailedData] = useState();
  // for monitoring api request status
  const [isConnecting, setIsConnecting] = useState(false);
  // track if the focused post is on edit/update mode just viewing
  const [isPostEditMode, setIsPostEditMode] = useState(false);
  // controlling showing of message input view
  const [isShowMessageInput, setIsShowMessageInput] = useState(
    false || isMessageProfile
  );
  const [messageContent, setMessageContent] = useState("");
  // will be used to check if users are friends
  const [isFriend, setIsFriend] = useState();

  // controls the tab to be displayed
  const [profileSection, setProfileSection] = useState(0);

  const handleChange = (event, newValue) => {
    setProfileSection(newValue);
  };


  // for checking user relationships
  useEffect(() => {
    // map through ids of friends if the current user network
    // has the id of the post owner, means are friends else false
    if (user?.network?.includes(profileData?._id)) {
      setIsFriend(true);
    }
  }, [profileData, user]);



  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetDefaultBottomNav(true));
  });

  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

  // check if is current user and manoeuver the display of follow and send message btb
  const isCurrentUser = user._id === profileData?._id;

  const {
    _id: currentUserId,
    name,
    avatar,
    country,
    county,
    specialisationTitle: title,
  } = user || {};

  // id of the target user requesting connect, its the id of the profile data
  const { _id: targetID } = profileData || {};

  // handle display of message input
  const handleShowMessageInput = () => {
    // clear the message content
    setMessageContent("");
    setIsShowMessageInput((prev) => !prev);

    // false the redux state for showing message input when profile drawer launches
    dispatch(resetClearShowMessageInput());
  };

  // handle user connect request
  const handleCreateConnect = () => {
    const dataUserSendingRequest = {
      senderId: currentUserId,
      targetId: targetID,
      country: CustomCountryName(country),
      state: county,
      name,
      avatar,
      title,
      message: "requesting to connect",
    };

    // set is fetching to true
    setIsConnecting(true);

    // performing post request and passing data for body request
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/create`,
        dataUserSendingRequest
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateMessageConnectRequest(res.data));
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }
        dispatch(updateMessageConnectRequest(err?.response?.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsConnecting(false);
      });
  };

  // handle unfriending a user
  const handleRequestUnfriend = () => {
    // set is fetching to true
    setIsConnecting(true);

    // performing delete request and passing id of the currently user and that of miniprofile user being
    // viewed
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${profileData?._id}`
      )
      .then((res) => {
        if (res?.data && res.data) {
          // update the redux state of the currently logged in user from backend who is sender user
          dispatch(updateUserCurrentUserRedux(res.data.senderUser));

          // update the message of the snackbar
          dispatch(updateMessageConnectRequest(res.data.message));

          // set is friend false
          setIsFriend(false);
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }
        dispatch(updateMessageConnectRequest(err?.response?.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsConnecting(false);
      });
  };

  // handle sending of the message
  const handleSendingMessage = async () => {
    // conversationObject
    const conversation = {
      senderId: user._id,
      content: messageContent,
      participants: [user._id, profileData._id],
    };

    // call api request to post data to the backed
    try {
      // set is fetching to true
      setIsConnecting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/create`,
        conversation
      );
      //update the conversation with the one returned from the backend
      if (response.data) {
        dispatch(updateMessageConnectRequest("message has been sent"));
        // clear the message content
        setMessageContent("");
      }
    } catch (err) {
      if (err?.code === "ERR_NETWORK") {
        dispatch(
          updateMessageConnectRequest(
            "server is unreachable check your internet"
          )
        );
        return;
      }
      dispatch(updateMessageConnectRequest(err?.response?.data));
    } finally {
      // close is fetching
      setIsConnecting(false);
    }
  };

  return (
    <Box
      color={"text.primary"}
      borderRadius={2} 
      maxHeight={'90vh'}   
      sx={{
        overflowX: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* displayed for full post details when data is present */}
      {postDetailedData ? (
        <React.Fragment>
          {isPostDetailedDrawer ?(
            <React.Fragment>
          {/* the post is detailed view and not edit mode */}
           <PostDetailsInDrawer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
            isDrawerFocused={true}
            />
          
            </React.Fragment>
          ):(
            <React.Fragment>
              {/* post is in edit mode */}
              <PostDetailsContainer
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
              isDrawerFocused={true}
              isPostEditMode={isPostEditMode}
              setIsPostEditMode={setIsPostEditMode}
          />
            </React.Fragment>
          )}
            
        </React.Fragment>
        
      ) : (
        <Box p={2}>
          {/* shown when there is profile info */}
            <Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Avatar 
                src={user?.avatar}
                alt="" 
                sx={{ width: 90, height: 90 }} />
              </Box>
              {/* name of the user */}
              <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Typography
                  fontWeight={"bold"}
                  mt={1}
                  variant="body1"
                  textTransform={"uppercase"}
                >
                  {profileData?.name}
                </Typography>
              </Box>
              {/* specialisation */}
              <Box
                display={"flex"}
                justifyContent={"center"}
                mb={1}
                gap={1}
                alignItems={"center"}
              >
                <LaptopRounded sx={{ width: 17, height: 17 }} />
                <Typography color={"text.secondary"} variant="body2">
                  {profileData?.specialisationTitle}
                </Typography>
              </Box>

              {/* location of the user */}
              <Box
                display={"flex"}
                justifyContent={"space-around"}
                alignItems={"center"}
              >
                {/* country */}
                <Typography variant="body2" color={"text.secondary"}>
                  {/* call this if only miniprofile data present */}
                  {handleCountryName(profileData?.country)}
                </Typography>
                {/* divider vert */}
                <Divider
                  component={"div"}
                  variant="middle"
                  orientation="vertical"
                  className="p-1"
                />
                {/* state or county */}
                <Typography variant="body2" color={"text.secondary"}>
                  {profileData?.county}
                </Typography>

                {/* divider vert */}
                <Divider
                  component={"div"}
                  variant="middle"
                  orientation="vertical"
                  className="p-1"
                />

                <Box display={"flex"} gap={1} alignItems={"center"}>
                  {/* network connection count */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pt: "2px" }}
                  >
                    {profileData?.network_count}
                  </Typography>

                  {/* diversity network icon */}
                  <Diversity1Rounded sx={{ width: 20, height: 20 }} />
                </Box>
              </Box>

              {!isCurrentUser && (
                <React.Fragment>
                  <Divider component={"div"} />
                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    m={2}
                  >
                    {/* message */}
                    <Button
                      variant="outlined"
                      disableElevation
                      onClick={handleShowMessageInput}
                      disabled={isShowMessageInput}
                      startIcon={<Message />}
                      sx={{ borderRadius: 5, fontWeight: "bold" }}
                    >
                      <Typography variant="body2">
                        <small
                          style={{
                            fontSize: "small",
                            textTransform: "capitalize",
                          }}
                        >
                          Message
                        </small>
                      </Typography>
                    </Button>

                    {/* befriend or unfriend */}

                    {isFriend ? (
                      <Button
                        variant="outlined"
                        disableElevation
                        startIcon={<PersonRemove />}
                        disabled={isConnecting}
                        color="warning"
                        onClick={handleRequestUnfriend}
                        sx={{ borderRadius: 5, fontWeight: "bold" }}
                      >
                        <Typography variant="body2">
                          <small
                            style={{
                              fontSize: "small",
                              textTransform: "capitalize",
                            }}
                          >
                            remove
                          </small>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disableElevation
                        startIcon={<PersonAdd />}
                        disabled={isConnecting}
                        onClick={handleCreateConnect}
                        sx={{ borderRadius: 5, fontWeight: "bold" }}
                      >
                        <Typography variant="body2">
                          <small
                            style={{
                              fontSize: "small",
                              textTransform: "capitalize",
                            }}
                          >
                            Connect
                          </small>
                        </Typography>
                      </Button>
                    )}
                  </Box>
                </React.Fragment>
              )}

              <Divider component={"div"} />
              <Box
                display={"flex"}
                justifyContent={"center"}
                mb={1}
                mt={1}
                gap={1}
                alignItems={"center"}
              >
                <GradeRounded sx={{ width: 20, height: 20 }} color="warning" />
                {/* skills avatars */}
                <Box display={"flex"} justifyContent={"center"}>
                  <AvatarGroup max={profileData?.selectedSkills?.length}>
                    {/* loop through the skills and their images matched using custom fn */}
                    {profileData?.selectedSkills?.map((skill, index) => (
                      <Tooltip title={skill} arrow key={skill}>
                        <Avatar
                          alt={skill}
                          className="border"
                          sx={{ width: 30, height: 30 }}
                          src={getImageMatch(skill)}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
            </Box>
            {/* divider */}
            <Divider component={"div"} />

            <Box display={"flex"} justifyContent={"center"} py={1}>
              <Typography variant="caption" color="text.secondary">
                {profileData?.about || "** No About**"}
              </Typography>
            </Box>

            <Divider component={"div"} />
            
            <Box className="d-flex justify-content-center align-items-center">
              <StyledTabs
                value={profileSection}
                onChange={handleChange}
                aria-label="styled tabs"
              >
                {/* posts made by the user */}
                <StyledTab
                  className="pe-2"
                  label={
                    <Box 
                    display={'flex'}
                    gap={0.5}
                    alignItems={'center'}
                    >
                      {/* icon */}
                      <UploadRounded 
                      sx={{ width:22,height:22 }}/>
                      {/* text */}
                    <Typography fontWeight={'bold'} variant="body2">
                      Posted
                    </Typography>
                    </Box>
                  }
                />

              {/* favorite posts */}
              <StyledTab
                  className="ps-2"
                  label={
                    <Box 
                    display={'flex'}
                    gap={0.5}
                    alignItems={'center'}
                    >
                      {/* icon */}
                      <Star 
                      sx={{ width:18,height:18 }}
                      />
                      {/* text */}
                    <Typography
                     fontWeight={'bold'}
                      variant="body2">
                      Favorite
                    </Typography>
                    </Box>
                  }
                />

                {/* user's connections of people */}
                <StyledTab
                  className="ps-2"
                  label={
                    <Box 
                    display={'flex'}
                    gap={0.5}
                    alignItems={'center'}
                    >
                      {/* icon */}
                      <PeopleRounded
                      sx={{ width:18,height:18 }}
                      />
                      {/* text */}
                    <Typography
                     fontWeight={'bold'}
                      variant="body2">
                      People
                    </Typography>
                    </Box>
                  }
                />

                {/* info more about the user */}
                <StyledTab
                  label={
                    <Box 
                    display={'flex'}
                    gap={0.5}
                    alignItems={'center'}
                    >
                      {/* icon */}
                      <InfoOutlined
                      sx={{ width:18,height:18 }}
                      />
                      {/* text */}
                    <Typography
                     fontWeight={'bold'}
                      variant="body2">
                      About
                    </Typography>
                    </Box>
                  }
                />
              </StyledTabs>
            </Box>

            <Divider component={"div"} />

            {/* show message input if state permits */}
            {isShowMessageInput ? (
              <Box
                className="mx-1 rounded mt-2"
                bgcolor={!isDarkMode && "whitesmoke"}
              >
                {/* message input */}
                <StyledInputBase
                  multiline
                  fullWidth
                  sx={{ padding: "20px" }}
                  disabled={isConnecting}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="write message ..."
                  inputProps={{ "aria-label": "search" }}
                />
                <Box display={"flex"} justifyContent={"flex-end"} mr={1}>
                  <Box display={"flex"} gap={3} alignItems={"center"}>
                    {/* close the message input */}
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isConnecting}
                      onClick={handleShowMessageInput}
                      sx={{ borderRadius: "20px", fontSize: "10px" }}
                    >
                      close
                    </Button>

                    {/* send message */}
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={messageContent?.length < 1 || isConnecting}
                      onClick={handleSendingMessage}
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
                  </Box>
                </Box>
              </Box>
            ) : (
              <React.Fragment>
                {/* content of each tab goes here */}
                <Box>
                  <Suspense fallback={<div>loading...</div>}>
                    {/* posts made by the user, and also favorite posts added by 
                    the user 
                    */}
                    {(profileSection === 0 ) && (
                      <UserPostContainDrawer
                        userId={profileData?._id}
                        setPostDetailedData={setPostDetailedData}
                        setIsPostEditMode={setIsPostEditMode}
                        setIsPostDetailedDrawer={setIsPostDetailedDrawer}
                      />
                    )}

                    {/* show user favorite */}
                    {profileSection === 1 && (
                      <UserPostFavoriteContainer
                      userId={profileData?._id}
                      setPostDetailedData={setPostDetailedData}
                      setIsPostEditMode={setIsPostEditMode}
                      setIsPostDetailedDrawer={setIsPostDetailedDrawer}
                      />
                    )}

                    {/* user network of people */}
                    {profileSection === 2 && (
                      <UserNetwork
                        otherUserID={!isCurrentUser ? profileData?._id : null}
                      />
                    )}

                    {/* about view */}
                    {profileSection === 3 && (
                      <UserAbout profileData={profileData} />
                    )}
                  </Suspense>
                </Box>
              </React.Fragment>
            )}
          </Box>
      )}

      {/* connect request response snackbar */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </Box>
  );
}
