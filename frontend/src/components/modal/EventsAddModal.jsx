import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
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
import AllSkills from "../data/AllSkillsData";
import SpecialisationTech from "../data/SpecialisationTech";
import SubsectionTech from "../data/SubsectionTech";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

// styled modal
const StyledModalEvent = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const EventsAddModal = ({ openModalEventAdd, setOpenModalEventAdd }) => {
  const [specialisation, setSpecialisation] = useState("");
  const [title, setTitle] = useState("");
  const [date_event, setDateEvent] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [topicsArray, setTopicsArray] = useState([]);
  const [topc_text, setTopicText] = useState("");
  const options_topic_suggest = [
    ...new Set(
      [
        ...AllSkills,
        ...SubsectionTech.DataScience,
        ...SubsectionTech.Cybersec,
        ...SubsectionTech.MachineLearning,
      ]
        .filter(
          (value) =>
            !value.toLowerCase().includes("none") ||
            !value.toLowerCase().includes("other")
        )
        .sort()
    ),
  ];

  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);

  // Handle input change for topic text
  const handleTextChangeTopic = (e, value) => {
    setTopicText(value);
  };

  // handle adding topic
  const handleAddTopic = () => {
    if (topc_text.trim() !== "") {
      setTopicsArray((prev) => [...prev, topc_text.trim()]);
      setTopicText("");
    }
  };

  // Handle topic removal
  const handleDeleteTopic = (desc) => {
    setTopicsArray((prev) => prev.filter((val) => val !== desc));
  };

  // handle posting of the event
  const handleEventPost = (e) => {
    if (topicsArray?.length < 2) {
      alert("provide two or more topics");
    }
    // prevent default submission
    e.preventDefault();
  };


   // handle return width modal
    const handleReturnWidthModal=()=>{
      if (CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)) {
        return "60%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } else if(CustomLandscapeWidest()){
        return "35%"
      }
      return "100%"
    }

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

            {/*close icon */}
            <IconButton onClick={(e) => setOpenModalEventAdd(false)}>
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>{" "}
            </IconButton>
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
            }}
          >
            <form onSubmit={handleEventPost}>
              <Box display={"flex"} mt={3} flexDirection={"column"} gap={3}>
                {/* event title */}
                <Typography variant="body2" color={"text.secondary"}>
                  Provide a relevant title for your event as it should be seen
                  by the target users.
                </Typography>
                <Box className="w-100 mb-2">
                  <TextField
                    required
                    id="title"
                    value={title}
                    label="Event title"
                    placeholder="Debunking Kotlin Multiplatform"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>

                {/* post about */}

                <Typography variant="body2" color={"text.secondary"}>
                  Select the event specialisation from the provided options
                  below
                </Typography>
                <Box className="w-100 mb-2 mt-2 ">
                  <TextField
                    required
                    select
                    value={specialisation}
                    label="Event will specialise in"
                    fullWidth
                    onChange={(e) => setSpecialisation(e.target.value)}
                  >
                    {SpecialisationTech &&
                      SpecialisationTech.filter(
                        (about) => about !== "None"
                      ).map((about, index) => (
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
                      ))}
                  </TextField>
                </Box>

                <Typography variant="body2" color={"text.secondary"}>
                  Provide a stipulated date and time on which this event is
                  proposed to take place effectively based your planning
                  schedule.
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
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      width={"100%"}
                    >
                      <TextField
                        fullWidth
                        required
                        value={date_event}
                        onChange={(e) => setDateEvent(e.target.value)}
                        type="date"
                        sx={{ color: "black", width: "50%" }}
                        id="start-date"
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
                        required
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
                        required
                        value={end_time}
                        onChange={(e) => setEndTime(e.target.value)}
                        type="time"
                        id="ends-time"
                      />
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color={"text.secondary"} mb={2}>
                    Help your target audience in determining the worthness of
                    attending this event by providing atleast three areas or
                    topics covered.
                  </Typography>

                  <Autocomplete
                    freeSolo
                    options={options_topic_suggest}
                    value={topc_text}
                    onInputChange={handleTextChangeTopic}
                    disableClearable
                    inputValue={topc_text}
                    onChange={handleTextChangeTopic}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Topic name"
                        variant="standard"
                        fullWidth
                      />
                    )}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && topc_text.trim() !== "") {
                        handleAddTopic();
                      }
                    }}
                  />

                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      disableElevation
                      startIcon={<Add />}
                      onClick={handleAddTopic}
                      color="success"
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display the added desc */}
                  {topicsArray.length > 0 && (
                    <Box mt={2} mb={3}>
                      <Box component={"ol"} bgcolor={!isDarkMode && "#f1f1f1"}>
                        {topicsArray.map((description, index) => (
                          <Box
                            display={"flex"}
                            gap={1}
                            key={index}
                            alignItems={"center"}
                          >
                            <Typography
                              component={"li"}
                              variant="body2"
                              color="text.secondary"
                            >
                              {description}
                            </Typography>
                            {/* clear or delete icon */}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTopic(description)}
                            >
                              <Close sx={{ width: 15, height: 15 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Typography variant="body2" color={"text.secondary"}>
                  Provide a short and concise description about the event which
                  will make your target group of individuals captivated and
                  willing to attend.
                </Typography>

                {/* brief description of the event */}
                <Box mb={3}>
                  <TextField
                    minRows={3}
                    multiline
                    required
                    contentEditable={false}
                    error={descriptionText.length > 300}
                    id="descr-event"
                    label={
                      <p>
                        {`description  ${
                          300 - descriptionText.length
                        } characters`}{" "}
                        *
                      </p>
                    }
                    fullWidth
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="whats on your mind..."
                  />
                </Box>

                {/*  button for posting */}
                <Box display={"flex"} justifyContent={"center"} mb={2}>
                  <Button
                    startIcon={<Add />}
                    className="w-75 rounded-5 shadow-sm"
                    variant="contained"
                    type="submit"
                    disabled={
                      descriptionText.length > 200 || specialisation.length < 1
                    }
                  >
                    Create Event
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </StyledModalEvent>
  );
};

export default EventsAddModal;
