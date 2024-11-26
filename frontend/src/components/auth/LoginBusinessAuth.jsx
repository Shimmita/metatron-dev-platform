import {
  BusinessRounded,
  GitHub,
  Google,
  LightModeOutlined,
  LightModeRounded,
  Microsoft,
  PersonAddRounded,
  StarRounded,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
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
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { resetDarkMode } from "../../redux/AppUI";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import ModalPolicyTerms from "./ModalPolicyTerms";
import OptionsMoreLogin from "./OptionsMoreLogin";
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));



const LoginBusinessAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [option, setOption] = useState("");
  // control showing alert when login with ggle,ms and git clicked
  const [openAlert, setOpenAlert] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);

  // UI theme dark light teaking effect
  const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
  };

  // global dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  // handle login with github
  const handleLoginWithGithub = () => {
    setOpenAlert(true);
    setOption("git");
  };

  // handle login with google
  const handleLoginWithGoogle = () => {
    setOpenAlert(true);
    setOption("goog");
  };

  // handle login with microsoft
  const handleLoginWithMS = () => {
    setOpenAlert(true);
    setOption("ms");
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
        border={isDarkMode ? "1px solid gray" : "none"}
        sx={{
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
              <Tooltip arrow title={"dark"}>
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
                <BusinessRounded
                  color="primary"
                  sx={{ width: 18, height: 18 }}
                />
                <Typography
                  variant={CustomDeviceSmallest() ? "caption" : "body2"}
                  color={"text.secondary"}
                >
                  Business Account Login
                </Typography>
                <BusinessRounded
                  color="primary"
                  sx={{ width: 18, height: 18 }}
                />
              </Box>

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
                  Enlightening Technology Globally
                </Typography>
                <WbIncandescentRounded
                  sx={{ width: 18, height: 18, color: "orange" }}
                />
              </Box>
            </Box>
          </Box>
          <Box>
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
            <Box mb={3} display={"flex"} justifyContent={"center"}>
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
                <Link to={"/auth/login"} className="text-decoration-none">
                  <Typography
                    variant="body2"
                    sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                  >
                    Personal Account
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
              {/* microsoft signin */}
              <Button
                className="rounded-5"
                size="small"
                onClick={handleLoginWithMS}
                startIcon={<Microsoft />}
                sx={{ fontSize: "small" }}
              >
                <Tooltip arrow title="signin microsoft">
                  Microsoft
                </Tooltip>
              </Button>
              {/* Google signin */}
              <Button
                className="rounded-5"
                size="small"
                onClick={handleLoginWithGoogle}
                startIcon={<Google />}
                sx={{ fontSize: "small" }}
              >
                <Tooltip arrow title="signin google">
                  Google
                </Tooltip>
              </Button>

              {/* github signin */}
              <Button
                className="rounded-5"
                size="small"
                onClick={handleLoginWithGithub}
                startIcon={<GitHub />}
                sx={{ fontSize: "small" }}
              >
                <Tooltip arrow title="signin github">
                  Github
                </Tooltip>
              </Button>
            </Box>

            <Box pb={1} display={"flex"} justifyContent={"center"}>
              <Button
                variant="contained"
                className="w-25"
                sx={{ borderRadius: "20px" }}
                disableElevation
                onClick={(e) => {
                  navigate("/");
                }}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
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
        />
      </Box>
    </Box>
  );
};

export default LoginBusinessAuth;
