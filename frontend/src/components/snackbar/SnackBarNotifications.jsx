import { Alert, Box } from "@mui/material";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useDispatch } from "react-redux";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SnackBarNotifications({ message, isWarning = false }) {
  // redux states
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    open: message ? true : false,
    Transition: Fade,
  });

  const handleOpenSnackbar = (Transition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });

    // reset the redux state for snackbar which will reset snack info
    dispatch(resetClearCurrentSnack());
  };

  //   call the open fun
  handleOpenSnackbar(SlideTransition());

  return (
    <Box>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        key={state.Transition.name}
      >
        <Alert
          onClose={handleClose}
          className="rounded"
          severity={isWarning ? "warning" : "info"}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
