import { Box } from "@mui/material";
import React from "react";
import FriendsLayout from "./FriendsLayout";

function FriendsContainer() {
  // array simulate many people loading from db
  const items = Array.from({ length: 10 });
  return (
    <Box>{items.length > 0 && items.map((item, index) => <FriendsLayout />)}</Box>
  );
}

export default FriendsContainer;
