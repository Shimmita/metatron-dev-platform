import {
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
  const [relevant_title, setRelevantTitle] = useState("");
  const [job_poster, setJobPoster] = useState("");
  const [county, setCounty] = useState("");
  const [job_main_doc, setJobMainDoc] = useState("");
  const [job_minor_doc, setJobMinorDoc] = useState("");
  const [job_main_skill, setJobMainSkill] = useState([]);
  const [job_minor_skill, setJobMinorSkill] = useState([]);
  const [job_salary, setJobSalary] = useState("");
  const [job_entry_type, setJobEntryType] = useState("");
  const [job_experience, setJobExperience] = useState("");
  const [webLink, setWebLink] = useState("");
  const [poster_about, setPosterAbout] = useState("");
  const [job_description, setJobDescription] = useState("");
  const [poster_phone, setPosterPhone] = useState("");
  const [poster_email, setPosterEmail] = useState("");
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [currency, setCurrency] = useState("Ksh");
  const [fileUpload, setFileUpload] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [isFileLink, setIsFileLink] = useState(false);

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

  const handleChangeMinorSkills = (_, newValue) => {
    if (newValue.length > 5) {
      return; // Limit to 5 selections
    }
    setJobMinorSkill(newValue);
  };

  const handleDeleteMinorSkills = (skillToDelete) => {
    setJobMinorSkill((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  // handle showing of the custom title when selection is zero matched
  if (relevant_title === "Zero Matched") {
    setShowCustomTitle(true);
    setRelevantTitle("");
  }

  // handle closing of custom title
  const handleCloseCustomTitle = () => {
    setShowCustomTitle(false);
    // clear
    setRelevantTitle("");
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
            ? "70%"
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
              <Avatar sx={{ width: 60, height: 60 }} src={AppLogo} alt="logo" />
            </Box>

            {/*  button for posting */}
            <Button
              startIcon={<Work />}
              className="w-50 rounded-5 shadow-sm"
              variant="contained"
              disabled={!(job_poster.length > 0 && relevant_title.length > 0)}
              size="small"
            >
              Post Job
            </Button>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalJob(false)}>
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>
            </IconButton>
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
            <Box display={"flex"} flexDirection={"column"} gap={3} mt={2}>
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
                  value={job_poster}
                  onChange={(e) => setJobPoster(e.target.value)}
                  required
                  id="poster_organisation"
                  label={"Your organisation name"}
                  placeholder="Intrasoft Solutions"
                />
              </Box>

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
                      value={relevant_title}
                      label="Select preferred job title"
                      fullWidth
                      onChange={(e) => setRelevantTitle(e.target.value)}
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
                      value={relevant_title}
                      onChange={(e) => setRelevantTitle(e.target.value)}
                      id="job_title"
                      label={"Prefered job title "}
                    />

                    <IconButton onClick={handleCloseCustomTitle}>
                      <Close />
                    </IconButton>
                  </Box>
                </>
              )}

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
                {job_main_skill.length >= 5 && (
                  <Typography mb={1} color={"red"}>
                    {" "}
                    You can select up to 5 skills only.
                  </Typography>
                )}
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
                What technical skills are{" "}
                <span className="fw-medium"> not a must but nice to have</span>{" "}
                during the application. These are the skills which an applicant
                may posess as a bonus.
              </Typography>

              {/* Nice to have Skills */}
              <Box mb={3} mt={2}>
                {job_minor_skill.length >= 5 && (
                  <Typography mb={1} color={"red"}>
                    {" "}
                    You can select up to 5 skills only.
                  </Typography>
                )}
                <Autocomplete
                  multiple
                  options={AllSkills}
                  value={job_minor_skill}
                  onChange={handleChangeMinorSkills}
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Minor Skills 5 Max *"
                      placeholder="Skill"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((skill, index) => (
                      <Chip
                        label={skill}
                        {...getTagProps({ index })}
                        onDelete={() => handleDeleteMinorSkills(skill)}
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

              {/* display this if no option not selected */}
              {!(
                job_main_doc.toLowerCase().trim().includes("no") ||
                !job_main_doc.toLowerCase().trim().includes(" ")
              ) && (
                <>
                  <Typography
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    What other additional or support documents applicants should
                    provide during the application process.This could be of help
                    in validation of the applicants truth claims about who they
                    are or what they have achieved in a CV. If support documents
                    are required atleast one will be enquired from the
                    applicants in order for their job application to be
                    successful. When the optional field is selected, the
                    applicants will have a choice of submitting support
                    documents or not.
                  </Typography>

                  {/* Docs Support */}
                  <Box className="w-100 mb-3">
                    <TextField
                      required
                      select
                      value={job_minor_doc}
                      label="Other application documents"
                      fullWidth
                      onChange={(e) => setJobMinorDoc(e.target.value)}
                    >
                      {SubsectionJob &&
                        SubsectionJob.Document_Support.map(
                          (documents_support, index) => (
                            <MenuItem key={index} value={documents_support}>
                              <small style={{ fontSize: "small" }}>
                                {documents_support}
                              </small>
                            </MenuItem>
                          )
                        )}
                    </TextField>
                  </Box>
                </>
              )}

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

              <Box className="mb-3">
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
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

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
              >
                Provide your full job description highlighting the key details
                of work an applicant will be entitled to perform in the field or
                workplace arena suppose they got selected as being the ideal
                candidate(s) for the role{" "}
                <span className="fw-bold"> {relevant_title}</span>.
              </Typography>

              {/* Job Description */}
              <Box className="mb-3">
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  contentEditable={false}
                  error={job_description.length > 1000}
                  id="Descr-job-required"
                  label={`job description details ${
                    1000 - job_description.length
                  }`}
                  fullWidth
                  value={job_description}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={
                    "- Writing testable and maintainable code \n- Deploying mobile apps to Play Store or Apple Store.\n- Checking bugs in the code base and fixing them.\n- Integrating ML/AI APIs into our Software Products."
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalJob>
  );
};

export default PostJobModal;
