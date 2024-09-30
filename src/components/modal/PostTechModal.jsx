import { Add, Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
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
import AppLogo from "../../images/logo_sm.png";
import CountiesInKenya from "../data/Counties";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomModalHeight from "../utilities/CustomModalHeight";
import FileInputToggle from "./FileInputToggle";

const StyledModalPost = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
  marginLeft: CustomDeviceTablet() && "34%",
});

const PostTechModal = ({ openModalTech, setOpenModalTech }) => {
  const [post_about, setPostAbout] = useState("");
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

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  // control showing of the the input of the file either URL or from filesystem
  const [isURLFile, setIsUrlFile] = React.useState(true);

  return (
    <StyledModalPost
      keepMounted
      open={openModalTech}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={window.screen.availWidth < 600 ? "100%" : 560}
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          marginRight: CustomDeviceTablet() && 1,
          border: isDarkMode && "1px solid gray",
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
            <Tooltip title={"post"}>
              <Button
                startIcon={<Add />}
                className="w-50 rounded-5 shadow-sm"
                variant="contained"
                disabled={!post_about.length > 0}
                size="small"
              >
                Post
              </Button>
            </Tooltip>

            {/*close icon */}
            <Tooltip title={"close"}>
              <IconButton onClick={(e) => setOpenModalTech(false)}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider component={"div"} className="p-2 border-success" />

          <Box
            maxHeight={CustomModalHeight()}
            sx={{
              overflowX: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",

              // paddingLeft: window.screen.availWidth<370 && '20%'
            }}
          >
            <Box
              className="p-1"
              display={"flex"}
              flexDirection={"column"}
              gap={2}
            >
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Posting about which IT specialisation. This helps us to
                customize and categorise tech-related content to all users
                accordingly.
              </Typography>
              {/* post about */}
              <Box className="w-100 mb-2 mt-2 ">
                <TextField
                  required
                  select
                  value={post_about}
                  label="I am posting about"
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
              {post_about === "Containerisation and Orchestration" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

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
                </>
              )}

              {/* Desktop App */}
              {post_about === "Desktop App Development" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Desktop App Development Stack
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
                </>
              )}

              {/* Game dev */}
              {post_about === "Game App Development" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Game Development Technology
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={game_dev}
                      label="Select Game Development Technology"
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
                </>
              )}
              {/* programming Language */}
              {post_about === "Programming Languages" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Programming language to post about
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
                </>
              )}

              {/* DevOps */}
              {post_about === "Developer Operations (DevOps+CI/CD)" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
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
                </>
              )}

              {/* UI/UX  */}
              {post_about === "UI/UX Design/Graphic Design" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    UI/UX Design Tools option
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
                </>
              )}

              {/* frontend */}
              {(post_about === "Frontend App Development" ||
                post_about ===
                  "Fullstack App Development (Frontend+Backend)") && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

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
                </>
              )}

              {/* backend */}
              {(post_about === "Backend App Development" ||
                post_about ===
                  "Fullstack (Frontend+Backend) App Development") && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Which backend technology are you intrested in? Suppose none
                    of the provided options matches your preference select
                    (other).
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
                </>
              )}
              {/* Database */}
              {(post_about === "Database Management (SQL/NoSQL)" ||
                post_about === "Fullstack App Development") && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />

                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Which database are you intrested in? Suppose none of the
                    provided options matches your preference select (other).
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
                </>
              )}

              {/* Android App */}
              {post_about === "Native Android App Development" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Native Android application development stack is usually
                    based on Java or Kotlin for the implementation of logic and
                    the UI part consists of XML or JetpakCompose (Kotlin for
                    UI+Logic).
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
                </>
              )}
              {/* IOS App */}
              {post_about === "Native IOS App Development" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select the stack used in the development of your Native IOS
                    Application project/post
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
                </>
              )}
              {/* Cloud computing */}
              {post_about === "Cloud Computing (AWS/GCP/Azure)" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
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
                </>
              )}

              {/* Multiplatform Android+IOS */}
              {post_about === "Multiplatform App Development (Android+IOS)" && (
                <>
                  <Divider component={"div"} className="p-2 border-success" />
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                    p={1}
                  >
                    Select a mobile multiplatform/cross-application development
                    technology that you are interested in. Suppose none of the
                    provided options matches your preference select (other).
                  </Typography>
                  <Box className="w-100 mb-2 ">
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
                </>
              )}

              <Divider component={"div"} className="p-2 border-success" />
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Select your county. This helps in promoting your county and our
                country <span className="fw-bold">KENYA</span> as a whole in
                accordance to technological embracement countrywide.
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
              <Divider component={"div"} className="p-2 border-success" />
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
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

              <Divider component={"div"} className="p-2 border-success" />

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide an image (PNG, JPEG, JPG) of the post for visual
                presentation. Its
                <span className="fw-medium">
                  {" "}
                  recommended to embed an image/screenshot{" "}
                </span>{" "}
                of your work in your post for it conveys thousands of
                information about your post/project than mere words.
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
                      screenshot/image link (optional)
                    </Typography>
                  ) : (
                    <Typography variant="body2" color={"text.secondary"}>
                      screenshot/image (optional)
                    </Typography>
                  )}

                  <Box>
                    <FileInputToggle setIsUrl={setIsUrlFile} />
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
                      placeholder="https://www.post-or-project-image-link.com"
                      className="form-control rounded-0"
                    />
                  </Box>
                ) : (
                  <Box>
                    <input
                      type="file"
                      onChange={(e) => setImagePathFile(e.target.files[0])}
                      accept="image/*"
                      className="form-control"
                    />
                  </Box>
                )}
              </Box>

              <Divider component={"div"} className="p-2 border-success" />

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
                p={1}
              >
                Provide a captivating descripton about your project/post. Let
                your audience know that you are such an incredible tech
                enthusiast and scholar.{" "}
                <span className="fw-bold">
                  Don't back down even if its an amature project such as
                  HTML/CSS only.
                </span>{" "}
                We all came from zero levels!
              </Typography>

              <Box>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 2 : 5}
                  multiline
                  contentEditable={false}
                  error={description.length > 500}
                  id="descr-required"
                  label={
                    <p>
                      {`description  ${500 - description.length} characters`} *
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
