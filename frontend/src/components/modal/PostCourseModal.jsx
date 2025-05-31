import {
  Add,
  Close,
  CloudUploadRounded,
  DiamondRounded,
  SchoolRounded,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { updateCurrentSnackPostSuccess } from "../../redux/CurrentSnackBar";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
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
  const [instructor_github, setInstructorGitHub] = useState("");
  const [instructor_website, setInstructorWebsite] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [freeLogo, setFreeLogo] = useState("");
  const [fileUploadCustom, setFileUploadCustom] = useState(null);
  const [previewCustomLogo, setPreviewCustomLogo] = useState(null);
  const [topic_text, setTopicText] = useState(""); // To hold user input text for req
  const [topicsArray, setTopicsArray] = useState([]);

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);

  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // close freeLogo
  const handleCloseFreeLogo = () => {
    setFreeLogo("");
    setIsFreeLogo(false);
  };

  //handle free logo
  const handleFreeLogoPick = () => {
    // free logo shown for picks
    setIsFreeLogo(true);
    // clear file upload
  };

  //   handle file change and compress the image
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // compress the file using the custom utility created
    const compressedFile = await BrowserCompress(file);
    setFileUploadCustom(compressedFile);
    // create an object from URI of the image for local preview
    setPreviewCustomLogo(URL.createObjectURL(compressedFile));
  };

  // handle video full
  const handleFileChangeVideoFull = (event) => {
    const file = event.target.files[0];
    // update full video variable
    setVideoFullUpload(file);
  };

  // handle video preview full
  const handleVideoFullPreview = () => {
    return URL.createObjectURL(videoFullUpload);
  };

  // Handle input change for req
  const handleTextChangeTopic = (e, value) => {
    setTopicText(value);
  };

  // Handle adding req
  const handleAddUpdateTopic = () => {
    // Add the inputText as a new requirement if it's not empty
    if (topic_text.trim() !== "") {
      // if the name of the topic does not extist add
      if (!topicsArray.includes(topic_text.trim())) {
        setTopicsArray((prev) => [...prev, topic_text.trim()]);
        setTopicText(""); // Clear the input field
      }
    }
  };

  // Handle req removal
  const handleDeleteUpdateTopic = (req) => {
    setTopicsArray((prev) => prev.filter((val) => val !== req));
  };

  // handle core missing fields
  const handleEmptyFields = () => {
    if (title?.trim() === "") {
      setErrorMessage("Title field is required");
      return false;
    }
    if (description?.trim() === "") {
      setErrorMessage("Description field is required");
      return false;
    }
    if (post_category?.trim === "") {
      setErrorMessage("specialisation field is required");
      return false;
    }
    if (post_category?.includes("Backend") && category1.trim() === "") {
      setErrorMessage("backend field is required");
      return false;
    }
    if (post_category?.includes("Developer") && category1.trim() === "") {
      setErrorMessage("DevOps Tool field is required");
      return false;
    }
    if (post_category?.includes("Backend") && category2.trim() === "") {
      setErrorMessage("Database field is required");
      return false;
    }
    if (post_category?.includes("Machine") && category1.trim() === "") {
      setErrorMessage("ML/AI area of focus is required");
      return false;
    }
    if (post_category?.includes("Cybersecurity") && category1.trim() === "") {
      setErrorMessage("Cybersecurity area field is required");
      return false;
    }
    if (
      post_category?.includes("Data Science and Analytics") &&
      category1.trim() === ""
    ) {
      setErrorMessage("Data science area field is required");
      return false;
    }

    if (
      post_category?.includes("Fullstack") &&
      (category1.trim() === "" ||
        category2.trim() === "" ||
        category3.trim() === "")
    ) {
      setErrorMessage("Frontend, Backend and Database field all required");
      return false;
    }
    if (!fileUploadCustom) {
      if (freeLogo?.trim() === " ") {
        setErrorMessage("provide course logo");
        return false;
      }
    }

    if (topicsArray.length < 5) {
      setErrorMessage("provide atleast 5 topics");
      return false;
    }

    if (!videoFullUpload) {
      setErrorMessage("provide course video");
      return false;
    }

    return true;
  };

  // useEffect hook for upadating category values
  useEffect(() => {
    // handle the value fo backend
    const updatePostCategoryValue = () => {
      if (post_category.includes("Backend")) {
        setCategory1(backend);
        setCategory2(database);
      }
      if (post_category.includes("Database")) {
        setCategory1(database);
      }

      if (post_category.includes("Fullstack")) {
        setCategory1(frontend);
        setCategory2(backend);
        setCategory3(database);
      }
    };

    updatePostCategoryValue();
  }, [post_category, backend, database, frontend]);

  // extracting current logged in user details from the redux store
  const instructor_name = user.name;
  const instructor_title = user.specialisationTitle;
  const instructor_skills = user.selectedSkills;
  const instructor_avatar = user.avatar;

  const course = {
    instructor: {
      instructor_name,
      instructor_title,
      instructor_avatar,
      instructor_skills,
      instructor_website,
      instructor_github,
    },
    course_title: title,
    course_price: price,
    course_description: description,
    course_category: {
      main: post_category,
      sub1: category1,
      sub2: category2,
      sub3: category3,
    },
    course_topics: topicsArray,
    course_logo_url: freeLogo,
  };

  // handle posting of data to the backend
  const handleUploadCourse = () => {
    // clear any error message
    setErrorMessage("");
    // core fields not empty
    if (handleEmptyFields()) {
      // set is uploading true
      setIsUploading(true);
      // create a form which will facilitate parsing of the file for upload to cloud
      const formData = new FormData();
      // append post body after stringify it due to form data
      formData.append("course", JSON.stringify(course));

      // check if video and fileCustom the logo file present then append for upload to backend
      if (videoFullUpload) {
        // append video file
        formData.append("file", videoFullUpload);
      }

      // holds image logo
      if (fileUploadCustom) {
        // append image logo for the course
        formData.append("file", fileUploadCustom);
      }

      // performing post request
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/create`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // show success post snack controlled by redux
          dispatch(updateCurrentSnackPostSuccess(res.data));
          // close the current modal
          setOpenModalCourse(false);
          // navigate to home route by default
          navigate("/");
          // update tab bottom nav to 0
          updateCurrentBottomNav(0);
        })
        .catch(async (err) => {
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("Server Unreachable");
            return;
          }

          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  
  // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "40%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } else if(CustomLandscapeWidest()){
        return "35%"
      }
      return "100%"
    }

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
        width={handleReturnWidthModal()}
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

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalCourse(false)}>
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>{" "}
            </IconButton>
          </Box>

          {/* display error of missing filed if any */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            mb={isUploading || errorMessage ? 3 : undefined}
          >
            {errorMessage ? (
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="warning"
                  className="rounded-5"
                  onClick={() => setErrorMessage("")}
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            ) : (
              isUploading && (
                <Box>
                  <CircularProgress size={"25px"} />
                </Box>
              )
            )}
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
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  Note: The course you are posting should be yours and not
                  someone's intellectual property!
                </Typography>

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

              {/* programming Language */}
              {post_category === "Programming Languages" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select the programming language which your course will be
                    addressing in particualar.
                  </Typography>

                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* frontend */}
              {(post_category === "Frontend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which frontend technology will your course be covering in
                    particular.If it is based on a bare HTML/CSS version, select
                    the option with (HTML/CSS).
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* backend */}
              {(post_category === "Backend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Which backend technology will your course be covering in
                    particular? Suppose none of the provided options matches
                    your preference select (other).
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* Database */}
              {(post_category === "Database Administration (SQL/NoSQL)" ||
                post_category === "Backend App Development" ||
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <React.Fragment>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Which database in particular will your course make
                    utilisation of to facilitate storage of data? Suppose none
                    of the provided options matches your preference select
                    (other).
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* Desktop App */}
              {post_category === "Desktop App Development" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select desktop development technology that your course will
                    be based on such that the overal application runs on either
                    Linux OS, MacOS, Windows OS or both.
                  </Typography>

                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
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
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select a game application development technology in
                    particular.
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* UI/UX  */}
              {post_category === "UI/UX Design/Graphic Design" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select the UI/UX Design tool that you are covering in your
                    course.
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* Android App */}
              {post_category === "Native Android App Development" && (
                <React.Fragment>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Native Android application development stack is usually
                    based on Java or Kotlin. Select the stack that your course
                    make use of.
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* IOS App */}
              {post_category === "Native IOS App Development" && (
                <React.Fragment>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Select the stack used in your course for the development of
                    Native IOS Application project/post
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* Multiplatform Android+IOS */}
              {post_category ===
                "Multiplatform App Development (Android+IOS)" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select a mobile multiplatform/cross-application development
                    technology that you are interested in. multiplatform
                    technology or frameworks allows writing of a single code
                    base that runs on both Android and IOS devices. Suppose none
                    of the provided options matches your preference select
                    (other).
                  </Typography>

                  <Box className="w-100 mb-2 ">
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
                </React.Fragment>
              )}

              {/* Containerisation  */}
              {post_category === "Containerisation and Orchestration" && (
                <React.Fragment>
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
                </React.Fragment>
              )}

              <React.Fragment>
                {/* free logos pick */}
                {isFreeLogo && (
                  <Box
                    mt={1}
                    className="w-100 mb-4"
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <TextField
                      required
                      disabled={isUploading || errorMessage}
                      select
                      value={freeLogo}
                      variant="standard"
                      label="Free logos"
                      fullWidth
                      onChange={(e) => setFreeLogo(e.target.value)}
                    >
                      {logoNamesOptions &&
                        logoNamesOptions.map((name, index) => (
                          <MenuItem
                            key={index}
                            value={name}
                            sx={{ display: "flex", gap: 2 }}
                          >
                            {/* logo */}
                            <Avatar
                              src={logoValueOptions[index]}
                              sx={{ width: 32, height: 32 }}
                              alt=""
                            />
                            {/* name */}
                            <Typography variant="body2">{name}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    {/* close button */}
                    <IconButton onClick={handleCloseFreeLogo}>
                      <Tooltip title={"exit link"}>
                        <Close />
                      </Tooltip>
                    </IconButton>
                  </Box>
                )}

                {/* preview the file uploaded from storage */}
                {fileUploadCustom && (
                  <Box display={"flex"} justifyContent={"center"}>
                    <img
                      src={previewCustomLogo}
                      alt=""
                      className="rounded"
                      style={{
                        maxWidth: 100,
                      }}
                    />
                  </Box>
                )}

                {/* provide a logo for the course */}
                <Typography variant="body2" color={"text.secondary"}>
                  Provide logo for the course. You can select the preferred logo
                  from the free kits that have been provided or uploading the
                  custom version from your local storage.
                </Typography>
                <Box display={"flex"} justifyContent={"flex-end"} gap={1}>
                  <Button
                    variant="text"
                    disableElevation
                    disabled={isUploading}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                    onClick={handleFreeLogoPick}
                    size="medium"
                    startIcon={<DiamondRounded />}
                  >
                    Free
                  </Button>

                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    disableElevation
                    tabIndex={-1}
                    size="medium"
                    disabled={isUploading}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Upload
                    <StyledInput
                      type="file"
                      accept="image/*,"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Button>
                </Box>
              </React.Fragment>

              <React.Fragment>
                <Typography variant="body2" mt={3} color={"text.secondary"}>
                  Provide course price in dollars (USD). Metatron charges 40%
                  fee of the total price that includes taxes, hosting fee,
                  advertisement and recommendation to the potential students.
                </Typography>

                <Box className="w-100 mb-2">
                  <TextField
                    required
                    value={price}
                    label={"Price (USD)"}
                    placeholder="30"
                    type="number"
                    fullWidth
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Box>
              </React.Fragment>

              {/* full video lecture */}
              <React.Fragment>
                <Typography
                  gutterBottom
                  variant="body2"
                  mt={3}
                  mb={3}
                  color={"text.secondary"}
                >
                  Upload the full video lecture for the course. Its recommended
                  that your video should not exceed 2GB and the quality should
                  be standardised to 720p as the mininum.
                </Typography>

                {videoFullUpload && (
                  <React.Fragment>
                    {/* video box */}
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      width={"100%"}
                    >
                      <video
                        controls
                        className="rounded"
                        muted
                        autoFocus
                        src={handleVideoFullPreview()}
                        style={{ width: "95%" }}
                        height={280}
                        poster={previewCustomLogo}
                      >
                        <Typography
                          textAlign={"center"}
                          variant="body2"
                          color={"error"}
                        >
                          video not supported
                        </Typography>
                      </video>
                    </Box>
                    {/* video name */}
                    <Box display={"flex"} justifyContent={"center"}>
                      <Typography variant="caption" color={"text.secondary"}>
                        {videoFullUpload.name.split(".")[0].substring(0, 20)}
                      </Typography>
                    </Box>
                  </React.Fragment>
                )}

                <Box display={"flex"} justifyContent={"center"} width={"100%"}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    disableElevation
                    tabIndex={-1}
                    size="small"
                    sx={{
                      textTransform: "lowercase",
                      borderRadius: "20px",
                      width: CustomDeviceIsSmall()
                        ? "75%"
                        : CustomDeviceSmallest()
                        ? "100%"
                        : "50%",
                    }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Select Course Video
                    <StyledInput
                      type="file"
                      accept="video/*"
                      onChange={handleFileChangeVideoFull}
                      multiple
                    />
                  </Button>
                </Box>
              </React.Fragment>

              <Typography variant="body2" color={"text.secondary"}>
                Provide the required link to your website or social media
                platform which users or potential students to your course could
                learn more about you.
              </Typography>
              {/* Email */}
              <Box className="mb-3">
                <TextField
                  fullWidth
                  required
                  type="tel"
                  value={instructor_website}
                  onChange={(e) => setInstructorWebsite(e.target.value)}
                  id="website_instructor"
                  label={"website"}
                  placeholder="https://mywebsite.com"
                />
              </Box>

              <Typography variant="body2" color={"text.secondary"}>
                Provide the required link to your GitHub profile which could
                provide helpful information about your other worked on projects.
              </Typography>

              {/* Email */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  value={instructor_github}
                  onChange={(e) => setInstructorGitHub(e.target.value)}
                  required
                  type="url"
                  id="github_instructor"
                  label={"GitHub"}
                  placeholder="https://github/instructor.com"
                />
              </Box>

              {/* topics covered */}
              <React.Fragment>
                <Stack mt={2} gap={1}>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide the topics or lectures that your course is aimed to
                    debunk during the session. providing concise topics helps
                    the students to anticipate the general flow of the course
                    and could influence their preference of selection.
                  </Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    width={"100%"}
                    gap={1}
                  >
                    {/* topics added autocomplete */}
                    <Autocomplete
                      freeSolo
                      className="w-100"
                      options={topicsArray} // Show available options when user types
                      value={topic_text}
                      onInputChange={handleTextChangeTopic}
                      disableClearable
                      inputValue={topic_text}
                      disabled={isUploading}
                      onChange={handleTextChangeTopic}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Topic name"
                          variant={
                            CustomDeviceIsSmall() ? "standard" : "outlined"
                          }
                          placeholder="Introduction To React"
                          fullWidth
                        />
                      )}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && topic_text?.trim() !== "") {
                          handleAddUpdateTopic();
                        }
                      }}
                    />

                    {/* add button */}
                    <IconButton
                      className="border"
                      onClick={handleAddUpdateTopic}
                      disabled={!topic_text || isUploading}
                    >
                      <Add color="primary" sx={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Box>
                </Stack>

                {/* display  latest previous topics or lectures */}
                <Box mb={1}>
                  {topicsArray.length > 0 && (
                    <Box mt={2} mb={2}>
                      <Box
                        component={"ol"}
                        bgcolor={isDarkMode ? undefined : "#f1f1f1"}
                        className={isDarkMode ? "border" : "rounded"}
                      >
                        {/* available topics */}
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          mb={1}
                          width={"100%"}
                        >
                          <Typography
                            width={"100%"}
                            variant="caption"
                            textTransform={"capitalize"}
                            fontWeight={"bold"}
                            sx={{
                              textDecoration: "underline",
                            }}
                            color={"text.secondary"}
                          >
                            available course lectures or topics
                          </Typography>
                        </Box>
                        {topicsArray.map((topic, index) => (
                          <Box
                            display={"flex"}
                            gap={1}
                            key={index}
                            alignItems={"center"}
                          >
                            <Typography
                              component={"li"}
                              variant="caption"
                              fontWeight={"bold"}
                              color="text.secondary"
                            >
                              {topic}
                            </Typography>
                            {/* clear or delete icon */}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUpdateTopic(topic)}
                            >
                              <Close sx={{ width: 15, height: 15 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </React.Fragment>

              <Typography variant="body2" color={"text.secondary"}>
                Describe your course in details explaining the important areas
                that your are going to tackle. Providing a good description
                could convince many students to enrol into your course.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  contentEditable={false}
                  error={description.length > 1000}
                  id="descr-course"
                  label={
                    <p>
                      {`Description  ${1000 - description.length} characters`} *
                    </p>
                  }
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="whats on your mind..."
                />
              </Box>

              {/*  button for posting */}
              <Box display={"flex"} justifyContent={"center"} mb={2}>
                <Button
                  onClick={handleUploadCourse}
                  startIcon={<SchoolRounded />}
                  className={
                    CustomDeviceIsSmall() ? "w-75 rounded-5" : "w-50 rounded-5"
                  }
                  variant="contained"
                  disabled={isUploading || errorMessage}
                  size="small"
                >
                  Upload Your Course
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPost>
  );
};

export default PostCourseModal;
