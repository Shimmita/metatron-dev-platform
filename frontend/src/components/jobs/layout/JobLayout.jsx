import {
  AccessTimeFilledRounded,
  ArrowCircleRightRounded,
  BalanceRounded,
  CalendarMonthRounded,
  LocationOnRounded,
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
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApplyJobModal from "../../modal/ApplyJobModal";
import { getImageMatch } from "../../utilities/getImageMatch";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import axios from "axios";
import { updateCurrentJobs } from "../../../redux/CurrentJobs";

const MAX_APPLICANTS=300

function JobLayout_2({ 
  isDarkMode, 
  job,
  jobs,
  isPreviewHR=false,
  isLastIndex=false,
  setPageNumber,
  pageNumber,
  setErrorMessage

 }) {
  const [openModal, setOpenApplyJobModal] = useState(false);
  const [isFetching,setIsFetching]=useState(false)
  

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()


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


  // job has been paused or deactivated by the poster
  const isDeactivated=job?.status==="inactive"

  // check if job reached maxima number of applicants
  const isMaxApplicants=job?.applicants?.total>=MAX_APPLICANTS

 const handleFetchMoreData=()=>{
    // fetching to true
    setIsFetching(true)
    // axios api call to fetch more data
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/${user?._id}?page=${pageNumber}&limit=6`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          // more data update redux
          if (res.data.length>0) {
          dispatch(updateCurrentJobs([...jobs,...res.data]));  
          }
        } 

        // update the page number for the next fetch
        setPageNumber((prev)=>prev+1)
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }

  return (
    <Box 
      display={"flex"} 
      gap={3}
      // small devices should have column
      flexDirection={CustomDeviceIsSmall() ? 'column':'row'}
      justifyContent={"center"}
      mt={CustomDeviceIsSmall()?2:0.5}
      >
      {/* card, for job content */}
      <Card
        elevation={0}
        className="rounded-3"
        sx={{ 
        border:'1px solid',
        borderColor:'divider',
        width:CustomDeviceIsSmall() && !CustomDeviceSmallest() ? 320:300, 
        }}
      >
      {/* job avatar */}
    <Box 
    justifyContent={'center'}
    display={'flex'}>
      <Avatar
        alt=""
        className="border"
        sx={{ width: 45, height: 45, mt:isPreviewHR ? 0:3 }}
        src={getImageMatch(job?.logo)}
      />
      </Box>

      <Stack 
      gap={1} 
      mt={1} 
      >
      {/* job title */}
          <Typography variant="body1" 
          color={"primary"} 
          textAlign={'center'}
          fontWeight={"bold"} 
          sx={{ fontSize:'small' }}>
            {job?.title}
          </Typography>

  
          <Typography
          textAlign={'center'}
            variant="body2"
            fontWeight={"bold"}
            textTransform={"capitalize"}
            color={"text.secondary"}
            sx={{ fontSize:'small' }}
          >
            {" "}
            {job?.organisation?.name}
          </Typography>

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

          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <LocationOnRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
             {job.location.state} | {handleCountryName()}{" "}
            </Typography>
          </Box>
          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <AccessTimeFilledRounded sx={{ width: 19, height: 19}} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
              Access {job?.jobtypeaccess?.access} | {job?.jobtypeaccess?.type}
            </Typography>
          </Box>
          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <PaidRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"uppercase"} sx={{ fontSize:'small' }}>
              {job?.salary}
            </Typography>
          </Box>

          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <WorkHistoryRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" textTransform={"capitalize"} sx={{ fontSize:'small' }}>
              {job?.entry?.years}
            </Typography>
          </Box>

          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <BalanceRounded sx={{ width: 22, height: 22 }} />
            <Typography variant="body2" textTransform={"capitalize"} sx={{ fontSize:'small' }}>
              {handleEntryPosition()} Position Level
            </Typography>
          </Box>

          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <PeopleRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }}>
              Current Applications {!(job?.website==="") ? "(N/A)":`${job?.applicants?.total}/300`}
            </Typography>
          </Box>
          <Box ml={'15%'} display={"flex"} gap={2} alignItems={"center"}>
            <CalendarMonthRounded sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontSize:'small' }} >
              Date Uploaded {handleDateDisplay()}
            </Typography>
          </Box>
       
      </Stack>

      {/* displayed is not previewHR, probably hr definitely their jobs*/}
      {!isPreviewHR && (
        <React.Fragment>
           {isMyJob ?(
        <Box 
        mt={0.5}
        display={'flex'} 
        justifyContent={'center'}>
          <Typography textAlign={'center'} className="text-info" variant="caption" sx={{ textTransform:'capitalize' }}> - You Posted -</Typography>
        </Box>
      ):(
      
      <Box
      mt={1}
      justifyContent={'center'}
       display={'flex'}>
      {/* application  btn */}
      {websiteLink === "" ? (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          size="small"
          disableElevation
          className={"w-50"}
          endIcon={<VerifiedRounded />}
          disabled={job?.currentUserApplied || isMaxApplicants}
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", mb: 1, width: "80%",fontSize:'small', textTransform:'capitalize' }}
        >
          {job?.currentUserApplied ? "Applied":isDeactivated ? "Paused":isMaxApplicants ? "Closed":"Apply"}
        </Button>
      ) : (
       
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          className={"w-50"}
          size="small"
          disabled={isDeactivated}
          disableElevation
          endIcon={<OpenInBrowser />}
          onClick={handleShowingApply}
          sx={{ 
            borderRadius: "20px",
             mb: 1, 
             width: "80%",
             fontSize:'small',
             textTransform:'capitalize' }}
        >
          {isDeactivated ? "paused":"apply"}
        </Button>
        
      )}
      </Box>
      )}
    </React.Fragment>
      )}
    </Card>

    {/* next button zone, only if item is last index */}
   {isLastIndex && (
     <Box 
    alignItems={'center'}
    justifyContent={'center'}
    display={'flex'}>
    <IconButton 
    disabled={isFetching}
     onClick={handleFetchMoreData}
     size="small"
     sx={{ 
      border:'1px solid',
      borderColor:'divider'
      }}
     >
     {isFetching ? 
     <CircularProgress size={20}/>: 
     <ArrowCircleRightRounded
      color="primary"
       sx={{ width:28,height:28}}/>}
    </IconButton>
    </Box>
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
    </Box>
  );
}

export default JobLayout_2;
