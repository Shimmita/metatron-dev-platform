import {
  CloudUploadRounded,
  DiamondRounded,
  SchoolRounded
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Modal,
  styled,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  ModalBody,
  ModalHeader,
  ModalShell,
  SectionCard,
  SectionTitle,
  StatusBanner,
  StyledInput,
} from "./ModalShared";
import VideoPreviewComponent from "./VideoPreviewComponent";


// styled modal
const StyledModalPost = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});



// array for image names and values
const [logoNamesOptions, logoValueOptions] = getImageMatch("", true);

const MAX_DESCRIPTION = 500
const MAX_COURSE = 600
const FILE_MAX = 50000000
const MB_CONVERSION = 1024 * 1024

const PostCourseModal = ({ openModalCourse, setOpenModalCourse }) => {
  const [title, setTitle] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [progLanguage, setProgLanguage] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [frontendUI, setFrontendUI] = useState("")
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
  const [other, setOther] = useState("")

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark'

  const { user } = useSelector((state) => state.currentUser);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()

  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");

  // store selected video files
  const [videoFiles, setVideoFiles] = useState([])


  // handle video change and update the videoFiles array
  const handleVideoFilesChange = useCallback((event) => {

    // update the file variable
    let files = [...event.target.files]

    // no course video file selected
    if (files.length > 0) setVideoFiles(files)

  }, [])


  // handle control of the file replacement change
  const handleVideoReplace = (fileReplace, video, index) => {
    // return videos not contain the focused video to replace
    let filteredFileVideos = videoFiles.filter(file => file.name !== video.name)
    // check if the video replacement exists and return
    if (filteredFileVideos.some(file => file.name === fileReplace.name)) return

    // update the filtered videos with fileReplace video at the passed index
    filteredFileVideos[index] = fileReplace

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
  const handleFreeLogoSelection = (event) => {
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
    let sum = 0

    // get the total size of the selected files.
    videoFiles.forEach(file => {
      // get file size in MB
      let fileMB = Math.ceil((file.size) / (MB_CONVERSION))

      // sum in megabytes
      sum += fileMB
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
    if (sum > MAX_COURSE) {
      setErrorMessage("whole course exceeded 600MB !")
      // clear the videos by setting the length 0
      videoFiles.length = 0
      return
    }


    // uploaded files should be videos only
    if (!videoFiles.every(file => file.type.includes('video'))) {
      setErrorMessage('Lectures should be video files only !')
      // clear files
      videoFiles.length = 0
      return
    }

    // ensure each file is less than 50MB
    if (videoFiles.some(file => file.size > FILE_MAX)) {
      setErrorMessage('Each lecture should not exceed 50MB !')
      // clear files
      videoFiles.length = 0
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
  }, [postCategory, backend, database, frontend, frontendUI, progLanguage]);



  // handle closing of the modal
  const handleClosingModal = () => {
    // close the modal
    setOpenModalCourse(false)
    // clear video files
    videoFiles.length = 0
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
  const instructorId = user?._id
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
      main: other.trim().length > 2 ? other : postCategory,
      sub1: category1,
      sub2: category2,
      sub3: category3,
      sub4: category4
    },
    course_video_lectures: [],
    course_video_topics: [],
    course_logo: {
      logoLink: freeLogo,
      logoID: ""

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

      if (videoFiles.length > 0) {
        videoFiles.forEach(element => {
          formData.append("videos", element)
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

          // redux success to trigger success alert
          dispatch(updateCurrentSuccessRedux({ title: 'Course Uploaded', message: `${res.data} track your course status in the courses section and be able to interact with enrolled students.` }))

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
  const handleReturnWidthModal = () => {
    if (CustomLandScape() || CustomLandscapeWidest() ||
      (CustomDeviceTablet() && !isTabSideBar)) {
      return "40%"
    } else if (CustomDeviceTablet()) {
      return "90%"
    }
    return "95%"
  }


  return (
    <ModalShell
      open={openModalCourse}
    >

      {/* ── Header ── */}
      <ModalHeader
        title={title || "Course Upload"}
        subtitle={"upload your tech course and share your knowledge with the community"}
        onClose={handleClosingModal}
        disableClose={isUploading || Boolean(errorMessage)}
      />

      {/* ── Error / Loading ── */}
      <StatusBanner
        errorMessage={errorMessage}
        onDismiss={() => setErrorMessage("")}
        isUploading={isUploading}
      />


      <ModalBody>
        <Box display={"flex"} flexDirection={"column"} gap={3}>
          <Typography variant="body2" color={"text.secondary"}>
            Upload your original course content to share knowledge with the community. Total course size: 600MB max. Individual lectures: 50MB max, named as "lecture_1_title". Courses are free; only completion certificates are paid.
          </Typography>

          <SectionCard>
            <SectionTitle>Course Details</SectionTitle>
            <Typography variant="body2" color={"text.secondary"} mb={1.5}>
              Provide a clear, engaging title and description to attract potential students.
            </Typography>

            <Box mb={2}>
              <TextField
                required
                sx={{ textTransform: 'capitalize' }}
                value={title}
                error={title.length > 100}
                label={`Title ${100 - title.length}`}
                placeholder="Complete Python Course"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>

            <Box>
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
                placeholder="Describe the key areas covered in your course..."
              />
            </Box>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Specialisation</SectionTitle>
            <Typography variant="body2" color={"text.secondary"} mb={1.5}>
              Select the area of specialisation your course covers. For pure programming languages, choose "Programming Languages".
            </Typography>

            <Box mb={2}>
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
                      <CourseIcon option={about} />
                      <Typography variant="body2">{about}</Typography>
                    </MenuItem>
                  )
                )}
              </TextField>
            </Box>

            {postCategory.includes('Zero') && (
              <Box mb={2}>
                <TextField
                  fullWidth
                  disabled={isUploading}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  id="other category"
                  label="Provide Other Specialisation"
                  placeholder="Specify the specialisation"
                />
              </Box>
            )}

            {postCategory === "Programming Languages" && (
              <Box mb={2}>
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
            )}

            {(postCategory === "Frontend App Development" ||
              postCategory === "Fullstack App Development") && (
              <React.Fragment>
                <Box mb={2}>
                  <Typography variant="body2" color={"text.secondary"} mb={1}>
                    Select the frontend technology used in your course.
                  </Typography>
                  <TextField
                    required
                    select
                    value={frontend}
                    label="Frontend Framework"
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

                <Box mb={2}>
                  <Typography variant="body2" color={"text.secondary"} mb={1}>
                    Select the UI library used for styling.
                  </Typography>
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

            {(postCategory === "Backend App Development" ||
              postCategory === "Fullstack App Development") && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the backend technology used in your course.
                </Typography>
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
            )}

            {(postCategory === "Database Administration (SQL/NoSQL)" ||
              postCategory === "Backend App Development" ||
              postCategory === "Fullstack App Development") && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the database technology covered.
                </Typography>
                <TextField
                  required
                  select
                  value={database}
                  label="Database"
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
            )}

            {postCategory === "Desktop App Development" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the desktop development technology.
                </Typography>
                <TextField
                  required
                  select
                  value={desktop}
                  label="Desktop Technology"
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
            )}

            {postCategory === "Developer Operations (DevOps+CI/CD)" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the DevOps tool or platform.
                </Typography>
                <TextField
                  required
                  select
                  value={devOpsTool}
                  label="DevOps Tool"
                  fullWidth
                  onChange={(e) => setDevOpsTool(e.target.value)}
                >
                  {SubsectionTech?.DevOps.map((devops_tool) => (
                    <MenuItem key={devops_tool} value={devops_tool}>
                      <Typography variant="body2">{devops_tool}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            {postCategory === "Game App Development" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the game development technology.
                </Typography>
                <TextField
                  required
                  select
                  value={gameDev}
                  label="Game Development Technology"
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
            )}

            {postCategory === "UI/UX Design/Graphic Design" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the design tool used.
                </Typography>
                <TextField
                  required
                  select
                  value={designTool}
                  label="Design Tool"
                  fullWidth
                  onChange={(e) => setDesignTool(e.target.value)}
                >
                  {SubsectionTech?.Design.map((design_tool) => (
                    <MenuItem key={design_tool} value={design_tool}>
                      <Typography variant="body2">{design_tool}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            {postCategory === "Native Android App Development" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the Android development stack.
                </Typography>
                <TextField
                  required
                  select
                  value={android}
                  label="Android Stack"
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
            )}

            {postCategory === "Native IOS App Development" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the iOS development stack.
                </Typography>
                <TextField
                  required
                  select
                  value={iosDev}
                  label="iOS Stack"
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
            )}

            {postCategory === "Multiplatform App Development (Android+IOS)" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the multiplatform framework.
                </Typography>
                <TextField
                  required
                  select
                  value={multiplatform}
                  label="Multiplatform Framework"
                  fullWidth
                  onChange={(e) => setMultiplatform(e.target.value)}
                >
                  {SubsectionTech?.Multiplatform.map((multiplatform) => (
                    <MenuItem key={multiplatform} value={multiplatform}>
                      <Typography variant="body2">{multiplatform}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            {postCategory === "Containerisation and Orchestration" && (
              <Box mb={2}>
                <Typography variant="body2" color={"text.secondary"} mb={1}>
                  Select the containerisation technology.
                </Typography>
                <TextField
                  required
                  select
                  value={containerisation}
                  label="Containerisation Technology"
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
            )}
          </SectionCard>

          <SectionCard>
            <SectionTitle>Course Logo</SectionTitle>
            <Typography variant="body2" color={"text.secondary"} mb={1.5}>
              Add a course logo or choose a free icon so the course looks polished and easy to recognize.
            </Typography>

            {previewImage && (
              <Box display={"flex"} justifyContent={"center"} mb={2}>
                <img
                  src={previewImage}
                  alt=""
                  className="rounded"
                  style={{ maxWidth: 100 }}
                />
              </Box>
            )}

            {isFreeLogo && (
              <Box mb={2}>
                <TextField
                  required
                  disabled={isUploading || errorMessage}
                  select
                  value={freeLogo}
                  variant="standard"
                  label="Free Logos"
                  fullWidth
                  onChange={handleFreeLogoSelection}
                >
                  {logoNamesOptions?.map((name, index) => (
                    <MenuItem key={index} value={name} sx={{ display: "flex", gap: 2 }}>
                      <Avatar src={logoValueOptions[index]} sx={{ width: 32, height: 32 }} alt="" />
                      <Typography variant="body2">{name}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            <Box display={"flex"} justifyContent={"center"} gap={1} alignItems={"center"} flexWrap={"wrap"}>
              <Button
                variant={freeLogo ? "outlined" : "text"}
                disableElevation
                disabled={isUploading}
                sx={{ textTransform: "none", borderRadius: "20px" }}
                onClick={handleFreeLogoPick}
                size="medium"
                startIcon={<DiamondRounded sx={{ width: 18, height: 18 }} />}
              >
                Choose free icon
              </Button>

              <Button
                component="label"
                role={undefined}
                variant={imageUpload ? "outlined" : "text"}
                disableElevation
                tabIndex={-1}
                size="medium"
                disabled={isUploading}
                sx={{ textTransform: "none", borderRadius: "20px" }}
                startIcon={<CloudUploadRounded sx={{ width: 17, height: 17 }} />}
              >
                Upload logo
                <StyledInput
                  type="file"
                  accept="image/*,"
                  onChange={handleFileChangeBannerLogo}
                />
              </Button>
            </Box>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Course Lectures</SectionTitle>
            <Typography variant="body2" color={"text.secondary"} mb={1.5}>
              Upload lecture videos in sequence. Keep each file under 50MB, the full course under 600MB, and use clear names such as "lecture_1_introduction".
            </Typography>

            {videoFiles?.map((video, index) => (
              <VideoPreviewComponent
                key={video?.name}
                video={video}
                index={index}
                handleVideoReplace={handleVideoReplace}
              />
            ))}

            <Box display={"flex"} justifyContent={"center"} width={"100%"}>
              <Button
                component="label"
                role={undefined}
                disableElevation
                variant={videoFiles.length > 0 ? "outlined" : "text"}
                tabIndex={-1}
                size="small"
                sx={{ textTransform: "none", borderRadius: "20px" }}
                startIcon={<CloudUploadRounded />}
              >
                Select lecture videos
                <StyledInput
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFilesChange}
                  multiple
                />
              </Button>
            </Box>
          </SectionCard>

          <Box
            mb={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1.5}
          >
            <Typography gutterBottom variant="caption" color={"text.secondary"} mb={0}>
              {videoFiles.length < 3 ? "Upload at least 3 lecture videos before publishing this course." : "Course content looks ready for upload."}
            </Typography>
            <Button
              onClick={handleUploadCourse}
              startIcon={<SchoolRounded />}
              variant="contained"
              className="rounded-5"
              size="medium"
              disabled={isUploading || errorMessage || videoFiles.length < 3}
            >
              Publish course
            </Button>
          </Box>
        </Box>
      </ModalBody>
    </ModalShell>
  );
};

export default PostCourseModal;
