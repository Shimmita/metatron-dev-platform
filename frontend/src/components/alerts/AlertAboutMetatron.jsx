import { Avatar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import logoApp from "../../images/logo_sm.png";
import { showAboutMetatron } from "../../redux/AppUI";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertAboutMetatron({ openAboutMetatron }) {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(showAboutMetatron(false));
  };

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <React.Fragment>
      <Dialog
        open={openAboutMetatron}
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
        <DialogTitle
          display={"flex"}
          variant="body1"
          alignItems={"center"}
          gap={2}
        >
          <Avatar src={logoApp} alt="" />
          About Metatron Developer
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            Metatron Developer alias "Metatron Dev" is a socio-tech oriented
            platform aimed to bring the diverse ecosystem of technological
            specialities into one common place for interaction. The platform
            facilitates : <br />
            <ul style={{ paddingTop: 10 }}>
              <Typography gutterBottom component={"li"} color={"text.secondary"}>
                Exploration and application of jobs in tech industry ranging
                from remote, onsite to hybrid globally.
              </Typography>
              <Typography gutterBottom component={"li"} color={"text.secondary"}>
                Interaction with a diverse community of personnels,
                organisations or companies in tech globally.
              </Typography>

              <Typography gutterBottom component={"li"} color={"text.secondary"}>
                Sharing and spreading of tech ideologies or projects through
                posts aimed to reach target groups.
              </Typography>

              <Typography component={"li"} color={"text.secondary"}>
                Accessibility to vital tech learning resources such best courses from
                experts aimed to expound your skills.
              </Typography>

           
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>{" "}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
