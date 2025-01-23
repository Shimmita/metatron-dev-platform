import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import { getImageMatch } from "../../utilities/getImageMatch";

function FeaturedJobs({ isLoading, jobTop }) {
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
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
                src={getImageMatch(jobTop.logo)}
                sx={{
                  backgroundColor: "#1976D2",
                }}
                alt="S"
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography fontWeight={"bold"} variant="body2">
                  {jobTop.title}
                </Typography>
              }
              secondary={
                <Box>
                  {/* poster */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {jobTop?.organisation?.name}
                  </Typography>

                  {/* skills */}
                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    {jobTop?.skills
                      .slice(0, CustomDeviceIsSmall() ? 2 : 3)
                      .map((skill, index) => (
                        <React.Fragment>
                          <Typography
                            key={index}
                            variant="caption"
                            color={"text.secondary"}
                          >
                            {skill}
                          </Typography>
                          {/* show this on small devices for last index */}
                          {index === 1 && CustomDeviceIsSmall() && (
                            <Typography
                              variant="caption"
                              color={"text.secondary"}
                            >
                              +{jobTop?.skills?.length - 2} more
                            </Typography>
                          )}
                          {/* show this for tablet devices at last index */}
                          {index === 2 && CustomDeviceTablet() && (
                            <Typography
                              variant="caption"
                              color={"text.secondary"}
                            >
                              +{jobTop?.skills?.length - 3} more
                            </Typography>
                          )}
                          {/* show this for largest screen */}
                          {index === 2 &&
                            !(
                              CustomDeviceTablet() || CustomDeviceIsSmall()
                            ) && (
                              <Typography
                                variant="caption"
                                color={"text.secondary"}
                              >
                                +{jobTop?.skills?.length - 3}
                              </Typography>
                            )}
                        </React.Fragment>
                      ))}
                  </Box>
                </Box>
              }
            />

            <Box>
              <Button
                disableElevation
                size="small"
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Apply
              </Button>
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}
    </React.Fragment>
  );
}

export default React.memo(FeaturedJobs);
