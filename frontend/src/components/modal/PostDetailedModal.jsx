import { Close, SendOutlined } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  Modal,
  styled
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSetPostEditIdModal, handleShowingPostDetailedModal } from "../../redux/AppUI";
import CommentContainer from "../post/CommentContainer";
import PostDetailsFeed from "../post/PostDetailsFeed";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
  
  // styled modal
  const StyledModalJob = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  
  const MAX_TEXT_LENGTH=100
  
  const PostDetailedModal = () => {
    // axios default credentials
    axios.defaults.withCredentials = true;

    const [postDetailedData,setPostDetailedData]=useState()
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [comment, setComment] = useState("");
    const dispatch=useDispatch()

    // redux states
    const {
       currentMode, 
      isTabSideBar,
      isPostFullDetailModal,
      postEditUniqueId } = useSelector((state) => state.appUI);
      
      // updating the isDark mode 
      const isDarkMode=currentMode==='dark'


    // redux states
    const { user } = useSelector((state) => state.currentUser);

    // extract basic current user details
    const { _id, avatar, name, county, specialisationTitle: title } = user || {};

  
    // use layout effect and fetch user specific post based on that Id
    useEffect(()=>{
    
      axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all/${postEditUniqueId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the  current post
        if (res?.data) {
         setPostDetailedData(res.data)
        } 
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable "
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
        
      });
    },[postEditUniqueId])

 
   
    // complete sending of the comment to the backend
      const handleSendCommentNow = () => {
        // current user info
        const reactingUserInfo = {
            userId: _id,
            ownerId: postDetailedData?.post_owner?.ownerId,
            postId: postDetailedData?._id,
            avatar,
            name,
            country:CustomCountryName(user?.country),
            county,
            title,
        };
       

        // sending the post tile embed in message and will split for separation backend
        let message = `commented on your post.${postDetailedData?.post_title?.substring(
          0,
          25
        )}`;
        // add the above properties to the userInfo that is being sent to the backend
        reactingUserInfo.message = message;
        reactingUserInfo.minimessage = comment;
        // add users to the liked clickers group and increment the value of clicks
        setIsUploading(true);
        // performing post request
        axios
          .put(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/comments`,
            reactingUserInfo,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            
            // update passedPost with the returned post object
            setPostDetailedData(res.data);
    
              // come up with redux update strategy in the navbar for
            // fetching latest notifications
            
          })
          .catch(async (err) => {
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage("Server Unreachable");
              return;
            }
    
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            setIsUploading(false);
            // set comment to empty
            setComment("");
          });
      };


        // handle the closing of the modal
    const handleClosingModal = () => {
        // reset the postId in the redux
        dispatch(handleSetPostEditIdModal(""))

            // set post detailed data to none
            setPostDetailedData({})

        // close the model via redux state
        dispatch(handleShowingPostDetailedModal(false))
    };

    // handle width of the global search
      const handleModalWidth=()=>{
        if (CustomDeviceTablet() && isTabSideBar) {
          return "36%"
        } else if(CustomLandScape()){
          return "-1%"
        } else if(CustomLandscapeWidest()){
          return "0%"
        }
      }

    return (
      <StyledModalJob
        keepMounted
        open={isPostFullDetailModal}
         onClose={handleClosingModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={CustomDeviceIsSmall() ? "100%":CustomDeviceTablet()?"80%":"40%"}
          p={1}
          borderRadius={3}
          bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
          color={"text.primary"}
          sx={{
            border: isDarkMode && "1px solid gray",
            marginLeft:handleModalWidth()
          }}
        >
          <Box
           maxHeight={"78vh"}
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
  
          {/* display progress status */}
          {isFetching && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'}>
              <CircularProgress size={30}/>
            </Box>
          )}
  
           {/* display error */}
          {errorMessage && (
            <Box p={1} display={"flex"} justifyContent={"center"}>
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="info"
                  className="rounded"
                  onClick={() => setErrorMessage("")}
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            </Box>
          )}
  
          {/* rendered when are posts */}
          {postDetailedData &&  (
            <PostDetailsFeed
              postDetailedData={postDetailedData} 
              setPostDetailedData={setPostDetailedData}/>
          )}

           {/* all user comments container pass the comments of the post */}
              <Box>
                  <CommentContainer
                  post_comments={postDetailedData?.post_comments?.comments}
                  postId={postDetailedData?._id}
                  setPostDetailedData={setPostDetailedData}
                  />
              </Box>

                {/* comment input text  */}
                    <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"100%"}
                    p={1}
                    mb={5}
                    bgcolor={"background.default"}
                    className={'rounded'}
                    sx={{ border:'1px solid', borderColor:'divider' }}
                    >
                    {/* input for comment */}
                    <Box width={"100%"} mx={1}>
                        <InputBase
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxRows={2}
                        disabled={isUploading}
                        className="w-100"
                        placeholder="write new comment ..."
                        sx={{
                            fontSize: "small",
                        }}
                          />
                      </Box>
              
                      {/* send comment button icon */}
                  <Box className=" rounded ms-1 pe-1" alignContent={"center"}>
                      {isUploading ? (
                      <CircularProgress size={17} />
                      ) : (
                      <Badge badgeContent={`${MAX_TEXT_LENGTH - comment.length}`}>
                          <IconButton
                          disabled={comment.length > MAX_TEXT_LENGTH || comment.length<1}
                          onClick={handleSendCommentNow}
                          >
                          <SendOutlined
                              color={comment.length <= MAX_TEXT_LENGTH ? "primary" : "inherit"}
                              sx={{ width: 18, height: 18 }}
                          />
                          </IconButton>
                      </Badge>
                      )}
                  </Box>
                  </Box>

            </Box>
            </Box>
      </StyledModalJob>
    );
  };
  
  export default PostDetailedModal;
  