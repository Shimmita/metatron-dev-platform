import {
  AccessTimeFilledRounded,
  BalanceRounded,
  CalendarMonthRounded,
  LocationCityRounded,
  OpenInBrowser,
  PaidRounded,
  PeopleRounded,
  VerifiedRounded,
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
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getImageMatch } from "../../utilities/getImageMatch";
import { useSelector } from "react-redux";

function JobLayout({ isDarkMode, job, isPreviewHR=false }) {
  const [openModal, setOpenApplyJobModal] = useState(false);


  // redux states
    const { user } = useSelector((state) => state.currentUser);

  // extract user email, for checks if job posted by the user or not
  const {email}=user

  // if not true the false is default
  const isMyJob=email===job?.my_email || false

  const handleShowingApply = () => {
    setOpenApplyJobModal(true);
  };
  // extracting contents in job
  const mandatorySkills = [...job?.skills];
  const websiteLink = job?.website?.trim();

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
      alignItems={"center"}
      classes={"job-card"}
      className="rounded"
      maxWidth={300}
      mb={isMyJob? 0:2}
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
        sx={{ width: 42, height: 42, mt:isMyJob ? 4:isPreviewHR? 0:6 }}
        src={getImageMatch(job?.logo)}
      />

      {/* job title */}
      <Stack textAlign={"center"} gap={1} mt={1} mb={2}>
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

      {/* displayed is not previewHR, probably hr definitely their jobs*/}
      {!isPreviewHR && (
        <React.Fragment>
           {isMyJob ?(
        <Box display={'flex'} justifyContent={'center'}>
          <Typography textAlign={'center'} variant="caption" sx={{ color:'text.secondary', textTransform:'capitalize' }}> - you posted this job -</Typography>
        </Box>
      ):(
        <React.Fragment>
          {/* application  btn */}
      {websiteLink === "" ? (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          size="small"
          disableElevation
          className={"w-50"}
          endIcon={<VerifiedRounded />}
          disabled={job?.currentUserApplied}
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", mb: 1, width: "80%",fontSize:'small', textTransform:'capitalize' }}
        >
          {job?.currentUserApplied ? "Applied":"Apply Now"}
        </Button>
      ) : (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          className={"w-50"}
          size="small"
          disableElevation
          endIcon={<OpenInBrowser />}
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", mb: 1, width: "80%",fontSize:'small',textTransform:'capitalize' }}
        >
          Apply Now
        </Button>
      )}
        </React.Fragment>
      )}

      {/* show modal apply jobs */}
      {openModal && (
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
      )}
      
        </React.Fragment>
      )}
     
    </Stack>
  );
}

export default JobLayout;
