import { MenuBookRounded, SchoolRounded } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, Rating, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};


export default function AlertSimilarCourses({
  openSimilarCourses,
  setOpenSimilarCourses,
  isDarkMode=false,
  courseId,
  courseName,
  setFocusedCourse
}) {

    const [similarCourses,setSimilarCourses]=useState([])
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { user } = useSelector((state) => state.currentUser);

    
    const handleClose = () => {
        setOpenSimilarCourses(false);

    };


    // handle focused course
    const handleFocusedCourse=(course)=>{
        setFocusedCourse(course)
        handleClose()
    }

    //  useEffect to fetch all similar courses under same category
        useLayoutEffect(()=>{
        axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/similar/${user?._id}/${courseId}`,
            {
                withCredentials: true,
            }
            )
            .then((res) => {
            // update similar courses state
            if (res?.data) {
                setSimilarCourses(res.data)
            } 
            })
            .catch(async (err) => {
            console.log(err);
            //  user login session expired show logout alert
            if (err?.response?.data.login) {
                window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
                setErrorMessage(
                "server unreachable!"
                );
                return;
            }
            setErrorMessage(err?.response.data);
            })
            .finally(() => {
            setIsFetching(false);
            });
        
},[user,courseId])




  return (
      <Dialog
        open={openSimilarCourses}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter:'blur(5px)',
          }}
      >
        <DialogTitle
        display={"flex"}
        alignItems={"center"}
        fontWeight={"bold"}
        variant="body1"
        gap={2}
        sx={{
        background: !isDarkMode && 
        "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",

        }}
        >
        <SchoolRounded/>
        Similar Courses
        </DialogTitle>
        {/* display error info here */}
        <Box p={0.5} display={'flex'} 
        justifyContent={'center'}>
          <Typography 
          className={errorMessage ? 'text-info':''}
          variant="caption"
          color={!errorMessage ? 'text.secondary':undefined}
          fontWeight={'bold'}
          >
        {errorMessage ? errorMessage : courseName}
        </Typography>
        </Box>

        {/* dialog content */}
        <DialogContent 
        dividers
         sx={{
          overflow: "auto",
          maxHeight:'70vh',
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        >

        <List sx={{ width: '100%',}}>

        {/* loop through similar courses */}
        {similarCourses?.map((course)=>(
            <Box mb={1} key={course._id}>
            <ListItem alignItems="flex-start">
           {/* avatar */}
            <ListItemAvatar>
            <Avatar 
            src={course?.course_instructor?.instructorAvatar}
            sx={{width:50,height:50}}/>
            </ListItemAvatar>

            {/* course details more */}
            <Box ml={2}>
            {/* course title */}
            <Typography
                variant="body1"
                gutterBottom
                textTransform={"capitalize"}
            >
                
                {course?.course_title}

            </Typography>
            {/* poster or course owner or Instructor */}
            <Typography 
            gutterBottom variant="body2"
             color="text.secondary">
                {course?.course_instructor?.instructorName}
            </Typography>

            {/* rating section */}
            <Box display={"flex"} gap={1} alignItems={"center"}>
                {/* stars  */}
                <Rating
                name="feedback"
                size="small"
                value={course?.course_rate_count}
                readOnly
                precision={0.5}
                />
                {/* rating label */}
                <Typography variant="body2" color="text.secondary">
                {labels[Math.floor(course?.course_rate_count)]}
                </Typography>
            </Box>
            {/* btn viewing the course */}
            <Box mt={1}>
                <Button
                size="small"
                onClick={()=>handleFocusedCourse(course)}
                variant="outlined"
                sx={{ textTransform: "lowercase", }}
                >
                View Course Details
                </Button>
            </Box>
            </Box>
        </ListItem>
       
        
        </Box>
        ))}
       
        </List>


        {/* displayed when loading,fetching */}
        {isFetching && (
        <Box 
        display={'flex'} 
        justifyContent={'center'}>
        <CircularProgress size={40}/>
        </Box>
        )}

        {/* displayed when are no course and no fetching */}
        {!isFetching && !similarCourses.length && (
            <React.Fragment>
            <Box 
        display={'flex'} 
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        justifyContent={'center'}>

        {/* icon */}
        <MenuBookRounded
         sx={{width:30,height:30}}
        />

        {/* text */}
        <Typography variant="body2" 
        color={'text.secondary'}>
            No Similar Courses
        </Typography>
        </Box>
            </React.Fragment>
        )}

        </DialogContent>
        <DialogActions>
        <Button 
        disabled={isFetching}
        onClick={handleClose} 
        sx={{ borderRadius:4 }}>
        close
        </Button>
        </DialogActions>
    </Dialog>
  );
}
