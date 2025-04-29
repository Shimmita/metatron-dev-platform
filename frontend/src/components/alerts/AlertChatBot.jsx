import { Close } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MachineLogo from "../../images/Ai.png";
import { handleCloseChatBot } from "../../redux/CurrentChatBot";
import { ChatBotLayout } from "../bot/ChatBotLayout";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// style ai avatar  badge
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertChatBot() {
  // redux states
  const { isOnline } = useSelector((state) => state.currentChatBot);
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const dispatch = useDispatch();
  const handleClose = () => {
    // close alert
    dispatch(handleCloseChatBot());
  };

  return (
      <Dialog
        open={isOnline}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description-bot"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,
          width:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97%"
              : undefined,
        }}
      >
        <DialogTitle
          display={"flex"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Box display={"flex"} gap={3} alignItems={"center"}>
            {/* ai logo */}
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={MachineLogo} alt="" sx={{ width: 32, height: 32 }} />
            </StyledBadge>
            {/* title */}
            <Box>
              <Typography
                gutterBottom
                fontWeight={"bold"}
                variant="body1"
                textTransform={"capitalize"}
              >
                Dynamo Doll
              </Typography>
              <Typography variant="body2" color={"text.secondary"}>
                AI Agent
              </Typography>
            </Box>
          </Box>

          {/* close button */}
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 20, height: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description-bot">
            <ChatBotLayout />
          </DialogContentText>
        </DialogContent>
      </Dialog>
  );
}
