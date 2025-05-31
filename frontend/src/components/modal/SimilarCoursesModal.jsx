import { Close } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Modal,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { resetSimilarCoursesModal } from "../../redux/AppUI";
import SimilarCoursesLayout from "../courses/layout/SimilarCoursesLayout";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";
import CustomLandScape from "../utilities/CustomLandscape";

// styled modal
const StyledModalSimilarCourses = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const SimilarCoursesModal = ({ openSimilarCourses }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // handle closing of the modal by redux
  const handleClosingModal = () => {
    dispatch(resetSimilarCoursesModal());
  };

  // simulate array of items
  const items = Array.from(new Array(10));

  // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "40%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } else if(CustomLandscapeWidest()){
        return "35%"
      }
      return "100%"
    }
  return (
    <StyledModalSimilarCourses
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openSimilarCourses}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={handleReturnWidthModal()}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        display={"flex"}
        className="rounded-1"
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          width={"100%"}
          bgcolor={"background.default"}
          className="shadow-lg rounded-1"
        >
          {/* toolbar  */}
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box>
              <Avatar src={AppLogo} alt="logo" />
            </Box>

            <Typography textTransform={"capitalize"}>
              Similar Courses
            </Typography>

            {/*close icon */}
            <IconButton
              disabled={isFetching || errorMessage}
              onClick={handleClosingModal}
            >
              <Tooltip title={"close"}>
                <Close sx={{ width: 20, height: 20 }} />
              </Tooltip>{" "}
            </IconButton>
          </Box>

          {/* display error of missing filed if any */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            mb={isFetching || errorMessage ? 3 : undefined}
          >
            {errorMessage ? (
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
            ) : (
              isFetching && (
                <Box>
                  <CircularProgress size={"25px"} />
                </Box>
              )
            )}
          </Box>

          {/* divider */}
          <Divider component={"div"} className="p-2" />

          <Box
            maxHeight={CustomModalHeight()}
            className="px-3 mt-2"
            sx={{
              overflow: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              opacity: isFetching && ".3",
            }}
          >
            <Box display={"flex"} flexDirection={"column"} gap={4}>
              {items?.map((val) => (
                <SimilarCoursesLayout  key={val}/>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalSimilarCourses>
  );
};

export default SimilarCoursesModal;
