import {
  Close,
  GroupsRounded,
  PeopleRounded,
  PostAddRounded,
  SchoolRounded,
  SearchRounded,
  TvRounded,
  WorkRounded
} from "@mui/icons-material";
import { Box, CardActionArea, DialogTitle, IconButton, Tooltip, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentCourses } from "../../redux/CurrentCourses";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import {
  updateCurrentPeopleData,
  updateCurrentPeopleModal,
} from "../../redux/CurrentModal";
import { updateCurrentPostsFromSearch } from "../../redux/CurrentPosts";
import AlertGroupCommunity from "./AlertGroupCommunity";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertGlobalSearch({
  openAlert,
  setOpenAlert,
  searchTerm,
  setSearchTerm,
  message,
  setMessage,
}) {
  // redux states
  const { isSidebarRighbar,currentMode } = useSelector(
    (state) => state.appUI
  );
  const { globalSearchResults } = useSelector(
    (state) => state.currentGlobalSearch
  );

  const[showGroups,setShowGroups]=useState(false)
  const [groupNames,setGroupNames]=useState([])

  const isDarkMode=currentMode==='dark'
  const navigate = useNavigate();

  // handle clearing of the message
  const handleClearMessage = () => {
    setMessage("");
    setSearchTerm("");
  };

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
    handleClearMessage();
  };

  const dispatch = useDispatch();

  //getting counts or search results
  const usersCount = globalSearchResults?.users?.count || 0;
  const jobsCount = globalSearchResults?.jobs?.count || 0;
  const postsCount = globalSearchResults?.posts?.count || 0;
  const coursesCount = globalSearchResults?.courses?.count || 0;
  const eventsCount = globalSearchResults?.events?.count || 0;
  const groupsCount = globalSearchResults?.groups?.count || 0;

  // handle navigate to jobs page by updating redux current jobs to the results of the job
  const handleNavigateJobs = () => {
    // close the alert
    handleClose();

    // updating current jobs in redux to match the searched results
    dispatch(updateCurrentJobs(globalSearchResults?.jobs?.data));

    // set is search jobs global in redux ui to true
    dispatch(handleIsJobsGlobalResults(true));

    // update the bottom nav bar index position to jobs
    dispatch(updateCurrentBottomNav(1));

    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // navigate to jobs page for full display
    navigate("/jobs");
  };

  // handle showing of the people modal
  const handleShowPeopleModal = () => {
    // activate to true showing of the modal
    dispatch(updateCurrentPeopleModal(true));

    // update the people data by populating the people results data in redux
    dispatch(updateCurrentPeopleData(globalSearchResults?.users?.data));

    // close the alert global search results
    handleClose();
  };

  // handle updating of the post search
  const handlePostSearchUpdate = () => {
    // update the current posts in the redux by passing the feed from the search
    dispatch(updateCurrentPostsFromSearch(globalSearchResults?.posts?.data));
    // close the alert result
    handleClose();
    // navigate to the route default search page where is exposed the searched posts results
    navigate("/posts/search/results");
  };

  // handle showing of events results
  const handleShowEventsResults=()=>{
    // update the redux state for global events into the search results
    dispatch(updateCurrentEvents(globalSearchResults?.events?.data))

    // set is search job-events global in redux ui to true
    dispatch(handleIsJobsGlobalResults(true));
    // close the modal
    handleClose()
    
    // update the bottom nav bar index position to events
    dispatch(updateCurrentBottomNav(2));

    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // navigate to the events
    navigate("/events")
  }

  // handle showing of courses results
   const handleShowingCoursesResults=()=>{
    // update the redux state for global events into the search results
    dispatch(updateCurrentCourses(globalSearchResults?.courses?.data))

    // set is search job-courses global in redux ui to true
    dispatch(handleIsJobsGlobalResults(true));

    // close the modal
    handleClose()
    
    // update the bottom nav bar index position to events
    dispatch(updateCurrentBottomNav(3));

    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }

    // navigate to the events
    navigate("/courses/available")
  }


  // handle show matched results
  const handleShowGroup=()=>{
    setGroupNames(globalSearchResults?.groups.data)
    setShowGroups(true)
  }

  return (
      <Dialog
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          backdropFilter:'blur(5px)',
          display:showGroups ? 'none':'block'
        }}
      >
        <Box
          display={"flex"}
          pr={1}
          alignItems={"center"}
          justifyContent={'space-between'}
          sx={{
          background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
        >
        <DialogTitle 
        variant="body1"
        display={'flex'}
        alignItems={'center'}
        gap={2}
        >
        <SearchRounded />
          Search Results
        </DialogTitle>

        <Box>
          <Tooltip 
          title='close'
          arrow
          >
          <IconButton
          onClick={handleClose}
          sx={{
            border:'1px solid',
            borderColor:'divider'
          }}
          >
            <Close sx={{
            width:12,
            height:12
            }}/>
          </IconButton>
          </Tooltip>
        </Box>
          
        </Box>
        {/* search term */}
        <Box display={"flex"} justifyContent={"center"}>
          <Typography 
          variant="caption" 
          color={'text.secondary'} 
          textAlign={"center"}>
            {searchTerm}
          </Typography>
        </Box>
        <DialogContent dividers>
          {/* message from backend present display this */}
          <Box 
          display={"flex"} 
          justifyContent={"center"}
          maxWidth={400}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={"bold"}
            >
              {message}
            </Typography>
          </Box>

          <Box
            maxWidth={400}
            mt={2}
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Box
              width={"100%"}
              gap={3}
              display={"flex"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {/* people results */}

              <Box
                width={100}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
                gap={1}
              >
                <CardActionArea
                  onClick={handleShowPeopleModal}
                  disabled={usersCount < 1}
                >
                  <Box display={"flex"} justifyContent={"center"}>
                    <PeopleRounded color="primary" />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2">{usersCount} people</Typography>
                  </Box>
                </CardActionArea>
              </Box>

              {/* post results */}
              <Box
                width={100}
                gap={1}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea
                  disabled={postsCount < 1}
                  onClick={handlePostSearchUpdate}
                >
                  <Box display={"flex"} justifyContent={"center"}>
                    <PostAddRounded color="secondary" />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2"> {postsCount} Posts</Typography>
                  </Box>
                </CardActionArea>
              </Box>

              {/* jobs results */}
              <Box
                width={100}
                gap={1}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea
                  disabled={jobsCount < 1}
                  onClick={handleNavigateJobs}
                >
                  <Box display={"flex"} justifyContent={"center"}>
                    <WorkRounded color="success" />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2"> {jobsCount} Jobs</Typography>
                  </Box>
                </CardActionArea>
              </Box>

              {/* courses results */}
              <Box
                width={100}
                gap={1}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea onClick={handleShowingCoursesResults} disabled={coursesCount < 1}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <SchoolRounded color="info" />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2">
                      {" "}
                      {coursesCount} Courses
                    </Typography>
                  </Box>
                </CardActionArea>
              </Box>

              {/* learning events */}
              <Box
                width={100}
                gap={1}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea 
                onClick={handleShowEventsResults}
                disabled={eventsCount < 1}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <TvRounded color="action" />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2">
                      {" "}
                      {eventsCount} Events
                    </Typography>
                  </Box>
                </CardActionArea>
              </Box>

              {/* groups and communities */}
              <Box
                width={100}
                gap={1}
                className={"shadow rounded p-2"}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea 
                onClick={handleShowGroup}
                disabled={groupsCount < 1}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <GroupsRounded />
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="body2">
                      {" "}
                      {groupsCount} Groups
                    </Typography>
                  </Box>
                </CardActionArea>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* show matched group and community alert */}
        {showGroups && (
          <AlertGroupCommunity
            isDarkMode={isDarkMode}
            openGroup={showGroups}
            setOpenGroup={setShowGroups}
            search={groupNames}
          />
        )}
        
      </Dialog>
  );
}
