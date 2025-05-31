import {
  Alert,
    Box,
    CircularProgress,
    Collapse,
    IconButton,
    Modal,
    styled
} from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostDetailsFeed from "../post/PostDetailsFeed";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { handleSetPostEditIdModal, handleShowPostEditModal } from "../../redux/AppUI";
import axios from "axios";
import { Close } from "@mui/icons-material";

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


const PostEditModal = ({
 
}) => {

  const [postDetailedData,setPostDetailedData]=useState()
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // redux states
  const { isDarkMode, isTabSideBar,isPostEditModal,postEditUniqueId } = useSelector((state) => state.appUI);

  const dispatch=useDispatch()
  // handle the closing of the modal
  const handleClosingModal = () => {
    // reset the postId in the redux
    dispatch(handleSetPostEditIdModal(""))
    // close the model via redux state
    dispatch(handleShowPostEditModal(false))

  };


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
      } else {
        // no more posts
        //setOpenAlertNoPosts(true);
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

  return (
    <StyledModalJob
      keepMounted
      open={isPostEditModal}
       onClose={handleClosingModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomDeviceIsSmall() ? "100%":CustomDeviceTablet()?"80%":"40%"
     }
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
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
                severity="warning"
                className="rounded-5"
                onClick={() => setErrorMessage("")}
                action={
                  <IconButton aria-label="close" color="inherit" size="small">
                    <Close fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {errorMessage}
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
    </StyledModalJob>
  );
};

export default PostEditModal;
