import {
  CheckCircle,
  Close,
  PublicRounded
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography
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
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertCountry({
  openAlertCountry,
  setOpenAlertCountry,
  setCountry,
  country = "",
  terms = "",
 
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

   // redux state
    const { currentMode } = useSelector((state) => state.appUI);
      const isDarkMode=currentMode==='dark'

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
    
  };

  const handleFlagCountry = (option) => {
    let split_res = option?.split(" ");
    return split_res[split_res?.length - 1].substring(1, 3).toLowerCase();
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
        max
        aria-describedby="alert-dialog-slide-description"
        sx={{ display: "flex", justifyContent: "center",backdropFilter:'blur(3px)', }}
      >
        <Box width={"100%"}>
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              background: !isDarkMode && 
              "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
          >
            {/* logo+ title  */}
            <Box display={"flex"} gap={2} alignItems={"center"}>
              
                  <PublicRounded
                    sx={{ width: 32, height: 32 }}
                    color="primary"
                  />
                  <Typography variant="body1">Country Selection</Typography>
              
            </Box>
            {/* close button */}
            <Tooltip title='close' arrow>
            <IconButton 
             sx={{ 
                  border:'1px solid',
                  borderColor:'divider'
                }}
            onClick={handleBackLogin}>
              <Close sx={{ width: 14, height: 14 }} />
            </IconButton>
            </Tooltip>
          </DialogTitle>

          {/* error present should be displayed */}
          {error && (
            <Box mb={1} display={"flex"} justifyContent={"center"}>
              <Typography variant="caption" color={"orange"}>
                {error}
              </Typography>
            </Box>
          )}

          {/* divider */}
          <Divider component={"div"} />

          <Box
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
                  Please select your country of residence from the
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
                      label="Country"
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
