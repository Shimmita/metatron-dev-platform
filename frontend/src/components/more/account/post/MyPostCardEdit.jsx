import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { lazy, useEffect, useState } from "react";

import axios from "axios";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetDefaultBottomNav } from "../../../../redux/AppUI";
import PostData from "../../../data/PostData";
import CustomDeviceIsSmall from "../../../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../../../utilities/CustomDeviceScreenSize";
const MyPostDiscardSnackBar = lazy(() =>
  import("./snackbars/MyPostDiscardSnack")
);
const MyPostDeleteSnackBar = lazy(() =>
  import("./snackbars/MyPostDeleteSnack")
);
const MyPostHomeSnackBar = lazy(() => import("./snackbars/MyPostHomeSnack"));

const MyPostCardEdit = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showDeleteSnack, setShowDeleteSnack] = useState(false);
  const [showHomeSnack, setShowHomeSnack] = useState(false);
  const [editableText, setEditableText] = useState(
    PostData && PostData.details
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  // extract the passed id using params hook
  const { postID } = useParams();

  // access the current details of the user from the redux
  const { user } = useSelector((state) => state.currentUser);

  // config axios defaults
  axios.defaults.withCredentials = true;

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

  // handle editing
  const handleEditing = () => {
    setIsEditing(false);
  };

  //   handle discard
  const handleDiscard = () => {
    setShowSnackbar(true);
  };

  // handle updating of the post passing the editable text
  const handleUpdatePost = () => {
    setErrorMessage("");
    setIsUploading(true);
    // post using axios
    axios
      .patch(
        `http://localhost:5000/metatron/api/v1/posts/edit/${2637623}`,
        { editableText },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setErrorMessage("");
        // reload the window updated successfully
        window.location.reload();
        setSuccessMsg(res?.data);
      })
      .catch(async (err) => {
        //  user login session expired show reload window it will be logged out
        // when authentication failes
        if (err?.response?.data.login) {
          // reload the window
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setSuccessMsg("");
          setErrorMessage("Server Unreacheable");
          return;
        }
        setSuccessMsg("");
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // handle the actual deleting process suppose the users accept after snack pop up
  const handleBeginDeletingPost = () => {
    const userID = user._id;
  };

  // handle delete snack
  const handleDelete = () => {
    setShowDeleteSnack(true);
  };

  // handle go home
  const handleGoHome = () => {
    setShowHomeSnack(true);
  };

  return (
    <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
      <Box
        height={"78vh"}
        className="shadow rounded "
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
        <Card elevation={0} className="w-100 rounded p-1">
          {isLoadingRequest ? (
            <Skeleton
              sx={{ height: "70vh", borderRadius: "10px" }}
              animation="wave"
              variant="rectangular"
            />
          ) : (
            <Box>
              <Box display={"flex"} justifyContent={"flex-end"}>
                <IconButton onClick={handleGoHome}>
                  <Close color="primary" sx={{ width: 18, height: 18 }} />
                </IconButton>
              </Box>
              <CardContent>
                <Box width={"100%"} p={0} m={0}>
                  {!isEditing ? (
                    <Box>
                      {/* display editable textfield when discard+update on */}
                      <TextField
                        label={
                          1000 - editableText.length + " characters remaining"
                        }
                        fullWidth
                        variant="standard"
                        error={editableText.length > 1000}
                        multiline
                        disabled={isUploading || errorMessage}
                        focused
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
                        {PostData.details}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
              {/* show error message */}
              {errorMessage && (
                <Collapse in={errorMessage || false}>
                  <Alert
                    severity="warning"
                    onClick={() => setErrorMessage("")}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {errorMessage}
                  </Alert>
                </Collapse>
              )}

              {/* sow success message if any */}
              {successMsg && (
                <Collapse in={successMsg || false}>
                  <Alert
                    severity="success"
                    onClick={() => {
                      setSuccessMsg("");
                      // go home
                      navigate("/");
                    }}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {errorMessage}
                  </Alert>
                </Collapse>
              )}

              {/* show uploading indicator */}
              {isUploading && (
                <Box display={"flex"} justifyContent={"center"} p={1} mb={1}>
                  <CircularProgress size={30} />
                </Box>
              )}

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
                onClick={handleEditing}
                disabled={!isEditing || isUploading}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Edit
              </Button>

              <Button
                disableElevation
                disabled={
                  isEditing || isUploading || editableText.length > 1000
                }
                onClick={handleUpdatePost}
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
                disabled={isEditing || isUploading}
                onClick={handleDiscard}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Discard
              </Button>

              <Button
                disableElevation
                disabled={isUploading}
                color="warning"
                onClick={handleDelete}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Card>
      </Box>
      {/* snackbar discard */}
      <Box>
        <MyPostDiscardSnackBar
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          setIsEditing={setIsEditing}
        />
      </Box>
      {/* snackbar delete */}
      <Box>
        <MyPostDeleteSnackBar
          showSnackbar={showDeleteSnack}
          setShowSnackbar={setShowDeleteSnack}
          handleBeginDeletingPost={handleBeginDeletingPost}
        />
      </Box>
      {/* snackbar home */}
      <Box>
        <MyPostHomeSnackBar
          showSnackbar={showHomeSnack}
          setShowSnackbar={setShowHomeSnack}
        />
      </Box>
    </Box>
  );
};

export default MyPostCardEdit;
