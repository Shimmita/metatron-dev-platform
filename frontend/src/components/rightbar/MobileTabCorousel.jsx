import { InsightsRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentCoursesTop } from "../../redux/CurrentCoursesTop";
import { updateCurrentEventsTop } from "../../redux/CurrentEventsTop";
import { updateCurrentJobsTop } from "../../redux/CurrentJobsTop";
import CoursesContainer from "./CoursesContainer";
import FeaturedEventsContainer from "./FeaturedEventsContainer";
import FeaturedPostContainer from "./FeaturedPostContainer";
import JobsContainer from "./JobsContainer";
import RequestContainer from "./RequestContainer";
import RightBarStepper from "./RightBarStepper";

const MobileTabCorousel = () => {
  // backdrop state
  const [corouselCounter, setCorouselCounter] = React.useState(0);
   // redux states
    const {  isSidebarRighbar, currentMode} = useSelector(
      (state) => state.appUI
    );
    const isDarkMode=currentMode==='dark'

    const { isGuest, user } = useSelector((state) => state.currentUser);
    const { jobsTop } = useSelector((state) => state.currentJobsTop);
    const { coursesTop } = useSelector((state) => state.currentCoursesTop);
    const { eventsTop } = useSelector((state) => state.currentEventsTop);
    const isPreviewFetchInFlight = React.useRef(false);
    

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const hasData = (items) => Array.isArray(items) && items.length > 0;
  

  React.useEffect(() => {
    if (!isGuest && !user?._id) {
      return;
    }

    if ([jobsTop, coursesTop, eventsTop].every((items) => Array.isArray(items))) {
      return;
    }

    if (isPreviewFetchInFlight.current) {
      return;
    }

    let isMounted = true;
    isPreviewFetchInFlight.current = true;
    const userId = isGuest ? "guest" : user?._id;
    const currentJobs = Array.isArray(jobsTop) ? jobsTop : [];
    const currentCourses = Array.isArray(coursesTop) ? coursesTop : [];
    const currentEvents = Array.isArray(eventsTop) ? eventsTop : [];

    Promise.allSettled([
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/top/${userId}`, { withCredentials: true }),
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/top`, { withCredentials: true }),
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/top`, { withCredentials: true }),
    ]).then(([jobsResult, coursesResult, eventsResult]) => {
      if (!isMounted) return;

      dispatch(updateCurrentJobsTop(jobsResult.status === "fulfilled" ? jobsResult.value?.data || [] : currentJobs));
      dispatch(updateCurrentCoursesTop(coursesResult.status === "fulfilled" ? coursesResult.value?.data || [] : currentCourses));
      dispatch(updateCurrentEventsTop(eventsResult.status === "fulfilled" ? eventsResult.value?.data || [] : currentEvents));
    }).finally(() => {
      isPreviewFetchInFlight.current = false;
    });

    return () => {
      isMounted = false;
    };
  }, [coursesTop, dispatch, eventsTop, isGuest, jobsTop, user?._id]);

  const handleNavigate = (route, navPosition) => {
    navigate(route);
    dispatch(updateCurrentBottomNav(navPosition));
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  };

  const sections = [
    ...(hasData(jobsTop) ? [{
      key: "jobs",
      content: (
        <>
          <JobsContainer />
          <Box display="flex" justifyContent="center" width="auto">
            <Button startIcon={<InsightsRounded />} onClick={() => handleNavigate("/jobs", 1)} size="small" sx={{ textTransform: "capitalize", borderRadius: 4 }}>
              more jobs
            </Button>
          </Box>
        </>
      ),
    }] : []),
    ...(hasData(coursesTop) ? [{
      key: "courses",
      content: (
        <>
          <CoursesContainer />
          <Box display="flex" justifyContent="center" width="auto">
            <Button startIcon={<InsightsRounded />} onClick={() => handleNavigate("/courses/available", 3)} size="small" sx={{ textTransform: "capitalize", borderRadius: 4 }}>
              more courses
            </Button>
          </Box>
        </>
      ),
    }] : []),
    ...(hasData(eventsTop) ? [{
      key: "events",
      content: (
        <>
          <FeaturedEventsContainer />
          <Box display="flex" justifyContent="center" width="auto">
            <Button startIcon={<InsightsRounded />} onClick={() => handleNavigate("/events", 2)} size="small" sx={{ textTransform: "capitalize", borderRadius: 4 }}>
              more events
            </Button>
          </Box>
        </>
      ),
    }] : []),
    ...(!isGuest ? [
      { key: "network", content: <RequestContainer /> },
      { key: "posts", content: <FeaturedPostContainer /> },
    ] : []),
  ];

  React.useEffect(() => {
    if (corouselCounter >= sections.length) {
      setCorouselCounter(0);
    }
  }, [corouselCounter, sections.length]);

  if (sections.length === 0) {
    return null;
  }

  return (
      <Box
      color={"text.primary"}
      className={'rounded shadow-sm'}
      sx={{ 
        border:isDarkMode && "1px solid",
        borderColor:"divider",
        }}
      >
        <Box
        className={'rounded shadow-sm'}
        bgcolor={"background.default"} 
        >
        <Box>
          {sections.map((section, index) => (
            <Box key={section.key} gap={1} display={corouselCounter === index ? "block" : "none"}>
              {section.content}
            </Box>
          ))}
            </Box>
            {sections.length > 1 && (
                <Box 
            display={"flex"} 
            justifyContent={"center"}>
              <RightBarStepper
                corouselCounter={corouselCounter}
                setCorouselCounter={setCorouselCounter}
                maxStep={sections.length}
              />
            </Box>
            )}
      </Box>
    </Box>
  );
};

export default MobileTabCorousel;
