import {
  EmailOutlined,
  GradeRounded,
  NavigateNext,
  PhoneOutlined,
  StarBorderRounded,
  StarHalfRounded,
  Close
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  FormHelperText,
  Stack,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import GoogleLogo from "../../images/google.png";
import MpesaLogo from "../../images/mpesa.png";
import PaypalLogo from "../../images/paypal2.png";
import StripeLogo from "../../images/stripe.jpeg";

import DevAccountConfig from "../config/DevAccountConfig";
import RecommendStepper from "../custom/RecommendStepper";
import PremiumData from "../data/PremiumData";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";

export default function AlertForYou({
  openAlertGeneral,
  title,
  message,
  defaultIcon,
  isRecommend = false,
  isPremium = false,
  isHelp = false,
  handleCloseAll,
}) {
  const [premiumOption, setPremiumOption] = useState(3);
  const [isCheckout, setIsCheckOut] = useState(false);

  const handleClose = () => handleCloseAll();
  const handleCheckOut = () => setIsCheckOut((prev) => !prev);

  return (
    <Dialog
      open={openAlertGeneral}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" gap={1} alignItems="center">
          {defaultIcon}
          <Typography fontWeight={600}>{title}</Typography>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <DialogContent>
        {/* MESSAGE */}
        {message && (
          <Typography fontSize={13} color="text.secondary" mb={2}>
            {message}
          </Typography>
        )}

        {/* HELP */}
        {isHelp && (
          <Stack spacing={1} alignItems="center">
            <Button
              startIcon={<PhoneOutlined />}
              variant="outlined"
              component={Link}
              to={`tel:${DevAccountConfig.dev_phone}`}
              fullWidth
            >
              Call Support
            </Button>

            <Button
              startIcon={<EmailOutlined />}
              variant="outlined"
              component={Link}
              to={`mailto:${DevAccountConfig.dev_email_1}`}
              fullWidth
            >
              Email Support
            </Button>
          </Stack>
        )}

        {/* RECOMMEND */}
        {isRecommend && <RecommendStepper />}

        {/* PREMIUM */}
        {isPremium && (
          <>
            {!isCheckout ? (
              <>
                {/* FEATURES */}
                <Box mb={2}>
                  <Typography fontWeight={600} mb={1}>
                    Premium Benefits
                  </Typography>

                  <Stack spacing={0.5}>
                    {PremiumData.map((item) => (
                      <Typography key={item} fontSize={13}>
                        • {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                {/* PLANS */}
                <Stack spacing={1}>
                  <Button
                    startIcon={<StarBorderRounded />}
                    variant={premiumOption === 1 ? "contained" : "outlined"}
                    onClick={() => setPremiumOption(1)}
                  >
                    $1 / 7 Days
                  </Button>

                  <Button
                    startIcon={<StarHalfRounded />}
                    variant={premiumOption === 2 ? "contained" : "outlined"}
                    onClick={() => setPremiumOption(2)}
                  >
                    $2 / 21 Days
                  </Button>

                  <Button
                    startIcon={<GradeRounded />}
                    variant={premiumOption === 3 ? "contained" : "outlined"}
                    onClick={() => setPremiumOption(3)}
                  >
                    $3 / 30 Days
                  </Button>
                </Stack>

                <Button
                  fullWidth
                  sx={{
                    mt: 2,
                    background:
                      "linear-gradient(135deg,#0FA88F,#14D2BE)",
                    color: "#fff",
                  }}
                  endIcon={<NavigateNext />}
                  onClick={handleCheckOut}
                >
                  Continue ${premiumOption}
                </Button>
              </>
            ) : (
              <>
                {/* CHECKOUT */}
                <Typography fontSize={13} mb={2}>
                  Select payment method for ${premiumOption}
                </Typography>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2,1fr)"
                  gap={1.5}
                >
                  {[MpesaLogo, PaypalLogo, GoogleLogo, StripeLogo].map(
                    (logo, i) => (
                      <Button key={i} variant="outlined">
                        <Stack alignItems="center">
                          <Avatar src={logo} variant="rounded" />
                          <Typography fontSize={11}>
                            {["Mpesa", "Paypal", "GPay", "Stripe"][i]}
                          </Typography>
                        </Stack>
                      </Button>
                    )
                  )}
                </Box>

                <Button onClick={handleCheckOut} sx={{ mt: 2 }}>
                  Back
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>

      {/* FOOTER */}
      <Box px={2} pb={2}>
        <Button fullWidth onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
}