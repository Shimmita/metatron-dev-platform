import { Add } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentEventsTop } from "../../../redux/CurrentEventsTop";
import { updateCurrentSnackBar } from "../../../redux/CurrentSnackBar";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";


function FeaturedEvent({ isLoading, eventTop,isLastIndex,setErrorMessage }) {
  const [isFetching, setIsFetching] = useState(false);
  
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  const { user } = useSelector((state) => state.currentUser);
  const { eventsTop } = useSelector((state) => state.currentEventsTop);
  
  const dispatch=useDispatch()


  // if not true the false is default
  const isMyEvent=eventTop?.ownerId===user?._id || false
  const isUserMadeRSVP=eventTop?.users?.value.some((currentId)=>currentId===user?._id)


  const handleCountryName = (eventTop) => {
    const parent = eventTop.location.country.split(" ");
    const finalName =
      parent.length > 2 ? `${parent[0]} ${parent[1]}` : parent[0];

    return finalName;
  };


// handle creating of rsvp
  const handleCreateRSVP = () => {
    // eventRSVP object
    const rsvpObject={
      userId:user?._id,
      eventId:eventTop?._id,
      userName:user?.name,
      userEmail:user?.email,
      userGender:user?.gender,
      userCountry:handleCountryName(eventTop),
      userAvatar:user?.avatar

    }

    // is fetching true
    setIsFetching(true)

    // performing post request to make a reservation
    axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/create/rsvp/`,
          rsvpObject,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            dispatch(updateCurrentSnackBar(res.data.message));
            // server event object
            let serverEventObject=res.data.data;
            // update the events top redux payload to reflect the changes.
            let filteredEvents=eventsTop?.filter((currentItem)=>currentItem._id!==eventTop?._id)
            // update the redux now
            dispatch(updateCurrentEventsTop([serverEventObject,...filteredEvents]))
          } 
        })
        .catch(async (err) => {
          //  user login session expired show logout alert
          if (err?.response?.data.login) {
            window.location.reload();
          }
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage(
              "server unreachable!"
            );
            return;
          }
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsFetching(false);
        });
  };

  return (
    <React.Fragment>
      {isLoadingRequest || isLoading ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <IconButton>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width={"70%"} animation="wave" />}
              secondary={<Skeleton width={"50%"} animation="wave" />}
            />

            <Box ml={3}>
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: "20px" }}
                width={35}
                height={15}
              />
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={eventTop?.ownerAvatar}
                sx={{
                  backgroundColor: "#1976D2",
                }}
                alt={eventTop?.title[0]}
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                // title of the event
                <Typography fontWeight={"bold"} variant="body2">
                  {eventTop?.title}
                </Typography>
              }
              secondary={
                <Box>
                  {/* event category */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {eventTop?.category} Event
                  </Typography>

                  {/* location, state, access */}
                  <Box display={"flex"} alignItems={"center"}>
                   {/* state */}
                    <Typography
                      variant="caption"
                      color={"text.secondary"}
                    >
                      {eventTop?.location?.state}
                    </Typography>

                     {/* divider */}
                    <Divider
                      component={"li"}
                      orientation="vertical"
                      variant="middle"
                      className="p-1"
                    />
                    {/* country */}
                    <Typography ml={1} variant="caption" color={"text.secondary"}>
                      {handleCountryName(eventTop && eventTop)}
                    </Typography>
                   
                   
                  </Box>

                  {/* event skills */}
                  <Box display={"flex"} mt={"2px"}>
                    <AvatarGroup max={eventTop?.skills?.length}>
                      {/* loop through the skills and their images matched using custom fn */}
                      {eventTop?.skills?.map((skill) => (
                        <Tooltip title={skill} key={skill} arrow>
                          <Avatar
                            alt={skill}
                            className="border"
                            sx={{ width: 27, height: 27 }}
                            src={getImageMatch(skill)}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>

                </Box>
              }
            />

            <Stack gap={1} alignItems={"center"} justifyContent={"flex-end"}>
              {/* applicants counter */}
              <Box>
                <Typography variant="caption" color={"text.secondary"} fontWeight={'bold'}>
                {eventTop?.users?.count} rsvp
                </Typography>
              </Box>

                <React.Fragment>
                {/* button apply */}
                <Button
                  disableElevation
                  size="small"
                  onClick={handleCreateRSVP}
                  variant="contained"
                  startIcon={isFetching?<CircularProgress size={13}/>:<Add/>}
                  disabled={isUserMadeRSVP || isMyEvent || isFetching}
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 3,
                    fontSize:!CustomDeviceIsSmall() && 'x-small'
                  }}
                >
                  {isUserMadeRSVP ? "Saved":"RSVP"}
                </Button>
                </React.Fragment>
              
            </Stack>
          </ListItem>
        
         {/* show divider only if the job is not the last index */}
         {!isLastIndex &&  <Divider variant="inset" component="li" />}
        </List>
      )}
    </React.Fragment>
  );
}

export default React.memo(FeaturedEvent);
