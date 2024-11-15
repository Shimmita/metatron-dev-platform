import { Close, CloudUploadRounded, LinkRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import DummyJobData from "../data/DummyJobData";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

// styled modal
const StyledModalJob = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

// styled input
const StyledInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ApplyJobModal = ({ openApplyJobModal, setOpenApplyJobModal }) => {
  // redux states
  const { isDarkMode, isTabSideBar } = useSelector((state) => state.appUI);
  const [cvUpload, setCvUpload] = useState(null);
  const [cvLink, setCvLink] = useState("");
  const [isCvUpload, setIsCvUpload] = useState(false);

  const [coverLetterUpload, setCoverLetterUpload] = useState(null);
  const [coverLetterLink, setCoverLetterLink] = useState("");
  const [isCoverLetterUpload, setIsCoverLetterUpload] = useState(false);

  //   handle cv link from cloud sources
  const handleCvLink = () => {
    // clear local uploaded files if any
    setCvUpload(null);

    setIsCvUpload(true);
  };

  const handleCloseCvLink = () => {
    // clear
    setCvLink("");
    // default showing of btn upload and link for cv full
    setIsCvUpload(false);
  };

  // handle cover letter link cloud sources
  const handleCoverLetterLink = () => {
    // clear local uploaded files if any
    setCoverLetterUpload(null);

    setIsCoverLetterUpload(true);
  };

  // close cover letter link
  const handleCloseCoverLetterLink = () => {
    // clear
    setCvLink("");
    // default showing of btn upload and link for cv full
    setIsCvUpload(false);
  };

  return (
    <StyledModalJob
      keepMounted
      open={openApplyJobModal}
      sx={{
        marginLeft: CustomDeviceTablet() && isTabSideBar ? "34%" : undefined,
      }}
      // onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={
          CustomLandScape() || (CustomDeviceTablet() && !isTabSideBar)
            ? "90%"
            : CustomDeviceTablet()
            ? "100%"
            : CustomLandscapeWidest()
            ? "50%"
            : "100%"
        }
        p={1}
        borderRadius={5}
        bgcolor={isDarkMode ? "background.default" : "#D9D8E7"}
        color={"text.primary"}
        sx={{
          border: isDarkMode && "1px solid gray",
          marginRight: CustomDeviceTablet() && isTabSideBar ? 2 : undefined,
        }}
      >
        <Box
          bgcolor={"background.default"}
          borderRadius={5}
          className="shadow-lg"
        >
          {/* toolbar like box */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box>
              <Avatar sx={{ width: 60, height: 60 }} src={AppLogo} alt="logo" />
            </Box>

            {/*  title job application form */}
            <Typography variant="body1" gutterBottom fontWeight={"bold"}>
              Machine Learning Engineer
            </Typography>

            {/*close icon */}
            <IconButton onClick={(e) => setOpenApplyJobModal(false)}>
              <Tooltip title={"close"}>
                <Close />
              </Tooltip>
            </IconButton>
          </Box>

          {/* org name */}
          <Stack justifyContent={"center"} alignItems={"center"}>
            <Typography
              variant="body2"
              gutterBottom
              color={"text.secondary"}
              fontWeight={"bold"}
            >
              Amazon Web Services (AWS)
            </Typography>
          </Stack>

          <Box
            maxHeight={CustomModalHeight()}
            className={"px-3"}
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
            <Stack gap={3}>
              {/* about org */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  About Us
                </Typography>
                {/* about text */}
                <Typography p={1} variant="body2" color={"text.secondary"}>
                  We are among the largest and leading cloud providers in
                  the world. We focus on providing better solutions for storing
                  data in the cloud to facilitate easier storing and retrieval
                  of data.
                </Typography>
              </Stack>

              {/* qualifications */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Qualification
                </Typography>
                {/* Qualification data */}
                <ol>
                  {DummyJobData.qualifications.map((data) => (
                    <Typography
                      component={"li"}
                      variant="body2"
                      key={data}
                      gutterBottom
                      p={1}
                      color={"text.secondary"}
                    >
                      {data}
                    </Typography>
                  ))}
                </ol>
              </Stack>

              {/* Mandatory Skills */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Job Description
                </Typography>
                {/* Qualification data */}
                <ol>
                  {DummyJobData.description.map((data) => (
                    <Typography
                      component={"li"}
                      variant="body2"
                      key={data}
                      gutterBottom
                      p={1}
                      color={"text.secondary"}
                    >
                      {data}
                    </Typography>
                  ))}
                </ol>
              </Stack>

              {/* application section */}
              <Stack gap={1}>
                <Typography
                  variant="body2"
                  p={1}
                  fontWeight={"bold"}
                  color={"text.secondary"}
                >
                  {" "}
                  Application Section
                </Typography>
                {/* cv upload */}
                <Box mb={3}>
                  <Typography
                    component={"li"}
                    variant="body2"
                    p={1}
                    color={"text.secondary"}
                  >
                    {" "}
                    Upload your Curriculum Vitae (CV) in PDF format. You are
                    also allowed to provide a link to your CV stored in the
                    Cloud Storage Sources such as OneDrive, MegaDrive or Google
                    Drive.
                  </Typography>

                  {cvUpload && (
                    <Typography
                      gutterBottom
                      textAlign={"center"}
                      variant="body2"
                      width={"100%"}
                      color={"text.secondary"}
                    >
                      {`${cvUpload.name}`.substring(0, 30)}...
                      {`${cvUpload.name}.`.split(".")[1]}
                    </Typography>
                  )}

                  {!isCvUpload ? (
                    <Box
                      display={"flex"}
                      justifyContent={"space-around"}
                      alignItems={"center"}
                      gap={1}
                      mt={3}
                    >
                      <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        disableElevation
                        tabIndex={-1}
                        size="medium"
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                        }}
                        startIcon={<CloudUploadRounded />}
                      >
                        {CustomDeviceIsSmall()
                          ? "Upload CV"
                          : "Upload CV from Files"}
                        <StyledInput
                          type="file"
                          accept="application/pdf"
                          onChange={(event) =>
                            setCvUpload(event.target.files[0])
                          }
                          multiple
                        />
                      </Button>
                      <Typography variant="body2" color={"text.secondary"}>
                        or
                      </Typography>

                      <Button
                        variant="outlined"
                        disableElevation
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                        }}
                        onClick={handleCvLink}
                        size="medium"
                        startIcon={<LinkRounded />}
                      >
                        {CustomDeviceIsSmall()
                          ? "CV Link"
                          : "CV Cloud Storage Link"}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box
                        className="w-100"
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        mt={3}
                      >
                        <TextField
                          required
                          type="url"
                          value={cvLink}
                          label={`CV cloud storage link`}
                          placeholder="https://...."
                          fullWidth
                          onChange={(e) => setCvLink(e.target.value)}
                        />
                        {/* close button */}
                        <IconButton onClick={handleCloseCvLink}>
                          <Tooltip title={"exit link"}>
                            <Close />
                          </Tooltip>
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>

                {/* cover letter upload */}
                <Box mb={3}>
                  <Typography
                    component={"li"}
                    variant="body2"
                    p={1}
                    color={"text.secondary"}
                  >
                    {" "}
                    Upload your Cover Letter in PDF format. You are also allowed
                    to provide a link to your Cover Letter stored in the Cloud
                    Storage Sources such as OneDrive, MegaDrive or Google Drive.
                  </Typography>

                  {coverLetterUpload && (
                    <Typography
                      gutterBottom
                      textAlign={"center"}
                      variant="body2"
                      width={"100%"}
                      color={"text.secondary"}
                    >
                      {`${cvUpload.name}`.substring(0, 30)}...
                      {`${cvUpload.name}.`.split(".")[1]}
                    </Typography>
                  )}

                  {!isCoverLetterUpload ? (
                    <Box
                      display={"flex"}
                      justifyContent={"space-around"}
                      alignItems={"center"}
                      gap={1}
                      mt={3}
                    >
                      <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        disableElevation
                        tabIndex={-1}
                        size="medium"
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                        }}
                        startIcon={<CloudUploadRounded />}
                      >
                        {CustomDeviceIsSmall()
                          ? "Cover Letter"
                          : "Upload Cover Letter "}
                        <StyledInput
                          type="file"
                          accept="application/pdf"
                          onChange={(event) =>
                            setCoverLetterUpload(event.target.files[0])
                          }
                          multiple
                        />
                      </Button>
                      <Typography variant="body2" color={"text.secondary"}>
                        or
                      </Typography>
                      <Button
                        variant="outlined"
                        disableElevation
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                        }}
                        onClick={handleCoverLetterLink}
                        size="medium"
                        startIcon={<LinkRounded />}
                      >
                        {CustomDeviceIsSmall()
                          ? "Letter Link"
                          : "Cover Letter Cloud Link"}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box
                        className="w-100"
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        mt={3}
                      >
                        <TextField
                          required
                          type="url"
                          value={coverLetterLink}
                          label={`Cover Letter cloud link`}
                          placeholder="https://...."
                          fullWidth
                          onChange={(e) => setCoverLetterLink(e.target.value)}
                        />
                        {/* close button */}
                        <IconButton onClick={handleCloseCoverLetterLink}>
                          <Tooltip title={"exit link"}>
                            <Close />
                          </Tooltip>
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </StyledModalJob>
  );
};

export default ApplyJobModal;
