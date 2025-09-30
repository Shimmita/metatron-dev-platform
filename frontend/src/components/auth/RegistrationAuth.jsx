import {
  ArrowBackIosNewRounded,
  CheckCircle,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded,
  WorkRounded
} from "@mui/icons-material";
import {
  Autocomplete,
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
  Typography
} from "@mui/material";
import React, { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AlertCountry from "../alerts/AlertCountry";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertProfileCompletion from "../alerts/AlertProfileCompletion";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import EducationLevel from "../data/EducationLevel";
import GenderData from "../data/GenderData";
import Institutions from "../data/Institution";
import SpecialisationJobs from "../data/SpecialisationJobs";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import AccountVersion from "../data/AccountVersion";
import OrgSpecializations from "../data/OrgSpecializations";
import AlertOrgCompletion from "../alerts/AlertOrgCompletion";
const RegisterAlertTitle = lazy(() => import("./RegisterAlertTitle"));

const MAX_ABOUT=400

const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [gender, setGender] = useState("");
  const [specialisationTitle, setSpecialisationTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [county, setCounty] = useState("");
  const [missingFieldMessage, setMissingFieldMessage] = useState("");
  const [openAlertGenral, setOpenAlertGenral] = useState(false);
  const [titleAlert, setTitleAlert] = useState();
  const [account,setAccount]=useState(AccountVersion[0])
  const [selectedSkills, setSelectedSkills] = useState([]);
  // control edu institutions
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduInputValue, setEduInputValue] = useState("");
  const [inputCounties, setInputCounties] = useState("");
  const [options, setOptions] = useState(Institutions);
  // about field for business account
  const [about, setAbout] = useState("");

  // track business a/c
  let isPersonal=account==="Personal"

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
  const { currentMode } = useSelector((state) => state.appUI);
  // update is dark const
  const isDarkMode=currentMode==='dark'

  // handle showing next and prev inputs
  const handleShowNext = () => {
    setShowNext((prev) => !prev);
  };

  //handle selection institution
  const handleAddNew = () => {
    if (eduInputValue && !options.includes(eduInputValue)) {
      setOptions([...options, eduInputValue]);
      setEduInstitution(eduInputValue);
      setEduInputValue("");
    }
  };
  // clear an institution
  const handleDeleteInstitution = () => {
    setEduInstitution(null);
  };

  // clear county
  const handleDeleteCounty = () => {
    setCounty(null);
  };

  // add new county
  const handleAddNewCounty = () => {
    if (inputCounties && !CountiesInKenya.includes(inputCounties)) {
      setCounty(setInputCounties);
      setInputCounties("");
    }
  };

  // zero match
  useEffect(() => {
    if (specialisationTitle === "Zero Matched") setOpenAlert(true);
  }, [specialisationTitle,name,phone]);

  const handleMissingField = () => {

    if (
    name.trim().split(" ").length!==2
    ) {
      setTitleAlert("Name Field");
      setMissingFieldMessage("Please provide two names in order to complete your profile");
      setOpenAlertGenral(true);
      return true;
    }

    if (name?.trim() === "") {
      setTitleAlert("Missing Field");
      setMissingFieldMessage(
        "Please fill all the missing fields, your name is missing !"
      );
      setOpenAlertGenral(true);
      return true;
    }
    if (email?.trim() === "") {
      setTitleAlert("Missing Field");
      setMissingFieldMessage(
        "Please fill all the missing fields, your email is missing !"
      );
      return true;
    }
    if (password?.trim() === "") {
      setTitleAlert("Missing Field");
      setMissingFieldMessage(
        "Please fill all the missing fields, your password is missing !"
      );
      return true;
    }
    if (isPersonal) {
      if (gender?.trim() === "") {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please fill all the missing fields, your gender is missing !"
        );
        return true;
      }
      if (specialisationTitle.trim() === "") {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please fill all the missing fields, your preferred title is missing !"
        );
        return true;
      }
      if (!selectedSkills.length > 0) {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please fill all the missing fields, your skills missing atleast provide one skill or at most five !"
        );
        return true;
      }
      if (educationLevel?.trim() === "") {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please fill all the missing fields, field level of education is missing !"
        );
        return true;
      }
      if (eduInstitution?.trim() === "") {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please fill all the missing fields, your education institution is missing !"
        );
        return true;
      }
    } else {
      // Business account: check about field
      if (about.trim() === "") {
        setTitleAlert("Missing Field");
        setMissingFieldMessage(
          "Please provide a brief about your organization."
        );
        return true;
      }
    }
    if (phone?.trim() === "") {
      setTitleAlert("Missing Field");
      setMissingFieldMessage(
        "Please fill all the missing fields, your phone is missing !"
      );
      return true;
    }

    // phone must be a number
    if (!Number.isInteger(parseInt(phone?.trim()/1)) ) {
      setTitleAlert("Incorrect Phone")
      setMissingFieldMessage('provided phone number is not acceptable!')
      return true
    }

    if (county?.trim() === "") {
      setTitleAlert("Missing Field");
      setMissingFieldMessage(
        "Please fill all the missing fields, your county or location is missing !"
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
        educationLevel: isPersonal ? educationLevel : "",
        eduInstitution: isPersonal ? eduInstitution : "",
        phone,
        country,
        county,
        gender: isPersonal ? gender : "",
        specialisationTitle,
        selectedSkills: isPersonal ? selectedSkills : "",
        account,
        about: !isPersonal ? about : ""
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
        bgcolor={!isDarkMode && "background.default"}
        width={"100%"}
        maxHeight={'98vh'}
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
            <Typography
              textAlign={"center"}
              fontWeight={"bold"}
              mt={1}
              textTransform={"uppercase"}
              variant={CustomDeviceSmallest() ? "body1" : "h6"}
              gutterBottom
              color={"primary"}
            >
              Metatron Developer
            </Typography>

            <Typography
              fontWeight={"bold"}
              color={"text.secondary"}
              variant="body2"
              mb={1}
              textTransform={"capitalize"}
              display={"flex"}
              gap={1}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <WbIncandescentRounded sx={{ width: 20, height: 20,color: "orange" }} />
              Ultimate Tech Platform{" "}
              <WbIncandescentRounded sx={{ width: 20, height: 20,color: "orange" }} />
            </Typography>

            <Box
              mb={1}
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
                User Account Signup
              </Typography>
              <WorkRounded color="primary" sx={{ width: 17, height: 17 }} />
            </Box>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            gap={2}
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
                    placeholder="FirstName LastName"
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
                    placeholder={`${country?.split(" ")[0]}xyz`}
                  />
                </Box>

                    {isPersonal && (
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
                              <MenuItem 
                              key={gender} 
                              value={gender}>
                                {gender}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    )}

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
                      inputMode="text"
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
                      isPersonal ?
                      SpecialisationJobs?.map((specialisation_title) => (
                        <MenuItem
                          key={specialisation_title}
                          value={specialisation_title}
                        >
                      
                        {/* skill name */}
                          {specialisation_title}
                        </MenuItem>
                      )) :
                      OrgSpecializations?.map((specialisation_title) => (
                        <MenuItem
                          key={specialisation_title}
                          value={specialisation_title}
                        >
                      
                        {/* skill name */}
                          {specialisation_title}
                        </MenuItem>
                      ))
                      
                      }
                  </TextField>
                </Box>

                {/* education, institution, skills only for personal account */}
                {isPersonal && (
                  <>
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
                            <MenuItem 
                            key={education_level} 
                            value={education_level}>
                              {education_level}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>

                    {/* show this if country includes kenya's institutions */}
                    {country?.trim().toLowerCase().includes("kenya") ? (
                      <Box display={"flex"} justifyContent={"center"}>
                        <Autocomplete
                          value={eduInstitution}
                          className="w-75"
                          onChange={(event, newValue) => {
                            setEduInstitution(newValue);
                          }}
                          inputValue={eduInputValue}
                          onInputChange={(event, newInputValue) => {
                            setEduInputValue(newInputValue);
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
                            <li key={option} {...props}>{option}</li>
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
                              label={`Add "${eduInputValue}"`}
                              onClick={handleAddNew}
                              icon={<CheckCircle />}
                              color="primary"
                              clickable
                            />
                          }
                        />
                      </Box>
                    ) : (
                      <Box display={"flex"} 
                      justifyContent={"center"}>
                        <TextField
                          required
                          id="institution-other"
                          label="Institution"
                          className="w-75"
                          value={eduInstitution}
                          onChange={(e) => setEduInstitution(e.target.value)}
                          placeholder="Education Institution"
                        />
                      </Box>
                    )}

                    {/* skills */}
                    <Box 
                    display={"flex"} 
                    justifyContent={"center"}>
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
                              key={index}
                            />
                          ))
                        }
                      />
                    </Box>
                  </>
                )}

                {/* show this if country includes kenya for ke counties */}
                    {country?.trim().toLowerCase().includes("kenya") ? (
                      <Box 
                      display={"flex"} 
                      justifyContent={"center"}>
                        <Autocomplete
                          value={county}
                          className="w-75"
                          onChange={(event, newValue) => {
                            setCounty(newValue);
                          }}
                          inputValue={inputCounties}
                          onInputChange={(event, newInputValue) => {
                            setInputCounties(newInputValue);
                          }}
                          options={CountiesInKenya}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="County, City or State"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>{option}</li>
                          )}
                          renderTags={() =>
                            county ? (
                              <Chip
                                label={county}
                                onDelete={handleDeleteCounty}
                                deleteIcon={<CheckCircle />}
                              />
                            ) : null
                          }
                          noOptionsText={
                            <Chip
                              label={`Add "${eduInputValue}"`}
                              onClick={handleAddNewCounty}
                              icon={<CheckCircle />}
                              color="primary"
                              clickable
                            />
                          }
                        />
                      </Box>
                    ) : (
                      <Box 
                      display={"flex"} 
                      justifyContent={"center"}>
                        <TextField
                          required
                          id="county-other"
                          label="County, City or State"
                          className="w-75"
                          value={county}
                          onChange={(e) => setCounty(e.target.value)}
                          placeholder="County"
                        />
                      </Box>
                    )}

                {/* About field for business account */}
                {!isPersonal && (
                  <Box display={"flex"} justifyContent={"center"}>
                    <TextField
                      required
                      id="about-org"
                      label={`About Organisation ${MAX_ABOUT-about.length}`}
                      className="w-75"
                      maxRows={5}
                      value={about}
                      error={about.length>MAX_ABOUT}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="About your organization"
                      multiline
                      minRows={3}
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
                    disabled={openAlertProfile || about.length>MAX_ABOUT}
                    onClick={handleUserRegistration}
                    type="submit"
                  >
                    Signup
                  </Button>
              )}
            </Box>
          </Box>
      </Box>

      {/* show alert for custom title when zero selection is matched */}
      {openAlert && (
        <RegisterAlertTitle
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setSpecialisationTitle={setSpecialisationTitle}
      />
    )}

      {/* alert general */}
      {openAlertGenral && (
        <AlertGeneral
        openAlertGeneral={openAlertGenral}
        setOpenAlertGeneral={setOpenAlertGenral}
        title={titleAlert}
        message={missingFieldMessage}
        setErrorMessage={setMissingFieldMessage}
      />
      )}

      {/* alert profile picture completion */}
      {openAlertProfile && isPersonal ? (
        <AlertProfileCompletion
        openAlertProfile={openAlertProfile}
        setOpenAlertProfile={setOpenAlertProfile}
        user={user}
        isPersonal={isPersonal}
      />
      ):(
        <AlertOrgCompletion
          user={user}
          openAlertProfile={openAlertProfile}
          setOpenAlertProfile={setOpenAlertProfile}
        />
      )}

      {/* alert country of the user */}
      {openAlertCountry && (
        <AlertCountry
        openAlertCountry={openAlertCountry}
        setOpenAlertCountry={setOpenAlertCountry}
        country={country}
        setCountry={setCountry}
        account={account}
        setAccount={setAccount}
      />
      )}
    </Box>
  );
};

export default RegistrationAuth;
