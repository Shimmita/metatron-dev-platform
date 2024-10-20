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
import React, { useEffect, useState } from "react";
import React_Logo from "../../../images/react.png";

export default function FeaturedJobs() {
  // simulate loading of the request
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem>
        <ListItemAvatar>
          <IconButton>
            {isLoadingRequest ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : (
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
            )}
          </IconButton>
        </ListItemAvatar>
        <ListItemText
          primary={
            isLoadingRequest ? (
              <Skeleton width={"70%"} animation="wave" />
            ) : (
              <Typography variant="body2">React Intern</Typography>
            )
          }
          secondary={
            isLoadingRequest ? (
              <Skeleton width={"50%"} animation="wave" />
            ) : (
              <Typography variant="body2" color={"text.secondary"}>
                Elusium Inc.
              </Typography>
            )
          }
        />

        <Box ml={3}>
          {isLoadingRequest ? (
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={35}
              height={15}
            />
          ) : (
            <Button
              disableElevation
              size="small"
              variant="contained"
              sx={{ textTransform: "capitalize", borderRadius: "20px" }}
            >
              Apply
            </Button>
          )}
        </Box>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
