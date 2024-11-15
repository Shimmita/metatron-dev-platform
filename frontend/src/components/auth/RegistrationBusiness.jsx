import {
  ArrowBackIosNewRounded,
  PaidRounded,
  StarRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
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
import AllCountries from "../data/AllCountries";
import EmployeesRange from "../data/EmployeesRange";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import RegisterAlertTitle from "./RegisterAlertTitle";

const RegistrationBusiness = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = useState("");
  const [about_org, setAboutOrg] = useState("");
  const [country, setCountry] = useState("");
  const [specialisationTitle, setSpecialisationTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState("");

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
              <PaidRounded color="success" sx={{ width: 18, height: 18 }} />
              <Typography
                variant={CustomDeviceSmallest() ? "caption" : "body2"}
                color={"text.secondary"}
              >
                Business Account Signup
              </Typography>
              <PaidRounded color="success" sx={{ width: 18, height: 18 }} />
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
                    placeholder="Intrasoft Solutions"
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
                    placeholder="busines email"
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
                    placeholder="+15472732073"
                  />
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="countries"
                    value={country}
                    label="Country"
                    className="w-75"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {AllCountries &&
                      AllCountries.map((country, index) => (
                        <MenuItem
                          key={index}
                          value={`${country.label} (${country.code}) +${country.phone}`}
                        >
                          {`${country.label} (${country.code}) +${country.phone}`}{" "}
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
                    id="designation-org"
                    value={specialisationTitle}
                    label={`Designation ${60 - specialisationTitle.length}`}
                    error={specialisationTitle.length > 60}
                    placeholder="Software Development Company"
                    className="w-75"
                    onChange={(e) => setSpecialisationTitle(e.target.value)}
                  />
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    select
                    id="employees"
                    value={employees}
                    label="Employees"
                    className="w-75"
                    onChange={(e) => setEmployees(e.target.value)}
                  >
                    {EmployeesRange &&
                      EmployeesRange.map((county) => (
                        <MenuItem key={county} value={county}>
                          {county}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Box display={"flex"} justifyContent={"center"}>
                  <TextField
                    required
                    id="about-org"
                    value={about_org}
                    label={`About ${500 - about_org.length}`}
                    error={about_org.length > 500}
                    placeholder="We are tech innovation..."
                    multiline
                    rows={6}
                    className="w-75"
                    onChange={(e) => setAboutOrg(e.target.value)}
                  />
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
                      Login
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

export default RegistrationBusiness;
