import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  Avatar,
  Rating,
  CircularProgress,
} from "@mui/material";
import { SchoolRounded, MenuBookRounded } from "@mui/icons-material";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AlertSimilarCourses({
  openSimilarCourses,
  setOpenSimilarCourses,
  courseId,
  courseName,
  setFocusedCourse,
}) {
  const [similarCourses, setSimilarCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, isGuest } = useSelector((state) => state.currentUser);

  const handleClose = () => setOpenSimilarCourses(false);

  const handleFocusedCourse = (course) => {
    setFocusedCourse(course);
    handleClose();
  };

  useLayoutEffect(() => {
    setIsFetching(true);

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/similar/${user?._id}/${courseId}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res?.data) setSimilarCourses(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.login) window.location.reload();

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server unreachable");
        } else {
          setErrorMessage(err?.response?.data);
        }
      })
      .finally(() => setIsFetching(false));
  }, [user, courseId]);

  return (
    <Dialog
      open={openSimilarCourses}
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
            background: "rgba(20,210,190,0.15)",
            color: "#14D2BE",
          }}
        >
          <SchoolRounded />
        </Box>

        <Typography fontSize={14} fontWeight={600} color="#F0F4FA">
          Similar Courses
        </Typography>
      </Box>

      {/* SUBTEXT */}
      <Box px={2} py={1}>
        <Typography
          fontSize={12}
          sx={{
            color: errorMessage
              ? "#F59E0B"
              : "rgba(240,244,250,0.6)",
          }}
        >
          {errorMessage || courseName}
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box px={2} pb={2} maxHeight="65vh" overflow="auto">
        {isFetching ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress size={30} />
          </Box>
        ) : similarCourses.length ? (
          similarCourses.map((course) => (
            <Box
              key={course._id}
              mb={1.2}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.25s ease",

                "&:hover": {
                  background: "rgba(20,210,190,0.06)",
                  borderColor: "rgba(20,210,190,0.3)",
                },
              }}
            >
              <Box display="flex" gap={1.5}>
                {/* AVATAR */}
                <Avatar
                  src={course?.course_instructor?.instructorAvatar}
                  sx={{
                    width: 44,
                    height: 44,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />

                {/* DETAILS */}
                <Box flex={1}>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    color="#F0F4FA"
                  >
                    {course?.course_title}
                  </Typography>

                  <Typography
                    fontSize={12}
                    sx={{ color: "rgba(240,244,250,0.6)" }}
                  >
                    {course?.course_instructor?.instructorName}
                  </Typography>

                  {/* RATING */}
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Rating
                      size="small"
                      value={course?.course_rate_count}
                      readOnly
                      precision={0.5}
                    />
                    <Typography
                      fontSize={11}
                      sx={{ color: "rgba(240,244,250,0.5)" }}
                    >
                      {course?.course_rate_count}
                    </Typography>
                  </Box>

                  {/* BUTTON */}
                  <Box mt={1}>
                    <Button
                      disabled={isGuest}
                      onClick={() => handleFocusedCourse(course)}
                      sx={{
                        borderRadius: "8px",
                        fontSize: 11,
                        px: 1.5,
                        background:
                          "linear-gradient(135deg,#0FA88F,#14D2BE)",
                        color: "#fff",

                        "&:hover": {
                          background:
                            "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={4}
            gap={1}
          >
            <MenuBookRounded sx={{ color: "#14D2BE" }} />
            <Typography
              fontSize={13}
              sx={{ color: "rgba(240,244,250,0.6)" }}
            >
              No Similar Courses Found
            </Typography>
          </Box>
        )}
      </Box>

      {/* ACTION */}
      <Box px={2} pb={2} display="flex" justifyContent="flex-end">
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
}