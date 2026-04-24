import {
  AccessTimeFilledRounded,
  BalanceRounded,
  CalendarMonthRounded,
  LocationCityRounded,
  PaidRounded,
  PeopleRounded,
  WorkHistoryRounded,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { getImageMatch } from "../../utilities/getImageMatch";

function JobLayoutHiring({ job, textOption = "", setIsApplicantsTable, setFocusedJob }) {
  const mandatorySkills = [...(job?.skills || [])];

  const handleDateDisplay = () => {
    if (!job?.createdAt) return "N/A";
    const date = new Date(job.createdAt);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  const handleCountryName = () => {
    if (!job?.location?.country) return "Remote";
    const parent = job.location.country.split(" ");
    return parent.length > 2 ? `${parent[0]} ${parent[1]}` : job.location.country;
  };

  const handleOpenApplicantsTable = () => {
    setFocusedJob(job);
    setIsApplicantsTable(true);
  };

  const unassessedCount = (job?.applicants?.total || 0) - (job?.applicants?.assessed || 0);

  return (
    <Stack
      className="metatron-job-card"
      sx={{
        width: 300,
        minHeight: 450,
        p: 2.5,
        m: 1,
        borderRadius: "16px",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(15, 23, 42, 0.6)"
            : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(20, 210, 190, 0.2)" : "divider",
        transition: "all 0.3s ease",
        position: "relative",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
        },
      }}
      alignItems="center"
      spacing={2}
    >
      {/* Top Section: Branding */}
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={getImageMatch(job?.logo)}
          sx={{
            width: 56,
            height: 56,
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 0 15px rgba(20, 210, 190, 0.2)",
            backgroundColor: "background.paper",
          }}
        />
      </Box>

      <Stack spacing={0.5} alignItems="center" textAlign="center" sx={{ width: "100%" }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            lineHeight: 1.2,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {job?.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            opacity: 0.8,
            textTransform: "capitalize",
          }}
        >
          {job?.organisation?.name}
        </Typography>
      </Stack>

      <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 } }}>
        {mandatorySkills.map((skill) => (
          <Tooltip title={skill} key={skill} arrow>
            <Avatar alt={skill} src={getImageMatch(skill)} className="border" />
          </Tooltip>
        ))}
      </AvatarGroup>

      <Divider sx={{ width: "80%", opacity: 0.1 }} />

      {/* Info Matrix */}
      <Stack spacing={1.2} sx={{ width: "100%", px: 1 }}>
        <InfoRow icon={<LocationCityRounded />} label={`${handleCountryName()} | ${job?.location?.state}`} />
        <InfoRow icon={<AccessTimeFilledRounded />} label={`${job?.jobtypeaccess?.access} • ${job?.jobtypeaccess?.type}`} />
        <InfoRow icon={<PaidRounded />} label={job?.salary || "Competitive"} />
        <InfoRow icon={<WorkHistoryRounded />} label={`${job?.entry?.years || "0"} Experience`} />
        <InfoRow icon={<BalanceRounded />} label={`${job?.entry?.level || "General"} Position`} />
        <InfoRow
          icon={<PeopleRounded />}
          label={
            job?.website !== ""
              ? "External Portal"
              : `Applicants: ${job?.applicants?.total || 0} / ${job?.applicants_max || 0}`
          }
          highlight={job?.applicants?.total > 0}
        />
        <InfoRow icon={<CalendarMonthRounded />} label={`Posted: ${handleDateDisplay()}`} />
      </Stack>

      {/* Action Sector */}
      {textOption === "Jobs Assessment" && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleOpenApplicantsTable}
          sx={{
            mt: "auto !important",
            borderRadius: "10px",
            fontWeight: 800,
            py: 1,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: 1,
            background: "linear-gradient(90deg, #14D2BE, #0E9F8E)",
            boxShadow: "0 4px 14px rgba(20, 210, 190, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #14D2BE, #1BEAD4)",
              boxShadow: "0 6px 20px rgba(20, 210, 190, 0.4)",
            },
          }}
        >
          Assess {unassessedCount} New
        </Button>
      )}
    </Stack>
  );
}

// Reusable component for the info rows to keep the main layout clean
const InfoRow = ({ icon, label, highlight }) => (
  <Box display="flex" gap={1.5} alignItems="center">
    {React.cloneElement(icon, {
      sx: {
        fontSize: 18,
        color: highlight ? "primary.main" : "text.secondary",
        opacity: 0.8,
      },
    })}
    <Typography
      variant="caption"
      sx={{
        fontSize: "0.78rem",
        fontWeight: highlight ? 700 : 500,
        color: highlight ? "primary.main" : "text.primary",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default JobLayoutHiring;