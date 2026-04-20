/**
 * PostJobModal.jsx  (refactored)
 *
 * Changes vs original
 * ───────────────────
 * 1.  Removed the duplicated "Role details" SectionCard block that appeared
 *     twice in the JSX (the second copy re-declared job title + specialisation
 *     with no outer SectionTitle and caused layout duplication).
 * 2.  Added <StatusBanner> below the header — the original never rendered the
 *     error alert or CircularProgress at all.
 * 3.  Uses shared ModalShell / ModalHeader / SectionCard / SectionTitle /
 *     StatusBanner / ModalBody / StyledInput from ModalShared.jsx.
 * 4.  handleReturnWidthModal / handleModalWidth logic moved into ModalShell.
 * 5.  Minor: TextField spacing unified with SectionCard gap instead of
 *     ad-hoc mb-3 Bootstrap classes.
 */

import {
  Add,
  CheckCircle,
  Close,
  CloudUploadRounded,
  DiamondRounded,
  LinkRounded,
  WorkRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import AllCountries from "../data/AllCountries";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import SpecialisationJobs from "../data/SpecialisationJobs";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionJob from "../data/SubsectionJobs";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import { getImageMatch } from "../utilities/getImageMatch";
import {
  ModalBody,
  ModalHeader,
  ModalShell,
  SectionCard,
  SectionTitle,
  StatusBanner,
  StyledInput,
} from "./ModalShared";

const LocationControl = lazy(() => import("./LocationControl"));
const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));

// ─── Static data ──────────────────────────────────────────────────────────────

const jobTypeAccess = {
  type: ["Contract", "Full-Time", "Internship", "Volunteer"],
  access: ["Remote", "Hybrid", "Onsite"],
};

const [logoNamesOptions, logoValueOptions] = getImageMatch("", true);

// ─── Component ────────────────────────────────────────────────────────────────

