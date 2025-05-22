import { BarChartRounded, VerifiedRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobStatsLayout({ isDarkMode, job, isOne = false }) {

    // handle date display
    const handleDateDisplay = () => {
      const parent = job?.dateApplied?.split("T")[0]?.split("-");
      return `${parent[parent?.length - 1]}/${parent[parent?.length - 2]}/${
        parent[0]
      }`;
    };

  return (
    <Box  
    className={`${job?.viewedCV && 'border-success'} rounded`}
    height={
      '64%'
    }
    width={300}
    maxWidth={300}

    sx={{
      border: !CustomDeviceIsSmall() && "1px solid",
      borderColor: !CustomDeviceIsSmall() && !job?.viewedCV && "divider",
      "&:hover": {
        boxShadow: `4px 0px 50px -10px inset ${
          !isDarkMode ? "#3333" : "lightgreen"
        }`,
      },
    }}>

      <Box display={'flex'} justifyContent={'flex-end'} mb={1}>
        <BarChartRounded sx={{ width:20,height:20 }}/>
      </Box>

    <Stack
      alignItems={"center"}
      classes={"job-card"}
      className="rounded mb-2"     
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
      textAlign={'center'}
      className={`${job?.viewedCV && 'text-success'}`} 
      variant="caption" 
      sx={{ fontSize:'small', color:!job?.viewedCV && 'text.secondary' }}>
        {job?.viewedCV ? "- your c.v viewed -":"- your c.v not viewed -"}
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

    </Box>

    
    </Box>

  );
}

export default JobStatsLayout;
