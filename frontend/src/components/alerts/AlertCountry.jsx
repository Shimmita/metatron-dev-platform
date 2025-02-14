import {
  BusinessRounded,
  CheckCircle,
  Close,
  PublicRounded,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPolicyTerms from "../auth/ModalPolicyTerms";
import AllCountries from "../data/AllCountries";
import BusinessData from "../data/BusinessData";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertCountry({
  openAlertCountry,
  setOpenAlertCountry,
  setCountry,
  country = "",
  isBusiness,
  setEmployees,
  setSize,
  setDesignation,
  setApply,
  setOwnership,
  size,
  designation,
  apply,
  ownership,
  employees,
  permitted,
  terms = "",
  setPermitted,
  setTerms,
}) {
  const navigate = useNavigate();
  //   control the country selection
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState(
    AllCountries.map((val) => {
      let country = `+${val.phone} ${val.label} (${val.code})`;
      return country;
    }).sort()
  );

  // control showing of terms alert
  const [openTerms, setOpenTerms] = useState(false);
  useEffect(() => {
    if (terms?.trim().toLowerCase() === "show") {
      setOpenTerms(true);
    }
  }, [terms]);

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

  const handleClose = () => {
    // close alert
    setOpenAlertCountry(false);
  };

  // handle submission
  const handleSubmission = () => {
    // business a/c
    if (isBusiness) {
      if (
        country &&
        employees &&
        size &&
        designation &&
        apply &&
        ownership &&
        terms &&
        permitted
      ) {
        // check if terms is show and reject since must be yes
        if (terms?.trim().toLowerCase() === "show") {
          setError("please confirm terms of service");
        } else {
          // clear error message if any
          setError("");
          // close dialog
          handleClose();
        }
      } else {
        // fields not filled all
        setError("please fill all the missing fields");
      }
    } else {
      // this is personal account we needs only country field
      if (country) {
        // clear error message if any
        setError("");
        // close dialog
        handleClose();
      } else {
        // country empty
        setError("please select your country");
      }
    }
  };

  const handleFlagCountry = (option) => {
    let split_res = option.split(" ");
    return split_res[split_res.length - 1].substring(1, 3).toLowerCase();
  };

  // const return to login when close icon on alert country clicked
  const handleBackLogin = () => {
    // close the dialog
    handleClose();
    // nav home if user not logged in then login page be shown
    navigate("/");
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlertCountry && !openTerms}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box height={isBusiness ? "65vh" : undefined} width={"100%"}>
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo+ title  */}
            <Box display={"flex"} gap={2} alignItems={"center"}>
              {isBusiness ? (
                <>
                  <BusinessRounded
                    sx={{ width: 30, height: 30 }}
                    color="primary"
                  />
                  <Typography variant="body1">Business Details</Typography>
                </>
              ) : (
                <>
                  <PublicRounded
                    sx={{ width: 30, height: 30 }}
                    color="primary"
                  />
                  <Typography variant="body1">Country?</Typography>
                </>
              )}
            </Box>
            {/* close button */}
            <IconButton onClick={handleBackLogin}>
              <Close sx={{ width: 20, height: 20 }} />
            </IconButton>
          </DialogTitle>

          {/* error present should be displayed */}
          {error && (
            <Box mb={1} display={"flex"} justifyContent={"center"}>
              <Typography variant="caption" color={"orangered"}>
                {error}
              </Typography>
            </Box>
          )}

          {/* divider */}
          <Divider component={"div"} />

          <Box
            maxHeight={isBusiness ? "48vh" : undefined}
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
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <>
                <DialogContentText
                  variant="body2"
                  gutterBottom
                  id="alert-dialog-slide-description"
                >
                  Please select or provide your country of residence from the
                  drop-down options below.
                </DialogContentText>

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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="country"
                      variant="standard"
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
                {isBusiness && (
                  <React.Fragment>
                    <DialogContentText variant="body2">
                      Are you authorised by the local or federal government to
                      run your business or organsation.
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="authorised"
                      variant="standard"
                      value={permitted}
                      fullWidth
                      onChange={(e) => setPermitted(e.target.value)}
                      label="authorised"
                    >
                      {BusinessData &&
                        BusinessData.permitted.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      Have you read Metatron terms of service to ensure your
                      activities are within the platform requirements
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="terms"
                      variant="standard"
                      value={terms}
                      fullWidth
                      onChange={(e) => setTerms(e.target.value)}
                      label="have read terms "
                    >
                      {BusinessData &&
                        BusinessData.terms.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      What's the appropriate designation from the choices below
                      would you regard for your business or organisation
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="designation"
                      variant="standard"
                      value={designation}
                      fullWidth
                      onChange={(e) => setDesignation(e.target.value)}
                      label="designation"
                    >
                      {BusinessData &&
                        BusinessData.designation.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      Whats the size of your business or organisation in terms
                      of outreach, premises and infrastructure
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="size_business"
                      variant="standard"
                      fullWidth
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      label="business size"
                    >
                      {BusinessData &&
                        BusinessData.size.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      What's the approximate range of employees working in your
                      business or organisation
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="employees"
                      variant="standard"
                      fullWidth
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      label="employees"
                    >
                      {BusinessData &&
                        BusinessData.employees.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      Whats the ownership or proprietorship of your business or
                      organisation in terms of individualism and
                      company/corporate
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="business_own"
                      variant="standard"
                      fullWidth
                      value={ownership}
                      onChange={(e) => setOwnership(e.target.value)}
                      label="business ownership"
                    >
                      {BusinessData &&
                        BusinessData.ownership.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>

                    <DialogContentText variant="body2">
                      Would you like to apply for IT related job opportunities
                      provided on the platform from a diverse pool of sources.
                    </DialogContentText>

                    <TextField
                      required
                      select
                      id="business_apply_jobs"
                      variant="standard"
                      fullWidth
                      value={apply}
                      onChange={(e) => setApply(e.target.value)}
                      label="apply jobs"
                    >
                      {BusinessData &&
                        BusinessData.jobs_apply.map((data) => (
                          <MenuItem key={data} value={data}>
                            <Typography variant="body2">{data}</Typography>
                          </MenuItem>
                        ))}
                    </TextField>
                  </React.Fragment>
                )}
              </>
            </DialogContent>
          </Box>
          <DialogActions>
            <Button onClick={handleSubmission} sx={{ borderRadius: "10px" }}>
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      {/* show terms of service if terms is show */}
      {openTerms && (
        <ModalPolicyTerms
          openModalTerms={openTerms}
          setOpenModalTerms={setOpenTerms}
        />
      )}
    </React.Fragment>
  );
}
