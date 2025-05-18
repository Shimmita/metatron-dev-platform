import { Close, Visibility, VisibilityOff, WbIncandescentRounded } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Collapse, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import axios from "axios";

const RecoverAuth = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassoword2, setNewPassword2] = useState("");
  const [messageGeneral, setMessageGeneral] = useState("");
  const [isProcessing,setIsProcessing]=useState(false)
  const [isPasswordLayout,setIsPasswordLayout]=useState(false)
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  
  // dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  // toggle showing of the password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();


    // axios defaults with credentials to true
    axios.defaults.withCredentials = true;
  
  const handleSubmitDetails = (event) => {
    // prevent default form submission
    event.preventDefault();
    // set is processing true
    setIsProcessing(true)
    // user object
    const user = {
      email,
      phone,
    };
   
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset`, user)
      .then((res) => {
        // set message response from the backend
        setMessageGeneral(res?.data?.message)
        // set show password layout when is response contains proceed
        setIsPasswordLayout(res?.data?.status)
      
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server Unreachable");
          setIsPasswordLayout(false)
          return;
        }
        setMessageGeneral(err?.response?.data?.message);
        setIsPasswordLayout(err?.data?.status)

      })
      .finally(() => {
        setIsProcessing(false)
      });
  };


  // for changing the password
  const handleChangePassword = (event) => {
    // prevent default form submission
    event.preventDefault();

    // check if the two passwords match or not
    if (newPassword!==newPassoword2) {
      setMessageGeneral("passwords don't match")

      return
    }

    // set is processing true
    setIsProcessing(true)
    // user object
    const user = {
      email,
      newPassword,
    };
   
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/reset/complete`, user)
      .then((res) => {
      //  navigate to the home page if he/she is logged in it will directed to the dashboard
      navigate("/")
      
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server Unreachable");
          setIsPasswordLayout(false)
          return;
        }
        setMessageGeneral(err?.response?.data?.message);
        setIsPasswordLayout(err?.data?.status)

      })
      .finally(() => {
        setIsProcessing(false)
      });
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
        border={isDarkMode ? "1px solid gray" : "none"}
        width={"100%"}
        sx={{
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <form
          onSubmit={isPasswordLayout ? handleChangePassword:handleSubmitDetails}
          className="w-100 p-3  justify-content-center align-items-center align-content-center"
        >
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

          <Typography
            textAlign={"center"}
            fontWeight={"bold"}
            variant="body1"
            color={"text.secondary"}
            mb={2}
          >
            Password Reset
          </Typography>


           {messageGeneral && (
                        <Box display={"flex"} justifyContent={"center"} mb={1}>
                          <Collapse in={messageGeneral || false}>
                            <Alert
                              className="rounded-5"
                              severity={messageGeneral?.includes('now') ? 'info':'warning'}
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
                            >
                              {messageGeneral.toString()}
                            </Alert>
                          </Collapse>
                        </Box>
                      )}


                      {/* displayed when is no password layout */}

                      {
                        !isPasswordLayout ? (
                          <React.Fragment>
                             <Box mb={3} mt={2} display={"flex"} justifyContent={"center"}>
            <TextField
              required
              id="outlined-email"
              label="Email"
              className="w-75"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@gmail.com"
              type="email"
            />
          </Box>

          <Box mb={3} mt={4} display={"flex"} justifyContent={"center"}>
            <TextField
              required
              id="outlined-phone"
              label="phone"
              className="w-75"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+123..."
              type="tel"
            />
          </Box>
                          </React.Fragment>
                        )
                        :(
                       <React.Fragment>
                         <Box mb={4} display={"flex"} justifyContent={"center"}>
                                      <FormControl fullWidth variant="outlined" className="w-75">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                          Password &nbsp;*
                                        </InputLabel>
                                        <OutlinedInput
                                          required
                                          value={newPassword}
                                          id="outlined-adornment-password"
                                          onChange={(e) => setNewPassword(e.target.value)}
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


                                    <Box mb={4} display={"flex"} justifyContent={"center"}>
                                      <FormControl fullWidth variant="outlined" className="w-75">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                          Confirm Password &nbsp;*
                                        </InputLabel>
                                        <OutlinedInput
                                          required
                                          value={newPassoword2}
                                          id="outlined-adornment-password"
                                          onChange={(e) => setNewPassword2(e.target.value)}
                                          type={showPassword2 ? "text" : "password"}
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword2}
                                                onMouseDown={handleMouseDownPassword2}
                                                edge="end"
                                              >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                          label="Confirm Password"
                                        />
                                      </FormControl>
                                    </Box>
                        
                       </React.Fragment>
                        )
                      }

         

          <Box display={"flex"} justifyContent={"center"} mt={5}>
            <Typography
              variant="body2"
              color={"text.secondary"}
              display={"flex"}
              gap={1}
              alignItems={"center"}
            >
              Back to
              <Link to={"/"} className="text-decoration-none">
                <Typography
                  variant="body2"
                  sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                >
                  Login
                </Typography>{" "}
              </Link>
            </Typography>
          </Box>

          <div className="d-flex justify-content-center mt-3">
            {isProcessing ? (
              <CircularProgress size={20}/>
            ):(
              <Button
              variant="contained"
              className="w-25"
              sx={{ borderRadius: "20px" }}
              disableElevation
              disabled={isProcessing}
              type="small"
            >
              {isPasswordLayout ? "Reset":"Proceed"}
            </Button>
            )}
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default RecoverAuth;
