import { EmailOutlined, GradeRounded, NavigateNext, PhoneOutlined, StarBorderRounded, StarHalfRounded } from "@mui/icons-material";
import { Avatar, Box, FormHelperText, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import GoogleLogo from "../../images/google.png";
import MpesaLogo from "../../images/mpesa.png";
import PaypalLogo from "../../images/paypal2.png";
import StripeLogo from "../../images/stripe.jpeg";
import DevAccountConfig from "../config/DevAccountConfig";
import RecommendStepper from "../custom/RecommendStepper";
import PremiumData from "../data/PremiumData";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertForYou({
  openAlertGeneral,
  title,
  message,
  defaultIcon,
  isRecommend=false,
  isPremium=false,
  isApp=false,
  isHelp=false,
  handleCloseAll
}) {
  // premium option
  const [premiumOption,setPremiumOption]=useState(3)

  // payment option
  const [paymentOption,setPaymentOption]=useState("")

  // show checkout page
  const [isChekout,setIsCheckOut]=useState(false)

  const handleClose = () => {
    handleCloseAll()
  };

  //  redux states
  const { isTabSideBar,currentMode } = useSelector((state) => state.appUI);
 const isDarkMode=currentMode==='dark'
  // handle width of alert dialog 
  const handleAlertGenWidth=()=>{
    if (CustomDeviceTablet() && isTabSideBar) {
      return "36%"
    } else if(CustomLandScape()){
      return "-1%"
    } else if(CustomLandscapeWidest()){
      return "0%"
    }
  }


  // handle complete payment
  const handleCheckOut=(e)=>{
    setIsCheckOut(prev=>!prev)
  }
  

  return (
      <Dialog
        open={openAlertGeneral}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter:'blur(3px)',
           marginLeft:handleAlertGenWidth()
          }}
      >
          <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body2"
          fontWeight={"bold"}
          gap={2}
        >
          {defaultIcon}
          {title}
        </DialogTitle>
        {/* upgrade to premium helper */}
        {/* <Box 
        width={'100%'}
        justifyContent={'center'}
        display={'flex'}>
        <FormHelperText sx={{ 
          color:isDarkMode ? '#ab47bc' :'#7b1fa2',
          fontWeight: isDarkMode ? 'bold':undefined
         }} >upgrade to premium for unlimited access</FormHelperText>
        </Box> */}
        <DialogContent dividers>
        <Box 
        maxHeight={CustomDeviceIsSmall()?"50vh":"62.5vh"}
        sx={{
              overflowX: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
        >
          <DialogContentText 
          gutterBottom maxWidth={400} 
          mb={message?.length>1 ? 1:0} variant="body2" 
          id="alert-dialog-slide-description">
            {message}
          </DialogContentText>

          {/* content for help are buttons */}
          {isHelp && (
            <Box 
           mt={2}
            display={'flex'}
            justifyContent={'center'} 
            gap={2}
            flexDirection={CustomDeviceIsSmall() && "column"}
                >
                <Link 
                to={`tel:${DevAccountConfig.dev_phone}`}
                >
                <Button 
                startIcon={<PhoneOutlined/>}
                variant="outlined"
                disableElevation
                sx={{ 
                  fontSize:'small', 
                  textTransform:'capitalize',
                  p:1
                  
                }}
                >Call Our Support Team
                </Button>
                </Link>
      
                <Link
                target="_blank_"
                  to={`mailto:[${DevAccountConfig.dev_email_1}]`}>
                <Button 
                startIcon={<EmailOutlined/>}
                variant="outlined"
                disableElevation
                sx={{ 
                  fontSize:'small',
                  textTransform:'capitalize',
                  p:1,
                
                }}
                >Email Our Support Team
                </Button>
                </Link>
              </Box>
          )}

          {/* display recommendation */}
          {isRecommend && (
            <RecommendStepper/>
          )}

          {/* display premium */}
          {isPremium && (
            <React.Fragment>

           {isChekout ? (
           <React.Fragment>
            <Box display={'flex'} gap={2} flexDirection={'column'} justifyContent={'center'} width={'100%'}>
            {/* helper text */}
            <Box display={'flex'} justifyContent={'center'} maxWidth={400}>
            <FormHelperText>You are about to upgrade to a premium plan costing ${premiumOption}. Choose your supported payment method to complete the transaction.</FormHelperText>
            </Box>
            <Box  gap={1} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
            {/* m-pesa payment */}
              <Button size="small">
                <Stack gap={1} >
                  <Avatar alt="" src={MpesaLogo} variant="rounded" />
                  <Typography
                    variant="caption"
                    color={"text.secondary"}
                    fontWeight={"bold"}
                  >
                    Mpesa
                  </Typography>
                </Stack>
              </Button>

              {/* Paypal payment */}
              <Button size="small">
                <Stack gap={1} >
                  <Avatar alt="" src={PaypalLogo} variant="rounded" />
                  <Typography
                    variant="caption"
                    color={"text.secondary"}
                    fontWeight={"bold"}
                  >
                    Paypal
                  </Typography>
                </Stack>
              </Button>

              {/* Google payment */}
              <Button size="small">
                <Stack gap={1} >
                  <Avatar alt="" src={GoogleLogo} variant="rounded" />
                  <Typography
                    variant="caption"
                    color={"text.secondary"}
                    fontWeight={"bold"}
                  >
                    GPay
                  </Typography>
                </Stack>
              </Button>

              {/* Stripe Payment */}
              <Button size="small">
                <Stack gap={1} >
                  <Avatar alt="" src={StripeLogo} variant="rounded" />
                  <Typography
                    variant="caption"
                    color={"text.secondary"}
                    fontWeight={"bold"}
                  >
                    Stripe
                  </Typography>
                </Stack>
              </Button>
            </Box>
            </Box>
           </React.Fragment>
           ):(
            <React.Fragment>
             <ol style={{ marginTop:4 }}>
            {PremiumData.map(data=>(
              <Typography 
              variant="body2"
              key={data}
              maxWidth={400}
              gutterBottom
              component={'li'}>
                {data}
              </Typography>
            ))}
            </ol>

            <Box
            display={'flex'} 
            alignItems={'center'}
            flexWrap={'wrap'}
            justifyContent={'center'}
            gap={2}
            >

            {/* 1 dollars weekly */}
              <Button 
                startIcon={<StarBorderRounded/>}
                onClick={(e)=>setPremiumOption(1)}
                variant={premiumOption===1 ? 'contained':'outlined'}
                color="secondary"
                sx={{ 
                  fontSize:'small',
                  textTransform:'capitalize',
                  p:1,
                  borderRadius:'10px',
                  fontWeight:'bold',
                  border:'1px solid',
                  borderColor:'divider'
                
                }}
                >
                $1 for 7 Days
                </Button>

                {/* 2 dollars 21 days */}
                <Button 
                startIcon={<StarHalfRounded/>}
                variant={premiumOption===2 ? 'contained':'outlined'}
                color="secondary"
                onClick={(e)=>setPremiumOption(2)}
                sx={{ 
                  fontSize:'small',
                  textTransform:'capitalize',
                  p:1,
                  borderRadius:'10px',
                  fontWeight:'bold'
                
                }}
                >
                $2 For 21 Days
                </Button>

              
              {/* 3 dollars monthly */}
               <Button 
                startIcon={<GradeRounded/>}
                onClick={(e)=>setPremiumOption(3)}
                variant={premiumOption===3 ? 'contained':'outlined'}
                color="secondary"
                sx={{ 
                  fontSize:'small',
                  textTransform:'capitalize',
                  p:1,
                  borderRadius:'10px',
                  fontWeight:'bold'
                
                }}
                >
               $3 For 30 Days
                </Button>
            </Box>

        </React.Fragment>
           )}

            </React.Fragment>
          )}

          </Box>
        </DialogContent>

        <DialogActions>

         {/* continue btn for checkout in premium */}
        {isPremium && !isChekout && (
           <Button 
          color={isPremium ? "secondary":"primary"}
          size="small"
          variant="outlined"
          endIcon={<NavigateNext/>}
          onClick={handleCheckOut} 
          sx={{ borderRadius:4, fontWeight:'bold',mr:5 }}>
          Continue ${premiumOption}
          </Button>
        )}
    
        {/* back btn restores plan selection */}
        {isChekout && (
          <Button 
          color={isPremium ? "secondary":"primary"}
          size="small"
          onClick={handleCheckOut} 
          sx={{ borderRadius:4 }}>
          Back
          </Button>
        )}

        {/* close dialog btn */}
          <Button 
          color={isPremium ? "secondary":"primary"}
          size="small"
          onClick={handleClose} 
          sx={{ borderRadius:4 }}>
          Close
          </Button>

       
        </DialogActions>
      </Dialog>
  );
}
