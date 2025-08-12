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
  Divider,
  FormHelperText,
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
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";

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
  isPreview=false,
  
}) => {
  const [cvUpload, setCvUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

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
    
    return finalName.split("(")[0];
  };


  // handle return width modal
  const handleReturnWidthModal=()=>{
    if (CustomLandScape() ||CustomLandscapeWidest() || (CustomDeviceTablet() && !isTabSideBar)) {
      return "35%"
    } else if (CustomDeviceTablet()){
      return "90%"
    } 
    return "95%"
  }

   // handle width of the global search
     const handleModalWidth=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "36%"
      } else if(CustomLandScape()){
        return "-1%"
      } else if(CustomLandscapeWidest()){
        return "0%"
      }
    }

  return (
    <StyledModalJob
      keepMounted
      open={openApplyJobModal}
      onClose={handleClosingModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter:'blur(3px)',
      }}
    >
      <Box
        width={handleReturnWidthModal()}
        borderRadius={3}
        bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
        color={"text.primary"}
        sx={{
          border:  "1px solid gray",
          borderColor:'divider',
          marginLeft: handleModalWidth(),
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={3}
          className="shadow-lg pt-2"
          sx={{ 
          border:  "1px solid gray",
          borderColor:'divider',
           }}
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mr={0.8}
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
               {salary} P.M
              </Typography>

            <Typography
                variant="caption"
                display={"flex"}
                gutterBottom
                color={"text.secondary"}
              >
                {jobaccesstype?.type} | {jobaccesstype?.access} |  {location.state} | {handleCountryName()}
              </Typography>

            </Box>

            {/*close icon */}
            <IconButton
              onClick={handleClosingModal}
              disabled={isUploading || errorMessage}
               sx={{
                border:'1px solid',
                borderColor:'divider',
              }}
            >
              <Tooltip 
              title={"close"}>
                <Close  
                sx={{ 
                  width:12,
                  height:12,
                 }}
                />
              </Tooltip>
            </IconButton>
          </Box>


          {/* display error of missing filed if any */}

          {(errorMessage || isUploading) && (
             <Box
             mt={1}
             display={"flex"}
             justifyContent={"center"}
             mb={isUploading || errorMessage ? 1 : undefined}
           >
            {errorMessage && (
               <Collapse in={errorMessage || false}>
               <Alert
                 severity="info"
                 onClick={() => setErrorMessage("")}
                 className="rounded"
                 action={
                   <IconButton aria-label="close" color="inherit" size="small">
                     <Close fontSize="inherit" />
                   </IconButton>
                 }
               >
                  <FormHelperText>{errorMessage}</FormHelperText>
               </Alert>
             </Collapse>
            )}

            {isUploading && (
              <Box>
              <CircularProgress size={"25px"} />
            </Box>
            )}
            
           </Box>
          )}

          {/* divider */}
          <Divider className="p-1" component={'div'}/>
         

          <Box
            mt={2}
            maxHeight={"70vh"}
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
              <Stack >
                <Typography
                 variant="caption"
                  fontWeight={"bold"}
                >
                  {" "}
                  About Us
                </Typography>
                {/* about text */}
                <FormHelperText >
                  {organisation.about}
                </FormHelperText>
              </Stack>

              {/* divider */}
              <Divider component={'div'} className="p-1"/>

              {/* skills */}
              <Stack gap={1}>
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
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
                  {/* avatar */}
                    <Avatar
                      key={index}
                      alt={skill}
                      className="border"
                      sx={{ width: 30, height: 30 }}
                      src={getImageMatch(skill)}
                    />
                    {/* text */}
                    <FormHelperText>{skill}</FormHelperText>
                  </Typography>
                ))}
              </Stack>

               {/* divider */}
              <Divider component={'div'} className="p-1"/>

              {/* qualifications */}
              <Stack gap={1}>
                <Typography
                  variant="caption"
                  gutterBottom
                  fontWeight={"bold"}
                >
                  {" "}
                  Qualification
                </Typography>
                {/* Qualification data */}
                {requirements?.qualification.map((data) => (
                 
                   <FormHelperText
                    key={data}
                    className="mb-1"
                    component={'li'}>{
                      data}
                    </FormHelperText>
                ))}
              </Stack>

               {/* divider */}
              <Divider component={'div'} className="p-1"/>

              {/* Job Description */}
              <Stack gap={1}>
                <Typography
                  variant="caption"
                  gutterBottom
                  fontWeight={"bold"}
                >
                  {" "}
                  Job Description
                </Typography>
                {/* Qualification data */}
                {requirements?.description.map((data) => (
                 <FormHelperText
                    key={data}
                    className="mb-1"
                    component={'li'}>{
                      data}
                  </FormHelperText>
                ))}
              </Stack>

              {/* don't show action btns in preview mode */}

              {!isPreview && (
                <React.Fragment>
                  {/* divider */}
              <Divider component={'div'} className="p-1"/>

              {/* application section */}
              <Stack gap={1} mb={2}>
                {websiteLink === "" ? (
                  <React.Fragment>
                    {/* curriculum vitae application */}
                    <Box mb={1} >
                   
                    <FormHelperText
                    className="mb-1 px-1"
                    >
                     Upload your latest version of Curriculum Vitae (CV) in
                     the format of PDF only.
                    </FormHelperText>
                        
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
                      >
                        Continue Application
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Stack>
                </React.Fragment>
              )}
             
            </Stack>
          </Box>
        </Box>
      </Box>
    </StyledModalJob>
  );
};

export default ApplyJobModal;
