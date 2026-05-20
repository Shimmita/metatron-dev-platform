import { SchoolRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import PopularCouses from "./layouts/PopularCourses";

export default function CoursesContainer() {
  // simulation of the items in the list
  const items = Array.from(new Array(9));

  return (
    <>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
          py={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolRounded sx={{ color: "#14D2BE", fontSize: 18 }} />
            <Typography fontSize={13} fontWeight={600} color="#F0F4FA">
              Learning Tracks
            </Typography>
          </Box>
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          width: "100%",
          p: 0,
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 1 }}
        >
          {items?.map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 250px',
                minWidth: '200px',
                maxWidth: '300px',
              }}
            >
              <PopularCouses />
            </Box>
          ))}
        </Box>
      </List>
    </>
  );
}
