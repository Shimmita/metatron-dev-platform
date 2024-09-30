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
import EventsAdddata from "../data/EventsAddData";
import SubsectionTech from "../data/SubsectionTech";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomModalHeight from "../utilities/CustomModalHeight";

const StyledModalEvent = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
  marginLeft: CustomDeviceTablet() && "34%",
});

const EventsAddModal = ({ openModalEventAdd, setOpenModalEventAdd }) => {
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
  const [software_dev, setSoftwareDev] = useState("");
  const [date_event, setDateEvent] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [topic_1, setTopic1] = useState();
  const [topic_2, setTopic2] = useState();
  const [topic_3, setTopic3] = useState();
  const [topic_4, setTopic4] = useState();
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = React.useState(false);

  // control showing of the the input of the file either URL or from filesystem
  const handleClickShowPreview = () => setShowPreview((show) => !show);

  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);

  return (
    <StyledModalEvent
      keepMounted
      open={openModalEventAdd}
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
          className="shadow-lg "
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
                disabled={description.length > 200 || post_about.length < 1}
                size="small"
              >
                Add Event
              </Button>
            </Tooltip>

            {/*close icon */}
            <Tooltip title={"close"}>
              <IconButton onClick={(e) => setOpenModalEventAdd(false)}>
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
            {showPreview ? (
              // show the preview
              <Box className="w-100 mt-3">
                <p>preview here</p>
              </Box>
            ) : (
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
                  Select the event category or specialisation from the enlisted
                  choices below.
                </Typography>
                {/* post about */}
                <Box className="w-100 mb-2 mt-2 ">
                  <TextField
                    required
                    select
                    value={post_about}
                    label="my event  will be about"
                    fullWidth
                    onChange={(e) => setPostAbout(e.target.value)}
                  >
                    {EventsAdddata &&
                      EventsAdddata.EventSpecialisation.map((about, index) => (
                        <MenuItem key={index} value={about}>
                          <small style={{ fontSize: "small" }}>{about}</small>
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
                {/* Software Dev */}
                {post_about === "Software Development/Engineering" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />

                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Select software development or engineering speciality of
                      your interest.
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={software_dev}
                        label="Software dev category"
                        fullWidth
                        onChange={(e) => setSoftwareDev(e.target.value)}
                      >
                        {EventsAdddata &&
                          EventsAdddata.SoftwareDev.map((software) => (
                            <MenuItem key={software} value={software}>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={"5px"}
                              >
                                <small style={{ fontSize: "small" }}>
                                  {software}
                                </small>
                              </Box>
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>
                  </>
                )}

                {/* Containerisation  */}
                {post_about === "Containerisation/Orchestration" && (
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
                {(post_about === "Desktop App Development" ||
                  software_dev === "Desktop App Development") && (
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
                {post_about === "Programming Language Foundations" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Select a programming language that will be focused on
                      during your event presentation
                    </Typography>

                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={pro_language}
                        label="programming language"
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
                {post_about === "Developer Operations/DevOps" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      gutterBottom
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Select a DevOps platform/tool that will be focused on
                      during your event presentation.
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
                      Select UI/UX Design tool that will be focused on during
                      your event presentation.
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
                {(software_dev === "Frontend App Development" ||
                  software_dev ===
                    "Fullstack App Development (Frontend+Backend)") && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />

                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Which frontend technology are you intrested in? If your
                      event is based on a bare HTML/CSS version of a project,
                      select the option with (HTML/CSS).
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={frontend}
                        label="frontend framework"
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
                {(software_dev === "Backend App Development" ||
                  software_dev ===
                    "Fullstack App Development (Frontend+Backend)") && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />

                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Which backend technology are you going to use in your
                      event, during event presentation?
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={backend}
                        label="backend framework"
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
                {(post_about === "Database Management/SQL/NoSQL" ||
                  software_dev ===
                    "Fullstack App Development (Frontend+Backend)" ||
                  software_dev === "Backend App Development") && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />

                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Which database tool or technology are you going to
                      integrate with your backend in this event?
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
                {software_dev === "Native Android App Development" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Native Android application development stack is usually
                      based on Java or Kotlin for the implementation of logic
                      and the UI part consists of XML or JetpakCompose (Kotlin
                      for UI+Logic).
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={android}
                        label="android app development stack"
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
                {software_dev === "Native iOS App Development" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      which stack will be used in the development of your native
                      iOS application during the event presentation?
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={ios_dev}
                        label="iOS app development stack"
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
                                <small style={{ fontSize: "small" }}>
                                  {ios}
                                </small>
                              </Box>
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>
                  </>
                )}
                {/* Cloud computing */}
                {post_about === "Cloud Computing/Web Hosting Services" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Select a cloud provider option that will be used in your
                      event. Included are the most popular and widely recognised
                      cloud technology providers in the world.
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={cloudComputing}
                        label="select a cloud provider"
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
                {software_dev ===
                  "Multplatform App Development (Android+iOS)" && (
                  <>
                    <Divider component={"div"} className="p-2 border-success" />
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Select multiplatform/cross-application mobile development
                      technology that you are specifically interested in your
                      event. (other).
                    </Typography>
                    <Box className="w-100 mb-2 ">
                      <TextField
                        required
                        select
                        value={multiplatform}
                        label="select a multiplatform framework"
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
                {/* Date and Time */}
                <Typography
                  component={"li"}
                  variant="body2"
                  color={"text.secondary"}
                  p={1}
                >
                  Provide a stipulated date and time on which this event is
                  proposed to take place effectively based your planning
                  schedule, <span className="fw-bold"> " GOD WILLING "</span>.
                </Typography>

                <Box mb={2}>
                  <Box mb={1}>
                    <Typography variant="caption" color="text.secondary" pl={2}>
                      Date of the event
                    </Typography>
                    <TextField
                      fullWidth
                      value={date_event}
                      onChange={(e) => setDateEvent(e.target.value)}
                      type="date"
                      id="date-start-time"
                    />
                  </Box>

                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign={"center"}
                        pl={2}
                      >
                        Starts At
                      </Typography>
                      <TextField
                        fullWidth
                        className="w-100"
                        value={start_time}
                        onChange={(e) => setStartTime(e.target.value)}
                        type="time"
                        id="ends-time"
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign={"center"}
                        pl={2}
                      >
                        Ends At
                      </Typography>
                      <TextField
                        fullWidth
                        value={end_time}
                        onChange={(e) => setEndTime(e.target.value)}
                        type="time"
                        id="ends-time"
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider component={"div"} className="p-2 border-success" />
                <Typography
                  component={"li"}
                  variant="body2"
                  color={"text.secondary"}
                  p={1}
                >
                  Provide a short and concise description about the event which
                  will make your target group of individuals captivated and
                  willing to attend.
                </Typography>

                {/* brief description of the event */}
                <Box>
                  <TextField
                    minRows={window.screen.availWidth <= 320 ? 2 : 3}
                    multiline
                    contentEditable={false}
                    error={description.length > 200}
                    id="descr-required"
                    label={
                      <p>
                        {`description  ${200 - description.length} characters`}{" "}
                        *
                      </p>
                    }
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="whats on your mind..."
                  />
                </Box>

                <Divider component={"div"} className="p-2 border-success" />

                {/* Areas covered shown if postAbout no empty */}

                {post_about && (
                  <Box>
                    <Typography
                      component={"li"}
                      variant="body2"
                      color={"text.secondary"}
                      p={1}
                    >
                      Provide 4 key areas or topics that will be covered in your
                      event. Note that this information
                      <span className="fw-bold"> is mandatory</span> to help
                      your target audience in ditermining the worthness of
                      attending it.
                    </Typography>

                    <TextField
                      fullWidth
                      required
                      label={"topic 1"}
                      value={topic_1}
                      className="mb-2"
                      onChange={(e) => setTopic1(e.target.value)}
                      placeholder="Introduction to Nodejs"
                    />

                    <TextField
                      fullWidth
                      required
                      className="mb-2"
                      value={topic_2}
                      label={"topic 2"}
                      onChange={(e) => setTopic2(e.target.value)}
                      placeholder="Nodejs API Routing"
                    />

                    <TextField
                      fullWidth
                      required
                      className="mb-2"
                      label={"topic 3"}
                      value={topic_3}
                      onChange={(e) => setTopic3(e.target.value)}
                      placeholder="Nodejs API Controllers"
                    />

                    <TextField
                      fullWidth
                      required
                      className="mb-2"
                      label={"topic 4"}
                      value={topic_4}
                      onChange={(e) => setTopic4(e.target.value)}
                      placeholder="Modal Class and Database Configuration"
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </StyledModalEvent>
  );
};

export default EventsAddModal;
