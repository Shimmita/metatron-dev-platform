import {
  AccessTimeRounded,
  BalanceRounded,
  BoltRounded,
  LocationCityRounded,
  OpenInBrowserRounded,
  PaidRounded,
  PeopleRounded,
  WbIncandescentRounded,
  WorkHistoryRounded,
} from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobLayout({ isDarkMode, job }) {
  const [openModal, setOpenApplyJobModal] = useState(false);

  const handleShowingApply = () => {
    setOpenApplyJobModal(true);
  };
  // extracting contents in job
  const mandatorySkills = [...job.skills];
  const websiteLink = job.website?.trim();

  // handle date display
  const handleDateDisplay = () => {
    const parent = job.createdAt?.split("T")[0]?.split("-");
    return `${parent[parent.length - 1]}/${parent[parent.length - 2]}/${
      parent[0]
    }`;
  };

  // handle country length to only two names and code label
  const handleCountryName = () => {
    const parent = job.location.country.split(" ");
    const countryCode = parent.pop();
    const finalName =
      parent.length > 2
        ? `${parent[0]} ${parent[1]} ${countryCode}`
        : job.location.country;

    return finalName;
  };

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      className={!CustomDeviceIsSmall() ? "rounded shadow py-3 mb-3" : "py-3"}
      gap={1}
    >
      <Avatar
        alt=""
        className="border"
        sx={{ width: 40, height: 40 }}
        src={getImageMatch(job.logo)}
      />

      {/* job title */}
      <Stack textAlign={"center"} gap={1}>
        <Box display={"flex"} justifyContent={"center"}>
          <Typography variant="body1" color={"primary"} fontWeight={"bold"}>
            {job.title}
          </Typography>
        </Box>

        {/* hiring org */}
        <Box textAlign={"center"}>
          <Typography
            gutterBottom
            variant="body2"
            fontWeight={"bold"}
            textTransform={"capitalize"}
            color={"text.secondary"}
          >
            {" "}
            {job.organisation.name}
          </Typography>
        </Box>

        {/* brief info */}
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <LocationCityRounded sx={{ width: 22, height: 22 }} />
          <Typography variant="body2">
            {handleCountryName()} | {job.location.state}{" "}
          </Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PaidRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2" textTransform={"uppercase"}>
            {job.salary}
          </Typography>
        </Box>

        <Box display={"flex"} gap={1} alignItems={"center"}>
          <BalanceRounded sx={{ width: 22, height: 22 }} />
          <Typography variant="body2" textTransform={"capitalize"}>
            {job.entry.level?.split(" ")[0]} Position Level
          </Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <WorkHistoryRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2" textTransform={"capitalize"}>
            {job.entry.years}
          </Typography>
        </Box>

        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PeopleRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">
            Current Applications {job.applicants.total}/500
          </Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <AccessTimeRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">
            Date Uploaded {handleDateDisplay()}
          </Typography>
        </Box>
      </Stack>

      {/* skills mandatory */}
      <Box mt={1}>
        <Box display={"flex"} justifyContent={"center"}>
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <WbIncandescentRounded
              sx={{ width: 20, height: 20 }}
              color="primary"
            />
            <Typography
              gutterBottom
              variant="body2"
              textAlign={"center"}
              color={"primary"}
              fontWeight={"bold"}
            >
              Mandatory Skills
            </Typography>
            <WbIncandescentRounded
              sx={{ width: 20, height: 20 }}
              color="primary"
            />
          </Box>
        </Box>

        <Box mt={1}>
          {mandatorySkills.map((val, index) => (
            <Typography
              key={index}
              gutterBottom
              variant="body2"
              component={"li"}
            >
              {val}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* application  btn */}
      {websiteLink === "" ? (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
          size="small"
          disableElevation
          onClick={handleShowingApply}
          endIcon={<BoltRounded />}
          sx={{ borderRadius: "20px", mb: 3 }}
        >
          View and Apply
        </Button>
      ) : (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
          size="small"
          disableElevation
          onClick={handleShowingApply}
          endIcon={<OpenInBrowserRounded />}
          sx={{ borderRadius: "20px", mb: 3 }}
        >
          View and Apply
        </Button>
      )}

      {/* show modal apply jobs */}
      <ApplyJobModal
        title={job.title}
        organisation={job.organisation}
        requirements={job.requirements}
        websiteLink={websiteLink}
        openApplyJobModal={openModal}
        setOpenApplyJobModal={setOpenApplyJobModal}
        jobID={job._id}
        jobaccesstype={job.jobtypeaccess}
      />
    </Stack>
  );
}

export default JobLayout;
