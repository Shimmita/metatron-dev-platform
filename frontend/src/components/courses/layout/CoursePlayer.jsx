import { Close, Delete, InfoRounded, Lock, PrintRounded, VideoLibraryRounded } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Rating,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentCourses } from "../../../redux/CurrentCourses";
import { updateCurrentSnackBar } from "../../../redux/CurrentSnackBar";
import AlertGeneral from "../../alerts/AlertGeneral";
import PaymentCertDialog from "./PaymentCertDialog";

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

const CoursePlayer = ({ course:courseItem, openPlayer, setFocusedCourse }) => {

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  
  const dispatch=useDispatch()

  const [course,setCourse]=useState(courseItem)

  const isMyCourse=user?._id===course?.course_instructor?.instructorId


  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [openMobileRate,setOpenMobileRate]=useState(false)
  const [openPaymentCertDialog,setOpenPaymentCertDialog]=useState(false)

  const [currentVideo, setCurrentVideo] = useState(
    course.course_video_lectures?.[0] || null
  );

  const [ratingValue,setRatingValue]=useState(course?.currentUserRating || 0)

  // handle screen responsiveness
  const theme = useTheme();
  const isMobileTab = useMediaQuery(theme.breakpoints.down("md")); // tabs and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // smartphones and below

  const handleClose = () => setFocusedCourse(null);

  const handleVideoChange = (video) => setCurrentVideo(video);


  // handle course enrollment
  const handleEnrollCourse=()=>{
    
    // user must pre-rate the course before enrollment
    if (ratingValue===0) {
      setErrorMessage(`Please pre-rate the course to unlock the full ${course.course_video_lectures.length} course lectures intended to get enrolled.`)
      setOpenMobileRate(true)
      return
    }
    // course object
    const courseObject={
      userId:user?._id,
      courseId:course?._id,
      ratingValue,
    }

    // fetching or processing state
    setIsFetching(true)

    // axios post request for course enrollment
     axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/enroll`,courseObject, {
                  withCredentials: true,
      })
      .then((res) => {
        // update the redux of courses by clearing, will trigger refetch
        if (res?.data) {
          
          // update the success status
          dispatch(updateCurrentSnackBar(res.data.message))

          // update the course Item, with the item from the backend
          setCourse(res.data.data)

          // update the redux for course current courses, 12 items returned from backend
          dispatch(updateCurrentCourses(res.data.results))

          // open payment dialog
          setOpenPaymentCertDialog(true)
        } 
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
        // false opening payment dialog
        setOpenPaymentCertDialog(false)
      })
      .finally(() => {
        setIsFetching(false);
      });

  }


    // handle the number of lectures for preview
    const handleCourseLecturesPreview=()=>{
   
      if (isMyCourse) {
        // course owner views all lectures
        return course.course_video_lectures.length 
      }else{
      // user not enrolled, return minimized lectures
      if (!courseItem?.currentUserEnrolled) {
         if (course.course_video_lectures.length<3 ) {
        return 1
      }
      else return 2
      }

      // user enrolled return full course lectures
      return course.course_video_lectures.length 
      }

    }

  // handle get certificate, let users pay via paypal or any 
  // supported payment gateways.
  const handleGetCertificate=()=>{
    
    // let the users must final rating of the course
    if (ratingValue===0) {
      setErrorMessage("Please complete final rating of the course to help us in improving our tech courses offered to the community.")
      setOpenMobileRate(true)
      return
    }

    const courseObject={
      userId:user?._id,
      courseId:course?._id,
      ratingValue
    }

    // handle rating first before continuation to payment
    setIsFetching(true)

    // axios patch request, to update the rating state of the course
     axios.patch(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/rating`,courseObject, {
                  withCredentials: true,
      })
      .then((res) => {
        // update the redux of courses by clearing, will trigger refetch
        if (res?.data) {
          
          // update the success status
          dispatch(updateCurrentSnackBar(res.message))

          // updated course obj from the backend
          setCourse(res.data.data)

          // trigger show an alert for payment gateways here
          setOpenPaymentCertDialog(true)
        } 
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
      })
      .finally(() => {
        setIsFetching(false);
      });
  }


  // handle printing of the certificate
  const handlePrintCertificate=()=>{
    setOpenPaymentCertDialog(true)
  }

  // handle deleting of the course
  const handleDeleteCourse=()=>{

    // fetching true
    setIsFetching(true)

    // axios patch request, to update the rating state of the course
     axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/delete/instructor/${user?._id}/${courseItem?._id}`, {
       withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {

          // update the success status
          dispatch(updateCurrentSnackBar(res.data))

          // set focused course to null for clearing dialog
          setFocusedCourse(null)
        } 
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
      })
      .finally(() => {
        setIsFetching(false);
      });
  }

  return (
    <Box bgcolor={'background.default'}>
      {/* Dialog for Player */}
      <Dialog
        sx={{ backdropFilter: "blur(3px)"}}
        open={openPlayer}
        fullScreen
        keepMounted
        fullWidth
        maxWidth="lg"
        
      >
      <Box
      bgcolor={'background.default'}
      sx={{
        overflow: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
      >

        <DialogTitle>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        {/* course title */}
          <Typography width={'100%'} textAlign={'center'}  variant={isMobile ? "body1":"h6"} textTransform={'capitalize'} fontWeight={'bold'} color={'primary'}>{course.course_title}</Typography>

          {/* close icon */}
          <Tooltip title='close' arrow>
          <IconButton 
          onClick={handleClose}
          sx={{ 
            border:'1px solid',
            borderColor:'divider'
          }}
          >
            <Close sx={{ 
              width:15,
              height:15,
            }}/>
          </IconButton>
          </Tooltip>
          </Box>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
              <Avatar
                src={course.course_instructor.instructorAvatar}
                alt={course.course_instructor.instructorName}
              />
            
            <Typography 
            variant="body2" 
            color="text.secondary" 
            textTransform={'uppercase'}
           > 
              Instructor | {course.course_instructor.instructorName} | {isMobileTab && <br/>} {" "}
              {course.course_instructor.instructorTitle} 
            </Typography>
          </Box>
        </DialogTitle>
    
        <DialogContent dividers={isMobileTab} >
          <Box
            display="flex"
            flexDirection={isMobileTab ? "column" : "row"}
            gap={3}
      
          >
            {/* Left: Video Player */}
            <Box flex={3} p={1} border={'1px solid'} borderColor={'divider'} borderRadius={2}>
              {currentVideo ? (
                <video
                  key={currentVideo.video_lectureID}
                  controls
                  width="100%"
                  style={{ borderRadius: "10px" }}
                  src={currentVideo.video_lecture_link}
                />
              ) : (
                <Typography>No video available</Typography>
              )}

              {/* topics on large devices only */}
              {!isMobileTab && (
                <Stack gap={1}>
                 {/* accordion lectures */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Lectures</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {course.course_video_lectures.slice(0,handleCourseLecturesPreview()).map((video, idx) => (
                        <ListItemButton
                          key={video.video_lectureID}
                          selected={
                            currentVideo?.video_lectureID === video.video_lectureID
                          }
                          onClick={() => handleVideoChange(video)}
                        >
                          <ListItemText primary={`Lecture ${idx + 1}`} />
                        </ListItemButton>
                      ))}
                    </List>

                    
                     {/* locked lectures, if user not enrolled */}
                  {!courseItem?.currentUserEnrolled && !isMyCourse && (
                    <Box 
                    mt={1}
                    display={'flex'} 
                    justifyContent={'center'}                  
                    >
                    <Typography display={'flex'} gap={2} alignItems={'center'} pt={2} variant="body2" color={'text.secondary'}>
                    {/* lock */}
                    <Lock sx={{ width:15,height:15 }}/>
                      {/* text */}
                      Enroll to Unlock {course.course_video_lectures.length} Lectures

                      {/* lock */}
                      <Lock sx={{ width:15,height:15 }}/>
                    </Typography>
                    </Box>
                  )}

                  </AccordionDetails>
                </Accordion>

                  <Accordion className="mt-1">
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Topics</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                {course.course_video_topics.slice(0,handleCourseLecturesPreview()).map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={
                      <Typography variant="body2">{topic}</Typography>
                    } />
                  </ListItem>
                ))}
              </List>

                {/* locked topics, if user not enrolled */}
                    {!courseItem?.currentUserEnrolled && !isMyCourse && (
                      <Box 
                      mt={1}
                      display={'flex'} 
                      justifyContent={'center'}                  
                      >
                      <Typography display={'flex'} gap={2} alignItems={'center'} pt={2} variant="body2" color={'text.secondary'}>
                      {/* lock */}
                      <Lock sx={{ width:15,height:15 }}/>
                        {/* text */}
                        Enroll to view the full {course.course_video_topics.length} topics

                        {/* lock */}
                        <Lock sx={{ width:15,height:15 }}/>
                      </Typography>
                      </Box>
                    )}

                  </AccordionDetails>
                </Accordion>
                </Stack>
              
              )}
              
            </Box>

            {/* Right: Lecture List */}
            <Box
            flex={1} border={'1px solid'} 
            borderColor={'divider'} 
            borderRadius={2} >
              {!isMobileTab ? (
                <React.Fragment>
            
                 {/* course description */}
                <Card className="mb-2">
                  <CardContent>
                  <Typography variant="body1">
                    Course Description
                  </Typography>

                    <Typography  mt={1} width={300} variant="caption">
                    {course?.course_description}
                    </Typography>                   
                  </CardContent>
                  </Card>

                  {/* course Rating */}
                  <Card className="mb-2">
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        Course Full Rating
                      </Typography>
                      <Box display={'flex'} gap={2} alignItems={'center'}>
                      {/* stars */}
                        <Rating
                          name="feedback"
                          size="medium"
                          value={course?.course_rate_count}
                          readOnly
                          precision={0.5}
                        />

                        {/* message rating */}
                        <Box>
                          <Typography variant="body2" color={'text.secondary'}>
                          {labels[course?.course_rate_count]}
                           </Typography>
                        </Box>
                        </Box>

                        <Divider className="p-1"/>

                        <Typography mt={1} variant="body1" gutterBottom>
                        {course?.currentUserEnrolled ? "My Final Rating":"My Pre-Rating Status"} 
                      </Typography>
                       <Box display={'flex'} gap={2} alignItems={'center'}>
                       {/* star rate */}
                        <Rating
                          name="myRating"
                          readOnly={isMyCourse}
                          size="medium"
                          value={ratingValue}
                          onChange={(event,value)=>setRatingValue(value)}
                        />

                        {/* message rating */}
                        <Box>
                          <Typography variant="body2" color={'text.secondary'}>
                          {labels[ratingValue]}
                          </Typography>
                        </Box>

                        </Box>
                        <Box>
                        <Typography mt={1} variant="caption" gutterBottom>
                        {course?.currentUserEnrolled ? `Based on the ${handleCourseLecturesPreview()} ${handleCourseLecturesPreview()<=1 ?"lecture":"lectures"} what's your final course rating, 
                      help us improve our tech content.`:`Based on the ${handleCourseLecturesPreview()} ${handleCourseLecturesPreview()<=1 ?"lecture":"lectures"} what's your rating, 
                      help us improve our courses and tech content in general.`}
                      
                      </Typography>
                      </Box>
                    </CardContent>
                  </Card>


                  {/* course Rating */}
                  <Card className="mb-2">
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        Students Enrolled
                      </Typography>

                      <Typography variant="body2">
                        {course.student_count} Students
                      </Typography>
                        
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-2">
                  <CardContent>

                  {isMyCourse ? (
                    <Stack gap={1}>
                    <Typography variant="body1" gutterBottom>
                    Course Deletion
                  </Typography>

                  {/* btn delete */}
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={handleDeleteCourse}
                  endIcon={isFetching ? <CircularProgress size={14}/>:<Delete/>}
                  variant="contained"
                  color="warning"
                  size="medium"
                  sx={{ borderRadius:3 }}>
                  Delete Full Course
                  </Button>

                    </Stack>
                  ):(
                  <Box>
                    <Typography variant="body1">
                    {course?.currentUserEnrolled ? "Course Certification" :"Course Enrollment"} 
                  </Typography>
                  
                     {/* certificate of completion */}
                    <Box display={'flex'} justifyContent={'center'} mt={1}>
                    <Typography 
                    variant="caption" 
                    color={'text.secondary'}
                    className="text-success"
                    fontWeight={'bold'}>
                    Learn Free and Get Certificate</Typography>
                    </Box>
                  {/* button enroll */}
                  <Box display={'flex'} justifyContent={'center'} mt={1} mb={1}>
                  {/* user enrolled  and certified display print cert btn */}
                  {course?.currentUserEnrolled && course?.currentUserCertified ? (
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={handlePrintCertificate}
                  endIcon={isFetching ? <CircularProgress size={14}/>:<PrintRounded/>}
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ borderRadius:3 }}>
                  print certificate
                  </Button>
                  ):(
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={course?.currentUserEnrolled ? handleGetCertificate: handleEnrollCourse}
                  endIcon={isFetching ? <CircularProgress size={14}/>:!course?.currentUserEnrolled?<VideoLibraryRounded/>:undefined}
                  variant="contained"
                  color={course?.currentUserEnrolled ? "secondary":"primary"} 
                  size="large"
                  sx={{ borderRadius:3 }}>
                  {course?.currentUserEnrolled ? `Get Certificate $${course?.price} `: "Enroll Now Free"}
                  </Button>
                  )}
                  </Box>

                  {/* verifiable helper */}
                  <Box 
                  display={'flex'}
                  justifyContent={'center'}
                  >
                    <Typography variant="caption"> All Digital Certificates are Verifiable</Typography>
                  </Box>
                   </Box>
                  )}

                  </CardContent>
                  </Card>
                </React.Fragment>
              ) : (
                <Stack gap={1}>
                {/* accordion lectures */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Lectures</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {course.course_video_lectures.slice(0,handleCourseLecturesPreview()).map((video, idx) => (
                        <ListItemButton
                          key={video.video_lectureID}
                          selected={
                            currentVideo?.video_lectureID === video.video_lectureID
                          }
                          onClick={() => handleVideoChange(video)}
                        >
                          <ListItemText primary={`Lecture ${idx + 1}`} />
                        </ListItemButton>
                      ))}
                    </List>

                    
                     {/* locked lectures, if user not enrolled */}
                   {!courseItem?.currentUserEnrolled && !isMyCourse && (
                     <Box 
                    mt={1}
                    display={'flex'} 
                    justifyContent={'center'}                  
                    >
                    <Typography display={'flex'} gap={2} alignItems={'center'} pt={2} variant="body2" color={'text.secondary'}>
                    {/* lock */}
                    <Lock sx={{ width:15,height:15 }}/>
                      {/* text */}
                      Enroll to Unlock {course.course_video_lectures.length} Lectures

                      {/* lock */}
                      <Lock sx={{ width:15,height:15 }}/>
                    </Typography>
                    </Box>
                   )}

                  </AccordionDetails>
                </Accordion>

                {/* accordion topics */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Topics</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                {course.course_video_topics.slice(0,handleCourseLecturesPreview()).map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={
                      <Typography variant="caption">{topic}</Typography>
                    } />
                  </ListItem>
                ))}
              </List>

                {/* locked topics, if user not enrolled */}
                  {!courseItem?.currentUserEnrolled && !isMyCourse && (
                    <Box 
                    mt={1}
                    display={'flex'} 
                    justifyContent={'center'}                  
                    >
                    <Typography display={'flex'} gap={2} alignItems={'center'} pt={2} variant="body2" color={'text.secondary'}>
                    {/* lock */}
                    <Lock sx={{ width:15,height:15 }}/>
                      {/* text */}
                      Enroll to view the full {course.course_video_topics.length} topics

                      {/* lock */}
                      <Lock sx={{ width:15,height:15 }}/>
                    </Typography>
                    </Box>
                  )}

                  </AccordionDetails>
                </Accordion>

                {/* course description */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                <Typography  mt={1} width={300} variant="caption">
                    {course?.course_description}
                    </Typography>  
                  </AccordionDetails>
                </Accordion>

                {/* course rating */}
                <Accordion expanded={openMobileRate} onChange={()=>setOpenMobileRate(prev=>!prev)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Course Rating</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                 <Typography variant="body1" gutterBottom>
                        Course Full Rating
                      </Typography>
                      <Box display={'flex'} gap={2} alignItems={'center'}>
                      {/* stars */}
                        <Rating
                          name="feedback"
                          size="medium"
                          value={course?.course_rate_count}
                          readOnly
                          precision={0.5}
                        />

                        {/* message rating */}
                        <Box>
                          <Typography variant="body2" color={'text.secondary'}>
                          {labels[course?.course_rate_count]}
                           </Typography>
                        </Box>
                        </Box>

                        <Divider className="p-1"/>

                        <Typography mt={1} variant="body1" gutterBottom>
                        {course?.currentUserEnrolled ? "My Final Rating":"My Pre-Rating Status"} 
                      </Typography>
                       <Box display={'flex'} gap={2} alignItems={'center'}>
                       {/* star rate */}
                        <Rating
                          name="myRating"
                          size="medium"
                          readOnly={isMyCourse}
                          value={ratingValue}
                          onChange={(event,value)=>setRatingValue(value)}
                        />

                        {/* message rating */}
                        <Box>
                          <Typography variant="body2" color={'text.secondary'}>
                          {labels[ratingValue]}
                           </Typography>
                        </Box>

                        </Box>
                        <Box>
                        <Typography mt={1} variant="caption" gutterBottom>
                        {course?.currentUserEnrolled ? `Based on the ${handleCourseLecturesPreview()} ${handleCourseLecturesPreview()<=1 ?"lecture":"lectures"} what's your final course rating, 
                      help us improve our tech content.`:`Based on the ${handleCourseLecturesPreview()} ${handleCourseLecturesPreview()<=1 ?"lecture":"lectures"} what's your rating, 
                      help us improve our courses and tech content in general.`}
                      
                      </Typography>
                      </Box>
                  </AccordionDetails>
                </Accordion>

                  {/* students enrolled */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">Students Enrolled</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                <Typography variant="body2">
                        {course.student_count} Students
                      </Typography>
                  </AccordionDetails>
                </Accordion>


                {/* enrollment */}
                <Card >
                  <CardContent>
                  {isMyCourse ? (
                    <Stack gap={1}>
                    <Typography variant="body1" gutterBottom>
                    Course Deletion
                  </Typography>

                  {/* btn delete */}
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={handleDeleteCourse}
                  endIcon={isFetching ? <CircularProgress size={14}/>:<Delete/>}
                  variant="contained"
                  color="warning"
                  size="medium"
                  sx={{ borderRadius:3 }}>
                  Delete Full Course
                  </Button>

                    </Stack>
                  ):(
                  <Box>
                    <Typography variant="body1">
                    {course?.currentUserEnrolled ? "Course Certification" :"Course Enrollment"} 
                  </Typography>
                  
                     {/* certificate of completion */}
                    <Box display={'flex'} justifyContent={'center'} mt={1}>
                    <Typography 
                    variant="caption" 
                    color={'text.secondary'}
                    className="text-success"
                    fontWeight={'bold'}>
                    Learn Free and Get Certificate</Typography>
                    </Box>
                  {/* button enroll */}
                  <Box display={'flex'} justifyContent={'center'} mt={1} mb={1}>
                  {/* user enrolled  and certified display print cert btn */}
                  {course?.currentUserEnrolled && course?.currentUserCertified ? (
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={handlePrintCertificate}
                  endIcon={isFetching ? <CircularProgress size={14}/>:<PrintRounded/>}
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ borderRadius:3 }}>
                  print certificate
                  </Button>
                  ):(
                  <Button 
                  disabled={isFetching || errorMessage }
                  onClick={course?.currentUserEnrolled ? handleGetCertificate: handleEnrollCourse}
                  endIcon={isFetching ? <CircularProgress size={14}/>:!course?.currentUserEnrolled?<VideoLibraryRounded/>:undefined}
                  variant="contained"
                  color={course?.currentUserEnrolled ? "secondary":"primary"} 
                  size="large"
                  sx={{ borderRadius:3 }}>
                  {course?.currentUserEnrolled ? `Get Certificate $${course?.price} `: "Enroll Now Free"}
                  </Button>
                  )}
                  </Box>

                  {/* verifiable helper */}
                  <Box 
                  display={'flex'}
                  justifyContent={'center'}
                  >
                    <Typography variant="caption"> All Digital Certificates are Verifiable</Typography>
                  </Box>
                   </Box>
                  )}

                  </CardContent>
                  </Card>
                </Stack>
              )}
            </Box>
          </Box>
        </DialogContent>
          </Box>
      </Dialog>

      

      {/* alert error  */}
      {errorMessage && (
        <AlertGeneral
         openAlertGeneral={errorMessage}
        defaultIcon={<InfoRounded/>}
        setErrorMessage={setErrorMessage}
        isError={true}
        title={"Course Rating"}
        message={errorMessage}
         />
      )}

      {/* payment alert */}
      {openPaymentCertDialog && (
        <PaymentCertDialog 
        openCertDialog={openPaymentCertDialog}
        setOpenCertDialog={setOpenPaymentCertDialog}
        course={course}
        />
      )}
    </Box>
  );
};

export default CoursePlayer;
