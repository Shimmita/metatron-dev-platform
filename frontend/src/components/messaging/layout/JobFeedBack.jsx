import { ArrowForwardIos, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleSidebarRightbar, showMessagingDrawer } from "../../../redux/AppUI";
import { updateCurrentBottomNav } from "../../../redux/CurrentBottomNav";
import { deleteCurrentJobFeedBack } from "../../../redux/CurrentJobFeedBack";
import { updateNotificationSnackBar } from "../../../redux/CurrentSnackBar";
import { getElapsedTime } from "../../utilities/getElapsedTime";
import {
  avatarSx,
  iconButtonSx,
  notificationCardSx,
} from "../communicationStyles";

  function JobFeedBack({
    jobFeedBack,
  }) {
  

  const [isFetching, setIsFetching] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()

  // redux UI state
   const { isSidebarRighbar } = useSelector((state) => state.appUI);
  

    const handleCountryName = () => {
      const parent = jobFeedBack?.country?.split(" ") || [];
      const countryCode = parent.pop();
      const finalName =
        parent.length > 2
          ? `${parent[0]} ${parent[1]} ${countryCode}`
          : jobFeedBack?.country;
  
      return finalName;
    };


    // handle navigate to the job stats
    const handleNavigateJobStats=()=>{
      // update the bottom nav index to point jobs
      dispatch(updateCurrentBottomNav(1))

      // close the drawer for it will reverse the current state
      dispatch(showMessagingDrawer())

       // updating side bar and right bar show false
        if (isSidebarRighbar) {
          dispatch(handleSidebarRightbar());
        }

      // navigate to jobs
      navigate('/jobs')

    }
  
    // handle deletion of the current notification job feedback
      const handleDeleteReaction = () => {
        // set is fetching to true
        setIsFetching(true);
    
        // performing post request
        axios
          .delete(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/feedback/${jobFeedBack?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res?.data) {
              // update the redux of of profile view to reflect the current changes
              dispatch(deleteCurrentJobFeedBack(jobFeedBack));
           
            }
          })
          .catch((err) => {
            if (err?.code === "ERR_NETWORK") {
              // update the snackbar notification of the error of connection
              dispatch(updateNotificationSnackBar("Network Error"));
              return;
            }
            // update the snackbar notification of error from the server
            dispatch(updateNotificationSnackBar(err?.response.data));
          })
          .finally(() => {
            // set is fetching to false
            setIsFetching(false);
          });
      };
  
    return (
      <List sx={{ width: "100%", py: 0.5, bgcolor: "transparent" }}>
        <ListItem sx={(theme) => notificationCardSx(theme, "success")}>
          <ListItemAvatar sx={{ minWidth: 52 }}>
            <Tooltip title="Recruiter profile" arrow>
              <Avatar
                src={jobFeedBack?.avatar}
                variant="rounded"
                sx={avatarSx}
                alt={jobFeedBack?.name?.split(" ")[0]}
                aria-label="avatar"
              />
            </Tooltip>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Box minWidth={0}>
                  <Typography sx={{ color: "text.primary" }} fontWeight={900} variant="body2" noWrap>
                    {jobFeedBack?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getElapsedTime(jobFeedBack?.createdAt)}
                  </Typography>
                </Box>
                <Tooltip title="Clear feedback" arrow>
                  <IconButton size="small" onClick={handleDeleteReaction} disabled={isFetching} sx={iconButtonSx}>
                    {isFetching ? <CircularProgress size={13} /> : <Close sx={{ width: 13, height: 13 }} />}
                  </IconButton>
                </Tooltip>
              </Stack>
            }
            secondary={
              <Stack spacing={0.75} mt={0.8}>
                <Typography variant="body2" color="text.primary" fontWeight={900}>
                  {jobFeedBack?.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {handleCountryName()} | {jobFeedBack?.state}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                  A recruiter viewed your CV. Review the job performance signal under your statistics workspace.
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={handleNavigateJobStats}
                    endIcon={<ArrowForwardIos sx={{ width: 10, height: 10 }} />}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", fontSize: 11, fontWeight: 900, borderRadius: "8px" }}
                  >
                    View statistics
                  </Button>
                </Box>
              </Stack>
            }
          />
        </ListItem>
      </List>
    );
  }

  export default React.memo(JobFeedBack);
