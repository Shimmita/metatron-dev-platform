import { LockRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CardActionArea,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import { resolveVisualAsset } from "../../utilities/resolveVisualAsset";

function PopularCouses({ courseTop }) {
  // redux states
  const { isLoadingPostLaunch: isLoadingRequest } = useSelector(
    (state) => state.appUI
  );
  const { isGuest } = useSelector((state) => state.currentUser);

  return (
    <React.Fragment>
      {isLoadingRequest ? (
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(214,178,94,0.06)",
              borderColor: "rgba(214,178,94,0.3)",
            },
          }}>
            <ListItemAvatar>
              <Skeleton
                animation="wave"
                variant="circular"
                sx={{
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
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
                sx={{
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }} width={35}
                height={15}
              />
            </Box>
          </ListItem>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
        </List>
      ) : (
        <List sx={{ width: "100%", background: "transparent" }}>
          <ListItem sx={{
            borderRadius: "12px",
            mb: 0.8,
            px: 1.2,
            py: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",

            "&:hover": {
              background: "rgba(214,178,94,0.06)",
              borderColor: "rgba(214,178,94,0.3)",
            },
          }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={resolveVisualAsset(courseTop?.course_logo?.logoLink, courseTop?.course_video_topics?.[0])}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  maxWidth: 36,
                  maxHeight: 36,
                }}
                alt={courseTop?.course_title?.[0] || "C"}
                aria-label="avatar"
              />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography
                fontSize={13}
                fontWeight={600}
                color="#FFFDF7"
              >
                {courseTop?.course_title || "Course"}
              </Typography>}
              secondary={
                <Typography variant="body2" sx={{ color: "rgba(255,253,247,0.65)", fontSize: 12 }}>
                  {courseTop?.course_category?.main || "Practical track"}
                </Typography>
              }
            />

            <Box ml={3}>
              <Button
                disableElevation
                size="small"
                startIcon={isGuest ? <LockRounded /> : undefined}
                sx={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.4,
                  fontSize: "0.7rem",

                  "&:hover": {
                    background: "linear-gradient(135deg,#8B6F2A,#FFF2C2)",
                  },
                }}
              >
                {isGuest ? "Login" : "Enroll"}
              </Button>
            </Box>
          </ListItem>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
        </List>
      )}
    </React.Fragment>
  );
}

export default React.memo(PopularCouses);
