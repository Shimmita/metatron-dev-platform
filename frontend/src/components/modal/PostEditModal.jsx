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
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSetPostEditIdModal, handleShowPostEditModal } from "../../redux/AppUI";
import PostDetailsFeed from "../post/PostDetailsFeed";
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
    isPostEditModal,
    postEditUniqueId } = useSelector((state) => state.appUI);

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


    // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() ||CustomLandscapeWidest()) {
        return "min(92vw, 760px)"
      } else if (CustomDeviceTablet()){
        return "calc(100vw - 32px)"
      } 
      return "calc(100vw - 16px)"
    }

  return (
    <StyledModalJob
      keepMounted
      open={isPostEditModal}
       onClose={handleClosingModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
        sx={{
        backdropFilter:'blur(10px)',
        p: { xs: 1, sm: 2 },
        "& .MuiBackdrop-root": {
          background: "rgba(3,7,18,0.72)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Box
        width={handleReturnWidthModal()}
        color={"text.primary"}
        sx={{
          maxWidth: "760px",
          maxHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 32px)" },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "8px",
          overflow: "hidden",
          background: "background.paper",
          boxShadow: "0 28px 90px rgba(0,0,0,0.62)",
        }}
      >
      <Box
        maxHeight={"calc(100dvh - 32px)"}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(148,163,184,0.28)",
            borderRadius: 999,
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(148,163,184,0.28) transparent",
        }}
      >

        {/* display progress status */}
        {isFetching && (
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <CircularProgress size={25}/>
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
