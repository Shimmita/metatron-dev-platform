import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, { lazy } from "react";

import {
  CodeRounded,
  SchoolRounded,
  Videocam,
  Work,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
const PostCourseModal = lazy(() => import("../modal/PostCourseModal"));
const PostTechModal = lazy(() => import("../modal/PostTechModal"));
const PostJobModal = lazy(() => import("../modal/PostJobModal"));

const actions = [
  {
    icon: <Videocam color="warning" sx={{ width: 26, height: 26 }} />,
    name: "GoLive Now",
  },
  {
    icon: <SchoolRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Course Upload",
  },
  {
    icon: <Work color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Job Posting",
  },
  {
    icon: <CodeRounded color="primary" sx={{ width: 28, height: 28 }} />,
    name: "Milestone Posting",
  },
];

export default function BasicSpeedDial() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (prev) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // control showing opening of the post modal
  const [openModalTech, setOpenModalTech] = React.useState(false);
  const [openModalJob, setOpenModalJob] = React.useState(false);
  const [openModalCourse, setOpenModalCourse] = React.useState(false);

  return (
    <Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", bottom: 10, right: 10 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            className="shadow border"
            onClick={(e) => {
              if (action.name === "Milestone Posting") {
                setOpenModalTech(true);
              }
              if (action.name === "Job Posting") {
                setOpenModalJob(true);
              }

              if (action.name === "Course Upload") {
                setOpenModalCourse(true);
              }
            }}
            tooltipTitle={
              <Typography
                p={1}
                className="shadow rounded"
                fontWeight={"bold"}
                variant="body2"
              >
                {action.name}
              </Typography>
            }
          />
        ))}
      </SpeedDial>
      {/* Tech Field Modal */}
      <PostTechModal
        openModalTech={openModalTech}
        setOpenModalTech={setOpenModalTech}
      />
      {/* Post Job Modal */}
      <PostJobModal
        openModalJob={openModalJob}
        setOpenModalJob={setOpenModalJob}
      />{" "}
      {/* open post modal */}
      <PostCourseModal
        openModalCourse={openModalCourse}
        setOpenModalCourse={setOpenModalCourse}
      />
    </Box>
  );
}
