import {
  AdminPanelSettingsRounded,
  ArticleRounded,
  BlockRounded,
  CheckCircleRounded,
  CloseRounded,
  CloudDownloadRounded,
  DeleteOutlineRounded,
  EmailRounded,
  EventRounded,
  GroupsRounded,
  PeopleRounded,
  RefreshRounded,
  SchoolRounded,
  SearchRounded,
  SettingsRounded,
  ShieldRounded,
  ToggleOffRounded,
  ToggleOnRounded,
  WorkRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { resolveVisualAsset } from "../utilities/resolveVisualAsset";
import { appColors, appGradients } from "../../utils/colors";

const resourceOrder = ["users", "posts", "jobs", "events", "courses"];

const resourceMeta = {
  users: {
    label: "Users",
    icon: PeopleRounded,
    totalKey: "users",
    accent: appColors.primary,
  },
  posts: {
    label: "Posts",
    icon: ArticleRounded,
    totalKey: "posts",
    accent: appColors.secondary,
  },
  jobs: {
    label: "Jobs",
    icon: WorkRounded,
    totalKey: "jobs",
    accent: appColors.success,
  },
  events: {
    label: "Events",
    icon: EventRounded,
    totalKey: "events",
    accent: appColors.accent,
  },
  courses: {
    label: "Courses",
    icon: SchoolRounded,
    totalKey: "courses",
    accent: appColors.magenta,
  },
};

const panelSx = {
  position: "absolute",
  inset: 0,
  width: "100vw",
  height: "100vh",
  maxWidth: "100vw",
  maxHeight: "100vh",
  overflow: "hidden",
  border: 0,
  borderRadius: 0,
  background: `linear-gradient(145deg, ${alpha(appColors.bgPanel, 0.98)}, ${alpha("#07111f", 0.98)})`,
  boxShadow: "none",
  color: appColors.textPrimary,
};

const metricCardSx = {
  p: 1.7,
  borderRadius: "14px",
  border: `1px solid ${appColors.border}`,
  background: alpha("#ffffff", 0.045),
  minWidth: 0,
};

const recordRowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
  gap: 1.5,
  p: { xs: 1.5, sm: 1.75 },
  borderRadius: "16px",
  border: `1px solid ${appColors.border}`,
  background: alpha("#ffffff", 0.045),
  alignItems: "center",
};

const formatNumber = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    notation: number >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(number);
};

const formatDate = (value) => {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  return `${parts[0]?.[0] || "M"}${parts[1]?.[0] || ""}`.toUpperCase();
};

const getRecordProfile = (resource, record) => {
  if (record?.isDisabled) {
    const disabledStatus = {
      status: "Disabled",
      statusColor: "error",
    };
    const baseProfile = getRecordProfile(resource, { ...record, isDisabled: false });
    return {
      ...baseProfile,
      ...disabledStatus,
      chips: [record?.disabledReason ? `Reason: ${record.disabledReason}` : "Disabled by admin", ...baseProfile.chips],
    };
  }

  switch (resource) {
    case "users":
      return {
        title: record?.name || "Unnamed developer",
        subtitle: record?.email || "No email recorded",
        avatar: record?.avatar,
        chips: [
          record?.role || "user",
          record?.specialisationTitle || "Tech professional",
          record?.country || "Global",
          `${formatNumber(record?.post_count)} posts`,
        ],
        status: record?.email_verified ? "Verified" : "Unverified",
        statusColor: record?.email_verified ? "success" : "warning",
      };
    case "posts":
      return {
        title: record?.post_title || "Untitled post",
        subtitle: record?.post_owner?.ownername || "Community post",
        avatar: record?.post_owner?.owneravatar,
        chips: [
          record?.post_category?.main || "Tech content",
          `${formatNumber(record?.post_liked?.clicks)} likes`,
          `${formatNumber(record?.post_comments?.count)} comments`,
          `${formatNumber(record?.report_count)} reports`,
        ],
        status: record?.report_count > 0 ? "Review" : "Clear",
        statusColor: record?.report_count > 0 ? "warning" : "success",
      };
    case "jobs":
      return {
        title: record?.title || "Untitled role",
        subtitle: record?.organisation?.name || "Hiring team",
        avatar: record?.logo,
        chips: [
          record?.category || "Engineering",
          record?.jobtypeaccess?.type || "Role",
          record?.jobtypeaccess?.access || "Access",
          `${formatNumber(record?.applicants?.total)} applicants`,
        ],
        status: record?.status || "active",
        statusColor: record?.status === "inactive" ? "warning" : "success",
      };
    case "events": {
      const isUpcoming = record?.dateHosted && new Date(record.dateHosted) >= new Date();
      return {
        title: record?.title || "Untitled event",
        subtitle: record?.ownerName || "Event host",
        avatar: record?.ownerAvatar,
        chips: [
          record?.category || "Tech event",
          formatDate(record?.dateHosted),
          record?.location?.country || "Global",
          `${formatNumber(record?.users?.count)} RSVPs`,
        ],
        status: isUpcoming ? "Upcoming" : "Past",
        statusColor: isUpcoming ? "success" : "default",
      };
    }
    case "courses":
      return {
        title: record?.course_title || "Untitled course",
        subtitle: record?.externalCourse
          ? `${record?.externalProvider || record?.course_instructor?.instructorName || "External provider"} course`
          : record?.course_instructor?.instructorName || "Instructor",
        avatar: record?.course_logo?.logoLink || record?.course_instructor?.instructorAvatar,
        chips: [
          record?.course_category?.main || "Course",
          record?.externalCourse ? "External redirect" : `${formatNumber(record?.course_video_lectures?.length)} lessons`,
          `${formatNumber(record?.student_count)} students`,
          `$${record?.price || 0}`,
        ],
        status: record?.externalCourse ? "External" : record?.course_edited ? "Updated" : "Published",
        statusColor: "info",
      };
    default:
      return {
        title: "Record",
        subtitle: "Metatron data",
        chips: [],
        status: "Active",
        statusColor: "default",
      };
  }
};

