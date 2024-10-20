import {
  FavoriteRounded,
  ForumRounded,
  GitHub,
  SendOutlined,
  VerifiedRounded,
  WbIncandescentRounded
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  IconButton,
  InputBase,
  Skeleton,
  Tooltip,
  Typography
} from "@mui/material";
import React, { lazy, useEffect, useState } from "react";

import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import devImage from "../../../../images/dev.jpeg";
import { handleScrolledDown } from "../../../../redux/AppUI";
import PostData from "../../../data/PostData";
import CustomDeviceIsSmall from "../../../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../../../utilities/CustomDeviceScreenSize";
const CommentContainer = lazy(() => import("../../../custom/CommentContainer"));

const MyPostDetailed = () => {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  // show reply in the post details page
  const handleReplyPost = () => {
    setShowComment((prev) => !prev);
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

  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleScrolledDown(true));
  });

  // handle going back using history
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          variant="text"
          className="shadow"
          onClick={handleGoBack}
          sx={{ borderRadius: "20px" }}
        >
          Back
        </Button>
      </Box>

      <Box
        height={"78vh"}
        className="shadow rounded p-1"
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <Card elevation={0} className="w-100 shadow rounded p-1">
          <CardHeader
            sx={{
              padding: "0px",
              margin: "0px",
            }}
            avatar={
              <Box>
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
              </Box>
            }
            action={
              isLoadingRequest ? null : (
                <Box className="d-flex flex-row ">
                  <IconButton disableRipple>
                    <Typography variant="body2">
                      <small>2d</small>
                    </Typography>
                  </IconButton>
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
                  <Tooltip title="Shimmita Douglas" arrow>
                    <Typography fontWeight={"bold"} variant="body1">
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
                  {/* smallest screen */}
                  {screenWidth <= 350 ? (
                    <Box>
                      <Typography variant="body2">Software Dev </Typography>
                      <Typography variant="body2">
                        React|Nodejs|Python{" "}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      {/* mediaum to larger screens */}
                      <Typography variant="body2">
                        Fullstack Developer{" "}
                      </Typography>
                      <Typography variant="body2">
                        React | Nodejs | Python{" "}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            }
          />

          {isLoadingRequest ? (
            <Skeleton
              sx={{ height: "80vh", borderRadius: "10px" }}
              animation="wave"
              variant="rectangular"
            />
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
                    <Typography variant="body2">{PostData.category}</Typography>
                    <Typography variant="body2">{PostData.county}</Typography>
                    <WbIncandescentRounded
                      sx={{
                        width: 18,
                        height: 18,
                        color: isDarkMode ? "yellow" : "orange",
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant={CustomDeviceIsSmall() ? "body2" : "body1"}>
                  {PostData.details}
                </Typography>
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
                  display: showComment ? "none" : "block",
                }}
              />
            </Box>
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
                    checkedIcon={
                      <ForumRounded sx={{ width: 21, height: 21 }} />
                    }
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

          {/* show comments when message clicked */}
          {showComment ? (
            <Box>
              <CommentContainer />
            </Box>
          ) : null}
        </Card>
      </Box>

      {/* comment to a text  */}
      {showComment ? (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          className={"shadow rounded"}
          width={"100%"}
          p={1}
          mt={1}
          bgcolor={"background.default"}
        >
          <Box width={"100%"}>
            <InputBase
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxRows={2}
              className="w-100"
              placeholder="comment here..."
              sx={{
                fontSize: "small",
              }}
            />
          </Box>

          <Box className=" t rounded ms-1" alignContent={"center"}>
            <Badge badgeContent={`${100 - comment.length}`}>
              <IconButton disabled={comment.length > 100}>
                <SendOutlined
                  color={comment.length <= 100 ? "primary" : "inherit"}
                  sx={{ width: 18, height: 18 }}
                />
              </IconButton>
            </Badge>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default MyPostDetailed;
