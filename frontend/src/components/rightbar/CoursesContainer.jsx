import { SchoolRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import PopularCouses from "./layouts/PopularCourses";

export default function CoursesContainer() {
  const screenWidth = window.screen.availWidth;
  // simulation of the items in the list
  const items = Array.from(new Array(3));

  // get the rightbar expanded appropritately
  const rightBarExpaned = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
    return;
  };

  return (
    <>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          pt={2}
        >
          <Typography fontWeight={"bold"} color={"primary"}>
            POPULAR COURSES
          </Typography>
          <SchoolRounded color="primary" />
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpaned(),
        }}
      >
        <Box>
          {items?.slice(0,3).map((index) => (
            <Box key={index}>
              <PopularCouses />
            </Box>
          ))}
        </Box>
      </List>
    </>
  );
}
