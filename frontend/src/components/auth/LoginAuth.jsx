import {
  Close,
  CoffeeRounded,
  Google,
  LightModeOutlined,
  LightModeRounded,
  PersonAddRounded,
  PersonRounded,
  StarRounded,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
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
import { auth, providerGoogle } from "../firebase/FirebaseConfig";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import OptionsMoreLogin from "./OptionsMoreLogin";
const AlertSponsorship = lazy(() => import("../alerts/AlertSponsorship"));
const ModalPolicyTerms = lazy(() => import("./ModalPolicyTerms"));
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

const LoginAuth = () => {
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [openSponsorAlert, setOpenSponsorAlert] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // global  state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { authMessage } = useSelector((state) => state.currentAuthMessage);

  // axios defaults with credentials to true
  axios.defaults.withCredentials = true;

  const [messageGeneral, setMessageGeneral] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // control showing of terms of service and privacy policy
  const [isShowPrivacy, setShowPrivacy] = useState(false);

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

  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };

  // handle login  with google
  const handleLoginWithGoogle = () => {
    const googleFailedError =
      "Google authentication failed, please try again later";

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
            // use axios to fecth user details and if they exist from msg resp
            // else redirect them to complet reg page
            axios
              .post(
                `http://localhost:5000/metatron/api/v1/signup/personal/google/${token}`,
                emptyForm
              )
              .then((res) => {
                console.log(res);
                // in the res messge can be true or false if user registered
                if (res?.data?.message) {
                  // user already registered redirect them home
                  // update current user redux states + online status by passing payload
                  // from response that's user object that was came from server firestore
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
      .post(`http://localhost:5000/metatron/api/v1/signin/personal`, user)
      .then((res) => {
        // populating the redux for the logged in user
        dispatch(updateUserCurrentUserRedux(res.data));
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server Unreachable");
          return;
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
    // perge for complete clearance
    try {
      await persistor.purge();
    } catch (error) {
      // something went wrong during the purge process
      console.log(error.message);
    }
  };

  // handle showing of sponsorship alert
  const handleSponsorAlert = () => {
    setOpenSponsorAlert(true);
  };

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
        maxHeight={"98vh"}
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
              <Tooltip arrow title={isDarkMode ? "light" : "dark"}>
                <IconButton onClick={handleShowDarkMode}>
                  {isDarkMode ? (
                    <LightModeRounded
                      color="warning"
                      sx={{ width: 30, height: 30 }}
                    />
                  ) : (
                    <LightModeOutlined sx={{ width: 30, height: 30 }} />
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
          <Box mb={1}>
            <Box display={"flex"} justifyContent={"center"}>
              {/* logo */}
              <Avatar alt={"logo"} sx={{ width: 60, height: 60 }} src={logo} />
            </Box>
            <Box mb={3}>
              <Typography
                textAlign={"center"}
                fontWeight={"bold"}
                textTransform={"uppercase"}
                variant={CustomDeviceSmallest() ? "body1" : "h6"}
                gutterBottom
                color={"primary"}
              >
                Metatron Foundation
              </Typography>

              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="body2"
                mb={2}
                textTransform={"capitalize"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <StarRounded sx={{ width: 20, height: 20 }} />
                The Best IT Platform{" "}
                <StarRounded sx={{ width: 20, height: 20 }} />
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
                  Enlightening Technology
                </Typography>
                <WbIncandescentRounded
                  sx={{ width: 18, height: 18, color: "orange" }}
                />
              </Box>

              <Typography
                mb={2}
                display={"flex"}
                justifyContent={"center"}
                gap={1}
                color={"text.secondary"}
                alignItems={"center"}
              >
                <PersonRounded color="primary" sx={{ width: 18, height: 18 }} />
                <Typography
                  variant={CustomDeviceSmallest() ? "caption" : "body2"}
                  color={"text.secondary"}
                >
                  Personal Account Login
                </Typography>
                <PersonRounded color="primary" sx={{ width: 18, height: 18 }} />
              </Typography>
            </Box>
          </Box>
          <Box>
            {/* displays error when login is unsuccessful */}
            {messageGeneral && (
              <Box display={"flex"} justifyContent={"center"}>
                <Collapse in={messageGeneral || false}>
                  <Alert
                    className="rounded-5"
                    severity="warning"
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
                    {messageGeneral}
                  </Alert>
                </Collapse>
              </Box>
            )}
            {/* display when is server auth messages session and server maintainance */}
            {authMessage && (
              <Box display={"flex"} justifyContent={"center"}>
                <Collapse in={authMessage || false}>
                  <Alert
                    className="rounded-5"
                    severity={
                      authMessage.includes("server") ? "warning" : "success"
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
                    {authMessage}
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
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
                  onChange={(e) => setPassword(e.target.value.toLowerCase())}
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

            <Box display={"flex"} justifyContent={"center"} mb={2}>
              <Typography
                variant="body2"
                color={"text.secondary"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <Link
                  to={"/auth/login/business"}
                  className="text-decoration-none"
                >
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                  >
                    Business Account
                  </Typography>
                </Link>
                |
                <Link to={"/auth/recover"} className="text-decoration-none">
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                  >
                    Password Reset
                  </Typography>
                </Link>
              </Typography>
            </Box>

            <Box display={"flex"} gap={1} justifyContent={"center"} mb={2}>
              {/* Google signin */}
              <Tooltip arrow title="signin with google">
                <Button
                  className={CustomDeviceIsSmall() ? "w-50" : "w-25"}
                  variant="outlined"
                  disabled={isLogin || messageGeneral}
                  startIcon={<Google />}
                  onClick={handleLoginWithGoogle}
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                >
                  {CustomDeviceSmallest ? "Google" : "Google Signin"}
                </Button>
              </Tooltip>
            </Box>

            <Box mb={2} display={"flex"} justifyContent={"center"}>
              <Tooltip arrow title="signin with email and password">
                <Button
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
                  onClick={handleLogin}
                  type="submit"
                >
                  Login
                </Button>
              </Tooltip>{" "}
            </Box>

            {/* buy me coffe */}
            <Box mb={2} display={"flex"} justifyContent={"center"}>
              <Tooltip arrow title={"we value your contribution"}>
                <Button
                  onClick={handleSponsorAlert}
                  variant="text"
                  size="small"
                  sx={{ textTransform: "lowercase", fontWeight: "bold" }}
                  startIcon={<CoffeeRounded />}
                >
                  Sponsor Metatron
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* show backdrop when is login */}
      {isLogin && <Backdrop />}

      {/* show alert sponsorshio */}
      <Box>
        <AlertSponsorship
          openSponsorAlert={openSponsorAlert}
          setOpenSponsorAlert={setOpenSponsorAlert}
        />
      </Box>
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
          isShowPrivacy={isShowPrivacy}
        />
      </Box>
    </Box>
  );
};

export default LoginAuth;
