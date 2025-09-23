import { useTheme } from "@emotion/react";
import { Add, Close, Diversity3Rounded, Settings, Visibility } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Divider, FormHelperText, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentGroupCommunities } from "../../redux/CurrentGroups";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import GroupCommunityDetails from "../group/GroupCommunityDetails";
import GroupCommunityMobile from "../group/GroupCommunityMobile";
import GroupCommunityTab from "../group/GroupCommunityTab";
import CustomDeviceIsSmall from '../utilities/CustomDeviceIsSmall';
import { getImageMatch } from "../utilities/getImageMatch";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertGroupCommunity({
   openGroup,
   setOpenGroup,
   isDarkMode=false,
   search=[]

}) {

    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [focusedGroup,setFocusedGroup]=useState(null)


     // handle screen responsiveness
    const theme = useTheme();

    // smart and below
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

    // tabs and below
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

      const dispatch=useDispatch()

    // redux state
    const { user } = useSelector((state) => state.currentUser);

    // prevent showing group modal when is success alert
      const { isActive } = useSelector((state) => state.currentSuccess);
    
    let { groups:groupData } = useSelector((state) => state.currentGroups);

    let tempGroupSearch=[]

    // the request is from search
    if (search.length) {
    for (const element1 of groupData) {
      for (const element2 of search) {
        if (element2.name.includes(element1.name)) {
          tempGroupSearch.push(element1)
        }
      }
    }

    // update redux groups data with search matching results
    groupData=[...tempGroupSearch]
    }
    
    const handleClose = () => {
        setOpenGroup(false);
        setFocusedGroup(null)
    };


    // handle joining community
    const handleJoinCommunity=(group)=>{
      const dataObject={
        userId:user?._id,
        groupId:group._id
      }

      // set is fetching
      setIsFetching(true)

      // axios api call for joining into a community
        axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/join`,
            dataObject,
            {
                withCredentials: true,
            }
            )
            .then((res) => {
            // update groups and community  triggers auto refetch
            if (res?.data) {
              dispatch(resetClearCurrentGroupCommunities() )   
              
              // show alert success
              dispatch(updateCurrentSuccessRedux({title:'Joined Group',message:res.data}))
            } 
            })
            .catch(async (err) => {
            console.log(err);
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



    // handle not showing of the alert group on launch
    const handleNoShowGroupOnLaunch=()=>{
      // fetching state
          setIsFetching(true)
          // axios post, update the tutorial state in the user db backend
          axios.post(`
            ${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/tutorial/groups`,
            {userId:user?._id}, {
              withCredentials: true,
            })
            .then((res) => {
              // update the current user redux state from the backend
              dispatch(updateUserCurrentUserRedux(res.data))

            })
            .catch((err) => {
              //  user login session expired show logout alert
              if (err?.response?.data.login) {
                window.location.reload();
              }
              if (err?.code === "ERR_NETWORK") {
                setErrorMessage(
                  "Server is unreachable!"
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
    

    // handle focused group
    const handleFocusedGroup=(group)=>{
           // fetching state
          setIsFetching(true)

      // axios api call for getting group details
        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/all/${user?._id}/${group?._id}`,
            {
                withCredentials: true,
            }
            )
            .then((res) => {
            // update focused group
            if (res?.data) {
              setFocusedGroup(res.data)
            } 
            })
            .catch(async (err) => {
            console.log(err);
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



  return (
      <Dialog
        open={openGroup && !isActive}
        fullScreen
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter:'blur(5px)',
          }}
      >
        <DialogTitle
        display={"flex"}
        alignItems={"center"}
        fontWeight={"bold"}
        variant="body1"
        justifyContent={'space-between'}
        sx={{
        background: !isDarkMode && 
        "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
        >
        <Box 
        gap={2}
        alignItems={'center'}
        display={'flex'}>
        <Diversity3Rounded/>
        Groups and Communities
        </Box>

        {/* close btn */}
        <Tooltip
        title='close'
        arrow
        >
        <IconButton
        color="secondary"
        onClick={handleClose}
        sx={{
          border:'1px solid',
          borderColor:'divider',
        }}
        >
          <Close sx={{
            width:12,height:12
          }}/>
        </IconButton>
        </Tooltip>

        </DialogTitle>
        {errorMessage || isFetching ? (
          <Box 
        display={'flex'} 
        alignItems={'center'}
        gap={2}
        mb={0.5}
        justifyContent={'center'}>
        {isFetching && <CircularProgress size={12}/>}
          <FormHelperText>
            {isFetching ? "processing information":errorMessage}
          </FormHelperText>
        </Box>
        ):(
          <Box 
        display={'flex'} 
        mb={0.5}
        gap={2}
        justifyContent={'center'}>
        
        {/* group name */}
          <Typography 
          fontWeight={focusedGroup ? 'bold':undefined}
          variant="body1" 
          color={'text.secondary'}>
            {focusedGroup ? focusedGroup.group.name :'vibrant groups and communities'}
          </Typography>
        </Box>
        )}

        {/* dialog content */}
        <DialogContent 
        dividers
        sx={{
          overflow: "auto",
          maxHeight:'80vh',
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        >

        {focusedGroup ? (
          <React.Fragment>
          {isMobile ? (
            <GroupCommunityMobile
          focusedGroup={focusedGroup}
          isFetching={isFetching}
          userId={user?._id}
          isDarkMode={isDarkMode}
          handleJoinCommunity={handleJoinCommunity}
          groups={groupData}
            />
          ):isTablet ? (
            <GroupCommunityTab
          focusedGroup={focusedGroup}
          isFetching={isFetching}
          userId={user?._id}
          isDarkMode={isDarkMode}
          handleJoinCommunity={handleJoinCommunity}
          groups={groupData}
            />
          ) :(
            <GroupCommunityDetails 
          focusedGroup={focusedGroup}
          isFetching={isFetching}
          userId={user?._id}
          isDarkMode={isDarkMode}
          handleJoinCommunity={handleJoinCommunity}
          groups={groupData}
          
          />
          )}
          </React.Fragment>
        ):(
          <>
          {/* loop through groups and communities courses */}
          {groupData?.map((group,index)=>(
            <React.Fragment key={group}>
            <Stack 
            key={group.name}
            direction={'row'}
            alignItems={'center'}
            >
              <ListItem>
              <ListItemAvatar>
                {group.name
                .includes("System Design and Principles") ? 
                (<Settings sx={{width:34,height:34}}/>):
                <Avatar 
                sx={{
                  width:34,height:34
                }}
                src={getImageMatch(group.name.split(","),false,true)}
                alt=""/>}
              </ListItemAvatar>
              <ListItemText
              primary={group.name} 
              secondary={`${group.total} ${group.total===1 ? "member":"members"} | ${group.post_count} ${group.post_count===1 ? "post":"posts"}`} />
            </ListItem>

            {/* btn join or view */}
            <Box>
              {!group.isMember ? (
                <Button 
              sx={{
                borderRadius:5
              }}
              endIcon={isFetching ? <CircularProgress size={11}/>:<Add/>} 
              size="small" 
              onClick={()=>handleJoinCommunity(group)}
              disableElevation
              disabled={isFetching}
              variant="outlined">
              Join
              </Button>
              ):(
                <Button 
              sx={{
                borderRadius:5
              }}
              endIcon={isFetching ? <CircularProgress size={11}/>:<Visibility/>} 
              size="small" 
              onClick={()=>handleFocusedGroup(group)}
              disableElevation
              disabled={isFetching}
              variant="outlined">
              View
              </Button>
              )}
            </Box>
            </Stack>
            {index!==groupData.length-1 && <Divider variant="inset" component="div" />}
            </React.Fragment>
          ))}
        
          </>
        )}

        </DialogContent>
        <DialogActions>
        {user?.isGroupTutorial && (
          <Button 
          disabled={isFetching}
          onClick={handleNoShowGroupOnLaunch} 
          sx={{ 
            borderRadius:4, 
            mr:1,
          }}>
          ok don't show
          </Button>
        )}
        </DialogActions>
    </Dialog>
  );
}
