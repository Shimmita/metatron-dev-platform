import { Box, Divider, Typography } from "@mui/material";
import React from "react";

function UserAbout() {
  return (
    <Box p={2}>
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Premium</Typography>
        <Typography variant="body2">Yes</Typography>
      </Box>
      <Divider component={"div"} className="p-2" />

      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Location</Typography>
        <Typography variant="body2">Nairobi,&nbsp;KE</Typography>
      </Box>
      <Divider component={"div"} className="p-2" />

      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Phone</Typography>
        <Typography variant="body2">0123456789</Typography>
      </Box>
      <Divider component={"div"} className="p-2" />
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Joined</Typography>
        <Typography variant="body2">12/01/2024</Typography>
      </Box>


      <Divider component={"div"} className="p-2" />
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Alias</Typography>
        <Typography variant="body2">@AlphaBoy</Typography>
      </Box>

      <Divider component={"div"} className="p-2" />
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="body2">Email</Typography>
        <Typography variant="body2">username@gmail.com</Typography>
      </Box>
    </Box>
  );
}

export default UserAbout;
