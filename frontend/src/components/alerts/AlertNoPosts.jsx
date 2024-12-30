import { HomeRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { showPostModalRedux } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertNoPosts({
  openAlert,
  setOpenAlert,
  errorMessage = "",
  handleClearing,
}) {
  const handleClose = () => {
    handleClearing();
    // close alert
    setOpenAlert(false);
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // return home function
  const backHomePage = () => {
    // update the redux bottom nav position to 0 for home
    dispatch(updateCurrentBottomNav(0));
    //  clear
    handleClose();
    // navigate home
    navigate("/");
  };

  // const logout and login later
  const handleLaterNoPost = async () => {
    try {
      // send a post request to the backend to clear all cookie sessions if any
      await axios.post(`http://localhost:5000/metatron/api/v1/signout`);

      // clear any firebase authentication details
      const auth = getAuth();
      const firebaseUser = auth?.currentUser;
      if (firebaseUser) {
        await signOut(auth);
      }

      // Clear persisted storage and redux
      await persistor.purge();

      // Dispatch Redux action to reset user state
      dispatch(resetClearCurrentUserRedux());

      // reload the window for effects to complete
      window.location.reload();
    } catch (error) {
      // Clear persisted storage and redux for partial logout
      await persistor.purge();

      // reload the window for effects to complete
      window.location.reload();
      console.error("Error during logout:", error);
    }
  };

  // const contains job means alert contains job post empty
  const isNoJob = errorMessage.includes("no jobs");
  // is no posts avaibale
  const isNoPost = errorMessage.includes("no posts");

  // const handle showing of the post modal
  const handleShowPostModal = () => {
    dispatch(showPostModalRedux());
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
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
          gap={1}
        >
          <Avatar alt="" src={logo} sx={{ width: 32, height: 32 }} />
          {isNoJob && "Jobs"}
          {isNoPost && "Posts"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isNoJob && (
            <React.Fragment>
              <Button
                sx={{ borderRadius: "20px" }}
                size="small"
                startIcon={<HomeRounded />}
                onClick={backHomePage}
              >
                home
              </Button>
            </React.Fragment>
          )}

          {isNoPost && (
            <React.Fragment>
              <Button
                sx={{ borderRadius: "20px" }}
                size="small"
                onClick={handleShowPostModal}
              >
                post
              </Button>

              <Button
                sx={{ borderRadius: "20px" }}
                size="small"
                onClick={handleLaterNoPost}
              >
                later
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
