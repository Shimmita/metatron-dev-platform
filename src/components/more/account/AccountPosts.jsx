import { Box, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import MyPostContainer from "./post/MyPostContainer";
import { handleScrolledDown } from "../../../redux/AppUI";
import { useDispatch } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AccountPosts() {
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleScrolledDown(true));
  });

  // go back exact place on the home page
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  return (
    <Box height={"92vh"}>
      <IconButton onClick={handleHome}>
        <ArrowBack />
      </IconButton>
      <Typography variant="body1" gutterBottom style={{ textAlign: "center" }}>
        My Post
      </Typography>
      <Divider component={"div"} className="m-2" />
      <Box
        height={"82vh"}
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <MyPostContainer />
      </Box>
    </Box>
  );
}
