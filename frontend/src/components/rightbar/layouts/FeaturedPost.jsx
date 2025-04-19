import {
  BarChartRounded,
  FavoriteRounded,
  Flag,
  ForumRounded,
  GitHub,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CardActionArea,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import DevLogo from "../../../images/dev.jpeg";
import CustomCountryName from "../../utilities/CustomCountryName";

function FeaturedPost({ post }) {
  return (
    <CardActionArea>
      <List sx={{ width: "100%", minWidth: 200, bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              variant="rounded"
              src={DevLogo}
              sx={{
                backgroundColor: "#1976D2",
                width: 40,
                height: 40,
              }}
              alt="S"
              aria-label="avatar"
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{ color: "text.primary" }}
                fontWeight={"bold"}
                gutterBottom
                variant="body2"
                textTransform={"uppercase"}
              >
                {post?.post_owner?.ownername}
              </Typography>
            }
            secondary={
              <React.Fragment>
                <Typography
                  gutterBottom
                  variant="body2"
                  color={"text.secondary"}
                >
                  {post?.post_owner?.ownertitle}
                </Typography>

                <Typography variant="body2" color={"text.secondary"}>
                  {CustomCountryName(post?.post_location?.country)} |{" "}
                  {post?.post_location?.state}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>

        <Stack gap={1} width={"100%"}>
          <Typography
            textAlign={"end"}
            variant="body2"
            color={"text.secondary"}
            pr={2}
          >
            {post?.post_title}
          </Typography>

          {/* post counters */}
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={1}
            pr={1}
          >
            {/* stats svg */}
            <Box>
              <BarChartRounded sx={{ width: 16, height: 16 }} />
            </Box>
            <Box
              sx={{
                pe: 1,
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.secondary",
                "& svg": {
                  m: 1,
                },
              }}
            >
              {/* likes count */}
              <FavoriteRounded sx={{ width: 14, height: 14 }} />
              <Typography variant="caption">
                {post?.post_liked?.clicks}{" "}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* github counts */}
              <GitHub sx={{ width: 14, height: 14 }} />
              <Typography variant="caption">
                {" "}
                {post?.post_github?.clicks}{" "}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* comments count */}
              <ForumRounded sx={{ width: 14, height: 14 }} />
              <Typography variant="caption" className="pe-1">
                {post?.post_comments?.count}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* flags or number reports */}
              <Flag sx={{ width: 14, height: 14 }} />
              <Typography variant="caption" className="pe-1">
                {post?.report_count}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </List>
      <Divider variant="fullWidth" component="div" className="pt-2" />
    </CardActionArea>
  );
}

export default React.memo(FeaturedPost);
