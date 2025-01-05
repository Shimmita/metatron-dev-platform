import {
    ArrowLeft,
    ArrowRight,
    Close,
    FavoriteRounded,
    GitHub,
    PaidRounded,
    WorkspacePremiumRounded,
} from "@mui/icons-material";
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
import { Link } from "react-router-dom";
import GoogleLogo from "../../images/google.png";
import MpesaLogo from "../../images/mpesa.png";
import PaypalLogo from "../../images/paypal2.png";
import PayTm from "../../images/paytm.png";
import StripeLogo from "../../images/stripe.jpeg";
import VisaCard from "../../images/visa.png";

import { useSelector } from "react-redux";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import SponsorTeamLayout from "./SponsorTeamLayout";

const SponsorshipLayout = ({ isSponsorTeam, setIsSponsorTeam }) => {
  const [isDonate, setIsDonate] = useState(false);
  // global  state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  // handle when user clicks donate button
  const handleShowDonate = () => {
    setIsDonate((prev) => !prev);
  };

  //handle showing of the sponsors
  const handleShowSponsors = () => {
    setIsSponsorTeam(true);
  };

  const items = Array.from({ length: 20 });

  return (
    <Stack gap={2}>
      {isSponsorTeam ? (
        <React.Fragment>
          <Box>
            <Typography variant="body2" color={"text.secondary"}>
              The following are our esteemed sponsors.
              <span className="text-success"> Congrats!</span>
            </Typography>
          </Box>
          <Box height={"35vh"}>
            <Box
              maxHeight={"35vh"}
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
              {items.map((val, index) => (
                <SponsorTeamLayout key={index} />
              ))}
            </Box>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {isDonate ? (
            <React.Fragment>
              {/* transaction fields */}
              <Collapse in={isDonate}>
                <Alert
                  variant="standard"
                  className="rounded"
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleShowDonate}
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
                        Amount (USD)
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      width={"100%"}
                      alignItems={"center"}
                    >
                      <TextField
                        placeholder="1"
                        variant="outlined"
                        label="Amount $"
                        type="number"
                        fullWidth
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
                          <Stack
                            gap={1}
                            className="border-bottom border-dark p-1"
                          >
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
                    >
                      <Button
                        type="submit"
                        variant="outlined"
                        className="rounded-5 100"
                        sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                      >
                        {CustomDeviceSmallest() ? "Donate" : "Donate Now"}
                      </Button>
                    </Box>
                  </form>
                </Alert>
              </Collapse>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* github contribution */}
              <Stack gap={1}>
                <Box display={"flex"} justifyContent={"center"}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    gap={2}
                    alignItems={"center"}
                  >
                    <GitHub sx={{ width: 18, height: 18 }} />{" "}
                    <Typography variant="body2" fontWeight={"bold"}>
                      GitHub Contribution
                    </Typography>
                  </Box>
                </Box>

                {/* details of github contribution */}
                <Box>
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    gutterBottom
                  >
                    Developers are welcomed to contribute to our GitHub{" "}
                    <Link
                      to={""}
                      style={{
                        textDecoration: "none",
                        color: isDarkMode ? "  #87BDE9" : "  #1876D2",
                      }}
                    >
                      repository
                    </Link>
                    . When approved our technical team will reach out for
                    appreciation and get you enlisted to our GitHub team program
                    for recognition.
                  </Typography>
                </Box>

                {/* check our sponsorship */}
                <Box>
                  <Button
                    size="small"
                    startIcon={
                      <WorkspacePremiumRounded sx={{ width: 18, height: 18 }} />
                    }
                    endIcon={
                      <WorkspacePremiumRounded
                        ssx={{ width: 15, height: 15 }}
                      />
                    }
                    disableElevation
                    onClick={handleShowSponsors}
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",

                      borderRadius: "20px",
                    }}
                  >
                    Our GitHub Team
                  </Button>
                </Box>
              </Stack>

              {/* divider */}
              <Divider component={"div"} className="p-1" />

              {/* funding */}
              <Stack gap={1}>
                <Box display={"flex"} justifyContent={"center"}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    gap={2}
                    alignItems={"center"}
                  >
                    <PaidRounded sx={{ width: 20, height: 20 }} />{" "}
                    <Typography variant="body2" fontWeight={"bold"}>
                      Donation Program
                    </Typography>
                  </Box>
                </Box>

                {/* details of github contribution */}
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    You can promote us in our affiliate program through
                    donation. When your donation is successful you will be
                    enlisted in the affiliate program for appreciation from as
                    little as $1 US Dollar contribution. All are welcomed
                    globally.
                    <Button
                      size="small"
                      onClick={handleShowDonate}
                      disableElevation
                      variant="contained"
                      startIcon={
                        <FavoriteRounded sx={{ width: 10, height: 10 }} />
                      }
                      endIcon={
                        <FavoriteRounded sx={{ width: 10, height: 10 }} />
                      }
                      className={
                        CustomDeviceSmallest() ? "rounded-5" : "rounded-5 ms-2"
                      }
                      sx={{
                        fontSize: "smaller",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      Donate
                    </Button>
                  </Typography>
                </Box>

                {/* check our sponsorship */}
                <Box mt={1}>
                  <Button
                    size="small"
                    startIcon={
                      <FavoriteRounded sx={{ width: 15, height: 15 }} />
                    }
                    endIcon={<FavoriteRounded sx={{ width: 15, height: 15 }} />}
                    disableElevation
                    onClick={handleShowSponsors}
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",

                      borderRadius: "20px",
                    }}
                  >
                    sponsorship team
                  </Button>
                </Box>
              </Stack>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Stack>
  );
};

export default SponsorshipLayout;
