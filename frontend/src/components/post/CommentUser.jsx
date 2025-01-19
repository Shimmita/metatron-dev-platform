import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import devImage from "../../images/dev.jpeg";
import { getElapsedTime } from "../utilities/getElapsedTime";

export default function CommentUser({ comment: commentor }) {
  return (
    <List className="w-100" sx={{ bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={devImage}
            sx={{ width: 30, height: 30 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant={"body2"} fontWeight={"bold"}>
                {commentor?.name}
              </Typography>

              <Typography variant={"caption"}>
                {getElapsedTime(commentor?.createdAt)}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Box>
                <Typography
                  variant={"caption"}
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  display={"flex"}
                  alignItems={"center"}
                >
                  {commentor?.title} | {commentor?.country}
                </Typography>
              </Box>

              <Box>
                <Typography variant={"body2"} color={"text.secondary"}>
                  {commentor?.minimessage}
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItem>
    </List>
  );
}
