import { Avatar, Stack, StepLabel, Typography } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import CourseIcon from '../utilities/CourseIcon';
import CustomDeviceIsSmall from '../utilities/CustomDeviceIsSmall';
import CustomLandscapeWidest from '../utilities/CustomLandscapeWidest';
import { getImageMatch } from '../utilities/getImageMatch';


export default function StepperStats({dataInsights}) {
  
  return (
    <Stack  
    px={!CustomLandscapeWidest() && 1 }
    sx={{ width: '100%' }}>

      <Stepper  
      orientation='vertical'>
        {dataInsights?.map((insight) => (
          <Step 
          sx={{
            m:0,
            p:0
          }}
          key={insight.title} 
          completed={2}>
          {/* stepper title */}
          <StepLabel >
          <Typography 
          ml={2}
          variant='body2'
          display={'flex'}
          fontWeight={'bold'}
          gap={1}
          alignItems={'center'}
          >
          
          {insight.title.split(" ")[0].includes("Multi") ?
          <CourseIcon option={insight.title.split(" ")[0]}/> :
          insight.title.split(" ")[0].includes("Backend")  ?
          <CourseIcon option={insight.title.split(" ")[0]}/>:
          <Avatar 
          sx={{width:24,height:24}} 
          src={getImageMatch(insight.title.split(" ")[0])} alt=''/>  }
          {insight.title.split(" ")[0]}
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
