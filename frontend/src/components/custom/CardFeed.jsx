import {
  FavoriteRounded,
  ForumRounded,
  GitHub,
  MoreVertRounded,
  PersonAddRounded,
  VerifiedRounded,
  WbIncandescentRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
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
import CardFeedMore from "./CardFeedMore";

const CardFeed = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const { isDarkMode } = useSelector((state) => state.appUI);
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [isFriend, setIsFriend] = useState(true);

  const details = PostData?.details || "";
  const detailsLong = details.length > 350;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingRequest(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (path) => () => navigate(path);

  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, 350) : details;

  const renderSkeleton = () => (
    <>
      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} width="80%" />
    </>
  );

  return (
    <>
      {isDarkMode && <Divider component="div" className="mb-3" />}
      <Card
        style={{
          backgroundColor: openMenu && isDarkMode ? "#333" : undefined,
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
        }}
        elevation={0}
        className="w-100 shadow mb-4 p-2 rounded"
      >
        <CardHeader
          sx={{ padding: 0, margin: 0 }}
          avatar={
            <Tooltip title="profile" arrow>
              {isLoadingRequest ? (
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              ) : (
                <IconButton onClick={handleNavigate("users/profile")}>
                  <Avatar
                    src={devImage}
                    sx={{ backgroundColor: "#1976D2" }}
                    alt="S"
                  />
                </IconButton>
              )}
            </Tooltip>
          }
          action={
            !isLoadingRequest && (
              <Box className="d-flex flex-row">
                <IconButton disableRipple>
                  <Typography variant="body2">
                    <small>2d</small>
                  </Typography>
                </IconButton>
                {isFriend && (
                  <Tooltip title="connect" arrow>
                    <Checkbox
                      onChange={() => setIsFriend(false)}
                      icon={
                        <PersonAddRounded
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                      }
                    />
                  </Tooltip>
                )}
                <Tooltip title="more" arrow>
                  <IconButton
                    aria-label="more"
                    onClick={handleClickMoreVertPost}
                  >
                    <MoreVertRounded
                      color="primary"
                      sx={{ width: 22, height: 22 }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  MenuListProps={{ "aria-labelledby": "more-button" }}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
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
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Shimmita Douglas" arrow>
                  <Typography fontWeight="bold" variant="body1">
                    Shimmita
                  </Typography>
                </Tooltip>
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
                <Typography variant="body2">
                  {window.screen.availWidth <= 350
                    ? "Software Dev"
                    : "Software Engineer"}
                </Typography>
                <Typography variant="body2">React | Nodejs | Python</Typography>
              </Box>
            )
          }
        />

        {isLoadingRequest ? (
          <Box mt={1}>
            <Skeleton
              sx={{ height: 350, borderRadius: "10px" }}
              animation="wave"
              variant="rectangular"
            />
          </Box>
        ) : (
          <Box>
            <CardContent>
              <Box mb={2} width={"100%"}>
                <Box mb={1}>
                  <Typography
                    fontWeight={"bold"}
                    variant="body2"
                    textAlign={"center"}
                  >
                    {PostData.title}
                  </Typography>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <WbIncandescentRounded
                    sx={{
                      width: 18,
                      height: 18,
                      color: isDarkMode ? "yellow" : "orange",
                    }}
                  />
                  <Typography fontWeight={'bold'} color={"text.secondary"} variant="body2">
                    {PostData.category}
                  </Typography>
                  <Typography fontWeight={'bold'} color={"text.secondary"} variant="body2">
                    {PostData.county}
                  </Typography>
                  <WbIncandescentRounded
                    sx={{
                      width: 18,
                      height: 18,
                      color: isDarkMode ? "yellow" : "orange",
                    }}
                  />
                </Box>
              </Box>
              <Typography variant={"body2"}>
                {handleDetailsLength()}
                {detailsLong && (
                  <Button
                    onClick={handleNavigate("posts/details")}
                    size="small"
                    sx={{
                      fontSize: "smaller",
                      fontWeight: "bold",
                      padding: 0,
                    }}
                  >
                    more
                  </Button>
                )}
              </Typography>
            </CardContent>
            <Image
              src={PostData.image}
              alt="image"
              style={{
                width: "100%",
                maxHeight: CustomDeviceScreenSize(),
                objectFit: "fill",
                padding: window.screen.availWidth > 1300 ? "5px" : undefined,
                borderRadius: "10px",
                filter: openMenu ? "grayscale(100%)" : undefined,
              }}
            />
          </Box>
        )}

        {isLoadingRequest ? (
          renderSkeleton()
        ) : (
          <Box
            display="flex"
            p={1}
            justifyContent="space-around"
            alignItems="center"
          >
            {[
              {
                icon: <FavoriteRounded sx={{ width: 23, height: 23 }} />,
                count: "500k",
                title: "like",
              },
              {
                icon: <GitHub sx={{ width: 21, height: 21 }} />,
                count: "50k",
                title: "Github",
              },
              {
                icon: <ForumRounded sx={{ width: 21, height: 21 }} />,
                count: "300",
                title: "comment",
                onClick: () => navigate("/posts/details"),
              },
            ].map(({ icon, count, title, onClick }) => (
              <Box display="flex" alignItems="center" key={title}>
                <Tooltip title={title} arrow>
                  <Checkbox onChange={onClick} icon={icon} checkedIcon={icon} />
                </Tooltip>
                <Typography
                  fontWeight="bold"
                  variant="body2"
                  color="text.secondary"
                >
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </>
  );
};

export default CardFeed;
