import {
  FavoriteBorderOutlined,
  FavoriteRounded,
  LocationOnRounded,
  StarsRounded,
} from "@mui/icons-material";
import { Box, CardActionArea, Checkbox, Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import devImage from "../../images/dev.jpeg";

export default function TopDailyPosts() {
  const screenWidth = window.screen.availWidth;

  // get the rightbar expanded appropritately
  const rightBarExpaned = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
    return;
  };
  return (
    <List
      className="rounded"
      sx={{
        bgcolor: "background.paper",
        width: rightBarExpaned(),
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CardActionArea>
          {/* details */}
          <Box>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="image" src={devImage} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2">James Wekesa </Typography>
                    <Typography
                      variant="body2"
                      color={"text.secondary"}
                      display={"flex"}
                      gutterBottom
                      alignItems={"center"}
                      gap={1}
                    >
                      <StarsRounded
                        color="primary"
                        sx={{ width: 18, height: 18 }}
                      />
                      <span>Machine Learning </span>{" "}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <LocationOnRounded
                      color="primary"
                      sx={{ width: 20, height: 20 }}
                    />
                    <span>Kakamega</span>
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        </CardActionArea>

        {/* like button */}
        <Box display={"flex"} alignItems={"center"}>
          <Tooltip title="like" arrow>
            <Checkbox
              icon={<FavoriteBorderOutlined sx={{ width: 22, height: 22 }} />}
              checkedIcon={
                <FavoriteRounded
                  color="inherit"
                  sx={{ width: 22, height: 22 }}
                />
              }
            />
          </Tooltip>
        </Box>
      </Box>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CardActionArea>
          {/* details */}
          <Box>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="image" src={devImage} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2">Rehema Kabwana </Typography>
                    <Typography
                      variant="body2"
                      color={"text.secondary"}
                      display={"flex"}
                      gutterBottom
                      alignItems={"center"}
                      gap={1}
                    >
                      <StarsRounded
                        color="primary"
                        sx={{ width: 18, height: 18 }}
                      />
                      <span>UI/UX Design </span>{" "}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <LocationOnRounded
                      color="primary"
                      sx={{ width: 20, height: 20 }}
                    />
                    <span>Mombasa</span>
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        </CardActionArea>

        {/* like button */}
        <Box display={"flex"} alignItems={"center"}>
          <Tooltip title="like" arrow>
            <Checkbox
              icon={<FavoriteBorderOutlined sx={{ width: 22, height: 22 }} />}
              checkedIcon={
                <FavoriteRounded
                  color="inherit"
                  sx={{ width: 22, height: 22 }}
                />
              }
            />
          </Tooltip>
        </Box>
      </Box>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CardActionArea>
          {/* details */}
          <Box>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="image" src={devImage} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2">Michael Ochieng </Typography>
                    <Typography
                      variant="body2"
                      color={"text.secondary"}
                      display={"flex"}
                      gutterBottom
                      alignItems={"center"}
                      gap={1}
                    >
                      <StarsRounded
                        color="primary"
                        sx={{ width: 18, height: 18 }}
                      />
                      <span>CyberSecurity </span>{" "}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <LocationOnRounded
                      color="primary"
                      sx={{ width: 20, height: 20 }}
                    />
                    <span>Nairobi</span>
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        </CardActionArea>

        {/* like button */}
        <Box display={"flex"} alignItems={"center"}>
          <Tooltip title="like" arrow>
            <Checkbox
              icon={<FavoriteBorderOutlined sx={{ width: 22, height: 22 }} />}
              checkedIcon={
                <FavoriteRounded
                  color="inherit"
                  sx={{ width: 22, height: 22 }}
                />
              }
            />
          </Tooltip>
        </Box>
      </Box>
    </List>
  );
}
