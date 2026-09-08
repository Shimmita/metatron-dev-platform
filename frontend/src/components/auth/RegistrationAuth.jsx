import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
  BusinessRounded,
  CheckCircle,
  PersonRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AlertCountry from "../alerts/AlertCountry";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertOrgCompletion from "../alerts/AlertOrgCompletion";
import AlertProfileCompletion from "../alerts/AlertProfileCompletion";
import AccountVersion from "../data/AccountVersion";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import EducationLevel from "../data/EducationLevel";
import GenderData from "../data/GenderData";
import Institutions from "../data/Institution";
import OrgSpecializations from "../data/OrgSpecializations";
import SpecialisationJobs from "../data/SpecialisationJobs";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";

const RegisterAlertTitle = lazy(() => import("./RegisterAlertTitle"));

const MAX_ABOUT = 400;

/* ─── Design tokens (shared with LoginAuth) ────────────────────────── */
const C = {
  bg:          "#050505",
  bgCard:      "rgba(255,255,255,0.045)",
  bgInput:     "rgba(255,255,255,0.06)",
  border:      "rgba(255,255,255,0.09)",
  borderFocus: "rgba(214,178,94,0.55)",
  teal:        "#D6B25E",
  tealDim:     "rgba(214,178,94,0.18)",
  tealGlow:    "rgba(214,178,94,0.28)",
  gold:        "#C8A96E",
  textPri:     "#FFFDF7",
  textSec:     "rgba(255,253,247,0.55)",
  textHint:    "rgba(255,253,247,0.32)",
  danger:      "#FF6B6B",
};

/* ─── Dot-grid backdrop ─────────────────────────────────────────────── */
const DotGrid = () => (
  <Box
    sx={{
      position: "absolute", inset: 0,
      backgroundImage:
        "linear-gradient(rgba(214,178,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(214,178,94,0.06) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), transparent 85%)",
      pointerEvents: "none",
    }}
  />
);

