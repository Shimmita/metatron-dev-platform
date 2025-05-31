import {
  BoltRounded,
  Close,
  CloudUploadRounded,
  Done,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Modal,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { getImageMatch } from "../utilities/getImageMatch";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// styled input
const StyledInput = styled("input")({
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


const ApplyJobModal = ({
  openApplyJobModal,
  setOpenApplyJobModal,
  title,
  organisation,
  requirements,
  websiteLink,
  jobID,
  jobaccesstype,
  salary,
  skills,
  location,
  
}) => {
  const [cvUpload, setCvUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // handle cv file change
  const handleCVFile = (event) => {
    setCvUpload(event.target.files[0]);
  };

  // creating a jobItem object
  const jobItem = {
    jobID,
    applicant: {
      name: user.name,
      applicantID: user._id,
      gender: user.gender,
      country: user.country,
    },
  };

  // handle uploading of the application document
  const handleUploadDocuments = () => {
    // clear any error message
    setErrorMessage("");

    // set is uploading true
    setIsUploading(true);
    // create a form which will facilitate parsing of the file for upload to cloud
    const formData = new FormData();
    // append post body after stringify it due to form data
    formData.append("jobItem", JSON.stringify(jobItem));

    //  check if document CV, Cover Letter or both present and append
    if (cvUpload) {
      formData.append("file", cvUpload);
    }

    // performing post request
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/application/apply`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {

        // reset the current featured jobs for refetch to effect
        dispatch(resetClearCurrentJobsTop())

        // snackbar success message from the backend update redux state
        dispatch(updateCurrentSnackBar(res.data));

        // close the currently displayed modal
        handleClosingModal();
      })
      .catch(async (err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          // reload the window for it will be redirected to logout
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server Unreachable");
          return;
        }

        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // handle the closing of the modal
  const handleClosingModal = () => {
    setOpenApplyJobModal(false);
  };

  // handle country length to only two names and code label
  const handleCountryName = () => {
    const parent = location?.country?.split(" ");
    const countryCode = parent?.pop();
    const finalName = parent?.length > 2? `${parent[0]} ${parent[1]} ${countryCode}` : location?.country;
    
    return finalName;
  };


  // handle return width modal
  const handleReturnWidthModal=()=>{
    if (CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)) {
      return "60%"
    } else if (CustomDeviceTablet()){
      return "90%"
    } else if(CustomLandscapeWidest()){
      return "35%"
    }
    return "100%"
  }

  return (
    <StyledModalJob
      keepMounted
      open={openApplyJobModal}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={handleReturnWidthModal()}
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={5}
          className="shadow-lg pt-2"
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box>
              <Avatar sx={{ width: 50, height: 50 }} src={AppLogo} alt="logo" />
            </Box>

            {/*  title job application form */}
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Typography variant="body1" fontWeight={"bold"}>
              {title}
            </Typography>

             {/* org name */}
          <Typography
            variant="body2"
            color={"text.secondary"}
            textAlign={"center"}
            gutterBottom
          >
            {organisation.name}
          </Typography>

           {/* salary */}
           <Typography
                variant="body2"
                display={"flex"}
                gutterBottom
                color={"text.secondary"}
                sx={{fontSize:'small' }}
              >
                {salary}
              </Typography>

            <Typography
                variant="caption"
                display={"flex"}
                gutterBottom
                color={"text.secondary"}
              >
                {jobaccesstype?.type} | {jobaccesstype?.access} | {handleCountryName()} | {location.state}
              </Typography>

            </Box>

            {/*close icon */}
            <IconButton
              onClick={handleClosingModal}
              disabled={isUploading || errorMessage}
            >
              <Tooltip title={"close"}>
                <Close  sx={{width:20, height:20}}/>
              </Tooltip>
            </IconButton>
          </Box>


          {/* display error of missing filed if any */}
          <Box
            mt={1}
            display={"flex"}
            justifyContent={"center"}
            mb={isUploading || errorMessage ? 3 : undefined}
          >
            {errorMessage ? (
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="info"
                  onClick={() => setErrorMessage("")}
                  className="rounded-5"
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            ) : (
              isUploading && (
                <Box>
                  <CircularProgress size={"25px"} />
                </Box>
              )
            )}
          </Box>

          <Box
            mt={1}
            maxHeight={"65vh"}
            className={"px-3"}
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
            <Stack gap={2}>
              {/* about org */}
              <Stack>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  About Us
                </Typography>
                {/* about text */}
                <Typography p={1} variant="body2" color={"text.secondary"}>
                  {organisation.about}
                </Typography>
              </Stack>

              {/* skills */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Skills
                </Typography>
                {/* skills text */}
                {skills?.map((skill, index) => (
                  <Typography
                    component={"li"}
                    display={"flex"}
                    gap={2}
                    alignItems={"center"}
                    variant="body2"
                    key={index}
                    gutterBottom
                    color={"text.secondary"}
                  >
                    <Avatar
                      key={index}
                      alt={skill}
                      className="border"
                      sx={{ width: 30, height: 30 }}
                      src={getImageMatch(skill)}
                    />
                    {skill}
                  </Typography>
                ))}
              </Stack>

              {/* qualifications */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  gutterBottom
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Qualification
                </Typography>
                {/* Qualification data */}
                {requirements?.qualification.map((data) => (
                  <Typography
                    component={"li"}
                    variant="body2"
                    key={data}
                    gutterBottom
                    color={"text.secondary"}
                  >
                    {data}
                  </Typography>
                ))}
              </Stack>

              {/* Mandatory Skills */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  gutterBottom
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Job Description
                </Typography>
                {/* Qualification data */}
                {requirements?.description.map((data) => (
                  <Typography
                    component={"li"}
                    variant="body2"
                    key={data}
                    gutterBottom
                    color={"text.secondary"}
                  >
                    {data}
                  </Typography>
                ))}
              </Stack>

              {/* application section */}

              <Stack gap={1} mb={2}>
                {websiteLink === "" ? (
                  <React.Fragment>
                    {/* curriculum vitae application */}
                    <Box mb={1} mt={2}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        className="px-1"
                        color={"text.secondary"}
                      >
                        {" "}
                        Upload your latest version of Curriculum Vitae (CV) in
                        the format of PDF (.pdf) only.
                      </Typography>

                      {cvUpload && (
                        <Typography
                          gutterBottom
                          variant="body2"
                          width={"100%"}
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontWeight={"bold"}
                          color={"text.secondary"}
                        >
                          {`${cvUpload.name}`.substring(0, 30)}...
                          {`${cvUpload.name}.`.split(".")[1]}
                          <Done
                            color="success"
                            sx={{ width: 17, height: 17 }}
                          />
                        </Typography>
                      )}

                      <Box mt={1}>
                        <Button
                          component="label"
                          role={undefined}
                          variant="text"
                          disabled={errorMessage || isUploading}
                          disableElevation
                          tabIndex={-1}
                          color="success"
                          size="medium"
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                          }}
                          startIcon={<CloudUploadRounded />}
                        >
                          Upload CV
                          <StyledInput
                            type="file"
                            accept="application/pdf"
                            onChange={handleCVFile}
                            multiple
                          />
                        </Button>
                      </Box>
                    </Box>

                    {/* application btn */}
                    <Box mt={1} display={"flex"} justifyContent={"center"}>
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={!cvUpload || isUploading || errorMessage}
                        size="small"
                        color="success"
                        onClick={handleUploadDocuments}
                        endIcon={<BoltRounded />}
                        sx={{ borderRadius: "20px" }}
                        className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
                      >
                        Complete Application
                      </Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {/* job application is external */}
                    <Typography
                      variant="body2"
                      className="px-1"
                      color={"text.secondary"}
                    >
                      {" "}
                      Click the continue button below for redirection to the
                      recruiters webpage.
                    </Typography>

                    {/* application btn */}
                    <Box mt={1} display={"flex"} justifyContent={"center"}>
                      <Button
                        variant="contained"
                        disableElevation
                        size="small"
                        sx={{ borderRadius: "20px" }}
                        className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
                      >
                        Continue Application
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </StyledModalJob>
  );
};

export default ApplyJobModal;
