import { AutoAwesomeRounded, DiamondRounded, Diversity3Rounded, HelpOutlineOutlined, PeopleRounded, SmartphoneRounded } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoadingPostLaunch,
  handleShowingSpeedDial,
  resetAll,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import {
  resetClearCurrentPosts,
  updateCurrentPosts,
} from "../../redux/CurrentPosts";
import AlertForYou from "../alerts/AlertForYou";
import AlertGroupCommunity from "../alerts/AlertGroupCommunity";
import AlertTutorial from "../alerts/AlertTutorial";
import CardFeed from "../custom/CardFeed";
import PeopleModal from "../modal/PeopleModal";
import PostDetailsContainer from "../post/PostDetailsContiner";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber,setPageNumber]=useState(1)
  const [isHelp,setIsHelp]=useState(false)
  const [isRecommend,setIsRecommend]=useState(false)
  const [isPremium,setIsPremium]=useState(false)
  const [isApp,setIsApp]=useState(false)
  const [messageBody,setMessageBody]=useState("")
  const [title,setTitle]=useState("")
  const [showPeople,setShowPeople]=useState()

   
  // redux states access
  const { posts } = useSelector((state) => state.currentPosts);
  const { connectTop } = useSelector((state) => state.currentConnectRequest);
  
  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );

  const { user } = useSelector((state) => state.currentUser);

  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();


  // for about tutorial
  const isAboutShowTutorial=user?.isTutorial||false

  // will trigger alert for groups and community by default from
  // redux state of the user.
  const [openGroup,setOpenGroup]=useState(user?.isGroupTutorial || false)

  const dispatch = useDispatch();

  const isDarkMode=currentMode==='dark'

  // show speed dial if ain't visible
  if (!isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(true));
  }

  // handle showing of default bottom nav
  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, [dispatch]);

  // reset clear any previous posts results specially from search
  useEffect(() => {
    dispatch(resetClearCurrentPosts());
  }, [dispatch]);

  // fetch posts from the backend
  useEffect(() => {
    // if there are posts on refresh don't network request
    if (posts?.length > 0) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);
    // dispatch action for updating is loading in the redux
    dispatch(handleLoadingPostLaunch(true));

    // performing get all posts request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
        // update the page number for the next fetch
        setPageNumber((prev)=>prev+1)
        } 
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable please try again later."
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
        // reset all the UI states to default which will update is_loading in redux
        dispatch(resetAll());
      });
  }, [dispatch, posts]);

  // handle opening of help alert
  const handleOpenHelp=()=>{
    setIsHelp(true)
    setIsPremium(false)
    setIsRecommend(false)
    setIsApp(false)
    setTitle("Get Help and Support")
    setMessageBody("Facing any issues within the platform's rendered services? reach out.")
  }

  // handle open of recommend
  const handleOpenRecommend=()=>{
    setIsRecommend(true)
    setIsPremium(false)
    setIsHelp(false)
    setIsApp(false)
    setTitle("View Recommendations")
    setMessageBody("Insights tailored based on your specialization and skills.")

  }

  // handle opening of premium  
  const handleOpenPremium=()=>{
    setIsPremium(true)
    setIsHelp(false)
    setIsRecommend(false)
    setIsApp(false)
    setTitle("Upgrade To Premium (Cheap)")
    setMessageBody("")
  }

  // handle is mobile app option
  const handleMobileApp=()=>{
    setIsApp(true)
    setIsPremium(false)
    setIsHelp(false)
    setIsRecommend(false)
    setTitle("Mobile and Desktop App")
    setMessageBody("Feature under development, our esteemed software engineers are working on the development of the applications.")
  }

  // handle closing of all info
  const handleCloseAll=()=>{
    setIsPremium(false)
    setIsHelp(false)
    setIsRecommend(false)
    setIsApp(false)
    setMessageBody("")
    setTitle("")
  }


 // handle show people connect modal
 const handleShowPeopleSuggest=()=>{
  setShowPeople(prev=>!prev)
 }

  //  handle showing of the groups
  const handleShowGroups=()=>{
  setOpenGroup(true)
  }

  return (
    <Box
      height={"88.5vh"}
    >
      {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData ? (
        <Box
          sx={{
            border: isDarkMode && "1px solid",
            borderColor:"divider",

            overflowX: "auto",
            // Hide scrollbar for Chrome, Safari and Opera
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for IE, Edge and Firefox
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <Box >
          {/* show progress loader when is fetching true */}
          {isFetching && (
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              height={'95vh'}
              alignItems={"center"}
            >
              <Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <RotatingLines width={40} />
                </Box>
                <Typography
                  mt={2}
                  textAlign={"center"}
                  color={"text.secondary"}
                  variant="body2"
                >
                  retrieving data
                </Typography>
              </Box>
            </Box>
          )}

          {/* scrollable container for the content */}
          <Box
          maxHeight={'85vh'}
            sx={{
              overflowX: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >

          {/* For your Page Content */}
    
          <Box 
          display={'flex'}
          borderRadius={2}
          mb={2}
          bgcolor={'background.default'}
          className='shadow-sm'
          alignItems={'center'}
          justifyContent={CustomDeviceIsSmall()? 'space-between':"space-around"}
          py={1}
          >
          {/* help and support */}
          <Stack 
          justifyContent={'center'}
          alignItems={'center'}
          display={'flex'}>
          <IconButton color="primary" onClick={handleOpenHelp}>
            <HelpOutlineOutlined sx={{ 
            width:27,
            height:27
          }}/>
          </IconButton>
        {!CustomDeviceSmallest() &&  <Typography variant="caption" >Help</Typography>}
          </Stack>

          {/* insights */}
            <Stack
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}>
          <IconButton color="success" onClick={handleOpenRecommend}>
            <AutoAwesomeRounded sx={{ 
            width:25,
            height:25
            }}/>
          </IconButton>
          {!CustomDeviceSmallest() 
          && <Typography variant="caption">Insights</Typography> }
          
          </Stack>

          {/* people suggestions */}
            <Stack
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}>
          <IconButton color="primary" onClick={handleShowPeopleSuggest}>
            <PeopleRounded sx={{ 
            width:25,
            height:25
          }}/>
          </IconButton>
          {!CustomDeviceSmallest() && 
          <Typography variant="caption">People</Typography> }
          
          </Stack>

          {/* people groups and community */}
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}>
          <IconButton 
          color="primary" 
          onClick={handleShowGroups}>
            <Diversity3Rounded sx={{ 
            width:25,
            height:25
          }}/>
          </IconButton>
          {!CustomDeviceSmallest() 
          && <Typography variant="caption">
            Groups
          </Typography> }
          
          </Stack>


          {/* premium */}
            {/* <Stack 
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}>
          <IconButton color="secondary" onClick={handleOpenPremium}>
            <DiamondRounded sx={{ 
            width:25,
            height:25
            }}/>
          </IconButton>
   { !CustomDeviceSmallest() &&  <Typography variant="caption">Premium</Typography>}
          </Stack> */}
          

          {/* mobile app */}
            <Stack 
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}>
          <IconButton color="success" onClick={handleMobileApp}>
            <SmartphoneRounded sx={{ 
            width:25,
            height:25
          }}/>
          </IconButton>
          { !CustomDeviceSmallest() &&  <Typography variant="caption">App</Typography>}
          </Stack>
          </Box>
          
            {/* display the overview posts on tablets(portrait) and mobiles only */}
            {!isFetching && (
              <React.Fragment>
                {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                  <Box
                    className="mb-2 rounded p-1"
                    sx={{
                      border: isDarkMode && "1px solid",
                      borderColor: isDarkMode && "divider",
                    }}
                  >
                    {" "}
                    <MobileTabCorousel />
                  </Box>
                )}
              </React.Fragment>
            )}

            {/* map through the posts and display them to the user */}
            {
              posts?.map((post, index) => {
                return (
                    <CardFeed
                      key={index}
                      post={post}
                      posts={posts}
                      isLastIndex={index===posts?.length-1}
                      setPostDetailedData={setPostDetailedData}
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                    />
                );
              })}
          </Box>
        </Box>
      )}

      {/* show modal people connect feed */}
      {showPeople && (
        <PeopleModal 
        openPeopleModal={showPeople} 
        PeopleConnect={connectTop}
        isFeed={true}
        setOpenPeopleModal={handleShowPeopleSuggest}

        />
      )}

      {/* show alert for help,recommend,analytics */}
      {(isHelp || isRecommend || isPremium||isApp) && (
        <AlertForYou 
        defaultIcon={isHelp? <HelpOutlineOutlined color="info"/> 
        :isRecommend ? <AutoAwesomeRounded color='success'/>:
        isPremium ?<DiamondRounded color="secondary"/>
        :<SmartphoneRounded color="success"/>}
        openAlertGeneral={isHelp||isRecommend||isPremium||isApp}
        title={title}
        message={messageBody}
        isPremium={isPremium}
        isHelp={isHelp}
        isRecommend={isRecommend}
        isApp={isApp}
        handleCloseAll={handleCloseAll}
        />    
        )}

        {/* open tutorial based on the user profile status*/}

        {isAboutShowTutorial && (
          <AlertTutorial
          isDarkMode={isDarkMode}
          />
        )}
  
      {/* show alert groups and communities */}
      {openGroup && (
        <AlertGroupCommunity
          openGroup={openGroup}
          setOpenGroup={setOpenGroup}
          isDarkMode={isDarkMode}
        />
      )}

    </Box>
  );
};

export default FeedDefaultContent;
