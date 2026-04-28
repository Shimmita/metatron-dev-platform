import {
  AutoAwesomeRounded,
  CastForEducationRounded,
  DoneRounded,
  LockRounded,
  MobileScreenShareRounded,
  PersonAdd,
  SchoolRounded,
  VideoLibraryRounded,
  PlayCircleFilledRounded,
  GroupRounded,
  ShareRounded,
  LocalLibraryRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Rating,
  Stack,
  Typography,
  ButtonBase
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { lazy, useState } from "react";
import { useSelector } from "react-redux";
import { appColors, appGradients } from "../../../utils/colors";
import pythonLogo from "../../../images/python.jpeg";
import AlertSimilarCourses from "../../alerts/AlertSimilarCourses";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import MetatronSnackbar from "../../snackbar/MetatronSnackBar";
const AccordionDescription = lazy(() => import("./AccordionDescription"));

function CourseLayout({ isDarkMode = false, courseItem, setFocusedCourse }) {
  const theme = useTheme();

  // redux state manager
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const isMyCourse = user?._id === courseItem?.course_instructor?.instructorId
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)
  const [showSimilar, setShowSimilar] = useState(false)
  const [isCopiedStatus, setIsCopiedStatus] = useState(false);


  const handleOpenPlayer = () => {
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
    <Box display="flex" justifyContent="center" gap={2} mb={3} flexDirection="column">
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: CustomDeviceTablet() ? 300 : 340,
          borderRadius: "20px",
          background: isDarkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(20, 210, 190, 0.2)" : "rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-5px)" }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* ─── PREMIUM HEADER BADGE ─── */}
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(20, 210, 190, 0.2), rgba(15, 76, 129, 0.4))"
                : "linear-gradient(135deg, #1976D2, #1565C0)",
              borderRadius: "20px 20px 0 0",
              position: "relative"
            }}
          >
            <Avatar
              src={pythonLogo}
              sx={{
                width: 60,
                height: 60,
                margin: "0 auto",
                mb: 1.5,
                border: "3px solid #fff",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
              }}
            />
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>
              {courseItem?.course_title}
            </Typography>

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Rating value={courseItem?.course_rate_count} readOnly size="small" precision={0.5}
                sx={{ "& .MuiRating-iconFilled": { color: "#FFD700" } }}
              />
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                {courseItem?.course_rate_count?.toFixed(1)}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 2 }}>
            {/* ─── METADATA GRID ─── */}
            <Stack direction="row" justifyContent="space-around" sx={{ mb: 2 }}>
              <Box textAlign="center">
                <LocalLibraryRounded sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography variant="caption" display="block" sx={{ fontWeight: 800, opacity: 0.7 }}>
                  {courseItem?.course_video_lectures?.length} Modules
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
              <Box textAlign="center">
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
                borderRadius: "12px",
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
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                  {courseItem?.course_instructor?.instructorName}
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
                    color={isCopiedStatus ? "success" : "primary"}
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
                    disabled={isGuest}
                    onClick={handleOpenPlayer}
                    startIcon={isMyCourse ? <VideoLibraryRounded /> : <PlayCircleFilledRounded />}
                    sx={{
                      borderRadius: "12px",
                      py: 1,
                      fontWeight: 800,
                      textTransform: "none",
                      background: !isDarkMode ? "linear-gradient(90deg, #1976D2, #1565C0)" : "primary.main",
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)"
                    }}
                  >
                    {isMyCourse ? "Enter Studio" : courseItem?.currentUserEnrolled ? "Continue Learning" : "Enroll & Start"}
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
