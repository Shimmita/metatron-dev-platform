import { Close } from "@mui/icons-material";
import { Avatar, Box, DialogContentText, IconButton, InputBase, styled, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import devImage from '../../images/dev.jpeg';
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import axios from "axios";
import { updateMessageConnectRequest } from "../../redux/CurrentSnackBar";
import { resetClearConversations } from "../../redux/CurrentConversations";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// input base
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    
  },
}));

export default function AlertInputMessage({
  openAlert,
  setOpenAlert,
  targetId,
  targetName,
  targetSpecialisation
}) {

    // for monitoring api request status
    const [isSending, setIsSending] = useState(false);
    const [textMessage, setTextMessage] = useState("");
    const dispatch=useDispatch()

    // redux states
    const { isTabSideBar } = useSelector((state) => state.appUI);
    const { user } = useSelector((state) => state.currentUser);
    
      // axios default credentials
      axios.defaults.withCredentials = true;

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    handleClose();
  };

   // handle sending of the message
    const handleSendingMessage = async () => {
      // conversationObject
      const conversation = {
        senderId: user._id,
        content: textMessage,
        participants: [user._id, targetId],
      };
  
      // call api request to post data to the backed
      try {
        // set is fetching to true
        setIsSending(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/conversations/users/create`,
          conversation
        );
        //update the conversation with the one returned from the backend
        if (response.data) {
          // reset conversations by clearing the info in redux for auto refetch
          dispatch(resetClearConversations())
          
          // update notification
          dispatch(updateMessageConnectRequest("message has been sent"));
        
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
        setIsSending(false);
          // clear the message content
          setTextMessage("");

        //  close the message alert
        handleDismiss()

      }
    };


// handle width of the alert
const handleMessageWidth=()=>{
  if (CustomDeviceTablet() && isTabSideBar) {
    return "36%"
  } else if(CustomLandScape()){
    return "-8%"
  } else if(CustomLandscapeWidest()){
    return "-5%"
  }
}

  return (
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter:'blur(3px)',
          marginLeft: handleMessageWidth()
        }}
      >
        <Box width={'100%'}>
        <Box display={'flex'} gap={2} p={1} alignItems={'center'} justifyContent={'space-between'}>
            {/* avatar */}
             <Avatar
            src={devImage}
            sx={{
                backgroundColor: "#1976D2",
                color: "white",
                width: 30,
                height: 30,
            }}
            alt={targetName?.split(" ")[0]}
            aria-label="avatar"
            />

            {/* title */}
            <Box 
            display={'flex'} 
            justifyContent={'center'}
            flexDirection={'column'} 
            alignItems={'center'}>
            <Typography variant="body2" gutterBottom> {targetName}</Typography>
            <Typography variant="caption" 
            sx={{ color:'text.secondary' }}> 
            {targetSpecialisation}
            </Typography>
            </Box>

            {/* close icon button */}
            <IconButton onClick={handleDismiss} >
                <Close sx={{width:15,height:15}}/>
            </IconButton>
        </Box>
    
        <DialogContent dividers>
        <DialogContentText variant="body2" fontSize={'small'} pl={1} pr={1}>
           write your message and send it instantly by clicking send
        </DialogContentText>
        <StyledInputBase
            sx={{ padding: "10px", 
                width:'100%', 
                border:'1px solid', 
                borderColor:'divider',
                fontSize:'small'
             }}
             multiline
            fullWidth
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            placeholder="write message ..."
            autoFocus
            disabled={isSending}
            minRows={5}
            maxRows={5}
            className={'rounded'}
            inputProps={{ "aria-label": "search" }}
        />
        </DialogContent>
        <DialogActions>
         
          <Button
          size="small"
            disabled={textMessage.trim() === "" || isSending}
            onClick={handleSendingMessage}
            sx={{ borderRadius:3 }}
          >
            send
          </Button>
        </DialogActions>
        </Box>
      </Dialog>
  );
}
