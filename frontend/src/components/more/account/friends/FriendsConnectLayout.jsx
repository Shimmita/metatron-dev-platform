import { LocationOnRounded, StarRounded } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import devImage from "../../../../images/dev.jpeg";
import CustomDeviceIsSmall from "../../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../../utilities/CustomDeviceSmallest";

export default function FriendsConnectLayout() {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        gap={CustomDeviceSmallest() ? 0 : CustomDeviceIsSmall() ? 1 : 18}
        alignItems={"center"}
      >
        <Box>
          <ListItem>
            <ListItemAvatar>
              <IconButton>
                <Avatar alt="user image" src={devImage} />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2">Albert Einstein</Typography>}
              secondary={
                <Box>
                  <Typography variant="body2">
                    {" "}
                    <span>
                      <StarRounded sx={{ width: 17, height: 17 }} />
                    </span>{" "}
                    Software Engineer
                  </Typography>{" "}
                  <Typography variant="body2">
                    {" "}
                    <span>
                      <LocationOnRounded sx={{ width: 15, height: 15 }} />
                    </span>{" "}
                    Nairobi County
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        </Box>

        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button
            disableElevation
            sx={{
              borderRadius: "10px",
              textTransform: "capitalize",
              fontSize: "small",
            }}
            color="primary"
          >
            connect
          </Button>
        </Box>
      </Box>

      <Divider variant="inset" component="li" />
    </List>
  );
}
