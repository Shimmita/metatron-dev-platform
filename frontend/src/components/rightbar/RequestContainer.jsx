import { PeopleRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import React from "react";
import FriendRequest from "./layouts/FriendRequest";

export default function RequestContainer() {
  const screenWidth = window.screen.availWidth;
  // simulation of the items in the list
  const items = Array.from(new Array(3));

  // get the rightbar expanded appropritately
  const rightBarExpaned = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
    return;
  };

  return (
    <>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Typography
          display={"flex"}
          gap={5}
          pt={1}
          fontWeight={"bold"}
          color={"primary"}
        >
          <span>CONNECT REQUEST</span>
          <PeopleRounded />
        </Typography>
      </Box>
      <List
        className="rounded"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpaned(),
        }}
      >
        <Box>
          {items.map((item, index) => (
            <Box key={index}>
              <FriendRequest />
            </Box>
          ))}
        </Box>
      </List>
    </>
  );
}
