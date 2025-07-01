import { Close, DoneRounded, SendOutlined } from "@mui/icons-material";
import { Alert, Badge, Box, Button, CircularProgress, Collapse, IconButton, InputBase, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import devImage from "../../images/dev.jpeg";
import { getElapsedTime } from "../utilities/getElapsedTime";
import AlertMiniProfileView from "../alerts/AlertMiniProfileView";

const MAX_TEXT_LENGTH=100

export default function CommentsReply({ comment: commenter, setPostDetailedData, setRepliesData }) {
  const [isUploading, setIsUploading] = useState(false);  
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  
  const[isEditing,setIsEditing]=useState(false)
  const[isDeleteComment,setIsDeleteComment]=useState(false)
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);

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

    // handle update the comment now
    const handleCompleteUpdateCommentReply=()=>{
      const commentObject={
        userId,
        commentId,
        replyText
      }

      setIsUploading(true);
          // performing delete request
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/edit/reply/comments/`, commentObject,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update the comment replies with data from the backend
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
              setIsEditing(false)
            });
    }

  
    // handle delete comment now
    const handleCompleteCommentReplyDeletion=()=>{

      setIsUploading(true);
          // performing delete request
          axios
            .delete(
              `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/delete/reply/comments/${userId}/${commentId}`,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              // update response from the backend (parentPost, repliesData)
              setRepliesData(res.data?.replies)
              setPostDetailedData(res.data?.parentPost)
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

  // handle display of miniprofile
  const handleMiniProfileView = useCallback(() => {
    setOpenMiniProfileAlert(true);
  }, []);


  return (
    <List className="w-100 rounded" sx={{ bgcolor: "background.paper", border:'1px solid', borderColor:'divider', mt:1.5 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar
          onClick={handleMiniProfileView}
         >
          <Avatar
            alt=""
            src={devImage}
            sx={{ width: 31, height: 31 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant={"body2"} component={'span'}  sx={{ color: "text.primary" }}>
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

              <Typography variant={"caption"}>
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
                  {commenter?.title} | {commenter?.country}
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
              <Box display={'flex'} alignItems={'center'} mt={1} gap={1}>
              {isCurrentUserComment && (
                <React.Fragment>
                {/* edit button */}
                <Button onClick={handleEditing} variant={isEditing ? 'outlined':'text'} size={'small'} sx={{ borderRadius:3, textTransform:'capitalize', fontSize:"x-small" }}>edit</Button>

                {/* delete button */}
                <Button disabled={isDeleteComment} onClick={handleDeleteComment} variant="text" color="warning" size={'small'} sx={{ borderRadius:3, textTransform:'capitalize', fontSize:"x-small" }}>delete</Button>

                </React.Fragment>
              )}
              </Box>

              {isEditing && (
                <React.Fragment>
                  {/* reply input text  */}
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
                                  placeholder={" edit text ..."}
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
                                      onClick={handleCompleteUpdateCommentReply}
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
                </React.Fragment>
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
                         onClick={handleCompleteCommentReplyDeletion}
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
              
            </Box>
          }
        />
      </ListItem>

        {/* alert for showing user mini-profile details by passing the post ownerID */}
        {openMiniProfileAlert && (
          <AlertMiniProfileView
          openAlert={openMiniProfileAlert}
          setOpenAlert={setOpenMiniProfileAlert}
          userId={parentCommenterId}
        />
        )}
    </List>
  );
}
