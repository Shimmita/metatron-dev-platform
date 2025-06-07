import {
  Smartphone
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Skeleton,
  styled,
  Typography
} from "@mui/material";


import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import devImage from "../../images/dev.jpeg";
import AlertGeneral from "../alerts/AlertGeneral";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomCountryName from "../utilities/CustomCountryName";
const SkillAvatars = lazy(() => import("./SkillAvatars"));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Sidebar = () => {
  const [openMobileApp, setOpenMobileApp] = useState(false);

  // redux sates
  const {
    isDarkMode,
    isSidebarRighbar,
    isTabSideBar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

  const { user } = useSelector((state) => state.currentUser);

  // screen width
  const screenWidth = window.screen.availWidth;


  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });


  // return the screen width in parentage for wider screens
  // to handle correct positioning issues with middle content feed
  
  const correctWidthInPercentage = () => {
    if (screenWidth > 1200 && screenWidth <= 1400) {
      return "21%";
    }

  };

  // fun to make the sidebar equidistant from the feed in relation to the rightbar
  // for larger screens like laptops above 1400
  const equidistantSidebar = (screen) => {
    if (screenWidth > 1400) {
      return "8%";
    }
  };

  
  return (
    <Box
      height={"90vh"}
      flex={CustomDeviceTablet() ? 1 : 2}
      p={CustomDeviceTablet() ? 1 : 2}
      marginLeft={equidistantSidebar()}
      sx={{
        display: {
          xs: "none",
          sm: CustomDeviceTablet()
            ? isSidebarRighbar && isTabSideBar
              ? "block"
              : "none"
            : "none",
          md: isSidebarRighbar ? "block" : "none",
          marginRight: CustomDeviceTablet() ? "6rem" : undefined,
        },
      }}
    >
      <Box
        position={"fixed"}
        className={'rounded'}
        width={correctWidthInPercentage()}
        maxHeight={"88vh"}
        sx={{
          border:"1px solid",
          borderColor:"divider",
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
        <Box width={CustomLandscapeWidest() ? 300 : undefined}>
          <Box bgcolor={"background.default"} className=" rounded">
            {isLoadingRequest ? (
              <Box width={"100%"}>
                <Box mb={1} display={"flex"} justifyContent={"center"}>
                  <Skeleton variant="circular" width={80} height={80} />
                </Box>
                <Skeleton variant="rectangular" height={"20vh"} />
              </Box>
            ) : (
              <BoxAvatarContent>
                <Box width={"100%"}>
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      flexDirection={'column'}
                      alignItems={"center"}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar
                          alt={user?.name?.split(" ")[0]}
                          src={
                            devImage
                          }
                          sx={{ width: 100, height: 100, mt: 1 }}
                        />
                      </StyledBadge>
                    <Box display={"flex"} justifyContent={"center"} >
                      <SkillAvatars user={user} isDarkMode={isDarkMode} />
                    </Box>
                  </Box>
                </Box>
              </BoxAvatarContent>
            )}
          </Box>

        {/* to add content here any */}
          
        </Box>
      </Box>

      {/* alert General for mobile app under development */}
      <AlertGeneral
        title={"Mobile App"}
        message={"Mobile application is still under development once completed by our esteemed software engineers, it will be rolled out."}
        openAlertGeneral={openMobileApp}
        setOpenAlertGenral={setOpenMobileApp}
        defaultIcon={<Smartphone/>}
      />
    </Box>
  );
};

export default Sidebar;
