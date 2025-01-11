import {
  AndroidRounded,
  Apple,
  Close,
  CloudUploadRounded,
  CodeRounded,
  DrawRounded,
  EditRounded,
  GradeRounded,
  LaptopRounded,
  LinkRounded,
  Microsoft,
  MonetizationOnRounded,
  SchoolRounded,
  SettingsRounded,
  SportsEsportsRounded,
  StorageRounded,
  Title,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LinuxLogo from "../../images/linux.jpeg";
import AppLogo from "../../images/logo_sm.png";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";
import { getImageMatch } from "../utilities/getImageMatch";

// styled modal
const StyledModalPost = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

// styled input
const StyledInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// array for image names and values
const [logoNamesOptions, logoValueOptions] = getImageMatch("", true);

const PostCourseModal = ({ openModalCourse, setOpenModalCourse }) => {
  const [title, setTitle] = useState("");
  const [post_category, setPostCategory] = useState("");
  const [pro_language, setProgLanguage] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [database, setDatabase] = useState("");
  const [containerisation, setContainerisation] = useState("");
  const [desktop, setDesktop] = useState("");
  const [multiplatform, setMultiplatform] = useState("");
  const [ios_dev, setIOSDev] = useState("");
  const [android, setAndroid] = useState("");
  const [designTool, setDesignTool] = useState("");
  const [game_dev, setGameDev] = useState("");
  const [devops_tool, setDevOpsTool] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [videoFullUpload, setVideoFullUpload] = useState(null);
  const [videoFullLink, setVideoFullLink] = useState("");
  const [videoIntroUpload, setVideoIntroUpload] = useState(null);
  const [videoIntroLink, setVideoIntroLink] = useState("");
  const [videoBrochureUpload, setVideoBrochureUpload] = useState(null);
  const [videoBrochureLink, setVideoBrochureLink] = useState("");

  const [isVideoFullLink, setIsVideoFullLink] = useState(false);
  const [isVideoIntroLink, setIsVideoIntroLink] = useState(false);
  const [isBrochureLink, setIsBrochureLink] = useState(false);

  const [instructor_email, setInstructorEmail] = useState("");
  const [instructor_phone, setInstructorPhone] = useState("");

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);

  // handle full video when btn link clicked
  const handleFullVideoLink = () => {
    // clear video full upload if any
    setVideoFullUpload(null);
    // set true link video full
    setIsVideoFullLink(true);
  };

  // handle close of video full link
  const handleCloseVideoFullLink = () => {
    // clear
    setVideoFullLink("");
    // default showing of btn upload and link for video full
    setIsVideoFullLink(false);
  };

  // handle video intro when btn link clicked
  const handleVideoIntroLink = () => {
    // clear video upload if any
    setVideoIntroUpload(null);

    // set true link video intro
    setIsVideoIntroLink(true);
  };

  // handle close of video intro link when close icon clicked
  const handleCloseVideoIntroLink = () => {
    // clear
    setVideoIntroLink("");
    // default showing of btns upload and link for video intro
    setIsVideoIntroLink(false);
  };

  // handle Brochure when btn link clicked
  const handleBrochureLink = () => {
    // clear brochure upload if any
    setVideoBrochureUpload(null);
    //set true link brochure
    setIsBrochureLink(true);
  };

  // handle close of brochure when close icon is clicked
  const handleCloseBrochureLink = () => {
    // clear link
    setVideoBrochureLink("");
    // default showing of btns upload and link for  brochure
    setIsBrochureLink(false);
  };

  return (
    <StyledModalPost
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openModalCourse}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)
            ? "85%"
            : CustomDeviceTablet()
            ? "100%"
            : CustomLandscapeWidest()
            ? "50%"
            : "100%"
        }
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={5}
          className="shadow-lg"
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box>
              <Avatar sx={{ width: 60, height: 60 }} src={AppLogo} alt="logo" />
            </Box>

            {/*  button for posting */}
            <Button
              startIcon={<SchoolRounded />}
              className="w-50 rounded-5 shadow-sm"
              variant="contained"
              size="small"
            >
              Upload Course
            </Button>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalCourse(false)}>
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>{" "}
            </IconButton>
          </Box>

          <Box
            maxHeight={CustomModalHeight()}
            className="px-3"
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
            <Box display={"flex"} flexDirection={"column"} gap={3}>
              <Box mt={2}>
                <Typography
                  gutterBottom
                  mb={2}
                  textAlign={"center"}
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  Note: The course you are posting should be yours and not
                  someone's intellectual property!
                </Typography>

                {/* post title */}
                <Box
                  className="my-2"
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Title color="primary" sx={{ width: 30, height: 30 }} />
                </Box>

                <Typography variant="body2" mt={3} color={"text.secondary"}>
                  Provide a relevant course title that will be displayed to the
                  potential students on the platform. Its recommended to use
                  simple but captivating titles in this field.
                </Typography>

                <Box mt={4} className="w-100 mb-2">
                  <TextField
                    required
                    value={title}
                    error={title.length > 100}
                    label={`Title ${100 - title.length}`}
                    placeholder="Complete Python Course from Beginner to Advanced"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
              </Box>

              <Box display={"flex"} justifyContent={"center"}>
                <GradeRounded color="primary" sx={{ width: 30, height: 30 }} />
              </Box>

              {/* post about */}
              <Typography variant="body2" color={"text.secondary"}>
                Select the area of specialisation that you are interested in.
                Suppose your course is focused on concepts and fundamentals of a
                programming language, its recommended to select programming
                languages option.
              </Typography>

              <Box className="w-100 mb-2 mt-2 ">
                <TextField
                  required
                  select
                  value={post_category}
                  label="Course specialisation"
                  fullWidth
                  onChange={(e) => setPostCategory(e.target.value)}
                >
                  {SpecialisationTech &&
                    SpecialisationTech.filter((about) => about !== "None").map(
                      (about, index) => (
                        <MenuItem
                          key={index}
                          value={about}
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          {/* logo */}
                          <CourseIcon option={about} />

                          {/* name */}
                          <Typography variant="body2">{about}</Typography>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              {/* provide a logo for the course */}
              <Typography variant="body2" color={"text.secondary"}>
                Provide logo for the course. You can select the preferred version from the free kits already provided or upload from the 
              </Typography>
              <Box></Box>

              {/* programming Language */}
              {post_category === "Programming Languages" && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <CodeRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select the programming language which your course will be
                    addressing in particualar.
                  </Typography>

                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={pro_language}
                      label="Select Programming Language"
                      fullWidth
                      onChange={(e) => setProgLanguage(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Language.map((language) => (
                          <MenuItem key={language} value={language}>
                            <Typography variant="body2">{language}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* frontend */}
              {(post_category === "Frontend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <Box>
                  <Box mt={2} display={"flex"} justifyContent={"center"}>
                    <LaptopRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which frontend technology will your course be covering in
                    particular.If it is based on a bare HTML/CSS version, select
                    the option with (HTML/CSS).
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={frontend}
                      label="Frontend framework"
                      fullWidth
                      onChange={(e) => setFrontend(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Frontend.map((frontend) => (
                          <MenuItem key={frontend} value={frontend}>
                            <Typography variant="body2">{frontend}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* backend */}
              {(post_category === "Backend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <SettingsRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Which backend technology will your course be covering in
                    particular? Suppose none of the provided options matches
                    your preference select (other).
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={backend}
                      label="Backend Framework"
                      fullWidth
                      onChange={(e) => setBackend(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Backend.map((backend) => (
                          <MenuItem key={backend} value={backend}>
                            <Typography variant="body2">{backend}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Database */}
              {(post_category === "Database Administration (SQL/NoSQL)" ||
                post_category === "Backend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <StorageRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Which database in particular will your course make
                    utilisation of to facilitate storage of data? Suppose none
                    of the provided options matches your preference select
                    (other).
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={database}
                      label="Select Database"
                      fullWidth
                      onChange={(e) => setDatabase(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Database.map((database) => (
                          <MenuItem key={database} value={database}>
                            <Typography variant="body2">{database}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Desktop App */}
              {post_category === "Desktop App Development" && (
                <Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <Avatar alt="Linux" src={LinuxLogo} /> +
                    <Apple color="primary" sx={{ width: 30, height: 30 }} />+
                    <Microsoft color="primary" sx={{ width: 30, height: 30 }} />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select desktop development technology that your course will
                    be based on such that the overal application runs on either
                    Linux OS, MacOS, Windows OS or both.
                  </Typography>

                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={desktop}
                      label="select stack used"
                      fullWidth
                      onChange={(e) => setDesktop(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Desktop.map((desktop) => (
                          <MenuItem key={desktop} value={desktop}>
                            <Typography variant="body2">{desktop}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* DevOps */}
              {post_category === "Developer Operations (DevOps+CI/CD)" && (
                <Box>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select a DevOps Platform or Tool in question that your
                    course is meant to debunk and explore to your target
                    audience.
                  </Typography>
                  <Box className="w-100 mb-3 ">
                    <TextField
                      required
                      select
                      value={devops_tool}
                      label="DevOps platform/tool"
                      fullWidth
                      onChange={(e) => setDevOpsTool(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.DevOps.map((devops_tool) => (
                          <MenuItem key={devops_tool} value={devops_tool}>
                            <Typography variant="body2">
                              {devops_tool}
                            </Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Game dev */}
              {post_category === "Game App Development" && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <SportsEsportsRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select a game application development technology in
                    particular.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={game_dev}
                      label="game development technology"
                      fullWidth
                      onChange={(e) => setGameDev(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.GameDev.map((game_dev) => (
                          <MenuItem key={game_dev} value={game_dev}>
                            <Typography variant="body2">{game_dev}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* UI/UX  */}
              {post_category === "UI/UX Design/Graphic Design" && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <DrawRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select the UI/UX Design tool that you are covering in your
                    course.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={designTool}
                      label="design tool"
                      fullWidth
                      onChange={(e) => setDesignTool(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Design.map((design_tool) => (
                          <MenuItem key={design_tool} value={design_tool}>
                            <Typography variant="body2">
                              {design_tool}
                            </Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Android App */}
              {post_category === "Native Android App Development" && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <AndroidRounded
                      color="success"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Native Android application development stack is usually
                    based on Java or Kotlin. Select the stack that your course
                    make use of.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={android}
                      label="Android app development stack"
                      fullWidth
                      onChange={(e) => setAndroid(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Android.map((android) => (
                          <MenuItem key={android} value={android}>
                            <Typography variant="body2">{android}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* IOS App */}
              {post_category === "Native IOS App Development" && (
                <Box>
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Apple color="primary" sx={{ width: 30, height: 30 }} />
                  </Box>

                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Select the stack used in your course for the development of
                    Native IOS Application project/post
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={ios_dev}
                      label="IOS app development stack"
                      fullWidth
                      onChange={(e) => setIOSDev(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.IOS.map((ios) => (
                          <MenuItem key={ios} value={ios}>
                            <Typography variant="body2">{ios}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Multiplatform Android+IOS */}
              {post_category ===
                "Multiplatform App Development (Android+IOS)" && (
                <Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <Apple color="inherit" sx={{ width: 30, height: 30 }} /> +
                    <AndroidRounded
                      color="success"
                      sx={{ width: 34, height: 34 }}
                    />
                  </Box>

                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select a mobile multiplatform/cross-application development
                    technology that you are interested in. multiplatform
                    technology or frameworks allows writing of a single code
                    base that runs on both Android and IOS devices. Suppose none
                    of the provided options matches your preference select
                    (other).
                  </Typography>

                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={multiplatform}
                      label="Multiplatform framework"
                      fullWidth
                      onChange={(e) => setMultiplatform(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Multiplatfotm.map((multiplatform) => (
                          <MenuItem key={multiplatform} value={multiplatform}>
                            <Typography variant="body2">
                              {multiplatform}
                            </Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Containerisation  */}
              {post_category === "Containerisation and Orchestration" && (
                <>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which containerisation technology will be handled in the
                    course of study.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={containerisation}
                      label="Select containerisation technology"
                      fullWidth
                      onChange={(e) => setContainerisation(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Containerisation.map((container) => (
                          <MenuItem key={container} value={container}>
                            <Typography variant="body2">{container}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </>
              )}

              <Box>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  gap={1}
                  alignItems={"center"}
                >
                  <MonetizationOnRounded
                    color="success"
                    sx={{ width: 32, height: 32 }}
                  />{" "}
                </Box>

                <Typography variant="body2" mt={3} color={"text.secondary"}>
                  Provide price quotation for this course in (
                  <Typography component={"span"} variant="body2">
                    KES
                  </Typography>
                  ). The price should lie between 1k to 5k. Metatron Charges 40%
                  of the total price for video lectures uploaded directly on the
                  platform from your local storage due to additional upload cost
                  of 10% including the certificate of completion. Video lectures
                  from external link sources such as MegaDrive, OneDrive or
                  GoogleDrive are charged at 30% because the upload cost is cut
                  by 10%. Currently, Acceptable external link sources for videos
                  are: MegaDrive, OneDrive, DropBox and GoogleDrive only. Share
                  the link of the recorded video lecture from the aforementioned
                  sites for better user interaction curated for these sites
                  only. N/B Certificate of completion is awarded to video
                  lectures from local storage upload and the acceptable external
                  sources only.
                </Typography>

                <Box mt={4} className="w-100 mb-2">
                  <TextField
                    required
                    value={price}
                    error={
                      price.length > 4 ||
                      (price.length < 4 && price.length !== 0) ||
                      parseInt(price[0]) > 5
                    }
                    label={`Price in KES (1k-5k)`}
                    placeholder="2500"
                    fullWidth
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Box>
              </Box>

              {/* full video lecture */}
              <Box mb={3}>
                <Box
                  className="my-2"
                  display={"flex"}
                  gap={3}
                  justifyContent={"center"}
                >
                  <CloudUploadRounded
                    color="primary"
                    sx={{ width: 30, height: 30 }}
                  />{" "}
                  or
                  <LinkRounded color="primary" sx={{ width: 30, height: 30 }} />
                </Box>

                <Typography
                  gutterBottom
                  variant="body2"
                  mt={3}
                  mb={3}
                  color={"text.secondary"}
                >
                  Upload full video lecture from local storage or provide a
                  video lecture link from an external source which should be
                  from the recommended sources only: Megadrive, OneDrive,
                  DropBox or GoogleDrive. Videos from local storage will cost
                  40% of the total price due to added upload cost of 10% while
                  those from external link sources 30%.
                </Typography>

                <Typography
                  textAlign={"center"}
                  variant="body2"
                  gutterBottom
                  color={"text.secondary"}
                >
                  Full video lecture
                </Typography>

                {videoFullUpload && (
                  <Typography
                    gutterBottom
                    textAlign={"center"}
                    variant="body2"
                    width={"100%"}
                    color={"text.secondary"}
                  >
                    {`${videoFullUpload.name}`.substring(0, 30)}...
                    {`${videoFullUpload.name}.`.split(".")[1]}
                  </Typography>
                )}

                {!isVideoFullLink ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      variant="outlined"
                      disableElevation
                      tabIndex={-1}
                      size="small"
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      startIcon={<CloudUploadRounded />}
                    >
                      Upload File
                      <StyledInput
                        type="file"
                        accept=".mp4, .mkv, .webp"
                        onChange={(event) =>
                          setVideoFullUpload(event.target.files[0])
                        }
                        multiple
                      />
                    </Button>
                    <Typography variant="body2" color={"text.secondary"}>
                      or
                    </Typography>

                    <Button
                      variant="outlined"
                      disableElevation
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      onClick={handleFullVideoLink}
                      size="small"
                      startIcon={<LinkRounded />}
                    >
                      External Link
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" mt={3} color={"text.secondary"}>
                      Provide the link or url pointing to your video full
                      lecture that is stored in the cloud storage:(Google Drive,
                      MegaDrive, DropBox or OneDrive).
                    </Typography>

                    <Box
                      mt={4}
                      className="w-100 mb-2"
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <TextField
                        required
                        type="url"
                        value={videoFullLink}
                        label={`Paste full video link`}
                        placeholder="https://...."
                        fullWidth
                        onChange={(e) => setVideoFullLink(e.target.value)}
                      />
                      {/* close button */}
                      <IconButton onClick={handleCloseVideoFullLink}>
                        <Tooltip title={"exit link"}>
                          <Close />
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>

              {/* intro video lecture */}
              <Box mb={3}>
                <Typography
                  gutterBottom
                  variant="body2"
                  mb={3}
                  color={"text.secondary"}
                >
                  Upload an introduction video which students can watch for free
                  before deciding to buy the full course. The video lecture
                  should be of length one minute maximum. Make it more
                  encompassing to convince your audience that this course is
                  what they have been looking for.
                </Typography>

                <Typography
                  textAlign={"center"}
                  variant="body2"
                  gutterBottom
                  color={"text.secondary"}
                >
                  Introduction video lecture
                </Typography>

                {videoIntroUpload && (
                  <Typography
                    gutterBottom
                    textAlign={"center"}
                    variant="body2"
                    width={"100%"}
                    color={"text.secondary"}
                  >
                    {`${videoIntroUpload.name}`.substring(0, 30)}...
                    {`${videoIntroUpload.name}.`.split(".")[1]}
                  </Typography>
                )}

                {!isVideoIntroLink ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      variant="outlined"
                      disableElevation
                      tabIndex={-1}
                      size="small"
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      startIcon={<CloudUploadRounded />}
                    >
                      Upload File
                      <StyledInput
                        type="file"
                        accept=".mp4, .mkv, .webp"
                        onChange={(event) =>
                          setVideoIntroUpload(event.target.files[0])
                        }
                        multiple
                      />
                    </Button>
                    <Typography variant="body2" color={"text.secondary"}>
                      or
                    </Typography>

                    <Button
                      variant="outlined"
                      disableElevation
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      onClick={handleVideoIntroLink}
                      size="small"
                      startIcon={<LinkRounded />}
                    >
                      External Link
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" mt={3} color={"text.secondary"}>
                      Provide the link or url pointing to your video
                      introduction lecture that is stored in the cloud
                      storage:(Google Drive, MegaDrive, DropBox or OneDrive).
                      Note: The intro video should be two minutes maximum
                      length.
                    </Typography>

                    <Box
                      mt={4}
                      className="w-100 mb-2"
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <TextField
                        required
                        type="url"
                        value={videoIntroLink}
                        label={`Paste video intro link`}
                        placeholder="https://...."
                        fullWidth
                        onChange={(e) => setVideoIntroLink(e.target.value)}
                      />
                      {/* close button */}
                      <IconButton onClick={handleCloseVideoIntroLink}>
                        <Tooltip title={"exit link"}>
                          <Close />
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>

              {/* video brochure */}
              <Box mb={3}>
                <Typography
                  gutterBottom
                  variant="body2"
                  mb={3}
                  color={"text.secondary"}
                >
                  Upload an image or pdf brochure for this course which can be
                  downloaded by any student freely. It should be a summarisation
                  of the overal lecture including: Topics covered, practical
                  projects done and lecture requirements if any. A good
                  captivating brochure could convince many target group of
                  individuals to buy your full course. Upload it from local
                  storage or from an external link: OneDrive, GoogleDrive,
                  MegaDrive or Dropbox
                </Typography>

                <Typography
                  gutterBottom
                  textAlign={"center"}
                  variant="body2"
                  color={"text.secondary"}
                >
                  Brochure for the lecture
                </Typography>

                {videoBrochureUpload && (
                  <Typography
                    gutterBottom
                    textAlign={"center"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    {`${videoBrochureUpload.name}`.substring(0, 30)}...
                    {`${videoBrochureUpload.name}.`.split(".")[1]}
                  </Typography>
                )}

                {/* show when not brochure link button clicked */}
                {!isBrochureLink ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <Button
                      component="label"
                      role={undefined}
                      variant="outlined"
                      disableElevation
                      tabIndex={-1}
                      size="small"
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      startIcon={<CloudUploadRounded />}
                    >
                      Upload File
                      <StyledInput
                        type="file"
                        accept="image/*, .pdf"
                        onChange={(event) =>
                          setVideoBrochureUpload(event.target.files[0])
                        }
                        multiple
                      />
                    </Button>
                    <Typography variant="body2" color={"text.secondary"}>
                      or
                    </Typography>

                    <Button
                      variant="outlined"
                      disableElevation
                      sx={{ textTransform: "lowercase", borderRadius: "20px" }}
                      onClick={handleBrochureLink}
                      size="small"
                      startIcon={<LinkRounded />}
                    >
                      External Link
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" mt={3} color={"text.secondary"}>
                      Provide the link or url pointing to the brochure of your
                      video lecture that is stored in the cloud storage:(Google
                      Drive, MegaDrive, DropBox or OneDrive). The brochure
                      should be an Image or PDF.
                    </Typography>

                    <Box
                      mt={4}
                      className="w-100 mb-2"
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <TextField
                        required
                        type="url"
                        value={videoBrochureLink}
                        label={`Paste brochure link`}
                        placeholder="https://...."
                        fullWidth
                        onChange={(e) => setVideoBrochureLink(e.target.value)}
                      />
                      {/* close button */}
                      <IconButton onClick={handleCloseBrochureLink}>
                        <Tooltip title={"exit link"}>
                          <Close />
                        </Tooltip>
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>

              {/* course verification and validation contacts  */}
              <Typography variant="body2" color={"text.secondary"} gutterBottom>
                Note: This course may be required to undergoe verification and
                validation processes before getting approved and published on
                the platform. Please provide contacts that will facilitate our
                techinical support team reaching out.
              </Typography>

              {/* Email */}
              <Box className="mb-3">
                <TextField
                  fullWidth
                  required
                  type="tel"
                  value={instructor_phone}
                  onChange={(e) => setInstructorPhone(e.target.value)}
                  id="phone"
                  label={"course chief instructor's phone"}
                  placeholder="+254723679865"
                />
              </Box>

              {/* Email */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  value={instructor_email}
                  onChange={(e) => setInstructorEmail(e.target.value)}
                  required
                  type="email"
                  id="email"
                  label={"Course chief instructor's email"}
                  placeholder="youremail@gmail.com"
                />
              </Box>

              <Box
                className="my-3"
                display={"flex"}
                gap={3}
                justifyContent={"center"}
              >
                <EditRounded color="primary" sx={{ width: 30, height: 30 }} />{" "}
              </Box>

              <Typography variant="body2" color={"text.secondary"}>
                Describe your course in details; explaining the important areas
                that your are going to tackle. Providing a good description
                could convince many students to enrol into your course.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  contentEditable={false}
                  error={description.length > 2000}
                  id="descr-course"
                  label={
                    <p>
                      {`description  ${2000 - description.length} characters`} *
                    </p>
                  }
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="whats on your mind..."
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPost>
  );
};

export default PostCourseModal;
