import {
  AccessTimeFilledRounded,
  ArrowCircleRightRounded,
  CalendarMonthRounded,
  Done,
  LocationOnRounded,
  LockRounded,
  PaidRounded,
  PeopleRounded,
  VerifiedRounded,
  WorkHistoryRounded
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentJobs } from "../../../redux/CurrentJobs";
import ApplyJobModal from "../../modal/ApplyJobModal";
import MetatronSnackbar from "../../snackbar/MetatronSnackBar";
import { getImageMatch } from "../../utilities/getImageMatch";

const MAX_APPLICANTS = 500;

function JobLayout_2({
  job,
  jobs,
  isPreviewHR = false,
  isLastIndex = false,
  setPageNumber,
  pageNumber,
  setErrorMessage,
  isJobSearchGlobal
}) {
  const [openModal, setOpenApplyJobModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);

  const { user, isGuest } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  const isMyJob = user?.email === job?.my_email;
  const websiteLink = job?.website?.trim();
  const mandatorySkills = Array.isArray(job?.skills) ? job.skills : [];
  const isDeactivated = job?.status === "inactive";
  const isMaxApplicants = job?.applicants?.total === MAX_APPLICANTS;
  const handleGuestApply = () => {
    setErrorMessage?.("access denied, please login to continue with your request!");
  };

  const handleDateDisplay = () => {
    const parent = job?.createdAt?.split("T")[0]?.split("-");
    return `${parent[2]}/${parent[1]}/${parent[0]}`;
  };

  const handleFetchMoreData = () => {
    setIsFetching(true);
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/${user?._id}?page=${pageNumber}&limit=6`)
      .then((res) => {
        if (res?.data?.length > 0) {
          dispatch(updateCurrentJobs([...jobs, ...res.data]));
          setPageNumber((prev) => prev + 1);
        }
      })
      .catch((err) => {
        if (err?.response?.data.login) window.location.reload();
        setErrorMessage(err?.code === "ERR_NETWORK" ? "System link lost" : err?.response?.data);
      })
      .finally(() => setIsFetching(false));
  };

  const handleGetJobLink = async () => {
    const urlJob = `${window.location.origin}${window.location.pathname}?id=${job?._id}`;
    try {
      await navigator.clipboard.writeText(urlJob);
      setIsCopiedStatus(true);
      setTimeout(() => setIsCopiedStatus(false), 2000);
    } catch (err) {
      console.error('Failed to Copy: ', err);
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 0 20px rgba(214,178,94, 0.15)",
            transform: "translateY(-2px)"
          }
        }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1.5}
          p={2}
          sx={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(135deg, rgba(214,178,94,0.10), rgba(255,255,255,0.02))",
          }}
        >
          <Avatar
            src={getImageMatch(job?.logo)}
            sx={{
              width: 50,
              height: 50,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid",
              borderColor: "primary.main",
              p: 0.5,
              flexShrink: 0,
            }}
          />

          <Box minWidth={0} flex={1}>
            <Typography variant="body1" color="primary" fontWeight={900} sx={{ lineHeight: 1.22 }}>
              {job?.title}
            </Typography>
            <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary" }} noWrap>
              {job?.organisation?.name}
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              <Chip size="small" label={job?.jobtypeaccess?.type || "Tech role"} />
              <Chip size="small" label={job?.jobtypeaccess?.access || "Flexible"} variant="outlined" />
            </Stack>
          </Box>

          <Chip
            size="small"
            label={isDeactivated ? "Paused" : isMaxApplicants ? "Closed" : "Active"}
            color="primary"
            variant={isDeactivated || isMaxApplicants ? "outlined" : "filled"}
            sx={{ borderRadius: "8px", fontWeight: 800, flexShrink: 0 }}
          />
        </Box>

        <Stack spacing={1.25} px={2} py={2}>
          <Box display="flex" justifyContent="flex-start">
            <AvatarGroup
              sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12, borderColor: "background.paper" } }}
            >
              {mandatorySkills.map((skill) => (
                <Tooltip title={skill} key={skill} arrow>
                  <Avatar alt={skill} src={getImageMatch(skill)} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>

          <Divider sx={{ opacity: 0.08 }} />

          {/* Job Metadata Sector */}
          <Stack spacing={1.5} sx={{ "& .MuiSvgIcon-root": { fontSize: 18, color: "primary.main" } }}>
            <JobDetail icon={<LocationOnRounded />} text={`${job.location.state} | ${job.location.country}`} />
            <JobDetail icon={<AccessTimeFilledRounded />} text={`${job?.jobtypeaccess?.access} • ${job?.jobtypeaccess?.type}`} />
            <JobDetail icon={<PaidRounded />} text={job?.salary} />
            <JobDetail icon={<WorkHistoryRounded />} text={`${job?.entry?.years} Experience`} />
            <JobDetail icon={<PeopleRounded />} text={websiteLink ? "External Portal" : `Applicants: ${job?.applicants?.total}/${job?.applicants_max || MAX_APPLICANTS}`} />
            <JobDetail icon={<CalendarMonthRounded />} text={`Deployed: ${handleDateDisplay()}`} />
          </Stack>

          {/* Action Sector */}
          {!isPreviewHR && (
            <Stack direction="row" spacing={1} mt={2} justifyContent="center">
              <Button
                fullWidth
                size="small"
                onClick={handleGetJobLink}
                variant="outlined"
                startIcon={isCopiedStatus ? <Done /> : undefined}
                sx={{
                  borderRadius: "10px",
                  borderColor: isCopiedStatus ? "primary.main" : "divider",
                  color: isCopiedStatus ? "primary.main" : "text.secondary"
                }}
              >
                {isCopiedStatus ? "Copied" : "Share"}
              </Button>

              <Button
                fullWidth
                size="small"
                variant="contained"
                disabled={job?.currentUserApplied || isMaxApplicants || isDeactivated}
                onClick={isGuest ? handleGuestApply : () => setOpenApplyJobModal(true)}
                startIcon={isDeactivated || isMaxApplicants || isGuest ? <LockRounded /> : <VerifiedRounded />}
                sx={{ borderRadius: "10px" }}
              >
                {isGuest ? "Login to Apply" : job?.currentUserApplied ? "Applied" : isDeactivated ? "Paused" : "Apply"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Card>

      {/* Infinite Scroll Controller */}
      {isLastIndex && !isJobSearchGlobal && !isGuest && (
        <IconButton
          disabled={isFetching}
          onClick={handleFetchMoreData}
          sx={{ border: '1px solid', borderColor: 'divider', mt: 2 }}
        >
          {isFetching ? <CircularProgress size={24} /> : <ArrowCircleRightRounded color="primary" sx={{ fontSize: 32 }} />}
        </IconButton>
      )}

      {/* show success snackbar when link copied  */}
      {isCopiedStatus && (
        <MetatronSnackbar open={isCopiedStatus} message={'job link copied'} />
      )}

      {openModal && (
        <ApplyJobModal
          {...job}
          openApplyJobModal={openModal}
          setOpenApplyJobModal={setOpenApplyJobModal}
          websiteLink={websiteLink}
          isFullView={true}
          isMyJob={isMyJob}
        />
      )}
    </>
  );
}

// Sub-component for cleaner metadata rows
const JobDetail = ({ icon, text }) => (
  <Box display="flex" gap={1.5} alignItems="center" px={1}>
    {icon}
    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
      {text}
    </Typography>
  </Box>
);

export default JobLayout_2;
