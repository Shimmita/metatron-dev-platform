import { Close, DoneRounded, SendOutlined, SubdirectoryArrowRightRounded } from "@mui/icons-material";
import { Alert, Badge, Box, Button, CircularProgress, Collapse, IconButton, InputBase, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getElapsedTime } from "../utilities/getElapsedTime";
import AlertMiniProfileView from "../alerts/AlertMiniProfileView";

const MAX_TEXT_LENGTH=100
const firstName = (value = "") => value.trim().split(/\s+/)[0] || "Member";

export default function CommentsReply({ comment: commenter, setPostDetailedData, setRepliesData }) {
  const [isUploading, setIsUploading] = useState(false);  
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  
  const[isEditing,setIsEditing]=useState(false)
  const[isDeleteComment,setIsDeleteComment]=useState(false)
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);
  const microButtonSx = {
    borderRadius: "8px",
    textTransform: "capitalize",
    fontSize: "x-small",
    fontWeight: 900,
    color: "text.secondary",
    borderColor: "rgba(214,178,94,0.28)",
    "&:hover": {
      color: "primary.main",
      borderColor: "rgba(214,178,94,0.45)",
      background: "rgba(214,178,94,0.08)",
    },
  };

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
      
              setErrorMessage(err?.response?.data || "Unable to update reply.");

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
      
              setErrorMessage(err?.response?.data || "Unable to delete reply.");

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
    <List
      sx={{
        width: "100%",
        bgcolor: "transparent",
        mt: 0.35,
        ml: { xs: 0, sm: 1 },
        p: 0,
      }}
    >
      <ListItem
        alignItems="flex-start"
        sx={{
          borderLeft: "2px solid rgba(214,178,94,0.20)",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
          background: "rgba(255,255,255,0.015)",
          px: { xs: 0.75, sm: 1 },
          py: 1,
          "&:hover": {
            background: "rgba(214,178,94,0.04)",
          },
        }}
      >
        <Box sx={{ color: "primary.main", mr: 1, mt: 0.8, display: { xs: "none", sm: "flex" } }}>
          <SubdirectoryArrowRightRounded sx={{ fontSize: 17 }} />
        </Box>
        <ListItemAvatar
          onClick={handleMiniProfileView}
         >
          <Avatar
            alt=""
            src={commenter?.avatar}
            sx={{
              width: 31,
              height: 31,
              border: "1px solid rgba(214,178,94,0.24)",
              boxShadow: "0 0 10px rgba(214,178,94,0.10)",
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant={"body2"} component={'span'} fontWeight={900} sx={{ color: "text.primary" }}>
                {firstName(commenter?.name)}

                {isCurrentUserComment && (
                    <Typography
                    ml={1}
                    variant={"caption"}
                    sx={{
                      color: "primary.main",
                      fontSize:'x-small',
                      fontWeight: 800,
                    }}
                  >
                  {"(You)"}
                  </Typography>
                  )}
              </Typography>

              <Typography variant={"caption"} color="text.secondary">
                {getElapsedTime(commenter?.createdAt)}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Box>
                <Typography variant={"caption"} color={"text.secondary"} display={"block"}>
                  {[commenter?.title, commenter?.country].filter(Boolean).join(" | ")}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant={"body2"}
                  component={'span'}
                  sx={{ color: "text.primary", fontSize:'small', lineHeight: 1.75 }}
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
                <Button onClick={handleEditing} variant={isEditing ? 'outlined':'text'} size={'small'} sx={microButtonSx}>edit</Button>

                {/* delete button */}
                <Button disabled={isDeleteComment} onClick={handleDeleteComment} variant="text" size={'small'} sx={microButtonSx}>delete</Button>

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
                              sx={{
                                borderRadius: "8px",
                                border:'1px solid rgba(214,178,94,0.18)',
                                background: "rgba(214,178,94,0.055)",
                              }}
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
                                  placeholder={"Edit your reply..."}
                                  sx={{
                                    fontSize: "small",
                                    color: "text.primary",
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
                   sx={{
                    borderRadius: "8px",
                    background: "rgba(214,178,94,0.08)",
                    border: "1px solid rgba(214,178,94,0.22)",
                    color: "text.primary",
                   }}
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
                        {isUploading ? <CircularProgress size={15} /> :<DoneRounded color="primary" sx={{ width:16,height:16 }}/>}
                       </IconButton>
                       <IconButton
                         aria-label="close"
                         color="inherit"
                         size="small"
                         disabled={isUploading}
                         onClick={handleDeleteComment}
                       >
                        {isUploading ? <CircularProgress size={15} /> :<Close color="primary" sx={{ width:15,height:15 }}/>}
                       </IconButton>
                     </Stack>
                   }
                 >
                   <Box mb={1}>
                     <Typography variant="body2">
                       {isUploading ? "Deleting..." : "Delete reply?"}
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
