import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React from "react";
import { PostAddRounded, SchoolRounded, TvRounded, Work } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import EventsAddModal from "../modal/EventsAddModal";
import PostCourseModal from "../modal/PostCourseModal";
import PostJobModal from "../modal/PostJobModal";
import PostTechModal from "../modal/PostTechModal";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const actions = [
  // under development
  {
    icon: <SchoolRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Course Upload",
  },

  {
    icon: <TvRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Upload Event",
  },
  {
    icon: <Work color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Upload Job",
  },
 
  {
    icon: <PostAddRounded color="primary" sx={{ width: 33, height: 33}} />,
    name: "Upload Milestone",
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

  // control showing opening of the Upload modal
  const [openModalTech, setOpenModalTech] = React.useState(false);
  const [openModalJob, setOpenModalJob] = React.useState(false);
  const [openModalCourse, setOpenModalCourse] = React.useState(false);
  const [openModalEvent, setOpenModalEvent] = React.useState(false);

  // redux states access
  const { isLoadingPostLaunch } = useSelector(
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
              if (action.name === "Upload Milestone") {
                setOpenModalTech(true);
              }
              if (action.name === "Upload Job") {
                setOpenModalJob(true);
              }

              if (action.name==="Upload Event") {
                setOpenModalEvent(true)
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
      {openModalTech && 
      <PostTechModal
        openModalTech={openModalTech}
        setOpenModalTech={setOpenModalTech}
      />}

      {/* Post Job Modal */}
      {openModalJob && 
      <PostJobModal
        openModalJob={openModalJob}
        setOpenModalJob={setOpenModalJob}
      />}

      {/* open post modal */}
      {openModalCourse && 
      <PostCourseModal
        openModalCourse={openModalCourse}
        setOpenModalCourse={setOpenModalCourse}
      />}
      {/* open modal event */}
      {openModalEvent && 
      <EventsAddModal 
      openModalEventAdd={openModalEvent}
      setOpenModalEventAdd={setOpenModalEvent}
      />}
    </Box>
  );
}
