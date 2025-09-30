import {
  BoltRounded,
  CheckCircleRounded,
  Close,
  CloudUploadRounded,
  Done,
  DownloadForOfflineRounded,
  LockRounded
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
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
import './Progress.css';
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
  isMyJob=false,
  whitelist=""
  
}) => {
  const { user } = useSelector((state) => state.currentUser);
  const [cvUpload, setCvUpload] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentButton,setCurrentButton]=useState(user?.cvLink==="" ? 0:1)

  // extract cvLink and name it cvName
  const cvName=user?.cvLink || ""
  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  const dispatch = useDispatch();

 const handleCountryJob = (job) => {
    const parent = job.split(" ");
    const finalName =
      parent.length > 2 ? `${parent[0]} ${parent[1]}` : parent[0];

    return finalName;
  };

  // based on the whitelist job filter, show/hide action btns
  const isEligible=
  whitelist==="All" ||
  whitelist===""  ||
  handleCountryJob(whitelist)===CustomCountryName(user?.country)

  // handle cv file change, upload it to the backend
  const handleCVFile = (event) => {
    // updating file for state tracking
    setCvUpload(event.target.files[0]);
    // formData
    const formData=new FormData()
    formData.append("file",event.target.files[0])

    // uploading status
    setIsUploading(true)

     // performing post request
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/cv/upload/${user?._id}`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {

        // update user details in redux, to reflect updated cv
        dispatch(updateUserCurrentUserRedux(res.data))

        // snackbar success message from the backend update redux state
        dispatch(updateCurrentSnackBar("c.v uploaded"));
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
        // set current button 
        setCurrentButton(0)
        // nullify cv upload state
        setCvUpload(null);
      });
  };

  // handle current cv btn selection
  const handleCurrentCv=()=>{
    setCurrentButton(1)
  }

  // handle current btn view cv
  const handleDownloadCv=()=>{
    // update focused btn
    setCurrentButton(2)

    // uploading status
    setIsUploading(true)
    
      axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/cv/my/download`,{cvName}, {
                  withCredentials: true,
          })
          .then((res) => {
            // open new window to download the pdf separately
            window.open(res.data,"_blank_")
          })
          .catch(async (err) => {

            //  user login session expired show logout alert
            if (err?.response?.data.login) {
              window.location.reload();
            }
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server unreachable"
              );
              return;
            }
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            setIsUploading(false);
          });

  }

 
  // handle uploading of the application document
  const handleJobApplication = () => {

      // clear any error message
    setErrorMessage("");

    // creating a jobItem object
      const jobItem = {
        jobID,
        cvName,
        applicant: {
          name: user.name,
          applicantID: user._id,
          gender: user.gender,
          country: user.country,
        },
      };

 
    // set is uploading true
    setIsUploading(true);
   
 
    // performing post request
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/application/apply`,
        jobItem,
        {
          withCredentials: true,
        }
      )
      .then((res) => {

        // reset the current featured jobs for refetch to effect
        dispatch(resetClearCurrentJobsTop())

        // snackbar success message from the backend update redux state
        dispatch(updateCurrentSnackBar(res.data));

        // update success redux to trigger alert success
        dispatch(updateCurrentSuccessRedux({title:'Job Application',message:`${res.data} job recruiter will review your application and provide feedback`}))

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


  // handle showing of website iframe
  const handleShowWebsite=()=>{
    window.open(websiteLink, "_blank")
    // close the modal
    setOpenApplyJobModal(false)
  }

 // handle calculation of skills percentage 
    const handleSkillsPercentage=()=>{
      const userSkills=user?.selectedSkills || []
      let results=0

      // loop through user skill
      for (const userSkill of userSkills) {
        if (skills.includes(userSkill)) {
          results=results+1
        }
      }

    return Math.ceil(results/skills.length*100)
      
    }


  // handle return width modal
  const handleReturnWidthModal=()=>{
    if (CustomLandScape() ||CustomLandscapeWidest() || 
    (CustomDeviceTablet() && !isTabSideBar)) {
      return "40%"
    } else if (CustomDeviceTablet()){
      return "90%"
    } 
    return "95%"
  }



  return (
    <StyledModalJob
      keepMounted
      open={openApplyJobModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter:'blur(5px)',
      }}
    >
      <Box
        width={handleReturnWidthModal()}
        borderRadius={3}
        color={"text.primary"}
        sx={{
          border:  "1px solid gray",
          borderColor:'divider',
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={3}
          className="shadow-lg"
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
            borderRadius={3}
            pt={1}
            pr={0.8}
            sx={{
            background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
            }}
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
             <Tooltip 
              title={"close"}>
            <IconButton
              onClick={handleClosingModal}
              disabled={isUploading || errorMessage}
               sx={{
                border:'1px solid',
                borderColor:'divider',
              }}
            >
                <Close  
                sx={{ 
                  width:12,
                  height:12,
                }}
                />
            </IconButton>
              </Tooltip>
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
            px={2}
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
                <Typography variant="caption" >
                  {organisation.about}
                </Typography>
              </Stack>

              {/* divider */}
              <Divider 
              component={'div'}
              className="p-1"/>

              {/* skills */}
              <Stack gap={1}>
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                >
                  {" "}
                  Skills
                </Typography>
                <Stack gap={2} 
                direction={'row'} 
                alignItems={'center'}
                justifyContent={'space-between'}
                >
                {/* skills text */}
                <Box>
                {skills?.map((skill, index) => (
                  <Box
                    component={"li"}
                    display={"flex"}
                    gap={2}
                    alignItems={"center"}
                    key={index}
                    mb={1}
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
                    <Typography variant="caption">{skill}</Typography>
                  </Box>
                ))}
                </Box>

                {/* progress */}
                <Box 
                display={'flex'} 
                width={'100%'} 
                justifyContent={'center'}>
                {/* circle */}
                <Box mr={!CustomDeviceIsSmall()? 10:undefined} className="circular-progress">
                  <Box className="inner-circle"></Box>
                  <Box className="progress-bar left"></Box>
                  <Box className="progress-bar right"></Box>
                  <Box className="progress-text">
                  <Typography
                  textAlign={'center'} 
                  fontWeight={'bold'}>
                    {handleSkillsPercentage()} %
                  </Typography>
                  <Typography>Matched</Typography>
                  </Box>
                </Box>
                </Box>

                </Stack>
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
                
                  <Typography
                    key={data}
                    gutterBottom
                    ml={2}
                    component={'li'}
                    variant="caption"
                    >
                    {data}
                    </Typography>
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
                <Typography
                    key={data}
                    gutterBottom
                    component={'li'}
                    ml={2}
                    variant="caption"
                    >
                    {data}
                    </Typography>
                ))}
              </Stack>

              {/* don't show action btns in preview mode */}

              {!isPreview && (
                <React.Fragment>
                  {/* divider */}
              <Divider component={'div'} className="p-1"/>

              {/* application section, show btn if user is eligible */}
              {!isEligible  ? (
                <Typography 
                fontWeight={'bold'}
                p={2} 
                color={'primary'} 
                variant="caption">
                Unfortunately, recruiter of this role allows only applicants from 
                their country.
                </Typography>
              ):(
                <Stack gap={1} mb={2}>
                {websiteLink === "" ? (
                  <React.Fragment>
                    {/* curriculum vitae application */}
                    <Box mb={1} >
                    <Typography
                    py={2}
                    variant="caption"
                    >
                    Upload your latest version of Curriculum Vitae (CV) in
                    the format of PDF only.
                    </Typography>
                        
                      {cvUpload ? (
                        <Box 
                        display={'flex'}
                        justifyContent={'center'}>
                        <Typography
                          mt={2}
                          variant="caption"
                          width={"100%"}
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontWeight={"bold"}
                          className="text-success"
                        >
                          {`${cvUpload.name}`.substring(0, 30)}...
                          {`${cvUpload.name}.`.split(".")[1]}
                          <Done
                            color="success"
                            sx={{ width: 17, height: 17 }}
                          />
                        </Typography>
                        </Box>
                      ):user?.cvLink!=="" ?(
                        <Box 
                        display={'flex'}
                        justifyContent={'center'}>
                        <Typography
                          variant="caption"
                          width={"100%"}
                          display={"flex"}
                          mt={2}
                          gap={2}
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontWeight={"bold"}
                          className="text-success"
                        >
                        {user?.cvLink?.split("-")[1]}
                          <Done
                            color="success"
                            sx={{ width: 17, height: 17 }}
                          />
                        </Typography>
                        </Box>
                      ):null}

                      <Divider className="pt-2"/>

                      <Box mt={1} 
                      display={'flex'}
                      justifyContent={'space-around'}
                      gap={2}
                      alignItems={'center'}>
                       {/* upload cv */}
                        <Button
                          component="label"
                          role={undefined}
                          variant={currentButton===0 ? "outlined":"text"}
                          disabled={errorMessage || isUploading}
                          disableElevation
                          tabIndex={-1}
                          size="medium"
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize:'x-small',
                            borderRadius:5
                          }}
                          startIcon={<CloudUploadRounded />}
                        >
                          {user?.cvLink==="" ? "Upload":"Update"}

                          <StyledInput
                            type="file"
                            accept="application/pdf"
                            onChange={handleCVFile}
                            single
                          />
                        </Button>

                        {/* current cv */}
                        <Button
                          component="label"
                          onClick={handleCurrentCv}
                          variant={currentButton===1 ? "outlined":"text"}
                          disabled={errorMessage || isUploading || user?.cvLink===""}
                          disableElevation
                          tabIndex={-1}
                          size="medium"
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize:'x-small',
                            borderRadius:5
                          }}
                          startIcon={<CheckCircleRounded />}
                        >
                          Current
                        
                        </Button>

                        {/* check current */}
                        <Button
                          component="label"
                          variant={currentButton===2 ? "outlined":"text"}
                          onClick={handleDownloadCv}
                          disabled={errorMessage || isUploading || user?.cvLink===""}
                          disableElevation
                          tabIndex={-1}
                          size="medium"
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize:'x-small',
                            borderRadius:5
                          }}
                          startIcon={<DownloadForOfflineRounded />}
                        >
                          View
                        </Button>
                      </Box>
                    </Box>

                      {/* divider */}
                  <Divider component={'div'} className="pb-1"/>

                    {/* application btn */}
                    <Box mt={1} display={"flex"} justifyContent={"center"}>
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={ user?.cvLink==="" || isUploading || errorMessage || isMyJob}
                        size="small"
                        onClick={handleJobApplication}
                        endIcon={isMyJob ? <LockRounded/>:<BoltRounded />}
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
                        onClick={handleShowWebsite}
                        size="small"
                        sx={{ borderRadius: "20px" }}
                      >
                        Continue Application
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Stack>
              )}
              
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
