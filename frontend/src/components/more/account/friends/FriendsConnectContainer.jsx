import { Box } from "@mui/material";
import React from "react";
import FriendsConnectLayout from "./FriendsConnectLayout";

function FriendsConnectContainer() {
  // array simulate many people loading from db
  const items = Array.from({ length: 10 });
  return (
    <Box>
      {items.length > 0 && items.map((item, index) => <FriendsConnectLayout />)}
    </Box>
  );
}

export default FriendsConnectContainer;
