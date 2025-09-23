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
import React, { lazy, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { resetDarkMode } from "../../redux/AppUI";
import { resetClearCurrentAuthMessage } from "../../redux/CurrentAuthMessages";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
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
  const [isVerifyButton, setIsVerifyButton] = useState(false);

  // redux state
  const { currentMode } = useSelector((state) => state.appUI);
  const { authMessage } = useSelector((state) => state.currentAuthMessage);

  const isDarkMode = currentMode === "dark";

  const [messageGeneral, setMessageGeneral] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleShowDarkMode = () => {
    dispatch(resetDarkMode());
  };

  const handleLogin = async () => {
    const user = { email, password };
    setIsLogin(true);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signin/personal`,
        user,
        { withCredentials: true }
      )
      .then((res) => {
        const user_data = res.data;
        if (user_data?.email_verified) {
          dispatch(updateUserCurrentUserRedux(res.data));
        } else {
          navigate(`/auth/verification?${user_data}`);
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("server unreachable");
          return;
        }
        if (err?.response?.data === "verification code sent to your email") {
          setIsVerifyButton(true);
        }
        setMessageGeneral(err?.response?.data);
      })
      .finally(() => {
        setIsLogin(false);
      });
  };

  const handleClearAuthMessage = React.useCallback(async () => {
    dispatch(resetClearCurrentAuthMessage());
    try {
      await persistor.purge();
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch]);

  const handleEmailVerification = () => {
    navigate(`/auth/verification?${email}`);
  };

  // auto clear general messages after 3 seconds
  useEffect(() => {
    if (messageGeneral) {
      const timer = setTimeout(() => {
        setMessageGeneral("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageGeneral]);

  // auto clear redux auth messages after 3 seconds
  useEffect(() => {
    if (authMessage) {
      const timer = setTimeout(() => {
        handleClearAuthMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authMessage, handleClearAuthMessage]);

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
          "&::-webkit-scrollbar": { display: "none" },
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
                  <DarkModeRounded sx={{ width: 26, height: 26 }} />
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

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMore}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "more-button" }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <OptionsMoreLogin
                handleClose={handleClose}
                setOpenModalInfo={setOpenModalInfo}
                setShowPrivacy={setShowPrivacy}
                setOpenModalTerms={setOpenModalTerms}
              />
            </Menu>
          </Box>

          <Box>
            <Box display={"flex"} justifyContent={"center"}>
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
            {/* general messages */}
            {messageGeneral && (
              <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Collapse in={!!messageGeneral}>
                  <Alert
                    className="rounded-5"
                    severity="info"
                    onClose={() => setMessageGeneral("")} // ✅ close button clears immediately
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setMessageGeneral("")}
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

            {/* redux auth messages */}
            {authMessage && (
              <Box display={"flex"} justifyContent={"center"}>
                <Collapse in={!!authMessage}>
                  <Alert
                    className="rounded-5"
                    severity={
                      authMessage?.includes("server") ? "warning" : "success"
                    }
                    onClose={handleClearAuthMessage} // ✅ close button clears immediately
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClearAuthMessage}
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

            {/* verify certificate */}
            <Box
              display={isLogin ? "none" : "flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mb={2}
            >
              <Typography
                variant="body2"
                color={"text.secondary"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <Typography variant="body2">Verify Course Cert</Typography>
                <Link to={"/cert/verify"} className="text-decoration-none">
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                  >
                    click here
                  </Typography>
                </Link>
              </Typography>
            </Box>

            {/* forgot password */}
            <Box
              display={isLogin ? "none" : "flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mb={2}
            >
              <Typography
                variant="body2"
                color={"text.secondary"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <Typography variant="body2">Forgot Password</Typography>
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

            <Box mb={2} display={"flex"} justifyContent={"center"}>
              <Button
                startIcon={isLogin && <CircularProgress size={13} />}
                variant="contained"
                className={CustomDeviceIsSmall() ? "w-50" : "w-25"}
                disabled={
                  isLogin || Boolean(messageGeneral) || Boolean(authMessage) || !(email && password)
                }
                sx={{ textTransform: "none", borderRadius: "20px" }}
                disableElevation
                onClick={isVerifyButton ? handleEmailVerification : handleLogin}
              >
                {isVerifyButton ? "Verification" : "Login"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* backdrop */}
      {isLogin && <Backdrop />}

      {/* modals */}
      <Box>
        <ModalAccountInfo
          openModalInfo={openModalInfo}
          setOpenModalInfo={setOpenModalInfo}
        />
      </Box>
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
