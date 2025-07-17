import {
  Close,
  PeopleRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import DataAccounts from "../data/DataAccounts";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

const StyledModalEvent = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const ModalAccountInfo = ({ openModalInfo, setOpenModalInfo }) => {
  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
 // update is dark const
  const isDarkMode=currentMode==='dark'

  // modal width
  const handleModalWidth=()=>{
    if (CustomDeviceTablet()||CustomLandScape()) {
      return "80%"
    }
    if (CustomLandscapeWidest()) {
      return "50%"
    }

    return "100%"
  }

  return (
    <StyledModalEvent
      keepMounted
      open={openModalInfo}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          handleModalWidth()
        }
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={5}
          className="shadow-lg "
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box>
              <Avatar sx={{ width: 60, height: 60 }} src={AppLogo} alt="logo" />
            </Box>

            <Typography variant="body1" color={"primary"} fontWeight={"bold"}>
              Help Information
            </Typography>

            {/*close icon */}
            <Tooltip title={"close"}>
              <IconButton onClick={(e) => setOpenModalInfo(false)}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>

          {/* divider */}
          <Divider component={"div"} className="p-2 border-success" />

          <Box
            maxHeight={CustomModalHeight()}
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
              className="p-1"
              display={"flex"}
              flexDirection={"column"}
              gap={2}
            >
              {/* personal account */}
              <Box mb={1}>
                <Box display={"flex"} justifyContent={"center"}>
                  <PeopleRounded color="primary" sx={{ width: 36, height: 36 }} />
                </Box>
                <Box>
                  <Typography
                    gutterBottom
                    fontWeight={"bold"}
                    variant="body2"
                    mb={1}
                    textAlign={"center"}
                  >
                    Registered Account
                  </Typography>

                  <ol>
                    {
                      DataAccounts?.Personal.map((data, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          gutterBottom
                          mb={1}
                          component={"li"}
                          color={"text.secondary"}
                        >
                          {data}
                        </Typography>
                      ))}
                  </ol>
                </Box>
              </Box>

              
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalEvent>
  );
};


export default ModalAccountInfo;
