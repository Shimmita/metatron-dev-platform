import {
  Close,
  CloudUploadRounded,
  DiamondRounded,
  UploadRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../images/logo_sm.png";
import { showPostModalRedux } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { updateCurrentSnackPostSuccess } from "../../redux/CurrentSnackBar";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));
const AlertInput = lazy(() => import("../alerts/AlertInput"));

// styled modal
const StyledModalPost = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const PostTechModal = ({ openModalTech, setOpenModalTech }) => {
  const [post_category, setPostCategory] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [database, setDatabase] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [freeLogo, setFreeLogo] = useState("");
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");

  // control opening and showing of the alert custom input
  const [openAlert, setOpenAlert] = useState(false);

  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // handle showing free logo menu
  const handleShowFreeLogo = () => {
    // clear file uploaded if any
    setFileUpload(null);
    // set true link video full
    setIsFreeLogo(true);
  };

  // handle closing free logo
  const handleCloseFreeLogo = () => {
    // clear
    setFreeLogo("");
    // default showing of btn upload and link
    setIsFreeLogo(false);
  };

  // extracting current logged in user details from the redux store
  const ownerId = user._id;
  const ownername = user.name;
  const ownertitle = user.specialisationTitle;
  const ownerverified = user.premium;
  const ownerskills = user.selectedSkills;
  const owneravatar = user.avatar;
  const country = user.country;
  const state = user.county;

  const post = {
    post_owner: {
      ownerId,
      ownername,
      ownertitle,
      ownerverified,
      ownerskills,
      owneravatar,
    },
    post_title: title,
    post_url: freeLogo && freeLogo,
    post_body: description,
    post_category: {
      main: post_category,
      sub1: category1,
      sub2: category2,
      sub3: category3,
    },
    post_location: {
      country,
      state,
    },
    post_github: {
      link: gitHub.trim() !== "" ? gitHub : "",
    },
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

  // handle when free logos is selected or changed
  const handleFreeLogoPicked = (event) => {
    // clear file preview
    setFilePreview(null);
    // update free logo value
    setFreeLogo(event.target.value);
    // update file preview for free logo
    setFilePreview(getImageMatch(event.target.value));
  };

  //   handle file change and compress the image
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // compress the file using the custom utility created
    const compressedFile = await BrowserCompress(file);

    setFileUpload(compressedFile);
    // create an object from URI of the image for local preview
    setFilePreview(URL.createObjectURL(compressedFile));
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

    if (!freeLogo && !fileUpload) {
      setErrorMessage("provide image for this post");
      return false;
    }

    return true;
  };

  // handle posting of data to the backend
  const handlePost = () => {
    // clear any error message
    setErrorMessage("");
    // core fields not empty
    if (handleEmptyFields()) {
      // set is uploading true
      setIsUploading(true);
      // create a form which will faciltate parsing of the file for upload to cloud
      const formData = new FormData();
      // append post body after stringify it due to form data
      formData.append("post", JSON.stringify(post));

      // check if file is present then upload append it for upload
      if (fileUpload) {
        formData.append("image", fileUpload);
      }

      // performing post request
      axios
        .post(`http://localhost:5000/metatron/api/v1/posts/create`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          // show success post snack controlled by redux
          dispatch(updateCurrentSnackPostSuccess(res.data));
          // close the current modal
          setOpenModalTech(false);
          // navigate to home route by default
          navigate("/");
          // update tab bottom nav to 0
          updateCurrentBottomNav(0);
          // update the redux of current posts suppose the post is present
          // in the feed.
          dispatch(resetClearCurrentPosts());
        })
        .catch(async (err) => {
          //  user login session expired show logout alert
          if (err?.response?.data.login) {
            setOpenAlertLogout(true);
          }
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

  const title_ml_area = "Area of Focus";
  const body_ml_are =
    "provide preferred machine learning or artificial intelligence area of focus";

  useEffect(() => {
    if (category1?.trim() === "zero (none of the areas)") {
      setOpenAlert(true);
    }
  }, [category1]);

  // handle closing of the modal
  const handleClosingModal = () => {
    setOpenModalTech(false);
    // also redux reset for isPostModal Redux if true
    dispatch(showPostModalRedux());
  };

  return (
    <StyledModalPost
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openModalTech && !openAlertLogout}
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
            ? "35%"
            : "100%"
        }
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
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
            <IconButton
              disabled={isUploading || errorMessage}
              onClick={handleClosingModal}
            >
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
                  severity="info"
                  className="rounded"
                  onClick={() => setErrorMessage("")}
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close
                        fontSize="inherit"
                        sx={{ width: 15, height: 15 }}
                      />
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
            maxHeight={"78vh"}
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
              opacity: isUploading && ".3",
            }}
          >
            <Box display={"flex"} flexDirection={"column"} gap={3}>
              <Box>
                <Typography variant="body2" mt={3} color={"text.secondary"}>
                  Provide relevant title for this post to help target users on
                  the platform to bootstrap your objectives or motives at
                  glance.
                </Typography>

                <Box mt={4} className="w-100 mb-2">
                  <TextField
                    required
                    disabled={isUploading}
                    error={title.length > 50}
                    value={title}
                    label={`Title ${50 - title.length}`}
                    placeholder="React CheatSheet"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
              </Box>

              {/* post about */}
              <Typography variant="body2" color={"text.secondary"}>
                Provide area of specialisation in the Tech or IT Industry where
                your post is aimed to address in particular.
              </Typography>

              <Box className="w-100 mt-2 mb-2 ">
                <TextField
                  required
                  select
                  disabled={isUploading}
                  value={post_category}
                  label="Specialisation"
                  fullWidth
                  onChange={(e) => setPostCategory(e.target.value)}
                >
                  {SpecialisationTech &&
                    SpecialisationTech.filter((about) => about !== "None").map(
                      (about, index) => (
                        <MenuItem
                          key={index}
                          value={about}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {/* icon */}
                          <CourseIcon option={about} />
                          {/* name */}
                          <small style={{ fontSize: "small" }}>{about}</small>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              {/* Containerisation  */}
              {post_category === "Containerisation and Orchestration" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Containerisation and Orchestration option that your post
                    aims to enlighten to other potential users on the platform.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Containerisation technology"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Containerisation.map((container) => (
                          <MenuItem key={container} value={container}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(container)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {container}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* machine learning and artificial intelligence */}
              {post_category === "Artificial Intelligence" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Provide specific area of focus in the field of Machine
                    Learning and Artificial Intelligence, select option zero if
                    none matches to privide your preference.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="ML/AI area"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.MachineLearning.map((ml_ai) => (
                          <MenuItem key={ml_ai} value={ml_ai}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>
                                {ml_ai}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* data science */}
              {post_category === "Data Science and Analytics" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Select the area of focus in the field of data science and
                    analysis in particular.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Data science area"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.DataScience.map((data_science) => (
                          <MenuItem key={data_science} value={data_science}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>
                                {data_science}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* cybersecurity */}
              {post_category === "Cybersecurity Engineering" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Select the area of focus in the field of cybersecurity
                    engineering.This prevents being too general in broader
                    fields.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      disabled={isUploading}
                      select
                      value={category1}
                      label="Cybersecurity area"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Cybersec.map((cybersec) => (
                          <MenuItem key={cybersec} value={cybersec}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>
                                {cybersec}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Desktop App */}
              {post_category === "Desktop App Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Desktop development stack used in your project. Desktop
                    applications usually runs on high-end devices such as
                    Laptops and PCs.
                  </Typography>

                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Development stack"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Desktop.map((desktop) => (
                          <MenuItem key={desktop} value={desktop}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>
                                {desktop}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Game dev */}
              {post_category === "Game App Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide game application development technology that your
                    post is aimed to address in particular from the provided
                    options.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      disabled={isUploading}
                      select
                      value={category1}
                      label="Game development technology"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.GameDev.map((game_dev) => (
                          <MenuItem key={game_dev} value={game_dev}>
                           <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(game_dev)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {game_dev}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* programming Language */}
              {post_category === "Programming Languages" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Select programming language that you are interested to post
                    about from the options provided below.
                  </Typography>

                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Select Programming Language"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Language.map((language) => (
                          <MenuItem key={language} value={language}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(language)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {language}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* cloud computing */}
              {/* DevOps */}
              {post_category === "Cloud Computing" && (
                <Box>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select cloud provider in particualar that you are interested
                    to address in your post.
                  </Typography>
                  <Box className="w-100 mb-3 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Cloud provider"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Cloud.map((cloud_provider) => (
                          <MenuItem key={cloud_provider} value={cloud_provider}>
                            <Box display={"flex"} gap={2}>
                              <small style={{ fontSize: "small" }}>
                                {cloud_provider}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* DevOps */}
              {post_category === "DevOps Engineering" && (
                <Box>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select DevOps engineering platform or tool that was used as
                    reference for your post.
                  </Typography>
                  <Box className="w-100 mb-3 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="DevOps platform/tool"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.DevOps.map((devops_tool) => (
                          <MenuItem key={devops_tool} value={devops_tool}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(devops_tool)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {devops_tool}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* UI/UX  */}
              {post_category === "UI/UX Design" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide UI/UX design tool which your post covers and aims to
                    enlighten potential target users on the platform.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Design tool"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Design.map((design_tool) => (
                          <MenuItem key={design_tool} value={design_tool}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(design_tool)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {design_tool}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* frontend */}
              {(post_category === "Frontend App Development" ||
                post_category === "Fullstack Application Development") && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Which frontend technology are you intrested in? If your post
                    is based on a bare HTML/CSS/Js version of a project, select
                    the option with (HTML).
                  </Typography>
                  <Box mt={4} className="w-100">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={frontend}
                      label="Frontend framework"
                      fullWidth
                      onChange={(e) => setFrontend(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Frontend.map((frontend) => (
                          <MenuItem key={frontend} value={frontend}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(frontend)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {frontend}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* backend */}
              {(post_category === "Backend App Development" ||
                post_category === "Fullstack Application Development") && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Which backend technology are you intrested in? Suppose none
                    of the provided options matches your preference select
                    (other).
                  </Typography>
                  <Box mt={4} className="w-100">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={backend}
                      label="Backend Framework"
                      fullWidth
                      onChange={(e) => setBackend(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Backend.map((backend) => (
                          <MenuItem key={backend} value={backend}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(backend)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {backend}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Database */}
              {(post_category === "Database Administration" ||
                post_category === "Backend App Development" ||
                post_category === "Fullstack Application Development") && (
                <Box>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Which database did you link it with {backend} for this post.
                    suppose none of the provided options matches your preference
                    select (other).
                  </Typography>
                  <Box mt={4} className="w-100 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={database}
                      label="Select Database"
                      fullWidth
                      onChange={(e) => setDatabase(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Database.map((database) => (
                          <MenuItem key={database} value={database}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(database)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {database}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Android App */}
              {post_category === "Native Android App Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Native Android application development stack is usually
                    based on Java or Kotlin. The recommended modern way of
                    writing android applications is by using Kotlin.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Android app stack"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Android.map((android) => (
                          <MenuItem key={android} value={android}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(android)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {android}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* IOS App */}
              {post_category === "Native IOS App Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide the stack used in the developement of your native
                    IOS application which your post is aimed to address.
                  </Typography>
                  <Box mt={4} className="w-100 mb-2 ">
                    <TextField
                      required
                      disabled={isUploading}
                      select
                      value={category1}
                      label="IOS app stack"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.IOS.map((ios) => (
                          <MenuItem key={ios} value={ios}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(ios)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>{ios}</small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Multiplatform Android+IOS */}
              {post_category === "Multiplatform Mobile Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide multiplatform or cross-platform development
                    technology that you are interested in. Allows writing of a
                    single code base that runs on both Android and IOS devices.
                  </Typography>
                  <Box mt={4} className="w-100">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Mobile multiplatform Stack"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Multiplatfotm.map((multiplatform) => (
                          <MenuItem key={multiplatform} value={multiplatform}>
                            <Box display={"flex"} gap={2}>
                              {/* image */}
                              <Avatar
                                src={getImageMatch(multiplatform)}
                                sx={{ width: 32, height: 32 }}
                                alt=""
                              />{" "}
                              {/* name */}
                              <small style={{ fontSize: "small" }}>
                                {multiplatform}
                              </small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* Github link */}

              <Typography variant="body2" color={"text.secondary"}>
                Suppose your post is about a particular project you worked on
                and aiming to display your technicalities, please provide GiHub
                or Gitlab link to promote your project.
              </Typography>

              <Box className="mb-2">
                <TextField
                  fullWidth
                  disabled={isUploading}
                  value={gitHub}
                  onChange={(e) => setGitHub(e.target.value)}
                  id="github-gitlab"
                  label={"Version control link (optional)"}
                  placeholder=" https://github.com/username/project-name.git"
                />
              </Box>

              {/* image and pdf for the post */}

              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Visual representation of your post to the target users is highly
                encouraged thus recommeded attachment of an image or pdf file
                for referential purposes.
              </Typography>

              {/* preview the file uploaded from storage */}
              {(fileUpload || freeLogo) && (
                <Box display={"flex"} justifyContent={"center"}>
                  <img
                    src={filePreview}
                    alt=""
                    className="rounded"
                    style={{
                      maxWidth: 100,
                    }}
                  />
                </Box>
              )}

              {!isFreeLogo ? (
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Button
                    variant="text"
                    disableElevation
                    disabled={isUploading}
                    id="external_text_btn_link"
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={handleShowFreeLogo}
                    startIcon={<DiamondRounded sx={{ rotate: "180deg" }} />}
                  >
                    Free
                  </Button>

                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    disableElevation
                    disabled={isUploading}
                    tabIndex={-1}
                    id="upload_text_btn"
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Upload
                    <StyledInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Button>
                </Box>
              ) : (
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
                    onChange={handleFreeLogoPicked}
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

              {/* description */}

              <Typography variant="body2" color={"text.secondary"}>
                Description about your post highlighting the technical concepts
                you are excited to share with many users platform. Let your
                audience visualize your concepts.
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  disabled={isUploading}
                  contentEditable={false}
                  error={description.length > 1000}
                  id="descr-body-post"
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
                  onClick={handlePost}
                  startIcon={<UploadRounded />}
                  sx={{ fontWeight: "bold" }}
                  className={
                    CustomDeviceIsSmall() ? "w-75 rounded-5" : "w-50 rounded-5"
                  }
                  disabled={isUploading || errorMessage}
                >
                  Upload Your Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* alert for preferred machine learning area input */}
        <AlertInput
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          setCustomArea={setCategory1}
          title={title_ml_area}
          body={body_ml_are}
        />

        {/* show logout session expired alert */}
        <LogoutAlert
          openAlertLogout={openAlertLogout}
          setOpenAlertLogout={setOpenAlertLogout}
          title="Session Expired"
          body="Please login to complete your request,previous session has expired. We do this to deter unauthorised access on accounts that have not been logged out for a while."
        />
      </Box>
    </StyledModalPost>
  );
};

export default PostTechModal;
