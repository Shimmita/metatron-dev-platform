import {
  AddAPhotoRounded,
  CheckCircleRounded,
  Close,
  CloudUploadRounded,
  Done,
  ErrorRounded,
  HomeRounded,
  KeyRounded,
  RefreshRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  FormHelperText,
  IconButton,
  styled,
  TextField,
  Typography
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

let MAX_ABOUT = 200;

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

  // redux state
  const { currentMode } = useSelector((state) => state.appUI);
    const isDarkMode=currentMode==='dark'

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
    setError("")
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

    // if no about set error
    if (!about) {
      setErrorPosting('Please provide a brief about yourself!')
      return
    }

    // update the about and avatar attribute
    user.about=about

    // will be update in the backend
    user.avatar=""

    // show progress user is registering
    setIsPosting(true);

    const formData = new FormData();
    formData.append("image", avatarFile);
    formData.append("user", JSON.stringify(user));

    // post to the backend using axios for tokenized user using google provider
    axios
      .post(
        token
          ? `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/google/${token}`
          : `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/mongo`,
        formData
      )
      .then((res) => {
        // set success message
        setSuccessMsg(res?.data?.message);
        // clear error msg
        setErrorPosting("");
      })
      .catch((error) => {
         console.log(error);
        if (error?.code === "ERR_NETWORK") {
          setErrorPosting("Server is unreachable ");
          return;
        }else{
           // error post msg
        setErrorPosting(
          `Dear ${user.name}, we encountered an error while trying to register your profile, 
          kindly try again later.`
        );
        }
      })
      .finally(() =>
        // set posting off
        setIsPosting(false)
      );
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
      <Dialog
        open={openAlertProfile}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{backdropFilter:'blur(5px)'}}
      >
        {isPosting ? (
          <React.Fragment>
            {/* content spinning wheels or indicators */}
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
              sx={{
              background: !isDarkMode && 
              "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
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
                    <Typography>
                    Error
                    </Typography>
                  </React.Fragment>
                ) : successMsg ? (
                  <React.Fragment>
                    <Avatar alt="" src={avatarPath ? avatarPath:logo} />
                    <Typography>
                    Signup Successful
                    </Typography>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Avatar alt="" src={avatarPath} />
                    <Typography >
                      {showInputs ? "My Avatar" :""} 
                    </Typography>
                  </React.Fragment>
                )}
              </Box>
              {/* close btn */}
              {!successMsg && (
                <IconButton
                sx={{ 
                  border:'1px solid',
                  borderColor:'divider'
                }} 
                onClick={handleClose}>
                  <Close sx={{ width: 15, height: 15 }} />
                </IconButton>
              )}
            </DialogTitle>
            {/* helper text */}
            <Box 
            display={'flex'}
            justifyContent={'center'}
            >
            <FormHelperText className="text-info">
              Email shall be verified on login
            </FormHelperText>
            </Box>
            <DialogContent dividers>
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
                      maxWidth={500}
                        gutterBottom
                        id="alert-dialog-slide-description-icon_select"
                      >
                      Upload a profile avatar that will be associated with your account. You can change it 
                      later once registered.
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
                        Provide a brief introduction about yourself which will 
                        be associated with your profile and can be viewed by 
                        like-minded individuals on the platform.
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
                          maxRows={3}
                          value={about}
                          focused
                          label={`About ${MAX_ABOUT - about.length}`}
                          placeholder="write here....."
                          onChange={(e) => setAbout(e.target.value)}
                          fullWidth
                          multiline
                          variant="standard"
                        />
                      </Box>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 4 }}>
              {!showInputs ? (
                <>
                  {errorPosting ? (
                    <Box 
                    display={'flex'}
                    alignItems={'center'}
                    gap={5}
                    >
                      <Button
                      startIcon={<HomeRounded/>}
                      size="small"
                      variant="outlined"
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={() => navigate("/")}
                      >
                        Home
                      </Button>

                      <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RefreshRounded/>}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickAgree}
                      >
                        Retry
                      </Button>
                    </Box>
                  ) : successMsg ? (
                    <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    startIcon={<KeyRounded/>}
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  ) : (
                    <Box 
                    width={'100%'}
                    py={1}
                    justifyContent={'space-around'}
                    alignItems={'center'}
                    display={'flex'}>
                     {/* avatar btn */}
                      <Button
                        variant="outlined"
                        disableElevation
                        disabled={!about || about.length>MAX_ABOUT}
                        startIcon={<AddAPhotoRounded/>}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickAgree}
                      >
                        Avatar
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {errorPosting ? (
                    <Box
                    gap={5}
                    alignItems={'center'}
                    display={'flex'}>
                      <Button
                      disableElevation
                       size="small"
                       variant="outlined"
                       startIcon={<HomeRounded/>}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={() => navigate("/")}
                      >
                        Home
                      </Button>

                      <Button
                      disableElevation
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshRounded/>}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickAgree}
                      >
                        Retry
                      </Button>
                    </Box>
                  ) : successMsg ? (
                    <Button
                    size="small"
                    variant="outlined"
                    disableElevation
                    color="success"
                    startIcon={<KeyRounded/>}
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "20px",
                      }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  ) : (
                    <Box 
                    display='flex'
                    disableElevation
                    gap={5} 
                    alignItems={'center'}>
                      <Button
                      size="medium"
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleClickedBack}
                      >
                        Back
                      </Button>

                      <Button
                      disableElevation
                      size="small"
                      variant="contained"
                      startIcon={<CheckCircleRounded/>}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                        }}
                        onClick={handleCompleteRegistration}
                        disabled={avatarFile === null || error.trim() !== "" || about.length>MAX_ABOUT}
                      >
                        Complete
                      </Button>
                      </Box>
                  )}
                </>
              )}
            </DialogActions>
          </React.Fragment>
        )}
      </Dialog>
  );
}
