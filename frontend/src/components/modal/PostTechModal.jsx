import {
  CloudUploadRounded,
  DeleteRounded,
  DiamondRounded,
  PictureAsPdfRounded,
  PostAddRounded,
  Settings
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { lazy, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { updateCurrentSnackPostSuccess } from "../../redux/CurrentSnackBar";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import BrowserCompress from "../utilities/BrowserCompress";
import CourseIcon from "../utilities/CourseIcon";
import { getImageMatch } from "../utilities/getImageMatch";
import { PdfCanvasViewer } from "../custom/PostDocumentPreview";
import {
  ModalBody,
  ModalHeader,
  ModalShell,
  ModalWorkflowSteps,
  SectionCard,
  SectionTitle,
  StatusBanner
} from "./ModalShared";

const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));
const AlertInput = lazy(() => import("../alerts/AlertInput"));



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
const MAX_POST_IMAGES = 3;
const MAX_IMAGE_DESCRIPTION = 140;
const MAX_POST_PDF_SIZE = 20 * 1024 * 1024;

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PostTechModal = ({ openModalTech, setOpenModalTech }) => {
  const [postCategory, setPostCategory] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [database, setDatabase] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const uploadedImagesRef = useRef([]);
  const uploadedPdfRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [freeLogo, setFreeLogo] = useState("");
  const [isFreeLogo, setIsFreeLogo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [frontendUI, setFrontendUI] = useState("")
  const [group, setGroup] = useState("")
  const [other, setOther] = useState("")
  // for category 1, 2 and 3
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");

  // control opening and showing of the alert custom input
  const [openAlertML, setOpenAlertML] = useState(false);

  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  const { user } = useSelector((state) => state.currentUser);
  const { groups: groupData } = useSelector((state) => state.currentGroups);

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
      main: other.trim().length > 1 ? other : postCategory,
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
  }, [postCategory, backend, database, frontend, frontendUI]);


  // handle showing free logo menu
  const handleShowFreeLogo = () => {
    // clear file uploaded if any
    uploadedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    setUploadedImages([]);
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
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (uploadedImages.length + files.length > MAX_POST_IMAGES) {
      setErrorMessage(`You can attach up to ${MAX_POST_IMAGES} images`);
      event.target.value = "";
      return;
    }

    // compress the file using the custom utility created
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const compressedFile = await BrowserCompress(file);
        return compressedFile || file;
      })
    );

    setUploadedImages(
      (currentImages) => [
        ...currentImages,
        ...compressedFiles.map((file, index) => ({
          file,
          preview: URL.createObjectURL(file),
          description: "",
          position: currentImages.length + index + 1,
        })),
      ]
    );
    setFilePreview(null);
    event.target.value = "";
  };

  const handleImageDescriptionChange = (index, value) => {
    setUploadedImages((currentImages) =>
      currentImages.map((image, imageIndex) =>
        imageIndex === index
          ? { ...image, description: value.slice(0, MAX_IMAGE_DESCRIPTION) }
          : image
      )
    );
  };

  const handleRemoveUploadedImage = (index) => {
    const imageToRemove = uploadedImages[index];
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setUploadedImages((currentImages) =>
      currentImages
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({
          ...image,
          position: imageIndex + 1,
        }))
    );
  };

  const handlePdfFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setErrorMessage("Only PDF files can be attached");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_POST_PDF_SIZE) {
      setErrorMessage("PDF file must be 20MB or smaller");
      event.target.value = "";
      return;
    }

    if (uploadedPdf?.preview) {
      URL.revokeObjectURL(uploadedPdf.preview);
    }

    setUploadedPdf({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    });
    event.target.value = "";
  };

  const handleRemoveUploadedPdf = () => {
    if (uploadedPdf?.preview) {
      URL.revokeObjectURL(uploadedPdf.preview);
    }

    setUploadedPdf(null);
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
    if (postCategory?.trim() === "") {
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

    if (!freeLogo && uploadedImages.length === 0 && !uploadedPdf) {
      setErrorMessage("Provide an image or PDF for this post");
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

      // check if files are present then append them for upload
      if (uploadedImages.length > 0) {
        formData.append(
          "post_image_descriptions",
          JSON.stringify(uploadedImages.map((image) => image.description.trim()))
        );
        uploadedImages.forEach((image) => {
          formData.append("images", image.file);
        });
      }

      if (uploadedPdf) {
        formData.append("documents", uploadedPdf.file);
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
          dispatch(updateCurrentSuccessRedux({ title: 'Post Milestone Uploaded', message: `${res.data} your post is now visible to everyone on the platform for ${gitHub.length > 3 ? "likes, comments and GitHub review from users" : "likes and comments from users"} ` }))
          // close the current modal
          setOpenModalTech(false);
          // navigate to home route by default
          navigate("/explore");
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

  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
  }, [uploadedImages]);

  useEffect(() => {
    uploadedPdfRef.current = uploadedPdf;
  }, [uploadedPdf]);

  useEffect(() => {
    return () => {
      uploadedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
      if (uploadedPdfRef.current?.preview) {
        URL.revokeObjectURL(uploadedPdfRef.current.preview);
      }
    };
  }, []);

  const hasCoreDetails = Boolean(
    title.trim() &&
    title.length <= 50 &&
    description.trim() &&
    description.length <= 1000
  );
  const hasSpecialisation = Boolean(postCategory && (!postCategory.includes("Zero") || other.trim()));
  const hasBackendDetails = !postCategory.includes("Backend") || Boolean(backend && database);
  const hasFrontendDetails =
    !postCategory.includes("Frontend") || Boolean(frontend && frontendUI);
  const hasFullstackDetails =
    postCategory !== "Fullstack App Development" ||
    Boolean(frontend && frontendUI && backend && database);
  const hasSimpleCategoryDetails =
    ![
      "Containerization and Orchestration",
      "Artificial Intelligence",
      "Data Science and Analytics",
      "Cybersecurity Engineering",
      "Desktop App Development",
      "Game App Development",
      "Programming Languages",
      "Cloud Computing",
      "DevOps Engineering",
      "UI/UX Design",
      "Native Android App Development",
      "Native IOS App Development",
      "Multiplatform Mobile Development",
      "Database Administration",
    ].includes(postCategory) || Boolean(category1 || database);
  const hasCategoryDetails = Boolean(
    hasSpecialisation &&
    hasBackendDetails &&
    hasFrontendDetails &&
    hasFullstackDetails &&
    hasSimpleCategoryDetails
  );
  const hasMedia = Boolean(freeLogo || uploadedImages.length > 0 || uploadedPdf);
  const techWorkflowSteps = [
    { label: "Post details", helper: "Title and professional summary" },
    { label: "Tech focus", helper: "Specialisation and stack details" },
    { label: "Media", helper: `Add images or a PDF up to ${formatFileSize(MAX_POST_PDF_SIZE)}` },
    { label: "Reach", helper: "Optional repository and community" },
    { label: "Publish", helper: "Review readiness and submit" },
  ];
  const techStepChecks = [
    hasCoreDetails,
    hasCategoryDetails,
    hasMedia,
    true,
    hasCoreDetails && hasCategoryDetails && hasMedia,
  ];
  const techActiveStepIndex = techStepChecks.findIndex((isReady) => !isReady);
  const techActiveStep =
    techActiveStepIndex === -1 ? techWorkflowSteps.length - 1 : techActiveStepIndex;


  return (
    <ModalShell
      open={openModalTech}
    >
      {/* ── Header ── */}
      <ModalHeader
        title={title || "Tech Post"}
        subtitle={"share with the community milestone or project related to tech"}
        onClose={handleClosingModal}
        disableClose={isUploading || Boolean(errorMessage)}
      />

      {/* ── Error / Loading ── */}
      <StatusBanner
        errorMessage={errorMessage}
        onDismiss={() => setErrorMessage("")}
        isUploading={isUploading}
      />

      <ModalWorkflowSteps
        steps={techWorkflowSteps.map((step, index) => ({
          ...step,
          completed: techStepChecks[index],
        }))}
        activeStep={techActiveStep}
      />

      <ModalBody>
        <Box display={"flex"} flexDirection={"column"}>
          <SectionCard>
            <SectionTitle variant="h6">Post Title</SectionTitle>
            <Typography variant="body2" color={"text.secondary"} mb={2}>
              Provide relevant title for this post to help target users on
              the platform to bootstrap your objectives or motives at
              glance.
            </Typography>

            <Box mt={2} className="w-100 ">
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
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="h6">Post Description</SectionTitle>
            <Typography
              variant="body2"
              mb={2}
              color={"text.secondary"}>
              Write a concise, professional summary that explains the context, the technical decisions, and the value of what you are sharing.
            </Typography>

            <Box mb={2}>
              <TextField
                minRows={5}
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
                placeholder="Summarize the milestone, approach, tools used, and what kind of feedback or collaboration you are looking for."
              />
            </Box>
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="h6">Specialisation</SectionTitle>
            {/* post about */}
            <Typography variant="body2" color={"text.secondary"} mb={2}>
              Provide area of specialisation in the Tech or IT Industry where
              your post is aimed to address in particular.
            </Typography>

            <Box className="w-100 ">
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

            {/* other category */}
            {postCategory.includes('Zero') && (
              <Box className="mb-2">
                <Typography variant="body2" mb={2} color={"text.secondary"}>
                  You have selected option other, provide the other specialization or category
                  that your post aims to address.
                </Typography>
                <TextField
                  fullWidth
                  disabled={isUploading}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  id="other category"
                  label={"Provide Other"}
                  placeholder={'provide other'}
                />
              </Box>
            )}
          </SectionCard>

          {/* Containerization  */}
          {postCategory === "Containerization and Orchestration" && (
            <SectionCard>
              <SectionTitle variant="h6">Containerization Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Containerization and Orchestration option that your post
                aims to enlighten to other potential users on the platform.
              </Typography>
              <Box className="w-100">
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
            </SectionCard>
          )}

          {/* machine learning and artificial intelligence */}
          {postCategory === "Artificial Intelligence" && (
            <SectionCard>
              <SectionTitle variant="h6">AI/ML Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Provide specific area of focus in the field of Machine
                Learning and Artificial Intelligence, select option zero if
                none matches to provide your preference.
              </Typography>
              <Box className="w-100 ">
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
            </SectionCard>
          )}

          {/* data science */}
          {postCategory === "Data Science and Analytics" && (
            <SectionCard>
              <SectionTitle variant="h6">Data Science Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Select the area of focus in the field of data science and
                analysis in particular.
              </Typography>
              <Box className="w-100 ">
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
            </SectionCard>
          )}

          {/* cybersecurity */}
          {postCategory === "Cybersecurity Engineering" && (
            <SectionCard>
              <SectionTitle variant="h6">Cybersecurity Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Select the area of focus in the field of cybersecurity
                engineering.This prevents being too general in broader
                fields.
              </Typography>
              <Box className="w-100 ">
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
            </SectionCard>
          )}

          {/* Desktop App */}
          {postCategory === "Desktop App Development" && (
            <SectionCard>
              <SectionTitle variant="h6">Desktop Development Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Desktop development stack used in your project. Desktop
                applications usually runs on high-end devices such as
                Laptops and PCs.
              </Typography>

              <Box mt={4} className="w-100 ">
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
            </SectionCard>
          )}

          {/* Game dev */}
          {postCategory === "Game App Development" && (
            <SectionCard>
              <SectionTitle variant="h6">Game Development Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Provide game application development technology that your
                post is aimed to address in particular from the provided
                options.
              </Typography>
              <Box mt={4} className="w-100">
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
            </SectionCard>
          )}

          {/* programming Language */}
          {postCategory === "Programming Languages" && (
            <SectionCard>
              <SectionTitle variant="h6">Programming Language Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Select programming language that you are interested to post
                about from the options provided below.
              </Typography>

              <Box mt={4} className="w-100">
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
            </SectionCard>
          )}

          {/* cloud computing */}
          {/* DevOps */}
          {postCategory === "Cloud Computing" && (
            <SectionCard>
              <SectionTitle variant="h6">Cloud Computing Details</SectionTitle>
              <Typography

                gutterBottom
                variant="body2"
                color={"text.secondary"}
                mb={2}
              >
                Select cloud provider in particular that you are interested
                to address in your post.
              </Typography>
              <Box className="w-100">
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
            </SectionCard>
          )}

          {/* DevOps */}
          {postCategory === "DevOps Engineering" && (
            <SectionCard>
              <SectionTitle variant="h6">DevOps Details</SectionTitle>
              <Typography
                gutterBottom
                variant="body2"
                color={"text.secondary"}
                mb={2}
              >
                Select DevOps engineering platform or tool that was used as
                reference for your post.
              </Typography>
              <Box className="w-100 ">
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
            </SectionCard>
          )}

          {/* UI/UX  */}
          {postCategory === "UI/UX Design" && (
            <SectionCard>
              <SectionTitle variant="h6">UI/UX Design Details</SectionTitle>
              <Typography variant="body2" color={"text.secondary"} mb={2}>
                Provide UI/UX design tool which your post covers and aims to
                enlighten potential target users on the platform.
              </Typography>
              <Box className="w-100">
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
            </SectionCard>
          )}

          {/* frontend */}
          {(postCategory === "Frontend App Development" ||
            postCategory === "Fullstack App Development") && (
              <SectionCard>
                <SectionTitle variant="h6">Frontend Details</SectionTitle>
                <Typography variant="body2" mb={2} color={"text.secondary"}>
                  Which frontend technology are you interested in? If your post
                  is based on a bare HTML/CSS/Js version of a project, select
                  the option with (HTML).
                </Typography>
                <Box mb={2} className="w-100">
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
                <Typography variant="body2" color={"text.secondary"} mb={2}>
                  Which frontend UI/UX design library have you used in styling your {!frontend.includes("none") && frontend}
                  components for your project or milestone post.
                </Typography>
                <Box className="w-100">
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
              </SectionCard>
            )}

          {/* backend */}
          {(postCategory === "Backend App Development" ||
            postCategory === "Fullstack App Development") && (
              <SectionCard>
                <SectionTitle variant="h6">Backend Details</SectionTitle>
                <Typography variant="body2" color={"text.secondary"} mb={2}>
                  Which backend technology are you interested in? Suppose none
                  of the provided options matches your preference select
                  (other).
                </Typography>
                <Box className="w-100">
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
              </SectionCard>
            )}

          {/* Database */}
          {(postCategory === "Database Administration" ||
            postCategory === "Backend App Development" ||
            postCategory === "Fullstack App Development") && (
              <SectionCard>
                <SectionTitle variant="h6">Database Details</SectionTitle>
                <Typography variant="body2" mb={2} color={"text.secondary"}>
                  Which database did you link it with {backend} for this post.
                  suppose none of the provided options matches your preference
                  select (other).
                </Typography>
                <Box className="w-100 ">
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
              </SectionCard>
            )}

          {/* Android App */}
          {postCategory === "Native Android App Development" && (
            <SectionCard>
              <SectionTitle variant="h6">Android Development Details</SectionTitle>
              <Typography mb={2} variant="body2" color={"text.secondary"}>
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
            </SectionCard>
          )}

          {/* IOS App */}
          {postCategory === "Native IOS App Development" && (
            <SectionCard>
              <SectionTitle variant="h6">iOS Development Details</SectionTitle>
              <Typography mb={2} variant="body2" color={"text.secondary"}>
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
            </SectionCard>
          )}

          {/* Multiplatform Android+IOS */}
          {postCategory === "Multiplatform Mobile Development" && (
            <SectionCard>
              <SectionTitle variant="h6">Multiplatform Development Details</SectionTitle>
              <Typography variant="body2" mb={2} color={"text.secondary"}>
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
            </SectionCard>
          )}



          <SectionCard>
            <SectionTitle variant="h6">Post Media</SectionTitle>
            <Typography
              gutterBottom
              mb={2}
              variant="body2"
              color={"text.secondary"}>
              Add up to {MAX_POST_IMAGES} images or attach one PDF document up to {formatFileSize(MAX_POST_PDF_SIZE)} for specs, case studies, diagrams, or technical write-ups.
            </Typography>

            {/* preview the file uploaded from storage */}
            {freeLogo && (
              <Box display={"flex"} justifyContent={"center"}>
                <img
                  src={filePreview}
                  alt="Selected post logo"
                  className="rounded"
                  style={{
                    maxWidth: 100,
                  }}
                />
              </Box>
            )}

            {uploadedImages.length > 0 && (
              <Box mb={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                  mb={1}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    {uploadedImages.length}/{MAX_POST_IMAGES} images added
                  </Typography>
                  {uploadedImages.length > 1 && (
                    <Typography variant="caption" color="primary.main" fontWeight={900}>
                      Scroll to review
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: uploadedImages.length > 1 ? "auto" : "hidden",
                    scrollSnapType: uploadedImages.length > 1 ? "x mandatory" : "none",
                    pb: uploadedImages.length > 1 ? 0.75 : 0,
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(214,178,94,0.34)",
                      borderRadius: 999,
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(214,178,94,0.34) transparent",
                  }}
                >
                  {uploadedImages.map((image, index) => (
                    <Box
                      key={`${image.file.name}-${index}`}
                      sx={{
                        flex:
                          uploadedImages.length > 1
                            ? { xs: "0 0 86%", sm: "0 0 58%", md: "0 0 46%" }
                            : "1 1 100%",
                        minWidth: 0,
                        scrollSnapAlign: "start",
                        border: "1px solid rgba(139,111,42,0.14)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.56)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          aspectRatio: "4 / 3",
                          background: "rgba(0,0,0,0.06)",
                        }}
                      >
                        <Box
                          component="img"
                          src={image.preview}
                          alt={`Uploaded media ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            px: 1,
                            py: 0.35,
                            borderRadius: "8px",
                            background: "rgba(3,7,18,0.72)",
                            color: "#fff",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <Typography variant="caption" fontWeight={900}>
                            Image {index + 1}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove image" arrow>
                          <IconButton
                            size="small"
                            disabled={isUploading}
                            onClick={() => handleRemoveUploadedImage(index)}
                            sx={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              color: "#fff",
                              background: "rgba(3,7,18,0.66)",
                              border: "1px solid rgba(255,255,255,0.18)",
                              "&:hover": {
                                background: "rgba(239,68,68,0.72)",
                              },
                            }}
                          >
                            <DeleteRounded sx={{ width: 16, height: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Box p={1}>
                        <TextField
                          fullWidth
                          multiline
                          minRows={2}
                          disabled={isUploading}
                          value={image.description}
                          label={`Image ${index + 1} brief ${MAX_IMAGE_DESCRIPTION - image.description.length}`}
                          placeholder="Add a short note for this image"
                          onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {uploadedPdf && (
              <Box
                mb={2}
                sx={{
                  border: "1px solid rgba(139,111,42,0.16)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.56)",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                  p={1}
                  sx={{
                    borderBottom: "1px solid rgba(139,111,42,0.12)",
                    background: "rgba(255,255,255,0.62)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                    <PictureAsPdfRounded color="primary" sx={{ width: 20, height: 20 }} />
                    <Box minWidth={0}>
                      <Typography variant="body2" fontWeight={900} noWrap>
                        {uploadedPdf.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF - {formatFileSize(uploadedPdf.size)}
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Remove PDF" arrow>
                    <IconButton
                      size="small"
                      disabled={isUploading}
                      onClick={handleRemoveUploadedPdf}
                    >
                      <DeleteRounded color="primary" sx={{ width: 17, height: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <PdfCanvasViewer viewUrl={uploadedPdf.preview} fileName={uploadedPdf.name} />
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
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
              flexWrap={"wrap"}
            >
              <Button
                variant={freeLogo ? "outlined" : "text"}
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
                variant={uploadedImages.length > 0 ? "outlined" : "text"}
                disableElevation
                disabled={isUploading || uploadedImages.length >= MAX_POST_IMAGES}
                tabIndex={-1}
                id="upload_text_btn"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
                startIcon={<CloudUploadRounded />}
              >
                {uploadedImages.length >= MAX_POST_IMAGES
                  ? "Maximum reached"
                  : uploadedImages.length > 0
                    ? `Add image ${uploadedImages.length + 1}`
                    : "Add image"}
                <StyledInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              <Button
                component="label"
                role={undefined}
                variant={uploadedPdf ? "outlined" : "text"}
                disableElevation
                disabled={isUploading}
                tabIndex={-1}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
                startIcon={<PictureAsPdfRounded />}
              >
                {uploadedPdf ? "Replace PDF" : "Add PDF"}
                <StyledInput
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfFileChange}
                />
              </Button>
            </Box>
          </SectionCard>


          <SectionCard>
            <SectionTitle variant="h6">GitHub Link</SectionTitle>
            {/* Github link */}
            <Typography
              variant="body2"
              mb={2}
              color={"text.secondary"}>
              If this post relates to a live project, repository, or technical write-up, include the link so people can review the work directly.
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
          </SectionCard>


          <SectionCard>
            <SectionTitle variant="h6">Group Tagging</SectionTitle>
            {/* group tagging */}
            <Typography
              variant="body2"
              mb={2}
              color={"text.secondary"}>
              Group tagging is optional, but it can help your post reach the most relevant technical community faster.
            </Typography>

            <Box className="mb-2">
              <TextField
                disabled={isUploading || errorMessage || groupData?.filter(group => group.isMember).length === 0}
                select
                value={group}
                variant="standard"
                label={`${groupData?.filter(group => group.isMember).length ? "Tag Group or Community" : "Join a group or community"}`}
                fullWidth
                onChange={(e) => setGroup(e.target.value)}
              >
                {
                  groupData?.filter(group => group.isMember)?.map((group) => (
                    <MenuItem
                      key={group.name}
                      value={group.name}
                      sx={{ display: "flex", gap: 2 }}
                    >
                      {group.name.includes("System Design and Principles") ?
                        (<Settings sx={{ width: 34, height: 34 }} />) :
                        <Avatar
                          sx={{
                            width: 34, height: 34
                          }}
                          src={getImageMatch(group.name.split(","), false, true)}
                          alt="" />}
                      {/* name */}
                      <Typography variant="body2">{group.name}</Typography>
                    </MenuItem>
                  ))}

              </TextField>
            </Box>
          </SectionCard>

          {/*  button for posting */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1.5}
            mb={2}
          >
            <Typography variant="caption" color="text.secondary">
              Your post will appear in the community feed after upload.
            </Typography>
            <Button
              onClick={handlePost}
              variant="contained"
              size='medium'
              className='rounded-5'
              startIcon={<PostAddRounded />}
              disabled={isUploading || errorMessage}
            >
              Publish tech post
            </Button>
          </Box>
        </Box>
      </ModalBody>

      {/* alert for preferred machine learning area input */}
      {openAlertML &&
        <AlertInput
          openAlert={openAlertML}
          setOpenAlert={setOpenAlertML}
          setCustomArea={setCategory1}
          title={title_ml_area}
          body={body_ml_are}
        />}

      {/* show logout session expired alert */}
      {openAlertLogout &&
        <LogoutAlert
          openAlertLogout={openAlertLogout}
          setOpenAlertLogout={setOpenAlertLogout}
          title="Session Expired"
          body="please login to complete your request, your session has expired."
        />}
    </ModalShell>
  );
};

export default PostTechModal;
