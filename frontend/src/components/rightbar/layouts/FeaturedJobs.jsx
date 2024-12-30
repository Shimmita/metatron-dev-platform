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
import React_Logo from "../../../images/react.png";

export default function FeaturedJobs() {
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  return (
    <React.Fragment>
      {isLoadingRequest ? (
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
                src={React_Logo}
                sx={{
                  backgroundColor: "#1976D2",
                  maxWidth: 36,
                  maxHeight: 36,
                }}
                alt="S"
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">React Intern</Typography>}
              secondary={
                <Typography variant="body2" color={"text.secondary"}>
                  Elusium | Germany
                </Typography>
              }
            />

            <Box ml={3}>
              <Button
                disableElevation
                size="small"
                variant="contained"
                sx={{ textTransform: "capitalize", borderRadius: "20px" }}
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
