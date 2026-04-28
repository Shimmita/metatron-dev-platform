import {
  Close,
  PageviewRounded,
  PreviewRounded,
  SchoolRounded,
  TvRounded,
  WorkRounded,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentCourses } from "../../redux/CurrentCourses";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AllSkills from "../data/AllSkillsData";
import SpecialisationTech from "../data/SpecialisationTech";
import AccordionSearchOptions from "../modal/AccordionSearchOptions";
import CourseIcon from "../utilities/CourseIcon";

export default function AlertJobSearch({
  openAlert,
  setOpenAlert,
  isEventSearch = false,
  isCourseSearch = false,
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [job_titles, setJobTile] = useState([]);
  const [country, setCountry] = useState("");
  const [entry, setJobEntry] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [category, setCategory] = useState("");
  const [access, setAccess] = useState("");
  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.currentUser);

  /* ───────── CLOSE ───────── */
  const handleCloseAlert = () => {
    setOpenAlert(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  /* ───────── TITLE HANDLING ───────── */
  const handleChangeTitles = (_, newValue) => {
    if (newValue.length > 3) return;
    setJobTile(newValue);
  };

  const handleDeleteTitle = (skill) => {
    setJobTile((prev) => prev.filter((s) => s !== skill));
  };

  /* ───────── SEARCH ───────── */
  const handleFetchingJobsSearch = () => {
    setIsFetching(true);

    const jobSearch = {
      job_titles,
      country,
      entry,
      datePosted,
      category,
      access: access.split(" ")[0],
    };

    const eventObject = { job_titles, country, category };
    const courseSearchObject = { job_titles, category };

    axios
      .post(
        isEventSearch
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/search`
          : isCourseSearch
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/search/${user?._id}`
          : `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/search/${user?._id}`,
        isEventSearch
          ? eventObject
          : isCourseSearch
          ? courseSearchObject
          : jobSearch,
        { withCredentials: true }
      )
      .then((res) => {
        if (res?.data) {
          setSuccessMessage(res.data?.message);

          isEventSearch
            ? dispatch(updateCurrentEvents(res.data.data))
            : isCourseSearch
            ? dispatch(updateCurrentCourses(res.data.data))
            : dispatch(updateCurrentJobs(res.data.data));

          setExpanded(false);
        } else {
          setErrorMessage("No matching results");
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server unreachable");
        } else {
          setErrorMessage(err?.response?.data);
        }
      })
      .finally(() => setIsFetching(false));
  };

  return (
    <Dialog
      open={openAlert}
      onClose={handleCloseAlert}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
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
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" gap={1} alignItems="center">
          {isEventSearch ? <TvRounded /> : isCourseSearch ? <SchoolRounded /> : <WorkRounded />}
          <Typography fontWeight={600}>
            {isEventSearch
              ? "Search Tech Events"
              : isCourseSearch
              ? "Search Tech Courses"
              : "Search Tech Jobs"}
          </Typography>
        </Box>

        {isFetching && <CircularProgress size={18} />}
      </Box>

      {/* ALERTS */}
      {(successMessage || errorMessage) && (
        <Box px={2} pt={1}>
          <Collapse in>
            <Alert
              severity={successMessage ? "success" : "info"}
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
              }}
              action={
                <IconButton size="small">
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {successMessage || errorMessage}
            </Alert>
          </Collapse>
        </Box>
      )}

      {/* CONTENT */}
      <DialogContent>
        <Typography mb={1} fontSize={13}>
          Enter up to 3 skills or keywords
        </Typography>

        {/* SKILLS INPUT */}
        <Autocomplete
          multiple
          options={AllSkills}
          value={job_titles}
          onChange={handleChangeTitles}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField {...params} placeholder="React, Node, Python..." />
          )}
          renderTags={(value, getTagProps) =>
            value.map((skill, index) => (
              <Chip
                label={skill}
                {...getTagProps({ index })}
                onDelete={() => handleDeleteTitle(skill)}
                sx={{
                  bgcolor: "rgba(20,210,190,0.15)",
                  color: "#14D2BE",
                }}
              />
            ))
          }
        />

        {/* CATEGORY */}
        <Box mt={2}>
          <TextField
            select
            value={category}
            fullWidth
            label="Specialization"
            onChange={(e) => setCategory(e.target.value)}
          >
            {SpecialisationTech.filter((x) => x !== "None").map((item) => (
              <MenuItem key={item} value={item}>
                <Box display="flex" gap={1} alignItems="center">
                  <CourseIcon option={item} />
                  <span>{item}</span>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* EXTRA OPTIONS */}
        {!isCourseSearch && (
          <Box mt={2}>
            <AccordionSearchOptions
              country={country}
              setCountry={setCountry}
              entry={entry}
              setJobEntry={setJobEntry}
              datePosted={datePosted}
              setDatePosted={setDatePosted}
              successMessage={successMessage}
              setAccess={setAccess}
              access={access}
              errorMessage={errorMessage}
              isFetching={isFetching}
              isEventSearch={isEventSearch}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </Box>
        )}
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{ px: 2, pb: 2 }}>
        {successMessage ? (
          <Button
            fullWidth
            onClick={handleCloseAlert}
            startIcon={<PreviewRounded />}
            sx={{
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            View Results
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={handleFetchingJobsSearch}
            startIcon={<PageviewRounded />}
            disabled={isFetching}
            sx={{
              background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
              color: "#fff",
            }}
          >
            Search
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}