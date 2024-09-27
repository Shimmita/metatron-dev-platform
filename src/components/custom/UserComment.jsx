import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Badge, Checkbox, Divider, Stack, Tooltip } from "@mui/material";
import {
  ThumbDownAltOutlined,
  ThumbDownAltRounded,
  ThumbUpAltOutlined,
  ThumbUpAltRounded,
} from "@mui/icons-material";

export default function UserComment({ image, handleComment }) {
  return (
    <List className="w-100" sx={{ bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={image} sx={{ width: 30, height: 30 }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <small style={{ fontSize: "small", color: "steelblue" }}>
              @Michael
            </small>
          }
          secondary={
            <>
              <small style={{ fontSize: "small" }}>
                I'll be in your neighborhood doing errands see this now see it…
              </small>
              <Stack
                direction={"row"}
                display={"flex"}
                justifyContent={"flex-start"}
                alignContent={"center"}
                gap={2}
              >
                {/* like */}
                <Tooltip title="like">
                  <Checkbox
                    icon={
                      <Badge badgeContent={3}>
                        <ThumbUpAltOutlined
                          className="me-2"
                          sx={{ width: 16, height: 16 }}
                        />
                      </Badge>
                    }
                    checkedIcon={
                      <Badge badgeContent={3}>
                        <ThumbUpAltRounded
                          className="me-2"
                          sx={{ width: 16, height: 16 }}
                        />
                      </Badge>
                    }
                  />
                </Tooltip>
                
                {/* unlike */}
                <Tooltip title="like">
                  <Checkbox
                    icon={
                      <Badge badgeContent={3}>
                        <ThumbDownAltOutlined
                          className="me-2"
                          sx={{ width: 16, height: 16 }}
                        />
                      </Badge>
                    }
                    checkedIcon={
                      <Badge badgeContent={3}>
                        <ThumbDownAltRounded
                          className="me-2"
                          sx={{ width: 16, height: 16 }}
                        />
                      </Badge>
                    }
                  />
                </Tooltip>
              </Stack>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
