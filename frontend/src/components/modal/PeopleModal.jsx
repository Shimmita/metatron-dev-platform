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
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
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
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();

  // close the modal from redux by altering states to false and null data
  const handleCloseModalPeople = () => {
    dispatch(resetClearPeopleData());
  };
  return (
    <StyledModalPeople
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openPeopleModal}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomLandscapeWidest()
            ? "30%"
            : CustomDeviceIsSmall()
            ? "95%"
            : "85%"
        }
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        display={"flex"}
        className="rounded-1 border"
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
            <Box display={"flex"} flexDirection={"column"} gap={4}>
              {PeopleConnect &&
                PeopleConnect?.map((person, index) => (
                  <FriendRequest key={index} connect_request={person} />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPeople>
  );
};

export default PeopleModal;
