import { SearchRounded } from "@mui/icons-material";
import { Autocomplete, Chip, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AllSkills from "../data/AllSkillsData";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertJobSearch({ openAlert, setOpenAlert, setValue }) {
  const [job_title, setJobTile] = useState([]);

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  //   reload window when user dismisses search
  const handleStayIndexTab = () => {
    // close alert
    setValue(0);
    setOpenAlert(false);
  };

  const handleChangeTitles = (_, newValue) => {
    if (newValue.length > 5) {
      return; // Limit to 5 selections
    }
    setJobTile(newValue);
  };

  const handleDeleteTitle = (skillToDelete) => {
    setJobTile((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,

          width:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97.5%"
              : undefined,
        }}
      >
        <DialogTitle display={"flex"} alignItems={"center"} gap={1}>
          {/* delete icon */}
          <SearchRounded />
          {/* title */}
          Job Search
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can search for up to five job titles. select the most
            appropriate choice from the drop down.
          </DialogContentText>
          <Autocomplete
            multiple
            options={AllSkills}
            value={job_title}
            onChange={handleChangeTitles}
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Title"
                fullWidth
                required
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((skill, index) => (
                <Chip
                  label={skill}
                  {...getTagProps({ index })}
                  onDelete={() => handleDeleteTitle(skill)}
                />
              ))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: "20px" }} onClick={handleStayIndexTab}>
            Dismiss
          </Button>
          <Button sx={{ borderRadius: "20px" }} onClick={handleClose}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
