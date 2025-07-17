import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  FormHelperText,
  IconButton,
  Modal,
  styled
} from "@mui/material";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSetPostEditIdModal, handleShowPostEditModal } from "../../redux/AppUI";
import PostDetailsFeed from "../post/PostDetailsFeed";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


const PostEditModal = () => {

  const [postDetailedData,setPostDetailedData]=useState()
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // redux states
  const {
     currentMode, 
    isTabSideBar,
    isPostEditModal,
    postEditUniqueId } = useSelector((state) => state.appUI);

  // updating the isDark mode 
  const isDarkMode=currentMode==='dark'

  const dispatch=useDispatch()

  // axios default credentials
  axios.defaults.withCredentials = true;

  // use layout effect and fetch user specific post based on that Id
  useLayoutEffect(()=>{
   
    axios
    .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all/${postEditUniqueId}`, {
      withCredentials: true,
    })
    .then((res) => {
      // update the  current post
      if (res?.data) {
       setPostDetailedData(res.data)
      } 
    })
    .catch((err) => {
      //  user login session expired show logout alert
      if (err?.response?.data.login) {
        window.location.reload();
      }
      if (err?.code === "ERR_NETWORK") {
        setErrorMessage(
          "Server is unreachable "
        );
        return;
      }
      setErrorMessage(err?.response.data);
    })
    .finally(() => {
      // set is fetching to false
      setIsFetching(false);
      
    });
  },[postEditUniqueId])


   // handle the closing of the modal
   const handleClosingModal = () => {
    // reset the postId in the redux
    dispatch(handleSetPostEditIdModal(""))
    // update post detailed data to none
    setPostDetailedData({})
    // close the model via redux state
    dispatch(handleShowPostEditModal(false))

  };

   // handle width of the global search
    const handleModalWidth=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "36%"
      } else if(CustomLandScape()){
        return "-8%"
      } else if(CustomLandscapeWidest()){
        return "-5%"
      }
    }

  return (
    <StyledModalJob
      keepMounted
      open={isPostEditModal}
       onClose={handleClosingModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={CustomDeviceIsSmall() ? "100%":CustomDeviceTablet()?"80%":"40%"}
        p={1}
        borderRadius={4}
        bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginLeft:handleModalWidth()
        }}
      >
        <Box
         maxHeight={"70vh"}
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

        {/* display progress status */}
        {isFetching && (
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <CircularProgress size={30}/>
          </Box>
        )}

         {/* display error */}
        {errorMessage && (
          <Box p={1} display={"flex"} justifyContent={"center"}>
            <Collapse in={errorMessage || false}>
              <Alert
                severity="info"
                className="rounded"
                onClick={() => setErrorMessage("")}
                action={
                  <IconButton aria-label="close" color="inherit" size="small">
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                 <FormHelperText>{errorMessage}</FormHelperText>
              </Alert>
            </Collapse>
          </Box>
        )}

        {/* rendered when are posts */}
        {postDetailedData && (
          <PostDetailsFeed
           isPostEditMode={true}
            postDetailedData={postDetailedData} 
            setPostDetailedData={setPostDetailedData}/>
        )}
      </Box>

      </Box>
    </StyledModalJob>
  );
};

export default PostEditModal;
