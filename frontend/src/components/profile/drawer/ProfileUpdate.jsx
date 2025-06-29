import { CheckCircle, Close, UpdateRounded } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Collapse,
  FormControlLabel,
  IconButton,
  MenuItem,
  styled,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DevImage from "../../../images/dev.jpeg";
import { updateUserCurrentUserRedux } from "../../../redux/CurrentUser";
import AllCountries from "../../data/AllCountries";
import AllSkills from "../../data/AllSkillsData";
import CountiesInKenya from "../../data/Counties";
import BrowserCompress from "../../utilities/BrowserCompress";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

const VisuallyHiddenInput = styled("input")({
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

let MAX_ABOUT = 142;

function ProfileUpdate({ user }) {
  const [imagePreview, setImagePreview] = useState(user?.avatar);
  const [responseMessage, setResponseMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  // for monitoring api request status
  const [isConnecting, setIsConnecting] = useState(false);
  const [about, setAbout] = useState(`${user?.about || ""}`);
  const [selectedSkills, setSelectedSkills] = useState([
    ...user?.selectedSkills,
  ]);

  const [specialisationTitle, setSpecialisationTitle] = useState(
    `${user?.specialisationTitle}`
  );
  const [phone, setPhone] = useState(`${user?.phone}`);
  const [country, setCountry] = useState(`${user?.country}`);
  const [county, setCounty] = useState(`${user?.county}`);
  const [gitHub, setGitHub] = useState(`${user?.gitHub}`);
  const [linkedin, setLinkedin] = useState(`${user?.linkedin}`);
  const [portfolio, setPortfolio] = useState(`${user?.portfolio}`);
  const [oldPassword,setOldPassword]=useState("")
  const [newPassword,setNewPassword]=useState("")
  
  // controls passwords toggle
  const[togglePassword,setTogglePassword]=useState(true)

  //   control the country selection
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(
    AllCountries.map((val) => {
      let country = `+${val.phone} ${val.label} (${val.code})`;
      return country;
    }).sort((a,b)=>a.localeCompare(b))
  );

  // redux
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  //   handle file change
  const handleFileChange = async (event) => {
    let file = event.target.files[0];
    // convert or compress the image
    const compressedFile = await BrowserCompress(file);
    // create a url for image preview
    setImagePreview(URL.createObjectURL(compressedFile));
    setAvatarFile(compressedFile);
  };

  const handleChange = (event, newValue) => {
    if (newValue.length > 5) {
      return; // Limit to 5 selections
    }
    setSelectedSkills(newValue);
  };

  const handleDelete = (skillToDelete) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

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

  //   flag of country extraction
  const handleFlagCountry = (option) => {
    let split_res = option.split(" ");
    return split_res[split_res.length - 1].substring(1, 3).toLowerCase();
  };

  // handle updating of the details
  const userData = {
    about,
    selectedSkills,
    specialisationTitle,
    phone,
    country,
    county,
    gitHub,
    portfolio,
    linkedin,
  };

  const handleUserUpdate = () => {
    // appending old and new passwords 
    if (!togglePassword) {
      userData.oldPassword=oldPassword
      userData.newPassword=newPassword
    }
    // set is connecting to true
    setIsConnecting(true);
    // if there is a file means user updating their profile image
    const formData = new FormData();
    formData.append("image", avatarFile);
    formData.append("user", JSON.stringify(userData));

    // start the put request axios
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/update/${user?._id}`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // update current user redux
          dispatch(updateUserCurrentUserRedux(res.data.data));
          // update message response
          setResponseMessage(res.data.message);
        }
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setResponseMessage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setResponseMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsConnecting(false);
      });
  };

  const handleClose = () => {
    // clear any messages info
    setResponseMessage("");
  };

  // handle clearing of the message
  const handleClearMessage = () => {
    setResponseMessage("");
  };

  // handle toggling of passwords to edit mode
  const handleTogglePasswords=()=>{
    setTogglePassword(prev=>!prev)
  }

  return (
    <Box
      p={1}
      maxHeight={"90vh"}
      sx={{
        overflowX: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Box
        display={"flex"}
        gap={2}
        py={3}
        px={CustomDeviceIsSmall() ? 1 : 3}
        justifyContent={"center"}
        flexDirection={"column"}
        borderRadius={2}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        {/* display message response from the backend */}
        {/* message from backend of connect request */}
        {responseMessage && (
            <Collapse in={responseMessage || false}>
              <Alert
                severity="info"
                onClose={handleClose}
                className="rounded"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClearMessage}
                  >
                    <Close fontSize="inherit" sx={{ width: 15, height: 15 }} />
                  </IconButton>
                }
              >
                {responseMessage}
              </Alert>
            </Collapse>
        )}

        {/* avatar image for updating */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={1}
        >
          <Avatar
            src={imagePreview}
            alt={''}
            sx={{ width: 90, height: 90 }}
          />

          {/* pick image icon button */}
          <Button
            component="label"
            role={undefined}
            variant="text"
            size={"small"}
            sx={{ borderRadius: 5 }}
            tabIndex={-1}
          >
            change
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
          </Button>
        </Box>

        {/* skills avatars */}
        <Box display={"flex"} justifyContent={"center"}>
          {/* avatar skills */}
          <AvatarGroup max={user?.selectedSkills?.length}>
            {/* loop through the skills and their images matched using custom fn */}
            {user?.selectedSkills?.map((skill, index) => (
              <Tooltip title={skill} key={skill} arrow>
                <Avatar
                  alt={skill}
                  className="border"
                  sx={{ width: 32, height: 32 }}
                  src={getImageMatch(skill)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        {/* skills in text */}
        <Box
          display={"flex"}
          gap={1}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {user?.selectedSkills?.map((skill, index) => (
            <Typography variant="caption" key={index}>
              {skill}
            </Typography>
          ))}
        </Box>

        {/* user name disabled from editing */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"name"}
            id="filled-basic-user-name"
            disabled
            fullWidth
            value={user?.name}
          />
        </Box>

        {/* display email */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"email"}
            id="filled-basic-user-email"
            disabled
            fullWidth
            value={user?.email}
          />
        </Box>

        {/* phone */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"phone"}
            id="filled-basic-user-phone"
            fullWidth
            disabled={isConnecting || responseMessage}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>

        {/* country */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <Autocomplete
            value={country}
            onChange={(event, newValue) => {
              setCountry(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={options}
            freeSolo
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={isConnecting || responseMessage}
                label="select country"
                sx={{ width: "100%" }}
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

        {/* county */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          {/* show this if country is contains kenya */}
          {country?.trim().toLowerCase().includes("kenya") ? (
            <TextField
              required
              select
              disabled={isConnecting || responseMessage}
              id="county"
              value={county}
              label="county"
              fullWidth
              onChange={(e) => setCounty(e.target.value)}
            >
              {CountiesInKenya?.map((county) => (
                  <MenuItem key={county} value={county}>
                    {county}
                  </MenuItem>
                ))}
            </TextField>
          ) : (
            <TextField
              required
              id="county_state_other"
              label="city or state"
              fullWidth
              disabled={isConnecting || responseMessage}
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="my city or state"
            />
          )}
        </Box>

        {/* specialisation */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"expertise"}
            id="filled-basic-user-expertise"
            fullWidth
            disabled={isConnecting || responseMessage}
            value={specialisationTitle}
            onChange={(e) => setSpecialisationTitle(e.target.value)}
          />
        </Box>

        {/* old password */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"old password"}
            id="filled-basic-user-old-password"
            fullWidth
            disabled={isConnecting || responseMessage || togglePassword}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Box>

          {/* new password */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"new password"}
            id="filled-basic-user-new-password"
            fullWidth
            disabled={isConnecting || responseMessage || togglePassword}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Box>


        {/* Github */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"gitHub link"}
            id="filled-basic-user-github"
            fullWidth
            disabled={isConnecting || responseMessage}
            value={gitHub}
            onChange={(e) => setGitHub(e.target.value)}
          />
        </Box>

        {/* linkedin */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"linkedin link"}
            id="filled-basic-user-linkedin"
            fullWidth
            disabled={isConnecting || responseMessage}
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </Box>

        {/* portfolio */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"} mt={1}>
          <TextField
            label={"website portfolio link"}
            id="filled-basic-user-portfolio"
            fullWidth
            disabled={isConnecting || responseMessage}
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
          />
        </Box>


        {/* skills update */}
        <Box display={"flex"} justifyContent={"center"} mt={1}>
          <Autocomplete
            multiple
            options={AllSkills}
            disabled={isConnecting || responseMessage}
            value={selectedSkills}
            onChange={handleChange}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                label="skills"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((skill, index) => (
                <Chip
                  label={skill}
                  {...getTagProps({ index })}
                  onDelete={() => handleDelete(skill)}
                />
              ))
            }
          />
        </Box>

        {/* about */}
        <Box display={"flex"} justifyContent={"center"} mt={1}>
          <TextField
            id="outlined-basic-about-text"
            minRows={3}
            maxRows={3}
            error={about.length > MAX_ABOUT}
            value={about}
            label={`about me ${MAX_ABOUT - about.length}`}
            onChange={(e) => setAbout(e.target.value)}
            fullWidth
            disabled={isConnecting || responseMessage}
            multiline
            variant="outlined"
          />
        </Box>

        {/* toggle password update */}
        <Box ml={1}>
        <FormControlLabel  control={<Switch size="small" onChange={handleTogglePasswords} />} label="update my password" />
        </Box>

        {/* update button */}
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            disableElevation
            startIcon={<UpdateRounded />}
            variant="contained"
            onClick={handleUserUpdate}
            disabled={
              isConnecting || responseMessage || about.length > MAX_ABOUT
            }
            sx={{ borderRadius: 2, width: "100%" }}
          >
            {" "}
            Update Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileUpdate;
