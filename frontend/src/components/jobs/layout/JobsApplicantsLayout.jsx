import {
  CalendarMonthRounded,
  DeleteRounded,
  LocationCityRounded,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import aws from "../../././../images/aws.jpeg";
import DeleteJobAlert from "../../alerts/DeleteJobAlert";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { useNavigate } from "react-router-dom";
const AccordionJobPostedStats = lazy(() => import("./AccordionJobPostedStats"));

export default function JobsApplicantsLayout() {
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  // title alert
  const title = "Delete Posted Job?";
  // message for delete alert dialog
  const message =
    "You as the recruter of this job will delete the post. This has an impact of removing the job post from applicants to apply and also getting wiped out from the histoy of jobs you posted.";
  const handleNavigateAllApplicants = () => navigate("/jobs/applicants");
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      bgcolor={"background.paper"}
    >
      <Box
        m={2}
        className={CustomDeviceIsSmall() ? "rounded" : "shadow rounded "}
        width={"100%"}
      >
        <List>
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar alt="" src={aws} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {CustomDeviceIsSmall() ? (
                      <Typography variant="body2">
                        Machine Learning Engineer
                      </Typography>
                    ) : (
                      <Typography
                        width={"100%"}
                        textAlign={"center"}
                        variant="body2"
                      >
                        Machine Learning Engineer
                      </Typography>
                    )}
                  </>
                }
                secondary={
                  <>
                    {CustomDeviceIsSmall() ? (
                      <Typography variant="body2">
                        Amazon Web Services (AWS)
                      </Typography>
                    ) : (
                      <Typography
                        width={"100%"}
                        textAlign={"center"}
                        variant="body2"
                      >
                        Amazon Web Services (AWS)
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
            {/* delete Icon */}
            <Box>
              <IconButton onClick={() => setOpenAlert(true)}>
                <DeleteRounded />
              </IconButton>
            </Box>
          </Box>
          <Box
            display={"flex"}
            gap={1}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {/* calendar icon */}
            <CalendarMonthRounded sx={{ width: 18, height: 18 }} />
            {/* date text */}
            <Typography variant="body2" color={"text.secondary"}>
              Posted 12/11/2024
            </Typography>

            {/* location icon */}
            <LocationCityRounded sx={{ width: 18, height: 18 }} />
            {/* location name */}
            <Typography variant="body2" color={"text.secondary"}>
              Work Nairobi
            </Typography>
          </Box>
          {/* accordion job stats */}
          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <AccordionJobPostedStats />
          </Box>
          {/* text info about downloading user documents */}
          <Box display={"flex"} justifyContent={"center"} p={2}>
            <Typography variant="body2" color="text.secondary">
              Click the button below to proceed with viewing and downloading job
              applicantion documents submitted by the applicants.
            </Typography>
          </Box>

          {/* btn download applicants CVs and Cover letters */}
          <Box display={"flex"} justifyContent={"center"} m={2}>
            <Button
              size="small"
              disableElevation
              className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
              variant={isDarkMode ? "text" : "contained"}
              sx={{ borderRadius: "20px" }}
              onClick={handleNavigateAllApplicants}
            >
              View All Applicants
            </Button>
          </Box>
          {CustomDeviceIsSmall() && (
            <Divider component={"li"} className="mt-3" />
          )}
          {!CustomDeviceIsSmall() && isDarkMode && (
            <Divider component={"li"} className="mt-3" />
          )}
        </List>
      </Box>
      {/* alert delete job */}
      <DeleteJobAlert
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        message={message}
        title={title}
      />
    </Box>
  );
}