/* ─── Step indicator ────────────────────────────────────────────────── */
const StepDots = ({ current, total }) => (
  <Box display="flex" justifyContent="center" gap={1} mb={3}>
    {Array.from({ length: total }).map((_, i) => (
      <Box
        key={i}
        sx={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: 3,
          background: i === current ? C.teal : C.border,
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    ))}
  </Box>
);

/* ─── Shared input sx ───────────────────────────────────────────────── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: C.textPri,
    background: C.bgInput,
    borderRadius: "8px",
    transition: "box-shadow 0.25s",
    "& fieldset": { borderColor: C.border, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: C.borderFocus, borderWidth: "1px" },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${C.tealGlow}` },
  },
  "& .MuiInputLabel-root": { color: C.textHint, fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: C.teal },
  "& .MuiSelect-icon": { color: C.textHint },
  "& .MuiAutocomplete-popupIndicator": { color: C.textHint },
  "& .MuiAutocomplete-clearIndicator": { color: C.textHint },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 100px #0B0B0B inset`,
    WebkitTextFillColor: C.textPri,
  },
};

/* ─── Chip sx (skills, county, institution) ─────────────────────────── */
const chipSx = {
  background: C.tealDim,
  border: `1px solid rgba(214,178,94,0.3)`,
  color: C.teal,
  fontSize: 11,
  height: 24,
  "& .MuiChip-deleteIcon": { color: "rgba(214,178,94,0.6)", "&:hover": { color: C.teal } },
};

/* ─── Section label ─────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
    <Box sx={{ width: 16, height: 1.5, bgcolor: C.teal, borderRadius: 1 }} />
    <Typography sx={{ fontSize: 10, letterSpacing: "0.18em", color: C.teal, textTransform: "uppercase" }}>
      {children}
    </Typography>
    <Box sx={{ flex: 1, height: 1, bgcolor: C.border }} />
  </Box>
);

/* ─── Account toggle pill ───────────────────────────────────────────── */
const AccountToggle = ({ account, setAccount, AccountVersion }) => (
  <Box
    display="flex"
    sx={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${C.border}`,
      borderRadius: "8px",
      p: "4px",
      mb: 3,
    }}
  >
    {AccountVersion.map((v) => (
      <Box
        key={v}
        onClick={() => setAccount(v)}
        sx={{
          flex: 1,
          py: 1,
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          transition: "all 0.25s",
          background: account === v ? "rgba(214,178,94,0.15)" : "transparent",
          border: account === v ? `1px solid rgba(214,178,94,0.35)` : "1px solid transparent",
        }}
      >
        {v === "Personal"
          ? <PersonRounded sx={{ width: 15, height: 15, color: account === v ? C.teal : C.textHint }} />
          : <BusinessRounded sx={{ width: 15, height: 15, color: account === v ? C.teal : C.textHint }} />
        }
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: account === v ? C.teal : C.textHint }}>
          {v}
        </Typography>
      </Box>
    ))}
  </Box>
);

const OnboardingInsightPanel = () => (
  <Box
    sx={{
      display: { xs: "none", md: "flex" },
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: 620,
      p: 4,
      borderRadius: "8px",
      border: `1px solid ${C.border}`,
      background: "linear-gradient(180deg, rgba(214,178,94,0.08), rgba(139,111,42,0.08), rgba(255,255,255,0.035))",
      backdropFilter: "blur(28px)",
      boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
    }}
  >
    <Box>
      <Typography sx={{ fontSize: 11, letterSpacing: "0.2em", color: C.teal, textTransform: "uppercase", fontWeight: 900 }}>
        Metatron Dev Network
      </Typography>
      <Typography sx={{ mt: 1.5, fontSize: 34, lineHeight: 1.08, color: C.textPri, fontWeight: 900 }}>
        Create your command profile for real tech opportunities.
      </Typography>
      <Typography sx={{ mt: 2, fontSize: 14, lineHeight: 1.8, color: C.textSec }}>
        Set up a professional identity that powers gig discovery, course matching, event access, networking, and technical content.
      </Typography>
    </Box>

    <Stack spacing={1.25}>
      {[
        ["Verified profile", "Your details shape how recruiters and peers discover you."],
        ["Skill intelligence", "Selected tools help match you with relevant gigs, learning paths, and events."],
        ["Career workspace", "Move from signup into a dashboard built for practical growth and proof of work."],
      ].map(([title, body]) => (
        <Box
          key={title}
          sx={{
            borderRadius: "8px",
            border: `1px solid ${C.border}`,
            background: "rgba(255,255,255,0.045)",
            p: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 900, color: C.textPri }}>
            {title}
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>
            {body}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
);

const RegistrationProgress = ({ showNext, basicsReady, profileReady, isPersonal }) => {
  const rows = [
    { label: "Credentials", ready: basicsReady },
    { label: isPersonal ? "Career Profile" : "Organisation Profile", ready: profileReady },
    { label: "Verification", ready: false },
  ];

  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        p: 1.25,
        mb: 3,
        background: "rgba(255,255,255,0.035)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography sx={{ color: C.textSec, fontSize: 11, fontWeight: 800 }}>
          Registration progress
        </Typography>
        <Typography sx={{ color: C.teal, fontSize: 11, fontWeight: 900 }}>
          {showNext ? "Profile setup" : "Account setup"}
        </Typography>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap={0.75}>
        {rows.map((row, index) => {
          const active = showNext ? index === 1 : index === 0;
          return (
            <Box
              key={row.label}
              sx={{
                borderRadius: "8px",
                border: `1px solid ${active ? "rgba(214,178,94,0.42)" : C.border}`,
                background: row.ready ? "rgba(214,178,94,0.09)" : active ? "rgba(214,178,94,0.1)" : "transparent",
                px: 0.8,
                py: 0.75,
                minHeight: 52,
              }}
            >
              <Typography sx={{ color: active ? C.teal : C.textSec, fontSize: 10, fontWeight: 900 }}>
                {index + 1}. {row.label}
              </Typography>
              <Typography sx={{ color: row.ready ? "#D6B25E" : C.textHint, fontSize: 10 }}>
                {row.ready ? "Ready" : active ? "In progress" : "Pending"}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════ */
const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName]                         = useState("");
  const [educationLevel, setEducationLevel]     = useState("");
  const [gender, setGender]                     = useState("");
  const [specialisationTitle, setSpecialisationTitle] = useState("");
  const [email, setEmail]                       = useState("");
  const [phone, setPhone]                       = useState("");
  const [password, setPassword]                 = useState("");
  const [country, setCountry]                   = useState("");
  const [county, setCounty]                     = useState("");
  const [missingFieldMessage, setMissingFieldMessage] = useState("");
  const [openAlertGenral, setOpenAlertGenral]   = useState(false);
  const [titleAlert, setTitleAlert]             = useState();
  const [account, setAccount]                   = useState(AccountVersion[0]);
  const [selectedSkills, setSelectedSkills]     = useState([]);
  const [eduInstitution, setEduInstitution]     = useState("");
  const [eduInputValue, setEduInputValue]       = useState("");
  const [inputCounties, setInputCounties]       = useState("");
  const [options, setOptions]                   = useState(Institutions);
  const [about, setAbout]                       = useState("");
  const [user, setUser]                         = useState({});
  const [openAlertProfile, setOpenAlertProfile] = useState(false);
  const [openAlertCountry, setOpenAlertCountry] = useState(true);
  const [openAlert, setOpenAlert]               = useState(false);
  const [showNext, setShowNext]                 = useState(false);

  const isPersonal = account === "Personal";

  const basicsReady = Boolean(name && email && phone && password && (!isPersonal || gender));
  const profileReady = isPersonal
    ? Boolean(specialisationTitle && selectedSkills.length > 0 && educationLevel && eduInstitution && county)
    : Boolean(specialisationTitle && about.length > 20 && county);

  const handleChange = (_, newValue) => {
    if (newValue.length > 5) return;
    setSelectedSkills(newValue);
  };
  const handleDelete = (s) => setSelectedSkills((p) => p.filter((x) => x !== s));

  const handleAddNew = () => {
    if (eduInputValue && !options.includes(eduInputValue)) {
      setOptions([...options, eduInputValue]);
      setEduInstitution(eduInputValue);
      setEduInputValue("");
    }
  };
  const handleDeleteInstitution = () => setEduInstitution(null);
  const handleDeleteCounty      = () => setCounty(null);
  const handleAddNewCounty = () => {
    if (inputCounties && !CountiesInKenya.includes(inputCounties)) {
      setCounty(inputCounties);
      setInputCounties("");
    }
  };

  useEffect(() => {
    if (specialisationTitle === "Zero Matched") setOpenAlert(true);
  }, [specialisationTitle, name, phone]);

  const handleMissingField = () => {
    const fail = (title, msg) => { setTitleAlert(title); setMissingFieldMessage(msg); setOpenAlertGenral(true); return true; };
    if (name.trim().split(" ").length !== 2)    return fail("Name Field", "Please provide two names to complete your profile.");
    if (name.trim() === "")                      return fail("Missing Field", "Your name is missing.");
    if (email.trim() === "")                     return fail("Missing Field", "Your email is missing.");
    if (password.trim() === "")                  return fail("Missing Field", "Your password is missing.");
    if (isPersonal) {
      if (gender.trim() === "")                  return fail("Missing Field", "Your gender is missing.");
      if (specialisationTitle.trim() === "")     return fail("Missing Field", "Your preferred specialisation is missing.");
      if (!selectedSkills.length)                return fail("Missing Field", "Provide at least one skill (max 5).");
      if (educationLevel.trim() === "")          return fail("Missing Field", "Education level is missing.");
      if (!eduInstitution || eduInstitution.trim() === "") return fail("Missing Field", "Your institution is missing.");
    } else {
      if (about.trim() === "")                   return fail("Missing Field", "Please provide a brief about your organisation.");
    }
    if (!phone || phone.trim() === "")           return fail("Missing Field", "Your phone number is missing.");
    if (!Number.isInteger(parseInt(phone.trim() / 1))) return fail("Incorrect Phone", "The provided phone number is not valid.");
    if (!county || county.trim() === "")         return fail("Missing Field", "Your county/city/state is missing.");
    return false;
  };

  const handleUserRegistration = () => {
    if (handleMissingField()) return;
    setUser({
      name, email, password,
      educationLevel: isPersonal ? educationLevel : "",
      eduInstitution: isPersonal ? eduInstitution : "",
      phone, country, county,
      gender: isPersonal ? gender : "",
      specialisationTitle,
      selectedSkills: isPersonal ? selectedSkills : "",
      account,
      about: !isPersonal ? about : "",
    });
    setOpenAlertProfile(true);
  };

  /* ── Render ── */
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(180deg, #050505 0%, #0B0B0B 52%, #111111 100%)",
        position: "relative",
        overflow: "auto",
        opacity: openAlertProfile ? 0.5 : 1,
        transition: "opacity 0.3s",
        px: { xs: 1.25, sm: 2, md: 3 },
        py: 4,
      }}
    >
      <DotGrid />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 0%, rgba(214,178,94,0.16), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.05), transparent 42%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1120,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 0.86fr) minmax(460px, 1fr)" },
          gap: { xs: 2, md: 2.5 },
          alignItems: "stretch",
        }}
      >
        <OnboardingInsightPanel />

        {/* ── Card ── */}
        <Box
          sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          background: "linear-gradient(180deg, rgba(13,13,13,0.98), rgba(5,5,5,0.96))",
          backdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`,
          borderRadius: "8px",
          p: { xs: 2, sm: 3 },
          boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
          overflow: "hidden",
          maxHeight: { xs: "none", md: "96vh" },
          overflowY: "auto",
          /* Hide scrollbar */
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          }}
        >
        {/* card inner accent */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #8B6F2A, #D6B25E, #FFF2C2)",
            pointerEvents: "none",
          }}
        />

        {/* ── Card header ── */}
        <Box textAlign="center" mb={3} sx={{ position: "relative" }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1.5}>
            <Box sx={{ width: 20, height: 1.5, bgcolor: C.teal, borderRadius: 1 }} />
            <Typography sx={{ fontSize: 9, letterSpacing: "0.22em", color: C.teal, textTransform: "uppercase" }}>
              Create Account
            </Typography>
            <Box sx={{ width: 20, height: 1.5, bgcolor: C.teal, borderRadius: 1 }} />
          </Box>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: CustomDeviceSmallest() ? 20 : 26,
              color: C.textPri,
              letterSpacing: 0,
            }}
          >
            Join Metatron Dev
          </Typography>
          <Typography sx={{ fontSize: 12, color: C.textSec, mt: 0.5 }}>
            Build a verified technology profile in two focused steps.
          </Typography>
        </Box>

        {/* ── Account type toggle ── */}
        <AccountToggle account={account} setAccount={setAccount} AccountVersion={AccountVersion} />

        {/* ── Step indicator ── */}
        <StepDots current={showNext ? 1 : 0} total={2} />
        <RegistrationProgress
          showNext={showNext}
          basicsReady={basicsReady}
          profileReady={profileReady}
          isPersonal={isPersonal}
        />

        {/* ════════════════════════════════
            STEP 1 — Core credentials
        ════════════════════════════════ */}
        {!showNext ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <SectionLabel>Basic Info</SectionLabel>

            <TextField
              required
              label="Full Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="FirstName LastName"
              sx={inputSx}
            />

            <TextField
              required
              label="Email Address"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              sx={inputSx}
            />

            <TextField
              required
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={`${country?.split(" ")[0] || "+254"}xxxxxxx`}
              sx={inputSx}
            />

            {isPersonal && (
              <TextField
                required
                select
                label="Gender"
                fullWidth
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={inputSx}
              >
                {GenderData?.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>
            )}

            <FormControl fullWidth sx={inputSx}>
              <InputLabel>Password *</InputLabel>
              <OutlinedInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      sx={{ color: C.textHint, "&:hover": { color: C.teal } }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

        ) : (
          /* ════════════════════════════════
              STEP 2 — Profile details
          ════════════════════════════════ */
          <Box display="flex" flexDirection="column" gap={2}>
            <SectionLabel>Profile Details</SectionLabel>

            {/* Specialisation */}
            <TextField
              required
              select
              label="Specialisation"
              fullWidth
              value={specialisationTitle}
              onChange={(e) => setSpecialisationTitle(e.target.value)}
              sx={inputSx}
              SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 280 } } } }}
            >
              {(isPersonal ? SpecialisationJobs : OrgSpecializations)?.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            {/* Personal-only fields */}
            {isPersonal && (
              <>
                <TextField
                  required
                  select
                  label="Education Level"
                  fullWidth
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  sx={inputSx}
                >
                  {EducationLevel?.map((l) => (
                    <MenuItem key={l} value={l}>{l}</MenuItem>
                  ))}
                </TextField>

                {/* Institution */}
                {country?.trim().toLowerCase().includes("kenya") ? (
                  <Autocomplete
                    value={eduInstitution}
                    onChange={(_, v) => setEduInstitution(v)}
                    inputValue={eduInputValue}
                    onInputChange={(_, v) => setEduInputValue(v)}
                    options={options}
                    freeSolo
                    sx={inputSx}
                    renderInput={(p) => <TextField {...p} label="Institution" variant="outlined" fullWidth />}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps} style={{ ...props.style, color: C.textSec }}>
                          {option}
                        </li>
                      );
                    }}
                    renderTags={() =>
                      eduInstitution ? (
                        <Chip label={eduInstitution} onDelete={handleDeleteInstitution} deleteIcon={<CheckCircle />} sx={chipSx} />
                      ) : null
                    }
                    noOptionsText={
                      <Chip
                        label={`Add "${eduInputValue}"`}
                        onClick={handleAddNew}
                        icon={<CheckCircle />}
                        color="primary"
                        clickable
                      />
                    }
                  />
                ) : (
                  <TextField
                    required
                    label="Institution"
                    fullWidth
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    placeholder="institution name"
                    sx={inputSx}
                  />
                )}

                {/* Skills */}
                <Autocomplete
                  multiple
                  options={AllSkills}
                  value={selectedSkills}
                  onChange={handleChange}
                  disableCloseOnSelect
                  sx={inputSx}
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      label="Skills *"
                      placeholder={selectedSkills.length < 5 ? "Add skill…" : ""}
                      helperText={
                        <Typography component="span" sx={{ fontSize: 11, color: C.textHint }}>
                          {selectedSkills.length}/5 selected
                        </Typography>
                      }
                    />
                  )}
                  renderTags={(v, getTagProps) =>
                    v.map((skill, i) => {
                      const { key, ...tagProps } = getTagProps({ index: i });
                      return (
                      <Chip
                        key={key}
                        label={skill}
                        {...tagProps}
                        onDelete={() => handleDelete(skill)}
                        sx={chipSx}
                      />
                      );
                    })
                  }
                />
              </>
            )}

            {/* County / City */}
            {country?.trim().toLowerCase().includes("kenya") ? (
              <Autocomplete
                value={county}
                onChange={(_, v) => setCounty(v)}
                inputValue={inputCounties}
                onInputChange={(_, v) => setInputCounties(v)}
                options={CountiesInKenya}
                freeSolo
                sx={inputSx}
                renderInput={(p) => <TextField {...p} label="County, City or State" variant="outlined" fullWidth />}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps} style={{ ...props.style, color: C.textSec }}>
                      {option}
                    </li>
                  );
                }}
                renderTags={() =>
                  county ? (
                    <Chip label={county} onDelete={handleDeleteCounty} deleteIcon={<CheckCircle />} sx={chipSx} />
                  ) : null
                }
                noOptionsText={
                  <Chip
                    label={`Add "${inputCounties}"`}
                    onClick={handleAddNewCounty}
                    icon={<CheckCircle />}
                    color="primary"
                    clickable
                  />
                }
              />
            ) : (
              <TextField
                required
                label="County, City or State"
                fullWidth
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="Your location"
                sx={inputSx}
              />
            )}

            {/* About — org only */}
            {!isPersonal && (
              <TextField
                required
                label={`About Organisation — ${MAX_ABOUT - about.length} chars left`}
                fullWidth
                multiline
                minRows={3}
                maxRows={5}
                value={about}
                error={about.length > MAX_ABOUT}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Brief description of your organisation…"
                sx={{
                  ...inputSx,
                  "& .MuiOutlinedInput-root.Mui-error fieldset": { borderColor: C.danger },
                }}
              />
            )}
          </Box>
        )}

        {/* ── Navigation row ── */}
        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            {showNext && (
              <Tooltip title="Back">
                <IconButton
                  size="small"
                  onClick={() => setShowNext(false)}
                  sx={{
                    color: C.textHint,
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    width: 38, height: 38,
                    "&:hover": { color: C.teal, borderColor: "rgba(214,178,94,0.4)" },
                  }}
                >
                  <ArrowBackIosNewRounded sx={{ width: 14, height: 14 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* Primary CTA */}
            <Button
              fullWidth
              variant="contained"
              disabled={openAlertProfile || about.length > MAX_ABOUT}
              onClick={showNext ? handleUserRegistration : () => setShowNext(true)}
              endIcon={!showNext ? <ArrowForwardIosRounded sx={{ width: 13, height: 13 }} /> : null}
              sx={{
                py: 1.5,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.04em",
                textTransform: "none",
                background: `linear-gradient(135deg, #8B6F2A 0%, ${C.teal} 100%)`,
                boxShadow: `0 8px 28px ${C.tealGlow}`,
                transition: "all 0.25s",
                "&:hover": {
                  background: `linear-gradient(135deg, #8B6F2A 0%, #FFF2C2 100%)`,
                  boxShadow: `0 12px 36px rgba(214,178,94,0.42)`,
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { background: "rgba(255,255,255,0.06)", color: C.textHint },
              }}
            >
              {showNext ? "Create Account" : "Continue"}
            </Button>
          </Box>

          {/* Login link */}
          <Typography textAlign="center" sx={{ fontSize: 12, color: C.textHint }}>
            Already have an account?{" "}
            <Box
              component={Link}
              to="/auth/login"
              sx={{ color: C.teal, textDecoration: "none", "&:hover": { opacity: 0.8 } }}
            >
              Sign in
            </Box>
          </Typography>
        </Box>
      </Box>
      </Box>

      {/* ── Modals / Alerts ── */}
      {openAlert && (
        <RegisterAlertTitle openAlert={openAlert} setOpenAlert={setOpenAlert} setSpecialisationTitle={setSpecialisationTitle} />
      )}
      {openAlertGenral && (
        <AlertGeneral
          openAlertGeneral={openAlertGenral}
          setOpenAlertGeneral={setOpenAlertGenral}
          title={titleAlert}
          message={missingFieldMessage}
          setErrorMessage={setMissingFieldMessage}
        />
      )}
      {openAlertProfile && isPersonal ? (
        <AlertProfileCompletion
          openAlertProfile={openAlertProfile}
          setOpenAlertProfile={setOpenAlertProfile}
          user={user}
          isPersonal={isPersonal}
        />
      ) : (
        <AlertOrgCompletion user={user} openAlertProfile={openAlertProfile} setOpenAlertProfile={setOpenAlertProfile} />
      )}
      {openAlertCountry && (
        <AlertCountry
          openAlertCountry={openAlertCountry}
          setOpenAlertCountry={setOpenAlertCountry}
          country={country}
          setCountry={setCountry}
          account={account}
          setAccount={setAccount}
        />
      )}
    </Box>
  );
};

export default RegistrationAuth;
