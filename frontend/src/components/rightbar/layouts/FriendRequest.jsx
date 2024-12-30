import { Box, Button, CardActionArea, Divider, IconButton, Skeleton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import devImage from "../../../images/dev.jpeg";

export default function PeopleBluePrint() {
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
              <IconButton>
                <Avatar
                  src={devImage}
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    maxWidth: 36,
                    maxHeight: 36,
                  }}
                  alt="S"
                  aria-label="avatar"
                />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Albert Einstein</Typography>}
              secondary={
                <Typography variant="body2" color={"text.secondary"}>
                  Software Dev
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
                Connect
              </Button>
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      )}
    </React.Fragment>
  );
}
