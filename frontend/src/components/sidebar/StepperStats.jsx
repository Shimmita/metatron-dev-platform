import { Stack, StepLabel, Typography } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import CustomLandscapeWidest from '../utilities/CustomLandscapeWidest';
import CustomDeviceIsSmall from '../utilities/CustomDeviceIsSmall';


export default function StepperStats({dataInsights}) {
  
  return (
    <Stack  
    px={!CustomLandscapeWidest() && 1 }
    sx={{ width: '100%' }}>

      <Stepper  
      orientation='vertical'>
        {dataInsights?.map((insight) => (
          <Step 
          key={insight.title} 
          completed={2}>
          {/* stepper title */}
          <StepLabel >
          <Typography 
          variant='body2'
          >
            {insight.title.substring(0,!CustomDeviceIsSmall() ? 30:undefined)}
          </Typography>
          </StepLabel>

          {/* stepper body */}
          <Typography 
          variant='caption'
           color={'text.secondary'}>
            {insight.details.substring(0,!CustomDeviceIsSmall() ? 41:undefined)}
          </Typography>
          </Step>
        ))}
      </Stepper>
     
    </Stack>
  );
}
