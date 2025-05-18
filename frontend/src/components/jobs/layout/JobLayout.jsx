import {
  AccessTimeFilledRounded,
  BalanceRounded,
  CalendarMonthRounded,
  LocationCityRounded,
  PaidRounded,
  PeopleRounded,
  VerifiedRounded,
  WbIncandescentRounded,
  WorkHistoryRounded,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobLayout({ isDarkMode, job, isOne = false }) {
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

  // format entry position level

  const handleEntryPosition = () => {
    if (job.entry.level?.split(" ")[0]?.includes("Entry")) {
      return `An ${job.entry.level?.split(" ")[0]}`;
    }
    return job.entry.level?.split(" ")[0];
  };

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      classes={"job-card"}
      className="rounded"
      maxWidth={300}
      mb={2}
      height={
        !(CustomDeviceIsSmall() || CustomDeviceTablet()) ? "70%" : undefined
      }
      p={2}
      width={300}
      sx={{
        border: !CustomDeviceIsSmall() && "1px solid",
        borderColor: !CustomDeviceIsSmall() && "divider",
        "&:hover": {
          boxShadow: `4px 0px 50px -10px inset ${
            !isDarkMode ? "#3333" : "lightgreen"
          }`,
        },
      }}
    >
      <Avatar
        alt=""
        className="border"
        sx={{ width: 42, height: 42, mt:8 }}
        src={getImageMatch(job.logo)}
      />

      {/* job title */}
      <Stack textAlign={"center"} gap={1} mt={1}>
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

        <React.Fragment>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <LocationCityRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2">
              {handleCountryName()} | {job.location.state}{" "}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <AccessTimeFilledRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">
              Access {job.jobtypeaccess.access} | {job.jobtypeaccess.type}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <PaidRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"uppercase"}>
              {job.salary}
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <WorkHistoryRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"capitalize"}>
              {job.entry.years}
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <BalanceRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" textTransform={"capitalize"}>
              {handleEntryPosition()} Position Level
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <PeopleRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">
              Current Applications {!(job.website==="") ? "(N/A)":`${job.applicants.total}/1000`}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <CalendarMonthRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">
              Date Uploaded {handleDateDisplay()}
            </Typography>
          </Box>
        </React.Fragment>
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

        <Box mt={1} mb={3} display={"flex"} justifyContent={"center"}>
          <AvatarGroup max={mandatorySkills?.length}>
            {/* loop through the skills and their images matched using custom fn */}
            {mandatorySkills?.map((skill) => (
              <Tooltip title={skill} key={skill} arrow>
                <Avatar
                  alt={skill}
                  className="border"
                  sx={{ width: 34, height: 34 }}
                  src={getImageMatch(skill)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
      </Box>

      {/* application  btn */}
      {websiteLink === "" ? (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          size="small"
          disableElevation
          endIcon={<VerifiedRounded />}
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", mb: 1, width: "80%" }}
        >
          Apply Now
        </Button>
      ) : (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          className={"w-75"}
          size="small"
          disableElevation
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", mb: 1, width: "80%" }}
        >
          Apply Now
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
        jobID={job?._id}
        salary={job?.salary}
        skills={job?.skills}
        jobaccesstype={job?.jobtypeaccess}
        location={job?.location}
        isFullView={true}
      />
    </Stack>
  );
}

export default JobLayout;
