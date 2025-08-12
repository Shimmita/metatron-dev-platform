import {
  AccessTimeFilledRounded,
  BalanceRounded,
  CalendarMonthRounded,
  LocationCityRounded,
  PaidRounded,
  PeopleRounded,
  WorkHistoryRounded
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import React from "react";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobLayoutHiring({ job, textOption = "",setIsApplicantsTable,setFocusedJob }) {
 
  // extracting contents in job
  const mandatorySkills = [...job?.skills];

  // handle date display
  const handleDateDisplay = () => {
    const parent = job?.createdAt?.split("T")[0]?.split("-");
    return `${parent[parent?.length - 1]}/${parent[parent?.length - 2]}/${
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
        : job?.location?.country;

    return finalName;
  };

   // close the applicants table
   const handleOpenApplicantsTable=()=>{
    // update the focused job to be assessed
    setFocusedJob(job)
    // triggers the display of job applicants table
    setIsApplicantsTable(true)
  }


  // format entry position level
  const handleEntryPosition = () => {
    if (job?.entry?.level?.split(" ")[0]?.includes("Entry")) {
      return `An ${job?.entry?.level?.split(" ")[0]}`;
    }
    return job?.entry?.level?.split(" ")[0];
  };

  return (
    <Stack
      justifyContent={"center"}
      mt={CustomDeviceIsSmall()?2:0.5}
      alignItems={"center"}
      classes={"job-card"}
      bgcolor={'background.default'}
      className="rounded"
      maxWidth={300}
      mb={2}
      height={
        !(CustomDeviceIsSmall() || CustomDeviceTablet()) ? "80%" : undefined
      }
      p={2}
      width={300}
      sx={{
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        alt=""
        className="border"
        sx={{ width: 42, height: 42, }}
        src={getImageMatch(job?.logo)}
      />

      {/* job title */}
      <Stack textAlign={"center"} gap={1} >
        <Box display={"flex"} justifyContent={"center"}>
          <Typography variant="body1" 
          color={"primary"} 
          fontWeight={"bold"} 
          sx={{ fontSize:'small' }}>
            {job?.title}
          </Typography>
        </Box>

        {/* hiring org */}
        <Box textAlign={"center"}
        >
          <Typography
            variant="body2"
            fontWeight={"bold"}
            textTransform={"capitalize"}
            color={"text.secondary"}
            sx={{ fontSize:'small' }}
          >
            {" "}
            {job?.organisation?.name}
          </Typography>
        </Box>

         <Box display={"flex"} justifyContent={"center"}>
        <AvatarGroup max={mandatorySkills?.length}>
        {/* loop through the skills and their images matched using custom fn */}
        {mandatorySkills?.map((skill) => (
            <Tooltip title={skill} key={skill} arrow>
            <Avatar
                alt={skill}
                className="border"
                sx={{ width: 30, height: 30 }}
                src={getImageMatch(skill)}
            />
            </Tooltip>
        ))}
        </AvatarGroup>
        </Box>

        {/* divider centered */}
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
        <Divider className="p-1 w-75" component={'div'}/>
        </Box>

        <React.Fragment>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <LocationCityRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
              {handleCountryName()} | {job.location.state}{" "}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <AccessTimeFilledRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
              Access {job?.jobtypeaccess?.access} | {job?.jobtypeaccess?.type}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <PaidRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"uppercase"} sx={{ fontSize:'small' }}>
              {job?.salary}
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <WorkHistoryRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"capitalize"} sx={{ fontSize:'small' }}>
              {job?.entry?.years}
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <BalanceRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" textTransform={"capitalize"} sx={{ fontSize:'small' }}>
              {handleEntryPosition()} Position Level
            </Typography>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <PeopleRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
              Current Applications {!(job?.website==="") ? "(N/A)":`${job?.applicants?.total}/200`}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <CalendarMonthRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }} >
              Date Uploaded {handleDateDisplay()}
            </Typography>
          </Box>
        </React.Fragment>
      </Stack>

      {/* control assessment */}

      {textOption === "Jobs Assessment" && (
        <Button
        variant={"contained"}
        color="primary"
        size="small"
        onClick={handleOpenApplicantsTable}
        disableElevation
        sx={{ borderRadius: "20px", fontWeight:'bold', my:1, width: "60%",fontSize:'x-small', textTransform:'capitalize', }}
        >
        Assess {job?.applicants?.total-job?.applicants?.assessed}
    </Button>
      )}


    </Stack>
  );
}

export default JobLayoutHiring;
