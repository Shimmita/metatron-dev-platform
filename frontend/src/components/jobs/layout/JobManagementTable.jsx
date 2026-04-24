import {
    Delete,
    OpenInNewRounded,
    RemoveRedEye,
    UpdateRounded
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    LinearProgress,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

const MetatronTable = ({
    myJobsPosted,
    columnsHeader,
    page,
    rowsPerPage,
    isFetching,
    jobStatus,
    handleShowJobPreview,
    handleShowJobReview,
    handleShowUpdateJobModal,
    handleShowDeleteAlert,
    handleUpdateJobStatus,
    getImageMatch,
    StyledBadgeActive,
    StyledBadgeInactive,
    CustomDeviceIsSmall,
    CustomDeviceTablet,
}) => {

    return (
        <TableContainer
            sx={{
                maxHeight: CustomDeviceIsSmall() || CustomDeviceTablet() ? 700 : 480,
                maxWidth: "100%",
                overflow: "auto",
                borderRadius: "12px",
                border: (theme) => `1px solid ${theme.palette.divider}`,
                background: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.4)' : '#fff',
                backdropFilter: "blur(10px)",
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}
        >
            <Table stickyHeader aria-label="metatron job management table">
                <TableHead>
                    <TableRow>
                        {columnsHeader.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                    minWidth: column.minWidth,
                                    fontWeight: 800,
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? "#1e293b" : "#f8fafc",
                                    color: "primary.main",
                                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {myJobsPosted
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((job, index) => (
                            <TableRow
                                hover
                                key={job._id || index}
                                sx={{ "&:hover": { backgroundColor: "rgba(20, 210, 190, 0.04) !important" } }}
                            >
                                {columnsHeader.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{ py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                                    >
                                        {/* LOGO & PREVIEW SECTOR */}
                                        {column.id === "logo" && (
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 'bold' }}>
                                                    {String(page * rowsPerPage + index + 1).padStart(2, '0')}
                                                </Typography>
                                                <IconButton size="small" onClick={() => handleShowJobPreview(job)}>
                                                    <Tooltip title="Preview HUD" arrow>
                                                        {job?.status?.toLowerCase() === "active" ? (
                                                            <StyledBadgeActive overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                                                                <Avatar src={getImageMatch(job?.logo)} sx={{ width: 36, height: 36, border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            </StyledBadgeActive>
                                                        ) : (
                                                            <StyledBadgeInactive overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                                                                <Avatar src={getImageMatch(job?.logo)} sx={{ width: 36, height: 36, opacity: 0.7 }} />
                                                            </StyledBadgeInactive>
                                                        )}
                                                    </Tooltip>
                                                </IconButton>
                                            </Box>
                                        )}

                                        {/* JOB TITLE SECTOR */}
                                        {column.id === "name" && (
                                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                                {job?.title}
                                            </Typography>
                                        )}

                                        {/* APPLICANTS PROGRESS SECTOR */}
                                        {column.id === "applicants" && (
                                            <Box sx={{ minWidth: 120 }}>
                                                {job?.website !== "" ? (
                                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: 'warning.main' }}>
                                                        <OpenInNewRounded sx={{ fontSize: 14 }} />
                                                        <Typography variant="caption" fontWeight="bold">EXTERNAL</Typography>
                                                    </Box>
                                                ) : (
                                                    <>
                                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                            <Typography sx={{ fontSize: '10px', fontWeight: 800 }}>
                                                                {job?.applicants?.total} / {job?.applicants_max}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'primary.main' }}>
                                                                {Math.ceil((job?.applicants?.total / job?.applicants_max) * 100)}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={(job?.applicants?.total / job?.applicants_max) * 100}
                                                            sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}
                                                        />
                                                    </>
                                                )}
                                            </Box>
                                        )}

                                        {/* STATUS SELECTOR */}
                                        {column.id === "status" && (
                                            <TextField
                                                select
                                                size="small"
                                                disabled={isFetching}
                                                variant="standard"
                                                value={job?.status || "active"}
                                                InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' } }}
                                                onChange={(e) => handleUpdateJobStatus(e.target.value, job)}
                                            >
                                                {jobStatus.map((status) => (
                                                    <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}

                                        {/* ACTION MATRIX */}
                                        {column.id === "action" && (
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="View Intelligence">
                                                    <IconButton size="small" onClick={() => handleShowJobReview(job)}>
                                                        <RemoveRedEye sx={{ fontSize: 20, color: 'secondary.main' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Update Core">
                                                    <IconButton size="small" onClick={() => handleShowUpdateJobModal(job)}>
                                                        <UpdateRounded sx={{ fontSize: 20, color: 'success.main' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Terminate">
                                                    <IconButton size="small" onClick={() => handleShowDeleteAlert(job)}>
                                                        <Delete sx={{ fontSize: 20, color: 'error.main' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MetatronTable;