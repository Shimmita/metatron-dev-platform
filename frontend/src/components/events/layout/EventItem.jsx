import {
  Add,
  Share
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";
function EventItem({isDarkMode=false,event}) {

  const navigate = useNavigate();
  // handle navigation to the live attending
  const handleNavigateLiveAttend = () => {
    navigate("/events/live-attending");
  };

  const { user } = useSelector((state) => state.currentUser);

  // get date from the event
  const handleGetDate=()=>{
    return event?.dateHosted?.split("T")[0]
  }

  // handle get time
  const handleGetTime=()=>{
  return event?.dateHosted?.split("T")[1]?.split("+")[0]?.split(".")[0]
  
  }

  

  return (
      <Box 
      display={"flex"} 
      justifyContent={"center"}
      >
        <Card
          elevation={0}
          className="rounded-3"
          sx={{ 
          border:'1px solid',
          borderColor:'divider',
          maxWidth: CustomDeviceIsSmall() ? 380:320, 
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
              px={1}
              justifyContent={'flex-end'}>
              <Tooltip arrow title='share'>
              <IconButton
              size="small">
              <Share 
              sx={{ width:16,height:16, color:'white' }}/>
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
                      sx={{ width: 25, height: 25 }}
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
                    gap={1}
                    fontWeight={"bold"}
                    alignItems={"center"}
                    display={"flex"}
                  >
                    <Box>
                      <Avatar src="" 
                      alt=""
                      sx={{ width:32,height:32 }}  />
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
                  {/* country */}
                   <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                      >
                        {event?.location?.country?.split("(")[0]}
                      </Typography>

                      {/* state */}
                      <Typography
                        textTransform={"capitalize"}
                        variant="caption"
                      >
                        {event?.location?.state}
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
                sx={{ fontSize:'x-small' }}>
                  ~ 200 users done RSVP~
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

                {/* button add rsvp */}

                <Box
                 display={"flex"}
                 mt={0.5}
                 justifyContent={"center"}>
                  <Button
                    disableElevation
                    variant={isDarkMode ?'outlined':'contained'}
                    size="small"
                    sx={{ 
                    borderRadius: 3,
                    fontSize:'x-small'
                    }}
                    onClick={handleNavigateLiveAttend}
                    startIcon={<Add  />}
                  >
                    RSVP EVENT
                  </Button>
                </Box>  

          </CardContent>
        </Card>
      </Box>
        );
}

export default EventItem;
