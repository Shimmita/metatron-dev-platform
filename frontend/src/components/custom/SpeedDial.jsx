import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, { lazy } from "react";

import {
  LaptopRounded,
  SchoolRounded,
  Videocam,
  Work,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
const PostTechModal = lazy(() => import("../modal/PostTechModal"));
const PostJobModal = lazy(() => import("../modal/PostJobModal"));

const actions = [
  {
    icon: <Videocam color="warning" sx={{ width: 26, height: 26 }} />,
    name: "GoLive Now",
  },
  {
    icon: <SchoolRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Course Posting",
  },
  {
    icon: <Work color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Job Posting",
  },
  {
    icon: <LaptopRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Project Posting",
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
              if (action.name === "Project Posting") {
                setOpenModalTech(true);
              }
              if (action.name === "Job Posting") {
                setOpenModalJob(true);
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
    </Box>
  );
}
