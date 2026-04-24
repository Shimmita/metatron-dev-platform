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
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
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
  const mandatorySkills = [...job?.skills];
  const isDeactivated = job?.status === "inactive";
  const isMaxApplicants = job?.applicants?.total === MAX_APPLICANTS;

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
    <Box
      display="flex"
      gap={2}
      mb={isLastIndex ? 4 : 0}
      flexDirection="column"
      alignItems="center"
      mt={CustomDeviceIsSmall() ? 2 : 1}
    >
      <Card
        elevation={0}
        sx={{
          width: CustomDeviceIsSmall() && !CustomDeviceSmallest() ? 320 : 300,
          background: "rgba(255, 255, 255, 0.03)", // Metatron Glass
          backdropFilter: "blur(20px)",
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: "14px",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 0 20px rgba(20, 210, 190, 0.15)",
            transform: "translateY(-2px)"
          }
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="center" pt={3}>
          <Avatar
            src={getImageMatch(job?.logo)}
            sx={{
              width: 56,
              height: 56,
              background: "rgba(255,255,255,0.05)",
              border: "2px solid",
              borderColor: "primary.main",
              p: 0.5
            }}
          />
        </Box>

        <Stack spacing={1} mt={2} px={2} pb={3}>
          <Typography variant="body1" color="primary" textAlign="center" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {job?.title}
          </Typography>

          <Typography textAlign="center" variant="caption" fontWeight={600} sx={{ color: "text.secondary", opacity: 0.8 }}>
            {job?.organisation?.name}
          </Typography>

          <Box display="flex" justifyContent="center" py={1}>
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

          <Divider sx={{ opacity: 0.08, my: 1 }} />

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
                  borderColor: isCopiedStatus ? "success.main" : "divider",
                  color: isCopiedStatus ? "success.main" : "text.secondary"
                }}
              >
                {isCopiedStatus ? "Copied" : "Share"}
              </Button>

              <Button
                fullWidth
                size="small"
                variant="contained"
                disabled={job?.currentUserApplied || isMaxApplicants || isGuest || isDeactivated}
                onClick={() => setOpenApplyJobModal(true)}
                startIcon={isDeactivated || isMaxApplicants || isGuest ? <LockRounded /> : <VerifiedRounded />}
                sx={{ borderRadius: "10px" }}
              >
                {job?.currentUserApplied ? "Applied" : isDeactivated ? "Paused" : "Apply"}
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
    </Box>
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