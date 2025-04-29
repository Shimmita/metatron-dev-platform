import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, { lazy } from "react";

import { CodeRounded, SchoolRounded, Work } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const PostCourseModal = lazy(() => import("../modal/PostCourseModal"));
const PostTechModal = lazy(() => import("../modal/PostTechModal"));
const PostJobModal = lazy(() => import("../modal/PostJobModal"));

const actions = [
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
    name: "Tech Posting",
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

  // redux states access
  const { isPostModalRedux, isLoadingPostLaunch } = useSelector(
    (state) => state.appUI
  );

  return (
    <Box
      sx={{
        transform: "translateZ(0px)",
        flexGrow: 1,
        visibility: isLoadingPostLaunch ? "hidden" : "visible",
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{
          position: "absolute",
          bottom: 0,
          right: CustomDeviceSmallest() ? 5 : CustomDeviceTablet() ? 7 : 12,
        }}
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
              if (action.name === "Tech Posting") {
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
        openModalTech={openModalTech || isPostModalRedux}
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
