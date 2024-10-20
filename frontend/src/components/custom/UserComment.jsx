import {
  FavoriteRounded,
  StarRounded,
  ThumbDownAltRounded,
} from "@mui/icons-material";
import { Box, Checkbox, Divider, Tooltip, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React, { useState } from "react";

export default function UserComment({ image }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisLiked] = useState(false);

  // handle user liked a comment
  const handleLiked = () => {
    setLiked((prev) => !prev);
  };

  // handle user disliked
  const handleDisliked = () => {
    setDisLiked((prev) => !prev);
  };
  return (
    <List className="w-100" sx={{ bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={image} sx={{ width: 30, height: 30 }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                variant={"body2"}
                fontWeight={"bold"}
                color={"primary"}
              >
                Michael Sharazi
              </Typography>

              <Typography
                variant={"caption"}
                fontWeight={"bold"}
                color={"primary"}
              >
                1d ago
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Box display={"flex"} mb={1} alignItems={"center"}>
                <StarRounded sx={{ width: 15, height: 15 }} />
                <Typography
                  fontWeight={"bold"}
                  variant={"body2"}
                  color={"text.secondary"}
                >
                  Software Engineer
                </Typography>
              </Box>

              <Box>
                <Typography variant={"body2"} color={"text.secondary"}>
                  I'll be in your neighborhood doing errands see this now see
                  it…
                </Typography>
              </Box>

              <Box mt={1} display={"flex"} justifyContent={"flex-end"}>
                <Box display={"flex"} gap={1}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Tooltip arrow title={"like"}>
                      <Checkbox
                        onChange={handleLiked}
                        checked={liked}
                        disabled={disliked}
                        icon={
                          <FavoriteRounded sx={{ width: 17, height: 17 }} />
                        }
                        checkedIcon={
                          <FavoriteRounded sx={{ width: 17, height: 17 }} />
                        }
                      />
                    </Tooltip>

                    <span>
                      <Typography
                        variant="body2"
                        fontWeight={"bold"}
                        color={"text.secondary"}
                      >
                        100
                      </Typography>
                    </span>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Tooltip arrow title={"dislike"}>
                      <Checkbox
                        checked={disliked}
                        disabled={liked}
                        onChange={handleDisliked}
                        icon={
                          <ThumbDownAltRounded sx={{ width: 17, height: 17 }} />
                        }
                        checkedIcon={
                          <ThumbDownAltRounded sx={{ width: 17, height: 17 }} />
                        }
                      />
                    </Tooltip>

                    <span>
                      <Typography
                        variant="body2"
                        fontWeight={"bold"}
                        color={"text.secondary"}
                      >
                        10
                      </Typography>
                    </span>
                  </Box>
                </Box>
              </Box>
            </Box>
          }
        />
      </ListItem>
    </List>
  );
}
