import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { resetClearPeopleData } from "../../redux/CurrentModal";
import FriendRequest from "../rightbar/layouts/FriendRequest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

// styled modal
const StyledModalPeople = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const PeopleModal = ({ openPeopleModal, PeopleConnect }) => {
  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

  const dispatch = useDispatch();

  // close the modal from redux by altering states to false and null data
  const handleCloseModalPeople = () => {
    dispatch(resetClearPeopleData());
  };


   // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() ||CustomLandscapeWidest() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "35%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } 
      return "100%"
    }

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
    <StyledModalPeople
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openPeopleModal}
      onClose={handleCloseModalPeople}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={handleReturnWidthModal()}
        bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
        color={"text.primary"}
        display={"flex"}
        className="rounded-1 border"
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          marginLeft:handleModalWidth() ,
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
            justifyContent={"center"}
            width={"100%"}
            alignItems={"center"}
            gap={2}
            p={1}
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
                variant="body1"
                fontWeight={"bold"}
                textTransform={"capitalize"}
              >
                Search Suggestion
              </Typography>
            </Stack>

            <Box>
              {/*close icon */}
              <IconButton onClick={handleCloseModalPeople}>
                <Tooltip title={"close"}>
                  <Close sx={{ width: 20, height: 20 }} />
                </Tooltip>{" "}
              </IconButton>
            </Box>
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
            }}
          >
            <Box display={"flex"} flexDirection={"column"} >
              {PeopleConnect?.map((person) => (
                  <FriendRequest key={person?._id} connect_request={person} />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPeople>
  );
};

export default PeopleModal;
