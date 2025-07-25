import {
  Add,
  AndroidRounded,
  Apple,
  BookmarkAddRounded,
  LinkRounded,
  VerifiedRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Kotlin from "../../../images/Kotlin.png";
import Dev from "../../../images/dev.jpeg";
import "../Events.css";

function LiveLayout() {
  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'



  return (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <Card
          elevation={0}
          className="rounded shadow mb-4"
          sx={{ maxWidth: 500, padding: "0 2px" }}
        >
          <CardContent>
            {isDarkMode ? (
              <>
                {/* DARK MODE */}

                <Box className="container-live-header-night">
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <VerifiedRounded
                      color="primary"
                      sx={{
                        width: 20,
                        height: 20,
                        padding: "2px",
                      }}
                    />
                  </Box>
                  <Typography
                    gutterBottom
                    variant="body1"
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ color: isDarkMode ? "#90CAF9" : "steelblue" }}
                  >
                    Machine Learning Event
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    color={"text.secondary"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    General Adverserial Networks (GANs)
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    textTransform={"capitalize"}
                    sx={{ color: "text.secondary" }}
                  >
                    500 Users have Bookmarked
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
                  className="fw-medium"
                  sx={{ color: "text.secondary" }}
                >
                  Topics Being Covered :
                </Typography>

                {/* topics section */}
                <Box pt={1}>
                  <ul>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      General Adverserial Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Generators Concepts
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Discriminators Concept
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Project Implementation
                    </Typography>
                  </ul>
                </Box>

                {/* instructor section */}

                <Typography
                  variant="body2"
                  className="fw-medium"
                  sx={{ color: "text.secondary" }}
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
                            Mark Zuckerberg <LinkRounded />
                          </Typography>
                          <Typography
                            textTransform={"capitalize"}
                            variant="caption"
                            className="fw-medium"
                          >
                            CEO, ML/AI Engineer at Facebook Meta
                          </Typography>
                        </Box>
                      </Typography>
                    </Link>
                  </Typography>
                </Box>

                <Box display={"flex"} justifyContent={"center"} pt={3}>
                  <Button
                    disableElevation
                    className="w-75 rounded-5 align-items-center fw-bold"
                    type="submit"
                    variant="outlined"
                    sx={{ borderRadius: "20px" }}
                    size="small"
                    endIcon={<BookmarkAddRounded />}
                  >
                    Bookmark this Event
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* LIGHT MODE */}

                <Box className="container-live-header-light">
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <VerifiedRounded
                      color="primary"
                      sx={{
                        width: 20,
                        height: 20,
                        padding: "2px",
                      }}
                    />
                  </Box>
                  <Typography
                    gutterBottom
                    variant="body1"
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ color: isDarkMode ? "#90CAF9" : "steelblue" }}
                  >
                    Machine Learning Event
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    color={"text.secondary"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    General Adverserial Networks (GANs)
                  </Typography>

                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    textTransform={"capitalize"}
                    sx={{ color: "text.secondary" }}
                  >
                    500 Users have Bookmarked
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
                  Welcome to the world of Machine Learning and Artificial
                  Intelligence.Learn the core concepts of General Adverserial
                  Networks from experienced ML/AI Engineer.
                </Typography>

                <Typography
                  variant="body2"
                  className="fw-medium"
                  sx={{ color: "text.secondary" }}
                >
                  Topics Being Covered :
                </Typography>

                {/* topics section */}
                <Box pt={1}>
                  <ul>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      General Adverserial Basics
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      component={"li"}
                    >
                      Generators Concepts
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Discriminators Concept
                    </Typography>

                    <Typography
                      variant="body2"
                      component={"li"}
                      sx={{ color: "text.secondary" }}
                    >
                      Project Implementation
                    </Typography>
                  </ul>
                </Box>

                {/* instructor section */}

                <Typography
                  variant="body2"
                  className="fw-medium"
                  sx={{ color: "text.secondary" }}
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
                            Mark Zuckerberg <LinkRounded />
                          </Typography>
                          <Typography
                            textTransform={"capitalize"}
                            variant="caption"
                            className="fw-medium"
                          >
                            CEO, ML/AI Engineer at Facebook Meta
                          </Typography>
                        </Box>
                      </Typography>
                    </Link>
                  </Typography>
                </Box>

                <Box display={"flex"} justifyContent={"center"} pt={3}>
                  <Button
                    disableElevation
                    className="w-75 rounded-5 align-items-center fw-bold"
                    type="submit"
                    size="small"
                    sx={{ borderRadius: "20px" }}
                    variant="outlined"
                    startIcon={<BookmarkAddRounded />}
                  >
                    Bookmark this Event
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* border at darkly */}
      {isDarkMode && <Divider component={"div"} className="mb-4" />}
    </>
  );
}

export default LiveLayout;
