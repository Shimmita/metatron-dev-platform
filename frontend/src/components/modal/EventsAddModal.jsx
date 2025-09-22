import {
  Add,
  CheckCircle,
  Close,
  TvRounded
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import { updateCurrentSnackBar } from "../../redux/CurrentSnackBar";
import AllCountries from "../data/AllCountries";
import SpecialisationTech from "../data/SpecialisationTech";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import AllSkills from "../data/AllSkillsData";
import { updateCurrentEvents } from "../../redux/CurrentEvents";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
const LogoutAlert = lazy(() => import("../alerts/LogoutAlert"));

// styled modal
const StyledModalEvent = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


// array for image names and values
const MAX_ABOUT=160

// max topic length
const MAX_TOPIC_LENGTH=35

const EventsAddModal = ({ openModalEventAdd, setOpenModalEventAdd, setTextOption, isHiring=false}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDate, setEventDate] = useState(Date.now());
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [about, setAbout] = useState("");
  const [skills,setSkills]=useState([])

   // To hold user input text for req
    const [reqText, setReqText] = useState("");
     // To hold checked requirements as chips
    const [topicsRequirement, setTopicsRequirement] = useState([]);
    // Available options to display in the Autocomplete dropdown
    const options_req = []; 

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // control showing of logout user session expired
  const [openAlertLogout, setOpenAlertLogout] = useState(false);

  // get redux states
  const dispatch=useDispatch()
  const { user } = useSelector((state) => state.currentUser);
  const { events:eventsData } = useSelector((state) => state.currentEvents);
  
  // destructuring user
  const {
    _id:ownerId,
    name:ownerName,
    specialisationTitle:ownerSpecialize,
    avatar:ownerAvatar

  }=user

  // skills handler
  const handleChangeMainSkills = (_, newValue) => {
    if (newValue.length > 5) {
      return; // Limit to 5 selections
    }
    setSkills(newValue);
  };

  // handle delete of skill selection
  const handleDeleteMainSkills = (skillToDelete) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  //   control the country selection
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(
    AllCountries.map((val) => {
      let country = `+${val.phone} ${val.label} (${val.code})`;
      return country
    }).sort((a,b)=>a.localeCompare(b))
  );

  const handleAddNewCountry = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setCountry(inputValue);
      setInputValue("");
    }
  };
  // clear an country
  const handleDeleteCountry = () => {
    setCountry(null);
  };

  const handleFlagCountry = (option) => {
    let split_res = option.split(" ");
    return split_res[split_res.length - 1].substring(1, 3).toLowerCase();
  };

  // redux states
  const { currentMode, isTabSideBar } = useSelector((state) => state.appUI);
      const isDarkMode=currentMode==='dark'

  // Handle input change for req
  const handleTextChangeReq = (e, value) => {
    setReqText(value);
  };

  // Handle adding req max 4 total
  const handleAddTopicRequirement = () => {
   
    if (reqText.trim() !== "" || !reqText.trim().length>MAX_TOPIC_LENGTH) {
      if (topicsRequirement.length<=3) {
          // Add the inputText as a new requirement if it's not empty
      setTopicsRequirement((prev) => [...prev, reqText.trim()]);
      setReqText(""); // Clear the input field
      }
      else{
        // topics should not exceed 4 in length
        setErrorMessage("4 main topics max")
      }
    
    }
  };

  // Handle req removal
  const handleDeleteReq = (req) => {
    setTopicsRequirement((prev) => prev.filter((val) => val !== req));
  };

  // handle core missing fields
  const handleEmptyFields = () => {
    
    if (title?.trim() === "") {
      setErrorMessage("job title is missing");
      return false;
    }
 
    if (county?.trim === "") {
      setErrorMessage("organization location is incomplete");
      return false;
    }
    if (country?.trim === "") {
      setErrorMessage("organization location is incomplete");
      return false;
    }

    if (about?.trim() === "") {
      setErrorMessage("missing about field");
      return false;
    }
 

    if (topicsRequirement?.length <=3) {
      setErrorMessage("provide 4 main topics");
      return false;
    }

    

    return true;
  };

  // event object
  const eventObject={
    title,
    category,
    hostLink:eventLink,
    dateHosted:eventDate,
    ownerId,
    ownerName,
    ownerSpecialize,
    ownerAvatar,
    about,
    skills,
    location:{
      country,
      state:county
    },
    topics:topicsRequirement,
 
  }
  

  // handle posting of data to the backend
  const handleEventPost = () => {
    // clear any error message
    setErrorMessage("");
    // core fields not empty
    if (handleEmptyFields()) {
      // set is uploading true
      setIsUploading(true);
      // performing post request, passing current userId
      axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/create`, eventObject, {
          withCredentials: true,
        })
        .then((res) => {
          // update the snack bar message
          dispatch(updateCurrentSnackBar(res?.data?.message))  

          // redux success to trigger success alert
          dispatch(updateCurrentSuccessRedux({title:'Event Uploaded',message:`${res.data.message} track your uploaded event status in the events section and be able to interact with users who made rsvp.`}))
          
          // update the current events redux with the latest one on top
          dispatch(updateCurrentEvents([res.data.data,...eventsData]))
          
          // close the modal
          setOpenModalEventAdd(false)
        })
        .catch((err) => {
          //  user login session expired show logout alert
          if (err?.response?.data.login) {
            setOpenAlertLogout(true);
          }
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage("server unreachable");
            return;
          }

          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };


 
  // close the modal
  const handleClosingEventPostModal=()=>{
    setOpenModalEventAdd(false)
    // modal is opened from hiring page
      if(isHiring)
      {
      // avoid blank page by populating events default
      setTextOption("Your Events")
      }
  }

  // handle return width modal
    const handleReturnWidthModal=()=>{
      if (
        CustomLandScape() 
        ||CustomLandscapeWidest() || 
        (CustomDeviceTablet() && !isTabSideBar)) {
        return "40%"
      } else if (CustomDeviceTablet()){
        return "90%"
      } 
      return "95%"
    }

 

  return (
    <StyledModalEvent
      keepMounted
      open={openModalEventAdd}
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
          border:  "1px solid gray",
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
              <Avatar sx={{ width: 50, height: 50 }} src={AppLogo} alt="" />
            </Box>
            {/* job title */}
            <Typography
              variant="body2"
              width={"100%"}
              fontWeight={"bold"}
              textAlign={"center"}
            >
              {title.length===0 ? "Tech Event Upload":title}
            </Typography>

            {/*close icon */}
            <IconButton
              onClick={handleClosingEventPostModal}
              disabled={isUploading || errorMessage}
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
              </Tooltip>
            </IconButton>
          </Box>


          {/* display error of missing filed if any */}
          <Box
            mt={1}
            display={"flex"}
            justifyContent={"center"}
            mb={isUploading || errorMessage ? 1 : undefined}
          >
            {errorMessage ? (
              <Collapse in={errorMessage || false}>
                <Alert
                 className="rounded-5"
                  severity="info"
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
                <Box>
                  <CircularProgress size={"25px"} />
                </Box>
              )
            )}
          </Box>

          <Box
            maxHeight={"78vh"}
            className={"px-3"}
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
            <Box display={"flex"} flexDirection={"column"} gap={2} mt={3}>
                {/*event title */}
                <Box className="w-100 mb-2">
                <Typography gutterBottom variant="body2" color={"text.secondary"}>
                  Provide the name or title of the event. Should be concise and self explanatory 
                  without complexities.
                </Typography>

                  <TextField
                    required
                    disabled={isUploading}
                    value={title}
                    label="event title"
                    placeholder="Machine Learning"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
                {/* event category */}
               <Box className="w-100 mb-2 ">
               <Typography gutterBottom variant="body2" color={"text.secondary"}>
                  Provide the category or area of specialization of the event. Makes it easier for searching algorithm to locate your event instantly.
                </Typography>

                <TextField
                  required
                  select
                  disabled={isUploading}
                  value={category}
                  label="event specialization"
                  fullWidth
                  onChange={(e) => setCategory(e.target.value)}
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

               {/*event hosting link */}
                <Box className="w-100 mb-3">
                <Typography gutterBottom variant="body2" color={"text.secondary"}>
                  Please share the event link from zoom, google meet, calendly etc. 
                  currently we do not support video conferencing.
                </Typography>
                  <TextField
                    required
                    disabled={isUploading}
                    value={eventLink}
                    label="event meeting link"
                    placeholder="zoom, google meet, calendly..."
                    fullWidth
                    onChange={(e) => setEventLink(e.target.value)}
                  />
                </Box>


                {/* date */}
              <Box className="w-100 mb-3">
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                Please select the date when your planned event is going to take place. Your timezone shall be shown to the 
                potential users.
                </Typography>
                  <TextField
                    required
                    disabled={isUploading}
                    value={eventDate}
                    fullWidth
                    type="datetime-local"
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </Box>

              <Box className="mb-3">
                  <Stack gap={3}>
                  <Box>
                    <Typography gutterBottom variant="body2" color={"text.secondary"}>
                    Please select your country of residence from the drop-down list below. Your country makes it easier in
                    tracking timezones.
                    </Typography>
                    <Autocomplete
                      value={country}
                      disabled={isUploading}
                      onChange={(event, newValue) => {
                        setCountry(newValue);
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      options={options}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="your country option"
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      renderOption={(props, option) => (
                        <Typography display={"flex"} gap={1} {...props}>
                          {/* image */}
                          <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${handleFlagCountry(
                              option
                            )}.png 2x`}
                            src={`https://flagcdn.com/w20/${handleFlagCountry(
                              option
                            )}.png`}
                            alt=""
                          />
                          {/* country name */}
                          {option}
                        </Typography>
                      )}
                      renderTags={() =>
                        country ? (
                          <Chip
                            label={country}
                            onDelete={handleDeleteCountry}
                            deleteIcon={<CheckCircle />}
                          />
                        ) : null
                      }
                      noOptionsText={
                        <Chip
                          label={`Add "${inputValue}"`}
                          onClick={handleAddNewCountry}
                          icon={<CheckCircle />}
                          color="primary"
                          clickable
                        />
                      }
                    />
                    </Box>
                    {/* state or county */}
                    <Box>
                    <Typography gutterBottom variant="body2" color={"text.secondary"}>
                    Provide your city or state to facilitate easier recommendation of close or nearby tech friends to 
                    attend your event.
                    </Typography>
                     <TextField
                      required
                      id="state-country"
                      value={county}
                      label={"your city or state"}
                      disabled={isUploading}
                      fullWidth
                      onChange={(e) => setCounty(e.target.value)}
                    />
                    </Box>
                  </Stack>
                
              </Box>

              {/* skills covered */}

                <Box mb={2}>
                    <Typography gutterBottom variant="body2" color={"text.secondary"}>
                    What skills or technical areas is your event purposed to explore. select the most 
                    appropriate ones from the options below.
                    </Typography>
                    <Autocomplete
                      multiple
                      disabled={isUploading}
                      options={AllSkills}
                      value={skills}
                      onChange={handleChangeMainSkills}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="skills explored max 5*"
                          placeholder="skill"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((skill, index) => (
                          <Chip
                            label={skill}
                            {...getTagProps({ index })}
                            onDelete={() => handleDeleteMainSkills(skill)}
                          />
                        ))
                      }
                    />
                  </Box>


              <Box className="mb-3">
                  <React.Fragment>
                  <Typography gutterBottom variant="body2" color={"text.secondary"}>
                    Provide atleast four topics which you intend to cover.This may help 
                    the potential individuals in estimating worthiness of attending event. 
                    </Typography>
                    <Autocomplete
                      freeSolo
                      options={options_req} 
                      value={reqText}
                      onInputChange={handleTextChangeReq}
                      disableClearable
                      inputValue={reqText}
                      disabled={isUploading}
                      onChange={handleTextChangeReq}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={reqText.length>MAX_TOPIC_LENGTH}
                          label={`topic explored ${MAX_TOPIC_LENGTH-reqText.length} *`}
                          placeholder="introduction to machine learning"
                          fullWidth
                        />
                      )}
                    />

                    <Box sx={{ marginTop: 1 }}>
                      <Button
                        disableElevation
                        disabled={reqText.length>MAX_TOPIC_LENGTH}
                        startIcon={<Add />}
                        onClick={handleAddTopicRequirement}
                        size="small"
                        color="success"
                        sx={{ textTransform: "none" }}
                      >
                        Add Topic
                      </Button>
                    </Box>
                  </React.Fragment>
              
                {/* Display the added requirements */}
                {topicsRequirement.length > 0 && (
                  <Box mt={2} mb={2}>
                    <Box component={"ol"} bgcolor={"#f1f1f1"}>
                      {topicsRequirement.map((requirement, index) => (
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
                            {requirement}
                          </Typography>
                          {/* clear or delete icon */}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReq(requirement)}
                          >
                            <Close sx={{ width: 15, height: 15 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>


              {/* about your event */}
              <Box mb={3}>
              <Typography gutterBottom variant="body2" color={"text.secondary"}>
                  Write a brief description about your event highlighting the importance and the impact 
                  your event is aimed to address.
                  </Typography>
                <TextField
                  minRows={window.screen.availWidth <= 320 ? 3 : 5}
                  multiline
                  required
                  disabled={isUploading}
                  contentEditable={false}
                  error={about.length > MAX_ABOUT}
                  id="about-meeting-required"
                  label={`tell us about your event ${MAX_ABOUT - about.length}`}
                  fullWidth
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="we will explore the realm of machine learning..."
                />
              </Box>

              {/*  button for posting */}
              <Box mb={2} display={"flex"} justifyContent={"center"}>
                <Button
                  className="rounded-5"
                  variant="contained"
                  onClick={handleEventPost}
                  disabled={
                  isUploading || errorMessage ||
                  reqText.length>MAX_TOPIC_LENGTH || 
                  about.length>MAX_ABOUT}
                  startIcon={isUploading ? <CircularProgress/>:<TvRounded/>}
                  size='medium'
                >
                  Upload Event
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* show logout session expired alert */}
       {openAlertLogout && 
       <LogoutAlert
          openAlertLogout={openAlertLogout}
          setOpenAlertLogout={setOpenAlertLogout}
          title="Session Expired"
          body="please login to complete your request, your session has expired"
        />}
      </Box>
    </StyledModalEvent>
  );
};

export default EventsAddModal;
