import { Close, InfoRounded } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentSuccessRedux } from "../../../redux/CurrentSuccess";
import AlertGeneral from "../../alerts/AlertGeneral";
import Certificate from "./Certificate";



const PaymentCertDialog = ({ course, openCertDialog,  setOpenCertDialog,setText }) => {

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  const [errorMessage, setErrorMessage] = useState("");

  // handle screen responsiveness
  const theme = useTheme();
  const isMobileTab = useMediaQuery(theme.breakpoints.down("md")); // tabs and below

  const handleClose = () => setOpenCertDialog(false);

    // paypal btn handle creating of order
  const handleCreatingOrder = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/payment/api/paypal/orders`,
        {
          amount: course?.price,
          description: "Course Certificate Purchase"
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      // return orderId from paypal, for next operation
      return res.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };
  

  // Paypal btn handle on approve fun
  const handleOnApprove = async (data) => {
  
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/payment/api/paypal/orders/${data.orderID}/capture`,
        {courseId:course?._id,studentId:user?._id},
        { withCredentials: true }
      );
      const details = res.data;

      if (details.status === "COMPLETED") {
        
        // redux success alert
        dispatch(updateCurrentSuccessRedux({
          title:'Payment Successful',
          message:"Your certificate payment was successful certificate now unlocked for download."}))

        // update the text option 
        setText("My Certifications")

        // close dialog
        setOpenCertDialog(false)
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setErrorMessage("Error capturing PayPal order:")
    }
  };

  // Paypal btn handle on error
  const handleOnError = (err) => {
    console.error("PayPal SDK error:", err);
    setErrorMessage("Something went wrong with PayPal. Please try again.");
  };



  return (
      <PayPalScriptProvider options={{ 
        clientId: process.env.REACT_APP_ENVIRONMENT==='development' ?
        process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX :
        process.env.REACT_APP_PAYPAL_CLIENT_ID_LIVE
      }}>
    <Box bgcolor={'background.default'}>
      <Dialog
        sx={{ backdropFilter: "blur(3px)"}}
        open={openCertDialog}
        fullScreen
        keepMounted
        fullWidth
        maxWidth="lg"
      >
      <Box
      bgcolor={'background.default'}
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

        <Box
        display={'flex'} 
        justifyContent={'flex-end'} 
        alignItems={'center'}
        p={1}
        >
      
          {/* close icon */}
          <Tooltip title='close' arrow>
          <IconButton 
          onClick={handleClose}
          sx={{ 
            border:'1px solid',
            borderColor:'divider'
           }}
          >
            <Close sx={{ 
              width:15,
              height:15,
            }}/>
          </IconButton>
          </Tooltip>
          </Box>
        
    
        <DialogContent dividers={isMobileTab} >
          <Box
            display="flex"
            flexDirection={isMobileTab ? "column" : "row"}
            gap={3}
       
          >
            {/* Left: Certificate preview */}
            <Box 
            flex={2} p={1} 
            border={'1px solid'} 
            borderColor={'divider'} 
            borderRadius={2}>
            <Typography 
            fontWeight={'bold'}
            my={1} 
            variant="body2"
            className={course?.currentUserCertified && 'text-success'}
            textAlign={'center'}>
            {course?.currentUserCertified ? "You can now download certificate":`Pay $${course?.price} to Download and Get Certified`}
            </Typography>
            {/* certificate preview */}
            <Certificate
            course={course}
            user={user}
             />
            </Box>
            
            {/* if course not certified show paypal payment btns */}
            {!course?.currentUserCertified && (
               <Box
            flex={1} border={'1px solid'} 
            borderColor={'divider'} 
            borderRadius={2} >
              <Stack p={1} gap={3} >
              {/* large screen rendering, payment right bar */}
              <Typography 
              mt={1}
              variant="h6"
              fontWeight={'bold'}
              textTransform={'uppercase'} 
              textAlign={'center'}>
              payment section
              </Typography>

                <Box>
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal",
                  }}
                  // creates an order sends to backend to return orderId
                  createOrder={handleCreatingOrder}

                  // based on the results of orderId, check completion states
                  onApprove={handleOnApprove}

                  // tracks if the buttons loaded, show spinner
                  onError={handleOnError}
                />
              </Box>
              </Stack>
            </Box>
            )}


          </Box>
        </DialogContent>
          </Box>
      </Dialog>


      {/* alert  */}
      {errorMessage && (
        <AlertGeneral
         openAlertGeneral={errorMessage}
        defaultIcon={<InfoRounded/>}
        setErrorMessage={setErrorMessage}
        isError={true}
        title={"Course Rating"}
        message={errorMessage}
         />
      )}
    </Box>
    </PayPalScriptProvider>
  );
};

export default PaymentCertDialog;
