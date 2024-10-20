import { FavoriteOutlined, FavoriteRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CardActionArea,
  Checkbox,
  Divider,
  Skeleton,
  Typography
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import DevLogo from "../../../images/dev.jpeg";

export default function FeaturedPost() {
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
          {isLoadingRequest ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
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
          )}
        </ListItemAvatar>
        <CardActionArea>
          <ListItemText
            primary={
              isLoadingRequest ? (
                <Skeleton width={"70%"} animation="wave" />
              ) : (
                <Typography variant="body2">Lambart Goodluck</Typography>
              )
            }
            secondary={
              isLoadingRequest ? (
                <Skeleton width={"50%"} animation="wave" />
              ) : (
                <Typography variant="body2" color={"text.secondary"}>
                  Machine Learning
                </Typography>
              )
            }
          />
        </CardActionArea>

        <Box ml={2}>
          {isLoadingRequest ? (
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={35}
              height={15}
            />
          ) : (
            <Checkbox
              icon={<FavoriteOutlined sx={{ width: 24, height: 24 }} />}
              checkedIcon={<FavoriteRounded sx={{ width: 24, height: 24 }} />}
            />
          )}
        </Box>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
