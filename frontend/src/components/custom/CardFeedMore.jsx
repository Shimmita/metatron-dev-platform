import {
  EmailOutlined,
  FlagRounded,
  PersonAddRounded,
  PersonRemoveRounded
} from "@mui/icons-material";
import { Box, Divider, ListItemText, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import AlertInputMessage from "../alerts/AlertInputMessage";
import CustomCountryName from "../utilities/CustomCountryName";
function CardFeedMore({
  ownerId,
  ownerName,
  setMessageMore,
  currentUserNetwork = [],
  handleCloseMenu,
  setOpenAlertReport,
  post,
  setPostWhole,
}) {
  const [isFriend, setIsFriend] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [openAlertMessage,setOpenAlertMessage]=useState(false)

  // redux states
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.currentUser);
  const {
    _id: currentUserId,
    name,
    avatar,
    country,
    county,
    specialisationTitle: title,
  } = user || {};

  const owner_post = `${ownerName?.split(" ")[0]} ${
    ownerName?.split(" ")[1]
  }`.toLowerCase();

  // axios default credentials
  axios.defaults.withCredentials = true;


  // handle showing of alert input message
  const handleOpeningAlertMessage=()=>{
    // open the alert
    setOpenAlertMessage(true)
  }

  // extracting the list of friends/network from the current user
  useEffect(() => {
    // map through ids of friends if the current user network
    // has the id of the post owner, means are friends else false
    if (currentUserNetwork.includes(ownerId)) {
      setIsFriend(true);
    }
  }, [isFriend, currentUserNetwork, ownerId]);

  // handle creating connection with the user of the post
  const handleCreateConnection = () => {
    // data user sending connect request, its the current user
    const dataUserAcknowLedging = {
      senderId: currentUserId,
      targetId: ownerId,
      country: CustomCountryName(country),
      state: county,
      name,
      avatar,
      title,
      message: "requesting to connect",
    };

    // set is fetching to true
    setIsFetching(true);

    // performing post request and passing
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/create`,
        dataUserAcknowLedging
      )
      .then((res) => {
        // update the message state
        if (res?.data && res.data) {
          setMessageMore(res.data);
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageMore("server is unreachable");
          return;
        }
        setMessageMore(err?.response?.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);

        // close the menu more from the parent
        handleCloseMenu();
      });
  };

  // handle unfriending the user, like remove them from the network
  const handleUnfriendFriend = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing delete request and passing the ids of current user and owner of the post
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${ownerId}`
      )
      .then((res) => {
        // update the message state
        if (res?.data && res.data) {
          // update the message
          setMessageMore(res.data.message);

          // update the redux state of the currently logged in user from backend who is sender user
          dispatch(updateUserCurrentUserRedux(res.data.senderUser));
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageMore("server is unreachable check your internet");
          return;
        }
        // error message
        setMessageMore(err?.response?.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);

        // handle closing of the more option
        handleCloseMenu();
      });
  };

  // handle show of report post alert
  const handleShowReportAlert = () => {
    // activate the parent state controlling alert report
    setOpenAlertReport(true);

    // set post to the title passed in the props
    setPostWhole(post);

    // close the more option
    handleCloseMenu();
  };

  return (
      <Box borderRadius={5}>
            {isFriend ? (
              <MenuItem onClick={handleUnfriendFriend} disabled={isFetching}>
              <ListItemText>
                <PersonRemoveRounded color="warning" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "capitalize" }}
                primary={<Typography variant={'body2'}>{owner_post}</Typography>}
              />
            </MenuItem>
            ):(
          <MenuItem onClick={handleCreateConnection} disabled={isFetching}>
              <ListItemText>
                <PersonAddRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "capitalize" }}
                primary={<Typography variant={'body2'}>{owner_post}</Typography>}
              />
            </MenuItem>
            )}
            
            <Divider component={"li"} />

            <MenuItem onClick={handleOpeningAlertMessage} disabled={isFetching}>
              <ListItemText>
                <EmailOutlined color="primary" className="mx-2" sx={{ width:22,height:22 }}/>
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "capitalize" }}
                primary={<Typography variant={'body2'}>{owner_post}</Typography>}
              />
            </MenuItem>
        
            {/* report content */}
            <Divider component={"li"} />
            <MenuItem onClick={handleShowReportAlert}>
              <ListItemText>
                <FlagRounded color="info" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "capitalize" }}
                primary={<Typography variant={'body2'}>Report Content</Typography>}
              />
            </MenuItem>

            {/* alert message render */}
            {openAlertMessage && (
              <AlertInputMessage openAlert={openAlertMessage}
               setOpenAlert={setOpenAlertMessage} 
               targetId={ownerId} 
               targetName={ownerName}
               targetSpecialisation={post?.post_owner?.ownertitle}
               />
            )}
      </Box>
  );
}

export default CardFeedMore;
