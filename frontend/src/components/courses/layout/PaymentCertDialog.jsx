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
import { updateCurrentSnackBar } from "../../../redux/CurrentSnackBar";
import AlertGeneral from "../../alerts/AlertGeneral";
import Certificate from "./Certificate";



const PaymentCertDialog = ({ course:courseItem, openCertDialog,  setOpenCertDialog }) => {

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  const [course,setCourse]=useState(courseItem)
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  // handle screen responsiveness
  const theme = useTheme();
  const isMobileTab = useMediaQuery(theme.breakpoints.down("md")); // tabs and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // smartphones and below

  const handleClose = () => setOpenCertDialog(false);

  // handle get certificate, let users pay via paypal or any 
  // supported payment gateways.
  const handleGetCertificate=()=>{
    // handle rating first before continuation to payment
    setIsFetching(true)

    // axios patch request, to update the rating state of the course
    axios.patch(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/rating`,{}, {
                  withCredentials: true,
      })
      .then((res) => {
        // update the redux of courses by clearing, will trigger refetch
        if (res?.data) {
          
          // update the success status
          dispatch(updateCurrentSnackBar(res.message))

          // updated course obj from the backend
          setCourse(res.data.data)

          // trigger show an alert for payment gateways here

        } 
      })
      .catch(async (err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);
      });

  }


    // paypal btn handle creating of order
  const handleCreatingOrder = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/payment/api/paypal/orders`,
        {
          // amount: course?.price,
          amount: '50.00',
          description: "Course Certificate Purchase"
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log(res.data);
      return res.data.id; // must return orderID for PayPal
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
        setPaymentSuccess(true);
        alert("Payment successful! Certificate unlocked for download.");
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
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
         process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX : process.env.REACT_APP_PAYPAL_CLIENT_ID_LIVE
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
