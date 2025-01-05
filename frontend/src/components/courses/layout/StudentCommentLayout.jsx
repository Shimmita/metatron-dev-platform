import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import dev from "../../../images/dev.jpeg";

const StudentCommentLayout = () => {
  return (
    <Stack width={"100%"} direction={"row"} gap={2} alignItems={"center"}>
      {/* avatar */}
      <Avatar src={dev} alt="" sx={{ width: 30, height: 30 }} />

      <Stack width={"100%"}>
        {/* student name  + rating box*/}
        <Box display={"flex"} gap={2}>
          <Typography variant="body2"> Neils Bravo</Typography>
          {/* rating */}
          <Rating
            name="feedback"
            size="small"
            value={4}
            readOnly
            precision={0.5}
          />
        </Box>

        {/* comment */}
        <Box width={"100%"}>
          <Typography variant="body2" color={"text.secondary"} gutterBottom>
            {" "}
            This course is the true definition of delivering content precisely.
            It's worth enrolling.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default StudentCommentLayout;