const PostJobModal = ({
  openModalJob,
  setOpenModalJob,
  setTextOption,
  isHiring = false,
}) => {
  // ── form state ──────────────────────────────────────────────────────────────
  const [jobTitle, setJobTitle] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [category, setCategory] = useState("");
  const [county, setCounty] = useState("");
  const [jobType, setJobType] = useState({ type: "", access: "" });
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("KE");
  const [whitelist, setWhitelist] = useState("All");
  const [jobMainDoc, setJobMainDoc] = useState("");
  const [jobMainSkill, setJobMainSkill] = useState([]);
  const [jobSalary, setJobSalary] = useState("");
  const [jobEntryType, setJobEntryType] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [webLink, setWebLink] = useState("");
  const [posterAbout, setPosterAbout] = useState("");
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [isFileLink, setIsFileLink] = useState(false);
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [freeLogo, setFreeLogo] = useState("");
  const [other, setOther] = useState("");
  const [reqText, setReqText] = useState("");
  const [requirementsQual, setRequirementsQual] = useState([]);
  const [description, setDescription] = useState([]);
  const [descText, setDescText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // ── country autocomplete ────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState("");
  const [countryOptions, setCountryOptions] = useState(
    AllCountries.map((v) => {
      const label = `${v.label} (${v.code})`;
      return label.toLowerCase() !== "kenya (ke)" ? label : "";
    }).sort((a, b) => a.localeCompare(b))
  );

  // ── redux ───────────────────────────────────────────────────────────────────
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.currentUser);

  axios.defaults.withCredentials = true;

  // ── helpers ─────────────────────────────────────────────────────────────────

  const handleFlagCountry = (opt) => {
    const parts = opt.split(" ");
    return parts[parts.length - 1].substring(1, 3).toLowerCase();
  };

  const handleAddNewCountry = () => {
    if (inputValue && !countryOptions.includes(inputValue)) {
      setCountryOptions((prev) => [...prev, inputValue]);
      setCountry(inputValue);
      setInputValue("");
    }
  };

  // ── skill handlers ──────────────────────────────────────────────────────────

  const handleChangeMainSkills = (_, newValue) => {
    if (newValue.length > 5) return;
    setJobMainSkill(newValue);
  };

  const handleDeleteMainSkills = (skill) =>
    setJobMainSkill((prev) => prev.filter((s) => s !== skill));

  // ── custom title ────────────────────────────────────────────────────────────

  if (jobTitle === "Zero Matched") {
    setShowCustomTitle(true);
    setJobTitle("");
  }

  const handleCloseCustomTitle = () => {
    setShowCustomTitle(false);
    setJobTitle("");
  };

  // ── logo ────────────────────────────────────────────────────────────────────

  const handleFreeLogoPick = () => {
    setIsFreeLogo(true);
    setFileUpload(null);
    setIsFileLink(false);
    setFileLink("");
  };

  const handleCloseFreeLogo = () => {
    setFreeLogo("");
    setIsFreeLogo(false);
  };

  const handleFreeLogoPicked = (e) => {
    setFilePreview(null);
    setFreeLogo(e.target.value);
    setFilePreview(getImageMatch(e.target.value));
  };

  const handleFileUploadLink = () => {
    setFileUpload(null);
    setIsFileLink(true);
  };

  const handleCloseFileUploadLink = () => {
    setFileLink("");
    setIsFileLink(false);
  };

  const handleFileChange = async (e) => {
    const compressed = await BrowserCompress(e.target.files[0]);
    setFileUpload(compressed);
    setFilePreview(URL.createObjectURL(compressed));
  };

  // ── qualifications ──────────────────────────────────────────────────────────

  const handleAddRequirement = () => {
    if (reqText.trim()) {
      setRequirementsQual((prev) => [...prev, reqText.trim()]);
      setReqText("");
    }
  };

  const handleDeleteReq = (req) =>
    setRequirementsQual((prev) => prev.filter((v) => v !== req));

  // ── description ─────────────────────────────────────────────────────────────

  const handleAddDesc = () => {
    if (descText.trim()) {
      setDescription((prev) => [...prev, descText.trim()]);
      setDescText("");
    }
  };

  const handleDeleteDesc = (desc) =>
    setDescription((prev) => prev.filter((v) => v !== desc));

  // ── validation ──────────────────────────────────────────────────────────────

  const handleEmptyFields = () => {
    const checks = [
      [!freeLogo && !fileLink && !fileUpload, "Provide a company logo"],
      [!jobTitle?.trim(), "Job title is missing"],
      [!organisationName?.trim(), "Organisation name is missing"],
      [!category?.trim(), "Job specialisation is missing"],
      [!jobType.type, "Job type is missing"],
      [!jobType.access, "Job accessibility is missing"],
      [jobMainSkill.length < 1, "Provide at least one mandatory skill"],
      [!jobMainDoc?.trim(), "Required application documents are missing"],
      [!jobEntryType?.trim(), "Job level of entry is missing"],
      [!jobExperience?.trim(), "Years of experience is missing"],
      [!jobSalary?.trim(), "Monthly salary budget is missing"],
      [
        jobMainDoc?.toLowerCase()?.includes("no") && !webLink?.trim(),
        "Provide your website link",
      ],
      [!posterAbout?.trim(), "About field is missing"],
      [description.length < 1, "Provide a job description"],
      [requirementsQual.length < 1, "Provide qualification requirements"],
      [location === "Other", "Choose a valid country option"],
      [whitelist === "Specific", "Choose a valid whitelist country option"],
    ];

    for (const [condition, msg] of checks) {
      if (condition) {
        setErrorMessage(msg);
        return false;
      }
    }
    return true;
  };

  // ── submit ──────────────────────────────────────────────────────────────────

  const handleJobPost = () => {
    setErrorMessage("");
    if (!handleEmptyFields()) return;

    const job = {
      title: jobTitle,
      category: other.trim().length > 2 ? other : category,
      organisation: { name: organisationName, about: posterAbout },
      jobtypeaccess: { type: jobType.type, access: jobType.access },
      logo: !fileLink && !fileUpload ? freeLogo : !fileUpload && !freeLogo ? fileLink : "",
      skills: jobMainSkill,
      requirements: { document: jobMainDoc, qualification: requirementsQual, description },
      entry: { level: jobEntryType, years: jobExperience },
      website: webLink,
      salary: jobSalary,
      location: {
        country: location === "KE" ? "Kenya (KE)" : country,
        state: county,
      },
      my_email: user?.email,
      my_phone: user?.phone,
      whitelist,
    };

    setIsUploading(true);
    const formData = new FormData();
    formData.append("job", JSON.stringify(job));
    if (fileUpload) formData.append("image", fileUpload);

    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/create`, formData, { withCredentials: true })
      .then((res) => {
        dispatch(updateCurrentSnackBar(res?.data));
        dispatch(resetClearCurrentJobsTop());
        dispatch(
          updateCurrentSuccessRedux({
            title: "Job Uploaded",
            message: `${res.data} track your uploaded job status in the jobs section.`,
          })
        );
        setOpenModalJob(false);
      })
      .catch((err) => {
        if (err?.response?.data?.login) setOpenAlertLogout(true);
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server unreachable");
          return;
        }
        setErrorMessage(err?.response?.data);
      })
      .finally(() => setIsUploading(false));
  };

  // ── close ───────────────────────────────────────────────────────────────────

  const handleClose = () => {
    setOpenModalJob(false);
    if (isHiring) setTextOption("My Posted Jobs");
  };

  // ── reusable list display ───────────────────────────────────────────────────

  const ItemList = ({ items, onDelete }) => (
    <Box component="ol" sx={{ bgcolor: "action.hover", borderRadius: 1, mt: 1, mb: 1, pl: 3, py: 1 }}>
      {items.map((item, i) => (
        <Box key={i} display="flex" alignItems="center" gap={0.5} mb={0.5}>
          <Typography component="li" variant="body2" color="text.secondary" flex={1}>
            {item}
          </Typography>
          <IconButton size="small" onClick={() => onDelete(item)}>
            <Close sx={{ fontSize: 13 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <ModalShell open={openModalJob}>
      {/* ── Header ── */}
      <ModalHeader
        title={jobTitle || "Job Upload"}
        subtitle={organisationName || "Post a premium job opportunity"}
        onClose={handleClose}
        disableClose={isUploading || Boolean(errorMessage)}
      />

      {/* ── Error / Loading ── */}
      <StatusBanner
        errorMessage={errorMessage}
        onDismiss={() => setErrorMessage("")}
        isUploading={isUploading}
      />

      {/* ── Scrollable content ── */}
      <ModalBody>
        {/* Company ──────────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Company details</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Name of the hiring organisation visible to applicants.
          </Typography>
          <TextField
            fullWidth
            disabled={isUploading}
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
            required
            label="Organisation name"
            placeholder="Acme Corp"
          />
        </SectionCard>

        {/* Role ─────────────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Role details</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Choose a role title and specialisation to help applicants find this job faster.
          </Typography>

          {/* Title row */}
          {!showCustomTitle ? (
            <TextField
              required
              select
              fullWidth
              disabled={isUploading}
              value={jobTitle}
              label="Preferred job title"
              onChange={(e) => setJobTitle(e.target.value)}
              sx={{ mb: 2 }}
            >
              {SpecialisationJobs?.map((t) => (
                <MenuItem key={t} value={t}>
                  <Typography variant="body2">{t}</Typography>
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Box display="flex" gap={1} alignItems="center" mb={2}>
              <TextField
                fullWidth
                required
                disabled={isUploading}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                label="Custom job title"
              />
              <IconButton size="small" onClick={handleCloseCustomTitle}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Specialisation */}
          <TextField
            required
            select
            fullWidth
            disabled={isUploading}
            value={category}
            label="Specialisation"
            onChange={(e) => setCategory(e.target.value)}
          >
            {SpecialisationTech?.filter((a) => a !== "None").map((a) => (
              <MenuItem key={a} value={a} sx={{ display: "flex", gap: 1.5 }}>
                <CourseIcon option={a} />
                <Typography variant="body2">{a}</Typography>
              </MenuItem>
            ))}
          </TextField>

          {/* Custom specialisation */}
          {category.includes("Zero") && (
            <TextField
              fullWidth
              disabled={isUploading}
              value={other}
              onChange={(e) => setOther(e.target.value)}
              label="Provide other specialisation"
              placeholder="e.g. Blockchain Development"
              sx={{ mt: 2 }}
            />
          )}
        </SectionCard>

        {/* Status & visibility ──────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Status & visibility</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Set the job type and work arrangement so candidates can filter effectively.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              required
              select
              fullWidth
              disabled={isUploading}
              value={jobType.type}
              label="Job type"
              onChange={(e) => setJobType((p) => ({ ...p, type: e.target.value }))}
            >
              {jobTypeAccess.type.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              fullWidth
              disabled={isUploading}
              value={jobType.access}
              label="Work arrangement"
              onChange={(e) => setJobType((p) => ({ ...p, access: e.target.value }))}
            >
              {jobTypeAccess.access.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </SectionCard>

        {/* Branding ─────────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Branding & logo</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Add a company logo or choose a free icon for brand recognition.
          </Typography>

          {/* Preview */}
          {filePreview && (
            <Box display="flex" justifyContent="center" mb={1.5}>
              <img src={filePreview} alt="preview" style={{ maxWidth: 88, borderRadius: 8 }} />
            </Box>
          )}

          {/* Free logo picker */}
          {isFreeLogo && (
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <TextField
                select
                fullWidth
                variant="standard"
                label="Free logos"
                value={freeLogo}
                disabled={isUploading}
                onChange={handleFreeLogoPicked}
              >
                {logoNamesOptions?.map((name, i) => (
                  <MenuItem key={name} value={name} sx={{ display: "flex", gap: 1.5 }}>
                    <Avatar src={logoValueOptions[i]} sx={{ width: 28, height: 28 }} />
                    <Typography variant="body2">{name}</Typography>
                  </MenuItem>
                ))}
              </TextField>
              <IconButton size="small" onClick={handleCloseFreeLogo}>
                <Tooltip title="Remove"><Close /></Tooltip>
              </IconButton>
            </Box>
          )}

          {/* Link input */}
          {isFileLink && !isFreeLogo && (
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <TextField
                fullWidth
                variant="standard"
                type="url"
                disabled={isUploading}
                value={fileLink}
                label="Logo URL"
                placeholder="https://..."
                onChange={(e) => setFileLink(e.target.value)}
              />
              <IconButton size="small" onClick={handleCloseFileUploadLink}>
                <Tooltip title="Cancel"><Close /></Tooltip>
              </IconButton>
            </Box>
          )}

          {/* Action buttons */}
          {!isFileLink && !isFreeLogo && (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                variant="outlined"
                size="small"
                disabled={isUploading}
                onClick={handleFreeLogoPick}
                startIcon={<DiamondRounded />}
                sx={{ borderRadius: 5, textTransform: "none" }}
              >
                Free
              </Button>
              <Button
                component="label"
                variant="outlined"
                size="small"
                disabled={isUploading}
                startIcon={<CloudUploadRounded />}
                sx={{ borderRadius: 5, textTransform: "none" }}
              >
                Upload
                <StyledInput type="file" accept="image/*" onChange={handleFileChange} />
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={isUploading}
                onClick={handleFileUploadLink}
                startIcon={<LinkRounded />}
                sx={{ borderRadius: 5, textTransform: "none" }}
              >
                Link
              </Button>
            </Stack>
          )}
        </SectionCard>

        {/* Skills ───────────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Required skills</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Must-have technical skills for applicants (max 5).
          </Typography>
          <Autocomplete
            multiple
            disabled={isUploading}
            options={AllSkills}
            value={jobMainSkill}
            onChange={handleChangeMainSkills}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField {...params} label="Mandatory skills" placeholder="skill" />
            )}
            renderTags={(val, getProps) =>
              val.map((skill, i) => (
                <Chip key={skill} label={skill} {...getProps({ index: i })} onDelete={() => handleDeleteMainSkills(skill)} />
              ))
            }
          />
        </SectionCard>

        {/* Application docs ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Application requirements</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Select documents applicants must submit (PDF format).
          </Typography>
          <TextField
            required
            select
            fullWidth
            disabled={isUploading}
            value={jobMainDoc}
            label="Mandatory documents"
            onChange={(e) => setJobMainDoc(e.target.value)}
          >
            {SubsectionJob?.Document_Req.map((d) => (
              <MenuItem key={d} value={d}>
                <Typography variant="body2">{d}</Typography>
              </MenuItem>
            ))}
          </TextField>

          {jobMainDoc.toLowerCase().includes("no") && (
            <TextField
              fullWidth
              disabled={isUploading}
              type="url"
              value={webLink}
              label="External application URL"
              placeholder="https://www.yoursite.com/careers"
              onChange={(e) => setWebLink(e.target.value)}
              required
              sx={{ mt: 2 }}
            />
          )}
        </SectionCard>

        {/* Experience & compensation ────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Experience & compensation</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Level of entry, minimum experience, and monthly budget.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <TextField
              required
              select
              fullWidth
              disabled={isUploading}
              value={jobEntryType}
              label="Level of entry"
              onChange={(e) => setJobEntryType(e.target.value)}
            >
              {SubsectionJob?.Expert_Level.map((l) => (
                <MenuItem key={l} value={l}><Typography variant="body2">{l}</Typography></MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              fullWidth
              disabled={isUploading}
              value={jobExperience}
              label="Min. years of experience"
              onChange={(e) => setJobExperience(e.target.value)}
            >
              {SubsectionJob?.Expert_Years?.map((y) => (
                <MenuItem key={y} value={y}><Typography variant="body2">{y}</Typography></MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            required
            select
            fullWidth
            disabled={isUploading}
            value={jobSalary}
            label="Monthly budget (USD)"
            onChange={(e) => setJobSalary(e.target.value)}
          >
            {SubsectionJob?.SalaryDollar.map((s) => (
              <MenuItem key={s} value={s}><Typography variant="body2">{s}</Typography></MenuItem>
            ))}
          </TextField>
        </SectionCard>

        {/* Location & whitelist ─────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Location & whitelist</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Organisation location and applicant country eligibility.
          </Typography>

          {/* Location toggle */}
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <LocationControl
              setLocation={setLocation}
              setCountry={setCountry}
              setCounty={setCounty}
              isDisabled={isUploading}
            />
          </Box>

          {location === "KE" ? (
            <TextField
              select
              required
              fullWidth
              disabled={isUploading}
              value={county}
              label="County / Location"
              onChange={(e) => setCounty(e.target.value)}
              sx={{ mb: 2 }}
            >
              {CountiesInKenya?.map((c) => (
                <MenuItem key={c} value={c}><Typography variant="body2">{c}</Typography></MenuItem>
              ))}
            </TextField>
          ) : (
            <Stack spacing={2} mb={2}>
              <Autocomplete
                value={country}
                disabled={isUploading}
                onChange={(_, v) => setCountry(v)}
                inputValue={inputValue}
                onInputChange={(_, v) => setInputValue(v)}
                options={countryOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Country" required fullWidth />
                )}
                renderOption={(props, option) => (
                  <Typography display="flex" gap={1} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${handleFlagCountry(option)}.png`}
                      alt=""
                    />
                    {option}
                  </Typography>
                )}
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
              {inputValue && (
                <TextField
                  required
                  fullWidth
                  disabled={isUploading}
                  value={county}
                  label="City or State"
                  onChange={(e) => setCounty(e.target.value)}
                />
              )}
            </Stack>
          )}

          {/* Whitelist */}
          <Typography variant="body2" color="text.secondary" mb={1}>
            Which countries may applicants apply from? Default: All.
          </Typography>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <LocationControl
              setLocation={setWhitelist}
              setCountry={setCountry}
              isWhiteList
              isDisabled={isUploading || Boolean(errorMessage)}
            />
          </Box>
          {whitelist !== "All" && (
            <Autocomplete
              value={country}
              disabled={isUploading}
              onChange={(_, v) => setWhitelist(v)}
              inputValue={inputValue}
              onInputChange={(_, v) => setInputValue(v)}
              options={countryOptions}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Whitelist Country" required fullWidth />
              )}
              renderOption={(props, option) => (
                <Typography display="flex" gap={1} {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${handleFlagCountry(option)}.png`}
                    alt=""
                  />
                  {option}
                </Typography>
              )}
            />
          )}
        </SectionCard>

        {/* About org ────────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>About your organisation</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            A short summary about your company — mission, culture, and focus.
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            disabled={isUploading}
            error={posterAbout.length > 500}
            label={`About (${500 - posterAbout.length} chars remaining)`}
            value={posterAbout}
            onChange={(e) => setPosterAbout(e.target.value)}
            placeholder="We are tech enthusiasts bridging the gap between..."
          />
        </SectionCard>

        {/* Qualifications ───────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Qualifications</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Each point is added to the list when you click "Add". Press Enter as a shortcut.
          </Typography>
          <Stack direction={CustomDeviceIsSmall() ? "column" : "row"} alignItems="flex-end" gap={1}>
            <Autocomplete
              freeSolo
              options={[]}
              value={reqText}
              inputValue={reqText}
              onInputChange={(_, v) => setReqText(v)}
              onChange={(_, v) => setReqText(v)}
              disableClearable
              disabled={isUploading}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Qualification" variant="standard" fullWidth />
              )}
              onKeyUp={(e) => e.key === "Enter" && reqText.trim() && handleAddRequirement()}
            />
            <Button
              size="small"
              color="success"
              startIcon={<Add />}
              onClick={handleAddRequirement}
              sx={{ textTransform: "none", whiteSpace: "nowrap" }}
            >
              Add
            </Button>
          </Stack>
          {requirementsQual.length > 0 && (
            <ItemList items={requirementsQual} onDelete={handleDeleteReq} />
          )}
        </SectionCard>

        {/* Description ──────────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle>Job description</SectionTitle>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Break the description into bullet points. Press Enter or click "Add".
          </Typography>
          <Stack direction={CustomDeviceIsSmall() ? "column" : "row"} alignItems="flex-end" gap={1}>
            <Autocomplete
              freeSolo
              options={[]}
              value={descText}
              inputValue={descText}
              onInputChange={(_, v) => setDescText(v)}
              onChange={(_, v) => setDescText(v)}
              disableClearable
              disabled={isUploading}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Description point" variant="standard" fullWidth />
              )}
              onKeyUp={(e) => e.key === "Enter" && descText.trim() && handleAddDesc()}
            />
            <Button
              size="small"
              color="success"
              startIcon={<Add />}
              onClick={handleAddDesc}
              sx={{ textTransform: "none", whiteSpace: "nowrap" }}
            >
              Add
            </Button>
          </Stack>
          {description.length > 0 && (
            <ItemList items={description} onDelete={handleDeleteDesc} />
          )}
        </SectionCard>

        {/* Submit ───────────────────────────────────────────────────── */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Button
            variant="contained"
            size="large"
            onClick={handleJobPost}
            disabled={isUploading || Boolean(errorMessage)}
            startIcon={<WorkRounded />}
            sx={{ borderRadius: 5, textTransform: "none", px: 4 }}
          >
            Upload Job Now
          </Button>
        </Box>
      </ModalBody>

      {/* Session expired alert */}
      {openAlertLogout && (
        <LogoutAlert
          openAlertLogout={openAlertLogout}
          setOpenAlertLogout={setOpenAlertLogout}
          title="Session Expired"
          body="Please log in again to complete your request."
        />
      )}
    </ModalShell>
  );
};

export default PostJobModal;