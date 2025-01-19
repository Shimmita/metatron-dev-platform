import {
  CalendarMonthRounded,
  EmailRounded,
  LaptopRounded,
  LocationOnRounded,
  PhoneRounded,
} from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import React from "react";

function UserAbout({ profileData }) {
  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

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
        <Typography variant="body2">
          {" "}
          {profileData?.specialisationTitle}
        </Typography>
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
        <Typography variant="body2">
          {profileData && handleCountryName(profileData?.country)},
          {profileData?.county}
        </Typography>
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
        <Typography variant="body2">{profileData?.phone}</Typography>
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
        <Typography variant="body2">
          {profileData?.createdAt?.split("T")[0]}
        </Typography>
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
        <Typography variant="body2">{profileData?.email}</Typography>
      </Box>
    </Box>
  );
}

export default UserAbout;
