import {
  Add,
  Close,
  CloudUploadRounded,
  LinkRounded,
  Work,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import SpecialisationJobs from "../data/SpecialisationJobs";
import SubsectionJob from "../data/SubsectionJobs";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";
import CurrencyControl from "./CurrencyControl";

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
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

const PostJobModal = ({ openModalJob, setOpenModalJob }) => {
  const [job_title, setJobTitle] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [county, setCounty] = useState("");
  const [job_main_doc, setJobMainDoc] = useState("");
  const [job_main_skill, setJobMainSkill] = useState([]);
  const [job_salary, setJobSalary] = useState("");
  const [job_entry_type, setJobEntryType] = useState("");
  const [job_experience, setJobExperience] = useState("");
  const [webLink, setWebLink] = useState("");
  const [poster_about, setPosterAbout] = useState("");
  const [poster_phone, setPosterPhone] = useState("");
  const [poster_email, setPosterEmail] = useState("");
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [currency, setCurrency] = useState("Ksh");
  const [fileUpload, setFileUpload] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [isFileLink, setIsFileLink] = useState(false);

  const [req_text, setReqText] = useState(""); // To hold user input text for req
  const [requirements, setRequirements] = useState([]); // To hold checked requirements as chips
  const options_req = []; // Available options to display in the Autocomplete dropdown
  const options_desc = []; // Available options to display in the Autocomplete dropdown
  const [description, setDescription] = useState([]); // for descriptions
  const [desc_text, setDescText] = useState(""); // To hold user input text for desc

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
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

  // handle full video when btn link clicked
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
      setRequirements((prev) => [...prev, req_text.trim()]);
      setReqText(""); // Clear the input field
    }
  };

  // Handle adding desc
  const handleAddDesc = () => {
    if (desc_text.trim() !== "") {
      // Add the inputText as a new desc if it's not empty
      setDescription((prev) => [...prev, desc_text.trim()]);
      setDescText(""); // Clear the input field
    }
  };

  // Handle req removal
  const handleDeleteReq = (req) => {
    setRequirements((prev) => prev.filter((val) => val !== req));
  };

  // Handle desc removal
  const handleDeleteDesc = (desc) => {
    setDescription((prev) => prev.filter((val) => val !== desc));
  };

  return (
    <StyledModalJob
      keepMounted
      open={openModalJob}
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)
            ? "90%"
            : CustomDeviceTablet()
            ? "100%"
            : CustomLandscapeWidest()
            ? "50%"
            : "100%"
        }
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
              {job_title}
            </Typography>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalJob(false)}>
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
              {organisation}
            </Typography>{" "}
          </Box>
          <Box
            maxHeight={CustomModalHeight()}
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
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    select a relevant job title from the enlisted choices below
                    which will be the most appropriate or a perfect match for
                    the role. If none matches then select option zero.
                  </Typography>

                  {/* preset job titles */}
                  <Box className="w-100 mb-3">
                    <TextField
                      required
                      select
                      value={job_title}
                      label="Preferred job title"
                      fullWidth
                      onChange={(e) => setJobTitle(e.target.value)}
                    >
                      {SpecialisationJobs &&
                        SpecialisationJobs.map((title, index) => (
                          <MenuItem key={index} value={title}>
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
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Provide a preferred or custom job title that will be seen by
                    the applicants. All jobs should belong or relate to the Tech
                    or IT Industry since this is our main concern in enlighting
                    technology country wide.
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
                      required
                      value={job_title}
                      onChange={(e) => setJobTitle(e.target.value)}
                      id="job_title"
                      label={"Prefered job title "}
                    />

                    <IconButton onClick={handleCloseCustomTitle}>
                      <Close />
                    </IconButton>
                  </Box>
                </>
              )}

              {/* poster/organisation */}
              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Businness or Organisation name
              </Typography>
              <Box className="mb-3 mt-2 ">
                <TextField
                  fullWidth
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  required
                  id="poster_organisation"
                  label={"Your organisation name"}
                  placeholder="Intrasoft Solutions"
                />
              </Box>

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                What technical skills are{" "}
                <span className="fw-bold">a must have </span>
                during the application. These are the mandatory core skills one
                should posess before considering to make an application and
                without them an application request is rejected or declined on
                the fly since the job depends on them absolutely 100%.
              </Typography>

              {/* Mandatory/Must Have Skills */}
              <Box mb={3} mt={2}>
                <Autocomplete
                  multiple
                  options={AllSkills}
                  value={job_main_skill}
                  onChange={handleChangeMainSkills}
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Main Skills 5 Max *"
                      placeholder="Skill"
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

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Select the mandatory documents applicants should provide during
                the application process. The documents sent by the applicants
                will be in the format of (pdf or docx)
              </Typography>

              {/* Document Required */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  value={job_main_doc}
                  label="Mandatory application documents"
                  fullWidth
                  onChange={(e) => setJobMainDoc(e.target.value)}
                >
                  {SubsectionJob &&
                    SubsectionJob.Document_Req.map((documents_req, index) => (
                      <MenuItem key={index} value={documents_req}>
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
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Please, provide an active website url or link where the
                    application for this role should be conducted. mulfunctioned
                    links or fake job application links are prohibitted and will
                    be taken as serious offense when found or reported by the
                    applicants.
                  </Typography>

                  <Box className="w-100 mb-3">
                    <TextField
                      type="url"
                      fullWidth
                      value={webLink}
                      label={"Website Application Link"}
                      onChange={(e) => setWebLink(e.target.value)}
                      required
                    />
                  </Box>
                </>
              )}

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Select the level of entry for this job: this helps the
                applicants to have a glimpse of analysing their current position
                and deciding conclusively if they are of good fit or not at a
                glance.
              </Typography>

              {/* Job Entry Level */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  value={job_entry_type}
                  label="Preferred level of entry"
                  fullWidth
                  onChange={(e) => setJobEntryType(e.target.value)}
                >
                  {SubsectionJob &&
                    SubsectionJob.Expert_Level.map((expert_level, index) => (
                      <MenuItem key={index} value={expert_level}>
                        <small style={{ fontSize: "small" }}>
                          {expert_level}
                        </small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Select the most suitable range of years of experience required:
                Years of experience helps in filtering the applicants based on
                the number of years they are exposed to a field that is similar
                or related to the posted role.
              </Typography>
              {/* Experience Years */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  value={job_experience}
                  label="Preferred years of experience"
                  fullWidth
                  onChange={(e) => setJobExperience(e.target.value)}
                >
                  {SubsectionJob &&
                    SubsectionJob.Expert_Years.map(
                      (experience_years, index) => (
                        <MenuItem key={index} value={experience_years}>
                          <small style={{ fontSize: "small" }}>
                            {experience_years}
                          </small>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Select your monthly budget salary range for this role. The
                salary provided is in Kenyan Shillings (KES). suppose your
                organisation makes payment in dollars then switch to dollars.The
                salary provided may lower or boost the morale of the best
                applicants, choose your salary wisely since many organisations
                or business corporations fail at this stage. remember the
                ironical quote "cheap things are expensive".
              </Typography>

              {/* Salary */}
              <Box className="w-100 mb-3">
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  mb={1}
                  alignItems={"center"}
                >
                  <CurrencyControl setCurrency={setCurrency} />
                </Box>

                {currency === "Ksh" ? (
                  <TextField
                    required
                    select
                    value={job_salary}
                    label="Monthly budget salary range (Ksh)"
                    fullWidth
                    onChange={(e) => setJobSalary(e.target.value)}
                  >
                    {SubsectionJob &&
                      SubsectionJob.SalaryKES.map((salary, index) => (
                        <MenuItem key={index} value={salary}>
                          <small style={{ fontSize: "small" }}>{salary}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <TextField
                    required
                    select
                    value={job_salary}
                    label="Monthly budget salary range (USD)"
                    fullWidth
                    onChange={(e) => setJobSalary(e.target.value)}
                  >
                    {SubsectionJob &&
                      SubsectionJob.SalaryDollar.map((salary, index) => (
                        <MenuItem key={index} value={salary}>
                          <small style={{ fontSize: "small" }}>{salary}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              </Box>

              {/* County/Location  */}
              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Where is your organisation workplace based. This helps Kenyan
                developers who are the potential applicants to weigh the
                variables of life on factors such as transportation or commuting
                costs and possible accomodation costs based on the previously
                selected salary budget.
              </Typography>

              <Box className="mb-3">
                <TextField
                  select
                  required
                  value={county}
                  label="Select County or Location"
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
              </Box>

              {/* logo or image */}
              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Provide a business logo or image for your organization. you are
                allowed to provide a link or choose from your device the logo of
                your choice. Logo or Image makes your job post more appealing
                and outstanding from others to the applicants in question. It's
                recommended that you provide one though it is not a must.
              </Typography>

              <Typography
                textAlign={"center"}
                variant="body2"
                gutterBottom
                color={"text.secondary"}
              >
                organisation logo or image
              </Typography>

              {fileUpload && (
                <Typography
                  gutterBottom
                  textAlign={"center"}
                  variant="body2"
                  width={"100%"}
                  color={"text.secondary"}
                >
                  {`${fileUpload.name}`.substring(0, 30)}...
                  {`${fileUpload.name}.`.split(".")[1]}
                </Typography>
              )}

              {!isFileLink ? (
                <Box
                  display={"flex"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    disableElevation
                    tabIndex={-1}
                    size="small"
                    sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Upload Logo
                    <StyledInput
                      type="file"
                      accept="image/*,"
                      onChange={(event) => setFileUpload(event.target.files[0])}
                      multiple
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    disableElevation
                    sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                    onClick={handleFileUploadLink}
                    size="small"
                    startIcon={<LinkRounded />}
                  >
                    External Link
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography
                    component={"li"}
                    variant="body2"
                    mt={3}
                    color={"text.secondary"}
                  >
                    Provide the link or url pointing to the logo or image of
                    your organisation, that is stored in the cloud
                    storage:(Google Drive, MegaDrive, DropBox or OneDrive etc).
                  </Typography>

                  <Box
                    mt={4}
                    className="w-100 mb-2"
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <TextField
                      required
                      type="url"
                      value={fileLink}
                      label={`Paste logo link`}
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
                </>
              )}

              {/* Job verification and validation contacts  */}
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                gutterBottom
              >
                Note: This job post may be required to undergoe verification and
                validation processes before getting approved and published on
                the platform. Please provide contacts that will facilitate our
                techinical support team reaching out.
              </Typography>

              {/* Email */}
              <Box className="mb-3">
                <TextField
                  fullWidth
                  required
                  type="tel"
                  value={poster_phone}
                  onChange={(e) => setPosterPhone(e.target.value)}
                  id="phone"
                  label={"Phone Number"}
                  placeholder="+254723679865"
                />
              </Box>

              {/* Email */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  value={poster_email}
                  onChange={(e) => setPosterEmail(e.target.value)}
                  required
                  type="email"
                  id="email"
                  label={"Provide Email"}
                  placeholder="youremail@gmail.com"
                />
              </Box>

              {/* About your Org */}
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide an about summary to the applicants concerning your
                organisation what kind of people you are, the business you are
                specialised in, vision or a concise manifesto about your
                organisation. This may help potential applicants to conform to
                your business culture in advance suppose they got selected in
                the end.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 3 : 5}
                  multiline
                  contentEditable={false}
                  error={poster_about.length > 500}
                  id="About-org-required"
                  label={`about your organisation ${500 - poster_about.length}`}
                  fullWidth
                  value={poster_about}
                  onChange={(e) => setPosterAbout(e.target.value)}
                  placeholder="We are Tech enthusiasts mainly specialised in bridging the gap between A and B..."
                />
              </Box>

              {/* job req */}

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Provide job qualification requirements in the text field below.
                Each qualification point will be added in the list of
                requirements when you click the add qualification button.
              </Typography>

              <Box className="mb-3">
                {/* Autocomplete Text Field */}
                <Autocomplete
                  freeSolo
                  options={options_req} // Show available options when user types
                  value={req_text}
                  onInputChange={handleTextChangeReq}
                  disableClearable
                  inputValue={req_text}
                  onChange={handleTextChangeReq}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="qualification requirement"
                      variant="outlined"
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
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    add to qualifications
                  </Button>
                </Box>

                {/* Display the added requirements */}
                {requirements.length > 0 && (
                  <Box mt={2} mb={2}>
                    <Typography
                      variant="body1"
                      color={"text.secondary"}
                      gutterBottom
                      className="w-100 text-center"
                    >
                      qualification requirements
                    </Typography>
                    <Box component={"ol"}>
                      {requirements.map((requirement, index) => (
                        <Box
                          display={"flex"}
                          gap={1}
                          key={index}
                          alignItems={"center"}
                        >
                          <Typography
                            variant="body2"
                            component={"li"}
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
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Provide job description in the text field below. Each
                description point will be added in the list of job description
                details when you click the add description button.
              </Typography>

              <Box mb={5}>
                <Autocomplete
                  freeSolo
                  options={options_desc} // Show available options when user types
                  value={desc_text}
                  onInputChange={handleTextChangeDesc}
                  disableClearable
                  inputValue={desc_text}
                  onChange={handleTextChangeDesc}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="job description"
                      variant="outlined"
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
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    add to description
                  </Button>
                </Box>

                {/* Display the added desc */}
                {description.length > 0 && (
                  <Box mt={2} mb={2}>
                    <Typography
                      variant="body1"
                      color={"text.secondary"}
                      gutterBottom
                      className="w-100 text-center"
                    >
                      job description details
                    </Typography>
                    <Box component={"ol"}>
                      {description.map((description, index) => (
                        <Box
                          display={"flex"}
                          gap={1}
                          key={index}
                          alignItems={"center"}
                        >
                          <Typography
                            variant="body2"
                            component={"li"}
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
                  startIcon={<Work />}
                  className="w-75 rounded-5 shadow-sm"
                  variant="contained"
                  disabled={!(organisation.length > 0 && job_title.length > 0)}
                  size="small"
                >
                  Upload this Job
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalJob>
  );
};

export default PostJobModal;
