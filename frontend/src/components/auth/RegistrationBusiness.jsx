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
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import CountiesInKenya from "../data/Counties";
import GenderData from "../data/GenderData";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
const AlertCountry = lazy(() => import("../alerts/AlertCountry"));
const AlertGeneral = lazy(() => import("../alerts/AlertGeneral"));
const AlertProfileCompletion = lazy(() =>
  import("../alerts/AlertProfileCompletion")
);

const RegistrationBusiness = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = useState("");
  const [about_org, setAboutOrg] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState("");
  const [size, setSize] = useState("");
  const [designation, setDesignation] = useState("");
  const [apply, setApply] = useState("");
  const [ownership, setOwnership] = useState("");
  const [gender, setGender] = useState("");
  const [owner, setOwner] = useState("");
  const [permitted, setPermitted] = useState("");
  const [terms, setTerms] = useState("");

  // handle missing fields and alo showing of signup alert
  const [titleAlert, setTitleAlert] = useState();
  const [missing_field_msg, setMissinFieldMsg] = useState("");
  const [openAlertGenral, setOpenAlertGenral] = useState(false);

  // business object
  const [business, setBusiness] = useState({});
  // alert profile pic
  const [openAlertProfile, setOpenAlertProfile] = useState(false);

  // alert country before proceed
  const [openAlertCountry, setOpenAlertCountry] = useState(true);

  // control showing of the next and previous input detail
  const [showNext, setShowNext] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // global dark mode state from redux
  const { isDarkMode } = useSelector((state) => state.appUI);

  // handle showing next and prev inputs
  const handleShowNext = () => {
    setShowNext((prev) => !prev);
  };

  const handleMissingField = () => {
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
        "Please fill all the missing fields, your city/state/county/location is missing !"
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
        designation,
        employees,
        owner,
        ownership,
        phone,
        country,
        county,
        gender,
        about_org,
        size,
        apply,
        permitted,
        terms,
      };
      // set the user object
      setBusiness(user);

      // set open alertProfile where user will now pos data if necessary
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
                    label="Business Name"
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
                    label="Business Email"
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
                    label="Business Phone"
                    className="w-75"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+15472732073"
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
                      label="County or Location"
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
                {/* displayed when apply jobs field is yes means user can apply gigs */}

                {apply?.toLowerCase().includes("yes") && (
                  <React.Fragment>
                    <Box display={"flex"} justifyContent={"center"}>
                      <TextField
                        required
                        id="owner"
                        label="Owner's Name"
                        className="w-75"
                        onChange={(e) => setOwner(e.target.value.toLowerCase())}
                        value={owner}
                        placeholder="Your name"
                      />
                    </Box>

                    <Box display={"flex"} justifyContent={"center"}>
                      <TextField
                        required
                        select
                        id="gender"
                        value={gender}
                        label="Your Gender"
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
                  </React.Fragment>
                )}

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
                    sx={{
                      borderRadius: "20px",
                      visibility: openAlertCountry ? "hidden" : undefined,
                    }}
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
                    type="submit"
                    disabled={openAlertProfile}
                    onClick={handleUserRegistration}
                  >
                    Signup
                  </Button>
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

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
        user={business}
      />

      {/* alert country of the user */}
      <AlertCountry
        openAlertCountry={openAlertCountry}
        setOpenAlertCountry={setOpenAlertCountry}
        country={country}
        setCountry={setCountry}
        isBusiness={true}
        setEmployees={setEmployees}
        setDesignation={setDesignation}
        setApply={setApply}
        setSize={setSize}
        setOwnership={setOwnership}
        employees={employees}
        size={size}
        designation={designation}
        ownership={ownership}
        apply={apply}
        terms={terms}
        permitted={permitted}
        setTerms={setTerms}
        setPermitted={setPermitted}
      />
    </Box>
  );
};

export default RegistrationBusiness;
