import {
  Avatar,
  Box,
  Button,
  CardActionArea,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import DevLogo from "../../../images/dev.jpeg";

function FeaturedPost() {
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
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            </ListItemAvatar>
            <CardActionArea>
              <ListItemText
                primary={<Skeleton width={"70%"} animation="wave" />}
                secondary={<Skeleton width={"50%"} animation="wave" />}
              />
            </CardActionArea>

            <Box ml={2}>
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
                src={DevLogo}
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
              primary={
                <Typography variant="body2">Lambart Goodluck</Typography>
              }
              secondary={
                <Typography variant="body2" color={"text.secondary"}>
                  Machine Learning
                </Typography>
              }
            />

            <Box ml={2}>
              <Button
                disableElevation
                size="small"
                variant="contained"
                sx={{ textTransform: "capitalize", borderRadius: "20px" }}
              >
                view
              </Button>
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}
    </React.Fragment>
  );
}

export default React.memo(FeaturedPost);
