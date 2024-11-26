import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetDefaultBottomNav } from "../../../redux/AppUI";
import MyPostProfile from "./post/MyPostProfile";

export default function AccountPosts() {
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetDefaultBottomNav(true));
  });

  return (
    <Box>
      <MyPostProfile />
    </Box>
  );
}
