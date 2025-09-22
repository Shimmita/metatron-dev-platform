import { Add, Close, PeopleRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  styled,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentConnectTop } from "../../redux/CurrentConnect";
import { resetClearPeopleData } from "../../redux/CurrentModal";
import UserNetwork from "../profile/UserNetwork";
import FriendRequest from "../rightbar/layouts/FriendRequest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// styled modal
const StyledModalPeople = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const PeopleModal = ({
  openPeopleModal, 
  PeopleConnect, 
  isFeed=false,
  setOpenPeopleModal,
 }) => {
  
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMorePosts,setHasMorePosts]=useState(true) 
  const [pageNumber,setPageNumber]=useState(2)
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  const { user } = useSelector((state) => state.currentUser);
  

  const dispatch = useDispatch();

  // close the modal from redux by altering states to false and null data
  const handleCloseModalPeople = () => {
    // modal opened from the feed default content
    if (isFeed) {
      setOpenPeopleModal()
    }
    dispatch(resetClearPeopleData());
  };


   // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() || CustomLandscapeWidest() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "35%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } 
      return "100%"
    }

 
    
     // handle loading of more data
  const handleLoadMore=()=>{

    // set is fetching to true
    setIsFetching(true);

    // performing get request
    axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/users/${user?._id}?page=${pageNumber}&limit=4`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of connect request suggestion
        if (res.data.length>0) {
          dispatch(updateCurrentConnectTop([...PeopleConnect, ...res.data]));
        }else{
          // no more posts
          setHasMorePosts(false)
        }
        // update the page number
        setPageNumber(prev=>prev+1)

      })
      .catch(async (err) => {

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
        
        // log error
        console.log(errorMessage)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
      }

  // control showing of friends
  const handleShowFriends=()=>{


  }

  return (
    <StyledModalPeople
      keepMounted
      open={openPeopleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter:'blur(5px)',
      }}
    >
      <Box
        width={handleReturnWidthModal()}
        color={"text.primary"}
        display={"flex"}
        justifyContent={"center"}
        borderRadius={2}
        border={isDarkMode &&'1px solid'}
        borderColor={'divider'}
        alignItems={"center"}
      >
        <Box
          borderRadius={3}
          width={"100%"}
          bgcolor={"background.default"}
        >
          {/* toolbar  */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            alignItems={"center"}
            gap={2}
            borderRadius={2}
            pt={1}
            sx={{
             background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              width={"100%"}
            >
              {/* logo */}
              <Box>
                <Avatar src={AppLogo} alt="logo" />
              </Box>

              <Typography
                variant="body2"
                fontWeight={"bold"}
                textTransform={"uppercase"}
              >
                {isFeed ? "People Suggestions":"Search Suggestion"}
              </Typography>
            </Stack>

            <Box mr={3}>
              {/*close icon */}
                <Tooltip 
                title={"close"}>
              <IconButton 
              sx={{ 
                  border:'1px solid',
                  borderColor:'divider'
                 }}
              onClick={handleCloseModalPeople}>
              
                  <Close sx={{ width: 10, height: 10 }} />
              </IconButton>
                </Tooltip>
            </Box>
          </Box>

          {/* Tabs centered */}
          {isFeed && (
            <Box display={'flex'} justifyContent={'center'}>
            <Box >
            <Tabs  value={value} onChange={handleChangeTab} aria-label="people_tab">
              <Tab label="Connect" className="me-4" icon={<Add />} iconPosition="start"/>
              <Tab label="Friends" onClick={handleShowFriends} icon={<PeopleRounded/>} iconPosition="start" />
            </Tabs>
          </Box>
          </Box>
          )}

          <Box
            maxHeight={'70vh'}
            className="px-3 mt-1"
            sx={{
              overflow: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Box 
            display={"flex"} 
            flexDirection={"column"} 
            justifyContent={'center'}
            >

            {/* display friends */}
            {value===1 ? (
              <UserNetwork/>
            ):(
              <>
              {/* map over the peoples */}
              {PeopleConnect?.map((person) => (
                  <FriendRequest key={person?._id} connect_request={person} />
                ))}
              
              {/* if last item show see more button */}
              {isFeed && (
                <Button 
                startIcon={isFetching?<CircularProgress size={16}/> :undefined}
                disabled={isFetching || !hasMorePosts} 
                onClick={handleLoadMore}>
                {!hasMorePosts ? "no more":"see more"}
                </Button>
              )}
              </>
            )}
              
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPeople>
  );
};

export default PeopleModal;
