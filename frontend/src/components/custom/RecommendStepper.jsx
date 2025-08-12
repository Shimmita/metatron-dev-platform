import { Avatar, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDeviceIsSmall from '../utilities/CustomDeviceIsSmall';
import { getImageMatch } from '../utilities/getImageMatch';



export default function RecommendStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataRecommend,setDataRecommend]=useState([])

  // redux store
  const { user } = useSelector((state) => state.currentUser);
  // extract user skills for backend posting
  const userSkills=user?.selectedSkills
  

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


    //fetch all insights from the backend
      useLayoutEffect(() => {
        if (dataRecommend.length>0) {
          return
        }
        // set is fetching to true
        setIsFetching(true);
    
        // performing get request
        axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/insights/all/recommendation`,userSkills, {
            withCredentials: true,
          })
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              setDataRecommend(res.data)
            }
          })
          .catch((err) => {
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "Server is unreachable "
              );
              return;
            }
            setErrorMessage(err?.response.data);
    
          })
          .finally(() => {
            // set is fetching to false
            setIsFetching(false);
          });
    }, [dataRecommend.length,userSkills]);

  return (
    <Box sx={{ maxWidth: 430 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {dataRecommend.map((data, index) => (
          <Step  key={data.label}>
            <StepLabel
            >
            {CustomDeviceIsSmall() ? (
              <Typography 
              variant='body2'
              fontWeight={'bold'}
              >
                {data.label}
              </Typography>
            ):(
              <Divider variant='middle'>
              <Typography 
              variant='body2'
              fontWeight={'bold'}
              >
                {data.label}
              </Typography>
              </Divider>
            )}
            </StepLabel>
            <StepContent sx={{ 
             width:'100%'
             }}>
            <ol style={{ 
              display:'flex',
              flexWrap:'wrap',
              justifyContent:"space-between",
               width:'100%',
               gap:5
             }}>
            {data?.description?.map(item=>(
                <React.Fragment>
                {data?.label?.includes('skill') ? (
                <Typography 
                key={item}
                display={'flex'}
                gap={1}
                mr={2}
                alignItems={'center'}
                variant='body2'>
                <Avatar
                alt={item}
                className="border"
                sx={{ width: 30, height: 30 }}
                src={getImageMatch(item)} />
                
                {/* text */}
                {item}
              </Typography>
                ):(
                <Typography 
                component={'li'}
                key={item}
                mr={3}
                variant='body2'>
                {item}
              </Typography>
                )}
            
            </React.Fragment>
            ))}
            </ol>
            
              <Box sx={{ mb: 2 }}>
                <Button
                disableElevation
                  size='small'
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1, borderRadius:'10px', fontSize:'x-small'}}
                >
                  {index === dataRecommend.length - 1 ? 'Done' : 'Next'}
                </Button>
                <Button
                disableElevation
                 size='small'
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1,fontSize:'x-small' }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === dataRecommend.length && (
        <>
          <Typography variant='caption'>you have reached the end of recommendation</Typography> 
          <br/>
          <Button disableElevation size='small' onClick={handleReset} sx={{ mt: 1, mr: 1,fontSize:'x-small' }}>
            Refresh
          </Button>
        </>
      )}
    </Box>
  );
}
