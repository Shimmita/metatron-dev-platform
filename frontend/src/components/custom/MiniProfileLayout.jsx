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
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateNotificationSnackBar } from "../../redux/CurrentSnackBar";
import { getImageMatch } from "../utilities/getImageMatch";

export default function MiniProfileLayout({
  handleShowMiniProfile,
  userId,
  showMessageInput,
  setShowMessageInput,
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [miniProfileData, setMiniProfileData] = useState();
  const [errorPresent, setErrorPresent] = useState(false);
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
        setErrorPresent(true);
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          dispatch(updateNotificationSnackBar("Network Error"));
          return;
        }
        // update the snackbar notification of error from the server
        dispatch(updateNotificationSnackBar(err?.response.data));
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
  return (
    <React.Fragment>
      {/* error present display this */}
      {errorPresent && (
        <React.Fragment>
          <Collapse in={errorPresent || false}>
            <Alert
              severity="warning"
              onClick={() => {
                setErrorPresent(false);
                // closes the whole layout based on the state present
                handleShowMiniProfile();
              }}
              action={
                <IconButton aria-label="close" color="inherit" size="small">
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              problem encountered please try again!
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

      {/* show details if present after success backend results */}
      {miniProfileData && (
        <Box mb={1}>
          {/* close button */}
          <Box>
            <IconButton onClick={handleShowMiniProfile}>
              <Close sx={{ width: 15, height: 15 }} color="primary" />
            </IconButton>
          </Box>
          <Box display={"flex"} justifyContent={"center"}>
            <Stack gap={1}>
              {/* avatar */}
              <Box display={"flex"} justifyContent={"center"}>
                <Avatar src="" alt="" />
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
                  {miniProfileData?.network_count}
                  <Diversity3Rounded sx={{ width: 20, height: 20 }} />
                </Typography>
              </Box>

              {/* contact buttons */}
              <Box display={"flex"} justifyContent={"center"} gap={2}>
                {/* button view profile */}
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                >
                  Profile
                </Button>

                {/* button send message */}
                <Button
                  variant="contained"
                  disableElevation
                  disabled={showMessageInput}
                  onClick={() => setShowMessageInput(true)}
                  size="small"
                  sx={{ textTransform: "capitalize", borderRadius: "20px" }}
                >
                  Message
                </Button>
                {/* add friends */}
                <Button
                  variant="contained"
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
                    <Tooltip title={skill} arrow>
                      <Avatar
                        key={index}
                        alt={skill}
                        className="border"
                        sx={{ width: 34, height: 34 }}
                        src={getImageMatch(skill)}
                      />
                    </Tooltip>
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
      )}
    </React.Fragment>
  );
}
