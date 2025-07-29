import {
  Close,
  PageviewRounded,
  PreviewRounded,
  TvRounded,
  WorkRounded
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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import { updateCurrentJobs } from "../../redux/CurrentJobs";
import AllSkills from "../data/AllSkillsData";
import SpecialisationTech from "../data/SpecialisationTech";
import AccordionSearchOptions from "../modal/AccordionSearchOptions";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertJobSearch({
  openAlert,
  setOpenAlert,
  isEventSearch=false
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const [job_titles, setJobTile] = useState([]);
  const [country, setCountry] = React.useState("");
  const [entry, setJobEntry] = React.useState("");
  const [datePosted, setDatePosted] = React.useState("");
  const [category, setCategory] = useState("");

  const handleCloseAlert = () => {
    // close alert
    setOpenAlert(false);
    // clear messages
    handleClearing();
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  

  const handleChangeTitles = (_, newValue) => {
    if (newValue.length > 3) {
      return; // Limit to  selections
    }
    setJobTile(newValue);
  };

  const handleDeleteTitle = (skillToDelete) => {
    setJobTile((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  // fetch the matching jobs from the backend
  const handleFetchingJobsSearch = () => {
    // create job search object that will be sent to the backend
    const jobSearch = {
      job_titles,
      country,
      entry,
      datePosted,
    };

    // event search object that will be sent to the backend
    const eventObject={
      job_titles,
      country,
      category
    }

    // set is fetching to true
    setIsFetching(true);
    // performing post request, if jobs search use appropriate route
    // else if events too
    axios
      .post(
        isEventSearch ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/search`:
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/search/${user?._id}`
        ,
        isEventSearch ? eventObject:jobSearch,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          // update success message
          setSuccessMessage(res.data?.message);
          // update events redux
          isEventSearch ? dispatch(updateCurrentEvents(res.data.data)):
          // update the redux states for job search
          dispatch(updateCurrentJobs(res.data?.data));
        } else {
          // no jobs
          setErrorMessage("no matching results");
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
  };

  // handle clearing of isNetwork and error message when the alert shown
  const handleClearing = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

   // handle width of alert dialog 
    const handleAlertWidth=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "36%"
      } else if(CustomLandScape()){
        return "-8%"
      } else if(CustomLandscapeWidest()){
        return "-5%"
      }
    }

  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      keepMounted
      className="rounded"
      onClose={handleCloseAlert}
      aria-describedby="alert-dialog-slide-description"
      sx={{
          backdropFilter:'blur(3px)',
          marginLeft:handleAlertWidth()
          }}
    >
      <Box 
      bgcolor={"background.default"} 
      border={'1px solid'}
      borderColor={'divider'}
      >
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
          {isEventSearch ? (
            <React.Fragment>
               {/*  icon */}
            <TvRounded />
            {/* title */}
            <Typography variant={'body1'}>
            Tech Event Search
            </Typography>
            </React.Fragment>
          ):(
            <React.Fragment>
              {/*  icon */}
            <WorkRounded />
            {/* title */}
            <Typography variant={'body1'}>
            Job Search
          </Typography>
            </React.Fragment>
          )}
           
          </Box>
          <Box>{isFetching && <CircularProgress size={"20px"} />}</Box>
        </DialogTitle>
        {/* displayed when success message */}
        {successMessage && (
          <Box
            mt={1}
            mb={1}
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
          >
            <Collapse in={successMessage || false}>
              <Alert
                severity="success"
                onClick={handleClearing}
                className="rounded"
                action={
                  <IconButton aria-label="close" color="inherit" size="small">
                    <Tooltip arrow title="clear">
                      <Close fontSize="inherit" />
                    </Tooltip>
                  </IconButton>
                }
              >
                {successMessage}
              </Alert>
            </Collapse>
          </Box>
        )}

        {/* displayed when is error message */}
        {errorMessage && (
          <Box
            mt={1}
            mb={1}
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
          >
            <Collapse in={errorMessage || false}>
              <Alert
                severity="info"
                className="rounded"
                onClick={handleClearing}
                action={
                  <IconButton aria-label="close" color="inherit" size="small">
                    <Tooltip arrow title="clear">
                      <Close fontSize="inherit" />
                    </Tooltip>{" "}
                  </IconButton>
                }
              >
                {errorMessage}
              </Alert>
            </Collapse>
          </Box>
        )}
        <DialogContent>
          <DialogContentText gutterBottom mb={2}>
            provide the name of the {isEventSearch ? "event":"job"} and click on the search icon.
          </DialogContentText>
          <Autocomplete
            multiple
            options={AllSkills}
            value={job_titles}
            onChange={handleChangeTitles}
            disableCloseOnSelect
            disabled={isFetching || errorMessage || successMessage}
            renderInput={(params) => (
              <TextField
                {...params}
                label='name'
                placeholder="React, Angular, Python, Java"
                fullWidth
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((skill, index) => (
                <Chip
                  label={skill}
                  {...getTagProps({ index })}
                  onDelete={() => handleDeleteTitle(skill)}
                />
              ))
            }
          />

          {/* category */}

          <Box mt={2}>
             <TextField
              select
              disabled={isFetching}
              value={category}
              label={isEventSearch ? "event specialization":"job specialization"}
              fullWidth
              onChange={(e) => setCategory(e.target.value)}
                >
                  {SpecialisationTech?.filter((about) => about !== "None").map(
                  (about, index) => (
                    <MenuItem
                      key={about}
                      value={about}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {/* icon */}
                      <CourseIcon option={about} />
                      {/* name */}
                      <small style={{ fontSize: "small" }}>{about}</small>
                    </MenuItem>
                  )
                    )}
                </TextField>
          </Box>

          {/* more search options accordion */}
          <Box mt={2}>
            <AccordionSearchOptions
              country={country}
              setCountry={setCountry}
              entry={entry}
              setJobEntry={setJobEntry}
              datePosted={datePosted}
              setDatePosted={setDatePosted}
              successMessage={successMessage}
              errorMessage={errorMessage}
              isFetching={isFetching}
              isEventSearch={isEventSearch}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          {successMessage ? (
            <Box display={"flex"} justifyContent={"center"} width={"100%"}>
              <Button
                sx={{ textTransform: "capitalize" }}
                onClick={handleCloseAlert}
                color="success"
                variant="outlined"
                className="rounded-5"
                disableElevation
                size="small"
                startIcon={<PreviewRounded sx={{ width: 25, height: 25 }} />}
              >
                View Results
              </Button>
            </Box>
          ) : (
            <React.Fragment>
            {/* search button */}
            <Box mr={2}>
            <Tooltip arrow title="search">
            <IconButton 
            disabled={isFetching || errorMessage || successMessage}
            onClick={handleFetchingJobsSearch}
            >
             <PageviewRounded sx={{ width: 23, height: 23 }} />
            </IconButton>
            </Tooltip>
            </Box>

            </React.Fragment>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
