import { Close, MoreVertRounded } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import AwsLogo from "../../images/aws.jpeg";
import DummyMessages from "../data/DummyMessages";

// input base
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const MessageDetailed = ({ handleMessageClicked }) => {
  const [reply, setReply] = React.useState("");

  // accessing the redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  return (
    <Box bgcolor={"background.default"} height={"99vh"}>
      {/* toolbar like */}
      <AppBar position="sticky" color="transparent">
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* avatar */}
          <Avatar sx={{ height: 34, width: 34 }} src={AwsLogo} alt="image" />
          {/* name of the sender */}
          <Typography
            variant="body2"
            fontWeight={"bold"}
            color="text.secondary"
          >
            Amazon Web Services
          </Typography>
          {/* close btn */}
          <IconButton onClick={handleMessageClicked} className="border">
            <Close sx={{ height: 17, width: 17 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* message body */}
      <Box
        p={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        height={"93vh"}
        gap={3}
      >
        <Box>
          {DummyMessages &&
            DummyMessages.map((val, index) => (
              <Box
                key={index}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                className="shadow p-3 rounded"
              >
                {val.editable ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Avatar
                      src={val.image}
                      alt={"image"}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography
                      width={"100%"}
                      textAlign={"center"}
                      variant="caption"
                      ml={3}
                      color={"text.secondary"}
                    >
                      {val.stamp}
                    </Typography>

                    <IconButton>
                      <MoreVertRounded sx={{ width: 17, height: 17 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box display={"flex"} alignItems={"center"}>
                    <Avatar
                      src={val.image}
                      alt={"image"}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography
                      width={"100%"}
                      textAlign={"center"}
                      variant="caption"
                      color={"text.secondary"}
                    >
                      {val.stamp}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    {val.message}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>

        <Box className="mx-1 rounded" bgcolor={!isDarkMode && "whitesmoke"}>
          {/* message input */}
          <StyledInputBase
            multiline
            fullWidth
            sx={{ padding: "20px" }}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="write message ..."
            inputProps={{ "aria-label": "search" }}
          />
          <Box display={"flex"} justifyContent={"flex-end"} mr={1}>
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: "20px", fontSize: "10px" }}
              >
                AI
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="success"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontSize: "10px",
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageDetailed;
