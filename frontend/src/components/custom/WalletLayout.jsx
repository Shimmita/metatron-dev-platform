import { Add, ArrowLeft, ArrowRight, Close, Remove } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import GoogleLogo from "../../images/google.png";
import MpesaLogo from "../../images/mpesa.png";
import PaypalLogo from "../../images/paypal2.png";
import PayTm from "../../images/paytm.png";
import StripeLogo from "../../images/stripe.jpeg";
import VisaCard from "../../images/visa.png";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import TableTransactions from "./TableTransactions";

const WalletLayout = () => {
  const [openTrans, setOpenTrans] = useState(false);
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [isWithDraw, setIsOpenWithDraw] = useState(false);

  const handleDepost = () => {
    setOpenTrans(true);
    // yes deposit
    setIsOpenDeposit(true);
    // close withdrwa
    setIsOpenWithDraw(false);
  };

  const handleWithdrawal = () => {
    setOpenTrans(true);
    // yes withdraw
    setIsOpenWithDraw(true);
    // close deposit
    setIsOpenDeposit(false);
  };

  return (
    <Stack
      gap={2}
      width={"100%"}
      className={!CustomDeviceIsSmall() && "shadow"}
      p={CustomDeviceIsSmall() ? undefined : 2}
      maxHeight={CustomDeviceSmallest() ? "65vh" : "70vh"}
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
      {/* balance */}
      <Stack gap={2}>
        <Typography
          textAlign={"center"}
          gutterBottom
          variant="body1"
          fontWeight={"bold"}
        >
          Account Wallet
        </Typography>
        <Typography
          textAlign={"center"}
          variant="body1"
          color={"text.secondary"}
          fontWeight={"bold"}
        >
          USD $5,000.00
        </Typography>

        {openTrans ? (
          <React.Fragment>
            {/* transaction fields */}
            <Collapse in={openTrans}>
              <Alert
                variant="standard"
                className="rounded"
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenTrans(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <form>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Typography
                      variant="body2"
                      textAlign={"center"}
                      gutterBottom
                      mb={1}
                      fontWeight={"bold"}
                      color={"text.secondary"}
                    >
                      Amount to Deposit (USD)
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                    alignItems={"center"}
                  >
                    <TextField
                      label={<Typography variant="caption">amount</Typography>}
                      placeholder="50"
                      sx={{ width: "30%" }}
                      variant="standard"
                      type="number"
                      required
                    />
                  </Box>

                 {/* payment option */}
                <Box mt={3} width={"100%"}>
                  <Typography
                    gutterBottom
                    textAlign={"center"}
                    variant="body2"
                    fontWeight={"bold"}
                    color={"text.secondary"}
                  >
                    Payment Method
                  </Typography>

                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                  >
                    <ArrowLeft sx={{ width: 17, height: 17 }} />
                    <Typography variant="caption" color={"text.secondary"}>
                      scroll
                    </Typography>
                    <ArrowRight sx={{ width: 17, height: 17 }} />
                  </Box>
                </Box>

                <Box width={"100%"}>
                  <Box
                    mt={1}
                    display={"flex"}
                    justifyContent={"space-between"}
                    maxWidth={"98%"}
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
                    {/* card payment */}
                    <Button size="small">
                      <Stack gap={1} className="border-bottom border-dark p-1">
                        <Avatar alt="" src={VisaCard} variant="rounded" />
                        <Typography
                          variant="caption"
                          color={"text.secondary"}
                          fontWeight={"bold"}
                        >
                          Card
                        </Typography>
                      </Stack>
                    </Button>

                    {/* mpesa payment */}
                    <Button size="small">
                      <Stack gap={1}>
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
                      <Stack gap={1}>
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
                      <Stack gap={1}>
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
                      <Stack gap={1}>
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

                    {/* payTM payment */}
                    <Button size="small">
                      <Stack gap={1}>
                        <Avatar alt="" src={PayTm} variant="rounded" />
                        <Typography
                          variant="caption"
                          color={"text.secondary"}
                          fontWeight={"bold"}
                        >
                          PayTM
                        </Typography>
                      </Stack>
                    </Button>
                  </Box>
                </Box>

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                    mt={2}
                    mb={2}
                  >
                    <Button
                      type="submit"
                      variant="outlined"
                      className="rounded-5 100"
                      sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                    >
                      Request Payment Now{" "}
                    </Button>
                  </Box>
                </form>
              </Alert>
            </Collapse>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* buttons deposit and withdraw */}
            <Box
              display={"flex"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
              ml={2}
            >
              <Button
                startIcon={<Add />}
                onClick={handleDepost}
                size="small"
                sx={{
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Deposit
              </Button>

              <Button
                endIcon={<Remove />}
                size="small"
                onClick={handleWithdrawal}
                color="success"
                sx={{
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Withdraw
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Stack>
      {/* divider */}
      <Divider component={"div"} className="p-1" />

      {/* recent transactions */}
      <Stack gap={2}>
        <Box>
          <Typography
            textAlign={"center"}
            gutterBottom
            variant="body1"
            fontWeight={"bold"}
          >
            Recent Transactions
          </Typography>
          <Box display={"flex"} justifyContent={"center"} mb={1}>
            <Typography
              variant="caption"
              color={"text.secondary"}
              fontWeight={"bold"}
            >
              {" "}
              Currency (USD)
            </Typography>
          </Box>
        </Box>

        {/* table of transactions */}
        <TableTransactions />
      </Stack>
    </Stack>
  );
};

export default WalletLayout;
