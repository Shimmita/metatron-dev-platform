import {
  Diversity3Rounded,
  GradeRounded,
  LaptopRounded,
  LocationOnRounded,
  Message,
  PersonAdd,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import devImage from "../../images/dev.jpeg";
import { resetDefaultBottomNav } from "../../redux/AppUI";
import PostDetailsContainer from "../post/PostDetailsContiner";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../utilities/getImageMatch";
const UserPost = lazy(() => import("./UserPostContainer"));
const UserAbout = lazy(() => import("./UserAbout"));
const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 20,
    width: "100%",
    backgroundColor: "transparent",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.caption,
    fontSize: theme.typography.pxToRem(13),
    padding: theme.typography.pxToRem(2),

    color: "gray",
    "&.Mui-selected": {
      color: "primary",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function UserProfile() {
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState();
  const [erroMessage, setErrorMesssage] = useState("");
  // for full post details rendering
  const [postDetailedData, setPostDetailedData] = useState();
  // controls the tab to be displayed
  const [profileSection, setProfileSection] = React.useState(0);
  // extracting the id from request prams
  const { id: userId } = useParams();

  const handleChange = (event, newValue) => {
    setProfileSection(newValue);
  };

  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetDefaultBottomNav(true));
  });

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
          setProfileData(res.data);
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

  return (
    <Box
      height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}
      color={"text.primary"}
    >
      <Box
        height={"80vh"}
        className={!CustomDeviceIsSmall() && "shadow rounded p-2"}
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {/* displayed for full post details when data is present */}
        {postDetailedData ? (
          <Box>
            <PostDetailsContainer
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
            />
          </Box>
        ) : (
          <React.Fragment>
            {/* shown when fetching is on progress */}
            {isFetching && (
              <Box width={"100%"}>
                <Box display={"flex"} justifyContent={"center"} mb={1}>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={60}
                    height={60}
                  />
                </Box>

                <Box>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={"70vh"}
                  />
                </Box>
              </Box>
            )}
            {/* shown when there is an error */}
            {erroMessage && (
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"100%"}
                flexDirection={"column"}
                height={"50vh"}
              >
                <Box display={"flex"} justifyContent={"center"}>
                  <Typography variant="body2" color={"text.secondary"}>
                    {erroMessage}
                  </Typography>
                </Box>
              </Box>
            )}
            {/* shown when there is profile info */}
            {profileData && (
              <Box>
                <Box>
                  <Box display={"flex"} mt={1} justifyContent={"center"}>
                    <Avatar
                      src={devImage}
                      alt="user-image"
                      sx={{ width: 80, height: 80 }}
                    />
                  </Box>
                  {/* name of the user */}
                  <Box display={"flex"} justifyContent={"center"} mb={1}>
                    <Typography
                      fontWeight={"bold"}
                      mt={1}
                      variant="body1"
                      textTransform={"uppercase"}
                    >
                      {profileData?.name}
                    </Typography>
                  </Box>
                  {/* specialisation */}
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    mb={1}
                    gap={1}
                    alignItems={"center"}
                  >
                    <LaptopRounded sx={{ width: 17, height: 17 }} />
                    <Typography color={"text.secondary"} variant="body2">
                      {profileData?.specialisationTitle}
                    </Typography>
                  </Box>
                  {/* location of the user */}
                  <Box>
                    <Typography
                      color={"text.secondary"}
                      variant="body2"
                      display={"flex"}
                      gap={1}
                      alignItems={"center"}
                      justifyContent={"center"}
                      mb={2}
                    >
                      <LocationOnRounded sx={{ width: 15, height: 15 }} />
                      {/* call this if only miniprofile data present */}
                      {profileData &&
                        handleCountryName(profileData?.country)} |{" "}
                      {profileData?.county} | 12,000
                      <Diversity3Rounded sx={{ width: 17, height: 17 }} />
                    </Typography>
                  </Box>
                  <Divider component={"div"} />

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    mb={1}
                    mt={1}
                    gap={1}
                    alignItems={"center"}
                  >
                    <GradeRounded
                      sx={{ width: 20, height: 20 }}
                      color="warning"
                    />
                    {/* skills avatars */}
                    <Box display={"flex"} justifyContent={"center"}>
                      <AvatarGroup max={profileData?.selectedSkills?.length}>
                        {/* loop through the skills and their images matched using custim fn */}
                        {profileData?.selectedSkills?.map((skill, index) => (
                          <Avatar
                            key={index}
                            alt={skill}
                            src={getImageMatch(skill)}
                            sx={{ width: 34, height: 34 }}
                            className="border"
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Box>
                  <Divider component={"div"} />
                  <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    m={2}
                  >
                    <Button
                      variant="contained"
                      disableElevation
                      startIcon={<PersonAdd />}
                      sx={{ borderRadius: 5, fontWeight: "bold" }}
                    >
                      <Typography variant="body2">
                        <small
                          style={{
                            fontSize: "small",
                            textTransform: "capitalize",
                          }}
                        >
                          Follow
                        </small>
                      </Typography>
                    </Button>

                    <Button
                      variant="contained"
                      disableElevation
                      startIcon={<Message />}
                      sx={{ borderRadius: 5, fontWeight: "bold" }}
                    >
                      <Typography variant="body2">
                        <small
                          style={{
                            fontSize: "small",
                            textTransform: "capitalize",
                          }}
                        >
                          Message
                        </small>
                      </Typography>
                    </Button>
                  </Box>
                </Box>

                <Divider component={"div"} />

                <Box className="mt-2 d-flex justify-content-center align-items-center">
                  <StyledTabs
                    value={profileSection}
                    onChange={handleChange}
                    aria-label="styled tabs"
                  >
                    {/* posts made by the user */}
                    <StyledTab
                      className="pe-5"
                      label={
                        <Typography className=" fw-bold" variant="body2">
                          Post
                        </Typography>
                      }
                    />

                    {/* user's connections of people */}
                    <StyledTab
                      className="pe-3 ps-3"
                      label={
                        <Typography className="fw-bold" variant="body2">
                          Network
                        </Typography>
                      }
                    />

                    {/* info more about the user */}
                    <StyledTab
                      label={
                        <Typography className="ps-5 fw-bold" variant="body2">
                          About
                        </Typography>
                      }
                    />
                  </StyledTabs>
                </Box>

                {/* content of each tab goes here */}
                <Box>
                  <Suspense fallback={<div>loading...</div>}>
                    {/* posts made by the user */}
                    {profileSection === 0 && (
                      <UserPost
                        userId={userId}
                        setPostDetailedData={setPostDetailedData}
                      />
                    )}
                    {/* user network of people */}
                    {/* about view */}
                    {profileSection === 2 && (
                      <UserAbout profileData={profileData} />
                    )}
                  </Suspense>
                </Box>
              </Box>
            )}
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
}
