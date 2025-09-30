import {
  Close,
  EmailRounded,
  GitHub,
  Language,
  LinkedIn,
  PeopleRounded
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageMatch } from "../utilities/getImageMatch";
import AlertInputMessage from "./AlertInputMessage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function AlertMiniProfileView({
  openAlert,
  setOpenAlert,
  userId,
}) {
  // redux states
  const [miniProfileData, setMiniProfileData] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [openAlertMessage,setOpenAlertMessage]=useState(false)

  // redux states
  const { user } = useSelector((state) => state.currentUser);


  const {
    _id: currentUserId,
  } = user || {};

  // checks for if current user is friends
  const isFriends =miniProfileData?.network?.includes(currentUserId);
 
  useLayoutEffect(() => {

    // track fetching backend true
    setIsFetching(true)

    // fetch details of the liked or reacted user based on their id and also the id of the current user
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/specific/${userId}/${currentUserId}`, {
        withCredentials: true,
      })
      .then((main_res) => {
          // setting user data
          setMiniProfileData(main_res?.data?.user);
          
          // setting isOnline status
          setIsOnline(main_res?.data?.isOnline)  
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setMessage("Network Error");
        }
      
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);

      });

  }, [userId,currentUserId]);

  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

 
  const handleClose = () => {
    // close alert
    setOpenAlert(false);

    // clear any messages info
    setMessage("");
  };

  // handle clearing of the message
  const handleClearMessage = () => {
    setMessage("");
  };

  
  // handle showing of input alert message
  const handleShowMessageInput=()=>{
    // open alert to true
    setOpenAlertMessage(true)
  }


  // handle navigation to Git
  const handleNavigateGit=()=>{
    window.open(miniProfileData?.gitHub,"__blank__")
  }

  // handle navigate to website
  const handleNavigateWebsite=()=>{
    window.open(miniProfileData?.portfolio,'__blank__')
  }

  // handle navigate to Linkedin
  const handleNavigateLinkedin=()=>{
    window.open(miniProfileData?.linkedin,'__blank__')
  }
  
  return (
      <Dialog
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          backdropFilter:'blur(5px)',
        }}
      >
        <DialogContent dividers 
        >
          {/* message from backend present display this */}
          {message && (
              <Collapse in={message || false}>
                <Alert
                  severity="info"
                  onClose={handleClose}
                  className="rounded"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleClearMessage}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Collapse>
          )}

          {/* show circular progress */}
          {isFetching && (
            <Box display={"flex"} justifyContent={"center"} p={1}>
              <CircularProgress size={20} />
            </Box>
          )}
          {/* render miniprofile layout */}
          <Box 
          >
            <Box display={"flex"} justifyContent={"center"}>
              <Stack gap={1}>
                {/* avatar */}
                <Box display={"flex"} justifyContent={"center"}>
                  {/* show this avatar only when user is online */}
                  {isOnline ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar src={miniProfileData?.avatar} 
                      alt="" sx={{ width: 70, height: 70 }}/>
                    </StyledBadge>
                  ) : (
                    <Avatar 
                    src={miniProfileData?.avatar} alt="" 
                    sx={{ width: 70, height: 70 }}/>
                  )}
                </Box>
                {/* name of the user */}
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  <Typography
                    variant="body2"
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    fontWeight={"bold"}
                  >
                    {miniProfileData?.name}
                  </Typography>

                  {/* friends status */}
                  {isFriends && (
                    <Box my={0.5} display={"flex"} justifyContent={"center"}>
                      <Typography variant="caption" color={"text.secondary"}>
                        ( You are friends )
                      </Typography>
                    </Box>
                  )}

                  {/* displayed if the current user is the one being checked */}
                  {userId === currentUserId && (
                    <Box display={"flex"} justifyContent={"center"} my={0.5}>
                      <Typography
                        variant="caption"
                        textTransform={"capitalize"}
                        fontWeight={"bold"}
                        color={"text.secondary"}
                      >
                        ( You )
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* specialisation */}
                <Box display={"flex"} justifyContent={"center"} mb={1}>
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.specialisationTitle}
                  </Typography>
                </Box>
                {/* country and location */}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={2}
                  alignItems={"center"}
                  
                >
                  {/* state or county */}
                  <Typography variant="body1" color={"text.secondary"}>
                    {miniProfileData?.county}
                  </Typography>
                
                  {/* divider vert */}
                  <Divider
                    component={"div"}
                    variant="middle"
                    orientation="vertical"
                    className="p-1"
                  />
                 {/* country */}
                  <Typography variant="body1" color={"text.secondary"}>
                    {/* call this if only miniprofile data present */}
                    {miniProfileData &&
                      handleCountryName(miniProfileData?.country)}
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
                      variant="body1"
                      color="text.secondary"
                      sx={{ pt: "1px" }}
                    >
                      {miniProfileData?.network_count}
                    </Typography>

                    {/* diversity network icon */}
                    <PeopleRounded sx={{ width: 23, height: 23 }} />
                  </Box>
                </Box>

              {miniProfileData?.account!=="Organisation" && (
                <React.Fragment>
                   {/* divider */}
                <Divider component={"div"} className="pb-1" />
                {/* skills avatars */}
                <Box display={"flex"} justifyContent={"center"} mt={1}>
                  <AvatarGroup max={miniProfileData?.selectedSkills?.length}>
                    {/* loop through the skills and their images matched using custom fn */}
                    {miniProfileData?.selectedSkills?.map((skill) => (
                      <Tooltip title={skill} key={skill} arrow>
                        <Avatar
                          alt={skill}
                          className="border"
                          src={getImageMatch(skill)}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
                </React.Fragment>
              )}

                {/* divider */}
                <Divider className="p-1" component={"div"} />
                {/* user about */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="body2"
                    maxWidth={400}
                    color="text.secondary"
                    sx={{ textTransform:'lowercase' }}
                  >
                    {miniProfileData?.about || "** No About**"}
                  </Typography>
                </Box>

                <Divider className="p-1" component={"div"} />
                {/* caption joined date */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="caption" color={"text.secondary"}>
                    Joined:{miniProfileData?.createdAt?.split("T")[0]}
                  </Typography>
                </Box>


                {/* other profile related links */}
              <Box 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'}
              gap={2}
              >
              {/* message  */}
              <Tooltip 
                arrow
                title='Message'>
                <IconButton 
                onClick={handleShowMessageInput}
                disabled={userId === currentUserId}
                >
                  <EmailRounded
                  color={userId === currentUserId ? 'disabled':'primary'}
                  sx={{ width:24,height:24 }}/>
                </IconButton>
                </Tooltip>

                {/* github */}
                <Tooltip 
                arrow
                title='GitHub'>
                <IconButton
                onClick={handleNavigateGit}
                disabled={miniProfileData?.gitHub?.length<2}>
                  <GitHub  
                  color={miniProfileData?.gitHub?.length<2? 'disabled':'primary'}
                  sx={{ width:23,height:23 }}/>
                </IconButton>
                </Tooltip>

                {/* linkedin */}
                  <Tooltip 
                  arrow
                  title='Linkedin'>
                  <IconButton
                  onClick={handleNavigateLinkedin}
                  disabled={miniProfileData?.linkedin?.length<2}>
                    <LinkedIn
                    color={miniProfileData?.linkedin?.length<2? 'disabled':'primary'}
                    sx={{ width:24,height:24 }}/>
                  </IconButton>
                  </Tooltip>

                {/* website */}
                  <Tooltip 
                  arrow
                  title='portfolio'>
                  <IconButton 
                  onClick={handleNavigateWebsite}
                  disabled={miniProfileData?.portfolio?.length<2}>
                    <Language color={miniProfileData?.portfolio?.length<2? 'disabled':'primary'} 
                    sx={{ width:24,height:24 }}/>
                  </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        {/* show alert input message */}
        {openAlertMessage && (
          <AlertInputMessage 
          openAlert={openAlertMessage}
          setOpenAlert={setOpenAlertMessage}
          targetId={miniProfileData?._id}
          targetName={miniProfileData?.name}
          targetSpecialisation={miniProfileData?.specialisationTitle}
          targetAvatar={miniProfileData?.avatar}
          
          />
        )}
      </Dialog>
  );
}
