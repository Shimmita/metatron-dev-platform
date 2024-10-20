import {
    CalendarMonthRounded,
    EmailRounded,
    LaptopRounded,
    LocationOnRounded,
    PhoneRounded,
} from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import React from "react";

function MyPostAbout() {
  return (
    <Box p={2}>
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography
          alignItems={"center"}
          display={"flex"}
          gap={1}
          variant="body2"
        >
          {" "}
          <LaptopRounded sx={{ width: 20, height: 20 }} /> Specialty
        </Typography>
        <Typography variant="body2">Software Engineer</Typography>
      </Box>

      <Divider component={"div"} className="p-2" />

      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography
          alignItems={"center"}
          display={"flex"}
          gap={1}
          variant="body2"
        >
          {" "}
          <LocationOnRounded sx={{ width: 20, height: 20 }} /> Location
        </Typography>
        <Typography variant="body2">Nairobi,&nbsp;KE</Typography>
      </Box>
      <Divider component={"div"} className="p-2" />

      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography
          alignItems={"center"}
          display={"flex"}
          gap={1}
          variant="body2"
        >
          {" "}
          <PhoneRounded sx={{ width: 20, height: 20 }} /> Phone
        </Typography>
        <Typography variant="body2">0123456789</Typography>
      </Box>
      <Divider component={"div"} className="p-2" />
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography
          display={"flex"}
          alignItems={"center"}
          gap={1}
          variant="body2"
        >
          <CalendarMonthRounded sx={{ width: 20, height: 20 }} />
          Joined
        </Typography>
        <Typography variant="body2">12/01/2024</Typography>
      </Box>

      <Divider component={"div"} className="p-2" />
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Typography
          display={"flex"}
          alignItems={"center"}
          gap={1}
          variant="body2"
        >
          <EmailRounded sx={{ width: 20, height: 20 }} />
          Email
        </Typography>
        <Typography variant="body2">username@gmail.com</Typography>
      </Box>
    </Box>
  );
}

export default MyPostAbout;
