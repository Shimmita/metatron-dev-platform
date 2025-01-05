import {
  FavoriteBorderOutlined,
  FavoriteRounded,
  PaidRounded,
  PersonAdd,
  SchoolRounded,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";
import { useDispatch } from "react-redux";
import django from "../../../images/django.png";
import pythonLogo from "../../../images/python.jpeg";
import { resetSimilarCoursesModal } from "../../../redux/AppUI";
import video from "../../../video.mp4";
import CourseData from "../../data/CourseData";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
const AccordionDescription = lazy(() => import("./AccordionDescription"));
const AccordionInstructor = lazy(() => import("./AccordionInstructor"));
const AccordionLectures = lazy(() => import("./AccordionLectures"));
const AccordionRemarks = lazy(() => import("./AccordionComments"));

const labels = {
  0.5: "poor",
  1: "poor+",
  1.5: "fair",
  2: "fair+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function CoursePaid() {
  // track video play state
  const [isPlay, setPlay] = useState(false);
  const dispatch = useDispatch();

  // handle playing state
  const handlePlay = () => {
    setPlay(true);
  };

  // handle showing of the similar courses modal
  const handleShowingSimilarCourses = () => {
    dispatch(resetSimilarCoursesModal());
  };

  return (
    <Box className={!CustomDeviceIsSmall() ? "shadow rounded" : ""} p={1}>
      <Box>
        <video
          className="rounded-2"
          width={"100%"}
          src={video}
          height={!isPlay ? 280 : undefined}
          controls
          onPlay={handlePlay}
          poster={pythonLogo}
        >
          <Typography color={"error"}>video not supported</Typography>
        </video>
      </Box>
      {/* title */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
        mb={1}
      >
        <Avatar alt="image" src={pythonLogo} sx={{ width: 27, height: 27 }} />
        <Typography variant="body1" color="text.secondary" fontWeight={"bold"}>
          Python Django Full Course
        </Typography>
        <Avatar alt="image" src={django} sx={{ width: 27, height: 27 }} />
      </Box>

      {/* lectures + studenst */}
      <Box
        className="px-1"
        mb={1}
        display={"flex"}
        alignItems={"center"}
        gap={1}
        justifyContent={"space-between"}
      >
        {/* lectures */}
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <SchoolRounded color="primary" sx={{ width: 15, height: 15 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10 lectures
          </Typography>
        </Box>

        {/* students */}
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PersonAdd color="primary" sx={{ width: 16, height: 16 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            10,000 students
          </Typography>
        </Box>

        {/* rating */}
        <Box display={"flex"} alignItems={"center"}>
          <Rating
            name="feedback"
            size="small"
            value={CourseData.rating}
            readOnly
            precision={0.5}
          />
        </Box>
      </Box>

      {/* instructor */}
      <Box>
        <AccordionInstructor instructor={CourseData.inst} />
      </Box>
      <Divider component={"div"} />
      {/* what lectures accordion */}
      <Box>
        <AccordionLectures lectures={CourseData.leactures} />
      </Box>
      <Divider component={"div"} />
      {/* description */}
      <Box>
        <AccordionDescription description={CourseData.description} />
      </Box>
      <Divider component={"div"} />

      {/* student remarks */}
      <Box>
        <AccordionRemarks description={CourseData.description} />
      </Box>

      {/* similar or related courses */}
      <Box justifyContent={"center"} display={"flex"} width={"100%"}>
        <Button
          className="rounded"
          onClick={handleShowingSimilarCourses}
          startIcon={<TipsAndUpdatesOutlined sx={{ width: 17, height: 17 }} />}
          variant="text"
          sx={{ textTransform: "lowercase" }}
        >
          {" "}
          similar courses
        </Button>
      </Box>

      {/* purchase */}
      <Box
        mt={1}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {/* add to favourite button */}
        <Tooltip arrow title="favorite">
          <Checkbox
            icon={<FavoriteBorderOutlined sx={{ width: 21, height: 21 }} />}
            checkedIcon={
              <FavoriteRounded color="primary" sx={{ width: 21, height: 21 }} />
            }
          />
        </Tooltip>

        {/* enroll course button contol */}
        <Box mr={5} display={"flex"} justifyContent={"center"} width={"100%"}>
          <Button
            className="rounded-5"
            startIcon={<PaidRounded />}
            sx={{ fontWeight: "bold" }}
            disableElevation
          >
            Enroll USD $20{" "}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CoursePaid;
