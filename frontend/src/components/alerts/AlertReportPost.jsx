import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  WarningRounded,
  DocumentScannerRounded,
  PlagiarismRounded,
  PhishingRounded,
} from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";

const reporting_about_array = [
  "Irrelevant tech content",
  "Plagiarized tech content",
  "Phishing and fraudulent",
];

const descriptionMax = 200;

export default function AlertReportPost({
  openAlertReport,
  setOpenAlertReport,
  post,
  currentUser,
}) {
  const [reportAbout, setReportAbout] = useState("");
  const [description, setDescription] = useState("");
  const [supportLink, setSupportLink] = useState("");
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleClose = () => {
    if (!isFetching) setOpenAlertReport(false);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/report/create`,
        {
          postId: post?._id,
          report_title: reportAbout,
          report_message: description,
          reporter_link: supportLink,
        }
      );

      setMessage(res.data);
      setReportAbout("");
      setDescription("");
    } catch (err) {
      if (err?.code === "ERR_NETWORK") {
        setMessage("Server unreachable");
      } else {
        setMessage(err?.response?.data);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Dialog
      open={openAlertReport}
      onClose={handleClose}
      TransitionComponent={Fade}
      fullWidth
      maxWidth="sm"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            background: "rgba(6,13,24,0.7)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={2}
        py={1.5}
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(239,68,68,0.15)",
            color: "#EF4444",
          }}
        >
          <WarningRounded />
        </Box>

        <Box>
          <Typography fontSize={14} fontWeight={600} color="#F0F4FA">
            Report Content
          </Typography>
          <Typography fontSize={11} sx={{ color: "rgba(240,244,250,0.5)" }}>
            Help keep Metatron safe
          </Typography>
        </Box>
      </Box>

      {/* POST TITLE */}
      <Box px={2} py={1}>
        <Typography
          fontSize={13}
          fontWeight={600}
          sx={{ color: "#F0F4FA" }}
        >
          {post?.post_title}
        </Typography>
      </Box>

      {/* MESSAGE */}
      {message && (
        <Box px={2}>
          <Typography
            fontSize={12}
            sx={{ color: "#14D2BE", textAlign: "center" }}
          >
            {message}
          </Typography>
        </Box>
      )}

      {/* FORM */}
      <Box px={2} py={2} component="form" onSubmit={handleSubmitReport}>
        {/* SELECT */}
        <TextField
          select
          fullWidth
          label="Reason for reporting"
          value={reportAbout}
          onChange={(e) => setReportAbout(e.target.value)}
          required
          disabled={isFetching}
          sx={{ mb: 2 }}
        >
          {reporting_about_array.map((item) => (
            <MenuItem key={item} value={item}>
              {item.includes("Phishing") ? (
                <PhishingRounded sx={{ mr: 1 }} />
              ) : item.includes("Plagiarized") ? (
                <PlagiarismRounded sx={{ mr: 1 }} />
              ) : (
                <DocumentScannerRounded sx={{ mr: 1 }} />
              )}
              {item}
            </MenuItem>
          ))}
        </TextField>

        {/* LINK */}
        <TextField
          fullWidth
          label="Supporting link (optional)"
          value={supportLink}
          onChange={(e) => setSupportLink(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isFetching}
        />

        {/* DESCRIPTION */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label={`Description (${descriptionMax - description.length})`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isFetching}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* ACTIONS */}
      <Box display="flex" justifyContent="flex-end" gap={1.2} px={2} pb={2}>
        <Button
          onClick={handleClose}
          disabled={isFetching}
          sx={{
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isFetching || description.length > descriptionMax}
          sx={{
            borderRadius: "10px",
            background: "linear-gradient(135deg,#EF4444,#FF6D3A)",
            color: "#fff",
          }}
        >
          {isFetching ? (
            <CircularProgress size={16} />
          ) : (
            "Submit Report"
          )}
        </Button>
      </Box>
    </Dialog>
  );
}