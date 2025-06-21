import {
  Add,
  BarChartOutlined,
  BarChartRounded,
  FavoriteBorderOutlined,
  FavoriteRounded,
  PersonAdd,
  SchoolRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Paper,
  Rating,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";
import { useDispatch } from "react-redux";
import pythonLogo from "../../../images/python.jpeg";
import video from "../../../video.mp4";
import CourseData from "../../data/CourseData";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import AccordionInstructor from "./AccordionInstructor";
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
    marginTop:12,
    marginBottom:20,
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

function CourseLayout({ isUploadedRequest }) {
  const [openAlertCourseStats, setOpenAlertCourseStats] = useState(false);
  // track video play state
  const [isPlay, setPlay] = useState(false);

  // handle playing state
  const handlePlay = () => {
    setPlay(true);
  };

  // handle showing of course Statistics
  const handleShowingCourseStats = () => {
    setOpenAlertCourseStats(true);
  };

  return (
    <Item 
    style={{
      display:'flex',
      flexDirection:'column',
      maxWidth:350,
      justifyContent:'center',
    }}>
      <Box>
        <video
          className="rounded w-100"
          src={video}
          controls
          onPlay={handlePlay}
          poster={pythonLogo}
          playsInline
          preload="none"
        >
        <Typography 
          color={"error"}>video not supported</Typography>
        </video>
      </Box>
      {/* title */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
        mb={1}
      >
        <Avatar alt="image" 
        src={pythonLogo} 
        sx={{ width: 26, height: 26 }} />
        <Typography 
        variant="body2" 
        color={'primary'}
        fontWeight={"bold"}>
          Python Django Full Course
        </Typography>
      </Box>

      {/* lectures + student */}
      <Box
        className="px-1"
        mb={1}
        display={"flex"}
        alignItems={"center"}
        gap={1}
        justifyContent={"space-between"}
      >
        {/* lectures */}
        <Box 
        display={"flex"}
        gap={1} 
        alignItems={"center"}>
          <SchoolRounded 
          color="primary" 
          sx={{ width: 15, height: 15 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10 lectures
          </Typography>
        </Box>

        {/* students */}
        <Box
        display={"flex"}
        gap={1} 
        alignItems={"center"}>
          <PersonAdd color="primary" sx={{ width: 16, height: 16 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10,000 students
          </Typography>
        </Box>

        {/* rating */}
        <Box display={"flex"} alignItems={"center"}>
          <Rating
            name="feedback"
            size="small"
            value={CourseData.rating}
            readOnly
            precision={0.5}
          />
        </Box>
      </Box>

      <Divider component={"div"} />
      {/* accordion instructor */}
      <Box>
        <AccordionInstructor
         instructor={CourseData.inst}
         />
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
        
          {/* purchase */}
          <Box
            mt={1}
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* add to favorite button */}
            <Box display={'flex'} alignItems={'center'} gap={0.5}>
            <Tooltip arrow title="favorite">
              <Checkbox
                icon={<FavoriteBorderOutlined
                  sx={{ width: 22, height: 22 }} />}
                  checkedIcon={
                  <FavoriteRounded
                    color="primary"
                    sx={{ width: 22, height: 22 }}
                  />
                }
              />
            </Tooltip>

            {/* counter of favorites */}
            <Typography
            variant="caption">
              3.5k
            </Typography>
            </Box>

            {/* enroll course button control */}
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"100%"}
            >
              <Button
                className="rounded-5"
                variant={'contained'}
                startIcon={<Add />}
                size="small"
                sx={{ 
                fontWeight: "bold",
                fontSize:'small' }}
                disableElevation
              >
                Enroll Free
              </Button>
            </Box>

            {/* statistics */}
            <Tooltip arrow title="statistics">
              <Checkbox
                icon={<BarChartOutlined sx={{ width: 22, height: 22 }} />}
                checkedIcon={
                  <BarChartRounded
                    color="primary"
                    sx={{ width: 22, height: 22 }}
                  />
                }
              />
            </Tooltip>
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
