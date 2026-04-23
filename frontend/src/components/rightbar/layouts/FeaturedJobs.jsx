import { LockRounded, TravelExploreRounded, Verified } from "@mui/icons-material";
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

const MAX_APPLICANTS = 500


function FeaturedJobs({ isLoading, jobTop, isLastIndex }) {
  const [openApplyJobModal, setOpenApplyJobModal] = useState();
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  // redux states
  const { user, isGuest } = useSelector((state) => state.currentUser);

  // extract user email, for checks if job posted by the user or not
  const email = isGuest ? "" : user?.email

  // if not true the false is default
  const isMyJob = email === jobTop?.my_email || false

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

  // job has been paused or deactivated by the poster
  const isDeactivated = jobTop?.status === "inactive"
  // check if job reached maxima number of applicants
  const isMaxApplicants =
    jobTop?.applicants?.total === MAX_APPLICANTS ||
    jobTop?.applicants?.total === jobTop?.applicants_max

  return (
    <React.Fragment>
      {isLoadingRequest || isLoading ? (
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(20,210,190,0.06)",
              borderColor: "rgba(20,210,190,0.3)",
            },
          }}>
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
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
        </List>
      ) : (
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(20,210,190,0.06)",
              borderColor: "rgba(20,210,190,0.3)",
            },
          }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={getImageMatch(jobTop.logo)}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                alt={jobTop?.title[0]}
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color="#F0F4FA"
                >
                  {jobTop?.title}
                </Typography>
              }
              secondary={
                <Box>
                  {/* poster */}
                  <Typography variant="body2" sx={{ color: "rgba(240,244,250,0.65)" }}>
                    {jobTop?.organisation?.name}
                  </Typography>

                  {/* location, state, access */}
                  <Box display={"flex"} alignItems={"center"}>
                    {/* state */}
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(240,244,250,0.65)" }}
                    >
                      {jobTop?.location?.state}
                    </Typography>

                    {/* divider */}
                   <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    {/* country */}
                    <Typography ml={1} variant="caption" sx={{ color: "rgba(240,244,250,0.65)" }}>
                      {handleCountryName(jobTop && jobTop)}
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
                            sx={{
                              width: 26,
                              height: 26,
                              border: "1px solid rgba(255,255,255,0.1)",
                              background: "rgba(255,255,255,0.05)",
                            }}
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
                <Typography variant="caption" sx={{
                  color: "rgba(240,244,250,0.6)",
                  fontSize: 11,
                }}>
                  {!(jobTop?.website === "") ? "website" : `${jobTop?.applicants?.total}/${jobTop?.applicants_max || MAX_APPLICANTS} `}
                </Typography>
              </Box>

              <React.Fragment>
                {/* button apply */}
                <Button
                  disableElevation
                  size="small"
                  onClick={handleOpeningApplyJob}
                  startIcon={isDeactivated || isGuest || isMaxApplicants ? <LockRounded /> : !(jobTop?.website === "") ? <TravelExploreRounded /> : <Verified />}
                  disabled={jobTop?.currentUserApplied || isDeactivated || isMaxApplicants || isGuest}
                  sx={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    color: "#fff",
                    px: 1.5,
                    py: 0.4,
                    fontSize: "0.7rem",

                    "&:hover": {
                      background: "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
                    },

                    "&:disabled": {
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                    }
                  }}
                >
                  {jobTop?.currentUserApplied ? "Applied" : isDeactivated ? "Paused" : isMaxApplicants ? "Closed" : "Apply"}
                </Button>
              </React.Fragment>

            </Stack>
          </ListItem>

          {/* show divider only if the job is not the last index */}
          {!isLastIndex && <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />}
        </List>
      )}
      {/* show modal apply jobs */}
      {openApplyJobModal &&
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
          isMyJob={isMyJob}
          whitelist={jobTop?.whitelist}
        />}
    </React.Fragment>
  );
}

export default React.memo(FeaturedJobs);
