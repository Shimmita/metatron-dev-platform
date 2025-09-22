import { TipsAndUpdatesRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import TutorialData from "../data/TutorialData";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertTutorial({isDarkMode=false}) {
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

     // smartphones and below
    const theme=useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    

 // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  // track showing of lunched tutorial
  const [openTutorial,setOpenTutorial]=useState(user?.isTutorial || false)
 
  const handleClose = () => {
    setOpenTutorial(false)
  };


// completely done tutorial
const handleCompletely=()=>{
    // fetching state
    setIsFetching(true)
    // axios post, update the tutorial state in the user db backend
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/tutorial`,{userId:user?._id}, {
        withCredentials: true,
      })
      .then((res) => {
        // update the current user redux state from the backend
        dispatch(updateUserCurrentUserRedux(res.data))
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable please try again later."
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
}



  return (
      <Dialog
        open={openTutorial}
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter:'blur(5px)',
          }}
      >
          <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          fontWeight={"bold"}
          gap={2}
          sx={{
          background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
        >
          <TipsAndUpdatesRounded sx={{width:20,height:20, color:'orange'}}/>
          About Metatron Developer
        </DialogTitle>
        <DialogContent 
        dividers
          sx={{ 
          maxHeight:isMobile ? '70vh':undefined,
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

        {/* error displayed if any */}
        {errorMessage && (
            <Box 
            display={'flex'} 
            justifyContent={'center'} 
            mb={1}>
            <Typography className="text-info">{errorMessage}</Typography>
            </Box>
        )}
        

        {TutorialData.map(tutorial=>(
            <Box key={tutorial.description}>
            {/* description */}
            <DialogContentText gutterBottom variant="body2" id="alert-dialog-tutorial-description">
            {tutorial.description}
            </DialogContentText>
            {/* listing details and functions */}
            {tutorial.listing.map(list=>(
            <DialogContentText gutterBottom component={'li'} variant="body2" id="alert-dialog-tutorial-listing">
            {list}
            </DialogContentText>
            ))}
           
            </Box>
       
        ))}
          
        </DialogContent>
        <DialogActions>

        {user?.isTutorial && (
          <Button 
          size="small"
          disabled={isFetching}
          startIcon={isFetching ? <CircularProgress size={12}/> :undefined}
          onClick={handleCompletely} 
          sx={{ borderRadius:4}}>
          Ok don't show
          </Button>
        )}
          
          
          <Button 
          onClick={handleClose} 
          size="small"
          disabled={isFetching}
          sx={{ borderRadius:4}}>continue</Button>
        </DialogActions>
      </Dialog>
  );
}
