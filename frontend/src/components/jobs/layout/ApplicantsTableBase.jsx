import {
    ChatBubbleOutlineRounded,
    CheckCircleRounded,
    Close,
    DownloadRounded,
    QuestionMark,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

const MetatronApplicantsTable = ({
    jobApplicants,
    columnsHeader,
    page,
    rowsPerPage,
    isFetching,
    applicantStatus,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateStateApplicant,
    handleShowProfile,
    handleDownload,
    handleOpenAlertMessage,
    CustomCountryName,
}) => {

    // Status Color Logic
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "proceed") return "#14D2BE"; // Metatron Cyan
        if (s === "rejected") return "#FF5252"; // Error Red
        return "#4FC3F7"; // Info Blue
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <TableContainer
                sx={{
                    maxHeight: 500,
                    borderRadius: "12px",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    background: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.4)' : '#fff',
                    backdropFilter: "blur(10px)",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Table stickyHeader aria-label="applicants management table">
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
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobApplicants
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((job_applicant, index) => {
                                const status = job_applicant?.status?.toLowerCase();
                                const statusColor = getStatusColor(status);

                                return (
                                    <TableRow hover key={job_applicant._id || index}>
                                        {columnsHeader.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{ py: 1.5, fontSize: '0.8rem' }}
                                            >
                                                {/* PROFILE COLUMN */}
                                                {column.id === "profile" && (
                                                    <Box display="flex" alignItems="center" gap={1.5}>
                                                        <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 700 }}>
                                                            {String(page * rowsPerPage + index + 1).padStart(2, '0')}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleShowProfile(job_applicant?.applicant?.applicantID)}
                                                        >
                                                            <Tooltip title="View Profile HUD" arrow>
                                                                <Avatar
                                                                    sx={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,0.1)' }}
                                                                    src={job_applicant?.applicant?.profileImage} // Ensure this path exists
                                                                />
                                                            </Tooltip>
                                                        </IconButton>
                                                    </Box>
                                                )}

                                                {/* NAME & STATUS INDICATOR */}
                                                {column.id === "name" && (
                                                    <Box display="flex" gap={1.5} alignItems="center">
                                                        {status === 'proceed' && <CheckCircleRounded sx={{ fontSize: 18, color: statusColor }} />}
                                                        {status === 'rejected' && <Close sx={{ fontSize: 18, color: statusColor }} />}
                                                        {status === 'pending' && <QuestionMark sx={{ fontSize: 18, color: statusColor }} />}

                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {job_applicant?.applicant?.name}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {column.id === 'gender' && (
                                                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', opacity: 0.8 }}>
                                                        {job_applicant?.applicant?.gender}
                                                    </Typography>
                                                )}

                                                {column.id === 'country' && (
                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                        {CustomCountryName(job_applicant?.applicant?.country)}
                                                    </Typography>
                                                )}

                                                {/* STATUS SELECTOR HUD */}
                                                {column.id === 'status' && (
                                                    <TextField
                                                        select
                                                        variant="standard"
                                                        value={job_applicant.status}
                                                        onChange={(e) => handleUpdateStateApplicant(e.target.value, job_applicant)}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            sx: {
                                                                fontSize: '0.7rem',
                                                                fontWeight: 800,
                                                                color: statusColor,
                                                                border: `1px solid ${statusColor}44`,
                                                                borderRadius: '20px',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                textTransform: 'uppercase'
                                                            }
                                                        }}
                                                    >
                                                        {applicantStatus.map((s) => (
                                                            <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                                                {s.toUpperCase()}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}

                                                {/* ACTION MATRIX */}
                                                {(column.id === 'resume' || column.id === 'message') && (
                                                    <Stack direction="row" spacing={1}>
                                                        {column.id === 'resume' && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<DownloadRounded />}
                                                                onClick={() => handleDownload(job_applicant?.cvName, job_applicant?.jobID)}
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: 800,
                                                                    borderColor: `${statusColor}66`,
                                                                    color: statusColor,
                                                                    '&:hover': { borderColor: statusColor, bgcolor: `${statusColor}11` }
                                                                }}
                                                            >
                                                                CV
                                                            </Button>
                                                        )}
                                                        {column.id === 'message' && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<ChatBubbleOutlineRounded />}
                                                                onClick={() => handleOpenAlertMessage(job_applicant)}
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: 800,
                                                                    borderColor: `${statusColor}66`,
                                                                    color: statusColor,
                                                                    '&:hover': { borderColor: statusColor, bgcolor: `${statusColor}11` }
                                                                }}
                                                            >
                                                                COMMS
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={jobApplicants.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, mt: 1 }}
            />
        </Box>
    );
};

export default MetatronApplicantsTable;