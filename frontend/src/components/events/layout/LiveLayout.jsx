import {
  Add,
  AndroidRounded,
  Apple,
  LinkRounded,
  LiveTvRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Kotlin from "../../../images/Kotlin.png";
import Dev from "../../../images/dev.jpeg";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
import "../Events.css";

function LiveLayout() {
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const navigate = useNavigate();
  // handle navigation to the live atttend
  const handleNavigateLiveAttend = () => {
    navigate("/events/live-attending");
  };

  return (
    <React.Fragment>
      <Box display={"flex"} justifyContent={"center"}>
        <Card
          elevation={0}
          className={
            CustomDeviceIsSmall() || CustomDeviceTablet()
              ? "shadow rounded"
              : "rounded"
          }
          sx={{
            maxWidth: 500,
            padding: "0 2px",
            border:
              (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
                ? "1px solid"
                : "1px solid",
            borderColor:
              (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
                ? "divider"
                : "divider",

            mb: 3,
          }}
        >
          <CardContent>
            {isDarkMode ? (
              <React.Fragment>
                {/* DARK MODE */}

                <Box className="container-live-header-night">
                  <Typography
                    gutterBottom
                    mt={1}
                    variant="body1"
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ color: isDarkMode ? "#90CAF9" : "steelblue" }}
                  >
                    software development event
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    color={"text.secondary"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    Kotlin Multiplatform (KMP)
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    sx={{ color: "text.secondary" }}
                  >
                    18:00 - 20:00 | 15/09/2024
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    sx={{ color: "text.secondary" }}
                  >
                    500 Users Livestreaming
                  </Typography>
                  {/* icon*/}
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                    p={1}
                  >
                    <Avatar
                      sx={{ width: 26, height: 26 }}
                      src={Kotlin}
                      alt="icon"
                      variant="rounded"
                    />
                    <AndroidRounded
                      color="success"
                      sx={{ width: 30, height: 30 }}
                    />
                    <Add />
                    <Apple color="inherit" sx={{ width: 25, height: 25 }} />
                  </Box>
                </Box>

                <Typography
                  pt={1}
                  variant="body2"
                  gutterBottom
                  sx={{ color: "text.secondary" }}
                >
                  Join the meeting and meet certified and profesional Kotlin
                  developers undertaking you through cross-platform mobile app
                  development.
                </Typography>

                <Typography
                  variant="body2"
                  color={"text.secondary"}
                  fontWeight={"bold"}
                >
                  Topics Being Addressed :
                </Typography>

                {/* topics section */}
                <Box pt={1}>
                  <ul>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Android Studio Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Kotlin Multiplatform Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      DevOps using Jenkins CI/CD
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Basics of Delight Database
                    </Typography>
                  </ul>
                </Box>

                {/* instructor section */}

                <Typography
                  variant="body2"
                  color={"text.secondary"}
                  fontWeight={"bold"}
                >
                  Chief Event Instructor :
                </Typography>

                <Box pt={1} pl={1}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                    fontWeight={"bold"}
                  >
                    <Link to={""} className="text-decoration-none ">
                      <Box
                        variant="body2"
                        gap={1}
                        alignItems={"center"}
                        display={"flex"}
                      >
                        <Box>
                          <Avatar src={Dev} alt="logo" />
                        </Box>

                        <Box>
                          <Typography
                            textTransform={"uppercase"}
                            variant="body2"
                            display={"flex"}
                            alignItems={"center"}
                            color={"primary"}
                            gap={1}
                            fontWeight={"bold"}
                          >
                            Godrick Altman <LinkRounded />
                          </Typography>
                          <Typography
                            textTransform={"capitalize"}
                            variant="caption"
                            color={"text.secondary"}
                            className="fw-medium"
                          >
                            Software Dev at Melian Chronicles
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                  </Typography>
                </Box>

                <Box display={"flex"} justifyContent={"center"} pt={3}>
                  <Button
                    disableElevation
                    className="fw-bold pt-1"
                    type="submit"
                    color="success"
                    variant="outlined"
                    sx={{ borderRadius: "20px" }}
                    onClick={handleNavigateLiveAttend}
                    startIcon={
                      <LiveTvRounded
                        color="warning"
                        sx={{ width: 20, height: 20 }}
                      />
                    }
                  >
                    Join Meeting Now
                  </Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* LIGHT MODE */}
                <Box className="container-live-header-light">
                  <Typography
                    gutterBottom
                    variant="body1"
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ color: isDarkMode ? "#90CAF9" : "steelblue" }}
                  >
                    software development event
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    color={"text.secondary"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    Kotlin Multiplatform (KMP)
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    sx={{ color: "text.secondary" }}
                  >
                    18:00 - 20:00 | 15/09/2024
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    sx={{ color: "text.secondary" }}
                  >
                    500 Users Livestreaming
                  </Typography>
                  {/* icon*/}
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                    p={1}
                  >
                    <Avatar
                      sx={{ width: 26, height: 26 }}
                      src={Kotlin}
                      alt="icon"
                      variant="rounded"
                    />
                    <AndroidRounded
                      color="success"
                      sx={{ width: 30, height: 30 }}
                    />
                    <Add />
                    <Apple color="inherit" sx={{ width: 25, height: 25 }} />
                  </Box>
                </Box>

                <Typography
                  pt={1}
                  variant="body2"
                  gutterBottom
                  sx={{ color: "text.secondary" }}
                >
                  Join the meeting and meet certified and profesional Kotlin
                  developers undertaking you through cross-platform mobile app
                  development.
                </Typography>

                <Typography
                  variant="body2"
                  color={"text.secondary"}
                  fontWeight={"bold"}
                >
                  Topics Being Addressed:
                </Typography>

                {/* topics section */}
                <Box pt={1}>
                  <ul>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Android Studio Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Kotlin Multiplatform Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      DevOps using Jenkins CI/CD
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Basics of Delight Database
                    </Typography>
                  </ul>
                </Box>

                {/* instructor section */}

                <Typography
                  variant="body2"
                  color={"text.secondary"}
                  fontWeight={"bold"}
                >
                  Chief Event Instructor :
                </Typography>

                <Box pt={1} pl={1}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                    fontWeight={"bold"}
                  >
                    <Link
                      to={""}
                      className="text-decoration-none instructor-link"
                    >
                      <Typography
                        color={"text.secondary"}
                        variant="body2"
                        gap={1}
                        fontWeight={"bold"}
                        alignItems={"center"}
                        display={"flex"}
                      >
                        <Box>
                          <Avatar src={Dev} alt="logo" />
                        </Box>

                        <Box>
                          <Typography
                            textTransform={"uppercase"}
                            variant="body2"
                            display={"flex"}
                            alignItems={"center"}
                            gap={1}
                            fontWeight={"bold"}
                          >
                            Godrick Altman <LinkRounded />
                          </Typography>
                          <Typography
                            textTransform={"capitalize"}
                            variant="caption"
                            className="fw-medium"
                          >
                            Software Dev at Melian Chronicles
                          </Typography>
                        </Box>
                      </Typography>
                    </Link>
                  </Typography>
                </Box>

                <Box display={"flex"} justifyContent={"center"} pt={3}>
                  <Button
                    disableElevation
                    className="fw-bold pt-1"
                    type="submit"
                    color="success"
                    variant="outlined"
                    sx={{ borderRadius: "20px" }}
                    onClick={handleNavigateLiveAttend}
                    startIcon={
                      <LiveTvRounded
                        color="warning"
                        sx={{ width: 20, height: 20 }}
                      />
                    }
                  >
                    Join Meeting Now
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
}

export default LiveLayout;
