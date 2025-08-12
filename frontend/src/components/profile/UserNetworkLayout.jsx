import { PersonRemoveOutlined } from "@mui/icons-material";
import { AvatarGroup, Box, IconButton, Tooltip, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";
import { updateCurrentNetworkID } from "../../redux/CurrentNetwork";

export default function UserNetworkLayout({ network }) {
  // redux states
  const [isFetching, setIsFetching] = useState(false);
  const [messageResponse,setMessageResponse]=useState('')

    const { user } = useSelector((state) => state.currentUser);
    const {
      _id: currentUserId,
    } = user || {};


  // for effective actions of redux
  const dispatch = useDispatch();
  
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

            // update the user friend network by removing the deleted userId
            dispatch(updateCurrentNetworkID(network?._id))
          }
        })
        .catch(async (err) => {
          if (err?.code === "ERR_NETWORK") {
            setMessageResponse("server is unreachable");
            return;
          }
          // error message
          setMessageResponse(err?.response?.data);

          // log the message
          console.log(messageResponse)
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
        <Tooltip title={'profile'} arrow>
          <Avatar
          src={network?.avatar}
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
        </Tooltip>
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
                      (skill) => (
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
        mr={1}
        >
          {/* unfollow button */}
            <Tooltip title={"remove"} arrow >
          <IconButton
          disabled={isFetching}
          sx={{ 
            border:'1px solid',
            borderColor:'divider'
           }}
           onClick={handleUnfriendFriend} >
            <PersonRemoveOutlined 
            color="warning" sx={{ width:22,height:22}} />
          </IconButton>  
            </Tooltip>
          </Box>

         </List>
  );
}
