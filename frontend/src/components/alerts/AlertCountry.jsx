import { CheckCircle } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  Divider,
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
import React, { useState } from "react";
import AllCountries from "../data/AllCountries";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertCountry({
  openAlertCountry,
  setOpenAlertCountry,
  setCountry,
  country = "",
}) {
  //   control the country selection
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState(
    AllCountries.map((val) => {
      let country = `+${val.phone} ${val.label} (${val.code})`;
      return country;
    }).sort()
  );

  const handleAddNewCountry = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setCountry(inputValue);
      setInputValue("");
    }
  };
  // clear an institution
  const handleDeleteCountry = () => {
    setCountry(null);
  };

  const handleClose = () => {
    // close alert
    setOpenAlertCountry(false);
  };

  // handle submission
  const handleSubmission = () => {
    if (country) {
      // clear error message if any
      setError("");
      // close dialog
      handleClose();
    }
    setError("please select your country");
  };

  const handleFlagCountry = (option) => {
    let split_res = option.split(" ");
    return split_res[split_res.length - 1].substring(1, 3).toLowerCase();
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlertCountry}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Country?</DialogTitle>
        {/* divider */}
        <Divider component={"div"} />
        <DialogContent>
          <DialogContentText
            gutterBottom
            mb={2}
            id="alert-dialog-slide-description"
          >
            Please provide your country of residence. All across the globe are
            invited to join Metatron and foster embracement of technology
            globally.
            <br />
            {error && (
              <Typography variant="caption" color={"red"}>
                {error}
              </Typography>
            )}
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
                label="Select Country"
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
                {/* country nae */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmission}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
