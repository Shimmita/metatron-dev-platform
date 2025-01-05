import { BoltRounded, CoffeeRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import SponsorshipLayout from "../custom/SponsorshipLayout";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertSponsorship({
  openSponsorAlert,
  setOpenSponsorAlert,
}) {
  const [isSponsorTeam, setIsSponsorTeam] = useState(false);

  // configuring axios defaults
  axios.defaults.withCredentials = true;

  const handleClose = () => {
    setOpenSponsorAlert(false);
  };

  //handle showing of the sponsors
  const handleShowSponsors = () => {
    setIsSponsorTeam(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openSponsorAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description-support"
      >
        <DialogTitle display={"flex"} justifyContent={"center"} variant="body1">
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <CoffeeRounded />
            {"Sponsor Us"}
          </Box>
        </DialogTitle>
        {/* metatron slogan */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
        >
          <BoltRounded sx={{ width: 15, height: 15 }} />
          <Typography
            variant="caption"
            color={"text.secondary"}
            fontWeight={"bold"}
          >
            Enlightening Technology
          </Typography>
        </Box>
        <DialogContent dividers>
          {/* render sponsorship layout */}
          <SponsorshipLayout
            isSponsorTeam={isSponsorTeam}
            setIsSponsorTeam={setIsSponsorTeam}
          />
        </DialogContent>
        <DialogActions>
          {isSponsorTeam ? (
            <Button onClick={handleShowSponsors}>back</Button>
          ) : (
            <Button onClick={handleClose}>close</Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
