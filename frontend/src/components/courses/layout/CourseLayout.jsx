import {
  AutoAwesomeRounded,
  DoneRounded,
  VideoLibraryRounded,
  PlayCircleFilledRounded,
  GroupRounded,
  ShareRounded,
  LocalLibraryRounded,
  LockRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Rating,
  Stack,
  Typography,
  ButtonBase
} from "@mui/material";
import { lazy, useState } from "react";
import { useSelector } from "react-redux";
import pythonLogo from "../../../images/python.jpeg";
import AlertSimilarCourses from "../../alerts/AlertSimilarCourses";
import MetatronSnackbar from "../../snackbar/MetatronSnackBar";
const AccordionDescription = lazy(() => import("./AccordionDescription"));

function CourseLayout({ isDarkMode = false, courseItem, setFocusedCourse, setErrorMessage }) {
  // redux state manager
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const isMyCourse = user?._id === courseItem?.course_instructor?.instructorId
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const [showSimilar, setShowSimilar] = useState(false)
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);


  const handleOpenPlayer = () => {
    if (isGuest) {
      setErrorMessage?.("access denied, please login to continue with your request!");
      return;
    }

    setFocusedCourse(courseItem)
  };

  // handle showing similar courses suggestion
  const handleShowSimilarCourses = () => {
    setShowSimilar(true)
  }

  // handle get course link
  const handleGetCourseLink = async () => {
    const urlCourse = `${window.location.href}?id=${courseItem?._id}`
    try {
      await navigator.clipboard.writeText(urlCourse);
      setIsCopiedStatus(true);
      setTimeout(() => {
        setIsCopiedStatus(false)
      }, 2000);
    } catch (err) {
      console.error('Failed to Copy: ', err);
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={2}
      mb={3}
      flexDirection="column"
      sx={{ width: "100%", minWidth: 0, alignItems: "center" }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: "100%",
          borderRadius: "8px",
          background: isDarkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(214,178,94, 0.2)" : "rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "primary.main",
            boxShadow: isDarkMode ? "0 18px 42px rgba(0,0,0,0.34)" : "0 18px 36px rgba(139,111,42,0.10)",
          }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* ─── PREMIUM HEADER BADGE ─── */}
          <Box
            sx={{
              p: 1.75,
              textAlign: "left",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(214,178,94, 0.2), rgba(139,111,42, 0.4))"
                : "linear-gradient(135deg, #D6B25E, #8B6F2A)",
              borderRadius: "8px 8px 0 0",
              position: "relative"
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Avatar
                src={pythonLogo}
                variant="rounded"
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  flexShrink: 0,
                }}
              />
              <Box minWidth={0} flex={1}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, fontSize: "1rem", lineHeight: 1.22 }}>
                  {courseItem?.course_title}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.78)", fontWeight: 700 }}>
                  Practical developer course
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1} sx={{ mt: 1.25 }}>
              <Rating value={courseItem?.course_rate_count} readOnly size="small" precision={0.5}
                sx={{ "& .MuiRating-iconFilled": { color: "#FFD700" } }}
              />
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>
                {courseItem?.course_rate_count?.toFixed(1)}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 2 }}>
            {/* ─── METADATA GRID ─── */}
	            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
	              <Box textAlign="left">
                <LocalLibraryRounded sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography variant="caption" display="block" sx={{ fontWeight: 800, opacity: 0.7 }}>
                  {courseItem?.course_video_lectures?.length} Modules
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
	              <Box textAlign="right">
                <GroupRounded sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography variant="caption" display="block" sx={{ fontWeight: 800, opacity: 0.7 }}>
                  {courseItem?.student_count} Students
                </Typography>
              </Box>
            </Stack>

            {/* ─── CLICKABLE INSTRUCTOR HUD ─── */}
            <ButtonBase
              sx={{
                width: "100%",
                p: 1,
                borderRadius: "8px",
                bgcolor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                display: "flex",
                justifyContent: "flex-start",
                gap: 1.5,
                "&:hover": { bgcolor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }
              }}
            >
              <Avatar src={courseItem?.course_instructor?.instructorAvatar} sx={{ width: 32, height: 32 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" sx={{ display: "block", color: "primary.main", fontWeight: 800, fontSize: "0.6rem" }}>
                  INSTRUCTOR
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, fontSize: "0.75rem" }}>
                  {courseItem?.course_instructor?.instructorName?.split(" ")?.[0] || "Instructor"}
                </Typography>
              </Box>
            </ButtonBase>

            <Box sx={{ my: 1 }}>
              <AccordionDescription description={courseItem?.course_description} setOpenAccordion={setIsOpenAccordion} />
            </Box>

            {!isOpenAccordion && (
              <>
                {/* ─── UTILITY ACTIONS ─── */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<AutoAwesomeRounded />}
                    onClick={handleShowSimilarCourses}
                    sx={{ fontSize: "0.65rem", fontWeight: 800, borderRadius: "8px" }}
                  >
                    Similar
                  </Button>
                  <Button
                    fullWidth
                    size="small"
	                    color="primary"
                    startIcon={isCopiedStatus ? <DoneRounded /> : <ShareRounded />}
                    onClick={handleGetCourseLink}
                    sx={{ fontSize: "0.65rem", fontWeight: 800, borderRadius: "8px" }}
                  >
                    {isCopiedStatus ? "Copied" : "Share"}
                  </Button>
                </Stack>

                {/* ─── ENROLLMENT FOOTER ─── */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ display: "block", mb: 1, opacity: 0.6, fontWeight: 700 }}>
                    {isGuest ? "Login to Enroll" : isMyCourse ? "Creator Access" : "Free Full Access"}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleOpenPlayer}
                    startIcon={isGuest ? <LockRounded /> : isMyCourse ? <VideoLibraryRounded /> : <PlayCircleFilledRounded />}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      fontWeight: 800,
                      textTransform: "none",
                      background: !isDarkMode ? "linear-gradient(90deg, #D6B25E, #8B6F2A)" : "primary.main",
                      boxShadow: "0 4px 12px rgba(214,178,94, 0.3)"
                    }}
                  >
                    {isGuest ? "Login to Enroll" : isMyCourse ? "Enter Studio" : courseItem?.currentUserEnrolled ? "Continue Learning" : "Enroll & Start"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* show snack success when link copied */}
      {isCopiedStatus && (
        <MetatronSnackbar
          open={isCopiedStatus}
          message={"Course link copied to clipboard!"}
          handleClose={setIsCopiedStatus}

        />
      )}

      {showSimilar && (
        <AlertSimilarCourses
          openSimilarCourses={showSimilar}
          setOpenSimilarCourses={setShowSimilar}
          courseId={courseItem?._id}
          isDarkMode={isDarkMode}
          courseName={courseItem?.course_title}
          setFocusedCourse={setFocusedCourse}
        />
      )}
    </Box>
  );
}

export default CourseLayout;
