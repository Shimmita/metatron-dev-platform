import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleScrolledDown } from "../../redux/AppUI";
import PostCardDetails from "./PostCardDetails";
function PostDetailsContainer() {
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleScrolledDown(true));
  });
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  return (
    <Box height={"92vh"}>
      <Box display={"flex"} justifyContent={"center"}>
        {/* link to home */}
        <Link
          to={"/"}
          style={{ color: isDarkMode ? "#90CAF9" : " #1876D2" }}
          className="text-decoration-none fw-bold text-uppercase pt-2"
        >
          Back
        </Link>
      </Box>

      <Box
        height={"85vh"}
        pt={2}
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
        <PostCardDetails />
      </Box>
    </Box>
  );
}

export default PostDetailsContainer;
