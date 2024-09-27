import {
  Add,
  AddCommentRounded,
  FavoriteRounded,
  LeaderboardRounded,
  MenuRounded,
  PersonAddOutlined,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";

import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import devImage from "../../images/dev.jpeg";
import PostData from "../data/PostData";
import CustomDeviceScreenSize from "../utilities/CustomDeviceScreenSize";

const AccordionComment = lazy(() => import("../custom/AccordionComment"));
const CardFeedMore = lazy(() => import("../custom/CardFeedMore"));

const PostCardDetails = () => {
  const [showComment, setShowComment] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMoreVertPost = Boolean(anchorEl);

  const handleShowReply = () => {
    setShowComment((prev) => !prev);
  };

  const handleClickMoreVertPost = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  return (
    <Box>
      <Card
        elevation={0}
        className="w-100 p-2"
        sx={{
          opacity: openMoreVertPost && !isDarkMode && "0.8",
        }}
      >
        <CardHeader
          sx={{
            padding: "0px",
            margin: "0px",
          }}
          avatar={
            <Tooltip title="profile" arrow>
              {devImage ? (
                <Avatar
                  src={devImage}
                  sx={{ width: 40, height: 40 }}
                  alt="image"
                  aria-label="avatar"
                />
              ) : (
                <Avatar aria-label="avatar">S</Avatar>
              )}
            </Tooltip>
          }
          action={
            <Box className="d-flex flex-row ">
              <IconButton disableRipple>
                <Typography variant="body2">
                  <small>2d</small>
                </Typography>
              </IconButton>

              <Tooltip title="follow" arrow>
                <Checkbox
                  icon={<PersonAddOutlined sx={{ width: 20, height: 20 }} />}
                  checkedIcon={
                    <Typography variant="body2">
                      <small
                        style={{ fontSize: "x-small", fontWeight: "bold" }}
                      >
                        following
                      </small>
                    </Typography>
                  }
                />
              </Tooltip>

              <Tooltip title="more" arrow>
                <IconButton
                  aria-label="more"
                  id="more-button"
                  aria-controls={openMoreVertPost ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMoreVertPost ? "true" : undefined}
                  onClick={handleClickMoreVertPost}
                >
                  <MenuRounded sx={{ width: 22, height: 22 }} />
                </IconButton>
              </Tooltip>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMoreVertPost}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "more-button",
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <CardFeedMore />
              </Menu>
            </Box>
          }
          title={
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Typography fontWeight={"bold"} variant="body1">
                Shimmita
              </Typography>
              <VerifiedRounded color="primary" sx={{ width: 20, height: 20 }} />
            </Box>
          }
          subheader="@devshim"
        />

        {/* description */}
        {!showComment && (
          <CardContent>
            {isDarkMode ? (
              <Typography
                variant="body2"
                gutterBottom
                className="text-center w-100 pb-2"
              >
                <span className="d-flex justify-content-center align-items-center align-content-center gap-1">
                  <span>{PostData.category}</span>
                  <Add
                    color="primary"
                    sx={{ width: 17, height: 17, rotate: "270deg" }}
                  />
                  <span>{PostData.county}</span>
                </span>
              </Typography>
            ) : (
              <Typography
                variant="body2"
                gutterBottom
                className="text-center w-100 pb-2"
              >
                <Divider>
                  <span className="d-flex justify-content-center align-items-center align-content-center gap-1">
                    <span>{PostData.category}</span>
                    <Add
                      color="primary"
                      sx={{ width: 17, height: 17, rotate: "270deg" }}
                    />
                    <span>{PostData.county}</span>
                  </span>
                </Divider>
              </Typography>
            )}
            <Typography variant="body2">
              {PostData && PostData.details}
            </Typography>
          </CardContent>
        )}

        {/* media */}
        <Image
          src={PostData.image}
          alt={"image"}
          style={{
            width: "100%",
            maxHeight: CustomDeviceScreenSize(),
            objectFit: "fill",
            borderRadius: "10px",
            filter: openMoreVertPost && "grayscale(100%)",
          }}
        />

        {/* show divider actions light mode */}
        {!isDarkMode && <Divider component={"div"} className="p-2" />}
        <Box
          display={"flex "}
          p={1}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Tooltip title="like" arrow>
              <Checkbox
                icon={<FavoriteRounded sx={{ width: 23, height: 23 }} />}
                checkedIcon={
                  <FavoriteRounded
                    sx={{ width: 23, height: 23, color: "#CF4B3F" }}
                  />
                }
              />
            </Tooltip>
            <span>
              <Typography
                fontWeight={"bold"}
                variant="body2"
                color={"text.secondary"}
              >
                500k
              </Typography>
            </span>
          </Box>

          <Box display={"flex"} alignItems={"center"}>
            <Tooltip arrow title="repost">
              <Checkbox
                icon={<LeaderboardRounded sx={{ width: 21, height: 21 }} />}
                checkedIcon={
                  <LeaderboardRounded sx={{ width: 21, height: 21 }} />
                }
              />
            </Tooltip>
            <span>
              <Typography
                fontWeight={"bold"}
                variant="body2"
                color={"text.secondary"}
              >
                50k
              </Typography>
            </span>
          </Box>

          <Box display={"flex"} alignItems={"center"} className="ps-3">
            <Tooltip title={"comment"} arrow>
              <Checkbox
                onChange={handleShowReply}
                icon={<AddCommentRounded sx={{ width: 21, height: 21 }} />}
              />
            </Tooltip>
            <span>
              <Typography
                variant="body2"
                fontWeight={"bold"}
                color={"text.secondary"}
              >
                300
              </Typography>
            </span>
          </Box>
        </Box>
        {/* show reply here when comment clicked */}
        {showComment && <AccordionComment />}
      </Card>
    </Box>
  );
};

export default PostCardDetails;
