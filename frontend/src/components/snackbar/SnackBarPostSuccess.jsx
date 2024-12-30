import { Alert, Box } from "@mui/material";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SnackBarPostSuccess({ messageSnackPostTech }) {
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    open: true,
    Transition: Fade,
  });

  const handleClick = (Transition) => () => {
    setState({
      open: messageSnackPostTech && true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
    // clear the snack bar messages in the redux
    dispatch(resetClearCurrentSnack());
  };

  //call the fun to activate the snack
  handleClick(SlideTransition);

  return (
    <Box>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: CustomDeviceTablet() && isTabSideBar ? "right" : "center",
        }}
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        key={state.Transition.name}
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          {messageSnackPostTech}
        </Alert>
      </Snackbar>
    </Box>
  );
}
