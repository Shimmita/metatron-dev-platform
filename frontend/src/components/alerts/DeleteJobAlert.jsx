import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
} from "@mui/material";
import { WarningRounded } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetClearCurrentJobs } from "../../redux/CurrentJobs";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";

export default function DeleteJobAlert({
  openAlert,
  setOpenAlert,
  message,
  title,
  applicants = 0,
  my_email,
  job_id,
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const handleClose = () => setOpenAlert(false);

  const handleCompleteDeletion = async () => {
    setIsFetching(true);

    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/job/delete/${my_email}/${job_id}`,
        { withCredentials: true }
      );

      if (res?.data) {
        dispatch(resetClearCurrentJobs());
        dispatch(resetClearCurrentJobsTop());

        dispatch(
          updateCurrentSuccessRedux({
            title: "Job Deleted",
            message:
              "The job and all associated data have been permanently removed.",
          })
        );

        handleClose();
      }
    } catch (err) {
      if (err?.response?.data?.login) {
        window.location.reload();
      }

      if (err?.code === "ERR_NETWORK") {
        setErrorMessage("Server unreachable");
      } else {
        setErrorMessage(err?.response?.data);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Dialog
      open={openAlert}
      onClose={handleClose}
      closeAfterTransition
      TransitionComponent={Fade}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
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
          width: { xs: "90vw", sm: 400 },
          overflow: "hidden",
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
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
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
            {title}
          </Typography>

          <Typography
            fontSize={11}
            sx={{ color: "rgba(240,244,250,0.5)" }}
          >
            {applicants}{" "}
            {applicants === 1 ? "applicant affected" : "applicants affected"}
          </Typography>
        </Box>
      </Box>

      {/* ERROR */}
      {errorMessage && (
        <Box px={2} pt={1}>
          <Typography
            fontSize={12}
            sx={{ color: "#F59E0B", textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        </Box>
      )}

      {/* CONTENT */}
      <Box px={2} py={2}>
        <Typography
          fontSize={13}
          sx={{
            color: "rgba(240,244,250,0.7)",
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* ACTIONS */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={1.2}
        px={2}
        pb={2}
      >
        {/* CANCEL */}
        <Button
          disabled={isFetching}
          onClick={handleClose}
          sx={{
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",

            "&:hover": {
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Cancel
        </Button>

        {/* DELETE */}
        <Button
          disabled={isFetching}
          onClick={handleCompleteDeletion}
          sx={{
            borderRadius: "10px",
            background: "linear-gradient(135deg,#EF4444,#FF6D3A)",
            color: "#fff",
            px: 2,

            "&:hover": {
              background: "linear-gradient(135deg,#DC2626,#FF6D3A)",
            },
          }}
        >
          {isFetching ? "Deleting..." : "Delete"}
        </Button>
      </Box>
    </Dialog>
  );
}