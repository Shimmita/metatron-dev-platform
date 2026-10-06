import {
  BoltRounded,
  BusinessRounded,
  Close,
  CloudUploadRounded,
  DescriptionRounded,
  FactCheckRounded,
  LaunchRounded,
  LockRounded,
  MyLocationRounded,
  PaymentsRounded,
  PlaceRounded,
  VerifiedRounded,
  WorkHistoryRounded
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import { getImageMatch } from "../utilities/getImageMatch";
import { resolveVisualAsset } from "../utilities/resolveVisualAsset";
import { ModalWorkflowSteps } from "./ModalShared";
import './Progress.css';
// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const normalizeCountryName = (value = "") =>
  `${value || ""}`
    .replace(/^\+\d+\s+/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const isOpenCountryWhitelist = (value = "") => {
  const normalized = normalizeCountryName(value);
  return !normalized || normalized === "all" || normalized === "global" || normalized === "worldwide";
};

const extractCountryCode = (value = "") => {
  const parentheticalCode = `${value || ""}`.match(/\(([A-Z]{2})\)/i)?.[1];
  const trimmed = `${value || ""}`.trim();
  const directCode = /^[A-Z]{2}$/i.test(trimmed) ? trimmed : "";

  return (parentheticalCode || directCode).toUpperCase();
};

const countryMatchesWhitelist = ({ country = "", countryCode = "", whitelist = "" } = {}) => {
  if (isOpenCountryWhitelist(whitelist)) return true;

  const normalizedCountry = normalizeCountryName(country);
  const allowedCountry = normalizeCountryName(whitelist);
  const normalizedCode = extractCountryCode(countryCode);
  const allowedCode = extractCountryCode(whitelist);

  return Boolean(
    (normalizedCountry && normalizedCountry === allowedCountry) ||
    (normalizedCode && allowedCode && normalizedCode === allowedCode)
  );
};


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
  logo,
  location,
  isPreview = false,
  isMyJob = false,
  whitelist = ""

}) => {
  const { user } = useSelector((state) => state.currentUser);
  const [cvUpload, setCvUpload] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jobApplicationSettings, setJobApplicationSettings] = useState({
    jobGeographicApplicationRestriction: false,
  });
  const [detectedCountry, setDetectedCountry] = useState("");
  const [detectedCountryCode, setDetectedCountryCode] = useState("");
  const [detectedLocationCoordinates, setDetectedLocationCoordinates] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // extract cvLink and name it cvName
  const cvName = user?.cvLink || ""
  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark'
  const dispatch = useDispatch();

  const geographicRestrictionActive = Boolean(jobApplicationSettings.jobGeographicApplicationRestriction);
  const whitelistOpen = isOpenCountryWhitelist(whitelist);
  const detectedCountryMatches = countryMatchesWhitelist({
    country: detectedCountry,
    countryCode: detectedCountryCode,
    whitelist,
  });
	  const detectedCountryLabel = detectedCountry
	    ? `${detectedCountry}${detectedCountryCode ? ` (${detectedCountryCode})` : ""}`
	    : detectedCountryCode;
	  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];
	  const qualificationList = Array.isArray(requirements?.qualification)
	    ? requirements.qualification.filter(Boolean)
	    : [];
	  const requirementList = Array.isArray(requirements?.description)
	    ? requirements.description.filter(Boolean)
	    : [];
	  const isExternalApplication = Boolean(websiteLink?.trim());
	  const cvReady = Boolean(cvUpload || user?.cvLink);
	  const jobCity = location?.state || "Flexible location";
		  const organisationLogo = resolveVisualAsset(organisation?.logo || logo, skillList[0]);
	  const organisationName = organisation?.name || "Hiring team";
	  const organisationAbout = organisation?.about || "This hiring team has not added an organisation profile yet.";

  // based on the whitelist job filter, show/hide action btns
  const isEligible =
    !geographicRestrictionActive ||
    whitelistOpen ||
    detectedCountryMatches

  const resolveCurrentCountry = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location access is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10 * 60 * 1000,
      });
    });

  const buildLocationEligibility = (overrides = {}) => ({
    allowed: true,
    country: detectedCountry,
    countryCode: detectedCountryCode,
    coordinates: detectedLocationCoordinates,
    ...overrides,
  });

  const ensureLocationEligibility = async () => {
    if (!geographicRestrictionActive || whitelistOpen) return buildLocationEligibility();

    if ((detectedCountry || detectedCountryCode) && detectedLocationCoordinates) {
      if (detectedCountryMatches) return buildLocationEligibility();
      setErrorMessage(`This job is restricted to applicants in ${whitelist}. Your detected country is ${detectedCountryLabel || "unknown"}.`);
      return { allowed: false };
    }

    setErrorMessage("");
    setIsDetectingLocation(true);

    try {
      const position = await resolveCurrentCountry();
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/application/location/country`,
        {
          params: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          withCredentials: true,
        }
      );

      const country = res.data?.country || "";
      const countryCode = res.data?.countryCode || "";
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setDetectedCountry(country);
      setDetectedCountryCode(countryCode);
      setDetectedLocationCoordinates(coordinates);

      if (!countryMatchesWhitelist({ country, countryCode, whitelist })) {
        const countryLabel = country
          ? `${country}${countryCode ? ` (${countryCode})` : ""}`
          : countryCode;
        setErrorMessage(`This job is restricted to applicants in ${whitelist}. Your detected country is ${countryLabel || "unknown"}.`);
        return { allowed: false };
      }

      return buildLocationEligibility({ country, countryCode, coordinates });
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Please allow location access to continue with this country-restricted job.");
      return { allowed: false };
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    if (!openApplyJobModal) return;

    setDetectedCountry("");
    setDetectedCountryCode("");
    setDetectedLocationCoordinates(null);
    setErrorMessage("");

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/application/settings`, {
        withCredentials: true,
      })
      .then((res) => {
        setJobApplicationSettings({
          jobGeographicApplicationRestriction: Boolean(res.data?.jobGeographicApplicationRestriction),
        });
      })
      .catch(() => {
        setJobApplicationSettings({
          jobGeographicApplicationRestriction: false,
        });
      });
  }, [openApplyJobModal]);

  // handle cv file change, upload it to the backend
  const handleCVFile = (event) => {
    // updating file for state tracking
    setCvUpload(event.target.files[0]);
    // formData
    const formData = new FormData()
    formData.append("file", event.target.files[0])

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
	        // nullify cv upload state
	        setCvUpload(null);
	      });
	  };

  const handleCvDownloadResponse = async (res) => {
    const contentType = res.headers["content-type"] || "";
    const contentDisposition = res.headers["content-disposition"] || "";
    const filename = contentDisposition.match(/filename="?([^"]+)"?/)?.[1] || "cv.pdf";

    if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      return;
    }

    const cvUrl = await res.data.text();
    window.open(cvUrl, "_blank_")
  }

  const getRequestErrorMessage = async (err, fallback = "something went wrong") => {
    const data = err?.response?.data;

    if (data instanceof Blob) {
      const text = await data.text();
      return text || fallback;
    }

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    return err?.message || fallback;
  }

  // handle current btn view cv
  const handleDownloadCv = () => {
	    // uploading status
	    setIsUploading(true)

    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/cv/my/download`, { cvName }, {
      withCredentials: true,
      responseType: "blob",
    })
      .then(handleCvDownloadResponse)
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
        setErrorMessage(await getRequestErrorMessage(err));
      })
      .finally(() => {
        setIsUploading(false);
      });

  }


  // handle uploading of the application document
  const handleJobApplication = async () => {

    // clear any error message
    setErrorMessage("");

    const locationEligibility = await ensureLocationEligibility();
    if (!locationEligibility.allowed) return;

    // creating a jobItem object
    const jobItem = {
      jobID,
      cvName,
      applicant: {
        name: user.name,
        applicantID: user._id,
        gender: user.gender,
        country: geographicRestrictionActive && locationEligibility.country ? locationEligibility.country : user.country,
        detectedCountry: geographicRestrictionActive ? locationEligibility.country || "" : "",
        detectedCountryCode: geographicRestrictionActive ? locationEligibility.countryCode || "" : "",
        locationCoordinates: geographicRestrictionActive ? locationEligibility.coordinates : undefined,
        locationSource: geographicRestrictionActive ? "browser-geolocation" : "",
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
        dispatch(updateCurrentSuccessRedux({ title: 'Job Application', message: `${res.data} job recruiter will review your application and provide feedback` }))

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
	    if (!location?.country) return "Global";
	    const parent = location.country.split(" ");
	    const countryCode = parent?.pop();
	    const finalName = parent?.length > 2 ? `${parent[0]} ${parent[1]} ${countryCode}` : location?.country;
	
	    return finalName.split("(")[0].trim();
	  };
	
	  const locationDisplay = [jobCity, handleCountryName()].filter(Boolean).join(", ");


  // handle showing of website iframe
  const handleShowWebsite = async () => {
    const locationEligibility = await ensureLocationEligibility();
    if (!locationEligibility.allowed) return;

    window.open(websiteLink, "_blank")
    // close the modal
    setOpenApplyJobModal(false)
  }

	  const jobMetaCards = [
	    {
	      label: "Compensation",
	      value: salary || "Not specified",
	      icon: <PaymentsRounded />,
	    },
	    {
	      label: "Work Mode",
	      value: `${jobaccesstype?.access || "Flexible"} / ${jobaccesstype?.type || "Role"}`,
	      icon: <WorkHistoryRounded />,
	    },
	    {
	      label: "Location",
	      value: locationDisplay,
	      icon: <PlaceRounded />,
	    },
	    {
	      label: "Apply Route",
	      value: isExternalApplication ? "External portal" : "Metatron CV",
	      icon: isExternalApplication ? <LaunchRounded /> : <DescriptionRounded />,
	    },
	  ];

  const applyWorkflowSteps = [
    { label: "Review", helper: "Role, company, compensation, and work mode", completed: Boolean(title && organisation?.name) },
    { label: "Match", helper: geographicRestrictionActive ? "Skill fit and live country eligibility" : "Skill fit and open geographic access", completed: Boolean(isEligible) },
    { label: "Credentials", helper: websiteLink === "" ? "Attach or confirm your CV" : "Continue through employer portal", completed: Boolean(websiteLink || cvUpload || user?.cvLink) },
    { label: "Submit", helper: "Send application for recruiter review", completed: false },
  ];
  const applyActiveStep = !isEligible
    ? 1
    : websiteLink !== ""
    ? 2
    : cvUpload || user?.cvLink
    ? 3
    : 2;


  return (
    <StyledModalJob
      keepMounted
      open={openApplyJobModal}
      onClose={handleClosingModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(12px)',
        p: { xs: 1, sm: 2 }, // Added padding for small screens
        "& .MuiBackdrop-root": {
          background: "rgba(3,7,18,0.72)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: "100%", sm: "640px", md: "720px" },
          height: { xs: 'auto', sm: 'auto' },
          maxHeight: { xs: 'calc(100dvh - 16px)', sm: 'calc(100dvh - 32px)' },
          bgcolor: isDarkMode ? 'rgba(13, 20, 32, 0.95)' : '#fff',
          backdropFilter: 'blur(25px)',
          borderRadius: "8px",
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(214,178,94,0.13), rgba(13,20,32,0.96))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(214,178,94,0.10))',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              src={organisationLogo}
              variant="rounded"
              sx={{
                width: 58,
                height: 58,
                borderRadius: "8px",
                border: '1px solid rgba(214,178,94,0.35)',
                bgcolor: 'background.paper',
                boxShadow: isDarkMode ? '0 12px 32px rgba(0,0,0,0.35)' : '0 12px 24px rgba(139,111,42,0.12)',
                p: 0.35,
                flexShrink: 0,
              }}
            />

            <Box flex={1} minWidth={0}>
              <Stack direction="row" alignItems="center" spacing={0.75} mb={0.35}>
                <BusinessRounded sx={{ color: 'primary.main', fontSize: 16 }} />
                <Typography variant="caption" color="primary.main" fontWeight={900} noWrap>
                  {organisationName}
                </Typography>
              </Stack>
              <Typography variant="h6" fontWeight={900} lineHeight={1.18} sx={{ letterSpacing: 0 }}>
                {title}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mt={1.1}>
                {[jobaccesstype?.type, jobaccesstype?.access, handleCountryName(), isExternalApplication ? "External" : "Direct Apply"].filter(Boolean).map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={tag}
                    sx={{
                      height: 24,
                      borderRadius: "8px",
                      fontSize: "0.68rem",
                      fontWeight: 850,
                      color: 'primary.main',
                      border: '1px solid rgba(214,178,94,0.28)',
                      bgcolor: 'rgba(214,178,94,0.09)',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <IconButton
              onClick={handleClosingModal}
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(5,8,18,0.05)',
                flexShrink: 0,
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <ModalWorkflowSteps
          steps={applyWorkflowSteps}
          activeStep={applyActiveStep}
        />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 1.5, sm: 2.25 },
            py: 2,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '10px' },
          }}
        >
          <Stack spacing={1.75}>
            {(errorMessage || isUploading || isDetectingLocation || (geographicRestrictionActive && !whitelistOpen)) && (
              <Stack spacing={1}>
                {errorMessage && <Alert severity="error" sx={{ borderRadius: "8px", fontSize: '0.78rem' }}>{errorMessage}</Alert>}
                {!errorMessage && geographicRestrictionActive && !whitelistOpen && (
                  <Alert severity={detectedCountry || detectedCountryCode ? "info" : "warning"} icon={<MyLocationRounded />} sx={{ borderRadius: "8px", fontSize: '0.78rem' }}>
                    {detectedCountry || detectedCountryCode
                      ? `Detected country: ${detectedCountryLabel}. This job accepts applicants from ${whitelist}.`
                      : `This job is country restricted to ${whitelist}. We will request your location before you continue.`}
                  </Alert>
                )}
                {(isUploading || isDetectingLocation) && (
                  <Stack direction="row" spacing={2} py={1} justifyContent="center" alignItems="center">
                    <CircularProgress size={16} thickness={6} />
                    <Typography variant="caption" fontWeight={700}>
                      {isDetectingLocation ? "Verifying Location..." : "Synchronizing Credentials..."}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 1,
              }}
            >
              {jobMetaCards.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 1.25,
                    minHeight: 82,
                    borderRadius: "8px",
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.035)' : 'rgba(5,8,18,0.025)',
                    minWidth: 0,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.85}>
                    <Box sx={{ color: 'primary.main', display: 'flex', '& .MuiSvgIcon-root': { fontSize: 18 } }}>
                      {item.icon}
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={850} noWrap>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={900} mt={0.85} lineHeight={1.3}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.74)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75} mb={0.75}>
                <BusinessRounded sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="body2" fontWeight={900}>
                  Organization Brief
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, fontSize: '0.84rem' }}>
                {organisationAbout}
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={0.75} mb={1}>
                <VerifiedRounded sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="body2" fontWeight={900}>
                  Required Stack
                </Typography>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.85 }}>
                {skillList.map((skill) => (
                  <Chip
                    key={skill}
                    avatar={<Avatar src={getImageMatch(skill)} sx={{ p: 0.2 }} />}
                    label={skill}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.035)' : 'rgba(5,8,18,0.025)',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                ))}
                {skillList.length < 1 && (
                  <Typography variant="caption" color="text.secondary">
                    No specific stack listed.
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {[
                { label: 'Candidate Qualifications', data: qualificationList, icon: <FactCheckRounded /> },
                { label: 'Execution Requirements', data: requirementList, icon: <DescriptionRounded /> }
              ].map((section) => (
                <Box
                  key={section.label}
                  sx={{
                    p: 1.5,
                    borderRadius: "8px",
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.68)',
                    minWidth: 0,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75} mb={1.2}>
                    <Box sx={{ color: 'primary.main', display: 'flex', '& .MuiSvgIcon-root': { fontSize: 18 } }}>
                      {section.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={900}>
                      {section.label}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {section.data.length > 0 ? section.data.map((item, index) => (
                      <Stack key={`${section.label}-${index}`} direction="row" spacing={1.1} alignItems="flex-start">
                        <Box
                          sx={{
                            mt: 0.15,
                            width: 20,
                            height: 20,
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            bgcolor: 'rgba(214,178,94,0.12)',
                            color: 'primary.main',
                            border: '1px solid rgba(214,178,94,0.22)',
                            fontSize: "0.68rem",
                            fontWeight: 900,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                          {item}
                        </Typography>
                      </Stack>
                    )) : (
                      <Typography variant="caption" color="text.secondary">
                        No extra details listed.
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>

        {!isPreview && (
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: isDarkMode ? 'rgba(5,8,18,0.42)' : 'rgba(255,255,255,0.86)',
            }}
          >
            {!isEligible ? (
              <Box sx={{ p: 1.35, borderRadius: "8px", bgcolor: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.24)' }}>
                <Typography variant="caption" sx={{ color: 'warning.main', textAlign: 'center', display: 'block', fontWeight: 850 }}>
                  This role is currently limited to applicants in {whitelist}.
                </Typography>
              </Box>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems="stretch">
                {!isExternalApplication ? (
                  <>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        p: 1.15,
                        borderRadius: "8px",
                        border: '1px solid',
                        borderColor: cvReady ? 'rgba(214,178,94,0.34)' : 'divider',
                        bgcolor: cvReady ? 'rgba(214,178,94,0.08)' : 'rgba(255,255,255,0.025)',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Box minWidth={0}>
                          <Typography
                            variant="caption"
                            fontWeight={900}
                            color={cvReady ? "primary.main" : "text.secondary"}
                            display="block"
                          >
                            {cvReady ? "CV READY" : "CV REQUIRED"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {cvUpload
                              ? cvUpload.name
                              : user?.cvLink
                                ? "Using stored profile CV"
                                : "Attach a PDF resume"}
                          </Typography>
                        </Box>
                        <DescriptionRounded sx={{ color: cvReady ? 'primary.main' : 'text.secondary', fontSize: 22, flexShrink: 0 }} />
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="stretch">
                      <Button
                        component="label"
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 850,
                          px: 1.4,
                          whiteSpace: "nowrap",
                        }}
                        startIcon={<CloudUploadRounded sx={{ fontSize: 16 }} />}
                      >
                        {user?.cvLink ? "Replace" : "Attach"}
                        <input type="file" hidden accept="application/pdf" onChange={handleCVFile} />
                      </Button>

                      {user?.cvLink && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleDownloadCv}
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 850,
                            px: 1.4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Stack>

                    <Button
                      variant="contained"
                      disabled={!cvReady || isUploading || isDetectingLocation || isMyJob}
                      onClick={handleJobApplication}
                      endIcon={isMyJob ? <LockRounded /> : isUploading ? <CircularProgress size={14} color="inherit" /> : <BoltRounded />}
                      sx={{
                        borderRadius: "8px",
                        px: 2,
                        minWidth: { xs: "100%", sm: 168 },
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        boxShadow: isDarkMode ? '0 10px 26px rgba(214,178,94, 0.22)' : '0 8px 18px rgba(139,111,42,0.14)',
                      }}
                    >
                      {isMyJob ? "Author Listing" : "Submit"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        p: 1.15,
                        borderRadius: "8px",
                        border: '1px solid rgba(214,178,94,0.26)',
                        bgcolor: 'rgba(214,178,94,0.075)',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LaunchRounded sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box minWidth={0}>
                          <Typography variant="caption" color="primary.main" fontWeight={900} display="block">
                            External Portal
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            Continue on the employer application site.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      disabled={isDetectingLocation}
                      onClick={handleShowWebsite}
                      endIcon={isDetectingLocation ? <CircularProgress size={14} color="inherit" /> : <LaunchRounded />}
                      sx={{
                        borderRadius: "8px",
                        px: 2,
                        minWidth: { xs: "100%", sm: 210 },
                        fontWeight: 900,
                      }}
                    >
                      Continue
                    </Button>
                  </>
                )}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </StyledModalJob>
  );
};

export default ApplyJobModal;
