import {
  Close,
  CloudUploadRounded,
  Done,
  ErrorRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
import BrowserCompress from "../utilities/BrowserCompress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

let MAX_ABOUT = 142;

export default function AlertProfileCompletion({
  openAlertProfile,
  setOpenAlertProfile,
  user,
}) {
  // redux to check when user signs with a provider
  const { avatar, token } = useSelector((state) => state.signUser);
  const [showInputs, setShowInput] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPath, setAvatarPath] = useState(avatar || "");
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorPosting, setErrorPosting] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [about, setAbout] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   close the dialog
  const handleClose = () => {
    // close alert
    setOpenAlertProfile(false);
    setIsPosting(false);
  };

  //   handle click agree
  const handleClickAgree = () => {
    setErrorPosting("");
    setShowInput(true);
  };

  //   handle click back sets show input false
  const handleClickedBack = () => {
    setShowInput(false);
    // clear avatar loaded from the file storage
    setAvatarFile(null);

    // check if redux avatar is available since it comes from provider
    // if exits set it else let the path be null for later update after signin
    setAvatarPath(avatar || "");
    setError("");
  };
  //   handle file change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    // clear any error
    setError("");
    // check file size
    if (handleFileSize(file)) {
      setError("File size should not exceed 5MB");
    } else {
      // compress the file using the custom utility created
      const compressedFile = await BrowserCompress(file);
      setAvatarFile(compressedFile);

      // create an object from URI of the image
      setAvatarPath(URL.createObjectURL(compressedFile));
    }
  };

  //   handle file size
  const handleFileSize = (file) => {
    return file.size > 5 * 1024 * 1024;
  };

  // handle click complete profile registration
  const handleCompleteRegistration = () => {
    const formData = new FormData();
    formData.append("image", avatarFile);
    formData.append("user", JSON.stringify(user));

    // show progress user is registering
    setIsPosting(true);
    // add the avatar property on the user
    user.avatar = avatarPath;

    // post to the backend using axios for tokenized user using google provider
    axios
      .post(
        token
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/google/${token}`
          : `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/mongo`,
        formData
      )
      .then((res) => {
        // set success messge
        setSuccessMsg(res?.data?.message);
        // clear error msg
        setErrorPosting("");
      })
      .catch((error) => {
        if (error?.code === "ERR_NETWORK") {
          setErrorPosting("Server is unreacheable, kindly try again later ");
          return;
        }

        // error post msg
        setErrorPosting(
          `Dear ${user.name}, we encountered an error while trying to register your profile, kindly try again later.\n Error reference ${error?.message}`
        );
        console.log(error);
      })
      .finally(() =>
        // set posting off
        setIsPosting(false)
      );
  };

  //   handle later register without avatar
  const handleSignupLater = () => {
    // clear error posting if any
    setErrorPosting("");
    // show progress user is registering
    setIsPosting(true);

    // add the avatar property on the user but empty if one from redux is null that came from auth provider
    user.avatar = avatar || "";
    // update user about
    user.about = about;

    // no image passed
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));

    // post to the backend using axios for tokenized user using google providr
    axios
      .post(
        token
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/google/${token}`
          : `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/mongo`,
        formData
      )
      .then((res) => {
        // set success messge
        setSuccessMsg(res?.data?.message);
        // clear error msg
        setErrorPosting("");
      })
      .catch((error) => {
        if (error?.code === "ERR_NETWORK") {
          setErrorPosting("server is unreacheable, kindly try again later ");
          return;
        }

        // error post msg
        setErrorPosting(
          `Dear ${user.name}, We encountered an error during the registration process. ${error?.response?.data}`
        );
        console.log(error);
      })
      .finally(() => {
        // posting off
        setIsPosting(false);
      });
  };

  // handle login of the user
  const handleLogin = async () => {
    // sign out the user if used token
    if (token) {
      // reset the state of redux for temp user
      dispatch(resetAllSigningStateDetails());
      const auth = getAuth();
      signOut(auth).then(() => navigate("/"));
    } else {
      // user did not use auth provider during signin
      navigate("/");
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlertProfile}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        {isPosting ? (
          <React.Fragment>
            {/* content spining wheels or indicators */}
            <DialogContent>
              <Box display={"flex"} justifyContent={"center"}>
                <CircularProgress />
              </Box>
            </DialogContent>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogTitle
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              {/* icon and title */}
              <Box display={"flex"} alignItems={"center"} gap={2}>
                {errorPosting ? (
                  <React.Fragment>
                    {/* error when posting user */}
                    <ErrorRounded
                      color="warning"
                      sx={{ width: 30, height: 30 }}
                    />
                    Error
                  </React.Fragment>
                ) : successMsg ? (
                  <React.Fragment>
                    <Avatar alt="" src={logo} />
                    Signup Successful
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Avatar alt="" src={avatarPath} />
                    About + Avatar?
                  </React.Fragment>
                )}
              </Box>
              {/* close btn */}
              {!successMsg && (
                <IconButton onClick={handleClose}>
                  <Close sx={{ width: 20, height: 20 }} />
                </IconButton>
              )}
            </DialogTitle>

            <Divider component={"div"} />
            <DialogContent>
              {showInputs ? (
                <React.Fragment>
                  {errorPosting ? (
                    <React.Fragment>
                      <DialogContentText>{errorPosting}</DialogContentText>
                    </React.Fragment>
                  ) : successMsg ? (
                    <DialogContentText>{successMsg}</DialogContentText>
                  ) : (
                    <React.Fragment>
                      <DialogContentText
                        gutterBottom
                        id="alert-dialog-slide-description"
                      >
                        Choose your favourite avatar icon from your device storage, it should not exceed the threshold size of
                        5MB
                      </DialogContentText>{" "}
                      {/* Display error message if file exceeds 2MB */}
                      {error && (
                        <Typography
                          gutterBottom
                          variant="caption"
                          style={{ color: "red" }}
                        >
                          {error}
                        </Typography>
                      )}
                      <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Button
                          component="label"
                          role={undefined}
                          disableElevation
                          variant="text"
                          size="medium"
                          sx={{
                            textTransform: "capitalize",
                            borderRadius: "20px",
                            mt: 1,
                          }}
                          tabIndex={-1}
                          startIcon={<CloudUploadRounded />}
                        >
                          choose
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                        {/* file name */}
                        <Typography
                          mt={1}
                          variant="body2"
                          color={"text.secondary"}
                        >
                          {avatarFile && `${avatarFile.name}`.substring(0, 8)}
                        </Typography>

                        {/* file size */}
                        <Typography
                          mt={1}
                          variant="body2"
                          color={"text.secondary"}
                        >
                          {avatarFile &&
                            `${parseFloat(
                              avatarFile.size / (1024 * 1024)
                            ).toPrecision(1)}MB`}
                        </Typography>
                        {/* done tick */}
                        {avatarFile && (
                          <React.Fragment>
                            {error ? (
                              <Close
                                color="error"
                                sx={{ width: 15, height: 15 }}
                              />
                            ) : (
                              <Done
                                color="success"
                                sx={{ width: 17, height: 17 }}
                              />
                            )}
                          </React.Fragment>
                        )}
                      </Box>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {/* error present from posting user */}
                  {errorPosting ? (
                    <React.Fragment>
                      <DialogContentText>{errorPosting}</DialogContentText>
                    </React.Fragment>
                  ) : successMsg ? (
                    <DialogContentText>{successMsg}</DialogContentText>
                  ) : (
                    <React.Fragment>
                      {/* about user */}

                      <DialogContentText
                        gutterBottom
                        id="alert-dialog-slide-description-about"
                      >
                        Briefly tell us more about yourself to facilitate
                        articulation of your technical experience or aspirations to
                        the fellow tech enthusiasts.
                      </DialogContentText>
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        width={"100%"}
                        mb={3}
                        mt={1}
                      >
                        <TextField
                          id="outlined-basic-about-text"
                          error={about.length > MAX_ABOUT}
                          maxRows={2}
                          value={about}
                          focused
                          label={`About ${MAX_ABOUT - about.length}`}
                          placeholder="passionate software engineer....."
                          onChange={(e) => setAbout(e.target.value)}
                          fullWidth
                          multiline
                          variant="standard"
                        />
                      </Box>
                      <DialogContentText
                        gutterBottom
                        id="alert-dialog-slide-description"
                      >
                        Suppose you are Interested in updating 
                        profile picture then click update to upload your custom
                        picture or avatar.
                      </DialogContentText>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 4 }}>
              {!showInputs ? (
                <>
                  {errorPosting ? (
                    <React.Fragment>
                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={() => navigate("/")}
                      >
                        Home
                      </Button>

                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickAgree}
                      >
                        Retry
                      </Button>
                    </React.Fragment>
                  ) : successMsg ? (
                    <Button
                      color="success"
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  ) : (
                    <React.Fragment>
                      <Button
                        disabled={!about}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleSignupLater}
                      >
                        Later
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={!about}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                          ml: 2,
                        }}
                        onClick={handleClickAgree}
                      >
                        Update
                      </Button>
                    </React.Fragment>
                  )}
                </>
              ) : (
                <>
                  {errorPosting ? (
                    <React.Fragment>
                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={() => navigate("/")}
                      >
                        Home
                      </Button>

                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickAgree}
                      >
                        Retry
                      </Button>
                    </React.Fragment>
                  ) : successMsg ? (
                    <Button
                      color="success"
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  ) : (
                    <React.Fragment>
                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickedBack}
                      >
                        Back
                      </Button>
                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleCompleteRegistration}
                        disabled={avatarFile === null || error.trim() !== ""}
                      >
                        Complete
                      </Button>
                    </React.Fragment>
                  )}
                </>
              )}
            </DialogActions>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}
