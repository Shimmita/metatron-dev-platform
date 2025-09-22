import {
  Add,
  Close,
  UpdateTwoTone
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../../images/logo_sm.png";
import AllSkills from "../../data/AllSkillsData";
import SpecialisationJobs from "../../data/SpecialisationJobs";
import SpecialisationTech from "../../data/SpecialisationTech";
import SubsectionJob from "../../data/SubsectionJobs";
import CourseIcon from "../../utilities/CourseIcon";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import CustomLandScape from "../../utilities/CustomLandscape";
import CustomLandscapeWidest from "../../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../../utilities/getImageMatch";
import { updateCurrentSuccessRedux } from "../../../redux/CurrentSuccess";
const LogoutAlert = lazy(() => import("../../alerts/LogoutAlert"));

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


// job type and accessibility
const jobTypeAccess = {
  type: ["Contract", "Full-Time","Internship"],
  access: ["Remote", "Hybrid", "Onsite"],
};

// array for image names and values
const JobPostUpdateModal = ({ openModalJob, setOpenModalJob, job_updated,setMyCurrentJobs}) => {
  const [jobTitle, setJobTitle] = useState(job_updated?.title);
  const [category, setCategory] = useState(job_updated?.category);
  const [organisationName, setOrganisationName] = useState(job_updated?.organisation?.name);
  const [jobType, setJobType] = useState({ type: job_updated?.jobtypeaccess?.type, access: job_updated?.jobtypeaccess?.access });
  const [jobMainDoc, setJobMainDoc] = useState(job_updated?.requirements?.document);
  const [jobMainSkill, setJobMainSkill] = useState([...job_updated?.skills]);
  const [jobEntryType, setJobEntryType] = useState(job_updated?.entry?.level);
  const [jobExperience, setJobExperience] = useState(job_updated?.entry?.years);
  const [webLink, setWebLink] = useState(job_updated?.website);
  const [posterAbout, setPosterAbout] = useState(job_updated?.organisation?.about);
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const filePreview=getImageMatch(job_updated?.logo);
  const freeLogo=job_updated?.logo;
   // To hold user input text for req
  const [reqText, setReqText] = useState("");
   // To hold checked requirements as chips
  const [requirementsQual, setRequirementsQual] = useState([...job_updated?.requirements?.qualification]);
  // Available options to display in the Autocomplete dropdown
  const options_req = []; 
  // Available options to display in the Autocomplete dropdown
  const options_desc = []; 
  // for descriptions
  const [description, setDescription] = useState([...job_updated?.requirements?.description]); 
  // To hold user input text for desc
  const [descText, setDescText] = useState(""); 

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // get redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
   const isDarkMode=currentMode==='dark'
  const handleChangeMainSkills = (_, newValue) => {
    if (newValue.length > 5) {
      return; // Limit to 5 selections
    }
    setJobMainSkill(newValue);
  };

  const handleDeleteMainSkills = (skillToDelete) => {
    setJobMainSkill((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  // handle showing of the custom title when selection is zero matched
  if (jobTitle === "Zero Matched") {
    setShowCustomTitle(true);
    setJobTitle("");
  }

  // handle closing of custom title
  const handleCloseCustomTitle = () => {
    setShowCustomTitle(false);
    // clear
    setJobTitle("");
  };

 
  // Handle input change for req
  const handleTextChangeReq = (e, value) => {
    setReqText(value);
  };

  // Handle input change for desc
  const handleTextChangeDesc = (e, value) => {
    setDescText(value);
  };

  // Handle adding req
  const handleAddRequirement = () => {
    if (reqText.trim() !== "") {
      // Add the inputText as a new requirement if it's not empty
      setRequirementsQual((prev) => [...prev, reqText.trim()]);
      setReqText(""); // Clear the input field
    }
  };

  // Handle req removal
  const handleDeleteReq = (req) => {
    setRequirementsQual((prev) => prev.filter((val) => val !== req));
  };

  // Handle desc removal
  const handleDeleteDesc = (desc) => {
    setDescription((prev) => prev.filter((val) => val !== desc));
  };

  // Handle adding desc
  const handleAddDesc = () => {
    if (descText.trim() !== "") {
      // Add the inputText as a new desc if it's not empty
      setDescription((prev) => [...prev, descText.trim()]);
      setDescText(""); // Clear the input field
    }
  };


  // handle core missing fields
  const handleEmptyFields = () => {

    if (jobTitle?.trim() === "") {
      setErrorMessage("job title is missing");
      return false;
    }
    if (organisationName?.trim() === "") {
      setErrorMessage("organisation name is missing");
      return false;
    }

     if (category?.trim() === "") {
      setErrorMessage("job specialization is missing");
      return false;
    }

    if (!jobType.type) {
      setErrorMessage("job type field is missing");
      return false;
    }
    if (!jobType.access) {
      setErrorMessage("job accessibility field is missing");
      return false;
    }
    if (jobMainSkill?.length < 1) {
      setErrorMessage("provide atleast one mandatory skill");
      return false;
    }

    if (jobMainDoc?.trim() === "") {
      setErrorMessage("provide required job application docs");
      return false;
    }
    if (jobEntryType?.trim() === "") {
      setErrorMessage("provide job level of entry");
      return false;
    }
    if (jobExperience?.trim() === "") {
      setErrorMessage("provide job years of experience");
      return false;
    }

    if (jobMainDoc?.toLowerCase()?.includes("no") && webLink?.trim() === "") {
      setErrorMessage("provide your website link");
      return false;
    }
    if (posterAbout?.trim() === "") {
      setErrorMessage("missing about field");
      return false;
    }
    if (description?.length < 1) {
      setErrorMessage("provide job description");
      return false;
    }

    if (requirementsQual?.length < 1) {
      setErrorMessage("provide qualification requirements");
      return false;
    }

    return true;
  };


 
  // close the modal
  const handleClosingJobPostModal=()=>{
    setOpenModalJob(false)
  }

  // create job object
  const jobObject = {
    title: jobTitle,
    category,
    organisation: {
      name: organisationName,
      about: posterAbout,
    },

    jobtypeaccess: {
      type: jobType.type,
      access: jobType.access,
    },

    logo:freeLogo,
    skills: jobMainSkill,
    requirements: {
      document: jobMainDoc,
      qualification: requirementsQual,
      description,
    },
    entry: {
      level: jobEntryType,
      years: jobExperience,
    },
    website: webLink,
    salary: job_updated?.salary,
    location: {
      country: job_updated?.location?.country,
      state: job_updated?.location?.state,
    },
    my_email: user?.email,
    my_phone: user?.phone,
    whitelist:job_updated?.whitelist

  };
  

  // handle posting of data to the backend
  const handleJobPostUpdate = () => {
    // clear any error message
    setErrorMessage("");
    // core fields not empty
    if (handleEmptyFields()) {
      // set is uploading true
      setIsUploading(true);
      // performing put request to update the job passing email and jobId.
      // job email and current user's email are same.
      axios
        .put(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/job/update/${job_updated?.my_email}/${job_updated?._id}`, jobObject, {
          withCredentials: true,
        })
        .then((res) => {          
          // set current job to the one returned from backend
          setMyCurrentJobs(res?.data)

          // show success update
          dispatch(updateCurrentSuccessRedux({title:'Job Update',message:'Your job has been updated successfully, all the changes are now visible to the potential job applicants.'}))

          // close the modal
          setOpenModalJob(false)
        })
        .catch( (err) => {
          //  user login session expired show logout alert
          if (err?.response?.data.login) {
            setOpenAlertLogout(true);
          }
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("Server Unreachable");
            return;
          }

          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          // false is isUploading
          setIsUploading(false);
        });
    }
  };


    // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "50%"
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
      open={openModalJob}
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
        backdropFilter:'blur(5px)',

      }}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={handleReturnWidthModal()}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={3}
          className="shadow-lg"
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
              <Avatar sx={{ width: 50, height: 50 }} src={AppLogo} alt="" />
            </Box>

            {/* job title */}
            <Typography
              variant="body2"
              width={"100%"}
              fontWeight={"bold"}
              textAlign={"center"}
            >
              {jobTitle}
            </Typography>

            {/*close icon */}
              <Tooltip title={"close"}>
            <IconButton
              onClick={handleClosingJobPostModal}
              disabled={isUploading || errorMessage}
              sx={{border:'1px solid', borderColor:'divider'}}
            >
                <Close sx={{width:15,height:15}}/>
            </IconButton>
            </Tooltip>
          </Box>

          {/* org name */}
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              variant="body2"
              width={"100%"}
              textAlign={"center"}
              color={"text.secondary"}
            >
              {organisationName}
            </Typography>{" "}
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
                  severity="warning"
                  onClick={() => setErrorMessage("")}
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
            maxHeight={"78vh"}
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
            <Box display={"flex"} flexDirection={"column"} gap={3} mt={3}>
              {/* job title */}
              {!showCustomTitle ? (
                <React.Fragment>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select relevant job title from the options provided. If none
                    matches select option (<span className="fw-bold">Zero Matched</span> ) to provide your
                    preferred title for the role.
                  </Typography>

                  {/* preset job titles */}
                  <Box className="w-100 mb-3">
                    <TextField
                      required
                      disabled
                      select
                      value={jobTitle}
                      label="Preferred job title"
                      fullWidth
                      onChange={(e) => setJobTitle(e.target.value)}
                    >
                      {SpecialisationJobs?.map((title) => (
                          <MenuItem key={title} value={title}>
                            <small style={{ fontSize: "small" }}>{title}</small>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              ) : (
                <>
                  {/* custom job title */}
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Provide preferred job title that matches your requirements
                    for the role which will target your potential applicants on
                    the platform.
                  </Typography>
                  {/* Job Title */}
                  <Box
                    className="mb-3 mt-2 "
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <TextField
                      fullWidth
                      disabled
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      id="job_title"
                      label={"Preferred job title "}
                    />

                    <IconButton onClick={handleCloseCustomTitle}>
                      <Close />
                    </IconButton>
                  </Box>
                </>
              )}

              {/* poster/organisation */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide the name of your business, organisation or company
                which will be seen by the potential job applicants on the
                platform.
              </Typography>
              <Box className="mb-3 mt-2 ">
                <TextField
                  fullWidth
                  disabled={true}
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  required
                  id="poster_organisation"
                  label={"Organisation name"}
                  placeholder="organisation name"
                />
              </Box>

               {/* job specialization */}
              <Typography variant="body2" color={"text.secondary"}>
                Provide job specialisation in the Tech or IT Industry to facilitate categorization of the job posts.
              </Typography>

              <Box className="w-100 
                mb-2 ">
                <TextField
                  required
                  select
                  disabled
                  value={category}
                  label="Specialisation"
                  fullWidth
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {SpecialisationTech?.filter((about) => about !== "None").map(
                      (about) => (
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

              {/* job type */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide the type of this job or role in reference to it being
                contract or full-time position based on your organisation
                requirements.
              </Typography>
              <Box className="mb-3 mt-2 ">
                <TextField
                  required
                  disabled={isUploading}
                  select
                  value={jobType.type}
                  label="Job type"
                  fullWidth
                  onChange={(e) =>
                    setJobType((prev) => {
                      return { ...prev, type: e.target.value };
                    })
                  }
                >
                  {jobTypeAccess.type.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* job accessibility */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide job accessibility preference in reference to it being
                remote, hybrid or onsite to help the potential applicants
                analyze their commuting capacity.
              </Typography>
              <Box className="mb-3 mt-2 ">
                <TextField
                  required
                  disabled={isUploading}
                  select
                  value={jobType.access}
                  label="Job accessibility"
                  fullWidth
                  onChange={(e) =>
                    setJobType((prev) => {
                      return { ...prev, access: e.target.value };
                    })
                  }
                >
                  {jobTypeAccess.access.map((access, index) => (
                    <MenuItem key={index} value={access}>
                      {access}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* logo or image */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide organisation logo or job logo for visibility. you may
                use the freely provided images or upload your custom image from
                local storage or link from cloud source.
              </Typography>

              {/* preview job logo file */}
              {filePreview && (
                <Box display={"flex"} justifyContent={"center"}>
                  <img
                    src={filePreview}
                    alt=""
                    className="rounded"
                    style={{
                      maxWidth: 100,
                    }}
                  />
                </Box>
              )}


              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                What technical skills are{" "}
                <span className="fw-bold">a must have </span> by the potential
                applicants before instinctive considerations of making an
                application request for the role.
              </Typography>

              {/* Mandatory/Must Have Skills */}
              <Box mb={3}>
                <Autocomplete
                  multiple
                  disabled={isUploading}
                  options={AllSkills}
                  value={jobMainSkill}
                  onChange={handleChangeMainSkills}
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Mandatory skills 5*"
                      placeholder="skill"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((skill, index) => (
                      <Chip
                        label={skill}
                        {...getTagProps({ index })}
                        onDelete={() => handleDeleteMainSkills(skill)}
                      />
                    ))
                  }
                />
              </Box>

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Select the mandatory documents applicants should provide during
                the application process. The documents sent by the applicants
                will be in the format of (pdf or docx)
              </Typography>

              {/* Document Required */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  disabled={true}
                  select
                  value={jobMainDoc}
                  label="Mandatory documents"
                  fullWidth
                  onChange={(e) => setJobMainDoc(e.target.value)}
                >
                  {SubsectionJob?.Document_Req?.map((documents_req, index) => (
                      <MenuItem key={index} value={documents_req}>
                        <small style={{ fontSize: "small" }}>
                          {documents_req}
                        </small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              {/* display website url if no is selected */}

              {jobMainDoc.toLowerCase().includes("no") && (
                <>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Please, provide an active website link where the application
                    for this role will be conducted. Malfunctioned links or fake
                    job application website links are prohibited.
                  </Typography>

                  <Box className="w-100 mb-3">
                    <TextField
                      disabled={isUploading}
                      type="url"
                      fullWidth
                      value={webLink}
                      label={"Website link"}
                      placeholder="https://www.mywebsitelink.com/job-application"
                      onChange={(e) => setWebLink(e.target.value)}
                      required
                    />
                  </Box>
                </>
              )}

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Select the level of entry for this job: This helps the
                applicants to evaluate their current position and deciding
                conclusively if they are fit for the role or not.
              </Typography>

              {/* Job Entry Level */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  disabled={isUploading}
                  select
                  value={jobEntryType}
                  label="Preferred level of entry"
                  fullWidth
                  onChange={(e) => setJobEntryType(e.target.value)}
                >
                  {SubsectionJob?.Expert_Level.map((expert_level) => (
                      <MenuItem key={expert_level} value={expert_level}>
                        <small style={{ fontSize: "small" }}>
                          {expert_level}
                        </small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Select the minimum years of experience, years of experience is a
                factor of determining the level of exposure and expertise the
                applicant has to the role or such related role.
              </Typography>
              {/* Experience Years */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  disabled={isUploading}
                  value={jobExperience}
                  label="Minimum years of experience"
                  fullWidth
                  onChange={(e) => setJobExperience(e.target.value)}
                >
                  {SubsectionJob?.Expert_Years.map(
                      (experience_years) => (
                        <MenuItem key={experience_years} value={experience_years}>
                          <small style={{ fontSize: "small" }}>
                            {experience_years}
                          </small>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              {/* About your Org */}
              <Typography variant="body2" color={"text.secondary"}>
                Provide an about summary to the applicants concerning your
                organisation what kind of people you are,business which you are
                specialized in, vision or a concise manifesto about your
                organisation. This may help potential applicants to conform to
                your business culture in advance suppose they got selected in
                the end.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 3 : 5}
                  multiline
                  disabled={isUploading}
                  contentEditable={false}
                  error={posterAbout.length > 500}
                  id="About-org-required"
                  label={`About your organisation ${500 - posterAbout.length}`}
                  fullWidth
                  value={posterAbout}
                  onChange={(e) => setPosterAbout(e.target.value)}
                  placeholder="We are Tech enthusiasts mainly specialized in bridging the gap between A and B..."
                />
              </Box>

              {/* job req */}

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide job qualification requirements in the text field below.
                Each qualification point will be added in the list of
                requirements when you click the add qualification button.
              </Typography>

              <Box className="mb-3">
                {/* large screens */}
                {!(CustomDeviceIsSmall() || CustomDeviceTablet()) ? (
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    {/* Autocomplete Text Field */}
                    <Box width={"100%"}>
                      <Autocomplete
                        freeSolo
                        options={options_req} // Show available options when user types
                        value={reqText}
                        onInputChange={handleTextChangeReq}
                        disableClearable
                        inputValue={reqText}
                        disabled={isUploading}
                        onChange={handleTextChangeReq}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Qualification"
                            variant="standard"
                            fullWidth
                          />
                        )}
                        onKeyUp={(e) => {
                          if (e.key === "Enter" && reqText.trim() !== "") {
                            handleAddRequirement();
                          }
                        }}
                      />
                    </Box>

                    <Box flex={1}>
                      <Button
                        disableElevation
                        startIcon={<Add />}
                        onClick={handleAddRequirement}
                        size="small"
                        color="success"
                        sx={{ textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <React.Fragment>
                    {/* Autocomplete Text Field */}
                    <Autocomplete
                      freeSolo
                      options={options_req} // Show available options when user types
                      value={reqText}
                      onInputChange={handleTextChangeReq}
                      disableClearable
                      inputValue={reqText}
                      disabled={isUploading}
                      onChange={handleTextChangeReq}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Qualification"
                          variant="standard"
                          fullWidth
                        />
                      )}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && reqText.trim() !== "") {
                          handleAddRequirement();
                        }
                      }}
                    />

                    <Box sx={{ marginTop: 2 }}>
                      <Button
                        disableElevation
                        startIcon={<Add />}
                        onClick={handleAddRequirement}
                        size="small"
                        color="success"
                        sx={{ textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                  </React.Fragment>
                )}

                {/* Display the added requirements */}
                {requirementsQual.length > 0 && (
                  <Box mt={2} mb={2}>
                    <Box component={"ol"} bgcolor={"#f1f1f1"}>
                      {requirementsQual.map((requirement, index) => (
                        <Box
                          display={"flex"}
                          gap={1}
                          key={index}
                          alignItems={"center"}
                        >
                          <Typography
                            component={"li"}
                            variant="body2"
                            color="text.secondary"
                          >
                            {requirement}
                          </Typography>
                          {/* clear or delete icon */}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReq(requirement)}
                          >
                            <Close sx={{ width: 15, height: 15 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* job desc */}
              <Typography
                mt={3}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Provide job description in the text field below. Each
                description point will be added in the list of job description
                details when you click the add description button.
              </Typography>

              <Box mb={5}>
                {!(CustomDeviceIsSmall() || CustomDeviceTablet()) ? (
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Box width={"100%"}>
                      <Autocomplete
                        freeSolo
                        options={options_desc} // Show available options when user types
                        value={descText}
                        onInputChange={handleTextChangeDesc}
                        disableClearable
                        disabled={isUploading}
                        inputValue={descText}
                        onChange={handleTextChangeDesc}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Description"
                            variant="standard"
                            fullWidth
                          />
                        )}
                        onKeyUp={(e) => {
                          if (e.key === "Enter" && descText.trim() !== "") {
                            handleAddDesc();
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Button
                        disableElevation
                        startIcon={<Add />}
                        onClick={handleAddDesc}
                        color="success"
                        disabled={isUploading}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <React.Fragment>
                    <Autocomplete
                      freeSolo
                      options={options_desc} // Show available options when user types
                      value={descText}
                      onInputChange={handleTextChangeDesc}
                      disableClearable
                      disabled={isUploading}
                      inputValue={descText}
                      onChange={handleTextChangeDesc}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Description"
                          variant="standard"
                          fullWidth
                        />
                      )}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && descText.trim() !== "") {
                          handleAddRequirement();
                        }
                      }}
                    />

                    <Box sx={{ marginTop: 2 }}>
                      <Button
                        disableElevation
                        startIcon={<Add />}
                        onClick={handleAddDesc}
                        color="success"
                        disabled={isUploading}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add
                      </Button>
                    </Box>
                  </React.Fragment>
                )}

                {/* Display the added desc */}
                {description.length > 0 && (
                  <Box mt={2} mb={2}>
                    <Box component={"ol"} bgcolor={"#f1f1f1"}>
                      {description.map((description, index) => (
                        <Box
                          display={"flex"}
                          gap={1}
                          key={index}
                          alignItems={"center"}
                        >
                          <Typography
                            component={"li"}
                            variant="body2"
                            color="text.secondary"
                          >
                            {description}
                          </Typography>
                          {/* clear or delete icon */}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDesc(description)}
                          >
                            <Close sx={{ width: 15, height: 15 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/*  button for updating the job */}
              <Box mb={2} display={"flex"} justifyContent={"center"}>
                <Button
                  startIcon={<UpdateTwoTone />}
                  className="rounded-5 shadow-sm"
                  variant="contained"
                  color="success"
                  onClick={handleJobPostUpdate}
                  disabled={isUploading || errorMessage}
                >
                  Update This Job Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* show logout session expired alert */}
       {openAlertLogout && (
         <LogoutAlert
         openAlertLogout={openAlertLogout}
         setOpenAlertLogout={setOpenAlertLogout}
         title="Session Expired"
         body="Please login to complete your request,session has expired."
       />
       )}
      </Box>
    </StyledModalJob>
  );
};

export default JobPostUpdateModal;
