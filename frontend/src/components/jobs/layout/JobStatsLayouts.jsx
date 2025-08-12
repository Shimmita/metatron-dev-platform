import { DeleteRounded, VerifiedRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetClearCurrentJobs } from "../../../redux/CurrentJobs";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobStatsLayout({ isDarkMode, job,user }) {

   // track axios progress
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch=useDispatch()

    // handle date display
    const handleDateDisplay = () => {
      const parent = job?.dateApplied?.split("T")[0]?.split("-");
      return `${parent[parent?.length - 1]}/${parent[parent?.length - 2]}/${
        parent[0]
      }`;
    };

    // handle the border color of the job stats
    const handleBorderColor=(job)=>{
      if (job?.viewedCV && job?.status==="proceed") {
        return  'border-success'
      } else if (job?.status==="rejected") {
        return "border-warning"
      }
    
    }

    // handle text color
    const handleTextColor=(job)=>{
      if ( job?.viewedCV && job?.status==="proceed") {
        return 'text-success'
      } else if (job?.status==="rejected" ) {
        return "text-warning"
      }
      
    }


    // handle the deletion of the job application
    const handleDeleteJobApplication=()=>{
      // track progress of the request
      setIsFetching(true)
      // delete request
      axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/delete/my/application/${user?._id}/${job?._id}`,{
              withCredentials: true,
            })
            .then((res) => {
               // reset and clear current jobs redux, this triggers api call to fetch 
              //  data from the backend since useEffect will be invoked
              dispatch(resetClearCurrentJobs())
            })
            .catch(async (err) => {
 
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
              //  log the error
              console.log(errorMessage)
            })
            .finally(() => {
              setIsFetching(false);
            });
    }


  return (
    <Box  
    className={`${handleBorderColor(job)} rounded-3`}
    height={CustomDeviceIsSmall() ? '57%':'81%'}
    mt={CustomDeviceIsSmall()?2:0.5}
    width={300}
    maxWidth={300}
    bgcolor={'background.default'}
    sx={{
      border: "1px solid",
      borderColor:"divider",
    }}>


    <Stack
      alignItems={"center"}
      classes={"job-card"}
      className="rounded my-3"     
    >
      <Avatar
        alt=""
        className="border"
        sx={{ width: 42, height: 42 }}
        src={getImageMatch(job?.logo)}
      />

      {/* job title */}
      <Stack textAlign={"center"} gap={1} mt={1} mb={1}>
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
      </Stack>

        <Button
        variant={isDarkMode ? "outlined" : "contained"}
        color="primary"
        size="small"
        disableElevation
        endIcon={<VerifiedRounded/>}
        disabled={job?.currentUserApplied}
        sx={{ borderRadius: "20px", width: "80%",fontSize:'small', textTransform:'capitalize' }}
      >
        Applied | {handleDateDisplay()}
      </Button>
    </Stack>

    {/* recruiter viewed the cv or not */}
    <Box display={'flex'}
     justifyContent={'center'}
      alignItems={'center'} 
      pt={1}
      pb={1}
      sx={{ borderTop:'1px solid',
        borderBottom:'1px solid',
        color:'divider' }}
    
    >
      <Typography 
      className={`${handleTextColor(job)}`} 
      variant="caption" 
      sx={{ fontSize:'small', color:!job?.viewedCV && 'text.secondary' }}>
        {job?.viewedCV ? "C.V viewed":"C.V not viewed"} | {job?.status}
      </Typography>
    </Box>

    {/* applicants status */}
    <Box width={'100%'}>
    {/* total applicants */}
    <Box display={'flex'} gap={1} justifyContent={'space-around'} alignItems={'center'} pl={1} pr={1} sx={{ borderBottom:'1px solid', color:'divider' }}>
      <Typography mt={1} variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>Total</Typography>
      
      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{job?.applicants?.total}</Typography>

      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{(job?.applicants?.total/job?.applicants?.total)*100} %</Typography>
    </Box>

    {/* male applicants */}
    <Box  display={'flex'} gap={1} justifyContent={'space-around'} alignItems={'center'} pl={1} pr={1} sx={{ borderBottom:'1px solid', color:'divider' }}>
      <Typography mt={1} variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>Male</Typography>
      
      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{job?.applicants?.male}</Typography>
      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{(job?.applicants?.male/job?.applicants?.total)*100} %</Typography>

    </Box>

    {/* female applicants */}
    <Box display={'flex'} gap={1} justifyContent={'space-around'} alignItems={'center'} pl={1} pr={1} sx={{ borderBottom:'1px solid', color:'divider' }}>
      <Typography mt={1} variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>Female</Typography>
      
      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{job?.applicants?.female}</Typography>

      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{(job?.applicants?.female/job?.applicants?.total)*100} %</Typography>

    </Box>

    {/* other applicants */}
    <Box display={'flex'} gap={1} justifyContent={'space-around'} alignItems={'center'} pl={1} pr={1} >
      <Typography mt={1} variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>Other</Typography>
      
      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{job?.applicants?.other}</Typography>

      <Typography variant="caption" fontSize={'small'} sx={{ color:'text.secondary' }}>{(job?.applicants?.other/job?.applicants?.total)*100} %</Typography>

    </Box>

    <Divider component={'div'} />

    {/* delete job */}
    <Box display={'flex'} justifyContent={'center'} mt={2}> 
    <Button size="small"
    disabled={isFetching}
    onClick={handleDeleteJobApplication}
     color="warning"
      variant="outlined" 
      sx={{ textTransform:'capitalize',borderRadius:5 }}>delete application</Button>
    </Box>
    </Box>
    </Box>

  );
}

export default JobStatsLayout;
