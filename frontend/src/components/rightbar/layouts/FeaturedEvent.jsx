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
import CustomCountryName from "../../utilities/CustomCountryName";


function FeaturedEvent({ isLoading, eventTop, isLastIndex, setErrorMessage }) {
  const [isFetching, setIsFetching] = useState(false);

  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  const { user } = useSelector((state) => state.currentUser);
  const { eventsTop } = useSelector((state) => state.currentEventsTop);

  const dispatch = useDispatch()


  // if not true the false is default
  const isMyEvent = eventTop?.ownerId === user?._id || false
  const isUserMadeRSVP = eventTop?.users?.value.some((currentId) => currentId === user?._id)


  const handleCountryName = (eventTop) => {
    const parent = eventTop.location.country.split(" ");
    const finalName =
      parent.length > 2 ? `${parent[0]} ${parent[1]}` : parent[0];

    return finalName;
  };


  // handle creating of rsvp
  const handleCreateRSVP = () => {
    // eventRSVP object
    const rsvpObject = {
      userId: user?._id,
      eventId: eventTop?._id,
      userName: user?.name,
      userEmail: user?.email,
      userGender: user?.gender,
      userCountry: handleCountryName(eventTop),
      userAvatar: user?.avatar

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
          let serverEventObject = res.data.data;
          // update the events top redux payload to reflect the changes.
          let filteredEvents = eventsTop?.filter((currentItem) => currentItem._id !== eventTop?._id)
          // update the redux now
          dispatch(updateCurrentEventsTop([serverEventObject, ...filteredEvents]))
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
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(20,210,190,0.06)",
              borderColor: "rgba(20,210,190,0.3)",
            },
          }}>
            <ListItemAvatar>
              <IconButton>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  sx={{
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width={"70%"} animation="wave" sx={{
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }} />}
              secondary={<Skeleton width={"50%"} animation="wave" sx={{
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }} />}
            />

            <Box ml={3}>
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: "20px" }}
                width={35}
                height={15}
                sx={{
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              />
            </Box>
          </ListItem>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
        </List>
      ) : (
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(20,210,190,0.06)",
              borderColor: "rgba(20,210,190,0.3)",
            },
          }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={eventTop?.ownerAvatar}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                alt={eventTop?.title[0]}
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                // title of the event
                <Typography fontSize={13} fontWeight={600} color="#F0F4FA">
                  {eventTop?.title}
                </Typography>
              }
              secondary={
                <Box>
                  {/* event category */}
                  <Typography variant="body2" sx={{ color: "rgba(240,244,250,0.65)" }}>
                    {eventTop?.category} Event
                  </Typography>

                  {/* location, state, access */}
                  <Box display={"flex"} alignItems={"center"}>
                    {/* state */}
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(240,244,250,0.65)" }}
                    >
                      {eventTop?.location?.state}
                  
                    </Typography>

                    {/* divider */}
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    {/* country */}
                    <Typography ml={1} variant="caption" sx={{ color: "rgba(240,244,250,0.65)" }}>
                      {CustomCountryName(eventTop?.location?.country)}
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
                            sx={{
                              width: 26,
                              height: 26,
                              border: "1px solid rgba(255,255,255,0.1)",
                              background: "rgba(255,255,255,0.05)",
                            }}
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
                <Typography variant="caption" sx={{
                  color: "rgba(240,244,250,0.6)",
                  fontSize: 11,
                }} fontWeight={'bold'}>
                  {eventTop?.users?.count} rsvp
                </Typography>
              </Box>

              <React.Fragment>
                {/* button apply */}
                <Button
                  disableElevation
                  size="small"
                  onClick={handleCreateRSVP}
                  startIcon={isFetching ? <CircularProgress size={13} /> : <Add />}
                  disabled={isUserMadeRSVP || isMyEvent || isFetching}
                  sx={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    color: "#fff",
                    px: 1.5,
                    py: 0.4,
                    fontSize: "0.7rem",

                    "&:hover": {
                      background: "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
                    },

                    "&:disabled": {
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                    }
                  }}
                >
                  {isUserMadeRSVP ? "Saved" : "RSVP"}
                </Button>
              </React.Fragment>

            </Stack>
          </ListItem>

          {/* show divider only if the job is not the last index */}
          {!isLastIndex && <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />}
        </List>
      )}
    </React.Fragment>
  );
}

export default React.memo(FeaturedEvent);
