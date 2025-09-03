import { Close, WbIncandescentRounded } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Collapse, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CertVerified from "./CertVerified";

const CertificateVerification = () => {
  const [certID, setCertID] = useState("");
  const [messageGeneral, setMessageGeneral] = useState("");
  const [isProcessing,setIsProcessing]=useState(false)
  const [certData,setCertData]=useState(null)
  
  // dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  
  const handleSubmitDetails = (event) => {
    // prevent default form submission
    event.preventDefault();
    // set is processing true
    setIsProcessing(true)
  
   
    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/certificate/verify`,{certID} )
      .then((res) => {
        // certificate present, populate cert data from backend
        setCertData(res.data)
        
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageGeneral("server unreachable");
          return;
        }
        setMessageGeneral(err?.response?.data);
      })
      .finally(() => {
        setIsProcessing(false)
      });
  };


 //  handle closing of cert window
   const handleCloseCertWindow=()=>{
    setCertData(null)
    setCertID('')
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
        p={certData ? 0 :3}
        className={isDarkMode ? "rounded-4" : "shadow-lg rounded-4"}
        border={isDarkMode ? "1px solid gray" : "none"}
        width={"100%"}
        bgcolor={!isDarkMode && "background.default"}
        maxHeight={'98vh'}
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
      {/* show cert if data else input for certID search */}
      {certData  ? (
        <Box display={'flex'} 
        justifyContent={'center'} 
        mb={2}
        gap={2} flexDirection={'column'}
        px={1}
        >
        <CertVerified certificateData={certData}/>
        <Box display={'flex'} justifyContent={'center'}>
        <Button 
        color="secondary" size="large" 
        onClick={handleCloseCertWindow} variant="outlined"
         sx={{borderRadius:3, fontWeight:'bold'}}>
         click to close window
         </Button>
        </Box>
        </Box>
      ):(
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
              Ultimate Tech Platform
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
        Course Certificate Verification
        </Typography>

        {messageGeneral && (
            <Box display={"flex"} justifyContent={"center"} mb={1}>
                <Collapse in={messageGeneral || false}>
                <Alert
                    className="rounded-5"
                    severity={'info'}
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

          <Box mb={3} mt={2} display={"flex"} justifyContent={"center"}>
            <TextField
              required
              id="outlined-email"
              label="Course Certificate ID"
              disabled={isProcessing}
              className="w-75"
              value={certID}
              onChange={(e) => setCertID(e.target.value)}
              placeholder="ID"
            />
          </Box>
        
          <Box display={isProcessing ? 'none':'flex'} justifyContent={"center"} mt={2}>
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

          <div className="d-flex justify-content-center mt-4">
              <Button
              variant="contained"
              startIcon={isProcessing &&  <CircularProgress size={13}/>}
              sx={{ borderRadius: "20px"}}
              disableElevation
              disabled={isProcessing || certID.length<1}
              type="submit"
            >
            Verify Certificate
            </Button>
          
          </div>
        </form>
      )}
      </Box>     
    </Box>
  );
};

export default CertificateVerification;
