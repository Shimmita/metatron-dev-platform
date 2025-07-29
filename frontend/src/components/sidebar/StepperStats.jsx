import { Stack, StepLabel, Typography } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import CustomLandscapeWidest from '../utilities/CustomLandscapeWidest';

export default function StepperStats({dataInsights,isDarkMode,isFetching,errorMessage}) {
  return (
    <Stack  
    px={!CustomLandscapeWidest() && 1 }
    sx={{ width: '100%' }}>

      <Stepper  orientation='vertical'>
        {dataInsights?.map((insight) => (
          <Step key={insight} completed={2}>
          {/* stepper title */}
          <StepLabel>
          <Typography 
          variant='body2'
          color={!isDarkMode && 'primary'}
          fontWeight={'bold'}
          fontSize={'small'}
          >
            {insight.title}
          </Typography>
          </StepLabel>

          {/* stepper body */}
          <Typography 
          variant='caption'
           color={'text.secondary'}>
            {insight.details}
          </Typography>
          </Step>
        ))}
      </Stepper>
     
    </Stack>
  );
}
