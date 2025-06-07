import { CoffeeRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showSponsorAlert } from "../../redux/AppUI";
import SponsorshipLayout from "../custom/SponsorshipLayout";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertSponsorship({
  openSponsorAlert,
  isLaunchPage = false,
  setOpenSponsorAlert,
}) {
  const [isSponsorTeam, setIsSponsorTeam] = useState(false);
  const [isGitTeam, setIsGitTeam] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (isLaunchPage) {
      dispatch(showSponsorAlert(false));
    } else {
      setOpenSponsorAlert(false);
    }
  };

  //handle showing of the sponsors
  const handleShowSponsorsGitTeam = () => {
    // close sponsor team showing
    setIsSponsorTeam(false);
    // close gitHub team showing
    setIsGitTeam(false);
  };

  return (
      <Dialog
        open={openSponsorAlert}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          marginLeft: CustomDeviceTablet() && isLaunchPage ? "32%" : undefined,
        }}
        aria-describedby="alert-dialog-slide-description-support-sponsorship"
      >
        <DialogTitle display={"flex"} justifyContent={"center"} variant="body1">
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <CoffeeRounded />
            {"Sponsor Us"}
          </Box>
        </DialogTitle>
       
        <DialogContent dividers>
          {/* render sponsorship layout */}
          <SponsorshipLayout
            isSponsorTeam={isSponsorTeam}
            setIsSponsorTeam={setIsSponsorTeam}
            isGitTeam={isGitTeam}
            setIsGitTeam={setIsGitTeam}
          />
        </DialogContent>
        <DialogActions>
          {isSponsorTeam || isGitTeam ? (
            <Button onClick={handleShowSponsorsGitTeam}>back</Button>
          ) : (
            <Button onClick={handleClose}>close</Button>
          )}
        </DialogActions>
      </Dialog>
  );
}
