import { Close, Diversity3Rounded } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertMiniProfileView({
  openAlert,
  setOpenAlert,
  userId,
}) {
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);
  const [isFetching, setIsFetching] = useState(true);
  const [miniProfileData, setMiniProfileData] = useState();
  const [erroMessage, setErrorMesssage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // fetch details of the liked or reacted user based on their id
    axios
      .get(`http://localhost:5000/metatron/api/v1/users/all/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setMiniProfileData(res.data);
        }
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setErrorMesssage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setErrorMesssage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [userId, dispatch]);

  // handle country length to only two names
  const handleCountryName = (country) => {
    const parent = country?.split(" ");
    const parentName =
      parent?.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // navigate to full proile using the current userId
  const handleViewFullProfile = () => {
    navigate("users/profile/" + userId);
    // close the alert
    handleClose();
  };
  return (
    <React.Fragment>
      <Dialog
        className="shadow"
        open={openAlert}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,

          minWidth:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97.5%"
              : undefined,
        }}
      >
        <DialogContent dividers>
          {/* error present display this */}
          {erroMessage && (
            <React.Fragment>
              <Collapse in={erroMessage || false}>
                <Alert
                  severity="warning"
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {erroMessage}
                </Alert>
              </Collapse>

              {/* divider */}
              <Divider component={"div"} className="p-2" />
            </React.Fragment>
          )}

          {/* show skeleton when loading else results */}
          {isFetching && (
            <Box display={"flex"} justifyContent={"center"} p={1}>
              <Skeleton
                sx={{ bgcolor: "grey.500" }}
                variant="rectangular"
                className="rounded"
                width={"70%"}
                height={"15vh"}
              />
            </Box>
          )}
          {/* render miniprofile layout */}
          <Box mb={1}>
            <Box display={"flex"} justifyContent={"center"}>
              <Stack gap={1}>
                {/* avatar */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Avatar src="" alt="">
                    <Typography
                      variant="body2"
                      textTransform={"uppercase"}
                      fontWeight={"bold"}
                    >
                      {miniProfileData?.name[0]}
                    </Typography>
                  </Avatar>
                </Box>
                {/* name of the user */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography
                    variant="body2"
                    textTransform={"uppercase"}
                    fontWeight={"bold"}
                  >
                    {miniProfileData?.name}
                  </Typography>
                </Box>
                {/* specialisation */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.specialisationTitle}
                  </Typography>
                </Box>
                {/* country and location */}
                <Box display={"flex"} justifyContent={"center"} gap={1}>
                  {/* country */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {/* call this if only miniprofile data present */}
                    {miniProfileData &&
                      handleCountryName(miniProfileData?.country)}
                  </Typography>
                  |{/* state or county */}
                  <Typography variant="body2" color={"text.secondary"}>
                    {miniProfileData?.county}
                  </Typography>
                  |
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    12,000
                    <Diversity3Rounded sx={{ width: 20, height: 20 }} />
                  </Typography>
                </Box>

                {/* contact buttons */}
                <Box display={"flex"} justifyContent={"center"} gap={2}>
                  {/* button view profile */}
                  <Button
                    variant="outlined"
                    disableElevation
                    onClick={handleViewFullProfile}
                    size="small"
                    sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                  >
                    Profile
                  </Button>

                  {/* button send message */}
                  <Button
                    variant="outlined"
                    disableElevation
                    size="small"
                    sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                  >
                    Message
                  </Button>
                  {/* add friends */}
                  <Button
                    variant="outlined"
                    disableElevation
                    size="small"
                    sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                  >
                    Follow
                  </Button>
                </Box>

                {/* divider */}
                <Divider className="p-1" component={"div"} />
                {/* skills avatars */}
                <Box display={"flex"} justifyContent={"center"}>
                  <AvatarGroup max={miniProfileData?.selectedSkills?.length}>
                    {/* loop through the skills and their images matched using custim fn */}
                    {miniProfileData?.selectedSkills?.map((skill, index) => (
                      <Avatar
                        key={index}
                        alt={skill}
                        src={getImageMatch(skill)}
                        sx={{ width: 35, height: 35 }}
                        className="border"
                      />
                    ))}
                  </AvatarGroup>
                </Box>

                {/* divider */}
                <Divider className="p-1" component={"div"} />

                {/* caption joined date */}
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="caption" color={"text.secondary"}>
                    Joined:{miniProfileData?.createdAt?.split("T")[0]}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
