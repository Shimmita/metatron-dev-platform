import {
  LightMode,
  PersonAddRounded,
  StarRounded,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded
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
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import AccountLevelStep from "../level/AccountLevel";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import ModalPolicyTerms from "./ModalPolicyTerms";
import OptionsMoreLogin from "./OptionsMoreLogin";
const ModalAccountInfo = lazy(() => import("./ModalAccountInfo"));

const LoginAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

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

  // navigae to the registration page
  const handleRegister = () => {
    navigate("/auth/register");
  };

  // handle change of theme
  const handleDarkMode = () => {};

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      className=" container"
      height={"99vh"}
    >
      <Box
        className=" shadow-lg rounded-4 px-2"
        width={"100%"}
        sx={{
          overflowX: "auto",
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
                <IconButton onClick={handleDarkMode}>
                  <LightMode sx={{ width: 30, height: 30 }} />
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
                  <PersonAddRounded sx={{ width: 30, height: 30 }} />
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
                <StarRounded sx={{ width: 18, height: 18 }} />
                Kenya's Best IT Platform{" "}
                <StarRounded sx={{ width: 18, height: 18 }} />
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
                  Enlighting Technology Country Wide
                </Typography>
                <WbIncandescentRounded
                  sx={{ width: 18, height: 18, color: "orange" }}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box mb={3}>
              <TextField
                required
                id="outlined-required"
                label="Enter Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="username@gmail.com"
                type="email"
              />
            </Box>
            <Box mb={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Enter Password &nbsp;*
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
            {/* show steps of included packages */}
            <Box mb={2}>
              <AccountLevelStep />
            </Box>

            <Box display={"flex"} justifyContent={"center"} mb={2}>
              <Typography
                variant="body2"
                color={"text.secondary"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                forgot password?
                <Link
                  to={"/auth/recover"}
                  className="text-decoration-none fw-bold"
                >
                  reset
                </Link>
              </Typography>
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

export default LoginAuth;
