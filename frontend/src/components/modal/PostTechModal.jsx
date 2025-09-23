import {
  Close,
  CloudUploadRounded,
  DiamondRounded,
  PostAddRounded,
  Settings
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { updateCurrentSnackPostSuccess } from "../../redux/CurrentSnackBar";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
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
  const [postCategory, setPostCategory] = useState("");
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
  const [frontendUI,setFrontendUI]=useState("")
  const [group,setGroup]=useState("")
  
  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");

  // control opening and showing of the alert custom input
  const [openAlertML, setOpenAlertML] = useState(false);

  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
   const isDarkMode=currentMode==='dark'

  const { user } = useSelector((state) => state.currentUser);
  const { groups:groupData } = useSelector((state) => state.currentGroups);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


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
    group,
    post_category: {
      main: postCategory,
      sub1: category1,
      sub2: category2,
      sub3: category3,
      sub4: category4,
    },
    post_location: {
      country,
      state,
    },
    post_github: {
      link: gitHub.trim() !== "" ? gitHub : "",
    },
  };

  // useEffect hook for updating category values
  useEffect(() => {
    // handle the value fo backend
    const updatePostCategoryValue = () => {

       // for frontend  category 1 will be tool, category 2 will be UI library
      if (postCategory.toLowerCase().includes("frontend")) {
        setCategory1(frontend)
        setCategory2(frontendUI)
      }

      if (postCategory.includes("Backend")) {
        setCategory1(backend);
        setCategory2(database);
      }
      if (postCategory.includes("Database")) {
        setCategory1(database);
      }

      if (postCategory.includes("Fullstack")) {
        setCategory1(frontend);
        setCategory2(backend);
        setCategory3(database);
        setCategory4(frontendUI)
        
      }
    };

    updatePostCategoryValue();
  }, [postCategory, backend, database, frontend,frontendUI]);


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
    // close free logo
    handleCloseFreeLogo()

    // update file events
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
    if (postCategory?.trim === "") {
      setErrorMessage("specialisation field is required");
      return false;
    }
    if (postCategory?.includes("Backend") && category1.trim() === "") {
      setErrorMessage("backend field is required");
      return false;
    }
    if (postCategory?.includes("Developer") && category1.trim() === "") {
      setErrorMessage("DevOps Tool field is required");
      return false;
    }
    if (postCategory?.includes("Backend") && category2.trim() === "") {
      setErrorMessage("Database field is required");
      return false;
    }
    if (postCategory?.includes("Machine") && category1.trim() === "") {
      setErrorMessage("ML/AI area of focus is required");
      return false;
    }
    if (postCategory?.includes("Cybersecurity") && category1.trim() === "") {
      setErrorMessage("Cybersecurity area field is required");
      return false;
    }
    if (
      postCategory?.includes("Data Science and Analytics") &&
      category1.trim() === ""
    ) {
      setErrorMessage("Data science area field is required");
      return false;
    }

    if (
      postCategory?.includes("Fullstack") &&
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
      // create a form which will facilitate parsing of the file for upload to cloud
      const formData = new FormData();
      // append post body after stringify it due to form data
      formData.append("post", JSON.stringify(post));

      // check if file is present then upload append it for upload
      if (fileUpload) {
        formData.append("image", fileUpload);
      }

      // performing post request
      axios
        .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/create`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          // show success post snack controlled by redux
          dispatch(updateCurrentSnackPostSuccess(res.data));
           // redux success to trigger success alert
          dispatch(updateCurrentSuccessRedux({title:'Post Milestone Uploaded',message:`${res.data} your post is now visible to everyone on the platform for ${gitHub.length>3 ? "likes, comments and GitHub review from users":"likes and comments from users"} `}))
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
      setOpenAlertML(true);
    }
  }, [category1]);

  // handle closing of the modal
  const handleClosingModal = () => {
    setOpenModalTech(false);
  };


  // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() ||CustomLandscapeWidest() ||
      (CustomDeviceTablet() && !isTabSideBar)) {
        return "40%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } 
      return "95%"
    }


  return (
    <StyledModalPost
    keepMounted
    open={openModalTech}
    sx={{
      backdropFilter:'blur(5px)',
    }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      width={handleReturnWidthModal()}
      borderRadius={3}
      color={"text.primary"}
      sx={{
        border:"1px solid gray",
        borderColor:'divider',
      }}
    >
      <Box
        bgcolor={"background.default"}
        borderRadius={3}
        className="shadow-lg"
        sx={{ 
          border:  "1px solid gray",
          borderColor:'divider',
        }}
      >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            borderRadius={3}
            pt={1}
            pr={0.8}
            sx={{
              background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
            }}
          >
            {/* logo */}
            <Box>
              <Avatar sx={{ width: 60, height: 60 }} src={AppLogo} alt="logo" />
            </Box>

              {/* title */}
              <Typography
                variant="body2"
                width={"100%"}
                fontWeight={"bold"}
                textAlign={"center"}
              >
                {title.length===0 ? "Tech Content Upload":title}
              </Typography>

            {/*close icon */}
            <IconButton
              disabled={isUploading || errorMessage}
              onClick={handleClosingModal}
              sx={{
                border:'1px solid',
                borderColor:'divider',
              }}
            >
              <Tooltip title={"close"}>
                <Close  
                sx={{ 
                  width:12,
                  height:12,
                 }}/>
              </Tooltip>{" "}
            </IconButton>
          </Box>

          {/* display error of missing filed if any */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            mb={isUploading || errorMessage ? 1 : undefined}
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
                        sx={{ width: 14, height: 14 }}
                      />
                    </IconButton>
                  }
                >
                  <FormHelperText>{errorMessage}</FormHelperText>
                </Alert>
              </Collapse>
            ) : (
              isUploading && (
                <Box>
                  <CircularProgress size={25} />
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
            <Box mt={3} display={"flex"} flexDirection={"column"} gap={3}>
              <Box>
                <Typography variant="body2" color={"text.secondary"}>
                  Provide relevant title for this post to help target users on
                  the platform to bootstrap your objectives or motives at
                  glance.
                </Typography>

                <Box mt={2} className="w-100 mb-2">
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

              <Box className="w-100 
               mb-2 ">
                <TextField
                  required
                  select
                  disabled={isUploading}
                  value={postCategory}
                  label="Specialisation"
                  fullWidth
                  onChange={(e) => setPostCategory(e.target.value)}
                >
                  {SpecialisationTech?.filter((about) => about !== "None").map(
                      (about) => (
                        <MenuItem
                          key={about}
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
                          <Typography variant="body2">{about}</Typography>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              {/* Containerization  */}
              {postCategory === "Containerization and Orchestration" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"} p={1}>
                    Containerization and Orchestration option that your post
                    aims to enlighten to other potential users on the platform.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={category1}
                      label="Containerization technology"
                      fullWidth
                      onChange={(e) => setCategory1(e.target.value)}
                    >
                      {SubsectionTech?.Containerisation.map((container) => (
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
              {postCategory === "Artificial Intelligence" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"} p={1}>
                    Provide specific area of focus in the field of Machine
                    Learning and Artificial Intelligence, select option zero if
                    none matches to provide your preference.
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
                      {SubsectionTech?.MachineLearning.map((ml_ai) => (
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
              {postCategory === "Data Science and Analytics" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"} p={1}>
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
                      {SubsectionTech?.DataScience.map((data_science) => (
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
              {postCategory === "Cybersecurity Engineering" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"} p={1}>
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
                      {SubsectionTech?.Cybersec.map((cybersec) => (
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
              {postCategory === "Desktop App Development" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"} mt={3}>
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
                      {SubsectionTech?.Desktop.map((desktop) => (
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
              {postCategory === "Game App Development" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"}>
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
                      {SubsectionTech?.GameDev.map((game_dev) => (
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
              {postCategory === "Programming Languages" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"}>
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
                      {SubsectionTech?.Language.map((language) => (
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
              {postCategory === "Cloud Computing" && (
                <Box>
                  <Typography
                    
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select cloud provider in particular that you are interested
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
                      {SubsectionTech?.Cloud.map((cloud_provider) => (
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
              {postCategory === "DevOps Engineering" && (
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
                      {SubsectionTech?.DevOps.map((devops_tool) => (
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
              {postCategory === "UI/UX Design" && (
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
                      {SubsectionTech?.Design.map((design_tool) => (
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
              {(postCategory === "Frontend App Development" ||
                postCategory === "Fullstack App Development") && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Which frontend technology are you interested in? If your post
                    is based on a bare HTML/CSS/Js version of a project, select
                    the option with (HTML).
                  </Typography>
                  <Box my={3} className="w-100">
                    <TextField
                      required
                      select
                      disabled={isUploading}
                      value={frontend}
                      label="Frontend framework"
                      fullWidth
                      onChange={(e) => setFrontend(e.target.value)}
                    >
                      {SubsectionTech?.Frontend.map((frontend) => (
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

                   {/* frontend UI library */}
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which frontend UI/UX design library have you used in styling your {!frontend.includes("none") && frontend} 
                    components for your project or milestone post.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={frontendUI}
                      label="UI Styling Library"
                      fullWidth
                      onChange={(e) => setFrontendUI(e.target.value)}
                    >
                      {SubsectionTech?.FrontendUI.map((frontend) => (
                          <MenuItem key={frontend} value={frontend}>
                            <Typography variant="body2">{frontend}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}

              {/* backend */}
              {(postCategory === "Backend App Development" ||
                postCategory === "Fullstack App Development") && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Which backend technology are you interested in? Suppose none
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
                      {SubsectionTech?.Backend.map((backend) => (
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
              {(postCategory === "Database Administration" ||
                postCategory === "Backend App Development" ||
                postCategory === "Fullstack App Development") && (
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
                      {SubsectionTech?.Database.map((database) => (
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
              {postCategory === "Native Android App Development" && (
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
                      {SubsectionTech?.Android.map((android) => (
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
              {postCategory === "Native IOS App Development" && (
                <Box>
                  <Typography variant="body2" color={"text.secondary"}>
                    Provide the stack used in the development of your native
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
                      {
                        SubsectionTech?.IOS.map((ios) => (
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
              {postCategory === "Multiplatform Mobile Development" && (
                <Box>
                  <Typography    variant="body2" color={"text.secondary"}>
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
                      {
                        SubsectionTech?.Multiplatform.map((multiplatform) => (
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

              

              {/* image and pdf for the post */}

              <Typography 
              gutterBottom 
              variant="body2" 
              color={"text.secondary"}>
                Provide or embed an main image for your post. Images tend to summarizes your post 
                content more than verbose statements without graphical representations.
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

               {/* shown if free logo is true */}
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
                      onChange={handleFreeLogoPicked}
                    >
                      {
                        logoNamesOptions?.map((name, index) => (
                          <MenuItem
                            key={name}
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
                  </Box>
                  )}

                <Box
                  display={"flex"}
                  justifyContent={"space-around"}
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
            

              {/* Github link */}
              <Typography 
                variant="body2" 
                color={"text.secondary"}>
                Suppose you posting about a project you worked on and aiming for future 
                contribution and collaboration, provide GitHub or Gitlab link.
              </Typography>

              <Box className="mb-2">
                <TextField
                  fullWidth
                  disabled={isUploading}
                  value={gitHub}
                  onChange={(e) => setGitHub(e.target.value)}
                  id="github-gitlab"
                  label={"GitHub or GitLab link (optional)"}
                  placeholder=" https://github.com/username/project-name.git"
                />
              </Box>


              {/* group tagging */}
              <Typography 
              variant="body2" 
              color={"text.secondary"}>
                Group tagging (optional) is a feature which allows your post to reach many tech 
                users enrolled in a particular group or community. Tag a possible group.
              </Typography>

              <Box className="mb-2">
                  <TextField
                      disabled={isUploading || errorMessage || groupData?.filter(group=>group.isMember).length===0}
                      select
                      value={group}
                      variant="standard"
                      label={`${groupData?.filter(group=>group.isMember).length ? "Tag Group or Community":"Join a group or community"}`}
                      fullWidth
                      onChange={(e)=>setGroup(e.target.value)}
                        >
                      {
                        groupData?.filter(group=>group.isMember)?.map((group) => (
                          <MenuItem
                            key={group.name}
                            value={group.name}
                            sx={{ display: "flex", gap: 2 }}
                          >
                            {group.name.includes("System Design and Principles") ? 
                              (<Settings sx={{width:34,height:34}}/>):
                              <Avatar 
                              sx={{
                                width:34,height:34
                              }}
                              src={getImageMatch(group.name.split(","),false,true)}
                              alt=""/>}
                            {/* name */}
                            <Typography variant="body2">{group.name}</Typography>
                          </MenuItem>
                        ))}

                    </TextField>
              </Box>

              {/* description */}
              <Typography  
              variant="body2" 
              color={"text.secondary"}>
                Description about your post highlighting the technical concepts
                you are excited to share with many users platform. Let your
                audience visualize your concepts.
              </Typography>

              <Box mb={2}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  disabled={isUploading}
                  contentEditable={false}
                  error={description.length > 1000}
                  id="description-body-post"
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
                  variant="contained"
                  size='medium'
                  className='rounded-5'
                  startIcon={<PostAddRounded/>}
                  disabled={isUploading || errorMessage}
                >
                  Upload Your Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* alert for preferred machine learning area input */}
        {openAlertML && 
        <AlertInput
          openAlert={openAlertML}
          setOpenAlert={setOpenAlertML}
          setCustomArea={setCategory1}
          title={title_ml_area}
          body={body_ml_are}
        /> }

        {/* show logout session expired alert */}
          {openAlertLogout && 
          <LogoutAlert
            openAlertLogout={openAlertLogout}
            setOpenAlertLogout={setOpenAlertLogout}
            title="Session Expired"
            body="please login to complete your request, your session has expired."
          />}
      </Box>
    </StyledModalPost>
  );
};

export default PostTechModal;
