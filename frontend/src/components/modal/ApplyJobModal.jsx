import {
  BoltRounded,
  Close,
  CloudUploadRounded,
  LockRounded
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
  useTheme
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import CustomCountryName from "../utilities/CustomCountryName";
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

const HeaderBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  flexWrap: "wrap",
}));

const SectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0,0,0,0.15)'
    : '0 2px 8px rgba(0,0,0,0.08)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block',
}));


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
  isPreview = false,
  isMyJob = false,
  whitelist = ""

}) => {
  const { user } = useSelector((state) => state.currentUser);
  const [cvUpload, setCvUpload] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentButton, setCurrentButton] = useState(user?.cvLink === "" ? 0 : 1)

  // extract cvLink and name it cvName
  const cvName = user?.cvLink || ""
  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark'
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleCountryJob = (job) => {
    const parent = job.split(" ");
    const finalName =
      parent.length > 2 ? `${parent[0]} ${parent[1]}` : parent[0];

    return finalName;
  };

  // based on the whitelist job filter, show/hide action btns
  const isEligible =
    whitelist === "All" ||
    whitelist === "" ||
    handleCountryJob(whitelist) === CustomCountryName(user?.country)

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
        // set current button 
        setCurrentButton(0)
        // nullify cv upload state
        setCvUpload(null);
      });
  };

  // handle current cv btn selection
  const handleCurrentCv = () => {
    setCurrentButton(1)
  }

  // handle current btn view cv
  const handleDownloadCv = () => {
    // update focused btn
    setCurrentButton(2)

    // uploading status
    setIsUploading(true)

    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/cv/my/download`, { cvName }, {
      withCredentials: true,
    })
      .then((res) => {
        // open new window to download the pdf separately
        window.open(res.data, "_blank_")
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
    const parent = location?.country?.split(" ");
    const countryCode = parent?.pop();
    const finalName = parent?.length > 2 ? `${parent[0]} ${parent[1]} ${countryCode}` : location?.country;

    return finalName.split("(")[0];
  };


  // handle showing of website iframe
  const handleShowWebsite = () => {
    window.open(websiteLink, "_blank")
    // close the modal
    setOpenApplyJobModal(false)
  }

  // handle calculation of skills percentage 
  const handleSkillsPercentage = () => {
    const userSkills = user?.selectedSkills || []
    let results = 0

    // loop through user skill
    for (const userSkill of userSkills) {
      if (skills.includes(userSkill)) {
        results = results + 1
      }
    }

    return Math.ceil(results / skills.length * 100)

  }


  // handle return width modal
  const handleReturnWidthModal = () => {
    if (CustomLandScape() || CustomLandscapeWidest() ||
      (CustomDeviceTablet() && !isTabSideBar)) {
      return "40%"
    } else if (CustomDeviceTablet()) {
      return "90%"
    }
    return "95%"
  }


  const Section = ({ title, children }) => (
    <Box>
      <Typography fontWeight={700} mb={1}>
        {title}
      </Typography>
      {children}
    </Box>
  );



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
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '520px', // Slightly wider for better text flow
          height: { xs: '100%', sm: 'auto' }, // Full screen on mobile, auto on desktop
          maxHeight: { xs: '100vh', sm: '90vh' },
          bgcolor: isDarkMode ? 'rgba(13, 20, 32, 0.95)' : '#fff',
          backdropFilter: 'blur(25px)',
          borderRadius: { xs: 0, sm: 4 }, // Flat on mobile for more space
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ─── HEADER: Identity & Metadata ─── */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.01)' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={organisation.logo || AppLogo}
              variant="rounded"
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
              }}
            />

            <Box flex={1} minWidth={0}>
              <Typography variant="body1" fontWeight={800} noWrap sx={{ letterSpacing: '-0.01em' }}>
                {title}
              </Typography>
              <Typography variant="caption" color="primary" fontWeight={800} sx={{ display: 'block', mt: -0.2 }}>
                {organisation.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                {salary} P.M • {location.state}
              </Typography>
            </Box>

            <IconButton
              onClick={handleClosingModal}
              size="small"
              sx={{ alignSelf: 'flex-start', bgcolor: 'action.hover' }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" mt={1.5} flexWrap="wrap" gap={1}>
            {[jobaccesstype?.type, jobaccesstype?.access, handleCountryName()].map((tag) => (
              <Box key={tag} sx={{ px: 1, py: 0.2, borderRadius: 1, bgcolor: 'rgba(20, 210, 190, 0.1)', border: '1px solid rgba(20, 210, 190, 0.2)' }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#14D2BE' }}>{tag}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* ─── SCROLLABLE INTELLIGENCE ─── */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2.5,
            py: 2,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '10px' },
          }}
        >
          <Stack spacing={3}>
            {/* Status Alerts */}
            {(errorMessage || isUploading) && (
              <Box>
                {errorMessage && <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.75rem' }}>{errorMessage}</Alert>}
                {isUploading && (
                  <Stack direction="row" spacing={2} py={1} justifyContent="center" alignItems="center">
                    <CircularProgress size={16} thickness={6} />
                    <Typography variant="caption" fontWeight={700}>Synchronizing Credentials...</Typography>
                  </Stack>
                )}
              </Box>
            )}

            {/* About Section */}
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ opacity: 0.5 }}>About Us</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, lineHeight: 1.7, fontSize: '0.825rem' }}>
                {organisation.about}
              </Typography>
            </Box>

            {/* Tech Stack / Skills */}
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ opacity: 0.5 }}>Tech Stack</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar src={getImageMatch(skill)} sx={{ p: 0.2 }} />}
                    label={skill}
                    size="medium"
                    sx={{
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: 'transparent',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Requirements & Qualifications Unified */}
            <Stack spacing={2.5}>
              {[
                { label: 'Candidate Qualifications', data: requirements?.qualification },
                { label: 'Operational Requirements', data: requirements?.description }
              ].map((section) => (
                <Box key={section.label}>
                  <Typography variant="overline" color="primary" fontWeight={900} sx={{ letterSpacing: '0.05rem' }}>
                    {section.label}
                  </Typography>
                  <Stack spacing={1.5} mt={1.5}>
                    {section.data?.map((item, index) => (
                      <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{
                          mt: 0.9,
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          boxShadow: '0 0 8px #14D2BE',
                          flexShrink: 0
                        }} />
                        <Typography variant="body2" sx={{ opacity: 0.85, fontSize: '0.8rem', lineHeight: 1.5 }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* ─── ACTION FOOTER ─── */}
        {/* ─── ACTION FOOTER ─── */}
        {!isPreview && (
          <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}>
            {!isEligible ? (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <Typography variant="caption" sx={{ color: 'warning.main', textAlign: 'center', display: 'block', fontWeight: 700, letterSpacing: 0.5 }}>
                  GEOGRAPHIC LOCK: APPLICATIONS RESTRICTED TO RECRUITER'S REGION
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {websiteLink === "" ? (
                  <>
                    {/* CV Metadata & Control Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight={900}
                          color={user?.cvLink || cvUpload ? "primary.main" : "text.secondary"}
                          sx={{ display: 'block', lineHeight: 1 }}
                        >
                          {user?.cvLink || cvUpload ? "CREDENTIALS VERIFIED" : "CREDENTIALS REQUIRED"}
                        </Typography>

                        {/* Dynamic Metadata Text */}
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 600 }}>
                          {cvUpload
                            ? `Queued: ${cvUpload.name.substring(0, 15)}...`
                            : user?.cvLink
                              ? "Using stored profile CV"
                              : "Please attach a PDF to proceed"}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        {/* Upload/Update Toggle */}
                        <Button
                          component="label"
                          size="small"
                          variant="text"
                          sx={{ fontSize: 11, fontWeight: 800, color: 'text.primary' }}
                          startIcon={<CloudUploadRounded sx={{ fontSize: 16 }} />}
                        >
                          {user?.cvLink ? "REPLACE" : "ATTACH"}
                          <input type="file" hidden accept="application/pdf" onChange={handleCVFile} />
                        </Button>

                        {/* Conditional View Button: Only shows if a link exists in the profile */}
                        {user?.cvLink && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleDownloadCv}
                            sx={{
                              fontSize: 10,
                              fontWeight: 800,
                              borderRadius: '6px',
                              borderColor: 'divider',
                              px: 1.5
                            }}
                          >
                            VIEW
                          </Button>
                        )}
                      </Stack>
                    </Box>

                    {/* Final Submission Action */}
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={(!cvUpload && !user?.cvLink) || isUploading || isMyJob}
                      onClick={handleJobApplication}
                      endIcon={isMyJob ? <LockRounded /> : <BoltRounded />}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        letterSpacing: '0.05rem',
                        boxShadow: isDarkMode ? '0 8px 24px rgba(20, 210, 190, 0.25)' : '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 30px rgba(20, 210, 190, 0.4)',
                        }
                      }}
                    >
                      {isMyJob ? "AUTHOR LISTING" : "SUBMIT APPLICATION"}
                    </Button>
                  </>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleShowWebsite}
                    endIcon={<BoltRounded />}
                    sx={{ borderRadius: 2, py: 1.5, fontWeight: 900 }}
                  >
                    CONTINUE TO EXTERNAL PORTAL
                  </Button>
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
