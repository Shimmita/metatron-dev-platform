import { Close, DoneRounded, SendOutlined } from "@mui/icons-material";
import { Alert, Badge, Box, Button, CircularProgress, Collapse, IconButton, InputBase, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomCountryName from "../utilities/CustomCountryName";
import { getElapsedTime } from "../utilities/getElapsedTime";
import CommentsReply from "./CommentsReply";

const MAX_TEXT_LENGTH=100

export default function CommentUser({ comment: commenter, postId, setPostDetailedData }) {
  const [isUploading, setIsUploading] = useState(false);  
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  
  const[isOpenReply,setIsOpenReply]=useState(false)
  const[isOpenReplyComments,setIsOpenReplyComments]=useState(false)
  const[isEditing,setIsEditing]=useState(false)
  const[isDeleteComment,setIsDeleteComment]=useState(false)
  const [repliesData,setRepliesData]=useState([])

    // axios default credentials
    axios.defaults.withCredentials = true;
    const { user } = useSelector((state) => state.currentUser);
    const userId=user?._id

    // hold boolean if the comment belongs to the current user
    // it has the userId attribute
    const isCurrentUserComment=userId ===commenter?.userId

    // hold the id of the comment, this is not userId
    const commentId=commenter?._id

    // holds the commenter id, the id of the owner of the parent comment
    const parentCommenterId=commenter?.userId

    // handle showing of the reply box input
    const handleShowReplyInput=()=>{
      setIsOpenReply((prev)=>!prev)
    }

    // handle editing
    const handleEditing=()=>{
      // set message of the comment
      setReplyText(commenter?.minimessage)
      // show reply input
      setIsEditing((prev)=>!prev)
    }

    // handle delete comment
    const handleDeleteComment=()=>{
      setIsDeleteComment((prev)=>!prev)
    }

    // handle complete sending reply
      const handleCompleteSendingReply=()=>{
        // extract basic current user details
        const { avatar, name, specialisationTitle: title } = user || {};

        // user location
        const country = CustomCountryName(user?.country);

        const replyCommentObject = {
          userId,
          avatar,
          name,
          country,
          title,
          parentPostId:postId,
          parentCommentId:commentId,
          parentCommenterId,
          minimessage:replyText
        };

        setIsUploading(true);
          // performing delete request
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/reply/comments/`, replyCommentObject,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update passedPost with the returned post object
             setPostDetailedData(res.data)
            })
            .catch(async (err) => {

              if (err?.code === "ERR_NETWORK") {
                setErrorMessage("Server Unreachable");
                return;
              }
      
              setErrorMessage(err?.response.data);

              console.log(errorMessage)
            })
            .finally(() => {
              setIsUploading(false);
              setIsOpenReply(false)
            });

        }
    
    // handle update the comment now
    const handleCompleteUpdateComment=()=>{
      const commentObject={
        postId,
        userId,
        commentId,
        replyText
      }


      setIsUploading(true);
          // performing delete request
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/edit/comments/`, commentObject,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update passedPost with the returned post object
             setPostDetailedData(res.data)
            })
            .catch(async (err) => {

              if (err?.code === "ERR_NETWORK") {
                setErrorMessage("Server Unreachable");
                return;
              }
      
              setErrorMessage(err?.response.data);

              console.log(errorMessage)
            })
            .finally(() => {
              setIsUploading(false);
              setIsEditing(false)
            });
    }

  
    // handle delete comment now
    const handleCompleteCommentDeletion=()=>{

      setIsUploading(true);
          // performing delete request
          axios
            .delete(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/delete/comments/${postId}/${userId}/${commentId}`,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update passedPost with the returned post object
             setPostDetailedData(res.data)
            })
            .catch(async (err) => {

              if (err?.code === "ERR_NETWORK") {
                setErrorMessage("Server Unreachable");
                return;
              }
      
              setErrorMessage(err?.response.data);

              console.log(errorMessage)
            })
            .finally(() => {
              setIsUploading(false);
              setIsDeleteComment(false)
            });


    }


    // handle showing of the replies to a comment
    const handleShowCommentReplies=()=>{
      // trigger showing of the reply box
      setIsOpenReplyComments(prev=>!prev)

      if (isOpenReplyComments) {
        return
      }

      setIsUploading(true);
          // performing delete request
          axios
            .get(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/reply/comments/${postId}/${commentId}/${userId}`,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update the comments reply object
             setRepliesData(res.data)

            })
            .catch(async (err) => {

              if (err?.code === "ERR_NETWORK") {
                setErrorMessage("Server Unreachable");
                return;
              }
      
              setErrorMessage(err?.response.data);

              console.log(errorMessage)
            })
            .finally(() => {
              setIsUploading(false);
            });
    }

  return (
    <List 
    className="w-100 rounded" 
    sx={{ bgcolor: "background.paper", 
    borderBottom:'1px solid', 
    borderColor:'divider' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt=""
            src={commenter?.avatar}
            sx={{ width: 30, height: 30 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography 
              variant={"body2"}
              component={'span'}
              alignItems={"center"}

              
              >
                {commenter?.name}  
                {isCurrentUserComment && (
                  <Typography
                  ml={1}
                  variant={"caption"}
                  sx={{ color: "text.secondary", fontSize:'x-small' }}
                >
                {"(You)"}
                </Typography>
                )}
              </Typography>

              <Typography 
              variant={"caption"}
              sx={{ 
                fontSize:'x-small'
               }}
              >
                {getElapsedTime(commenter?.createdAt)}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Box>
                <Typography
                  variant={"caption"}
                  color={"text.secondary"}
                  display={"flex"}
                  alignItems={"center"}
                >
                  {commenter?.title} | {CustomCountryName(commenter?.country)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant={"body2"}
                  component={'span'}
                  sx={{ color: "text.primary", fontSize:'small' }}
                >
                  {commenter?.minimessage}

                  {commenter?.edited && (
                  <Typography
                  ml={1}
                  variant={"caption"}
                  sx={{ color: "text.secondary", fontSize:'small' }}
                >
                {"(edited)"}
                </Typography>
                )}
                </Typography>              
              </Box>
              {/* edit and delete buttons if current user's comment else reply */}
              <Box 
              display={'flex'} 
              alignItems={'center'} 
              gap={1} 
              mt={1}>
              {isCurrentUserComment ? (
                <React.Fragment>
                {/* edit button */}
                <Button 
                onClick={handleEditing} 
                variant={isEditing ? 'outlined':'text'} 
                size={'small'} 
                sx={{ borderRadius:3, 
                textTransform:'capitalize', 
                fontSize:"x-small" }}>
                  edit
                </Button>

                {/* delete button */}
                <Button 
                disabled={isDeleteComment} 
                onClick={handleDeleteComment} 
                variant="text" 
                color="warning" 
                size={'small'} 
                sx={{ borderRadius:3, 
                textTransform:'capitalize', 
                fontSize:"x-small" }}>delete</Button>
                {/* view replies button, only shown if the comment got at-least a comment */}
                {commenter?.replyCount>0 && <Button onClick={handleShowCommentReplies} variant={isOpenReplyComments ? 'outlined':'text'} size={'small'} sx={{ borderRadius:3, textTransform:'capitalize', fontSize:"x-small" }}>{commenter?.replyCount} replied</Button>}
                </React.Fragment>
              ):(
                <React.Fragment>
                {/* reply button */}
               <Button onClick={handleShowReplyInput} variant={isOpenReply ? 'outlined':'text'} size={'small'} sx={{ borderRadius:3, textTransform:'capitalize', fontSize:"x-small" }}>reply</Button>
               {/* view replies button, only shown if the comment got at-least a comment */}
               {commenter?.replyCount>0 && <Button onClick={handleShowCommentReplies} variant={isOpenReplyComments ? 'outlined':'text'} size={'small'} sx={{ borderRadius:3, textTransform:'capitalize', fontSize:"x-small" }}>{commenter?.replyCount} replied</Button>
              
              }
                </React.Fragment>
              )}
              </Box>

              {(isOpenReply || isEditing) && (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
                p={1}
                mt={1}
                bgcolor={"background.default"}
                className={'rounded'}
                sx={{ border:'1px solid', borderColor:'divider' }}
              >
                {/* input for reply */}
                <Box width={"100%"}>
                  <InputBase
                    multiline
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxRows={2}
                    disabled={isUploading}
                    className="w-100"
                    placeholder={`${isOpenReply ? 'reply text':'edit text'} ...`}
                    sx={{
                      fontSize: "small",
                    }}
                  />
                </Box>
    
                {/* send reply button icon */}
                <Box className="rounded ms-1 pe-1" alignContent={"center"}>
                  {isUploading ? (
                    <CircularProgress size={15} />
                  ) : (
                    <Badge badgeContent={`${MAX_TEXT_LENGTH - replyText.length}`}>
                      <IconButton
                        disabled={replyText.length > MAX_TEXT_LENGTH || replyText===commenter?.minimessage}
                        onClick={isEditing ? handleCompleteUpdateComment: handleCompleteSendingReply}
                      >
                        <SendOutlined
                          color={replyText.length <= MAX_TEXT_LENGTH && replyText!==commenter?.minimessage ? "primary" : "inherit"}
                          sx={{ width: 16, height: 16 }}
                        />
                      </IconButton>
                    </Badge>
                  )}
                </Box>
              </Box>
              )}

              {/* delete alert when activated */}
              {isDeleteComment && (
                <Box mt={1}>

                 <Collapse in={isDeleteComment || false}>
                 <Alert
                   severity="info"
                   className="rounded"
                   action={
                     <Stack direction={"row"} alignItems={"center"} gap={1}>
                       {/* yes btn */}
                       <IconButton
                         aria-label="close"
                         color="inherit"
                         size="small"
                         disabled={isUploading}
                         onClick={handleCompleteCommentDeletion}
                       >
                        {isUploading ? <CircularProgress size={15} /> :<DoneRounded color="warning" sx={{ width:16,height:16 }}/>}

                         
                       </IconButton>
                       |{/* no btn */}
                       <IconButton
                         aria-label="close"
                         color="inherit"
                         size="small"
                         disabled={isUploading}
                         onClick={handleDeleteComment}
                       >
                        {isUploading ? <CircularProgress size={15} /> :<Close color={'info'} sx={{ width:15,height:15 }}/>}
                       </IconButton>
                     </Stack>
                   }
                 >
                   <Box mb={1}>
                     <Typography variant="body2">
                     {isUploading ? "deleting...":"delete ?"}
                     </Typography>
                   </Box>
               
                 </Alert>
               </Collapse>
               </Box>

              )}

              {/* show replies to the comment */}
              {isOpenReplyComments && repliesData && (
                <React.Fragment>
                  {repliesData?.map(replyData=>(
                   <CommentsReply key={replyData?._id} comment={replyData} setPostDetailedData={setPostDetailedData} setRepliesData={setRepliesData}/>

                  ))}
                </React.Fragment>
              ) }
            </Box>
          }
        />
      </ListItem>
    </List>
  );
}
