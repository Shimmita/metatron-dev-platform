import {
  Close,
  DocumentScannerRounded,
  PhishingRounded,
  PlagiarismRounded,
  PsychologyAltRounded,
  WarningRounded
} from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Stack,
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
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const reporting_about_array = [
  "Irrelevant tech content",
  "Plagiarized tech content",
  "Phishing and fraudulent",
].sort();

export default function AlertReportPost({
  openAlertReport,
  setOpenAlertReport,
  post,
  currentUser,
}) {
  const [reportAbout, setReportAbout] = useState("");
  const [description, setDescription] = useState("");

  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");

  const descriptionMax = 100;

  const handleClose = () => {
    if (isFetching || message) {
      return;
    }
    // close alert
    setOpenAlertReport(false);
  };

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    if (isFetching || message) {
      return;
    }

    handleClose();
  };
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // axios default credentials
  axios.defaults.withCredentials = true;

  const reportObject = {
    postId: post?._id,
    postOwnerId: post?.post_owner?.ownerId,
    post_title: post?.post_title,
    reporterId: currentUser?._id,
    reporter_name: currentUser?.name,
    reporter_speciality: currentUser?.specialisationTitle,
    reporter_avatar: currentUser?.avatar,
    report_title: reportAbout,
    report_message: description,
  };

  //   handle submission of report
  const handleSubmitReport = (event) => {
    // prevent default form submission
    event.preventDefault();

    // set is fetching to true
    setIsFetching(true);

    // performing delete request and passing id of the currently user and that of miniprofile user being
    // viewed
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/report/create`,
        reportObject
      )
      .then((res) => {
        // update the message state
        if (res?.data && res.data) {
          // update the message
          setMessage(res.data);

          // clear the report about
          setReportAbout("");
          // clear the description
          setDescription("");
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessage("server is unreachable check your internet");
          return;
        }
        // error message
        setMessage(err?.response?.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle clearing of the message
  const handleClearMessage = () => {
    setMessage("");
  };

  const handleReportPostWidth=()=>{
    if (CustomDeviceTablet() && isTabSideBar) {
      return "36%"
    } else if(CustomLandScape()){
      return "-8%"
    } else if(CustomLandscapeWidest()){
      return "-5%"
    }
  }

  return (
      <Dialog
        open={openAlertReport}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter:'blur(3px)',
          marginLeft:handleReportPostWidth()
        }}
      >
        <Stack mb={1}>
          <DialogTitle
            variant="body2"
            fontWeight={"bold"}
            gutterBottom
            display={"flex"}
            gap={1}
            alignItems={"center"}
          >
            <WarningRounded />
            Post Reporting Center
          </DialogTitle>

          {/* post title */}
          <Box display={"flex"} justifyContent={"center"}>
            <Typography variant="body2" fontWeight={'bold'}>{post?.post_title}</Typography>
          </Box>
        </Stack>
        <form onSubmit={handleSubmitReport}>
          <DialogContent dividers>
            {/* show message if present */}
            {message && (
                <Collapse in={message || false}>
                  <Alert
                    severity="info"
                    onClose={handleClose}
                    className="rounded"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClearMessage}
                      >
                        <Close fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {message}
                  </Alert>
                </Collapse>
            )}

            <Box mb={1} mt={message && 1}>
              <DialogContentText>
                Metatron has provided default issues facing digital content
                select the most appropriate.
              </DialogContentText>
            </Box>
            <Stack gap={3}>
              {/* report option */}
              <TextField
                required
                select
                value={reportAbout}
                margin="dense"
                onChange={(e) => setReportAbout(e.target.value)}
                id="custom_area-of-report"
                label={"reporting on"}
                fullWidth
                disabled={isFetching || message}
                variant="outlined"
              >
                {
                  reporting_about_array?.map((about) => (
                    <MenuItem
                      key={about}
                      value={about}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      {about.includes("other") ? (
                        <PsychologyAltRounded
                          color="primary"
                          sx={{ width: 26, height: 26 }}
                        />
                      ) : about.includes("Phishing") ? (
                        <PhishingRounded color="info" />
                      ) : about.includes("Plagiarized") ? (
                        <PlagiarismRounded color="secondary" />
                      ) : (
                        <DocumentScannerRounded color="warning" />
                      )}{" "}
                      {about}
                    </MenuItem>
                  ))}
              </TextField>

              {/*description why the reporting */}

              <TextField
                placeholder="write description here ..."
                label={`description ${descriptionMax - description.length}`}
                value={description}
                multiline
                required
                disabled={isFetching || message}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            {/* show circular progress when is loading */}
            {isFetching && <CircularProgress size={20} className="me-2" />}

            <Button onClick={handleDismiss} disabled={isFetching || message}>
              Close
            </Button>

            <Button
              type="submit"
              disabled={
                description?.length > descriptionMax || isFetching || message
              }
            >
              Submit
            </Button>
           
          </DialogActions>
        </form>
      </Dialog>
  );
}
