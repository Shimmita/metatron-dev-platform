import {
  Add,
  ArrowCircleRightRounded,
  BarChart,
  Delete,
  Share
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  ListItemAvatar,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentEvents } from "../../../redux/CurrentEvents";
import { resetClearCurrentEventsTop } from "../../../redux/CurrentEventsTop";
import { updateCurrentSnackBar } from "../../../redux/CurrentSnackBar";
import CustomCountryName from "../../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";
import AlertMiniProfileView from "../../alerts/AlertMiniProfileView";
function EventItem({
  isDarkMode=false,
  event,
  setErrorMessage,
  isEventsManager=false,
  setIsEventsStats,
  setFocusedEvent,
  isRSVP=false,
  isLastIndex=false,
  setPageNumber,
  pageNumber,
}) {

  const [isFetching, setIsFetching] = useState(false);
  const [openMiniProfile,setOpenMiniProfile]=useState(false)
  
  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { events:eventsData } = useSelector((state) => state.currentEvents);
  const isUserMadeRSVP=event?.users?.value.some((currentId)=>currentId===user?._id)
  const isMyOwnEvent=event?.ownerId===user?._id
  
  const dispatch=useDispatch()

  // handle creating of rsvp
  const handleCreateRSVP = () => {
    // eventRSVP object
    const rsvpObject={
      userId:user?._id,
      eventId:event?._id,
      userName:user?.name,
      userEmail:user?.email,
      userGender:user?.gender,
      userCountry:CustomCountryName(user?.country),
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
            // update the events redux payload to reflect the changes.
            let filteredEvents=eventsData?.filter((currentItem)=>currentItem._id!==event?._id)
            // update the redux now
            dispatch(updateCurrentEvents([serverEventObject,...filteredEvents]))
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


  // handle deletion of rsvp
  const handleDeleteRSVP=()=>{
 
    // is fetching true
    setIsFetching(true)

    // performing post request to make a reservation
    axios.delete(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/delete/rsvp/${user?._id}/${event?._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            // update status data and message from backend
            dispatch(updateCurrentSnackBar(res.data.message));
            dispatch(updateCurrentEvents(res.data.data))
          
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
  }

  // handle deletion of my posted event
  const handleDeleteMyEvent=()=>{
     // is fetching true
    setIsFetching(true)

    // performing post request to make a reservation
    axios.delete(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/delete/event/${user?._id}/${event?._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            // update status data and message from backend
            dispatch(updateCurrentSnackBar(res.data.message));
            dispatch(updateCurrentEvents(res.data.data))
            // reset the events for refresh
            dispatch(resetClearCurrentEventsTop())
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
  }

  // handle setting of events stats true, only for events manager
  const handleEventsStats=()=>{
    if (isEventsManager) {
      // update the focused event
      setFocusedEvent(event)
      // for display of event stats
      setIsEventsStats(true)
    }
  }

  // get date from the event
  const handleGetDate=()=>{
    return event?.dateHosted?.split("T")[0]
  }

  // handle get time
  const handleGetTime=()=>{
  return event?.dateHosted?.split("T")[1]?.split("+")[0]?.split(".")[0]
  
  }

  const handleFetchMoreData=()=>{
      // fetching to true
      setIsFetching(true)
      // axios api call to fetch more data
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/?page=${pageNumber}&limit=6`, {
          withCredentials: true,
        })
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            // more data update redux
            if (res.data.length>0) {
            dispatch(updateCurrentEvents([...eventsData,...res.data]));  
            }
          } 
  
          // update the page number for the next fetch
          setPageNumber((prev)=>prev+1)
        })
        .catch((err) => {
          //  user login session expired show logout alert
          if (err?.response?.data.login) {
            window.location.reload();
          }
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage(
              "server unreachable"
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

    // handle showing of mini profile
    const handleShowMiniProfile=()=>{
      setOpenMiniProfile(true)
    }

  return (
      <Box 
      display={"flex"} 
      justifyContent={"center"}
      gap={2}
      mb={isLastIndex && CustomDeviceIsSmall() && 5}
      flexDirection={CustomDeviceIsSmall() ? 'column':'row'}
      >
      {/* card events details */}
        <Card
          elevation={0}
          className="rounded-3"
          sx={{ 
          border:'1px solid',
          borderColor:'divider',
          maxWidth: CustomDeviceIsSmall() ? 380:330, 
          }}
        >
          <CardContent>
            <Box 
            className='rounded'
            bgcolor={isDarkMode ? '#3333':'black'}
            sx={{ 
              }}>

              {/* share icon */}
              <Box
              width={'100%'}
              display={'flex'} 
              gap={1.5}
              px={1}alignItems={'center'}
              justifyContent={'flex-end'}>

              {/* if current user created the event display helper text */}
              {isMyOwnEvent &&   
              <Typography
                textTransform={"lowercase"}
                variant="caption"
                className="text-info"
                sx={{ color:'white' }}
                >
                yours
                </Typography>}
              
              {/* share icon */}
              <Tooltip arrow title='share'>
              <IconButton
              size="small">
              <Share 
              className="text-info"
              sx={{ width:16,height:16, }}/>
              </IconButton>
              </Tooltip>
              </Box>

              {/* skills panel */}
              <Box display={"flex"} justifyContent={"center"}>
                <AvatarGroup max={user?.selectedSkills?.length}>
                  {/* loop through the skills and their images matched using custom fn */}
                  {event?.skills?.map((skill, index) => (
                    <Tooltip title={skill} arrow  key={index}
              >
                    <Avatar
                      alt={skill}
                      className="border"
                      sx={{ width: 26, height: 26 }}
                      src={getImageMatch(skill)}
                    />
                    </Tooltip>
                        ))}
                    </AvatarGroup>
                  </Box>

                {/* date */}
                <Box 
                mt={0.5}
                display={'flex'} 
                justifyContent={'center'}>
                  <Typography
                    variant="caption"
                    textTransform={"capitalize"}
                    textAlign={"center"}
                    className="text-info"
                    fontWeight="bold"
                  >
                   {handleGetDate()} | {handleGetTime()}
                  </Typography>
                  </Box>

              {/* title */}
              <Box 
              
              display={'flex'} 
              alignItems={'center'}
              justifyContent={'center'}>
              
                <Typography
                variant="caption"
                textTransform={"capitalize"}
                fontWeight="bold"
                sx={{ color:'white' }}
                textAlign={"center"}
              >
                {event?.title}
              </Typography>
              </Box>

                {/* category */}
            <Box 
              display={'flex'} 
              alignItems={'center'}
              justifyContent={'center'}>
              <Typography
                variant="caption"
                textAlign={"center"}
                textTransform={"capitalize"}
                fontWeight="bold"
                sx={{ color:'white' }}
              >
              {event?.category}
              </Typography>
              </Box>
   
                </Box>
              {/* scrollable overflow content */}

                {/* about */}
                <Typography
                  pt={1}
                  variant="caption"
                >
                  {event?.about}
                </Typography>
            
                {/* topics section */}
                <Box mt={0.5} component={'ul'}>
                {event?.topics?.map(topic=>(
                   <Typography
                      variant="caption"
                      key={topic}
                      component={"li"}
                    >
                     {topic}
                    </Typography>
                ))}
                </Box>
                <Box
                justifyContent={'space-between'}
                alignItems={'center'}
                width={'100%'}
                display={'flex'}
                >
                {/* profile part A */}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={"bold"}
                  >
                   
                  <Typography
                    variant="caption"
                    fontWeight={"bold"}
                    alignItems={"center"}
                    display={"flex"}
                  >
                    <Box>
                    <Tooltip arrow title='profile'>
                    <ListItemAvatar onClick={handleShowMiniProfile}>
                      <Avatar 
                      src={event?.ownerAvatar}
                      alt=""
                      />
                      </ListItemAvatar>
                      </Tooltip>
                    </Box>

                    <Box>
                      <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                        display={"flex"}
                        alignItems={"center"}
                        className="fw-medium"
                        gap={1}
                      >
                        {event?.ownerName?.toLowerCase()}
                      </Typography>
                      <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                      >
                        {event?.ownerSpecialize}
                      </Typography>
                        </Box>
                      </Typography>
                  </Typography>
                  </Box>
                  {/* profile part B */}
                  <Box display={'flex'} flexDirection={'column'}>

                      {/* state */}
                      <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                      >
                        {event?.location?.state}
                      </Typography>

                  {/* country */}
                   <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                      >
                        {event?.location?.country?.includes("+") ? CustomCountryName(event?.location?.country)  :event?.location?.country?.split("(")[0]}
                        
                      </Typography>

                  </Box>
                </Box>
 

                {/* number of rsvp */}
                <Box
                mt={0.5}
                display={'flex'}
                justifyContent={'center'}
                >
                <Typography
                variant="caption"
                className={isUserMadeRSVP && 'text-success fw-bold'}
                sx={{ fontSize:'x-small' }}>
                 {isUserMadeRSVP ? `You and ${event?.users?.count} others made rsvp`:`~ ${event?.users?.count} users done RSVP ~`}
                </Typography>
                </Box> 

                {/* form helper text about timezones */}
                <Box
                display={'flex'}
                justifyContent={'center'}
                >
                <Typography
                variant="caption"
                sx={{ fontSize:'x-small' }}>
                  ~ Timezones {event?.location?.state}, {event?.location?.country?.split("(")[0]} ~
                </Typography>
                </Box>  

                {/* button add rsvp, depending on if is eventsManager */}
                {isRSVP ? (
                  <Box
                display={"flex"}
                mt={0.5}
                gap={1}
                justifyContent={"center"}>
                  <Button
                    disableElevation
                    variant={isDarkMode ?'outlined':'contained'}
                    disabled={isFetching}
                    color="warning"
                    size="small"
                    sx={{ 
                    fontSize:'x-small',
                    borderRadius:3
                    }}
                    onClick={handleDeleteRSVP}
                    startIcon={isFetching ? <CircularProgress size={13}/>:<Delete />}
                  >
                    Delete RSVP
                  </Button>
                </Box>  
                ):isEventsManager ? (
                  <Box
                display={"flex"}
                mt={0.5}
                gap={3}
                justifyContent={"center"}>

                {/* event stats button */}
                <Button
                    disableElevation
                    variant={isDarkMode ?'outlined':'contained'}
                    disabled={isFetching}
                    color="success"
                    size="small"
                    sx={{ 
                    fontSize:'x-small',
                    borderRadius:3
                    }}
                    onClick={handleEventsStats}
                    startIcon={isFetching ? <CircularProgress size={13}/>:<BarChart />}
                  >
                    Statistics
                  </Button>

                {/* delete event button */}
                  <Button
                    disableElevation
                    variant={isDarkMode ?'outlined':'contained'}
                    disabled={isFetching}
                    color="warning"
                    size="small"
                    sx={{ 
                    fontSize:'x-small',
                    borderRadius:3
                    }}
                    onClick={handleDeleteMyEvent}
                    startIcon={isFetching ? <CircularProgress size={13}/>:<Delete />}
                  >
                    Delete Now
                  </Button>

                </Box> 
                ):(
                  <Box
                 display={"flex"}
                 mt={0.5}
                 justifyContent={"center"}>
                  <Button
                    disableElevation
                    variant={isDarkMode ?'outlined':'contained'}
                    disabled={isFetching || isUserMadeRSVP}
                    size="small"
                    sx={{ 
                    borderRadius: 3,
                    fontSize:'x-small'
                    }}
                    onClick={handleCreateRSVP}
                    startIcon={isFetching ? <CircularProgress size={13}/>:<Add />}
                  >
                    RSVP EVENT
                  </Button>
                </Box>  
                )}
          </CardContent>
        </Card>


         {/* next button zone, only if item is last index */}
           {isLastIndex && (
             <Box 
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}>
            <IconButton 
            disabled={isFetching}
             onClick={handleFetchMoreData}
             size="small"
             sx={{ 
              border:'1px solid',
              borderColor:'divider'
              }}
             >
             {isFetching ? 
             <CircularProgress size={20}/>: 
             <ArrowCircleRightRounded
              color="primary"
               sx={{ width:28,height:28}}/>}
            </IconButton>
            </Box>
           )}


          {/* mini profile alert  */}
          {openMiniProfile && (
            <AlertMiniProfileView
              openAlert={openMiniProfile}
              setOpenAlert={setOpenMiniProfile}
              userId={event?.ownerId}
            />
          )}

      </Box>
        );
}

export default EventItem;
