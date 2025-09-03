import {
  CastForEducationRounded,
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
import { lazy, useState } from "react";
import pythonLogo from "../../../images/python.jpeg";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import CoursePlayer from "./CoursePlayer";
import { useSelector } from "react-redux";
const AccordionDescription = lazy(() => import("./AccordionDescription"));

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
  // gradient card background
  background: theme.palette.mode === "dark"
    ? "linear-gradient(145deg, #1a1a1a, #2c2c2c)"
    : "linear-gradient(145deg, #ffffff, #f5f7fa)",

  marginInline: !CustomDeviceIsSmall() && 6,
  marginBottom: 17,
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  borderRadius: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 4px 12px rgba(0,0,0,0.6)"
      : "0px 4px 12px rgba(0,0,0,0.15)",
}));

function CourseLayout({ isDarkMode = false, courseItem, setFocusedCourse }) {
  
  // redux state manager
  const { user } = useSelector((state) => state.currentUser);
  const isMyCourse=user?._id===courseItem?.course_instructor?.instructorId
  
  const handleOpenPlayer = () => {
   setFocusedCourse(courseItem)
  };
  
  return (
    <Item
      style={{
        display: "flex",
        flexDirection: "column",
        width: CustomDeviceIsSmall()
          ? 360
          : CustomDeviceTablet()
          ? 300
          : 340,
        justifyContent: "center",
        border: "1px solid",
        borderColor: isDarkMode ? "#2F2F2F" : "#E0E0E0",
      }}
    >
      {/* title + avatar with gradient overlay */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        bgcolor={'background.default'}
        alignItems={"center"}
        flexDirection={"column"}
        gap={1}
        mb={1}
        p={1}
        sx={{
          background: !isDarkMode &&  "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          
          borderRadius: 3,
          pb: 2,
        }}
      >
        <Avatar
          alt="image"
          sx={{
            width: 60,
            height: 60,
            border: "3px solid white",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          }}
          src={pythonLogo}
        />
        {/* title */}
        <Typography
          variant="body2"
          fontWeight={"bold"}
        >
          {courseItem?.course_title}
        </Typography>

        {/* rating */}
        <Box
          display={"flex"}
          gap={3}
          mb={1}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          {/* rating value */}
          <FormHelperText>
            {courseItem?.course_rate_count}
          </FormHelperText>

          {/* stars */}
          <Rating
            name="feedback"
            size="small"
            value={courseItem?.course_rate_count}
            readOnly
            precision={0.5}
          />

          {/* label */}
          <Box>
            <FormHelperText>
              {labels[courseItem?.course_rate_count]}
            </FormHelperText>
          </Box>
        </Box>
      </Box>

      <Divider component={"div"} />

      {/* lectures + student */}
      <Box
        className="px-1"
        mb={1}
        mt={2}
        display={"flex"}
        alignItems={"center"}
        gap={1}
        justifyContent={"space-around"}
      >
        {/* lectures */}
        <Box
          display={"flex"}
          gap={1}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <SchoolRounded color="primary" sx={{ width: 17, height: 17 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            {courseItem?.course_video_lectures?.length} lectures
          </Typography>
        </Box>

        <div />

        {/* students */}
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PersonAdd color="primary" sx={{ width: 18, height: 18 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            {courseItem?.student_count} students
          </Typography>
        </Box>
      </Box>

      <Divider component={"div"} />

      {/* instructor details */}
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-around"}
        my={1.4}
      >
        <Box display={"flex"} alignItems={"center"} gap={1.5}>
          {/* avatar */}
          <Avatar
            src={courseItem?.course_instructor?.instructorAvatar}
            alt=""
            sx={{ width: 28, height: 28 }}
          />
          {/* instructor name */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="caption"
              color={"text.primary"}
              sx={{ textTransform: "capitalize" }}
            >
              {courseItem?.course_instructor?.instructorName}
            </Typography>
          </Box>
        </Box>

        {/* occupation */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={1}
          alignItems={"center"}
        >
          <Typography variant="caption" color={"text.primary"}>
            {courseItem?.course_instructor?.instructorTitle}
          </Typography>
        </Box>
      </Box>

      <Divider component={"div"} />

      {/* description */}
      <Box>
        <AccordionDescription description={courseItem?.course_description} />
      </Box>

      <Divider component={"div"} />

        {/* enroll course button control */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          flexDirection={'column'}
          width={"100%"}
          mt={1.5}
          p={1}
        >
          {/* helper text, if they enrolled to continue learn */}
          {courseItem?.currentUserEnrolled? (
            <Box display={'flex'} justifyContent={'center'}>
            <FormHelperText className="text-success fw-bold">continue learning</FormHelperText>
            </Box>
          ):(
            <Box display={'flex'} justifyContent={'center'}>
            <FormHelperText>
            {isMyCourse ? 'you uploaded this course':'preview and enroll free'}
            </FormHelperText>
            </Box>
          )}
          
          {/* btn */}
          <Box display={"flex"} justifyContent={"center"}>
            {isMyCourse ? (
              <Button
              onClick={handleOpenPlayer}
              size="medium"
              className="rounded-5"
              variant={isDarkMode ? "outlined" : "contained"}
              startIcon={ courseItem?.currentUserEnrolled ? <VideoLibraryRounded/> : <CastForEducationRounded />}
              sx={{
                textTransform: "capitalize",
                background: !isDarkMode && "linear-gradient(180deg, #42a5f5,rgb(41, 99, 146))",
              }}
              disableElevation
            >
              Preview Your Course
            </Button>
            ):(
              <Button
              onClick={handleOpenPlayer}
              size="medium"
              className="rounded-5"
              variant={isDarkMode ? "outlined" : "contained"}
              startIcon={ courseItem?.currentUserEnrolled ? <VideoLibraryRounded/> : <CastForEducationRounded />}
              sx={{
                textTransform: "capitalize",
                background: !isDarkMode && "linear-gradient(180deg, #42a5f5,rgb(41, 99, 146))",
              }}
              disableElevation
            >
              {courseItem?.currentUserEnrolled ? "You Enrolled Learn":"Preview Course Free"}
            </Button>
            )}
          </Box>
        </Box>
    
    </Item>
  );
}

export default CourseLayout;
