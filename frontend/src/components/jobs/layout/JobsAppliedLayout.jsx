import {
  CalendarMonthRounded,
  CheckRounded,
  DeleteRounded,
  LocationCityRounded,
  VisibilityOff,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import aws from "../../././../images/aws.jpeg";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
const DeleteJobAlert = lazy(() => import("../../alerts/DeleteJobAlert"));
const AccordionJobStats = lazy(() => import("./AccordionJobStats"));

export default function JobsAppliedLayout() {
  const [openAlert, setOpenAlert] = useState(false);

  const isViewed = false;
  // handle showing of the alert dialog for deleting the job
  const handleDeleteWarn = () => {
    setOpenAlert(true);
  };

  // title alert
  const title = "Delete Job Application?";
  // message for delete alert dialog
  const message =
    "This job application for the position machine learning engineer will be deleted from the system.";

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <Box display={"flex"} justifyContent={"center"}>
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
                      <Typography>Machine Learning Engineer</Typography>
                    ) : (
                      <Typography width={"100%"} textAlign={"center"}>
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
                        mt={1}
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
              <IconButton onClick={handleDeleteWarn}>
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
              Date 12/11/2024
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
            <AccordionJobStats isViewed={isViewed} />
          </Box>

          {/* concise application hint */}
          <Box
            display={"flex"}
            gap={2}
            alignItems={"center"}
            justifyContent={"space-around"}
            className={"px-3"}
          >
            {isViewed ? (
              <>
                <CheckRounded color="success" sx={{ width: 20, height: 20 }} />
                <Typography color={"text.secondary"} variant="body2">
                  Congrats! your application documents have been viewed by the
                  recruiter.
                </Typography>
              </>
            ) : (
              <>
                <VisibilityOff sx={{ width: 22, height: 22 }} />
                <Typography color={"text.secondary"} variant="body2">
                  Your application documents have not yet been viewed by the
                  recruter. once viewed this information will get updated.
                </Typography>
              </>
            )}
          </Box>
          {/* border at darkly */}
          {isDarkMode && <Divider component={"div"} className="mt-5" />}
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
