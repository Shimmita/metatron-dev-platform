import {
  AccessTimeFilledRounded,
  ArrowCircleRightRounded,
  BalanceRounded,
  CalendarMonthRounded,
  Done,
  LocationOnRounded,
  LockRounded,
  PaidRounded,
  PeopleRounded,
  TravelExploreRounded,
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
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobs } from "../../../redux/CurrentJobs";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import { getImageMatch } from "../../utilities/getImageMatch";

const MAX_APPLICANTS=500

function JobLayout_2({ 
  isDarkMode, 
  job,
  jobs,
  isPreviewHR=false,
  isLastIndex=false,
  setPageNumber,
  pageNumber,
  setErrorMessage,
  isJobSearchGlobal

 }) {
  const [openModal, setOpenApplyJobModal] = useState(false);
  const [isFetching,setIsFetching]=useState(false)
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);

  // redux states
  const { user,isGuest } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()


  // extract user email, for checks if job posted by the user or not
  const email=user?.email || ""

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
  const isMaxApplicants=job?.applicants?.total===MAX_APPLICANTS

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

  // handle getting of job link
  const handleGetJobLink=async()=>{
    const urlJob=`${window.location.href}?id=${job?._id}`
      try {
      await navigator.clipboard.writeText(urlJob);
      setIsCopiedStatus(true);
      setTimeout(() => {
      setIsCopiedStatus(false)
      }, 2000); 
    } catch (err) {
      console.error('Failed to Copy: ', err);
    }
  }

  return (
    <Box 
      display={"flex"} 
      gap={2}
      mb={isLastIndex && 3}
      // small devices should have column
      flexDirection={'column'}
      justifyContent={"center"}
      mt={CustomDeviceIsSmall()?2:0.5}
      >
      {/* card, for job content */}
      <Card
        elevation={0}
        className="rounded-3 shadow"
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
        sx={{ width: 45, height: 45, mt:isPreviewHR ? 0:1 }}
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
              Current Applications {!(job?.website==="") ? "(N/A)":`${job?.applicants?.total}/${job?.applicants_max || MAX_APPLICANTS}`}
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
      
      <Box
      mt={1}
      pb={2}
      justifyContent={'center'}
      width={'100%'}
      gap={1}
      flexDirection={'column'}
      display={'flex'}>
      {/* share the job */}
      <Box 
      display={'flex'} 
      justifyContent={'center'}>
      <Button
      onClick={handleGetJobLink}
      color={isCopiedStatus ? 'success':'primary'}
      startIcon={isCopiedStatus ? <Done/>:undefined} 
      sx={{
        borderRadius:'20px',
      fontSize:'small', 
      textTransform:'capitalize' }}
      size="small">
        {isCopiedStatus ? "Copied":"Share"}
      </Button>
      </Box>
      <Box 
      display={'flex'} 
      justifyContent={'center'}>
      {websiteLink === "" ? (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          size="small"
          disableElevation
          startIcon={isDeactivated || isMaxApplicants||isGuest ? <LockRounded/> :<VerifiedRounded />}
          disabled={job?.currentUserApplied || isMaxApplicants||isGuest}
          onClick={handleShowingApply}
          sx={{ borderRadius: "20px", fontSize:'small', textTransform:'capitalize' }}
        >
          {job?.currentUserApplied ? "Applied":isDeactivated ? "Paused":isMaxApplicants ? "Closed":"Apply Job"}
        </Button>
      ) : (
        <Button
          variant={isDarkMode ? "outlined" : "contained"}
          color="primary"
          size="small"
          disabled={isDeactivated||isGuest}
          disableElevation
          startIcon={isDeactivated || isGuest? <LockRounded/> :<TravelExploreRounded />}
          onClick={handleShowingApply}
          sx={{ 
            borderRadius: "20px",
            fontSize:'small',
            textTransform:'capitalize' }}
        >
          {isDeactivated ? "paused":"apply job"}
        </Button>
        
      )}
      </Box>
      </Box>
    </React.Fragment>
      )}
    </Card>

    {/* next button zone, only if item is last index */}
   {isLastIndex && !isJobSearchGlobal && !isGuest && (
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
        isMyJob={isMyJob}
        whitelist={job?.whitelist}
      />
      )}
    </Box>
  );
}

export default JobLayout_2;
