import {
  Add,
  AndroidRounded,
  Apple,
  Close,
  CodeRounded,
  DrawRounded,
  EditRounded,
  GitHub,
  GradeRounded,
  Image,
  LaptopRounded,
  LocationOnRounded,
  Microsoft,
  PictureAsPdfRounded,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinuxLogo from "../../images/linux.jpeg";
import AppLogo from "../../images/logo_sm.png";
import CountiesInKenya from "../data/Counties";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

// styled modal
const StyledModalPost = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const PostTechModal = ({ openModalTech, setOpenModalTech }) => {
  const [post_category, setPostAbout] = useState("");
  const [containerisation, setContainerisation] = useState("");
  const [game_dev, setGameDev] = useState("");
  const [desktop, setDesktop] = useState("");
  const [pro_language, setProgLanguage] = useState("");
  const [ios_dev, setIOSDev] = useState("");
  const [backend, setBackend] = useState("");
  const [frontend, setFrontend] = useState("");
  const [designTool, setDesignTool] = useState("");
  const [multiplatform, setMultiplatform] = useState("");
  const [cloudComputing, setCloudComputing] = useState("");
  const [database, setDatabase] = useState("");
  const [android, setAndroid] = useState("");
  const [devops_tool, setDevOpsTool] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [county, setCounty] = useState("");
  const [imagePathNet, setImagePathNet] = useState("");
  const [imagePathFile, setImagePathFile] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);

  // control showing of the the input of the file either URL or from filesystem
  const [isURLFile, setIsUrlFile] = React.useState(true);

  const [fileLink, setFileLink] = React.useState(0);
  // handle showing follow, connect or event
  const handleChange = (event, update) => {
    setFileLink(update);
  };

  useEffect(() => {
    // change the state of the IsUrl property
    fileLink === 1 ? setIsUrlFile(true) : setIsUrlFile(false);
  }, [fileLink]);

  // file input toggle
  const FileInputToggle = () => (
    <Box>
      <ToggleButtonGroup
        value={fileLink}
        exclusive
        color="primary"
        onChange={handleChange}
      >
        <ToggleButton value={0}>
          <Typography
            fontWeight={"bold"}
            fontSize={"xx-small"}
            variant="caption"
          >
            File
          </Typography>
        </ToggleButton>
        <ToggleButton value={1}>
          <Typography
            fontWeight={"bold"}
            fontSize={"xx-small"}
            variant="caption"
          >
            Link
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  return (
    <StyledModalPost
      keepMounted
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      open={openModalTech}
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
              startIcon={<Add />}
              className="w-50 rounded-5 shadow-sm"
              variant="contained"
              disabled={!post_category.length > 0 || description.length > 1000}
              size="small"
            >
              Post
            </Button>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalTech(false)}>
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
                {/* post title */}
                <Box
                  className="my-2"
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Title color="primary" sx={{ width: 30, height: 30 }} />
                </Box>
                <Typography
                  component={"li"}
                  variant="body2"
                  mt={3}
                  color={"text.secondary"}
                >
                  Provide a relevant title about this post so that users can
                  bootstrap what your have been trying to achieve.
                </Typography>

                <Box mt={4} className="w-100 mb-2">
                  <TextField
                    required
                    value={title}
                    label="provide title"
                    placeholder="AWS S3 Bucket CRUD"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
              </Box>

              <Box display={"flex"} justifyContent={"center"}>
                <GradeRounded color="primary" sx={{ width: 30, height: 30 }} />
              </Box>
              {/* post about */}
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Posting about which IT specialisation. This helps us to
                customize and categorise tech-related content to all users
                accordingly by the help of a pre-trained machine learning model.
              </Typography>

              <Box className="w-100 mb-2 mt-2 ">
                <TextField
                  required
                  select
                  value={post_category}
                  label="post specialisation"
                  fullWidth
                  onChange={(e) => setPostAbout(e.target.value)}
                >
                  {SpecialisationTech &&
                    SpecialisationTech.filter((about) => about !== "None").map(
                      (about, index) => (
                        <MenuItem key={index} value={about}>
                          <small style={{ fontSize: "small" }}>{about}</small>
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Box>

              {/* Containerisation  */}
              {post_category === "Containerisation and Orchestration" && (
                <Box>
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Containerisation option
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={containerisation}
                      label="select containerisation technology"
                      fullWidth
                      onChange={(e) => setContainerisation(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Containerisation.map((container) => (
                          <MenuItem key={container} value={container}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
                    Select desktop development stack that runs on either Linux
                    OS, MacOS, Windows OS or both. Desktop apps usually runs on
                    high-end devices such as Laptops and PCs and should not be
                    mistaken for Android or IOS operating system which powers
                    smartphones, tablets and ipads.
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
                    Programming language to post about
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

              {/* DevOps */}
              {post_category === "Developer Operations (DevOps+CI/CD)" && (
                <Box>
                  <Typography
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select a DevOps Platform/Tool
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
                    UI/UX Design Tools option
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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
                post_category ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <Box>
                  <Box mt={2} display={"flex"} justifyContent={"center"}>
                    <LaptopRounded
                      color="primary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </Box>

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Which frontend technology are you intrested in? If your post
                    is based on a bare HTML/CSS version of a project, select the
                    option with (HTML/CSS).
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
                    Which backend technology are you intrested in? Suppose none
                    of the provided options matches your preference select
                    (other).
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    mt={3}
                    color={"text.secondary"}
                  >
                    Which database are you intrested in? Suppose none of the
                    provided options matches your preference select (other).
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    mt={3}
                    color={"text.secondary"}
                  >
                    Native Android application development stack is usually
                    based on Java or Kotlin for the implementation of logic and
                    the UI part consists of XML or JetpakCompose (Kotlin for
                    UI+Logic).
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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
                  <Box
                    className="my-2"
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Apple color="primary" sx={{ width: 30, height: 30 }} />
                  </Box>

                  <Typography
                    component={"li"}
                    variant="body2"
                    mt={3}
                    color={"text.secondary"}
                  >
                    Select the stack used in the development of your Native IOS
                    Application project/post
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>{ios}</small>
                            </Box>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Box>
              )}
              {/* Cloud computing */}
              {post_category === "Cloud Computing (AWS/GCP/Azure)" && (
                <Box>
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select a cloud provider option. Currently we support Amazon
                    Web Services (AWS), Microsoft Azure and Google Cloud
                    Platform as the main cloud providers.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={cloudComputing}
                      label="Select a cloud provider"
                      fullWidth
                      onChange={(e) => setCloudComputing(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Cloud.map((cloud) => (
                          <MenuItem key={cloud} value={cloud}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
                              <small style={{ fontSize: "small" }}>
                                {cloud}
                              </small>
                            </Box>
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

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    mt={3}
                  >
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
                      label="Select a multiplatform framework"
                      fullWidth
                      onChange={(e) => setMultiplatform(e.target.value)}
                    >
                      {SubsectionTech &&
                        SubsectionTech.Multiplatfotm.map((multiplatform) => (
                          <MenuItem key={multiplatform} value={multiplatform}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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

              {/* county */}
              <Box display={"flex"} justifyContent={"center"}>
                <LocationOnRounded
                  color="primary"
                  sx={{ width: 30, height: 30 }}
                />
              </Box>

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Select your county. This helps in promoting your county and our
                country <span className="fw-bold">KENYA</span> as a whole in
                accordance to technological embracement countrywide based on
                <span className="fw-bold ms-1">
                  Enlighting Technology Country Wide{" "}
                </span>
                .
              </Typography>
              <Box className="mb-3">
                <TextField
                  select
                  required
                  value={county}
                  label="county or location of residence"
                  fullWidth
                  onChange={(e) => setCounty(e.target.value)}
                >
                  {CountiesInKenya &&
                    CountiesInKenya.map((county) => (
                      <MenuItem key={county} value={county}>
                        <small style={{ fontSize: "small" }}> {county}</small>
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

              {/* Github link */}
              <Box display={"flex"} justifyContent={"center"}>
                <GitHub color="primary" sx={{ width: 30, height: 30 }} />
              </Box>
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Project GitHub/GitLab/SVN Link. Providing Version Control links
                may further promote collaboraton and contributors to your
                project.{" "}
                <span className="fw-medium">
                  Programming related posts/projects are recommended to have
                  this link.
                </span>
              </Typography>

              <Box className="mb-2">
                <TextField
                  fullWidth
                  value={gitHub}
                  onChange={(e) => setGitHub(e.target.value)}
                  id="github-gitlab"
                  label={"version control link (optional)"}
                  placeholder=" https://github.com/username/project-name.git"
                />
              </Box>

              {/* image  */}
              <Box display={"flex"} justifyContent={"center"} gap={1}>
                <Image color="primary" sx={{ width: 30, height: 30 }} /> +
                <PictureAsPdfRounded
                  color="primary"
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide an image or pdf file for the post for visual
                presentation. Its
                <span className="fw-medium">
                  {" "}
                  recommended to embed an image or pdf{" "}
                </span>{" "}
                in your post for it conveys thousands of information about your
                post/project than mere words.
              </Typography>
              {/* Screenshot/Image Project Post */}
              <Box className="mb-2 border rounded p-1">
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={1}
                >
                  {/* video from link is no limited to time  */}
                  {isURLFile ? (
                    <Typography variant="body2" color={"text.secondary"}>
                      image | pdf link (optional)
                    </Typography>
                  ) : (
                    <Typography variant="body2" color={"text.secondary"}>
                      image | pdf (optional)
                    </Typography>
                  )}

                  <Box>
                    <FileInputToggle />
                  </Box>
                </Box>

                {/* show input from filesystem or URL */}
                {isURLFile ? (
                  <Box>
                    <input
                      required
                      type="url"
                      value={imagePathNet}
                      onChange={(e) => setImagePathNet(e.target.value)}
                      placeholder="https://www.imageorpdflink.com"
                      className="form-control rounded-0"
                    />
                  </Box>
                ) : (
                  <Box>
                    <input
                      type="file"
                      onChange={(e) => setImagePathFile(e.target.files[0])}
                      accept="image/*, .pdf"
                      className="form-control"
                    />
                  </Box>
                )}
              </Box>

              {/* description */}

              <Box display={"flex"} justifyContent={"center"}>
                <EditRounded color="primary" sx={{ width: 30, height: 30 }} />
              </Box>

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide a captivating descripton about your project/post. Let
                your audience know that you are such an incredible tech
                enthusiast and scholar.{" "}
                <span className="fw-bold">
                  Don't back down even if its an amature project such as
                  HTML/CSS only.
                </span>{" "}
                We all came from square one!
              </Typography>

              <Box mb={3}>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 5 : 10}
                  multiline
                  contentEditable={false}
                  error={description.length > 1000}
                  id="descr-post"
                  label={
                    <p>
                      {`description  ${1000 - description.length} characters`} *
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

export default PostTechModal;