const getOwnerUserId = (resource, record) => {
  const sourceOwnerId = record?.ownerId || record?.course_instructor?.instructorId || "";
  if (record?.source?.name && `${sourceOwnerId}`.startsWith("external-")) return "";
  if (resource === "users") return record?._id;
  if (resource === "posts") return record?.post_owner?.ownerId;
  if (resource === "events") return record?.ownerId;
  if (resource === "courses") return record?.course_instructor?.instructorId;
  return "";
};

const EmptyState = ({ loading, label }) => (
  <Box
    sx={{
      minHeight: 260,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      border: `1px dashed ${appColors.border}`,
      borderRadius: "18px",
      background: alpha("#ffffff", 0.028),
      p: 3,
    }}
  >
    {loading ? (
      <CircularProgress size={34} sx={{ color: appColors.primary }} />
    ) : (
      <Stack spacing={1} alignItems="center">
        <ShieldRounded sx={{ color: appColors.textMuted, fontSize: 40 }} />
        <Typography fontWeight={800}>No {label.toLowerCase()} found</Typography>
        <Typography color={appColors.textSecondary} fontSize={14}>
          Try another search term or refresh the control panel.
        </Typography>
      </Stack>
    )}
  </Box>
);

export default function AdminControlPanel({ open, onClose }) {
  const { user } = useSelector((state) => state.currentUser);
  const [activeResource, setActiveResource] = useState("users");
  const [overview, setOverview] = useState(null);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const [disableTarget, setDisableTarget] = useState(null);
  const [messageTarget, setMessageTarget] = useState(null);
  const [moderationReason, setModerationReason] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [scrapingJobs, setScrapingJobs] = useState(false);
  const [jobScrapeSummary, setJobScrapeSummary] = useState(null);
  const [scrapingEvents, setScrapingEvents] = useState(false);
  const [eventScrapeSummary, setEventScrapeSummary] = useState(null);
  const [scrapingCourses, setScrapingCourses] = useState(false);
  const [courseScrapeSummary, setCourseScrapeSummary] = useState(null);
  const [adminSettings, setAdminSettings] = useState({
    jobGeographicApplicationRestriction: false,
  });
  const [settingsBusy, setSettingsBusy] = useState(false);
  const isDesktop = useMediaQuery("(min-width:900px)");

  const activeMeta = resourceMeta[activeResource];
  const ActiveIcon = activeMeta.icon;

  const fetchOverview = useCallback(() => {
    if (!open) return Promise.resolve();

    setLoadingOverview(true);
    return axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/overview`, { withCredentials: true })
      .then((res) => setOverview(res.data))
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to load admin overview",
        });
      })
      .finally(() => setLoadingOverview(false));
  }, [open]);

  const fetchRecords = useCallback(() => {
    if (!open) return Promise.resolve();

    setLoadingRecords(true);
    return axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/resources/${activeResource}`, {
        params: { search: appliedSearch, page, limit: 18 },
        withCredentials: true,
      })
      .then((res) => {
        setRecords(res.data?.records || []);
        setTotal(res.data?.total || 0);
        setPages(res.data?.pages || 1);
      })
      .catch((err) => {
        setRecords([]);
        setTotal(0);
        setPages(1);
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to load admin records",
        });
      })
      .finally(() => setLoadingRecords(false));
  }, [activeResource, appliedSearch, open, page]);

  const fetchAdminSettings = useCallback(() => {
    if (!open) return Promise.resolve();

    return axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/settings`, { withCredentials: true })
      .then((res) => {
        setAdminSettings({
          jobGeographicApplicationRestriction: Boolean(res.data?.jobGeographicApplicationRestriction),
        });
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to load admin settings",
        });
      });
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [activeResource, appliedSearch]);

  useEffect(() => {
    if (!open) return;
    fetchOverview();
    fetchAdminSettings();
  }, [fetchAdminSettings, fetchOverview, open]);

  useEffect(() => {
    if (!open) return;
    fetchRecords();
  }, [activeResource, fetchRecords, open]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(timeout);
  }, [notice]);

  const headlineMetrics = useMemo(() => {
    const totals = overview?.totals || {};
    return [
      { label: "Developers", value: totals.users, icon: GroupsRounded, helper: `${formatNumber(totals.admins)} admins | ${formatNumber(totals.disabledUsers)} disabled` },
      { label: "Tech Posts", value: totals.posts, icon: ArticleRounded, helper: `${formatNumber(totals.reportedPosts)} flagged | ${formatNumber(totals.disabledPosts)} disabled` },
      { label: "Live Jobs", value: totals.activeJobs, icon: WorkRounded, helper: `${formatNumber(totals.inactiveJobs)} paused` },
      { label: "Upcoming Events", value: totals.upcomingEvents, icon: EventRounded, helper: `${formatNumber(totals.pastEvents)} past | ${formatNumber(totals.disabledEvents)} disabled` },
      { label: "Courses", value: totals.courses, icon: SchoolRounded, helper: `${formatNumber(totals.disabledCourses)} disabled` },
    ];
  }, [overview]);

  const updateRecord = (updated) => {
    setRecords((current) => current.map((record) => (record._id === updated._id ? updated : record)));
  };

  const handleRoleChange = (record, role) => {
    setActionBusy(record._id);
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/users/${record._id}/role`,
        { role },
        { withCredentials: true }
      )
      .then((res) => {
        updateRecord(res.data);
        setNotice({ severity: "success", message: `${res.data.name} is now ${res.data.role}` });
        fetchOverview();
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update role",
        });
      })
      .finally(() => setActionBusy(""));
  };

  const handleJobStatus = (record) => {
    const status = record.status === "inactive" ? "active" : "inactive";
    setActionBusy(record._id);
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/jobs/${record._id}/status`,
        { status },
        { withCredentials: true }
      )
      .then((res) => {
        updateRecord(res.data);
        setNotice({ severity: "success", message: `Job marked ${res.data.status}` });
        fetchOverview();
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update job status",
        });
      })
      .finally(() => setActionBusy(""));
  };

  const handleDelete = (record) => {
    const profile = getRecordProfile(activeResource, record);
    const confirmed = window.confirm(`Delete "${profile.title}" from ${activeMeta.label}? This cannot be undone.`);
    if (!confirmed) return;

    setActionBusy(record._id);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/resources/${activeResource}/${record._id}`, {
        withCredentials: true,
      })
      .then(() => {
        setRecords((current) => current.filter((item) => item._id !== record._id));
        setTotal((current) => Math.max(current - 1, 0));
        setNotice({ severity: "success", message: `${activeMeta.label.slice(0, -1) || "Record"} deleted` });
        fetchOverview();
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to delete record",
        });
      })
      .finally(() => setActionBusy(""));
  };

  const handleOpenDisable = (record) => {
    setDisableTarget(record);
    setModerationReason(record?.disabledReason || "");
  };

  const handleToggleDisable = (record, disabled, reason = "") => {
    setActionBusy(record._id);
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/resources/${activeResource}/${record._id}/disabled`,
        { disabled, reason, notify: true },
        { withCredentials: true }
      )
      .then((res) => {
        updateRecord(res.data);
        setDisableTarget(null);
        setModerationReason("");
        setNotice({
          severity: "success",
          message: disabled ? "Record disabled and owner notified" : "Record enabled",
        });
        fetchOverview();
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update moderation status",
        });
      })
      .finally(() => setActionBusy(""));
  };

  const handleSendMessage = () => {
    const ownerId = getOwnerUserId(activeResource, messageTarget);
    if (!ownerId || !adminMessage.trim()) return;

    setActionBusy(messageTarget._id);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/message`,
        { targetUserId: ownerId, content: adminMessage.trim() },
        { withCredentials: true }
      )
      .then(() => {
        setNotice({ severity: "success", message: "Admin message sent" });
        setMessageTarget(null);
        setAdminMessage("");
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to send admin message",
        });
      })
      .finally(() => setActionBusy(""));
  };

  const handleUpdateJobsFromWeb = () => {
    setScrapingJobs(true);
    setJobScrapeSummary(null);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/jobs/scrape`,
        { limit: 160, perSourceLimit: 35 },
        { withCredentials: true }
      )
      .then((res) => {
        setJobScrapeSummary(res.data);
        setNotice({
          severity: "success",
          message: res.data?.message || "Jobs updated from external sources",
        });
        return Promise.all([fetchOverview(), fetchRecords()]);
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update jobs from the web",
        });
      })
      .finally(() => setScrapingJobs(false));
  };

  const handleUpdateEventsFromWeb = () => {
    setScrapingEvents(true);
    setEventScrapeSummary(null);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/events/scrape`,
        { limit: 140, perSourceLimit: 35 },
        { withCredentials: true }
      )
      .then((res) => {
        setEventScrapeSummary(res.data);
        setNotice({
          severity: "success",
          message: res.data?.message || "Events updated from external sources",
        });
        return Promise.all([fetchOverview(), fetchRecords()]);
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update events from the web",
        });
      })
      .finally(() => setScrapingEvents(false));
  };

  const handleUpdateCoursesFromWeb = () => {
    setScrapingCourses(true);
    setCourseScrapeSummary(null);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/courses/scrape`,
        { limit: 140, perSourceLimit: 35 },
        { withCredentials: true }
      )
      .then((res) => {
        setCourseScrapeSummary(res.data);
        setNotice({
          severity: "success",
          message: res.data?.message || "Courses updated from external sources",
        });
        return Promise.all([fetchOverview(), fetchRecords()]);
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update courses from the web",
        });
      })
      .finally(() => setScrapingCourses(false));
  };

  const handleToggleJobGeoRestriction = (checked) => {
    setSettingsBusy(true);
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/admin/settings`,
        { jobGeographicApplicationRestriction: checked },
        { withCredentials: true }
      )
      .then((res) => {
        setAdminSettings({
          jobGeographicApplicationRestriction: Boolean(res.data?.jobGeographicApplicationRestriction),
        });
        setNotice({
          severity: "success",
          message: checked
            ? "Job geographic checks enabled for applications"
            : "Job geographic checks disabled for applications",
        });
      })
      .catch((err) => {
        setNotice({
          severity: "error",
          message: err?.response?.data?.message || "Unable to update job application settings",
        });
      })
      .finally(() => setSettingsBusy(false));
  };

  const renderActions = (record) => {
    const isSelf = activeResource === "users" && `${record._id}` === `${user?._id}`;
    const busy = actionBusy === record._id;
    const canModerateDisable = ["users", "posts", "events", "courses"].includes(activeResource);
    const ownerId = getOwnerUserId(activeResource, record);

    return (
      <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap" useFlexGap>
        {ownerId && (
          <Tooltip title="Message owner">
            <span>
              <IconButton
                disabled={busy}
                onClick={() => {
                  const profile = getRecordProfile(activeResource, record);
                  setMessageTarget(record);
                  setAdminMessage(
                    activeResource === "users"
                      ? `Hello ${profile.title}, this is Admin from Metatron Dev. `
                      : `Hello, this is Admin from Metatron Dev regarding "${profile.title}". `
                  );
                }}
                sx={{
                  width: 38,
                  height: 38,
                  border: `1px solid ${appColors.border}`,
                  color: appColors.primary,
                  bgcolor: alpha(appColors.primary, 0.08),
                  "&:hover": { bgcolor: alpha(appColors.primary, 0.16) },
                }}
              >
                <EmailRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {canModerateDisable && (
          <Button
            size="small"
            variant="outlined"
            startIcon={record.isDisabled ? <CheckCircleRounded /> : <BlockRounded />}
            disabled={busy || (isSelf && !record.isDisabled)}
            onClick={() => {
              if (record.isDisabled) handleToggleDisable(record, false);
              else handleOpenDisable(record);
            }}
            sx={{
              borderColor: appColors.border,
              color: record.isDisabled ? appColors.success : appColors.warning,
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            {record.isDisabled ? "Enable" : "Disable"}
          </Button>
        )}

        {activeResource === "users" && (
          <Select
            size="small"
            value={record?.role || "user"}
            disabled={busy || isSelf}
            onChange={(event) => handleRoleChange(record, event.target.value)}
            sx={{
              minWidth: 118,
              color: appColors.textPrimary,
              borderRadius: "12px",
              ".MuiOutlinedInput-notchedOutline": { borderColor: appColors.border },
              ".MuiSelect-icon": { color: appColors.textSecondary },
            }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        )}

        {activeResource === "jobs" && (
          <Button
            size="small"
            variant="outlined"
            startIcon={record.status === "inactive" ? <ToggleOffRounded /> : <ToggleOnRounded />}
            disabled={busy}
            onClick={() => handleJobStatus(record)}
            sx={{
              borderColor: appColors.border,
              color: record.status === "inactive" ? appColors.warning : appColors.success,
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            {record.status === "inactive" ? "Activate" : "Pause"}
          </Button>
        )}

        <Tooltip title={isSelf ? "Current admin cannot delete self" : "Delete record"}>
          <span>
            <IconButton
              disabled={busy || isSelf}
              onClick={() => handleDelete(record)}
              sx={{
                width: 38,
                height: 38,
                border: `1px solid ${appColors.border}`,
                color: appColors.error,
                bgcolor: alpha(appColors.error, 0.08),
                "&:hover": { bgcolor: alpha(appColors.error, 0.16) },
              }}
            >
              {busy ? <CircularProgress size={16} /> : <DeleteOutlineRounded fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        p: 0,
        "& .MuiBackdrop-root": {
          background: alpha("#020617", 0.82),
          backdropFilter: "blur(14px)",
        },
      }}
    >
      <Box sx={panelSx}>
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            borderBottom: `1px solid ${appColors.border}`,
            background: appGradients.command,
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.5} minWidth={0}>
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: alpha(appColors.primary, 0.16),
                  color: appColors.primary,
                  border: `1px solid ${alpha(appColors.primary, 0.3)}`,
                }}
              >
                <AdminPanelSettingsRounded />
              </Avatar>
              <Box minWidth={0}>
                <Typography fontWeight={900} fontSize={{ xs: 20, md: 26 }} lineHeight={1.05}>
                  Admin Control Panel
                </Typography>
                <Typography color={appColors.textSecondary} fontSize={{ xs: 13, md: 14 }} mt={0.75}>
                  Master oversight for users, content, opportunities, events, and learning.
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={onClose}
              sx={{
                color: appColors.textPrimary,
                border: `1px solid ${appColors.border}`,
                bgcolor: alpha("#ffffff", 0.06),
              }}
            >
              <CloseRounded />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" },
              gap: 1.25,
              mt: 2.25,
            }}
          >
            {headlineMetrics.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <Box key={metric.label} sx={metricCardSx}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography color={appColors.textSecondary} fontSize={12} fontWeight={700}>
                      {metric.label}
                    </Typography>
                    <MetricIcon sx={{ color: appColors.primary, fontSize: 19 }} />
                  </Stack>
                  <Typography fontWeight={900} fontSize={26} mt={0.5}>
                    {loadingOverview ? "-" : formatNumber(metric.value)}
                  </Typography>
                  <Typography color={appColors.textMuted} fontSize={12}>
                    {metric.helper}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "220px minmax(0, 1fr)" },
            height: { xs: "calc(100vh - 238px)", md: "calc(100vh - 190px)" },
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              borderRight: { md: `1px solid ${appColors.border}` },
              borderBottom: { xs: `1px solid ${appColors.border}`, md: 0 },
              p: { xs: 1.25, md: 1.5 },
              overflowX: { xs: "auto", md: "hidden" },
            }}
          >
            <Tabs
              value={activeResource}
              onChange={(event, value) => {
                setActiveResource(value);
                setSearch("");
                setAppliedSearch("");
              }}
              orientation={isDesktop ? "vertical" : "horizontal"}
              variant="scrollable"
              sx={{
                minHeight: 0,
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": {
                  color: appColors.textSecondary,
                  textTransform: "none",
                  alignItems: "flex-start",
                  borderRadius: "14px",
                  minHeight: 48,
                  px: 1.5,
                  mr: { xs: 0.75, md: 0 },
                  mb: { md: 0.75 },
                },
                "& .Mui-selected": {
                  color: appColors.textPrimary,
                  background: alpha(appColors.primary, 0.12),
                  border: `1px solid ${alpha(appColors.primary, 0.28)}`,
                },
              }}
            >
              {resourceOrder.map((resource) => {
                const meta = resourceMeta[resource];
                const Icon = meta.icon;
                return (
                  <Tab
                    key={resource}
                    value={resource}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1} width="100%">
                        <Icon sx={{ color: meta.accent, fontSize: 20 }} />
                        <Box textAlign="left" minWidth={0}>
                          <Typography fontWeight={800} fontSize={13}>
                            {meta.label}
                          </Typography>
                          <Typography color={appColors.textMuted} fontSize={11}>
                            {formatNumber(overview?.totals?.[meta.totalKey])} records
                          </Typography>
                        </Box>
                      </Stack>
                    }
                  />
                );
              })}
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.25 }, overflow: "auto" }}>
            <Stack spacing={1.5}>
              {notice && (
                <Alert
                  severity={notice.severity}
                  onClose={() => setNotice(null)}
                  sx={{
                    borderRadius: "14px",
                    border: `1px solid ${appColors.border}`,
                    bgcolor: alpha("#ffffff", 0.07),
                    color: appColors.textPrimary,
                    "& .MuiAlert-icon": { color: notice.severity === "success" ? appColors.success : appColors.error },
                  }}
                >
                  {notice.message}
                </Alert>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1.25}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(activeMeta.accent, 0.15),
                      color: activeMeta.accent,
                      border: `1px solid ${alpha(activeMeta.accent, 0.3)}`,
                    }}
                  >
                    <ActiveIcon fontSize="small" />
                  </Avatar>
                  <Box minWidth={0}>
                    <Typography fontWeight={900} fontSize={19}>
                      Manage {activeMeta.label}
                    </Typography>
                    <Typography color={appColors.textMuted} fontSize={12}>
                      Showing {formatNumber(records.length)} of {formatNumber(total)} matching records
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  {activeResource === "jobs" && (
                    <Tooltip title="Scrape latest tech jobs">
                      <span>
                        <Button
                          variant="contained"
                          disabled={scrapingJobs}
                          onClick={handleUpdateJobsFromWeb}
                          startIcon={scrapingJobs ? <CircularProgress size={15} color="inherit" /> : <CloudDownloadRounded />}
                          sx={{
                            minHeight: 40,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {scrapingJobs ? "Updating" : "Update Jobs"}
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  {activeResource === "events" && (
                    <Tooltip title="Scrape upcoming tech events">
                      <span>
                        <Button
                          variant="contained"
                          disabled={scrapingEvents}
                          onClick={handleUpdateEventsFromWeb}
                          startIcon={scrapingEvents ? <CircularProgress size={15} color="inherit" /> : <CloudDownloadRounded />}
                          sx={{
                            minHeight: 40,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {scrapingEvents ? "Updating" : "Update Events"}
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  {activeResource === "courses" && (
                    <Tooltip title="Scrape external tech courses">
                      <span>
                        <Button
                          variant="contained"
                          disabled={scrapingCourses}
                          onClick={handleUpdateCoursesFromWeb}
                          startIcon={scrapingCourses ? <CircularProgress size={15} color="inherit" /> : <CloudDownloadRounded />}
                          sx={{
                            minHeight: 40,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {scrapingCourses ? "Updating" : "Update Courses"}
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  <TextField
                    size="small"
                    placeholder={`Search ${activeMeta.label.toLowerCase()}`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") setAppliedSearch(search);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRounded sx={{ color: appColors.textMuted, fontSize: 19 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: "100%", sm: 270 },
                      "& .MuiInputBase-root": {
                        color: appColors.textPrimary,
                        borderRadius: "14px",
                        bgcolor: alpha("#ffffff", 0.055),
                      },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: appColors.border },
                    }}
                  />
                  <Tooltip title="Search">
                    <IconButton
                      onClick={() => setAppliedSearch(search)}
                      sx={{
                        width: 40,
                        height: 40,
                        border: `1px solid ${appColors.border}`,
                        color: appColors.textPrimary,
                        bgcolor: alpha("#ffffff", 0.055),
                      }}
                    >
                      <SearchRounded />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton
                      onClick={() => {
                        fetchOverview();
                        fetchRecords();
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        border: `1px solid ${appColors.border}`,
                        color: appColors.primary,
                        bgcolor: alpha("#ffffff", 0.055),
                      }}
                    >
                      <RefreshRounded />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Divider sx={{ borderColor: appColors.divider }} />

              {activeResource === "jobs" && (
                <Box sx={{ ...metricCardSx }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Stack direction="row" spacing={1.1} alignItems="center" minWidth={0}>
                      <WorkRounded sx={{ color: appColors.success }} />
                      <Box minWidth={0}>
                        <Typography fontWeight={850} fontSize={14}>
                          Geographic Application Check
                        </Typography>
                        <Typography color={appColors.textSecondary} fontSize={12}>
                          {adminSettings.jobGeographicApplicationRestriction
                            ? "Applicants must share location before country-restricted jobs accept submissions."
                            : "Country restrictions are currently ignored during job applications."}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {settingsBusy && <CircularProgress size={16} />}
                      <Switch
                        checked={adminSettings.jobGeographicApplicationRestriction}
                        disabled={settingsBusy}
                        onChange={(event) => handleToggleJobGeoRestriction(event.target.checked)}
                        inputProps={{ "aria-label": "Toggle job geographic application check" }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
                  gap: 1.25,
                }}
              >
                <Box sx={{ ...metricCardSx, display: "flex", gap: 1.25, alignItems: "center" }}>
                  <SettingsRounded sx={{ color: appColors.primary }} />
                  <Box>
                    <Typography fontWeight={800} fontSize={14}>
                      Governance Mode
                    </Typography>
                    <Typography color={appColors.textSecondary} fontSize={12}>
                      Use role controls carefully. Admin actions are session-guarded by the API.
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ...metricCardSx, display: "flex", gap: 1.25, alignItems: "center" }}>
                  <ShieldRounded sx={{ color: appColors.accent }} />
                  <Box>
                    <Typography fontWeight={800} fontSize={14}>
                      Signed in as {user?.name || "Admin"}
                    </Typography>
                    <Typography color={appColors.textSecondary} fontSize={12}>
                      {user?.email || "Privileged session"} | role: {user?.role || "admin"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {activeResource === "jobs" && jobScrapeSummary && (
                <Box sx={{ ...metricCardSx }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <CloudDownloadRounded sx={{ color: appColors.success }} />
                      <Box>
                        <Typography fontWeight={850} fontSize={14}>
                          Web Job Update
                        </Typography>
                        <Typography color={appColors.textSecondary} fontSize={12}>
                          {formatNumber(jobScrapeSummary.fetched)} fetched | {formatNumber(jobScrapeSummary.structured)} structured | {formatNumber(jobScrapeSummary.inserted)} saved | {formatNumber(jobScrapeSummary.skipped)} skipped
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                      {(jobScrapeSummary.sources || []).slice(0, 6).map((source) => (
                        <Chip
                          key={source.source}
                          size="small"
                          label={`${source.source}: ${formatNumber(source.fetched)}`}
                          color={source.error ? "warning" : "success"}
                          sx={{ height: 24, fontWeight: 800 }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {activeResource === "events" && eventScrapeSummary && (
                <Box sx={{ ...metricCardSx }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <CloudDownloadRounded sx={{ color: appColors.accent }} />
                      <Box>
                        <Typography fontWeight={850} fontSize={14}>
                          Web Event Update
                        </Typography>
                        <Typography color={appColors.textSecondary} fontSize={12}>
                          {formatNumber(eventScrapeSummary.fetched)} fetched | {formatNumber(eventScrapeSummary.structured)} structured | {formatNumber(eventScrapeSummary.inserted)} saved | {formatNumber(eventScrapeSummary.skipped)} skipped
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                      {(eventScrapeSummary.sources || []).slice(0, 6).map((source) => (
                        <Chip
                          key={source.source}
                          size="small"
                          label={`${source.source}: ${formatNumber(source.fetched)}`}
                          color={source.error ? "warning" : "success"}
                          sx={{ height: 24, fontWeight: 800 }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {activeResource === "courses" && courseScrapeSummary && (
                <Box sx={{ ...metricCardSx }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <CloudDownloadRounded sx={{ color: appColors.magenta }} />
                      <Box>
                        <Typography fontWeight={850} fontSize={14}>
                          Web Course Update
                        </Typography>
                        <Typography color={appColors.textSecondary} fontSize={12}>
                          {formatNumber(courseScrapeSummary.fetched)} fetched | {formatNumber(courseScrapeSummary.structured)} structured | {formatNumber(courseScrapeSummary.inserted)} saved | {formatNumber(courseScrapeSummary.skipped)} skipped
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                      {(courseScrapeSummary.sources || []).slice(0, 6).map((source) => (
                        <Chip
                          key={source.source}
                          size="small"
                          label={`${source.source}: ${formatNumber(source.fetched)}`}
                          color={source.error ? "warning" : "success"}
                          sx={{ height: 24, fontWeight: 800 }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {records.length === 0 ? (
                <EmptyState loading={loadingRecords} label={activeMeta.label} />
              ) : (
                <Stack spacing={1}>
                  {records.map((record) => {
                    const profile = getRecordProfile(activeResource, record);
                    return (
                      <Box key={record._id} sx={recordRowSx}>
                        <Stack direction="row" spacing={1.35} minWidth={0} alignItems="center">
	                          <Avatar
	                            src={resolveVisualAsset(profile.avatar, profile.chips?.[0])}
                            alt={profile.title}
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: alpha(activeMeta.accent, 0.18),
                              color: activeMeta.accent,
                              fontWeight: 900,
                              border: `1px solid ${alpha(activeMeta.accent, 0.3)}`,
                            }}
                          >
                            {getInitials(profile.title)}
                          </Avatar>
                          <Box minWidth={0}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                              <Typography fontWeight={850} noWrap maxWidth={{ xs: 230, sm: 420, lg: 520 }}>
                                {profile.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={profile.status}
                                color={profile.statusColor === "default" ? undefined : profile.statusColor}
                                sx={{
                                  height: 23,
                                  fontWeight: 800,
                                  bgcolor: profile.statusColor === "default" ? alpha("#ffffff", 0.08) : undefined,
                                }}
                              />
                            </Stack>
                            <Typography color={appColors.textSecondary} fontSize={13} noWrap maxWidth={{ xs: 270, sm: 560 }}>
                              {profile.subtitle}
                            </Typography>
                            <Stack direction="row" spacing={0.7} mt={0.85} flexWrap="wrap" useFlexGap>
                              {profile.chips.filter(Boolean).slice(0, 5).map((chip) => (
                                <Chip
                                  key={`${record._id}-${chip}`}
                                  size="small"
                                  label={chip}
                                  sx={{
                                    height: 24,
                                    color: appColors.textSecondary,
                                    border: `1px solid ${appColors.divider}`,
                                    bgcolor: alpha("#ffffff", 0.04),
                                  }}
                                />
                              ))}
                              <Chip
                                size="small"
                                label={formatDate(record?.createdAt)}
                                sx={{
                                  height: 24,
                                  color: appColors.textMuted,
                                  border: `1px solid ${appColors.divider}`,
                                  bgcolor: alpha("#ffffff", 0.03),
                                }}
                              />
                            </Stack>
                          </Box>
                        </Stack>
                        {renderActions(record)}
                      </Box>
                    );
                  })}
                  {pages > 1 && (
                    <Box display="flex" justifyContent="center" pt={1.25}>
                      <Pagination
                        page={page}
                        count={pages}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        size={isDesktop ? "medium" : "small"}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: appColors.textSecondary,
                            borderColor: appColors.border,
                          },
                          "& .Mui-selected": {
                            color: "#03111f",
                            fontWeight: 900,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>

        <Dialog
          open={Boolean(disableTarget)}
          onClose={() => setDisableTarget(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "18px",
              border: `1px solid ${appColors.border}`,
              background: `linear-gradient(145deg, ${appColors.bgPanel}, #07111f)`,
              color: appColors.textPrimary,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>Disable Record</DialogTitle>
          <DialogContent>
            <Typography color={appColors.textSecondary} fontSize={14} mb={1.5}>
              The owner will receive an Admin message with your reason and the technical help email.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={4}
              value={moderationReason}
              onChange={(event) => setModerationReason(event.target.value)}
              placeholder="Explain why this record is being disabled"
              sx={{
                "& .MuiInputBase-root": {
                  color: appColors.textPrimary,
                  borderRadius: "14px",
                  bgcolor: alpha("#ffffff", 0.055),
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: appColors.border },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setDisableTarget(null)} sx={{ color: appColors.textSecondary, textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!moderationReason.trim() || actionBusy === disableTarget?._id}
              onClick={() => handleToggleDisable(disableTarget, true, moderationReason)}
              startIcon={actionBusy === disableTarget?._id ? <CircularProgress size={14} /> : <BlockRounded />}
              sx={{ textTransform: "none", fontWeight: 900, borderRadius: "12px" }}
            >
              Disable and Notify
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(messageTarget)}
          onClose={() => setMessageTarget(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "18px",
              border: `1px solid ${appColors.border}`,
              background: `linear-gradient(145deg, ${appColors.bgPanel}, #07111f)`,
              color: appColors.textPrimary,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>Send Admin Message</DialogTitle>
          <DialogContent>
            <Typography color={appColors.textSecondary} fontSize={14} mb={1.5}>
              This creates or updates an in-app message thread where the sender is shown as Admin.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={5}
              value={adminMessage}
              onChange={(event) => setAdminMessage(event.target.value)}
              placeholder="Write the admin message"
              sx={{
                "& .MuiInputBase-root": {
                  color: appColors.textPrimary,
                  borderRadius: "14px",
                  bgcolor: alpha("#ffffff", 0.055),
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: appColors.border },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setMessageTarget(null)} sx={{ color: appColors.textSecondary, textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!adminMessage.trim() || actionBusy === messageTarget?._id}
              onClick={handleSendMessage}
              startIcon={actionBusy === messageTarget?._id ? <CircularProgress size={14} /> : <EmailRounded />}
              sx={{ textTransform: "none", fontWeight: 900, borderRadius: "12px" }}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}
