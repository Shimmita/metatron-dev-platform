import {
  FavoriteRounded,
  ForumRounded,
  GitHub,
  LocationOnRounded,
  MoreVertRounded,
  PersonAddRounded,
  StarsRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import PostData from "../data/PostData";
import CustomDeviceScreenSize from "../utilities/CustomDeviceScreenSize";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CardFeedMore from "./CardFeedMore";

const CardFeed = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMoreVertPost = Boolean(anchorEl);
  const navigate = useNavigate();

  const [isFriend, setIsFriend] = useState(true);

  // show reply in the post details page
  const handleReplyPost = () => {
    navigate("posts/details");
  };

  const handleClickMoreVertPost = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // fun to handle the showing of dotted lines for 280 above characters
  const handleDetailsLength = () => {
    const details = PostData && PostData.details;
    // wider screens more content
    if (CustomDeviceTablet() || window.screen.width > 1000)
      return details.length > 250
        ? details.substring(0, 250) + " ..."
        : details;
    // smaller screens less content
    return details.length > 150 ? details.substring(0, 150) + " ..." : details;
  };

  // navigate to the post details page
  const handlePostDetails = () => {
    navigate("posts/details");
  };

  // display the user profile information
  const handleShowUserProfile = () => {
    navigate("users/profile");
  };

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  // screen width of the device
  const screenWidth = window.screen.availWidth;

  // simulate loading of requests
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingRequest(false);
    }, 5000);
  }, []);

  return (
    <>
      {/* show divider in dark mode */}
      {isDarkMode && <Divider component={"div"} className="mb-3" />}

      <Card
        style={{
          backgroundColor: openMoreVertPost && isDarkMode && "#333",
          opacity: openMoreVertPost && !isDarkMode && "0.8",
          border: openMoreVertPost && `1px solid grey`,
        }}
        elevation={0}
        className="w-100 shadow mb-4 p-2 rounded"
      >
        <CardHeader
          sx={{
            padding: "0px",
            margin: "0px",
          }}
          avatar={
            <Tooltip title="profile" arrow>
              <IconButton onClick={handleShowUserProfile}>
                {isLoadingRequest ? (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Avatar
                    src={devImage}
                    sx={{ backgroundColor: "#1976D2", color: "white" }}
                    alt="S"
                    aria-label="avatar"
                  />
                )}
              </IconButton>
            </Tooltip>
          }
          action={
            isLoadingRequest ? null : (
              <Box className="d-flex flex-row ">
                <IconButton disableRipple>
                  <Typography variant="body2">
                    <small>2d</small>
                  </Typography>
                </IconButton>

                {/* displayed if user is friend */}
                {isFriend && (
                  <Tooltip title="follow" arrow>
                    <Checkbox
                      onChange={() => setIsFriend(false)}
                      icon={<PersonAddRounded sx={{ width: 20, height: 20 }} />}
                    />
                  </Tooltip>
                )}

                <Tooltip title="more" arrow>
                  <IconButton
                    aria-label="more"
                    id="more-button"
                    aria-controls={openMoreVertPost ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMoreVertPost ? "true" : undefined}
                    onClick={handleClickMoreVertPost}
                  >
                    <MoreVertRounded sx={{ width: 22, height: 22 }} />
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
            )
          }
          title={
            isLoadingRequest ? (
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Typography fontWeight={"bold"} variant="subtitle1">
                  <Tooltip title="Shimmita Douglas" arrow>
                    Shimmita
                  </Tooltip>
                </Typography>
                <VerifiedRounded
                  color="primary"
                  sx={{ width: 20, height: 20 }}
                />
              </Box>
            )
          }
          subheader={
            isLoadingRequest ? (
              <Skeleton animation="wave" height={10} width="40%" />
            ) : (
              <Box>
                {/* smallest screen */}
                {screenWidth <= 350 ? (
                  <>
                    <Typography variant="body2">Software Dev </Typography>
                    <Typography variant="body2">
                      React|Nodejs|Python{" "}
                    </Typography>
                  </>
                ) : (
                  <>
                    {/* mediaum to larger screens */}
                    <Typography variant="body2">
                      Fullstack Developer{" "}
                    </Typography>
                    <Typography variant="body2">
                      React | Nodejs | Python{" "}
                    </Typography>
                  </>
                )}
              </Box>
            )
          }
        />

        {isLoadingRequest ? (
          <Skeleton
            sx={{ height: 350, borderRadius: "10px" }}
            animation="wave"
            variant="rectangular"
          />
        ) : (
          <>
            <CardContent>
              {isDarkMode ? (
                <Typography
                  variant="body2"
                  gutterBottom
                  className="text-center w-100 pb-2"
                >
                  <span className="d-flex justify-content-center align-items-center align-content-center gap-2">
                    <span>{PostData.category}</span>
                    <LocationOnRounded
                      color="primary"
                      sx={{ width: 18, height: 18 }}
                    />

                    <span>{PostData.county}</span>
                  </span>
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  gutterBottom
                  className="text-center w-100 pb-2 fw-medium"
                >
                  <Divider>
                    <span className="d-flex justify-content-center align-items-center align-content-center gap-2">
                      <StarsRounded
                        color="primary"
                        sx={{ width: 18, height: 18 }}
                      />
                      <span>{PostData.category}</span>
                      <LocationOnRounded
                        color="primary"
                        sx={{ width: 18, height: 18 }}
                      />
                      <span>{PostData.county}</span>
                    </span>
                  </Divider>
                </Typography>
              )}
              <CardActionArea onClick={handlePostDetails}>
                <Typography variant="body2">{handleDetailsLength()}</Typography>
              </CardActionArea>
            </CardContent>

            {/* media */}
            <Image
              src={PostData.image}
              alt={"image"}
              style={{
                width: "100%",
                maxHeight: CustomDeviceScreenSize(),
                objectFit: "fill",
                padding: window.screen.availWidth > 1300 && "5px",
                borderRadius: "10px",
                filter: openMoreVertPost && "grayscale(100%)",
              }}
            />
          </>
        )}

        {isLoadingRequest ? (
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
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
                      color="inherit"
                      sx={{ width: 23, height: 23 }}
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
              <Tooltip arrow title="Github">
                <Checkbox
                  icon={<GitHub sx={{ width: 21, height: 21 }} />}
                  checkedIcon={<GitHub sx={{ width: 21, height: 21 }} />}
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
                  onChange={handleReplyPost}
                  icon={<ForumRounded sx={{ width: 21, height: 21 }} />}
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
        )}
      </Card>
    </>
  );
};

export default CardFeed;
