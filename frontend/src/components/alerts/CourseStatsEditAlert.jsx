import {
  Add,
  AutoAwesomeRounded,
  BarChartRounded,
  Close,
  CloudUploadRounded,
  InsightsRounded,
  MovieFilterRounded,
  PlayCircleRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import pythonDjangoLogo from "../../images/django.png";
import CourseData from "../data/CourseData";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// table aspects
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(type, value, percentage) {
  return { type, value, percentage };
}

const rows = [
  createData("Rating", 4.5, 90 + "%"),
  createData("Students", 500, 100 + "%"),
  createData("Male", 350, 70 + "%"),
  createData("Female", 150, 30 + "%"),
  createData("Other", 0, 0 + "%"),
  createData("Comments", 50, 100 + "%"),
  createData("Comments->Positive", 48, 96 + "%"),
  createData("Comments->Negative", 2, 4 + "%"),
  createData("Revenue->Dollars", 5000, 50 + "%"),
];

export default function CourseStatsAlert({
  openAlertCourseStats,
  setOpenAlertCourseStats,
}) {
  const [isEditCourse, setIsEditCourse] = useState(false);
  const [videoPreference, setVideoPreference] = useState("");
  const [videoUpload, setVideoUpload] = useState(null);
  const [isPreviewVideo, setIsPreviewVideo] = useState(false);
  const [topic_text, setTopicText] = useState(""); // To hold user input text for req
  const [topicsArray, setTopicsArray] = useState([...CourseData.leactures]);
  const [isUploading, setIsUploading] = useState(false);

  // redux states
  const { isTabSideBar, isDarkMode } = useSelector((state) => state.appUI);

  const handleCloseAlert = () => {
    // close alert
    setOpenAlertCourseStats(false);
  };

  //   handle editing of course
  const handleCourseEdit = () => {
    setIsEditCourse((prev) => !prev);
  };

  // handle change in the video preference
  const handleVideoPrefChange = (event) => {
    setVideoPreference(event.target.value);
    console.log(videoPreference);
  };

  // handle videoChange
  const handleVideoChange = (e) => {
    setVideoUpload(e.target.files[0]);
  };
  // handel video preview
  const handleVideoPreview = () => {
    setIsPreviewVideo((prev) => !prev);
  };
  // return video preview src

  const handleVideoPreviewSrc = () => {
    return URL.createObjectURL(videoUpload);
  };

  // Handle input change for req
  const handleTextChangeTopic = (e, value) => {
    setTopicText(value);
  };

  // Handle adding req
  const handleAddUpdateTopic = () => {
    // Add the inputText as a new requirement if it's not empty
    if (topic_text.trim() !== "") {
      // if the name of the topic does not exists add
      if (!topicsArray.includes(topic_text.trim())) {
        setTopicsArray((prev) => [...prev, topic_text.trim()]);
        setTopicText(""); // Clear the input field
      }
    }
  };

  // Handle req removal
  const handleDeleteUpdateTopic = (req) => {
    setTopicsArray((prev) => prev.filter((val) => val !== req));
  };

  // handle updating of the course section
  const handleSectionUpdate = () => {};

  // handle updating the entire course
  const handleEntireCourseUpdate = () => {};

  // handle entire course deletion
  const handleEntireDeletion = () => {};

  return (
      <Dialog
        open={openAlertCourseStats}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,

          width:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97.5%"
              : undefined,
        }}
      >
        <DialogTitle
          display={"flex"}
          variant="body1"
          alignItems={"center"}
          fontWeight={"bold"}
          gap={1}
          width={"100%"}
        >
          {/* delete icon */}
          <BarChartRounded sx={{ width: 28, height: 28 }} />
          {/* title */}
          Python Django Full Course
          {/* avatar of the course icon */}
          <Avatar src={pythonDjangoLogo} alt="" />
        </DialogTitle>
        <Box display={"flex"} justifyContent={"center"}>
          <Typography
            variant="caption"
            textTransform={"capitalize"}
            fontWeight={"bold"}
            color={"text.secondary"}
          >
            {isEditCourse ? "Course Update Mode" : "Course Statistics"}
          </Typography>
        </Box>
        <DialogContent dividers>
          <Stack gap={2} width={"100%"}>
            {isEditCourse ? (
              <Box height={"60vh"}>
                <Box
                  sx={{
                    maxHeight: "59vh",
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
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Paid courses with student enrollment won't be allowed for
                    deletion operation but could be updated. <br /> Courses with
                    poor rating feedbacks from the students will be
                    automatically removed from public advertisement.
                  </Typography>

                  {/* update the price of the course */}
                  <Stack gap={1} mb={4}>
                    <Typography
                      variant="body2"
                      color={"text.secondary"}
                      gutterBottom
                    >
                      {" "}
                      Update the course price in (USD). Changes allowed are
                      setting the price lower. This will be credited by the
                      system as discount.
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="30"
                      label={"update price ($)"}
                    />
                  </Stack>

                  {/* video update section */}
                  <Stack gap={2}>
                    {/* preferences */}
                    <FormControl>
                      <Typography
                        variant="body2"
                        color={"text.secondary"}
                        gutterBottom
                      >
                        {" "}
                        Select course video changes or preferences in
                        particular.
                      </Typography>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={videoPreference}
                        onChange={handleVideoPrefChange}
                      >
                        <FormControlLabel
                          value={"section"}
                          sx={{ mb: 2 }}
                          control={<Radio color="primary" onch />}
                          label={
                            <>
                              <Typography variant="body2">
                                Update a particular video section
                              </Typography>

                              <Typography
                                variant="body2"
                                color={"text.secondary"}
                              >
                                Good for updating some section of the original
                                video
                              </Typography>
                            </>
                          }
                        />
                        <FormControlLabel
                          value={"update"}
                          control={<Radio color="success" />}
                          sx={{ mb: 2 }}
                          label={
                            <>
                              <Typography variant="body2">
                                Update the entire video course
                              </Typography>

                              <Typography
                                variant="body2"
                                color={"text.secondary"}
                              >
                                Good when the previously uploaded course is
                                outdated, poorly rated or contains many
                                inconsistences.
                              </Typography>
                            </>
                          }
                        />
                        <FormControlLabel
                          value={"delete"}
                          control={<Radio color="warning" />}
                          label={
                            <>
                              <Typography variant="body2">
                                Delete the entire video course
                              </Typography>

                              <Typography
                                variant="body2"
                                color={"text.secondary"}
                              >
                                Good when the course has no student enrolled and
                                its by your choice to wipe it out from the
                                system.
                              </Typography>
                            </>
                          }
                        />
                      </RadioGroup>
                    </FormControl>

                    {/* handle upload video section or entire update */}
                    {(videoPreference === "section" ||
                      videoPreference === "update") && (
                      <React.Fragment>
                        {/* video preview mode */}
                        {isPreviewVideo ? (
                          <React.Fragment>
                            <Box className="border rounded mb-1 p-1">
                              {/* close preview */}
                              <Box
                                display={"flex"}
                                justifyContent={"flex-end"}
                                width={"100%"}
                              >
                                <IconButton onClick={handleVideoPreview}>
                                  <Close
                                    color="secondary"
                                    sx={{ width: 15, height: 15 }}
                                  />
                                </IconButton>
                              </Box>

                              {/* video box */}
                              <Box
                                display={"flex"}
                                justifyContent={"center"}
                                width={"100%"}
                              >
                                <video
                                  controls
                                  muted
                                  src={handleVideoPreviewSrc()}
                                  style={{ width: "95%" }}
                                />
                              </Box>
                              {/* video name */}
                              <Box
                                display={"flex"}
                                justifyContent={"center"}
                                mt={1}
                              >
                                <Typography
                                  variant="caption"
                                  color={"text.secondary"}
                                >
                                  {videoUpload.name}
                                </Typography>
                              </Box>
                            </Box>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {/* form for submission  */}
                            <form
                              className="mt-3"
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* display filename here if its selected */}
                              {videoUpload && (
                                <React.Fragment>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                  >
                                    <Typography
                                      variant="caption"
                                      gutterBottom
                                      color={"text.secondary"}
                                    >
                                      {videoUpload.name}
                                    </Typography>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    width={"100%"}
                                    mb={1}
                                  >
                                    <Button
                                      size="small"
                                      className="rounded"
                                      variant="text"
                                      onClick={handleVideoPreview}
                                      color="secondary"
                                      startIcon={<PlayCircleRounded />}
                                      sx={{
                                        textTransform: "lowercase",
                                      }}
                                    >
                                      preview selected video
                                    </Button>
                                  </Box>
                                </React.Fragment>
                              )}

                              <Typography
                                variant="body2"
                                gutterBottom
                                color={"text.secondary"}
                              >
                                {videoPreference === "section"
                                  ? "Select the target video that will be uploaded from your local storage. The video course section is limited to 200MB."
                                  : "Select the target video that is meant to update the entire prevously uploaded course video. video course limit is set to 2GB."}
                              </Typography>

                              {/* select video button */}
                              <Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                size="small"
                                className="w-100 mb-3"
                                tabIndex={-1}
                                startIcon={<MovieFilterRounded />}
                              >
                                select video
                                <VisuallyHiddenInput
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoChange}
                                  multiple
                                />
                              </Button>

                              {videoPreference === "update" && (
                                <React.Fragment>
                                  <Stack mt={2} gap={1}>
                                    <Typography
                                      variant="body2"
                                      color={"text.secondary"}
                                    >
                                      Provide latest topics or lectures that you
                                      have improvised in these course video.
                                      This helps students to catch up on the
                                      latest features added to the previous
                                      course.
                                    </Typography>
                                    <Box
                                      display={"flex"}
                                      alignItems={"center"}
                                      width={"100%"}
                                      gap={1}
                                    >
                                      {/* topics added autocomplete */}
                                      <Autocomplete
                                        freeSolo
                                        className="w-100"
                                        options={topicsArray} // Show available options when user types
                                        value={topic_text}
                                        onInputChange={handleTextChangeTopic}
                                        disableClearable
                                        inputValue={topic_text}
                                        disabled={isUploading}
                                        onChange={handleTextChangeTopic}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Topic name"
                                            variant={
                                              CustomDeviceIsSmall()
                                                ? "standard"
                                                : "outlined"
                                            }
                                            placeholder="django static files handling"
                                            fullWidth
                                          />
                                        )}
                                        onKeyUp={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            topic_text?.trim() !== ""
                                          ) {
                                            handleAddUpdateTopic();
                                          }
                                        }}
                                      />

                                      {/* add button */}
                                      <IconButton
                                        className="border"
                                        onClick={handleAddUpdateTopic}
                                        disabled={!topic_text || isUploading}
                                      >
                                        <Add
                                          color="primary"
                                          sx={{ width: 16, height: 16 }}
                                        />
                                      </IconButton>
                                    </Box>
                                  </Stack>

                                  {/* display  latest previous topics or lectures */}
                                  <Box mb={1}>
                                    {topicsArray.length > 0 && (
                                      <Box mt={2} mb={2}>
                                        <Box
                                          component={"ol"}
                                          bgcolor={
                                            isDarkMode ? undefined : "#f1f1f1"
                                          }
                                          className={
                                            isDarkMode ? "border" : "rounded"
                                          }
                                        >
                                          {/* available topics */}
                                          <Box
                                            display={"flex"}
                                            justifyContent={"center"}
                                            mb={1}
                                            width={"100%"}
                                          >
                                            <Typography
                                              width={"100%"}
                                              variant="caption"
                                              textTransform={"capitalize"}
                                              fontWeight={"bold"}
                                              sx={{
                                                textDecoration: "underline",
                                              }}
                                              color={"text.secondary"}
                                            >
                                              available lectures or topics
                                            </Typography>
                                          </Box>
                                          {topicsArray.map((topic, index) => (
                                            <Box
                                              display={"flex"}
                                              gap={1}
                                              key={index}
                                              alignItems={"center"}
                                            >
                                              <Typography
                                                component={"li"}
                                                variant="caption"
                                                fontWeight={"bold"}
                                                color="text.secondary"
                                              >
                                                {topic}
                                              </Typography>
                                              {/* clear or delete icon */}
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleDeleteUpdateTopic(topic)
                                                }
                                              >
                                                <Close
                                                  sx={{ width: 15, height: 15 }}
                                                />
                                              </IconButton>
                                            </Box>
                                          ))}
                                        </Box>
                                      </Box>
                                    )}
                                  </Box>
                                </React.Fragment>
                              )}

                              <Typography
                                variant="body2"
                                gutterBottom
                                mt={1}
                                color={"text.secondary"}
                              >
                                {videoPreference === "section"
                                  ? `Provide a brief description of the section video
                                on why your are doing the update, i.e the
                                problem you are solving that exists in the
                                previously uploaded course video.`
                                  : `Provide course description that conveys the contents of the newly updated video 
                                  articulating the concepts of the overall course to the students in a meaningful manner.`}
                              </Typography>

                              <TextField
                                label={
                                  videoPreference === "section"
                                    ? "Section description"
                                    : "Course description"
                                }
                                placeholder="write ..."
                                fullWidth
                                className="w-100 mb-3 mt-1"
                                required
                                multiline
                              />

                              {/* confoirmation checkbox */}
                              <FormControlLabel
                                required
                                control={
                                  <Checkbox
                                    color={
                                      videoPreference === "section"
                                        ? "primary"
                                        : "success"
                                    }
                                  />
                                }
                                label={"I confirm updating of the course"}
                              />

                              {/* begin section upload button */}
                              {videoPreference === "section" && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  type="submit"
                                  className="w-100 mt-1"
                                  onClick={handleSectionUpdate}
                                  disableElevation
                                  startIcon={<CloudUploadRounded />}
                                >
                                  {CustomDeviceSmallest()
                                    ? "begin upload"
                                    : "begin section upload"}
                                </Button>
                              )}

                              {/* begin entire course update btn */}
                              {videoPreference === "update" && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  type="submit"
                                  className="w-100 fw-bold mt-1"
                                  color="success"
                                  onClick={handleEntireCourseUpdate}
                                  disableElevation
                                  startIcon={<CloudUploadRounded />}
                                >
                                  {CustomDeviceSmallest()
                                    ? "begin Updating"
                                    : "begin course update"}
                                </Button>
                              )}
                            </form>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}

                    {/* delete the entire course */}
                    {videoPreference === "delete" && (
                      <Stack gap={2} width={"100%"}>
                        <Typography variant="body2" color="text.secondary">
                          By clicking on the delete button you confirm that the
                          course will no longer be available on the platform.
                        </Typography>

                        {/* confirmation check box */}
                        <form
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "5px",
                            width: "100%",
                          }}
                        >
                          {/* confrimation check box */}

                          <FormControlLabel
                            required
                            control={<Checkbox color="warning" />}
                            label={"I confirm permanent deletion"}
                          />

                          {/* delete btn */}
                          <Button
                            size="small"
                            variant="contained"
                            type="submit"
                            color="warning"
                            className="w-100 fw-bold"
                            onClick={handleEntireDeletion}
                            disableElevation
                            startIcon={<CloudUploadRounded />}
                          >
                            {CustomDeviceSmallest()
                              ? "begin Deletion"
                              : "begin course deletion"}
                          </Button>
                        </form>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Box>
            ) : (
              <React.Fragment>
                {/* description */}
                <Typography variant="body2" color={"text.secondary"}>
                  Track most of your uploaded courses info by the help of our
                  automatic{" "}
                  <span style={{ textDecoration: "underline" }}>
                    AI Powered{" "}
                    <InsightsRounded
                      className="mx-1"
                      sx={{ width: 22, height: 22 }}
                    />
                  </span>{" "}
                  statistical insights.
                </Typography>

                {/* table of stats */}
                <Box height={"52vh"}>
                  <TableContainer
                    sx={{
                      maxHeight: "48vh",
                      overflow: "auto",
                      // Hide scrollbar for Chrome, Safari and Opera
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      // Hide scrollbar for IE, Edge and Firefox
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                    component={Paper}
                  >
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Type</StyledTableCell>
                          <StyledTableCell align="right">Value</StyledTableCell>
                          <StyledTableCell align="right">%</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <StyledTableRow key={row.type} hover>
                            <StyledTableCell component="th" scope="row">
                              {row.type}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.value}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.percentage}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* recommendation */}
                  <Box mt={1}>
                    <Button
                      color="success"
                      className="fw-bold"
                      startIcon={<AutoAwesomeRounded />}
                      sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                    >
                      Ai Vision
                    </Button>
                  </Box>
                </Box>
              </React.Fragment>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {isEditCourse ? (
            <Button sx={{ borderRadius: "20px" }} onClick={handleCourseEdit}>
              Back
            </Button>
          ) : (
            <React.Fragment>
              <Button sx={{ borderRadius: "20px" }} onClick={handleCourseEdit}>
                Update
              </Button>
              <Button sx={{ borderRadius: "20px" }} onClick={handleCloseAlert}>
                Close
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
  );
}
