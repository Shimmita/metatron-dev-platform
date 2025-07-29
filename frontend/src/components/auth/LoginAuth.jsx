import {
  Close,
  DarkModeRounded,
  PersonAddRounded,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { resetDarkMode } from "../../redux/AppUI";
import { updateTempUserDetails } from "../../redux/CompleteSigning";
import { resetClearCurrentAuthMessage } from "../../redux/CurrentAuthMessages";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import { auth, providerGoogle } from "../gcp/FirebaseConfig";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import OptionsMoreLogin from "./OptionsMoreLogin";
const ModalPolicyTerms = lazy(() => import("./ModalPolicyTerms"));
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

const LoginAuth = () => {
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifyButton,setIsVerifyButton]=useState(false)
  // global  state from redux
  const {currentMode } = useSelector((state) => state.appUI);
  const { authMessage } = useSelector((state) => state.currentAuthMessage);
  // update is dark const
  const isDarkMode=currentMode==='dark'

  const [messageGeneral, setMessageGeneral] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // control showing of terms of service and privacy policy
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMore = Boolean(anchorEl);
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // UI theme dark light tweaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };

  // handle login  with google
  const handleLoginWithGoogle = () => {
    const googleFailedError =
      "Google authentication failed!";

    setIsLogin(true);
    // creating empty form data since the backend parses JSON from  the
    // body before processing
    const emptyForm = new FormData();
    const user = {};

    emptyForm.append("user", JSON.stringify(user));
    signInWithPopup(auth, providerGoogle)
      .then((response) =>
        //  getting the access token
        response.user
          .getIdToken()
          .then((token) => {
            // use axios to fetch user details and if they exist from msg resp
            // else redirect them to complete reg page
            axios
              .post(
                `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signup/personal/google/${token}`,
                emptyForm
              )
              .then((res) => {
                console.log(res);
                // in the res message can be true or false if user registered
                if (res?.data?.message) {
                  // user already registered redirect them home
                  // update current user redux states + online status by passing payload
                  // from response that's user object that was came from server fire store
                  const user_payload = res?.data?.user;
                  dispatch(updateUserCurrentUserRedux(user_payload));
                  // home redirect
                  navigate("/");
                } else if (res?.data?.incomplete) {
                  // not yet completed registration/signin/signup redirect complete page
                  // update the name,email and avatar for temp user in the redux
                  dispatch(
                    updateTempUserDetails({
                      username: response.user.displayName,
                      email: response.user.email,
                      avatar: response.user.photoURL,
                      token: token,
                    })
                  );

                  // navigate to personal account completion
                  navigate("/auth/register/personal/completion");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            // set error message
            setMessageGeneral(googleFailedError);
          })
      )
      .catch((err) => {
        // set error message
        setMessageGeneral(googleFailedError);
      })
      .finally(() => {
        // set is login to false to close the progress
        setIsLogin(false);
      });
  };
  

  const handleLogin = async () => {
    const user = {
      email,
      password,
    };
    // login user without provider
    setIsLogin(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signin/personal`, user,{withCredentials:true})
      .then((res) => {
        const user_data=res.data
        // server returns user object if their email verified else only email is sent
        if (user_data?.email_verified) {
        // populating the redux for the logged in user
        dispatch(updateUserCurrentUserRedux(res.data));
        }else{
          navigate(`/auth/verification?${user_data}`)
        }       
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("server unreachable");
          return;
        }
        if (err?.response?.data==="verification code sent to your email") {
          setIsVerifyButton(true)
        }

        setMessageGeneral(err?.response?.data);
      })
      .finally(() => {
        setIsLogin(false);      
      });
  };

  // handle clearing of auth message from redux
  const handleClearAuthMessage = async () => {
    setMessageGeneral("");
    // dispatch clear auth message
    dispatch(resetClearCurrentAuthMessage());
    // purge for complete clearance
    try {
      await persistor.purge();
    } catch (error) {
      // something went wrong during the purge process
      console.log(error.message);
    }
  };

// handle navigate to complete verification of email
const handleEmailVerification=()=>{
  navigate(`/auth/verification?${email}`)
}
 
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      className=" container"
      height={"100vh"}
    >
      <Box
        className={isDarkMode ? "rounded-4" : "shadow-lg rounded-4"}
        width={"100%"}
        maxHeight={"95vh"}
        bgcolor={!isDarkMode && "background.default"}
        sx={{
          border: isDarkMode && "1px solid",
          borderColor: isDarkMode && "divider",
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          opacity: openMore ? "0.7" : undefined,
          backdropFilter: openMore ? "blur(10px)" : undefined,
        }}
      >
        <Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box>
              <Tooltip arrow title={isDarkMode ? "Light" : "Dark"}>
                <IconButton onClick={handleShowDarkMode}>
                  {isDarkMode ? (
                    <DarkModeRounded
                      sx={{ width: 26, height: 26 ,}}
                    />
                  ) : (
                    <DarkModeRounded sx={{ width: 26, height: 26 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Tooltip arrow title={"signup"}>
                <IconButton
                  onClick={handleClickMore}
                  aria-label="more"
                  id="more-button"
                  disabled={isLogin}
                  aria-controls={openMore ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMore ? "true" : undefined}
                >
                  <PersonAddRounded sx={{ width: 28, height: 28 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* menu more*/}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMore}
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
              <OptionsMoreLogin
                handleClose={handleClose}
                setOpenModalInfo={setOpenModalInfo}
                setShowPrivacy={setShowPrivacy}
                setOpenModalTerms={setOpenModalTerms}
              />
            </Menu>
          </Box>
          <Box >
            <Box display={"flex"} justifyContent={"center"}>
              {/* logo */}
              <Avatar alt={"logo"} sx={{ width: 60, height: 60 }} src={logo} />
            </Box>
            <Box mb={3}>
              <Typography
                textAlign={"center"}
                fontWeight={"bold"}
                bgcolor={!isDarkMode && "background.default"} 
                textTransform={"uppercase"}
                variant={CustomDeviceSmallest() ? "body1" : "h6"}
                gutterBottom
                color={"primary"}
              >
                Metatron Developer
              </Typography>
              <Box
                mb={2}
                display={"flex"}
                justifyContent={"center"}
                gap={1}
                alignItems={"center"}
              >
                <WbIncandescentRounded
                  sx={{ width: 18, height: 18, color: "orange" }}
                />
                <Typography
                  variant={CustomDeviceSmallest() ? "caption" : "body2"}
                  color={"text.secondary"}
                >
                 Ultimate Tech Platform
                </Typography>
                <WbIncandescentRounded
                  sx={{ width: 18, height: 18, color: "orange" }}
                />
              </Box>

            </Box>
          </Box>
          <Box>
            {/* displays error when login is unsuccessful */}
            {messageGeneral && (
              <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Collapse in={messageGeneral || false}>
                  <Alert
                    className="rounded-5"
                    severity="info"
                    onClick={() => setMessageGeneral("")}
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
                    {messageGeneral.toString()}
                  </Alert>
                </Collapse>
              </Box>
            )}
            {/* display when is server auth messages session and server maintenance */}
            {authMessage && (
              <Box display={"flex"} justifyContent={"center"}>
                <Collapse in={authMessage || false}>
                  <Alert
                    className="rounded-5"
                    severity={
                      authMessage?.includes("server") ? "warning" : "success"
                    }
                    onClick={handleClearAuthMessage}
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
                    {authMessage.toString()}
                  </Alert>
                </Collapse>
              </Box>
            )}

            <Box mb={4} display={"flex"} justifyContent={"center"}>
              <TextField
                required
                id="outlined-required"
                label="Email"
                className="w-75"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                type="email"
              />
            </Box>

            <Box mb={4} display={"flex"} justifyContent={"center"}>
              <FormControl fullWidth variant="outlined" className="w-75">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password &nbsp;*
                </InputLabel>
                <OutlinedInput
                  required
                  value={password}
                  id="outlined-adornment-password"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Box>

            <Box 
            display={isLogin ? "none":"flex"} 
            justifyContent={"center"} 
            alignItems={'center'}
            mb={2}>
              <Typography
                variant="body2"
                color={"text.secondary"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                 <Typography
                    variant="body2"
                  >
                   Forgot Password?
                  </Typography>
                |
                <Link to={"/auth/recover"} className="text-decoration-none">
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                  >
                    reset password
                  </Typography>
                </Link> 
              </Typography>
            </Box>

            {/* <Box display={"flex"} gap={1} justifyContent={"center"} mb={2}>
              <Tooltip arrow title="signin with google">
                <Button
                  className={CustomDeviceIsSmall() ? "w-50" : "w-25"}
                  variant="outlined"
                  disabled={isLogin || messageGeneral}
                  startIcon={<Google />}
                  onClick={handleLoginWithGoogle}
                  sx={{ textTransform: "none", borderRadius: "20px",display:'none' }}
                >
                  {CustomDeviceSmallest ? "Google" : "Google Signin"}
                </Button>
              </Tooltip>
            </Box> */}

            <Box mb={2} display={"flex"} justifyContent={"center"}>
                <Button
                startIcon={isLogin && <CircularProgress size={13}/>}
                  variant="contained"
                  className={CustomDeviceIsSmall() ? "w-50" : "w-25"}
                  disabled={
                    isLogin ||
                    messageGeneral ||
                    authMessage ||
                    !(email && password)
                  }
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                  disableElevation
                  onClick={isVerifyButton ? handleEmailVerification:handleLogin}
                >
                 {isVerifyButton ? 'Verification':'Login'}
                </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* show backdrop when is login */}
      {isLogin && <Backdrop />}

      {/* show the account help info modal when toggled */}
      <Box>
        <ModalAccountInfo
          openModalInfo={openModalInfo}
          setOpenModalInfo={setOpenModalInfo}
        />
      </Box>
      {/* show modal terms of service */}
      <Box>
        <ModalPolicyTerms
          openModalTerms={openModalTerms}
          setOpenModalTerms={setOpenModalTerms}
          isShowPrivacy={showPrivacy}
        />
      </Box>
    </Box>
  );
};

export default LoginAuth;
