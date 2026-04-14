import {
  AutoAwesomeRounded,
  CastForEducationRounded,
  DoneRounded,
  LockRounded,
  MobileScreenShareRounded,
  PersonAdd,
  SchoolRounded,
  VideoLibraryRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { lazy, useState } from "react";
import { useSelector } from "react-redux";
import { appColors, appGradients } from "../../../utils/colors";
import pythonLogo from "../../../images/python.jpeg";
import AlertSimilarCourses from "../../alerts/AlertSimilarCourses";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
const AccordionDescription = lazy(() => import("./AccordionDescription"));

function CourseLayout({ isDarkMode = false, courseItem, setFocusedCourse }) {
  const theme = useTheme();
  
  // redux state manager
  const { user,isGuest } = useSelector((state) => state.currentUser);
  const isMyCourse=user?._id===courseItem?.course_instructor?.instructorId
  const [isOpenAccordion,setIsOpenAccordion]=useState(false)
  const [showSimilar,setShowSimilar]=useState(false)
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);
  
  
  const handleOpenPlayer = () => {
   setFocusedCourse(courseItem)
  };

  // handle showing similar courses suggestion
  const handleShowSimilarCourses=()=>{
    setShowSimilar(true)
  }

  // handle get course link
  const handleGetCourseLink=async()=>{
    const urlCourse=`${window.location.href}?id=${courseItem?._id}`
      try {
      await navigator.clipboard.writeText(urlCourse);
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
      justifyContent={"center"}
      gap={2}
      marginInline={!CustomDeviceIsSmall()?1:undefined}
      mb={2}
      flexDirection={'column'}
    >
      <Card
        elevation={0}
        sx={{ 
          border:'1px solid',
          borderColor:'divider',
          width: '100%',
          maxWidth: CustomDeviceTablet() ? 300 : 340,
          minWidth: 280,
          flexShrink: 0,
          borderRadius: `${theme.shape.borderRadius}px`,
          boxShadow: theme.palette.mode === "dark"
            ? "0 18px 36px rgba(0,0,0,0.18)"
            : "0 20px 40px rgba(15,76,129,0.08)",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(15,76,129,0.12), rgba(255,255,255,0.02))"
            : "linear-gradient(180deg, rgba(15,76,129,0.05), rgba(255,255,255,0.96))",
        }}
      >
        <CardContent>
          {/* Header section with blue background */}
          <Stack
            bgcolor={isDarkMode ? 'rgba(15,76,129,0.3)':'primary.main'}
            gap={0.5}
            sx={{
              borderRadius: `calc(${theme.shape.borderRadius}px - 4px)`,
              p: 1.5,
              boxShadow: theme.palette.mode === "dark"
                ? "inset 0 1px 0 rgba(255,255,255,0.04)"
                : "inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {/* Course logo/avatar */}
            <Box display={"flex"} justifyContent={"center"}>
              <Avatar
                alt="course logo"
                sx={{
                  width: 50,
                  height: 50,
                  border: "2px solid white",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                }}
                src={pythonLogo}
              />
            </Box>

            {/* title */}
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Typography
                variant="body1"
                textTransform={"capitalize"}
                fontWeight="bold"
                sx={{ color:'white', textAlign: 'center' }}
              >
                {courseItem?.course_title}
              </Typography>
            </Box>

            {/* rating */}
            <Box display={"flex"} gap={1} justifyContent={"center"} alignItems={"center"}>
              <Rating
                name="course-rating"
                size="small"
                value={courseItem?.course_rate_count}
                readOnly
                precision={0.5}
              />
              <Typography variant="caption" sx={{ color: 'white' }}>
                {courseItem?.course_rate_count?.toFixed(1)} ({courseItem?.course_rate_count})
              </Typography>
            </Box>
          </Stack>

          {/* Content section */}
          <Box mt={1.5}>
            {/* lectures + student */}
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              justifyContent={"space-around"}
              mb={1.5}
            >
              {/* lectures */}
              <Box display={"flex"} gap={1} justifyContent={"center"} alignItems={"center"}>
                <SchoolRounded color="primary" sx={{ width: 16, height: 16 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={"bold"}>
                  {courseItem?.course_video_lectures?.length} lectures
                </Typography>
              </Box>

              {/* students */}
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <PersonAdd color="primary" sx={{ width: 16, height: 16 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={"bold"}>
                  {courseItem?.student_count} students
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* instructor details */}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              my={1.5}
            >
              <Box display={"flex"} alignItems={"center"} gap={1}>
                {/* avatar */}
                <Avatar
                  src={courseItem?.course_instructor?.instructorAvatar}
                  alt=""
                  sx={{ width: 32, height: 32 }}
                />
                {/* instructor name */}
                <Box>
                  <Typography
                    variant="body2"
                    color={"text.primary"}
                    textTransform={"capitalize"}
                    fontWeight="bold"
                  >
                    {courseItem?.course_instructor?.instructorName}
                  </Typography>
                  <Typography variant="caption" color={"text.secondary"}>
                    {courseItem?.course_instructor?.instructorTitle}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* description */}
            <Box>
              <AccordionDescription 
                description={courseItem?.course_description}
                setOpenAccordion={setIsOpenAccordion}
              />
            </Box>

            <Divider />

            {/* Action buttons */}
            <Box 
              p={1}
              gap={1}
              alignItems={'center'}
              display={isOpenAccordion ? "none":'flex'}
              justifyContent={'center'}
            >
              {/* similar courses */}
              <Button 
                sx={{
                  fontSize:'small', 
                  textTransform:'capitalize' 
                }}
                onClick={handleShowSimilarCourses}
                size="small"
                startIcon={<AutoAwesomeRounded/>}
              >
                similar Courses
              </Button>
              <Divider component={'div'} orientation="vertical"/>
              {/* share courses */}
              <Button 
                sx={{
                  fontSize:'small', 
                  textTransform:'capitalize' 
                }}
                onClick={handleGetCourseLink}
                size="small"
                color={isCopiedStatus ? 'success':'primary'}
                startIcon={isCopiedStatus ? <DoneRounded/>:<MobileScreenShareRounded/>}
              >
                {isCopiedStatus ? "Link Copied":"Share Course"}
              </Button>
            </Box>

            <Divider />

            {/* enroll course button */}
            <Box
              display={isOpenAccordion ? "none":'flex'}
              justifyContent={"center"}
              flexDirection={'column'}
              width={"100%"}
              p={1}
            >
              {/* helper text */}
              <Box mb={1} display={'flex'} justifyContent={'center'}>
                <FormHelperText>
                  {isGuest ? "login and enroll free"
                  :isMyCourse ? 'you uploaded this course'
                  :'preview and enroll free'}
                </FormHelperText>
              </Box>
              
              {/* btn */}
              <Box display={"flex"} justifyContent={"center"}>
                {isMyCourse ? (
                  <Button
                    onClick={handleOpenPlayer}
                    size="small"
                    className="rounded-5"
                    disabled={isGuest}
                    variant={isDarkMode ? "outlined" : "contained"}
                    startIcon={<VideoLibraryRounded />}
                    sx={{
                      textTransform: "capitalize",
                      background: !isDarkMode && appGradients.primary,
                    }}
                    disableElevation
                  >
                    Preview Your Course
                  </Button>
                ):(
                  <Button
                    onClick={handleOpenPlayer}
                    size="small"
                    disabled={isGuest}
                    className="rounded-5"
                    variant={isDarkMode ? "outlined" : "contained"}
                    startIcon={<CastForEducationRounded />}
                    sx={{
                      textTransform: "capitalize",
                      background: !isDarkMode && appGradients.primary,
                    }}
                    disableElevation
                  >
                    {courseItem?.currentUserEnrolled ? "You Enrolled Learn":"Preview Course Free"}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* show similar courses alert */}
      {showSimilar && (
        <AlertSimilarCourses
          openSimilarCourses={showSimilar}
          setOpenSimilarCourses={setShowSimilar}
          courseId={courseItem?._id}
          isDarkMode={isDarkMode}
          courseName={courseItem?.course_title}
          setFocusedCourse={setFocusedCourse}
        />
      )}
    </Box>
  );
}

export default CourseLayout;
