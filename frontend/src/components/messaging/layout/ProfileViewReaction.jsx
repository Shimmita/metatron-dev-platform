import {
  Box,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { useCallback, useState } from "react";
import devImage from "../../../images/dev.jpeg";
import CustomCountryName from "../../utilities/CustomCountryName";
import { Close } from "@mui/icons-material";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import { deleteCurrentProfileView } from "../../../redux/CurrentProfileView";

function ProfileViewReaction({
  profile_view,
}) {


const [showMiniProfile, setShowMiniProfile] = useState(false);
const [isFetching, setIsFetching] = useState(false);
const dispatch=useDispatch()

// axios default credentials
axios.defaults.withCredentials = true;


  // handle showing of the user profile
  const handleShowMiniProfile = useCallback(() => {
    setShowMiniProfile(true);
  }, []);


  // handle deletion of the current notification post_reaction
    const handleDeleteReaction = () => {
      // set is fetching to true
      setIsFetching(true);
  
      // performing post request
      axios
        .delete(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/delete/profile_views/${profile_view?._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res?.data) {
            // update the redux of of profile view to reflect the current changes
            dispatch(deleteCurrentProfileView(profile_view));
         
          }
        })
        .catch((err) => {
          if (err?.code === "ERR_NETWORK") {
            // update the snackbar notification of the error of connection
            dispatch(updateNotificationSnackBar("Network Error"));
            return;
          }
          // update the snackbar notification of error from the server
          dispatch(updateNotificationSnackBar(err?.response.data));
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    };

  return (
     
    <List
      sx={{ 
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      width: "100%",
      bgcolor: "background.paper",
      p:1,
      }}>
      <ListItem className="rounded" 
      sx={{ 
      border: "1px solid",
      borderColor: "divider" }}>
        <ListItemAvatar onClick={handleShowMiniProfile}>
              <Avatar
              src={devImage}
              variant="rounded"
              sx={{
                backgroundColor: "#1976D2",
                color: "white",
                width: 40,
                height: 40,
              }}
              alt={profile_view?.name?.split(" ")[0]}
              aria-label="avatar"
            />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}>
            <Typography
              sx={{ color: "text.primary" }}
              fontWeight={"bold"}
              variant="body2"
            >
              {profile_view?.name}
            </Typography>

            <Box display={"flex"} gap={"3px"} alignItems={"center"}>
            {/* time elapsed since post created */}
            <Typography variant="caption">
              {getElapsedTime(profile_view?.createdAt)}
            </Typography>
            &nbsp;
            {/* delete reaction */}
              <Tooltip title={'clear'} arrow>
              <IconButton size="small" 
              onClick={handleDeleteReaction} 
              sx={{ 
              border: "1px solid",
              borderColor: "divider",
            }}>
              <Close sx={{ width: 13, height: 13 }} />
            </IconButton>
          </Tooltip>    
          </Box>
          </Box>
          }
          secondary={
            <Box>
            
                <React.Fragment>
                    <Typography variant="body2" color={"text.secondary"}>
                    {profile_view?.title}
                  </Typography>
                  <Typography variant="caption" color={"text.secondary"}>
                    {CustomCountryName(profile_view?.country)} | {profile_view?.state}
                  </Typography>
                  <br/>
                  <Typography
                    variant="caption"
                    sx={{ color:'text.primary' }}
                  >
                    - viewed your profile -
                  </Typography>
                </React.Fragment>
              
            </Box>
          }
        />

      </ListItem>
      {/* show divider is is not last item */}
    </List>
     
  );
}

export default React.memo(ProfileViewReaction);
