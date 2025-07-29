import { EmailOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { AvatarGroup, Box, IconButton, Tooltip, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from '../../images/dev.jpeg';
import {
  showProfileDrawerMessageInput,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import { updateTempUserIDRedux, updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../utilities/getImageMatch";

export default function UserNetworkLayout({ network }) {
  // redux states
  const { isOpenDrawerProfile } = useSelector((state) => state.appUI);
  const [isFetching, setIsFetching] = useState(false);
  const [messageResponse,setMessageResponse]=useState('')

    const { user } = useSelector((state) => state.currentUser);
    const {
      _id: currentUserId,
    } = user || {};

  // axios default credentials
  axios.defaults.withCredentials = true;
  // for navigation to a route
  const navigate = useNavigate();
  // for effective actions of redux
  const dispatch = useDispatch();
  // handle sending of the message
  const handleSendMessage = () => {
    if (CustomDeviceIsSmall()) {
      // navigate user profile specially smaller devices + messaging true
      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));

      //close the drawer if is open for small devices
      if (isOpenDrawerProfile) {
        dispatch(showUserProfileDrawer());
      }
      navigate("users/profile/" + network?._id);
    } else {
      // update the temp user state in redux with the userID passed
      dispatch(updateTempUserIDRedux(network?._id));

      // update the message shown input when drawer is opened
      dispatch(showProfileDrawerMessageInput(true));

      //  open drawer profile if is not open for large screens and tabs ++
      if (!isOpenDrawerProfile) {
        dispatch(showUserProfileDrawer());
      }
    }
  };

  // handle unfriending the user, like remove them from the network
    const handleUnfriendFriend = () => {
      // set is fetching to true
      setIsFetching(true);
  
      // performing delete request and passing the ids of current user and owner of the post
      axios
        .delete(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${network?._id}`
        )
        .then((res) => {
          // update the message state
          if (res?.data && res.data) {
            // update the message
            setMessageResponse(res.data.message);
  
            // update the redux state of the currently logged in user from backend who is sender user
            dispatch(updateUserCurrentUserRedux(res.data.senderUser));
          }
        })
        .catch(async (err) => {
          if (err?.code === "ERR_NETWORK") {
            setMessageResponse("server is unreachable");
            return;
          }
          // error message
          setMessageResponse(err?.response?.data);
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    };


  return (
    <List 
    className="rounded" 
    sx={{ 
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      width: "100%",
      bgcolor: "background.paper",
      p:1,
      border: "1px solid",
      borderColor: "divider"
      }}
    >
      <ListItem
      >
        <ListItemAvatar>
        <Avatar
        src={devImage}
        variant="rounded"
        sx={{
          backgroundColor: "#1976D2",
          color: "white",
          width: 40,
          height: 40,
        }}
        alt={network?.name?.split(" ")[0]}
        aria-label="avatar"
                />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              sx={{ color: "text.primary" }}
              fontWeight={"bold"}
              variant="body2"
            >
              {network?.name}
            </Typography>
          }
          secondary={
            <Box>
               <Typography variant="body2" color={"text.secondary"}>
               {network?.specialisationTitle}
              </Typography>
              <Typography variant="caption" color={"text.secondary"}>
              {CustomCountryName(network?.country)} | {network?.county}
              </Typography>

               {/* skills of the user */}
                <Box display={"flex"} mt={"2px"}>
                  <AvatarGroup
                    max={network?.selectedSkills?.length}
                  >
                    {/* loop through the skills and their images matched using custom fn */}
                    {network?.selectedSkills?.map(
                      (skill, index) => (
                        <Tooltip title={skill} arrow key={skill}>
                          <Avatar
                            alt={skill}
                            className="border"
                            sx={{ width: 25, height: 25 }}
                            src={getImageMatch(skill)}
                          />
                        </Tooltip>
                      )
                    )}
                  </AvatarGroup>
                </Box>
            </Box>
          }
        />
      </ListItem>
        <Box display={'flex'} 
        flexDirection={'column'} 
        justifyContent={'flex-end'} 
        alignItems={'center'}
        >
          {/* message button */}
        <IconButton onClick={handleSendMessage}>
            <Tooltip title={"message"} arrow>
              <EmailOutlined color="primary" sx={{ width:20,height:20 }} />
            </Tooltip>
          </IconButton>  

          {/* unfollow button */}
          <IconButton onClick={handleUnfriendFriend} >
            <Tooltip title={"unfollow"} arrow  sx={{ width:22,height:22 }}>
            <PersonRemoveOutlined color="warning"  />
            </Tooltip>
          </IconButton>  
          </Box>

         </List>
  );
}
