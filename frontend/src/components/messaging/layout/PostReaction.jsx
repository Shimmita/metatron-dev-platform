import {
  BarChartRounded,
  Close,
  FavoriteRounded,
  Flag,
  ForumRounded,
  GitHub,
} from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showMessagingDrawer } from "../../../redux/AppUI";
import { deleteCurrentPostReaction } from "../../../redux/CurrentPostReactions";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import CustomCountryName from "../../utilities/CustomCountryName";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import devLogo from '../../../images/dev.jpeg'

export default function PostReaction({ reaction }) {
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // getting the current reactionID
  const { _id } = reaction;

  // handle deletion of the current notification post_reaction
  const handleDeleteReaction = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/reactions/delete/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // update the redux of of reactions to reflect the current changes
          dispatch(deleteCurrentPostReaction(reaction));
          // update the snackbar notification message in the redux
          dispatch(updateNotificationSnackBar(res.data));
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

  // navigate to post details routed page, else close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messaging by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("posts/details/" + reaction?.postId);
  };

  return (    
        <List
          sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start" className={'rounded'} sx={{ 
             border: "1px solid",
             borderColor: "divider",
           }}>
            <ListItemAvatar>
              <Avatar variant="rounded" src={devLogo} alt="">
                <Typography
                  variant="body2"
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                >
                  {reaction?.name[0]}
                </Typography>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  {/* user name */}
                  <Typography
                    fontWeight={"bold"}
                    variant="body2"
                    width={"100%"}
                    
                  >
                    {reaction?.name}
                  </Typography>
                  {/*delete button +progress if is fetch */}
                  {isFetching ? (
                    <CircularProgress size={"10px"} />
                  ) : (
                    <Box display={"flex"} gap={"3px"} alignItems={"center"}>
                      {/* time elapsed since post created */}
                      <Typography variant="caption">
                        {getElapsedTime(reaction?.createdAt)}
                      </Typography>
                      &nbsp;
                      {/* delete reaction */}
                        <Tooltip title={'clear'} arrow>
                        <IconButton size="small" 
                        onClick={handleDeleteReaction} 
                        disabled={isFetching}
                        sx={{ 
                        border: "1px solid",
                        borderColor: "divider",
                      }}>
                        {isFetching ? (
                          <CircularProgress size={13}/>
                        ):(
                          <Close sx={{ width: 13, height: 13 }} />
                        )}
                      </IconButton>
                    </Tooltip>    
                    </Box>
                  )}
                </Box>
              }
              secondary={
                <CardActionArea onClick={handleNavigatePostDetailsRoute}>
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        display: "inline",
                        alignItems: "center",
                      }}
                    >
                      {reaction?.title}
                      <br/>
                      <Typography variant="caption" color={"text.secondary"}>
                        {reaction?.country} | {reaction?.county}
                      </Typography>
                      <br/>
                       {reaction?.message?.toLowerCase().includes("liked") && (
                        <FavoriteRounded
                          sx={{ width: 14, height: 14, }}
                          color="primary"
                          className="me-1"
                        />
                      )}


                      {reaction?.message?.toLowerCase().includes("github") && (
                        <GitHub
                          sx={{ width: 14, height: 14 }}
                          color="primary"
                          className="me-1"
                        />
                      )}

                      {reaction?.message
                        ?.toLowerCase()
                        .includes("commented") && (
                        <ForumRounded
                          sx={{ width: 14, height: 14 }}
                          color="primary"
                          className="me-1"
                        />
                      )}

                      {/* message  */}
                      <Typography variant="caption" sx={{ color:'text.primary' }}>

                      {reaction?.message}
                       </Typography>
                      {/* mini-message of post section */}
                    </Typography>

                    <Typography variant="caption" sx={{ color:'text.primary' }}>

                    {` — ${reaction?.minimessage}`}
                       </Typography>

                    {/* post counters */}
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      mt={1}
                      gap={1}
                    >
                      {/* stats svg */}
                      <Box>
                        <BarChartRounded sx={{ width: 16, height: 16 }} />
                      </Box>
                      <Box
                      className={'rounded'}
                        sx={{
                          pe: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                          color: "text.secondary",
                          "& svg": {
                            m: 1,
                          },
                        }}
                      >
                        {/* likes count */}
                      <Tooltip title={'likes'} arrow>
                      <FavoriteRounded sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption">
                          {reaction?.likes}
                        </Typography>
                      </Tooltip>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* github counts */}
                       <Tooltip title={'github views'} arrow>
                       <GitHub sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption">
                          {reaction?.github}
                        </Typography>
                       </Tooltip>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* comments count */}
                       <Tooltip title={'comments'} arrow>
                       <ForumRounded sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="pe-1">
                          {reaction?.comments}
                        </Typography>
                       </Tooltip>

                        {/* divider */}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          className="px-1"
                          component={"div"}
                        />

                        {/* flags or number reports */}
                       <Tooltip title={'reported'} arrow>
                       <Flag sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="pe-1">
                          {reaction?.report_count}
                        </Typography>
                       </Tooltip>
                      </Box>
                    </Box>
                  </React.Fragment>
                </CardActionArea>
              }
            />
          </ListItem>
        </List>
      
  );
}
