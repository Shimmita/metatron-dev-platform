import { Add, Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
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
import CountiesInKenya from "../data/Counties";
import SpecialisationJobs from "../data/SpecialisationJobs";
import SubsectionJob from "../data/SubsectionJobs";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomModalHeight from "../utilities/CustomModalHeight";
import FileInputToggle from "./FileInputToggle";

const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
  marginLeft: CustomDeviceTablet() && "34%",
});

const PostJobModal = ({ openModalJob, setOpenModalJob }) => {
  const [job_category, setJobCategory] = useState("");
  const [job_poster, setJobPoster] = useState("");
  const [county, setCounty] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [imagePath, setImagePath] = useState();
  const [job_main_doc, setJobMainDoc] = useState("");
  const [job_minor_doc, setJobMinorDoc] = useState("");
  const [job_main_skill, setJobMainSkill] = useState("");
  const [job_minor_skill, setJobMinorSkill] = useState("");
  const [job_salary, setJobSalary] = useState("");
  const [job_entry_type, setJobEntryType] = useState("");
  const [job_experience, setJobExperience] = useState("");
  const [poster_about, setPosterAbout] = useState("");
  const [job_description, setJobDescription] = useState("");
  const [poster_phone, setPosterPhone] = useState("");
  const [poster_email, setPosterEmail] = useState("");

  // control showing of the the input of the file either URL or from filesystem
  const [isURImageLogo, setIsUrlImageLogo] = React.useState(true);

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  return (
    <StyledModalJob
      keepMounted
      open={openModalJob}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={window.screen.availWidth < 600 ? "100%" : 560}
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          marginRight: CustomDeviceTablet() ? 1 : CustomLandScape() ? 2 : null,
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
            <Tooltip title={"post"}>
              <Button
                startIcon={<Add />}
                className="w-50 rounded-5 shadow-sm"
                variant="contained"
                disabled={!(job_poster.length > 0 && job_category.length > 0)}
                size="small"
              >
                Post Job
              </Button>
            </Tooltip>

            {/*close icon */}
            <Tooltip title={"close"}>
              <IconButton onClick={(e) => setOpenModalJob(false)}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider component={"div"} className="p-2 border-success" />
          <Box
            maxHeight={CustomModalHeight()}
            sx={{
              overflowX: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",

              // paddingLeft: window.screen.availWidth<370 && '20%'
            }}
          >
            <Box
              className="p-1"
              display={"flex"}
              flexDirection={"column"}
              gap={2}
            >
              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Businness or Organisation name
              </Typography>
              {/* poster/organisation */}
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

              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide IT/Tech industry category for this job
              </Typography>
              {/* Category Job */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  value={job_category}
                  label="Your job specialisation"
                  fullWidth
                  onChange={(e) => setJobCategory(e.target.value)}
                >
                  {SpecialisationJobs &&
                    SpecialisationJobs.map((job_type, index) => (
                      <MenuItem key={index} value={job_type}>
                        <small style={{ fontSize: "small" }}>{job_type}</small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Job title that will be seen by applicants
              </Typography>
              {/* Job Title */}
              <Box className="mb-3 mt-2 ">
                <TextField
                  fullWidth
                  required
                  value={job_title}
                  onChange={(e) => setJobTitle(e.target.value)}
                  id="job_title"
                  label={"Your job title "}
                  placeholder="Backend Developer/CyberSec Engineer/Machine Learning Engineer"
                />
              </Box>
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                What skills are <span className="fw-bold">must have </span>
                during application.
              </Typography>
              {/* Mandatory/Must Have Skills */}
              <Box className="mb-3 mt-2 ">
                <TextField
                  fullWidth
                  required
                  multiline
                  value={job_main_skill}
                  onChange={(e) => setJobMainSkill(e.target.value)}
                  maxRows={4}
                  id="job_title"
                  label={"Mandatory skills (comma separated 5 max)"}
                  placeholder={
                    "CI/CD, Programming Language-Name, Linux, HTML/CSS, Database Name, Frontend-Framework-Name, Backend-Framework-Name, AWS, Azure, GCP, Containerisation, Neural Networks,CUDA, NLP, Machine Learning, Figma, EDA, ETL"
                  }
                />
              </Box>

              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                What skills are <span className="fw-medium">nice to have</span>{" "}
                during application
              </Typography>

              {/* Nice to have Skills */}
              <Box className="mb-3 mt-2 ">
                <TextField
                  fullWidth
                  required
                  value={job_minor_skill}
                  onChange={(e) => setJobMinorSkill(e.target.value)}
                  multiline
                  maxRows={4}
                  id="job_title"
                  label={"Bonus Skills (comma separated 5 max)"}
                  placeholder={
                    "CI/CD, Programming Language-Name, Linux, HTML/CSS, Database Name, Frontend-Framework-Name, Backend-Framework-Name, AWS, Azure, GCP, Containerisation, Neural Networks,CUDA, NLP, Machine Learning, Figma, EDA, ETL"
                  }
                />
              </Box>
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Select the <span className="fw-bold">mandatory documents</span>{" "}
                applicants should provide during the application process. If You
                have a website link where the application for this role is to be
                conducted then, select (No, I have Website Link for Job
                Application)
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
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                What{" "}
                <span className="fw-medium">other additional documents</span>{" "}
                applicants should provide during the application process. If You
                have a website link where the application for this role is to be
                conducted then select (No, I have Website Link for Job
                Application)
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
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                What is the level of entry for this job
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
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                How many years of experience is required
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

              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Whats your monthly budget salary range
              </Typography>

              {/* Salary */}
              <Box className="w-100 mb-3">
                <TextField
                  required
                  select
                  value={job_salary}
                  label="Monthly budget salary range (Ksh)"
                  fullWidth
                  onChange={(e) => setJobSalary(e.target.value)}
                >
                  {SubsectionJob &&
                    SubsectionJob.Salary.map((salary, index) => (
                      <MenuItem key={index} value={salary}>
                        <small style={{ fontSize: "small" }}>{salary}</small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              {/* Website */}
              {/* <Box className="mb-3">
                  <TextField
                    fullWidth
                    id="website_link"
                    label={"Organisation Website Link (optional)"}
                    placeholder=" https://www.Intrasoft.co.ke"
                  />
                </Box> */}
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide a logo for your organization
              </Typography>
              {/* Org Logo/Image */}
              <Box className="mb-3 border rounded p-1">
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={1}
                >
                  {/* Image/Logo from link from Internet */}
                  {isURImageLogo ? (
                    <Typography variant="body2" color={"text.secondary"}>
                      Organisation's Logo Link (optional)
                    </Typography>
                  ) : (
                    <Typography variant="body2" color={"text.secondary"}>
                      Organisation's Logo (optional)
                    </Typography>
                  )}

                  <Box>
                    <FileInputToggle setIsUrl={setIsUrlImageLogo} />
                  </Box>
                </Box>

                {/* show input from filesystem or URL */}
                {isURImageLogo ? (
                  <Box>
                    <input
                      required
                      value={imagePath}
                      type="url"
                      onChange={(e) => setImagePath(e.target.value)}
                      placeholder="https://www.my-org-logo-or-image-link-url"
                      className="form-control rounded-0"
                    />
                  </Box>
                ) : (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                    />
                  </Box>
                )}
              </Box>
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Where is your organisation workplace based
              </Typography>

              {/* County/Location  */}
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
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide an About summary to the applicants concerning your
                organisation what kind of people you are.
              </Typography>

              {/* About your Org */}
              <Box className="mb-3">
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 2 : 3}
                  maxRows={4}
                  multiline
                  contentEditable={false}
                  error={poster_about.length > 300}
                  id="About-org-required"
                  label={
                    <p>
                      {`description about your org ${
                        300 - poster_about.length + " Characters"
                      }`}
                      *
                    </p>
                  }
                  fullWidth
                  value={job_description}
                  onChange={(e) => setPosterAbout(e.target.value)}
                  placeholder="We are Tech enthusiasts mainly specialised in bridging the gap between A and B..."
                />
              </Box>
              <Divider component={"div"} className="mb-2 p-1 border-success" />

              <Typography
                component={"li"}
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide your Job description highlighting the key details of
                work an applicant is expected to perform in the field suppose
                they get selected.
              </Typography>

              {/* Job Description */}
              <Box className="mb-3">
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 2 : 5}
                  multiline
                  contentEditable={false}
                  error={job_description.length > 500}
                  id="Descr-job-required"
                  label={
                    <p>
                      {`Job decription core details ${
                        500 - job_description.length + " characters"
                      }`}
                      *
                    </p>
                  }
                  fullWidth
                  value={job_description}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={
                    "- Writing testable and maintainable code \n- Deploying mobile apps to Play Store or Apple Store.\n- Checking bugs in the code base and fixing them.\n- Integrating ML/AI APIs into our Software Products."
                  }
                />
              </Box>

              <Divider component={"div"} className="mb-2 p-1 border-success" />

              {/* Job verification and validation contacts  */}
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                gutterBottom
                p={1}
              >
                N/B: This Job post may need to undergoe verification and
                validation process before getting approved and published on the
                platform. Please provide contacts that will facilitate our
                techinical support team to reach out and get in touch with you.
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
                  label={"Provide your active phone number"}
                  placeholder="+254723679865"
                />
              </Box>

              {/* Email */}
              <Box className="mb-1">
                <TextField
                  fullWidth
                  value={poster_email}
                  onChange={(e) => setPosterEmail(e.target.value)}
                  required
                  type="email"
                  id="email"
                  label={"Provide your active email address"}
                  placeholder="youremail@yahoo.com"
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
