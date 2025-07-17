import { ArrowForwardIos, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
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
  
  function JobFeedBack({
    jobFeedBack,
  }) {
  

  const [isFetching, setIsFetching] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()

  // redux UI state
   const { isSidebarRighbar } = useSelector((state) => state.appUI);
  

    const handleCountryName = () => {
      const parent = jobFeedBack?.country.split(" ");
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
       
      <List
        sx={{ 
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width: "100%",
        bgcolor: "background.paper",
        p:1,
        }}>
        <ListItem className="rounded" 
        sx={{ 
        border: "1px solid",
        borderColor: "divider" }}>
          <ListItemAvatar >
            <Avatar
            src={jobFeedBack?.avatar}
            variant="rounded"
            sx={{
              backgroundColor: "#1976D2",
              color: "white",
              width: 40,
              height: 40,
            }}
            alt={jobFeedBack?.name?.split(" ")[0]}
            aria-label="avatar"
          />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}>
              <Typography
                sx={{ color: "text.primary" }}
                fontWeight={"bold"}
                variant="body2"
              >
                {jobFeedBack?.name}
              </Typography>
  
              <Box display={"flex"} gap={"3px"} alignItems={"center"}>
              {/* time elapsed since post created */}
              <Typography variant="caption">
                {getElapsedTime(jobFeedBack?.createdAt)}
              </Typography>
              &nbsp;
              {/* delete reaction */}
                <Tooltip title={'clear'} arrow>
                <IconButton size="small" 
                onClick={handleDeleteReaction} 
                disabled={isFetching}
                sx={{ 
                border: "1px solid",
                borderColor: "divider",
              }}>
                {isFetching ? (
                  <CircularProgress size={13}/>
                ):(
                  <Close sx={{ width: 13, height: 13 }} />
                )}
              </IconButton>
            </Tooltip>    
            </Box>
            </Box>
            }
            secondary={
              <Box>
              
              <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"}>
                  {jobFeedBack?.title}
                </Typography>
                <Typography variant="caption" color={"text.secondary"}>
                  {handleCountryName()} | {jobFeedBack?.state}
                </Typography>
                <br/>
                <Typography
                  variant="caption"
                  sx={{ color:'text.primary' }}
                >
                  - recruiter has viewed your c.v check for job results under my statistics option. <Button onClick={handleNavigateJobStats} endIcon={<ArrowForwardIos sx={{ width:10, height:10 }}/>} size="small" variant="text" sx={{ textTransform:'lowercase', fontSize:'small', borderRadius:5 }}>here</Button>
                </Typography>
              </React.Fragment>
                
              </Box>
            }
          />
  
        </ListItem>
        {/* show divider is is not last item */}
      </List>
       
    );
  }
  
  export default React.memo(JobFeedBack);
  