import { RefreshRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";

const FeedDefaultSearch = () => {
  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { posts,isPostSearch } = useSelector((state) => state.currentPosts);
  const navigate=useNavigate()

  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );
  const isDarkMode=currentMode==='dark'


  // show speed dial if ain't visible
  if (isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(false));
  }


   // handle refresh of the content
    const handleRefreshHome=()=>{
      navigate('/')
    }

  return (
    <Box height={'85vh'}>
      {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData && postDetailedData ? (
        <Box
          height={"85vh"}
          p={1}
          sx={{
            border:isDarkMode && '1px solid',
            borderColor:'divider',
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
        <Box
          height={"85vh"}
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

            {/* fab for refresh, for post search results or like such */}
            {isPostSearch &&  (
              <Box
                my={1}
                display={'flex'} 
                justifyContent={'center'}>
             <Button
             size="small"
             variant="contained"
             startIcon={<RefreshRounded/>}
             sx={{
              borderRadius:3
            }}
              onClick={handleRefreshHome}>
              Refresh
            </Button>
            </Box>
            )}

          {/* map through the posts and display them to the user */}
          {posts?.map((post,index) => {
              return (
                <Box key={post._id} mb={index===posts?.length-1 ? 5:3}>
                    {/* feed card detailed post */}
                    <CardFeed
                      post={post}
                      setPostDetailedData={setPostDetailedData}
                    />
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default FeedDefaultSearch;
