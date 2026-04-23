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
import {
  Box,
  CardActionArea,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
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
  const { isSidebarRighbar, currentMode } = useSelector(
    (state) => state.appUI
  );
  const { globalSearchResults } = useSelector(
    (state) => state.currentGlobalSearch
  );

  const [showGroups, setShowGroups] = useState(false);
  const [groupNames, setGroupNames] = useState([]);

  const isDarkMode = currentMode === "dark";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClearMessage = () => {
    setMessage("");
    setSearchTerm("");
  };

  const handleClose = () => {
    setOpenAlert(false);
    handleClearMessage();
  };

  const usersCount = globalSearchResults?.users?.count || 0;
  const jobsCount = globalSearchResults?.jobs?.count || 0;
  const postsCount = globalSearchResults?.posts?.count || 0;
  const coursesCount = globalSearchResults?.courses?.count || 0;
  const eventsCount = globalSearchResults?.events?.count || 0;
  const groupsCount = globalSearchResults?.groups?.count || 0;

  /* ---------------- ACTIONS ---------------- */

  const handleNavigateJobs = () => {
    handleClose();
    dispatch(updateCurrentJobs(globalSearchResults?.jobs?.data));
    dispatch(handleIsJobsGlobalResults(true));
    dispatch(updateCurrentBottomNav(1));

    if (isSidebarRighbar) dispatch(handleSidebarRightbar());

    navigate("/jobs");
  };

  const handleShowPeopleModal = () => {
    dispatch(updateCurrentPeopleModal(true));
    dispatch(updateCurrentPeopleData(globalSearchResults?.users?.data));
    handleClose();
  };

  const handlePostSearchUpdate = () => {
    dispatch(updateCurrentPostsFromSearch(globalSearchResults?.posts?.data));
    handleClose();
    navigate("/posts/search/results");
  };

  const handleShowEventsResults = () => {
    dispatch(updateCurrentEvents(globalSearchResults?.events?.data));
    dispatch(handleIsJobsGlobalResults(true));
    handleClose();

    dispatch(updateCurrentBottomNav(2));
    if (isSidebarRighbar) dispatch(handleSidebarRightbar());

    navigate("/events");
  };

  const handleShowingCoursesResults = () => {
    dispatch(updateCurrentCourses(globalSearchResults?.courses?.data));
    dispatch(handleIsJobsGlobalResults(true));
    handleClose();

    dispatch(updateCurrentBottomNav(3));
    if (isSidebarRighbar) dispatch(handleSidebarRightbar());

    navigate("/courses/available");
  };

  const handleShowGroup = () => {
    setGroupNames(globalSearchResults?.groups?.data);
    setShowGroups(true);
  };

  /* ---------------- CARD ---------------- */

  const SearchCard = ({ icon, label, count, onClick, disabled }) => (
    <CardActionArea
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: "14px",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        transition: "0.2s ease",
        background: disabled
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.03)",
        "&:hover": !disabled && {
          background: "rgba(255,255,255,0.08)",
          transform: "translateY(-2px)",
        },
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Box mb={0.5}>{icon}</Box>

      <Typography fontSize={14} fontWeight={700}>
        {count}
      </Typography>

      <Typography fontSize={11} color="text.secondary">
        {label}
      </Typography>
    </CardActionArea>
  );

  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" gap={1} alignItems="center">
          <SearchRounded />
          <Typography fontWeight={600}>Search Results</Typography>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* SEARCH TERM */}
      <Box textAlign="center" mt={1}>
        <Typography fontSize={12} color="text.secondary">
          Results for
        </Typography>
        <Typography fontWeight={600}>
          "{searchTerm}"
        </Typography>
      </Box>

      <DialogContent>
        {/* MESSAGE */}
        {message && (
          <Box textAlign="center" mb={1}>
            <Typography fontSize={12} color="text.secondary">
              {message}
            </Typography>
          </Box>
        )}

        {/* EMPTY STATE */}
        {!usersCount &&
          !jobsCount &&
          !postsCount &&
          !coursesCount &&
          !eventsCount &&
          !groupsCount && (
            <Box textAlign="center" py={3}>
              <Typography color="text.secondary">
                No results found
              </Typography>
            </Box>
          )}

        {/* GRID */}
        <Box
          mt={2}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
          gap={1.5}
        >
          <SearchCard
            icon={<PeopleRounded color="primary" />}
            count={usersCount}
            label="People"
            onClick={handleShowPeopleModal}
            disabled={usersCount < 1}
          />

          <SearchCard
            icon={<PostAddRounded color="secondary" />}
            count={postsCount}
            label="Posts"
            onClick={handlePostSearchUpdate}
            disabled={postsCount < 1}
          />

          <SearchCard
            icon={<WorkRounded color="success" />}
            count={jobsCount}
            label="Jobs"
            onClick={handleNavigateJobs}
            disabled={jobsCount < 1}
          />

          <SearchCard
            icon={<SchoolRounded color="info" />}
            count={coursesCount}
            label="Courses"
            onClick={handleShowingCoursesResults}
            disabled={coursesCount < 1}
          />

          <SearchCard
            icon={<TvRounded color="action" />}
            count={eventsCount}
            label="Events"
            onClick={handleShowEventsResults}
            disabled={eventsCount < 1}
          />

          <SearchCard
            icon={<GroupsRounded />}
            count={groupsCount}
            label="Groups"
            onClick={handleShowGroup}
            disabled={groupsCount < 1}
          />
        </Box>
      </DialogContent>

      {/* GROUP MODAL */}
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