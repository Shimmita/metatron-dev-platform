import {
  CloseRounded,
  EditRounded,
  PublishedWithChangesRounded,
  StarRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import devImage from "../../../../images/dev.jpeg";
import { resetDefaultBottomNav } from "../../../../redux/AppUI";
import PostData from "../../../data/PostData";
import CustomDeviceIsSmall from "../../../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../../../utilities/CustomDeviceScreenSize";
import MyPostSnackBar from "./MyPostSnackBar";

const MyPostCardEdit = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [editableText, setEditableText] = useState(
    PostData && PostData.details
  );

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
    dispatch(resetDefaultBottomNav(true));
  });

  // handle going back using history
  const handleGoBack = () => {
    window.history.back();
  };

  // handle editing
  const handleEditing = () => {
    setIsEditing(false);
  };

  //   handle discard

  const handleDiscard = () => {
    setShowSnackbar(true);
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
                  <Typography fontWeight={"bold"} variant="body1">
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
                {isDarkMode ? (
                  <Typography
                    variant="body2"
                    gutterBottom
                    className="text-center w-100 pb-2"
                  >
                    <span className="d-flex justify-content-center align-items-center align-content-center gap-2">
                      <StarRounded
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                      />
                      <span style={{ fontWeight: "bold" }}>
                        {PostData.category}
                      </span>
                      <StarRounded
                        color="primary"
                        sx={{ width: 20, height: 20 }}
                      />
                      <span style={{ fontWeight: "bold" }}>
                        {PostData.county}
                      </span>
                    </span>

                    <span className="d-flex mt-2 justify-content-center align-items-center align-content-center gap-2">
                      <span style={{ fontWeight: "bold" }}>
                        {PostData.title}
                      </span>
                    </span>
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    gutterBottom
                    className="text-center w-100 pb-2"
                  >
                    <Divider>
                      <span className="d-flex justify-content-center align-items-center align-content-center gap-2">
                        <StarRounded
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                        <span style={{ fontWeight: "bold" }}>
                          {PostData.category}
                        </span>
                        <StarRounded
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                        <span style={{ fontWeight: "bold" }}>
                          {PostData.county}
                        </span>
                      </span>
                    </Divider>

                    <span className="d-flex mt-2 justify-content-center align-items-center align-content-center gap-2">
                      <span style={{ fontWeight: "bold" }}>
                        {PostData.title}
                      </span>
                    </span>
                  </Typography>
                )}

                <Box width={"100%"} p={0} m={0}>
                  {!isEditing ? (
                    <Box>
                      {/* display editable textfield when discard+update on */}
                      <TextField
                        label={
                          1000 - editableText.length + " characters remaining"
                        }
                        color="success"
                        fullWidth
                        variant="filled"
                        error={editableText.length > 1000}
                        multiline
                        defaultValue={editableText}
                        onChange={(e) => setEditableText(e.target.value)}
                      />
                    </Box>
                  ) : (
                    <Box>
                      {/* display typography not in editing */}
                      <Typography
                        gutterBottom
                        variant={CustomDeviceIsSmall() ? "body2" : "body1"}
                      >
                        <span>{PostData.details}</span>
                      </Typography>
                    </Box>
                  )}
                </Box>
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
              justifyContent={"space-around"}
              alignItems={"center"}
              padding={1}
            >
              <Button
                disableElevation
                startIcon={<EditRounded />}
                onClick={handleEditing}
                disabled={!isEditing}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Edit
              </Button>

              <Button
                disableElevation
                disabled={isEditing || editableText.length > 1000}
                startIcon={<PublishedWithChangesRounded />}
                color="success"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Update
              </Button>

              <Button
                disableElevation
                disabled={isEditing}
                onClick={handleDiscard}
                startIcon={<CloseRounded />}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Discard
              </Button>
            </Box>
          )}
        </Card>
      </Box>
      {/* snackbar */}
      <Box>
        <MyPostSnackBar
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          setIsEditing={setIsEditing}
        />
      </Box>
    </Box>
  );
};

export default MyPostCardEdit;
