import {
  ArrowBackIosNewRounded,
  CheckCircle,
  StarRounded,
  Visibility,
  VisibilityOff,
  WorkRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import AlertCountry from "../alerts/AlertCountry";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import EducationLevel from "../data/EducationLevel";
import GenderData from "../data/GenderData";
import Institutions from "../data/Institution";
import SpecialisationJobs from "../data/SpecialisationJobs";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
const AlertGeneral = lazy(() => import("../alerts/AlertGeneral"));
const AlertProfileCompletion = lazy(() =>
  import("../alerts/AlertProfileCompletion")
);
const RegisterAlertTitle = lazy(() => import("./RegisterAlertTitle"));

const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [gender, setGender] = useState("");
  const [specialisationTitle, setSpecialisationTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [county, setCounty] = useState("");
  const [missing_field_msg, setMissinFieldMsg] = useState("");
  const [openAlertGenral, setOpenAlertGenral] = useState(false);
  const [titleAlert, setTitleAlert] = useState();
  const [selectedSkills, setSelectedSkills] = useState([]);
  // control edu institutions
  const [eduInstitution, setEduInstitution] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(Institutions);
  // user object
  const [user, setUser] = useState({});

  // alert profile pic
  const [openAlertProfile, setOpenAlertProfile] = useState(false);
  // alert country before proceed
  const [openAlertCountry, setOpenAlertCountry] = useState(true);
  // will define showing of custom title alert or not
  const [openAlert, setOpenAlert] = useState(false);

  // control showing of the next and previous input detail
  const [showNext, setShowNext] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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

  // global dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  // handle showing next and prev inputs
  const handleShowNext = () => {
    setShowNext((prev) => !prev);
  };

  const handleAddNew = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setEduInstitution(inputValue);
      setInputValue("");
    }
  };
  // clear an institution
  const handleDeleteInstitution = () => {
    setEduInstitution(null);
  };

  // zero match
  useEffect(() => {
    if (specialisationTitle === "Zero Matched") setOpenAlert(true);
  }, [specialisationTitle]);

  const handleMissingField = () => {
    if (
      name.trim().split(" ").length < 1 ||
      name.trim().split(" ").length > 2
    ) {
      setTitleAlert("Name Field");
      setMissinFieldMsg("Please provide two names");
      setOpenAlertGenral(true);
      return true;
    }

    if (name.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your name is missing !"
      );
      setOpenAlertGenral(true);
      return true;
    }
    if (email.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your email is missing !"
      );
      return true;
    }
    if (password.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your password is missing !"
      );
      return true;
    }
    if (educationLevel.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, field level of education is missing !"
      );
      return true;
    }
    if (eduInstitution.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your education institution is missing !"
      );
      return true;
    }
    if (phone.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your phone is missing !"
      );
      return true;
    }
    if (county.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your county or location is missing !"
      );
      return true;
    }
    if (gender.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your gender is missing !"
      );
      return true;
    }

    if (specialisationTitle.trim() === "") {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your preferred title is missing !"
      );
      return true;
    }
    if (!selectedSkills.length > 0) {
      setTitleAlert("Missing Field");
      setMissinFieldMsg(
        "Please fill all the missing fields, your skills missing atleast provide one skill or at most five !"
      );
      return true;
    }
    return false;
  };

  // handle registration of user
  const handleUserRegistration = () => {
    // check any missing data and alert
    if (handleMissingField()) {
      setOpenAlertGenral(true);
    } else {
      const user = {
        name,
        email,
        password,
        educationLevel,
        eduInstitution,
        phone,
        country,
        county,
        gender,
        specialisationTitle,
        selectedSkills,
      };
      // set the user object
      setUser(user);

      // set open alertProfile where user will now post data if necessary
      setOpenAlertProfile(true);
    }
  };

  return (
    <Box
      height={"100vh"}
      className={"container"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ opacity: openAlertProfile ? ".5" : undefined }}
    >
      <Box
        className={isDarkMode ? "rounded-4" : "shadow-lg rounded-4"}
        border={isDarkMode ? "1px solid gray" : "none"}
        width={"100%"}
        height={CustomDeviceSmallest() ? "95vh" : undefined}
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
        <Box>
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar alt={"logo"} sx={{ width: 70, height: 70 }} src={logo} />
          </Box>
          <Box mb={3}>
            <Typography
              textAlign={"center"}
              fontWeight={"bold"}
              textTransform={"uppercase"}
              variant={CustomDeviceSmallest() ? "body1" : "h6"}
              gutterBottom
              color={"primary"}
            >
              Metatron Foundation
            </Typography>

            <Typography
              fontWeight={"bold"}
              color={"text.secondary"}
              variant="body2"
              mb={2}
              textTransform={"capitalize"}
              display={"flex"}
              gap={1}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <StarRounded sx={{ width: 20, height: 20 }} />
              The Best IT Platform{" "}
              <StarRounded sx={{ width: 20, height: 20 }} />
            </Typography>

            <Box
              mb={2}
              display={"flex"}
              justifyContent={"center"}
              gap={1}
              alignItems={"center"}
            >
              <WorkRounded color="primary" sx={{ width: 17, height: 17 }} />
              <Typography
                variant={CustomDeviceSmallest() ? "caption" : "body2"}
                color={"text.secondary"}
              >
                Personal Account Signup
              </Typography>
              <WorkRounded color="primary" sx={{ width: 17, height: 17 }} />
            </Box>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            gap={3}
          >
            {/* first section */}

            {!showNext ? (
              <>
                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    id="name"
                    label="Name"
                    className="w-75"
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    value={name}
                    placeholder="Firstname Lastname"
                  />
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    id="email"
                    label="Email"
                    display={"flex"}
                    justifyContent={"center"}
                    className="w-75"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@gmail.com"
                    type="email"
                  />
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    id="phone"
                    label="Phone"
                    className="w-75"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254xyz"
                  />
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="gender"
                    value={gender}
                    label="Gender"
                    className="w-75"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    {
                      GenderData?.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <FormControl fullWidth variant="outlined" className="w-75">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password &nbsp;*
                    </InputLabel>
                    <OutlinedInput
                      required
                      value={password}
                      id="outlined-adornment-password"
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Box>
              </>
            ) : (
              <>

                {/* specialisation title */}
                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="preferred-title"
                    value={specialisationTitle}
                    label="Specialisation"
                    className="w-75"
                    onChange={(e) => setSpecialisationTitle(e.target.value)}
                  >
                    {
                      SpecialisationJobs?.map((specialisation_title) => (
                        <MenuItem
                          key={specialisation_title}
                          value={specialisation_title}
                        >
                          {specialisation_title}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                {/* education */}
                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="educationLevel"
                    value={educationLevel}
                    label="Education"
                    className="w-75"
                    onChange={(e) => setEducationLevel(e.target.value)}
                  >
                    {
                      EducationLevel?.map((education_level) => (
                        <MenuItem key={education_level} value={education_level}>
                          {education_level}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                {/* show this if country includes kenya */}
                {country?.trim().toLowerCase().includes("kenya") ? (
                  <Box display={"flex"} justifyContent={"center"}>
                    <Autocomplete
                      value={eduInstitution}
                      className="w-75"
                      onChange={(event, newValue) => {
                        setEduInstitution(newValue);
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
                          label="Institution"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>{option}</li>
                      )}
                      renderTags={() =>
                        eduInstitution ? (
                          <Chip
                            label={eduInstitution}
                            onDelete={handleDeleteInstitution}
                            deleteIcon={<CheckCircle />}
                          />
                        ) : null
                      }
                      noOptionsText={
                        <Chip
                          label={`Add "${inputValue}"`}
                          onClick={handleAddNew}
                          icon={<CheckCircle />}
                          color="primary"
                          clickable
                        />
                      }
                    />
                  </Box>
                ) : (
                  <Box display={"flex"} justifyContent={"center"}>
                    <TextField
                      required
                      id="institution-other"
                      label="Institution"
                      className="w-75"
                      value={eduInstitution}
                      onChange={(e) => setEduInstitution(e.target.value)}
                      placeholder="Education Instistution"
                    />
                  </Box>
                )}

                {/* skills */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Autocomplete
                    multiple
                    options={AllSkills}
                    value={selectedSkills}
                    onChange={handleChange}
                    disableCloseOnSelect
                    className="w-75"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Skills *"
                        placeholder="Skill"
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

                {/* show this if country is contains kenya */}
                {country?.trim().toLowerCase().includes("kenya") ? (
                  <Box display={"flex"} justifyContent={"center"}>
                    <TextField
                      required
                      select
                      id="county"
                      value={county}
                      label="County"
                      className="w-75"
                      onChange={(e) => setCounty(e.target.value)}
                    >
                      {
                        CountiesInKenya?.map((county) => (
                          <MenuItem key={county} value={county}>
                            {county}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                ) : (
                  <Box display={"flex"} justifyContent={"center"}>
                    <TextField
                      required
                      id="county_other"
                      label="City or State"
                      className="w-75"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="my city or state"
                    />
                  </Box>
                )}
              </>
            )}

            <Box display={"flex"} justifyContent={"center"}>
              <Box className={"w-75"}>
                {/* prev content toggle */}
                {showNext && (
                  <Box>
                    <IconButton size="small" onClick={handleShowNext}>
                      <ArrowBackIosNewRounded
                        color="primary"
                        sx={{ width: 17, height: 17 }}
                      />
                    </IconButton>
                  </Box>
                )}

                {/* back to login links */}
                <Box
                  display={"flex"}
                  gap={1}
                  width={"100%"}
                  justifyContent={"center"}
                >
                  {" "}
                  <Typography variant="body2" color={"text.secondary"}>
                    have an account?
                  </Typography>
                  <Link to={"/auth/login"} className="text-decoration-none">
                    <Typography
                      variant="body2"
                      sx={{ color: isDarkMode ? "#90CAF9" : "#1876D2" }}
                    >
                      login
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>

            <Box pb={1} display={"flex"} justifyContent={"center"}>
              {!showNext ? (
                  <Button
                    variant="contained"
                    className="w-25"
                    sx={{ borderRadius: "20px" }}
                    disableElevation
                    onClick={handleShowNext}
                    type="submit"
                  >
                    Next
                  </Button>
              ) : (
                  <Button
                    variant="contained"
                    className="w-25"
                    sx={{ borderRadius: "20px" }}
                    disableElevation
                    disabled={openAlertProfile}
                    onClick={handleUserRegistration}
                    type="submit"
                  >
                    Signup
                  </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* show alert for custom title when zero selection is matched */}
      <RegisterAlertTitle
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setSpecialisationTitle={setSpecialisationTitle}
      />

      {/* alert general */}
      <AlertGeneral
        openAlertGeneral={openAlertGenral}
        setOpenAlertGenral={setOpenAlertGenral}
        title={titleAlert}
        message={missing_field_msg}
      />

      {/* alert profile picture completion */}
      <AlertProfileCompletion
        openAlertProfile={openAlertProfile}
        setOpenAlertProfile={setOpenAlertProfile}
        user={user}
      />
      {/* alert country of the user */}
      <AlertCountry
        openAlertCountry={openAlertCountry}
        setOpenAlertCountry={setOpenAlertCountry}
        country={country}
        setCountry={setCountry}
      />
    </Box>
  );
};

export default RegistrationAuth;
