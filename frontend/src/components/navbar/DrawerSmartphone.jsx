import {
  Avatar,
  Badge,
  Box,
  Drawer,
  styled
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import devImage from "../../images/dev.jpeg";
import SkillAvatars from "../sidebar/SkillAvatars";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";


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

const DrawerSmartphone = ({
  openDrawer,
  setOpenDrawer,
}) => {



  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);


  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });



  return (
    <Drawer open={openDrawer} onClose={(e) => setOpenDrawer(false)}>
      <Box maxWidth={300} height={"100%"} bgcolor={"background.default"}>
        <BoxAvatarContent>
          <Box>
            <Box width={"100%"} className={isDarkMode && "bg-dark rounded-top"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                className="p-1 pt-4"
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
                    alt={"user image"}
                    src={
                        devImage   
                    }
                    sx={{ width: 70, height: 70 }}
                  />
                </StyledBadge>
              </Box>
              <Box
                width={CustomLandscapeWidest() ? 300 : 250}
                display={"flex"}
                justifyContent={"center"}
                mt={1}
                pb={1}
              >
            
                  
              <SkillAvatars isDarkMode={isDarkMode} user={user} />
                
              </Box>
            </Box>
          </Box>
        </BoxAvatarContent>

        
      </Box>

     
    </Drawer>
  );
};

export default DrawerSmartphone;
