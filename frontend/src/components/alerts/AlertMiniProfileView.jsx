import {
  Close,
  Diversity3Rounded,
  GitHub,
  Language,
  LinkedIn
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
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
import CustomLandScape from "../utilities/CustomLandscape";
import { Link } from "react-router-dom";

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
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const [miniProfileData, setMiniProfileData] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const {
    _id: currentUserId,
  } = user || {};

  // axios default credentials
  axios.defaults.withCredentials = true;

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

   // handle width of the global search
   const handleMiniProfileWidth=()=>{
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
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          marginLeft:handleMiniProfileWidth()
        }}
      >
        <DialogContent dividers>
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
          <Box mt={1}>
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
                      <Avatar src="" alt="" sx={{ width: 50, height: 50 }}>
                        <Typography
                          variant="body2"
                          textTransform={"uppercase"}
                          fontWeight={"bold"}
                        >
                          {miniProfileData?.name[0]}
                        </Typography>
                      </Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar src="" alt="" sx={{ width: 50, height: 50 }}>
                      <Typography
                        variant="body2"
                        textTransform={"uppercase"}
                        fontWeight={"bold"}
                      >
                        {miniProfileData?.name[0]}
                      </Typography>
                    </Avatar>
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
                    <Box mb={1} display={"flex"} justifyContent={"center"}>
                      <Typography variant="caption" color={"text.secondary"}>
                        ( You are friends )
                      </Typography>
                    </Box>
                  )}

                  {/* displayed if the current user is the one being checked */}
                  {userId === currentUserId && (
                    <Box display={"flex"} justifyContent={"center"}>
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
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.specialisationTitle}
                  </Typography>
                </Box>
                {/* country and location */}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={3}
                  alignItems={"center"}
                >
                  {/* country */}
                  <Typography variant="body2" color={"text.secondary"}>
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
                  {/* state or county */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.county}
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
                      sx={{ pt: "1px" }}
                    >
                      {miniProfileData?.network_count}
                    </Typography>

                    {/* diversity network icon */}
                    <Diversity3Rounded sx={{ width: 20, height: 20 }} />
                  </Box>
                </Box>

                {/* divider */}
                <Divider component={"div"} className="pb-1" />
                {/* skills avatars */}
                <Box display={"flex"} justifyContent={"center"} mt={1}>
                  <AvatarGroup max={miniProfileData?.selectedSkills?.length}>
                    {/* loop through the skills and their images matched using custom fn */}
                    {miniProfileData?.selectedSkills?.map((skill, index) => (
                      <Tooltip title={skill} key={skill} arrow>
                        <Avatar
                          alt={skill}
                          className="border"
                          sx={{ width: 34, height: 34 }}
                          src={getImageMatch(skill)}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>

                {/* divider */}
                <Divider className="p-1" component={"div"} />
                {/* user about */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="caption"
                    maxWidth={300}
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

              <Box 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'flex-end'}
              borderRadius={5}
              mt={1}
              gap={2}
              >
                {/* github */}
                <Tooltip 
                arrow
                title='GitHub'>
                <Link
                target={miniProfileData?.gitHub?.length>2 && "_blank_"}
                 to={`${miniProfileData?.gitHub?.length>2 ? miniProfileData?.gitHub :'/'}`}>
                  <GitHub sx={{ width:17,height:17 }}/>
                </Link>
                </Tooltip>

                {/* linkedin */}
                <Tooltip 
                arrow
                title='Linkedin'>
                <Link 
                target={miniProfileData?.linkedin?.length>2 && "_blank_"}
                to={`${miniProfileData?.linkedin?.length>2 ? miniProfileData?.linkedin :"/"}`}>
                  <LinkedIn sx={{ width:18,height:18 }}/>
                </Link>
                </Tooltip>

                {/* website */}
                <Tooltip 
                arrow
                title='portfolio'>
                <Link
                target={miniProfileData?.portfolio?.length>2 && "_blank_"}
                 to={`${miniProfileData?.portfolio?.length>2 ? miniProfileData?.portfolio :"/"}`}>
                  <Language sx={{ width:18,height:18 }}/>
                </Link>
                </Tooltip>
              </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
  );
}
