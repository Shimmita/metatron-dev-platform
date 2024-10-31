import {
  ArrowBackIosNewRounded,
  StarRounded,
  Visibility,
  VisibilityOff,
  WbIncandescentRounded,
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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import EducationLevel from "../data/EducationLevel";
import GenderData from "../data/GenderData";
import SpecialisationJobs from "../data/SpecialisationJobs";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import RegisterAlertTitle from "./RegisterAlertTitle";

const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [gender, setGender] = useState("");
  const [specialisationTitle, setSpecialisationTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [county, setCounty] = useState("");

  // control showing of the next and previous input detail
  const [showNext, setShowNext] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [selectedSkills, setSelectedSkills] = useState([]);

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

  // will define showing of custo title or not
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (specialisationTitle === "Zero Matched") setOpenAlert(true);
  }, [specialisationTitle]);

  return (
    <Box
      height={"100vh"}
      className={"container"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
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
              <StarRounded sx={{ width: 18, height: 18 }} />
              Kenya's Best IT Platform{" "}
              <StarRounded sx={{ width: 18, height: 18 }} />
            </Typography>

            <Box
              mb={2}
              display={"flex"}
              justifyContent={"center"}
              gap={1}
              alignItems={"center"}
            >
              <WbIncandescentRounded
                sx={{ width: 18, height: 18, color: "orange" }}
              />
              <Typography
                variant={CustomDeviceSmallest() ? "caption" : "body2"}
                color={"text.secondary"}
              >
                Enlighting Technology Country Wide
              </Typography>
              <WbIncandescentRounded
                sx={{ width: 18, height: 18, color: "orange" }}
              />
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
                    onChange={(e) => setName(e.target.value.toLowerCase())}
                    value={name}
                    placeholder="Shirengo Michael"
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
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
                    {GenderData &&
                      GenderData.map((gender) => (
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
                {/* next section details */}

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
                    {EducationLevel &&
                      EducationLevel.map((education_level) => (
                        <MenuItem key={education_level} value={education_level}>
                          {education_level}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    id="edu-institution"
                    value={eduInstitution}
                    label="Institution"
                    placeholder="University/Collage Name"
                    className="w-75"
                    onChange={(e) => setEduInstitution(e.target.value)}
                  />
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="speciality"
                    value={specialisationTitle}
                    label="Title"
                    className="w-75"
                    onChange={(e) => setSpecialisationTitle(e.target.value)}
                  >
                    {SpecialisationJobs &&
                      SpecialisationJobs.map((specialisation_title) => (
                        <MenuItem
                          key={specialisation_title}
                          value={specialisation_title}
                        >
                          {specialisation_title}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

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
                    {CountiesInKenya &&
                      CountiesInKenya.map((county) => (
                        <MenuItem key={county} value={county}>
                          {county}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
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
                <React.Fragment>
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
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button
                    variant="contained"
                    className="w-25"
                    sx={{ borderRadius: "20px" }}
                    disableElevation
                    onClick={(e) => navigate("/")}
                    type="submit"
                  >
                    Signup
                  </Button>
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* show alert when zero selection is matched */}
      <RegisterAlertTitle
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        setSpecialisationTitle={setSpecialisationTitle}
      />
    </Box>
  );
};

export default RegistrationAuth;
