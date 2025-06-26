import {
  Add,
  CheckCircle,
  Close,
  CloudUploadRounded,
  DiamondRounded,
  LinkRounded,
  Work,
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
import AppLogo from "../../images/logo_sm.png";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import AllCountries from "../data/AllCountries";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import SpecialisationJobs from "../data/SpecialisationJobs";
import SubsectionJob from "../data/SubsectionJobs";
import BrowserCompress from "../utilities/BrowserCompress";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
const CurrencyControl = lazy(() => import("./CurrencyControl"));
const LocationControl = lazy(() => import("./LocationControl"));
const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));

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

// job type and accessibility
const jobTypeAccess = {
  type: ["Contract", "Full-Time","Internship"],
  access: ["Remote", "Hybrid", "Onsite"],
};
// array for image names and values
const [logoNamesOptions, logoValueOptions] = getImageMatch("", true);

const PostJobModal = ({ openModalJob, setOpenModalJob, setTextOption, isHiring=false}) => {
  const [job_title, setJobTitle] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [county, setCounty] = useState("");
  const [job_type, setJobType] = useState({ type: "", access: "" });
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("KE");
  const [job_main_doc, setJobMainDoc] = useState("");
  const [job_main_skill, setJobMainSkill] = useState([]);
  const [job_salary, setJobSalary] = useState("");
  const [job_entry_type, setJobEntryType] = useState("");
  const [job_experience, setJobExperience] = useState("");
  const [webLink, setWebLink] = useState("");
  const [poster_about, setPosterAbout] = useState("");
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [currency, setCurrency] = useState("Ksh");
  const [fileUpload, setFileUpload] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [isFileLink, setIsFileLink] = useState(false);
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [freeLogo, setFreeLogo] = useState("");
   // To hold user input text for req
    const [req_text, setReqText] = useState("");
     // To hold checked requirements as chips
    const [requirementsQual, setRequirementsQual] = useState([]);
    // Available options to display in the Autocomplete dropdown
    const options_req = []; 
    // Available options to display in the Autocomplete dropdown
    const options_desc = []; 
    // for descriptions
    const [description, setDescription] = useState([]); 
    // To hold user input text for desc
    const [desc_text, setDescText] = useState(""); 

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // get redux states
  const dispatch=useDispatch()
  const { user } = useSelector((state) => state.currentUser);

  // axios default credentials
  axios.defaults.withCredentials = true;

  //   control the country selection
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(
    AllCountries.map((val) => {
      let country = `${val.label} (${val.code})`;
      return country?.toLowerCase() !== "kenya (ke)" ? country : "";
    }).sort((a,b)=>a.localeCompare(b))
  );

  const handleAddNewCountry = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setCountry(inputValue);
      setInputValue("");
    }
  };
  // clear an country
  const handleDeleteCountry = () => {
    setCountry(null);
  };

  const handleFlagCountry = (option) => {
    let split_res = option.split(" ");
    return split_res[split_res.length - 1].substring(1, 3).toLowerCase();
  };

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
  if (job_title === "Zero Matched") {
    setShowCustomTitle(true);
    setJobTitle("");
  }

  // handle closing of custom title
  const handleCloseCustomTitle = () => {
    setShowCustomTitle(false);
    // clear
    setJobTitle("");
  };

  // handle show file link field when btn link clicked
  const handleFileUploadLink = () => {
    // clear file uploaded if any
    setFileUpload(null);
    // set true link video full
    setIsFileLink(true);
  };

  // handle closing
  const handleCloseFileUploadLink = () => {
    // clear
    setFileLink("");
    // default showing of btn upload and link
    setIsFileLink(false);
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
    if (req_text.trim() !== "") {
      // Add the inputText as a new requirement if it's not empty
      setRequirementsQual((prev) => [...prev, req_text.trim()]);
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
    if (desc_text.trim() !== "") {
      // Add the inputText as a new desc if it's not empty
      setDescription((prev) => [...prev, desc_text.trim()]);
      setDescText(""); // Clear the input field
    }
  };

  // handle when free logos is selected or changed
  const handleFreeLogoPicked = (event) => {
    // clear file preview
    setFilePreview(null);
    // update free logo value
    setFreeLogo(event.target.value);
    // update file preview for free logo
    setFilePreview(getImageMatch(event.target.value));
  };

  //   handle file change and compress the image
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // compress the file using the custom utility created
    const compressedFile = await BrowserCompress(file);

    setFileUpload(compressedFile);
    // create an object from URI of the image for local preview
    setFilePreview(URL.createObjectURL(compressedFile));
  };

  // handle core missing fields
  const handleEmptyFields = () => {
    if (!freeLogo && !fileLink && !fileUpload) {
      setErrorMessage("provide a logo");
      return false;
    }
    if (job_title?.trim() === "") {
      setErrorMessage("job title is missing");
      return false;
    }
    if (organisationName?.trim() === "") {
      setErrorMessage("organisation name is missing");
      return false;
    }

    if (!job_type.type) {
      setErrorMessage("job type field is missing");
      return false;
    }
    if (!job_type.access) {
      setErrorMessage("job accessibility field is missing");
      return false;
    }
    if (job_main_skill?.length < 1) {
      setErrorMessage("provide atleast one mandatory skill");
      return false;
    }

    if (job_main_doc?.trim() === "") {
      setErrorMessage("provide required job application docs");
      return false;
    }
    if (job_entry_type?.trim() === "") {
      setErrorMessage("provide job level of entry");
      return false;
    }
    if (job_experience?.trim() === "") {
      setErrorMessage("provide job years of experience");
      return false;
    }
    if (job_salary?.trim() === "") {
      setErrorMessage("provide monthly salary budget");
      return false;
    }

    if (county?.trim === "") {
      setErrorMessage("organization location is incomplete");
      return false;
    }
    if (country?.trim === "") {
      setErrorMessage("organization location is incomplete");
      return false;
    }

    if (job_main_doc?.toLowerCase()?.includes("no") && webLink?.trim() === "") {
      setErrorMessage("provide your website link");
      return false;
    }
    if (poster_about?.trim() === "") {
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

  // create job object
  const job = {
    title: job_title,
    organisation: {
      name: organisationName,
      about: poster_about,
    },

    jobtypeaccess: {
      type: job_type.type,
      access: job_type.access,
    },

    logo:
      !fileLink && !fileUpload
        ? freeLogo
        : !fileUpload && !freeLogo
        ? fileLink
        : "",
    skills: job_main_skill,
    requirements: {
      document: job_main_doc,
      qualification: requirementsQual,
      description,
    },
    entry: {
      level: job_entry_type,
      years: job_experience,
    },
    website: webLink,
    salary: job_salary,
    location: {
      country: location === "KE" ? "Kenya (KE)" : country,
      state: county,
    },
    my_email: user?.email,
    my_phone: user?.phone,
  };

  // handle posting of data to the backend
  const handleJobPost = () => {
    // clear any error message
    setErrorMessage("");
    // core fields not empty
    if (handleEmptyFields()) {
      // set is uploading true
      setIsUploading(true);
      // create a form which will facilitate parsing of the file for upload to cloud
      const formData = new FormData();
      // append post body after stringify it due to form data
      formData.append("job", JSON.stringify(job));

      // check if file is present then upload append it for upload
      if (fileUpload) {
        formData.append("image", fileUpload);
      }

      // performing post request, passing current userId
      axios
        .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/create`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          // update current jobs top, with the ones from backend
          dispatch(updateCurrentSnackBar(res?.data))
          // clear top jobs this will make the react refetch the top jobs
          dispatch(resetClearCurrentJobsTop())
          // close the modal
          setOpenModalJob(false)
        })
        .catch((err) => {
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
          setIsUploading(false);
        });
    }
  };

  //handle free logo
  const handleFreeLogoPick = () => {
    // free logo shown for picks
    setIsFreeLogo(true);
    // clear file upload
    setFileUpload(null);
    // false file link
    setIsFileLink(false);
    // clear any file link info
    setFileLink("");
  };

  // close freeLogo
  const handleCloseFreeLogo = () => {
    setFreeLogo("");
    setIsFreeLogo(false);

  };

 
  // close the modal
  const handleClosingJobPostModal=()=>{
    setOpenModalJob(false)
    // modal is opened from hiring page
      if(isHiring)
      {
      // avoid blank page by populating jobs default
      setTextOption("Your Jobs")
      }
  }

  // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() ||CustomLandscapeWidest() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "35%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } 
      return "100%"
    }

    // handle width of the modal, margin
      const handleModalWidth=()=>{
        if (CustomDeviceTablet() && isTabSideBar) {
          return "36%"
        } else if(CustomLandScape()){
          return "-8%"
        } else if(CustomLandscapeWidest()){
          return "-5%"
        }
      }

  return (
    <StyledModalJob
      keepMounted
      open={openModalJob}
      sx={{
        marginLeft:handleModalWidth(),
      }}
      onClose={handleClosingJobPostModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={handleReturnWidthModal()}
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={5}
          className="shadow-lg"
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
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
              {job_title.length===0 ? "Job Upload":job_title}
            </Typography>

            {/*close icon */}
            <IconButton
              onClick={handleClosingJobPostModal}
              disabled={isUploading || errorMessage}
            >
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>
            </IconButton>
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
            mb={isUploading || errorMessage ? 1 : undefined}
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
                <>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select relevant job title from the options provided.If none
                    matches select option ( zero matched ) and provide your
                    custom title for the role.
                  </Typography>

                  {/* preset job titles */}
                  <Box className="w-100 mb-3">
                    <TextField
                      required
                      disabled={isUploading}
                      select
                      value={job_title}
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
                </>
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
                      disabled={isUploading}
                      required
                      value={job_title}
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
                  disabled={isUploading}
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  required
                  id="poster_organisation"
                  label={"Organisation name"}
                  placeholder="Intrasoft Solutions"
                />
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
                  value={job_type.type}
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
                  value={job_type.access}
                  label="Job accessibility"
                  fullWidth
                  onChange={(e) =>
                    setJobType((prev) => {
                      return { ...prev, access: e.target.value };
                    })
                  }
                >
                  {jobTypeAccess.access.map((access) => (
                    <MenuItem key={access} value={access}>
                      {access}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* logo or image */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Provide organisation job logo for visibility. you may
                use the default freely provided images.
              </Typography>

              {/* preview the file uploaded from storage */}
              {(fileUpload || freeLogo) && (
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

              {/* free logos pick */}
              {isFreeLogo && (
                <Box
                  mt={1}
                  className="w-100 mb-4"
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                >
                  <TextField
                    required
                    disabled={isUploading || errorMessage}
                    select
                    value={freeLogo}
                    variant="standard"
                    label="Free logos"
                    fullWidth
                    onChange={handleFreeLogoPicked}
                  >
                    {logoNamesOptions?.map((name, index) => (
                        <MenuItem
                          key={name}
                          value={name}
                          sx={{ display: "flex", gap: 2 }}
                        >
                          {/* logo */}
                          <Avatar
                            src={logoValueOptions[index]}
                            sx={{ width: 32, height: 32 }}
                            alt=""
                          />
                          {/* name */}
                          <Typography variant="body2">{name}</Typography>
                        </MenuItem>
                      ))}
                  </TextField>

                  {/* close button */}
                  <IconButton onClick={handleCloseFreeLogo}>
                    <Tooltip title={"exit link"}>
                      <Close />
                    </Tooltip>
                  </IconButton>
                </Box>
              )}

              {!isFileLink && !isFreeLogo ? (
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  width={"100%"}
                  gap={3}
                  mb={3}
                >
                  <Button
                    variant="text"
                    disableElevation
                    disabled={isUploading}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                    onClick={handleFreeLogoPick}
                    size="medium"
                    startIcon={<DiamondRounded />}
                  >
                    Free
                  </Button>

                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    disableElevation
                    tabIndex={-1}
                    size="medium"
                    disabled={isUploading}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Upload
                    <StyledInput
                      type="file"
                      accept="image/*,"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Button>

                  <Button
                    variant="text"
                    disableElevation
                    disabled={isUploading}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                    onClick={handleFileUploadLink}
                    size="medium"
                    startIcon={<LinkRounded />}
                  >
                    Link
                  </Button>
                </Box>
              ) : (
                <Box>
                  {!isFreeLogo && (
                    <Box>
                      {/* link from external source */}
                      {/* preview the file link */}
                      {(fileLink?.trim() !== null ||
                        fileLink?.trim() !== "") && (
                        <Box mt={3} display={"flex"} justifyContent={"center"}>
                          <img
                            src={fileLink}
                            alt=""
                            className="rounded"
                            style={{
                              maxWidth: 100,
                            }}
                          />
                        </Box>
                      )}

                      <Box
                        mt={1}
                        className="w-100 mb-4"
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                      >
                        <TextField
                          required
                          variant="standard"
                          type="url"
                          disabled={isUploading}
                          value={fileLink}
                          label={`Logo link`}
                          placeholder="https://...."
                          fullWidth
                          onChange={(e) => setFileLink(e.target.value)}
                        />

                        {/* close button */}
                        <IconButton onClick={handleCloseFileUploadLink}>
                          <Tooltip title={"exit link"}>
                            <Close />
                          </Tooltip>
                        </IconButton>
                      </Box>
                    </Box>
                  )}
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
                  value={job_main_skill}
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
                  disabled={isUploading}
                  select
                  value={job_main_doc}
                  label="Mandatory documents"
                  fullWidth
                  onChange={(e) => setJobMainDoc(e.target.value)}
                >
                  {SubsectionJob?.Document_Req.map((documents_req) => (
                      <MenuItem key={documents_req} value={documents_req}>
                        <small style={{ fontSize: "small" }}>
                          {documents_req}
                        </small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              {/* display website url if no is selected */}

              {job_main_doc.toLowerCase().includes("no") && (
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
                  value={job_entry_type}
                  label="Preferred level of entry"
                  fullWidth
                  onChange={(e) => setJobEntryType(e.target.value)}
                >
                  {SubsectionJob?.Expert_Level.map((expert_level, index) => (
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
                  value={job_experience}
                  label="Minimum years of experience"
                  fullWidth
                  onChange={(e) => setJobExperience(e.target.value)}
                >
                  {SubsectionJob?.Expert_Years?.map(
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

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Select your monthly budget salary for this role, default salary
                provided is in Kenyan Shillings (KES) and can be switched to
                Dollars as the currency of payment.
              </Typography>

              {/* Salary */}
              <Box className="w-100 mb-3">
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  mb={1}
                  alignItems={"center"}
                >
                  <CurrencyControl
                    setCurrency={setCurrency}
                    isDisabled={isUploading || errorMessage}
                  />
                </Box>

                {currency === "Ksh" ? (
                  <TextField
                    required
                    select
                    disabled={isUploading}
                    value={job_salary}
                    label="Monthly budget salary (Ksh)"
                    fullWidth
                    onChange={(e) => setJobSalary(e.target.value)}
                  >
                    {SubsectionJob?.SalaryKES.map((salary) => (
                        <MenuItem key={salary} value={salary}>
                          <small style={{ fontSize: "small" }}>{salary}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <TextField
                    required
                    select
                    disabled={isUploading}
                    value={job_salary}
                    label="Monthly budget salary (USD)"
                    fullWidth
                    onChange={(e) => setJobSalary(e.target.value)}
                  >
                    {SubsectionJob?.SalaryDollar.map((salary) => (
                        <MenuItem key={salary} value={salary}>
                          <small style={{ fontSize: "small" }}>{salary}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              </Box>

              {/* Location  */}
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Where is your organisation workplace based, default location is
                Kenya and can be switched to another location supposed you are
                based in a different country.
              </Typography>

              <Box className="mb-3">
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  mb={1}
                  alignItems={"center"}
                >
                  <LocationControl
                    setLocation={setLocation}
                    setCountry={setCountry}
                    setCounty={setCounty}
                    isDisabled={isUploading || errorMessage}
                  />
                </Box>

                {location === "KE" ? (
                  <TextField
                    select
                    required
                    disabled={isUploading}
                    value={county}
                    label="Location"
                    fullWidth
                    onChange={(e) => setCounty(e.target.value)}
                  >
                    {CountiesInKenya &&
                      CountiesInKenya.map((county) => (
                        <MenuItem key={county} value={county}>
                          <small style={{ fontSize: "small" }}> {county}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <Stack gap={3}>
                    <Autocomplete
                      value={country}
                      disabled={isUploading}
                      onChange={(event, newValue) => {
                        setCountry(newValue);
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      options={options}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Country"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      renderOption={(props, option) => (
                        <Typography display={"flex"} gap={1} {...props}>
                          {/* image */}
                          <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${handleFlagCountry(
                              option
                            )}.png 2x`}
                            src={`https://flagcdn.com/w20/${handleFlagCountry(
                              option
                            )}.png`}
                            alt=""
                          />
                          {/* country name */}
                          {option}
                        </Typography>
                      )}
                      renderTags={() =>
                        country ? (
                          <Chip
                            label={country}
                            onDelete={handleDeleteCountry}
                            deleteIcon={<CheckCircle />}
                          />
                        ) : null
                      }
                      noOptionsText={
                        <Chip
                          label={`Add "${inputValue}"`}
                          onClick={handleAddNewCountry}
                          icon={<CheckCircle />}
                          color="primary"
                          clickable
                        />
                      }
                    />
                    {/* state or county */}

                    {inputValue && (
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          gutterBottom
                          color={"text.secondary"}
                        >
                          Which city or state is your organisation based in{" "}
                          {inputValue}. This helps in providing the most
                          approximate location to the interested applicants.
                        </Typography>

                        <TextField
                          required
                          id="state-country"
                          value={county}
                          label={"City or State"}
                          disabled={isUploading}
                          fullWidth
                          onChange={(e) => setCounty(e.target.value)}
                        />
                      </React.Fragment>
                    )}
                  </Stack>
                )}
              </Box>

              {/* About your Org */}
              <Typography variant="body2" color={"text.secondary"}>
                Provide an about summary to the applicants concerning your
                organisation what kind of people you are, business specialisation and objectives.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 3 : 5}
                  multiline
                  disabled={isUploading}
                  contentEditable={false}
                  error={poster_about.length > 500}
                  id="About-org-required"
                  label={`About your organisation ${500 - poster_about.length}`}
                  fullWidth
                  value={poster_about}
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
                        value={req_text}
                        onInputChange={handleTextChangeReq}
                        disableClearable
                        inputValue={req_text}
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
                          if (e.key === "Enter" && req_text.trim() !== "") {
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
                      value={req_text}
                      onInputChange={handleTextChangeReq}
                      disableClearable
                      inputValue={req_text}
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
                        if (e.key === "Enter" && req_text.trim() !== "") {
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
                        value={desc_text}
                        onInputChange={handleTextChangeDesc}
                        disableClearable
                        disabled={isUploading}
                        inputValue={desc_text}
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
                          if (e.key === "Enter" && desc_text.trim() !== "") {
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
                      value={desc_text}
                      onInputChange={handleTextChangeDesc}
                      disableClearable
                      disabled={isUploading}
                      inputValue={desc_text}
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
                        if (e.key === "Enter" && desc_text.trim() !== "") {
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

              {/*  button for posting */}
              <Box mb={2} display={"flex"} justifyContent={"center"}>
                <Button
                  className="w-75 rounded-5 shadow-sm"
                  variant="contained"
                  onClick={handleJobPost}
                  disabled={isUploading || errorMessage}
                  size="small"
                >
                  Upload Job Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* show logout session expired alert */}
        <LogoutAlert
          openAlertLogout={openAlertLogout}
          setOpenAlertLogout={setOpenAlertLogout}
          title="Session Expired"
          body="Please login to complete your request,previous session has expired. We do this to deter unauthorised access to accounts."
        />
      </Box>
    </StyledModalJob>
  );
};

export default PostJobModal;
