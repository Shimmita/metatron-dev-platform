import {
  Close,
  PageviewRounded,
  PreviewRounded,
  TuneRounded,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
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
import { updateJobSearch } from "../../redux/CurrentJobSearch";
import AllSkills from "../data/AllSkillsData";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const searchCreteria = ["Paid", "Free"];

export default function AlertCourseSearch({
  openSearchCourse,
  setOpenSearchCourse,
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [creteria, setCreteria] = useState("");
  const dispatch = useDispatch();
  // axios default credentials
  axios.defaults.withCredentials = true;

  const [course_titles, setJobTile] = useState([]);

  const handleCloseAlert = () => {
    // close alert
    setOpenSearchCourse(false);
    // clear messages
    handleClearing();
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

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
      job_titles: course_titles,
    };

    // set is fetching to true
    setIsFetching(true);
    // performing post request
    axios
      .post(
        `http://localhost:5000/metatron/api/v1/jobs/all/search`,
        jobSearch,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          // update success message
          setSuccessMessage(res.data?.message);
          // update the redux states for job search
          dispatch(updateJobSearch(res.data?.data));
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
            "server unreachable please try again later to complete your request"
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

  return (
    <Dialog
      open={openSearchCourse}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      sx={{
        marginLeft:
          CustomDeviceTablet() && isTabSideBar
            ? "34%"
            : CustomLandscapeWidest()
            ? "-2%"
            : CustomLandScape()
            ? "-8%"
            : undefined,
      }}
    >
      <Box bgcolor={"background.default"} className="border rounded">
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            {/* icon */}
            <TuneRounded />
            {/* title */}
            Search Courses
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
                severity="warning"
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

        {/* divider */}
        <Divider component={"div"} />
        <DialogContent>
          <Stack gap={4}>
            {/* course name */}
            <Box>
              <DialogContentText>
                provide course name and click on the search icon
              </DialogContentText>
              <Autocomplete
                multiple
                options={AllSkills}
                value={course_titles}
                onChange={handleChangeTitles}
                disableCloseOnSelect
                disabled={isFetching || errorMessage || successMessage}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"course"}
                    placeholder="Machine Learning Nodejs"
                    fullWidth
                    variant="standard"
                    required
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
            </Box>

            {/* search creteria */}
            <Box>
              <DialogContentText>
                provide search creteria (paid or free)
              </DialogContentText>
              <TextField
                required
                select
                disabled={isFetching || errorMessage || successMessage}
                value={creteria}
                variant="standard"
                label="creteria"
                fullWidth
                onChange={(e) => setCreteria(e.target.value)}
              >
                {searchCreteria.map((creteria, index) => (
                  <MenuItem key={index} value={creteria}>
                    <small style={{ fontSize: "small" }}>{creteria}</small>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          {successMessage ? (
            <Box display={"flex"} justifyContent={"center"} width={"100%"}>
              <Button
                sx={{ textTransform: "capitalize" }}
                onClick={handleCloseAlert}
                color="success"
                variant="outlined"
                disableElevation
                size="small"
                startIcon={<PreviewRounded sx={{ width: 25, height: 25 }} />}
              >
                View Results
              </Button>
            </Box>
          ) : (
            <React.Fragment>
              <Button
                disabled={isFetching || errorMessage || successMessage}
                sx={{ borderRadius: "20px" }}
                onClick={handleFetchingJobsSearch}
                startIcon={
                  <Tooltip arrow title="search">
                    <PageviewRounded sx={{ width: 25, height: 25 }} />
                  </Tooltip>
                }
              />
              <Button
                sx={{ borderRadius: "20px" }}
                disabled={isFetching || errorMessage || successMessage}
                onClick={handleCloseAlert}
                startIcon={
                  <Tooltip arrow title="close">
                    {" "}
                    <Close sx={{ width: 22, height: 22 }} />{" "}
                  </Tooltip>
                }
              />
            </React.Fragment>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
