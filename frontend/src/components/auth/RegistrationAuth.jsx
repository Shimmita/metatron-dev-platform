import {
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import AllSkills from "../data/AllSkillsData";
import CountiesInKenya from "../data/Counties";
import EducationLevel from "../data/EducationLevel";
import GenderData from "../data/GenderData";
import SpecialisationGeneral from "../data/SpecialisationGenral";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";

const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [gender, setGender] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [county, setCounty] = useState("");
  const [imagePath, setImagePath] = useState();

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

  return (
    <Box
      height={"99vh"}
      className={"container"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        className=" shadow-lg rounded-4 px-3"
        width={"100%"}
        height={"90vh"}
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
          <Box mb={2}>
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
            gap={2}
          >
            <Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Typography variant="body2" color={"text.secondary"}>
                  profile image (optional)
                </Typography>
              </Box>
              <div>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    setImagePath(e.target.files[0]);
                    console.log(imagePath);
                  }}
                />
              </div>
            </Box>

            <Box>
              <TextField
                required
                id="name"
                label="Official Name"
                fullWidth
                onChange={(e) => setName(e.target.value.toLowerCase())}
                value={name}
                placeholder="Shirengo Michael"
              />
            </Box>

            <Box>
              <TextField
                required
                id="email"
                label="Email Address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="username@gmail.com"
                type="email"
              />
            </Box>
            <Box>
              <TextField
                required
                id="phone"
                label="Phone Number"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254xyz"
              />
            </Box>

            <Box>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Set Password &nbsp;*
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

            <Box>
              <TextField
                required
                select
                id="gender"
                value={gender}
                label="Select Gender"
                fullWidth
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

            <Box>
              <TextField
                required
                select
                id="educationLevel"
                value={educationLevel}
                label="Education Level"
                fullWidth
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

            <Box>
              <TextField
                required
                select
                id="speciality"
                value={specialisation}
                label="Select Speciality"
                fullWidth
                onChange={(e) => setSpecialisation(e.target.value)}
              >
                {SpecialisationGeneral &&
                  SpecialisationGeneral.map((specialisation) => (
                    <MenuItem key={specialisation} value={specialisation}>
                      {specialisation}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <Box>
              <Autocomplete
                multiple
                options={AllSkills}
                value={selectedSkills}
                onChange={handleChange}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Preferred Skills *"
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
              {selectedSkills.length >= 5 && (
                <Box sx={{ marginTop: 1, color: "red" }}>
                  You can select up to 5 skills only.
                </Box>
              )}
            </Box>

            <Box>
              <TextField
                required
                select
                id="county"
                value={county}
                label="Select County"
                fullWidth
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

            <Box display={"flex"} justifyContent={"center"}>
              {" "}
              <Typography variant="body2" color={"text.secondary"}>
                have an account? &nbsp;
                <Link
                  to={"/auth/login"}
                  className="text-decoration-none fw-bold"
                >
                  login
                </Link>
              </Typography>
            </Box>

            <Box pb={1} display={"flex"} justifyContent={"center"}>
              <Button
                variant="contained"
                className="w-25"
                sx={{ borderRadius: "20px" }}
                disableElevation
                onClick={(e) => {
                  navigate("/");
                }}
                type="submit"
              >
                Signup
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationAuth;
