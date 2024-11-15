import { CreditCardRounded, SchoolRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import django from "../../../images/django.png";
import pythonLogo from "../../../images/python.jpeg";
import video from "../../../video.mp4";
import CourseData from "../../data/CourseData";
import AccordionBrochure from "./AccordionBrochure";
import AccordionDescription from "./AccordionDescription";
import AccordionInstructor from "./AccordionInstructor";
import AccordionLectures from "./AccordionLectures";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";

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

  // handle playing state
  const handlePlay = () => {
    setPlay(true);
  };

  return (
    <Box className={!CustomDeviceIsSmall() ? "shadow rounded" : ""} mb={5}>
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
          <CreditCardRounded color="success" sx={{ width: 15, height: 15 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"bold"}
          >
            121 students
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
      <Divider component={"div"} className="p-1" />
      {/* description */}
      <Box>
        <AccordionDescription description={CourseData.description} />
      </Box>
      <Divider component={"div"} />

      {/* brochure download */}
      <Box>
        <AccordionBrochure />
      </Box>

      {/* purchase */}
      <Box p={1} width={"100%"} display={"flex"} justifyContent={"center"}>
        <Button
          className="w-100 rounded-5"
          startIcon={<CreditCardRounded />}
          variant="contained"
          size="small"
          sx={{ fontWeight: "bold" }}
          disableElevation
        >
          Buy KES 2,000{" "}
        </Button>
      </Box>
    </Box>
  );
}

export default CoursePaid;
