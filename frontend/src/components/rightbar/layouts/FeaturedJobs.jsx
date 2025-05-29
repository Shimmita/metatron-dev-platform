import { Bolt, OpenInBrowser, Verified } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

function FeaturedJobs({ isLoading, jobTop }) {
  const [openApplyJobModal, setOpenApplyJobModal] = useState();
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  // redux states
    const { user } = useSelector((state) => state.currentUser);

  // extract user email, for checks if job posted by the user or not
  const {email}=user

  // if not true the false is default
  const isMyJob=email===jobTop?.my_email || false

  const handleCountryName = (job) => {
    const parent = job.location.country.split(" ");
    const finalName =
      parent.length > 2 ? `${parent[0]} ${parent[1]}` : parent[0];

    return finalName;
  };

  // handle opening of apply job modal
  const handleOpeningApplyJob = () => {
    setOpenApplyJobModal(true);
  };

  // check if the job is already applied by the



  return (
    <React.Fragment>
      {isLoadingRequest || isLoading ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <IconButton>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width={"70%"} animation="wave" />}
              secondary={<Skeleton width={"50%"} animation="wave" />}
            />

            <Box ml={3}>
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: "20px" }}
                width={35}
                height={15}
              />
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={getImageMatch(jobTop.logo)}
                sx={{
                  backgroundColor: "#1976D2",
                }}
                alt={jobTop?.title[0]}
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography fontWeight={"bold"} variant="body2">
                  {jobTop?.title}
                </Typography>
              }
              secondary={
                <Box>
                  {/* poster */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {jobTop?.organisation?.name}
                  </Typography>

                  {/* location, state, access */}
                  <Box display={"flex"} alignItems={"center"}>
                    {/* country */}
                    <Typography variant="caption" color={"text.secondary"}>
                      {handleCountryName(jobTop && jobTop)}
                    </Typography>
                    {/* divider */}
                    <Divider
                      component={"li"}
                      orientation="vertical"
                      variant="middle"
                      className="p-1"
                    />
                    {/* state */}
                    <Typography
                      ml={1}
                      variant="caption"
                      color={"text.secondary"}
                    >
                      {jobTop?.location?.state}
                    </Typography>
                  </Box>

                  {/* job skills */}
                  <Box display={"flex"} mt={"2px"}>
                    <AvatarGroup max={jobTop?.skills?.length}>
                      {/* loop through the skills and their images matched using custom fn */}
                      {jobTop?.skills?.map((skill) => (
                        <Tooltip title={skill} key={skill} arrow>
                          <Avatar
                            alt={skill}
                            className="border"
                            sx={{ width: 27, height: 27 }}
                            src={getImageMatch(skill)}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>
                </Box>
              }
            />

            <Stack gap={1} alignItems={"center"} justifyContent={"flex-end"}>
              {/* applicants counter */}
              <Box>
                <Typography variant="caption" color={"text.secondary"} fontWeight={'bold'}>
                   {!(jobTop?.website==="") ? "(N/A)" :`${jobTop?.applicants?.total}/200 `}
                </Typography>
              </Box>

              {isMyJob ? (
                 <Box display={'flex'} justifyContent={'center'}>
                  <Typography textAlign={'center'} variant="caption" sx={{ color:'text.secondary' }}>Yours</Typography>
                </Box>
              ):(
                <React.Fragment>
                  {/* button apply */}
              <Button
                disableElevation
                size="small"
                onClick={handleOpeningApplyJob}
                variant="contained"
                startIcon={!(jobTop?.website==="") ? <OpenInBrowser /> :<Verified />}
                disabled={jobTop?.currentUserApplied}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontSize:!CustomDeviceIsSmall() && 'x-small'
                }}
              >
                {jobTop?.currentUserApplied ? "Applied":"Apply"}
              </Button>
                </React.Fragment>
              )}
            </Stack>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}
      {/* show modal apply jobs */}
      <ApplyJobModal
        title={jobTop?.title}
        organisation={jobTop?.organisation}
        requirements={jobTop?.requirements}
        websiteLink={jobTop?.website}
        openApplyJobModal={openApplyJobModal}
        setOpenApplyJobModal={setOpenApplyJobModal}
        jobID={jobTop?._id}
        jobaccesstype={jobTop?.jobtypeaccess}
        salary={jobTop?.salary}
        skills={jobTop?.skills}
        location={jobTop?.location}
      />{" "}
    </React.Fragment>
  );
}

export default React.memo(FeaturedJobs);
