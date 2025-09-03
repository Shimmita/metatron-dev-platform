import {
  Close,
  CloudUploadRounded,
  DiamondRounded,
  SchoolRounded
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentSnackPostSuccess } from "../../redux/CurrentSnackBar";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
import VideoPreviewComponent from "./VideoPreviewComponent";


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

const MAX_DESCRIPTION=500
const MAX_COURSE=600
const FILE_MAX=50000000
const MB_CONVERSION=1024*1024

const PostCourseModal =({ openModalCourse, setOpenModalCourse }) => {
  const [title, setTitle] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [progLanguage, setProgLanguage] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [frontendUI,setFrontendUI]=useState("")
  const [database, setDatabase] = useState("");
  const [containerisation, setContainerisation] = useState("");
  const [desktop, setDesktop] = useState("");
  const [multiplatform, setMultiplatform] = useState("");
  const [iosDev, setIOSDev] = useState("");
  const [android, setAndroid] = useState("");
  const [designTool, setDesignTool] = useState("");
  const [gameDev, setGameDev] = useState("");
  const [devOpsTool, setDevOpsTool] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [freeLogo, setFreeLogo] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

  const { user } = useSelector((state) => state.currentUser);
  const navigate=useNavigate()
  const dispatch=useDispatch()

  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");

  // store selected video files
  const [videoFiles,setVideoFiles]=useState([])
 

  // handle video change and update the videoFiles array
  const handleVideoFilesChange=useCallback((event)=>{
  
    // update the file variable
    let files=[...event.target.files]

    // no course video file selected
    if (files.length>0) setVideoFiles(files)

    },[])


   // handle control of the file replacement change
   const handleVideoReplace=(fileReplace,video,index)=>{
    // return videos not contain the focused video to replace
    let filteredFileVideos=videoFiles.filter(file=>file.name!==video.name)
    // check if the video replacement exists and return
    if (filteredFileVideos.some(file=>file.name===fileReplace.name)) return

    // update the filtered videos with fileReplace video at the passed index
    filteredFileVideos[index]=fileReplace

    // update the videoFiles with this new files
    setVideoFiles([...filteredFileVideos])
  }

  // close freeLogo
  const handleCloseFreeLogo = () => {
    setFreeLogo("");
    setIsFreeLogo(false);
  };


  //handle free logo when button clicked
  const handleFreeLogoPick = () => {
    // free logo shown for picks
    setIsFreeLogo(true);
    // clear file upload
    setImageUpload(null);
  };

  // handle the text of free logo that been selected
  const handleFreeLogoSelection=(event)=>{
    // update the value of free logo text
    setFreeLogo(event.target.value)

    // update the preview image since this ain't be sent to cloud but is
    // freely saved in the react images server folder
    setPreviewImage(getImageMatch(event.target.value))
    
  }

 
  //   handle file change and compress the image
  const handleFileChangeBannerLogo = async (event) => {
    // false free logo pick
    handleCloseFreeLogo()

    // update the file value
    const file = event.target.files[0];

    // compress the file using the custom utility created
    const compressedFile = await BrowserCompress(file);

    // compressed file update
    setImageUpload(compressedFile);

    // create an object from URI of the image for local preview
    setPreviewImage(URL.createObjectURL(compressedFile));
  };



  // handle core any errors
  const handleAnyErrors = () => {
    // holds the uploaded videoFiles size, max is 1GB per course
    let sum=0

     // get the total size of the selected files.
     videoFiles.forEach(file=>{
      // get file size in MB
      let fileMB=Math.ceil((file.size)/(MB_CONVERSION))

      // sum in megabytes
      sum+=fileMB
    })

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


    if (!imageUpload) {
      if (freeLogo?.toLowerCase().trim() === " ") {
        setErrorMessage("provide course logo");
        return false;
      }
    }

    
    // file size exceed 60MB alert courses max is 600MB
    if (sum>MAX_COURSE) {
      setErrorMessage("whole course exceeded 600MB !")
      // clear the videos by setting the length 0
      videoFiles.length=0
      return
    }


    // uploaded files should be videos only
    if (!videoFiles.every(file=>file.type.includes('video'))) {
      setErrorMessage('Lectures should be video files only !')
      // clear files
      videoFiles.length=0
      return
    }

    // ensure each file is less than 50MB
    if (videoFiles.some(file=>file.size>FILE_MAX)) {
      setErrorMessage('Each lecture should not exceed 50MB !')
      // clear files
      videoFiles.length=0
      return
    }


    return true;
  };

  // useEffect hook for updating category values
  useEffect(() => {
    // handle the value for backend
    const updatePostCategoryValue = () => {

      // if programming language is the category
       if (postCategory.toLowerCase().includes("languages")) {
        setCategory1(progLanguage)
      }

      // for frontend  category 1 will be tool, category 2 will be UI library
      if (postCategory.toLowerCase().includes("frontend")) {
        setCategory1(frontend)
        setCategory2(frontendUI)
      }

      if (postCategory.toLowerCase().includes("backend")) {
        setCategory1(backend);
        setCategory2(database);
      }
      if (postCategory.toLowerCase().includes("database")) {
        setCategory1(database);
      }

      if (postCategory.toLowerCase().includes("fullstack")) {
        setCategory1(frontend);
        setCategory2(backend);
        setCategory3(database);
        setCategory4(frontendUI)
      }
    };

    updatePostCategoryValue();
  }, [postCategory, backend, database, frontend,frontendUI,progLanguage]);


  
// handle closing of the modal
const handleClosingModal=()=>{
  // close the modal
  setOpenModalCourse(false)
  // clear video files
  videoFiles.length=0
  //clear other details
  setImageUpload(null)
  setPostCategory("")
  setTitle("")
  setDescription("")
  setFreeLogo("")
  setCategory1("")
  setCategory2("")
  setCategory3("")
  setCategory4("")
}


  // extracting current logged in user details from the redux store
  const instructorId=user?._id
  const instructorName = user?.name;
  const instructorTitle = user?.specialisationTitle;
  const instructorAvatar = user?.avatar;

  const courseObject = {
    course_instructor: {
      instructorId,
      instructorName,
      instructorTitle,
      instructorAvatar
    },
    course_title: title,
    course_description: description,
    course_category: {
      main: postCategory,
      sub1: category1,
      sub2: category2,
      sub3: category3,
      sub4: category4
    },
    course_video_lectures:[],
    course_video_topics:[],
    course_logo: {
      logoLink:freeLogo,
      logoID:""

    },
  };




  // handle posting of data to the backend
  const handleUploadCourse = () => {

     // clear any message errors
    setErrorMessage("")

    // core fields not empty
    if (handleAnyErrors()) {
      // create a form which will facilitate parsing of the file for upload to cloud
      let formData = new FormData();

      // append post body after stringify it due to form data
      formData.append("course", JSON.stringify(courseObject));

      if (videoFiles.length>0) {
        videoFiles.forEach(element => {
          formData.append("videos",element)
        });
      }
    
      // holds image logo if present
      if (imageUpload) {
        // append image logo for the course
        formData.append("image", imageUpload);
      }

    // set is uploading true
    setIsUploading(true);

    // axios post data to the backend
      axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/create`,
          formData,
          {
            withCredentials: true,
          },
          
        )
        .then((res) => {
          // show success post snack controlled by redux
          dispatch(updateCurrentSnackPostSuccess(res.data));
          // close the current modal
          setOpenModalCourse(false);
          // navigate to home route by default
          navigate("/");
          
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
    if (CustomLandScape() ||CustomLandscapeWidest() || (CustomDeviceTablet() && !isTabSideBar)) {
      return "40%"
    } else if (CustomDeviceTablet()){
      return "90%"
    } 
    return "95%"
  }

  
  return (
    <StyledModalPost
    keepMounted
    open={openModalCourse}
    onClose={!isUploading && handleClosingModal}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
      <Box
      width={handleReturnWidthModal()}
      borderRadius={3}
      bgcolor={isDarkMode ? "background.default" : "#f1f1f1"}
      color={"text.primary"}
      sx={{
        border:"1px solid gray",
        borderColor:'divider',
        marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        
      }}
    >
        <Box
          bgcolor={"background.default"}
          borderRadius={3}
          className="shadow-lg"
          sx={{ 
          border:"1px solid gray",
          borderColor:'divider',
           }}
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mr={1.5}
          >
            {/* logo */}
            <Box>
              <Avatar
               sx={{ width: 60, height: 60 }} 
               src={AppLogo} alt="logo" />
            </Box>

             {/* title */}
              <Typography
                variant="body2"
                width={"100%"}
                fontWeight={"bold"}
                textAlign={"center"}
              >
                {title.length===0 ? "Course Upload":title}
              </Typography>

            {/*close icon */}
            <IconButton 
            sx={{
                border:'1px solid',
                borderColor:'divider',
              }}
            onClick={handleClosingModal}>
              <Tooltip title={"close"}>
                <Close 
                  sx={{ 
                  width:12,
                  height:12,
                 }}
                />
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
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <FormHelperText>{errorMessage}</FormHelperText>
                </Alert>
              </Collapse>
            ) : (
              isUploading && (
                <Box 
                display={'flex'}
                 alignItems={'center'}
                 mb={1}                 
                 >
                  {/* progress circle */}
                  <CircularProgress size={"25px"} />
                </Box>
              )
            )}
          </Box>

          <Box
            maxHeight={'78vh'}
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
              <Box >
                <Typography
                  gutterBottom
                  mb={2}
                  variant="caption"
                >
                  - Course uploaded should be your own intellectual property. The full course should not exceed 600MB in size. 
                    Course should be uploaded in lectures or parts of 50MB Max and labeled in the format of "lecture_1_introduction", 
                    "lecture_2_variables" etc. This will ease the algorithm in sorting your overall course and maintaining the flow of 
                    concepts as intended.
                    <br/>
                  - We do not buy or sell courses on the platform but rather providing learning 
                  resources freely to the technocrats. Interested users will get enrolled and learn for free. Only certificate of completion 
                  is paid for and your name shall be printed on the certificate as the chief instructor. <br/>
                  - Certificate of completion is optional and cannot limit the user from learning the 
                  uploaded course. Only when the user is satisfied to download the certificate for reference they shall have 
                    to pay for it.
                   <br/>
                  - Certificate of completion minimum price is $1 and max is $10. Course uploaded shall be reviewed continuously 
                  to determine its genuineness to the end users. Rogue courses are prohibited and shall lead to permanent deletion of your account
                  with or without your consent.
                </Typography>
              
                <Divider component={'div'} className={'p-2'}/>
            
                <Typography variant="body2" mt={3} color={"text.secondary"}>
                  Provide a relevant course title that will be displayed to the
                  potential target groups on the platform. Use
                  simple and captivating titles.
                </Typography>

                <Box mt={4} className="w-100 mb-2">
                  <TextField
                    required
                    sx={{ textTransform:'capitalize' }}
                    value={title}
                    error={title.length > 100}
                    label={`Title ${100 - title.length}`}
                    placeholder="Complete Python Course"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
              </Box>

              {/* post about */}
              <Typography variant="body2" color={"text.secondary"}>
                Select area of specialisation your course is going to cover.
                For pure programming language concepts select programming languages.
              </Typography>

              <Box className="w-100 mb-2 mt-2 ">
                <TextField
                  required
                  select
                  value={postCategory}
                  label="Course specialisation"
                  fullWidth
                  onChange={(e) => setPostCategory(e.target.value)}
                >
                  {SpecialisationTech?.filter((about) => about !== "None").map(
                      (about) => (
                        <MenuItem
                          key={about}
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
              {postCategory === "Programming Languages" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select the programming language which your course will be
                    addressing in particular from the provided options.
                  </Typography>

                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={progLanguage}
                      label="Select Programming Language"
                      fullWidth
                      onChange={(e) => setProgLanguage(e.target.value)}
                    >
                      {SubsectionTech?.Language.map((language) => (
                          <MenuItem key={language} value={language}>
                            <Typography variant="body2">{language}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* frontend */}
              {(postCategory === "Frontend App Development" ||
                postCategory ===
                  "Fullstack App Development") && (
                <React.Fragment>
                  {/* frontend framework or library */}
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which frontend technology will your course be covering in
                    particular.For Courses based on bare HTML/CSS version,
                    select (HTML).
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
                      {SubsectionTech?.Frontend.map((frontend) => (
                          <MenuItem key={frontend} value={frontend}>
                            <Typography variant="body2">{frontend}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>

                  {/* frontend UI library */}
                  <Typography variant="body2" color={"text.secondary"} p={1}>
                    Which frontend UI Library have you used in styling your {!frontend.includes("none") && frontend} components in your course.
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

                </React.Fragment>
              )}

              {/* backend */}
              {(postCategory === "Backend App Development" ||
                postCategory ===
                  "Fullstack App Development") && (
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
                      {SubsectionTech?.Backend.map((backend) => (
                          <MenuItem key={backend} value={backend}>
                            <Typography variant="body2">{backend}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* Database */}
              {(postCategory === "Database Administration (SQL/NoSQL)" ||
                postCategory === "Backend App Development" ||
                postCategory ===
                  "Fullstack App Development") && (
                <React.Fragment>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Which database in particular will your course make
                    utilization of to facilitate storage of data? Suppose none
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
                      {SubsectionTech?.Database.map((database) => (
                          <MenuItem key={database} value={database}>
                            <Typography variant="body2">{database}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* Desktop App */}
              {postCategory === "Desktop App Development" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select desktop development technology that your course will
                    be based on such that the overall application runs on either
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
                      {SubsectionTech?.Desktop.map((desktop) => (
                          <MenuItem key={desktop} value={desktop}>
                            <Typography variant="body2">{desktop}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* DevOps */}
              {postCategory === "Developer Operations (DevOps+CI/CD)" && (
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
                      value={devOpsTool}
                      label="DevOps platform/tool"
                      fullWidth
                      onChange={(e) => setDevOpsTool(e.target.value)}
                    >
                      {SubsectionTech?.DevOps.map((devops_tool) => (
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
              {postCategory === "Game App Development" && (
                <React.Fragment>
                  <Typography variant="body2" color={"text.secondary"} mt={3}>
                    Select a game application development technology in
                    particular.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={gameDev}
                      label="game development technology"
                      fullWidth
                      onChange={(e) => setGameDev(e.target.value)}
                    >
                      {SubsectionTech?.GameDev.map((game_dev) => (
                          <MenuItem key={game_dev} value={game_dev}>
                            <Typography variant="body2">{game_dev}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* UI/UX  */}
              {postCategory === "UI/UX Design/Graphic Design" && (
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
                      {SubsectionTech?.Design.map((design_tool) => (
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
              {postCategory === "Native Android App Development" && (
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
                      {SubsectionTech?.Android.map((android) => (
                          <MenuItem key={android} value={android}>
                            <Typography variant="body2">{android}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* IOS App */}
              {postCategory === "Native IOS App Development" && (
                <React.Fragment>
                  <Typography variant="body2" mt={3} color={"text.secondary"}>
                    Select the stack used in your course for the development of
                    Native IOS Application project/post
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={iosDev}
                      label="IOS app development stack"
                      fullWidth
                      onChange={(e) => setIOSDev(e.target.value)}
                    >
                      {SubsectionTech?.IOS.map((ios) => (
                          <MenuItem key={ios} value={ios}>
                            <Typography variant="body2">{ios}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

              {/* Multiplatform Android+IOS */}
              {postCategory ===
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
                      {SubsectionTech?.Multiplatfotm.map((multiplatform) => (
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
              {postCategory === "Containerisation and Orchestration" && (
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
                      {SubsectionTech?.Containerisation.map((container) => (
                          <MenuItem key={container} value={container}>
                            <Typography variant="body2">{container}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </React.Fragment>
              )}

                {/* preview the file uploaded from storage */}
                {previewImage && (
                  <Box display={"flex"} justifyContent={"center"}>
                    <img
                      src={previewImage}
                      alt=""
                      className="rounded"
                      style={{
                        maxWidth: 100,
                      }}
                    />
                  </Box>
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
                      onChange={handleFreeLogoSelection}
                    >
                      {logoNamesOptions?.map((name, index) => (
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
                  </Box>
                )}

                

                {/* provide a logo for the course */}
                <Typography variant="body2" color={"text.secondary"}>
                  Upload course logo i.e python, nodejs, react, angular, google, 
                  flutter etc. that will be displayed alongside your course title.
                </Typography>

                <Box 
                display={"flex"}
                justifyContent={"space-around"}
                gap={1}
                alignItems={'center'}
                >
                  <Button
                    variant={freeLogo ? "outlined":"text"}
                    disableElevation
                    disabled={isUploading}
                    sx={{
                      textTransform: "lowercase", 
                      borderRadius: "20px" }}
                    onClick={handleFreeLogoPick}
                    size="medium"
                    startIcon={<DiamondRounded sx={{width:18,height:18}}/>}
                  >
                    Free
                  </Button>

                  

                  <Button
                    component="label"
                    role={undefined}
                    variant={imageUpload ? "outlined":"text"}
                    disableElevation
                    tabIndex={-1}
                    size="medium"
                    disabled={isUploading}
                    sx={{ 
                      textTransform: "lowercase",
                      borderRadius: "20px" }}
                    startIcon={<CloudUploadRounded sx={{width:17,height:17}}/>}
                  >
                    Upload
                    <StyledInput
                      type="file"
                      accept="image/*,"
                      onChange={handleFileChangeBannerLogo}
                    />
                  </Button>
                </Box>
              </React.Fragment>


              {/* upload video  */}
              <React.Fragment>
              <Typography
                  variant="body2"
                  mt={1}
                  mb={1}
                  color={"text.secondary"}
                >
                  Upload the course video lectures in chunks. max size 50MB each. 
                  adhere to the naming convention "lecture_1_intro". Overall course should not exceed 600MB.
                  lectures once uploaded cannot be edited!
                </Typography>


                {/* show selected videos */}
                {videoFiles?.map((video,index)=>(
                  <VideoPreviewComponent
                   key={video?.name}
                   video={video}
                   index={index}
                   handleVideoReplace={handleVideoReplace}
                   />
                  ))}

                <Box 
                display={"flex"} 
                justifyContent={"space-around"} 
                width={"100%"}>
                  <Button
                    component="label"
                    role={undefined}
                    disableElevation
                    variant={videoFiles.length>0 ? "outlined":"text"}
                    tabIndex={-1}
                    size="small"
                    sx={{
                      textTransform: "lowercase",
                      borderRadius: "20px",
                      
                    }}
                    startIcon={<CloudUploadRounded />}
                  >
                    Select Multiple Course Lectures
                    <StyledInput
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFilesChange}
                      multiple
                    />
                  </Button>
                </Box>

              </React.Fragment>

              <Typography variant="body2" color={"text.secondary"}>
                Provide course description explaining the key areas being tackled. 
                Clear description could convince many enrolling to your course.
              </Typography>

              <Box >
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 8}
                  multiline
                  contentEditable={false}
                  error={description.length > MAX_DESCRIPTION}
                  id="description-course_upload"
                  label={
                    <p>
                      {`Description  ${MAX_DESCRIPTION - description.length} characters`} *
                    </p>
                  }
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="whats on your mind..."
                />
              </Box>

              {/*  button for posting */}
              <Box 
               mb={2}>
               <Box
               display={'flex'}
              justifyContent={'center'}
               >
                <Typography gutterBottom variant="caption" color={"text.secondary"}>
                {videoFiles.length<3 ? "Please upload atleast 3 video lectures":"Please ensure you have a stable internet connection "}
              </Typography>
              </Box>
              <Box 
              display={'flex'}
              justifyContent={'center'}
              >
                <Button
                  onClick={handleUploadCourse}
                  startIcon={<SchoolRounded />}
                  variant="contained"
                  className="rounded-5"
                  size='medium'
                  disabled={isUploading || errorMessage || videoFiles.length<3}
                >
                  Begin Course Upload
                </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModalPost>
  );
};

export default PostCourseModal;
