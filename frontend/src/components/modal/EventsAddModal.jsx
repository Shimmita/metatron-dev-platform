import {
  Add,
  Close,
  EditNoteRounded,
  GradeRounded,
  ScheduleRounded,
  Title,
  TopicRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Stack,
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
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

// styled modal
const StyledModalEvent = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const EventsAddModal = ({ openModalEventAdd, setOpenModalEventAdd }) => {
  const [post_about, setPostAbout] = useState("");
  const [title, setTitle] = useState("");
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
  const [topic_1, setTopic1] = useState("");
  const [topic_2, setTopic2] = useState("");
  const [topic_3, setTopic3] = useState("");
  const [topic_4, setTopic4] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = React.useState(false);

  // control showing of the the input of the file either URL or from filesystem
  const handleClickShowPreview = () => setShowPreview((show) => !show);

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <StyledModalEvent
      keepMounted
      open={openModalEventAdd}
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
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
            ? "70%"
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
            <Button
              startIcon={<Add />}
              className="w-50 rounded-5 shadow-sm"
              variant="contained"
              disabled={description.length > 200 || post_about.length < 1}
              size="small"
            >
              Add Event
            </Button>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalEventAdd(false)}>
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
            <Box display={"flex"} mt={2} flexDirection={"column"} gap={3}>
              {/* title */}
              <Box mt={3} display={"flex"} justifyContent={"center"}>
                <Title color="primary" sx={{ width: 30, height: 30 }} />
              </Box>

              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide a relevant title about this event so that users can
                bootstrap what you will be addressing at glance.
              </Typography>

              <Box className="w-100 mb-2">
                <TextField
                  required
                  id="title"
                  value={title}
                  label="event title"
                  placeholder="Debunking Kotlin Multiplatform"
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              {/* post about */}
              <Box display={"flex"} justifyContent={"center"}>
                <GradeRounded color="primary" sx={{ width: 30, height: 30 }} />
              </Box>
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Select the event specialisation from the enlisted choices below.
                This is the main IT area your event will be based on.
              </Typography>
              <Box className="w-100 mb-2 mt-2 ">
                <TextField
                  required
                  select
                  id="about-tech"
                  value={post_about}
                  label="my event will specialise in"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select the sub topic of interest from the enlisted choices
                    below. This helps to narrow down to a specific area of
                    concern from the vast pool of software engineering choices.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      id="speciality"
                      select
                      value={software_dev}
                      label="sub topic of specialisation"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Containerisation option
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id={"containers"}
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Desktop App Development Stack
                  </Typography>

                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id={"desktop-stack"}
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Game Development Technology
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="game-dev"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select a programming language that will be focused on during
                    your event presentation
                  </Typography>

                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      value={pro_language}
                      label="programming language"
                      fullWidth
                      id="prog-language"
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
                  <Typography
                    component={"li"}
                    gutterBottom
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select a DevOps platform/tool that will be focused on during
                    your event presentation.
                  </Typography>
                  <Box className="w-100 mb-3 ">
                    <TextField
                      required
                      id="devops"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select UI/UX Design tool that will be focused on during your
                    event presentation.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="design-tool"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Which frontend technology are you intrested in? If your
                    event is based on a bare HTML/CSS version of a project,
                    select the option with (HTML/CSS).
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      id={"frontend"}
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Which backend technology are you going to use in your event,
                    during event presentation?
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id={"backend"}
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Which database tool or technology are you going to integrate
                    with your backend in this event?
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="db"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Native Android application development stack is usually
                    based on Java or Kotlin for the implementation of logic and
                    the UI part consists of XML or JetpakCompose (Kotlin for
                    UI+Logic).
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      id="andro"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    which stack will be used in the development of your native
                    iOS application during the event presentation?
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="ios"
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
                              <small style={{ fontSize: "small" }}>{ios}</small>
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select a cloud provider option that will be used in your
                    event. Included are the most popular and widely recognised
                    cloud technology providers in the world.
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="cloud-provider"
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
                  <Typography
                    component={"li"}
                    variant="body2"
                    color={"text.secondary"}
                  >
                    Select multiplatform/cross-application mobile development
                    technology that you are specifically interested in your
                    event. (other).
                  </Typography>
                  <Box className="w-100 mb-2 ">
                    <TextField
                      required
                      select
                      id="multiplatform-mobile"
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

              {/* Date and Time */}
              <Box display={"flex"} justifyContent={"center"}>
                <ScheduleRounded
                  color="primary"
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide a stipulated date and time on which this event is
                proposed to take place effectively based your planning schedule.
              </Typography>

              <Box mb={2}>
                <Box mb={2}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textAlign={"center"}
                      pl={2}
                    >
                      Event Date
                    </Typography>
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      value={date_event}
                      onChange={(e) => setDateEvent(e.target.value)}
                      type="date"
                      id="date-start-time"
                    />
                  </Box>
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
                      id="start-time"
                    />
                  </Box>
                  <Typography variant="body2" mt={2} color={"text.secondary"}>
                    to
                  </Typography>
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

              {/* Areas covered shown if postAbout no empty */}
              <Box display={"flex"} justifyContent={"center"}>
                <TopicRounded color="primary" sx={{ width: 30, height: 30 }} />
              </Box>
              <Box>
                <Typography
                  component={"li"}
                  variant="body2"
                  color={"text.secondary"}
                  mb={2}
                >
                  Provide atleast two key areas that will be addressed in your
                  event. This helps your target audience in determining the
                  worthness of attending this event.
                </Typography>

                <Stack direction={"column"} gap={3}>
                  <TextField
                    fullWidth
                    variant="standard"
                    required
                    id="topic 1"
                    error={topic_1.length > 30}
                    label={`topic 1 (required) ${30 - topic_1.length}`}
                    value={topic_1}
                    onChange={(e) => setTopic1(e.target.value)}
                    placeholder="Introduction to Nodejs"
                  />

                  <TextField
                    fullWidth
                    required
                    id="topic 2"
                    error={topic_2.length > 30}
                    variant="standard"
                    value={topic_2}
                    label={`topic 2 (required) ${30 - topic_2.length}`}
                    onChange={(e) => setTopic2(e.target.value)}
                    placeholder="Nodejs API Routing"
                  />

                  <TextField
                    fullWidth
                    error={topic_3.length > 30}
                    variant="standard"
                    id="topic 3"
                    label={`topic 3 (optional) ${30 - topic_3.length}`}
                    value={topic_3}
                    onChange={(e) => setTopic3(e.target.value)}
                    placeholder="Nodejs API Controllers"
                  />

                  <TextField
                    variant="standard"
                    fullWidth
                    id="topic_4"
                    error={topic_4.length > 30}
                    label={`topic 4 (optional) ${30 - topic_4.length}`}
                    value={topic_4}
                    onChange={(e) => setTopic4(e.target.value)}
                    placeholder="Database Connection"
                  />
                </Stack>
              </Box>

              {/* description */}
              <Box display={"flex"} justifyContent={"center"}>
                <EditNoteRounded
                  color="primary"
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
              <Typography
                component={"li"}
                variant="body2"
                color={"text.secondary"}
              >
                Provide a short and concise description about the event which
                will make your target group of individuals captivated and
                willing to attend.
              </Typography>

              {/* brief description of the event */}
              <Box mb={3}>
                <TextField
                  minRows={3}
                  multiline
                  contentEditable={false}
                  error={description.length > 300}
                  id="descr-event"
                  label={
                    <p>
                      {`description  ${300 - description.length} characters`} *
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
    </StyledModalEvent>
  );
};

export default EventsAddModal;
