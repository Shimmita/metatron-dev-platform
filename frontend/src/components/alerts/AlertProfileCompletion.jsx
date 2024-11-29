import {
  CheckCircle,
  Close,
  CloudUploadRounded,
  Done,
  ErrorRounded,
  WbIncandescentRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
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
import EduSpecialisation from "../data/EduSpecialisation";
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

export default function AlertProfileCompletion({
  openAlertProfile,
  setOpenAlertProfile,
  user,
  isBusiness = false,
}) {
  // redux to check when user signs with a provider
  const { avatar, token } = useSelector((state) => state.signUser);
  const [showInputs, setShowInput] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPath, setAvatarPath] = useState(avatar || "");
  const [error, setError] = useState("");
  const [errorSpecialize, setErrorSpecialize] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorPosting, setErrorPosting] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // control edu institutions
  const [specialize, setSpecialize] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(EduSpecialisation);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddNewSpecialisation = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setSpecialize(inputValue);
      setInputValue("");
    }
  };
  // clear an institution
  const handleDeleteSpecialisation = () => {
    setSpecialize(null);
  };

  //   close the dialog
  const handleClose = () => {
    // close alert
    setOpenAlertProfile(false);
    setIsPosting(false);
  };

  //   handle click agree
  const handleClickAgree = () => {
    setErrorPosting("");
    setErrorSpecialize("");
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
    user.specialize = specialize;
    // post to the backend using axios

    // post to the backend using axios for tokenized user using google providr
    axios
      .post(
        token
          ? `http://localhost:5000/metatron/api/v1/signup/personal/google/${token}`
          : `http://localhost:5000/metatron/api/v1/signup/personal/mongo`,
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
    // no image passed
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));

    if (!specialize) {
      setErrorSpecialize("please provide area of specialisation");
      setIsPosting(false);
    } else {
      // clear error posting empty
      setErrorPosting("");
      // clear error specialize
      setErrorSpecialize("");
      // show progress user is registering
      setIsPosting(true);
      // add the avatar property on the user but empty if one from redux is null that came from auth provider
      user.avatar = avatar || "";
      // sepcialisation property add
      user.specialize = specialize;

      // post to the backend using axios for tokenized user using google providr
      axios
        .post(
          token
            ? `http://localhost:5000/metatron/api/v1/signup/personal/google/${token}`
            : `http://localhost:5000/metatron/api/v1/signup/personal/mongo`,
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
            `Dear ${user.name}, we encountered an error while trying to register your profile, kindly try again later. ${error?.response?.data}`
          );
          console.log(error);
        })
        .finally(() => {
          // posting off
          setIsPosting(false);
        });
    }
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
          <>
            {/* content spining wheels or indicators */}
            <DialogContent>
              <Box display={"flex"} justifyContent={"center"}>
                <CircularProgress />
              </Box>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              {/* icon and title */}
              <Box display={"flex"} alignItems={"center"} gap={2}>
                {errorPosting ? (
                  <>
                    {/* error when posting user */}
                    <ErrorRounded
                      color="warning"
                      sx={{ width: 30, height: 30 }}
                    />
                    Error
                  </>
                ) : successMsg ? (
                  <>
                    <Avatar alt="" src={logo} />
                    Signup Successful
                  </>
                ) : (
                  <>
                    <Avatar alt="" src={avatarPath} />
                    Avatar?
                  </>
                )}
              </Box>
              {/* close btn */}
              {!successMsg && (
                <IconButton onClick={handleClose}>
                  <Close sx={{ width: 20, height: 20 }} />
                </IconButton>
              )}
            </DialogTitle>
            {/* show error of specialisation if present */}
            {errorSpecialize && (
              <Box display={"flex"} justifyContent={"center"}>
                <Typography variant="caption" color={"red"}>
                  {" "}
                  {errorSpecialize}{" "}
                </Typography>
              </Box>
            )}

            <Divider component={"div"} />
            <DialogContent>
              {showInputs ? (
                <>
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
                        Choose your favourite avatar icon from your device local
                        storage. Avatar should not exceed the threshold size of
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
                      {/* display this when not business account */}
                      {!isBusiness && (
                        <React.Fragment>
                          {/* course of study */}
                          <Box mt={2}>
                            <DialogContentText
                              gutterBottom
                              id="alert-dialog-slide-description"
                            >
                              Provide your area of specialisation which you
                              majored at {user.eduInstitution} for your{" "}
                              {user.educationLevel} program.
                            </DialogContentText>{" "}
                            <Box display={"flex"} justifyContent={"center"}>
                              <Autocomplete
                                value={specialize}
                                className="w-100"
                                onChange={(event, newValue) => {
                                  setSpecialize(newValue);
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                  setInputValue(newInputValue);
                                }}
                                options={options}
                                freeSolo
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="specialisation"
                                    variant="standard"
                                    fullWidth
                                    required
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderTags={() =>
                                  specialize ? (
                                    <Chip
                                      label={specialize}
                                      onDelete={handleDeleteSpecialisation}
                                      deleteIcon={<CheckCircle />}
                                    />
                                  ) : null
                                }
                                noOptionsText={
                                  <Chip
                                    label={`Add "${inputValue}"`}
                                    onClick={handleAddNewSpecialisation}
                                    icon={<CheckCircle />}
                                    color="primary"
                                    clickable
                                  />
                                }
                              />
                            </Box>
                          </Box>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </>
              ) : (
                <>
                  {/* error present from posting user */}
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
                        Suppose you are Interested in updating your avatar or
                        profile picture click update to continue.
                      </DialogContentText>

                      <DialogContentText
                        gutterBottom
                        mt={2}
                        id="alert-dialog-slide-description"
                      >
                        Individuals without Tech related background are{" "}
                        recommended to select zero technical education under
                        specialisation.
                      </DialogContentText>

                      {/* display this when not business account */}
                      {!isBusiness && (
                        <React.Fragment>
                          {/* course of study */}
                          <Box mt={2}>
                            <DialogContentText
                              gutterBottom
                              id="alert-dialog-slide-descri"
                            >
                              Provide your area of specialisation which you
                              majored at {user.eduInstitution} for your{" "}
                              {user.educationLevel} program.
                            </DialogContentText>{" "}
                            <Box
                              mt={2}
                              display={"flex"}
                              justifyContent={"center"}
                            >
                              <Autocomplete
                                value={specialize}
                                className="w-100"
                                onChange={(event, newValue) => {
                                  setSpecialize(newValue);
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                  setInputValue(newInputValue);
                                }}
                                options={options}
                                freeSolo
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="specialisation"
                                    variant="standard"
                                    fullWidth
                                    required
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderTags={() =>
                                  specialize ? (
                                    <Chip
                                      label={specialize}
                                      onDelete={handleDeleteSpecialisation}
                                      deleteIcon={<CheckCircle />}
                                    />
                                  ) : null
                                }
                                noOptionsText={
                                  <Chip
                                    label={`Add "${inputValue}"`}
                                    onClick={handleAddNewSpecialisation}
                                    icon={<CheckCircle />}
                                    color="primary"
                                    clickable
                                  />
                                }
                              />
                            </Box>
                          </Box>
                        </React.Fragment>
                      )}

                      <DialogContentText
                        textAlign={"center"}
                        mt={3}
                        variant="caption"
                        gutterBottom
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={1}
                        id="alert-dialog-slide-description"
                      >
                        <WbIncandescentRounded
                          sx={{ width: 15, height: 15, color: "orange" }}
                        />{" "}
                        Enlightening Technology Globally{" "}
                        <WbIncandescentRounded
                          sx={{ width: 15, height: 15, color: "orange" }}
                        />
                      </DialogContentText>
                    </React.Fragment>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
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
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleSignupLater}
                      >
                        Later
                      </Button>
                      <Button
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
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
                        disabled={
                          avatarFile === null ||
                          specialize === "" ||
                          error.trim() !== ""
                        }
                      >
                        Complete
                      </Button>
                    </React.Fragment>
                  )}
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
}
