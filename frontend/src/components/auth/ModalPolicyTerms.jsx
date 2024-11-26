import { Close, GavelRounded, SecurityRounded } from "@mui/icons-material";
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
import React from "react";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import DataTermsPolicy from "../data/DataTermsPolicy";
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

const ModalPolicyTerms = ({
  openModalTerms,
  setOpenModalTerms,
  isShowPrivacy,
}) => {
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  return (
    <StyledModalEvent
      keepMounted
      open={openModalTerms}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomDeviceTablet() || CustomLandScape()
            ? "80%"
            : CustomLandscapeWidest()
            ? "50%"
            : "100%"
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
              {isShowPrivacy
                ? " Read Our Privacy and Policy"
                : " Read Terms of Service"}
            </Typography>

            {/*close icon */}
            <Tooltip title={"close"}>
              <IconButton onClick={(e) => setOpenModalTerms(false)}>
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
              <Box>
                <Box mb={1} display={"flex"} justifyContent={"center"}>
                  {isShowPrivacy ? (
                    <SecurityRounded
                      color="primary"
                      sx={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <GavelRounded
                      color="secondary"
                      sx={{ width: 40, height: 40 }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography
                    gutterBottom
                    fontWeight={"bold"}
                    variant="body2"
                    mb={1}
                    textAlign={"center"}
                  >
                    {isShowPrivacy ? "Privacy and Policy" : "Terms of Service"}
                  </Typography>

                  <ol>
                    {isShowPrivacy ? (
                      <>
                        {DataTermsPolicy &&
                          DataTermsPolicy.privacy.map((data, index) => (
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
                      </>
                    ) : (
                      <>
                        {DataTermsPolicy &&
                          DataTermsPolicy.terms.map((data, index) => (
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
                      </>
                    )}
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

export default ModalPolicyTerms;
