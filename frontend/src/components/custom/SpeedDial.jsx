import { LockRounded, PostAddRounded, SchoolRounded, ShieldRounded, TvRounded, Work } from "@mui/icons-material";
import { Fab, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventsAddModal from "../modal/EventsAddModal";
import PostCourseModal from "../modal/PostCourseModal";
import PostJobModal from "../modal/PostJobModal";
import PostTechModal from "../modal/PostTechModal";
import AdminControlPanel from "../admin/AdminControlPanel";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const actions = [
  {
    icon: <PostAddRounded color="primary" sx={{ width: 33, height: 33 }} />,
    name: "Upload Milestone",
  },
  {
    icon: <Work color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Upload Job",
  },
  {
    icon: <TvRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Upload Event",
  },
  {
    icon: <SchoolRounded color="primary" sx={{ width: 26, height: 26 }} />,
    name: "Course Upload",
  },

];

// actions for login and register
const actionsAuth = [
  {
    icon: <LockRounded color="primary" sx={{ width: 33, height: 33 }} />,
    name: "Login",
  },
]

export default function BasicSpeedDial() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (prev) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate()

  // control showing opening of the Upload modal
  const [openModalTech, setOpenModalTech] = React.useState(false);
  const [openModalJob, setOpenModalJob] = React.useState(false);
  const [openModalCourse, setOpenModalCourse] = React.useState(false);
  const [openModalEvent, setOpenModalEvent] = React.useState(false);
  const [openAdminPanel, setOpenAdminPanel] = React.useState(false);

  // redux states access
  const { isLoadingPostLaunch } = useSelector(
    (state) => state.appUI
  );
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const isAdmin = !isGuest && user?.role === "admin";

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 30) {
        // scrolling down → hide
        setVisible(false);
      } else {
        // scrolling up → show
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Box
      sx={{
        transform: "translateZ(0px)",
        flexGrow: 1,
        position: "relative",
        width: 64,
        height: isAdmin ? 136 : 64,
        visibility: isLoadingPostLaunch ? "hidden" : "visible",

      }}
    >
      {isAdmin && (
        <Tooltip title={<Typography p={1} fontWeight="bold" variant="body2">Admin Panel</Typography>} placement="left">
          <Fab
            color="primary"
            aria-label="Admin Panel"
            onClick={() => setOpenAdminPanel(true)}
            sx={{
              position: "absolute",
              bottom: 74,
              right: CustomDeviceSmallest() ? 5 : CustomDeviceTablet() ? 7 : 12,
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #20D6C7, #3B82F6)",
              color: "#ffffff",
              boxShadow: "0 18px 40px rgba(32,214,199,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #0F9F91, #2563EB)",
              },
            }}
          >
            <ShieldRounded />
          </Fab>
        </Tooltip>
      )}

      {isGuest ? (
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{
            position: "fixed",
            bottom: 10,
            transform: visible ? "translateY(0)" : "translateY(120%)",
            opacity: visible ? 1 : 0,
            transition: "all 0.35s ease",
            right: CustomDeviceSmallest() ? 5 : CustomDeviceTablet() ? 7 : 12,
          }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actionsAuth.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={(e) => {
                if (action.name === "Login") {
                  navigate("/auth/login")
                }

              }}
              tooltipTitle={
                <Typography
                  p={1}
                  fontWeight={"bold"}
                  variant="body2"
                >
                  {action.name}
                </Typography>
              }
            />
          ))}
        </SpeedDial>
      ) : (
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
              onClick={(e) => {
                if (action.name === "Upload Milestone") {
                  setOpenModalTech(true);
                }
                if (action.name === "Upload Job") {
                  setOpenModalJob(true);
                }

                if (action.name === "Upload Event") {
                  setOpenModalEvent(true)
                }

                if (action.name === "Course Upload") {
                  setOpenModalCourse(true);
                }
              }}
              tooltipTitle={
                <Typography
                  p={1}
                  fontWeight={"bold"}
                  variant="body2"
                >
                  {action.name}
                </Typography>
              }
            />
          ))}
        </SpeedDial>
      )}

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

      {isAdmin && (
        <AdminControlPanel
          open={openAdminPanel}
          onClose={() => setOpenAdminPanel(false)}
        />
      )}
    </Box>
  );
}
