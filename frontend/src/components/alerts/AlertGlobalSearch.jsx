import {
  GroupsRounded,
  LiveTvRounded,
  PeopleRounded,
  PostAddRounded,
  SchoolRounded,
  SearchRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Box, CardActionArea, DialogTitle, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIsJobsGlobalResults,
  handleSidebarRightbar,
} from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import {
  updateCurrentPeopleData,
  updateCurrentPeopleModal,
} from "../../redux/CurrentModal";
import { updateCurrentPostsFromSearch } from "../../redux/CurrentPosts";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

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
  const { isTabSideBar, isSidebarRighbar } = useSelector(
    (state) => state.appUI
  );
  const { globalSearchResults } = useSelector(
    (state) => state.currentGlobalSearch
  );
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

    // navigate to jobs page for full display
    navigate("/jobs");
    // update the bottom nav bar index position to jobs
    dispatch(updateCurrentBottomNav(1));

    // disable sidebar
    if (isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
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

  return (
      <Dialog
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          marginLeft:
            CustomDeviceTablet() && isTabSideBar
              ? "36%"
              : CustomLandscapeWidest()
              ? "-5%"
              : undefined,
        }}
      >
        <DialogTitle
          variant="body1"
          display={"flex"}
          gap={2}
          alignItems={"center"}
        >
          <SearchRounded />
          Search Results
        </DialogTitle>
        {/* search term */}
        <Box display={"flex"} justifyContent={"center"}>
          <Typography variant="caption" textAlign={"center"}>
            ' {searchTerm} '
          </Typography>
        </Box>
        <DialogContent dividers>
          {/* message from backend present display this */}
          <Box display={"flex"} justifyContent={"center"} maxWidth={300}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={"bold"}
            >
              {message}
            </Typography>
          </Box>

          <Box
            width={300}
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
                <CardActionArea disabled={coursesCount < 1}>
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
                <CardActionArea disabled={eventsCount < 1}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <LiveTvRounded color="action" />
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
                <CardActionArea disabled={groupsCount < 1}>
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
      </Dialog>
  );
}
