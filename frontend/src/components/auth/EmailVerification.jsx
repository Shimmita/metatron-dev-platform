import { Close, WbIncandescentRounded } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Collapse, FormHelperText, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [messageGeneral, setMessageGeneral] = useState("");
  const [isProcessing,setIsProcessing]=useState(false)
  const [isDisabledInput,setIsDisabledInput]=useState(false)
  const navigate=useNavigate()
  //extract email from the url
  const email=window.location.href.split('?')[1]

  // dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);
  
  const handleSubmitDetails = (event) => {
    // prevent default form submission
    event.preventDefault();
    // set is processing true
    setIsProcessing(true)
    // user object
    const verificationObject = {
      email,
      email_code: verificationCode,
    };
   
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/account/personal/verify/email`, verificationObject)
      .then((res) => {
        // set message response from the backend
        setMessageGeneral(res.data)
        setIsDisabledInput(true)
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("Server Unreachable");
          return;
        }
        setMessageGeneral(err?.response?.data);

      })
      .finally(() => {
        setIsProcessing(false)
      });
  };

  // handle navigate back to login since verification went successful
  const handleNavigateBackLogin=()=>{
    // home route will forward request back to login page if user not logged in
    navigate("/")
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
        border={isDarkMode ? "1px solid gray" : "none"}
        width={"100%"}
        bgcolor={!isDarkMode && "background.default"}
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
          onSubmit={handleSubmitDetails}
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
          >
            Email Verification Center
          </Typography>

          {/* helper text */}
          <Box 
          mb={1}
          justifyContent={'center'}
          width={'100%'}
          display={'flex'} 
          >
        <FormHelperText> we sent an email verification code</FormHelperText>
          </Box>

           {messageGeneral && (
            <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Collapse in={messageGeneral || false}>
                <Alert
                    className="rounded-5"
                    severity={messageGeneral?.includes('successful') ? 'info':'warning'}
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

            <Box mb={3} mt={3} display={"flex"} justifyContent={"center"}>
            <TextField
              required
              id="outlined-email"
              label="Email"
              className="w-75"
              value={email}
              disabled
              placeholder="username@gmail.com"
              type="email"
            />
          </Box>

          <Box mb={3} mt={4} display={"flex"} justifyContent={"center"}>
            <TextField
              required
              id="outlined-code"
              label="code"
              focused
              disabled={isDisabledInput}
              className="w-75"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="A3YUs2"
            />
          </Box>

            
          <Box 
          display={"flex"} 
          justifyContent={"center"}
          alignItems={'center'}
          mt={3}
          gap={1}
          color={'text.secondary'}
           >
          
            {/* back to login */}
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
                login
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
              sx={{ borderRadius: "20px",textTransform: "none", }}
              disableElevation
              onClick={isDisabledInput ? handleNavigateBackLogin :handleSubmitDetails}
              disabled={isProcessing || !verificationCode}
              type="submit"
            >
              {isDisabledInput ? "Proceed":"Verify Email"}
            </Button>
            )}
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default EmailVerification;
