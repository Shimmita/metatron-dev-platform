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
import React, { useState } from "react";
import EduSpecialisation from "../data/EduSpecialisation";

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
}) {
  const [showInputs, setShowInput] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPath, setAvatarPath] = useState();
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorPosting, setErrorPosting] = useState("");
  // control edu institutions
  const [specialize, setSpecialize] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(EduSpecialisation);

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
    setShowInput(true);
  };

  //   handle click back sets show input false
  const handleClickedBack = () => {
    setShowInput(false);
    // clear avatar
    setAvatar(null);
    setAvatarPath();
    setError("");
  };
  //   handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // clear any error
    setError("");
    // check file size
    if (handleFileSize(file)) {
      setError("File size should not exceed 2MB");
    }

    setAvatar(file);
    // create an object from URI of the image
    setAvatarPath(URL.createObjectURL(file));
  };

  //   handle file size
  const handleFileSize = (file) => {
    return file.size > 2 * 1024 * 1024;
  };

  // handle click complete profile registration
  const handleCompleteRegistration = () => {
    // show progress user is registering
    setIsPosting(true);
    // add the avatar property on the user
    user.avatar = avatarPath;
    user.specialize = specialize;
    // post to the backend using axios
    axios
      .post("http://localhost:5000/signup/personal", user)
      .then((res) => console.log(res.data))
      .catch((error) => {
        // posting off
        setIsPosting(false);
        // error post msg
        setErrorPosting(
          `Dear ${user.name}, we encountered an error while trying to register your profile, kindly try again later.\n Error reference ${error}`
        );
      });
  };

  //   handle later register without avatar
  const handleSignupLater = () => {
    // show progress user is registering
    setIsPosting(true);
    // add the avatar property on the user but empty
    user.avatar = "";
    user.specialize = "";
    // post to the backend using axios
    axios
      .post("http://localhost:5000/signup/personal", user)
      .then((res) => console.log(res.data))
      .catch((error) => {
        // posting off
        setIsPosting(false);
        // error post msg
        setErrorPosting(
          `Dear ${user.name}, we encountered an error while trying to register your profile, kindly try again later.\n Error reference ${error}`
        );
      });
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
                ) : (
                  <>
                    <Avatar alt="" src={avatarPath} />
                    Avatar?
                  </>
                )}
              </Box>
              {/* close btn */}
              <IconButton onClick={handleClose}>
                <Close sx={{ width: 20, height: 20 }} />
              </IconButton>
            </DialogTitle>

            <Divider component={"div"} />
            <DialogContent>
              {showInputs ? (
                <>
                  {errorPosting ? (
                    <React.Fragment>
                      <DialogContentText>{errorPosting}</DialogContentText>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <DialogContentText
                        gutterBottom
                        id="alert-dialog-slide-description"
                      >
                        Choose your favourite avatar icon from your device local
                        storage. Avatar should not exceed the threshold size of
                        2MB
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
                          {avatar && `${avatar.name}`.substring(0, 8)}
                        </Typography>

                        {/* file size */}
                        <Typography
                          mt={1}
                          variant="body2"
                          color={"text.secondary"}
                        >
                          {avatar &&
                            `${parseFloat(
                              avatar.size / (1024 * 1024)
                            ).toPrecision(1)}MB`}
                        </Typography>
                        {/* done tick */}
                        {avatar && (
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
                      {/* course of study */}
                      <Box mt={2}>
                        <DialogContentText
                          gutterBottom
                          id="alert-dialog-slide-description"
                        >
                          What did you specialize in at {user.eduInstitution}{" "}
                          for your {user.educationLevel} program.
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
                                label="Specialisation"
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
                </>
              ) : (
                <>
                  {/* error present from posting user */}
                  {errorPosting ? (
                    <React.Fragment>
                      <DialogContentText>{errorPosting}</DialogContentText>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <DialogContentText
                        gutterBottom
                        id="alert-dialog-slide-description"
                      >
                        If you are interested in adding an avatar and area of
                        specialisation in the tech industry to your profile
                        click{" "}
                        <strong>
                          <u>sure</u>
                        </strong>{" "}
                        to continue. This is optional you can update it later
                        after successfully signing up.
                      </DialogContentText>

                      <DialogContentText
                        gutterBottom
                        mt={2}
                        id="alert-dialog-slide-description"
                      >
                        Individuals without an IT related Degree or Diploma and
                        are enthusiastic in embracing technology are{" "}
                        <strong>
                          <u>recommended</u>
                        </strong>{" "}
                        to select option
                        <strong>
                          {" "}
                          <u>zero technical education</u>
                        </strong>{" "}
                        for specialisation.
                      </DialogContentText>

                      <DialogContentText
                        textAlign={"center"}
                        mt={2}
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
                        Enlightening Technology Country Wide{" "}
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
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleClickAgree}
                    >
                      Try Again
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
                        Sure
                      </Button>
                    </React.Fragment>
                  )}
                </>
              ) : (
                <>
                  {errorPosting ? (
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleClickAgree}
                    >
                      Try Again
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
                          avatar === null ||
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
