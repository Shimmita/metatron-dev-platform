import {
  Avatar,
  Box,
  Button,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetSimilarCoursesModal } from "../../../redux/AppUI";
const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const precision = 0.5;

function SimilarCoursesLayout() {
  const ratedValue = 4.5;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   control showing of the course details
  const handleShowingCourseDetails = () => {
    // reset the modal
    dispatch(resetSimilarCoursesModal());
    navigate("/courses/paid/detailed");
  };

  return (
    <Box>
      <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
        {/* avatar */}
        <Avatar src="I" />
        {/* details */}
        <Box>
          {/* course title */}
          <Typography
            variant="body1"
            gutterBottom
            color="initial"
            textTransform={"capitalize"}
          >
            {" "}
            Penetration Testing With Metasploit{" "}
          </Typography>
          {/* poster or course owner or Instructor */}
          <Typography gutterBottom variant="body2" color="text.secondary">
            Gautam Krishna Govinda
          </Typography>

          {/* rating section */}
          <Box display={"flex"} gap={1} alignItems={"center"}>
            {/* stars  */}
            <Rating
              name="feedback"
              size="small"
              value={ratedValue}
              readOnly
              precision={precision}
            />
            {/* rating label */}
            <Typography variant="body2" color="text.secondary">
              {labels[ratedValue]}
            </Typography>

            {/* students enrolled and liked */}
            <Typography variant="body2" color="text.secondary">
              {" (200)"}
            </Typography>
          </Box>
          {/* btn viewing the course */}
          <Box mt={1}>
            <Button
              onClick={handleShowingCourseDetails}
              size="small"
              sx={{ textTransform: "lowercase" }}
            >
              View Course Details
            </Button>
          </Box>

          {/* divider */}
          <Divider className="p-2" component={"div"} />
        </Box>
      </Box>
    </Box>
  );
}

export default SimilarCoursesLayout;
