import {
  BarChartRounded,
  PersonAdd,
  SchoolRounded,
  VideoLibraryRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormHelperText,
  Paper,
  Rating,
  styled,
  Typography
} from "@mui/material";
import React, { lazy, useState } from "react";
import pythonLogo from "../../../images/python.jpeg";
import CourseData from "../../data/CourseData";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
const CourseStatsEditAlert = lazy(() =>
  import("../../alerts/CourseStatsEditAlert")
);
const AccordionDescription = lazy(() => import("./AccordionDescription"));
const AccordionLectures = lazy(() => import("./AccordionLectures"));

const labels = {
  0.5: "poor",
  1: "poor+",
  1.5: "fair",
  2: "fair+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    marginInline:!CustomDeviceIsSmall() && 6,
    marginBottom:17,
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

function CourseLayout({ isUploadedRequest,isDarkMode=false }) {
  const [openAlertCourseStats, setOpenAlertCourseStats] = useState(false);


  // handle showing of course Statistics
  const handleShowingCourseStats = () => {
    setOpenAlertCourseStats(true);
  };

  return (
    <Item 
    style={{
      display:'flex',
      flexDirection:'column',
      width:350, 
      justifyContent:'center',
      border:'1px solid',
      borderColor:isDarkMode ? '#2F2F2F' :'#E0E0E0' 
    }}>
    
      {/* title */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={'column'}
        gap={1}
        p={1}
      >
        <Avatar alt="image" 
        src={pythonLogo} 
        />
        {/* title */}
        <Typography 
        color={'primary'}
        variant="body2"
        textTransform={'uppercase'}
        fontWeight={"bold"}>
          Python Django Full Course
        </Typography>

           {/* rating */}
        <Box 
        display={"flex"} 
        gap={3} 
        mb={1}
        justifyContent={'space-around'}
        alignItems={"center"}>

        {/* rating value */}
        <FormHelperText>
          {CourseData.rating}
          </FormHelperText>
      
        {/* stars */}
          <Rating
            name="feedback"
            size="small"
            value={CourseData.rating}
            readOnly
            precision={0.5}
          />
          {/* label */}
          <Box>
          <FormHelperText>
          {labels[CourseData.rating]}
          </FormHelperText>
          </Box>
        </Box>
      </Box>

        {/* lectures + student */}
      <Box
        className="px-1"
        mb={1}
        display={"flex"}
        alignItems={"center"}
        gap={1}
        justifyContent={"space-around"}
      >
        {/* lectures */}
        <Box 
        display={"flex"}
        gap={1} 
        justifyContent={'space-around'}
        alignItems={"center"}>
          <SchoolRounded 
          color="primary" 
          sx={{ width: 17, height: 17 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10 lectures
          </Typography>
        </Box>

        <div/>

        {/* students */}
        <Box
        display={"flex"}
        gap={1} 
        alignItems={"center"}>
          <PersonAdd color="primary" sx={{ width: 18, height: 18 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10,000 students
          </Typography>
        </Box>
      </Box>   
    
    <Divider component={"div"} />

      {/* instructor details */}
        <Box 
      display={'flex'} 
      alignItems={'center'}
      justifyContent={'space-around'}
      my={1}
      >
      <Box display={'flex'} alignItems={'center'} gap={1} mr={4}>
        {/* avatar */}
          <Avatar src="" alt="" sx={{ width:27,height:27 }}/>
        {/* instructor name */}
        <Box display={'flex'} justifyContent={'center'}>
        <Typography variant="caption" color={'text.primary'}> Alexis Damian</Typography>   
        </Box> 
      </Box>

      <div/>

        {/* occupation */}
        <Box display={'flex'} justifyContent={'center'}>
        <Typography variant="caption" color={'text.primary'}> Software Engineer</Typography> 
        </Box>
      </Box>

     

      <Divider component={"div"} />
      {/* description */}
      <Box>
        <AccordionDescription description={CourseData.description} />
      </Box>

      <Divider component={"div"} />
      {/* what lectures accordion */}
      <Box>
        <AccordionLectures lectures={CourseData.leactures} />
      </Box>

      <Divider component={"div"} />

      {/* layout inquiry is an instructor checking their uploaded course */}
      {isUploadedRequest ? (
          <Box display={"flex"} justifyContent={"center"} mb={1}>
            <Button
              size="small"
              startIcon={<BarChartRounded />}
              variant="outlined"
              className="rounded-5"
              onClick={handleShowingCourseStats}
              sx={{ textTransform: "capitalize" }}
            >
              View Course Statistics
            </Button>
          </Box>
      ) : (
        <React.Fragment>
        
          <Box
            mt={1}
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
          

            {/* enroll course button control */}
            <Box
              display={"flex"}
              justifyContent={"center"}
              flexDirection={'column'}
              width={"100%"}
              gap={1}
              p={1}
            >
            {/* helper text for certification */}
            <Box
            display={'flex'} 
            justifyContent={'center'}>
            <FormHelperText className={isDarkMode ? "text-info":"text-success"}>
              Unlock Certificate of Completion at $2
            </FormHelperText>
            </Box>
            {/* btn */}
            <Box
             display={'flex'} 
            justifyContent={'center'}
            >
              <Button
                className="rounded-5"
                variant={isDarkMode ? "outlined":"contained"}
                startIcon={<VideoLibraryRounded />}
                size="small"
                sx={{ 
                width:'80%', 
                fontWeight: "bold",
                fontSize:'small' }}
                disableElevation
              >
                Enroll Course
              </Button>
              </Box>

            </Box>

          </Box>
          {/* empty box for spacing */}
        </React.Fragment>
      )}

      {/* show all course statistics alert */}
      {openAlertCourseStats && (
        <CourseStatsEditAlert
        openAlertCourseStats={openAlertCourseStats}
        setOpenAlertCourseStats={setOpenAlertCourseStats}
      />
      )}
      
    </Item>
  );
}

export default CourseLayout;
