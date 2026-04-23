import { useTheme } from "@emotion/react";
import { Close } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, FormHelperText, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentGroupCommunities } from "../../redux/CurrentGroups";
import { updateCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import GroupCommunityDetails from "../group/GroupCommunityDetails";
import GroupCommunityMobile from "../group/GroupCommunityMobile";
import GroupCommunityTab from "../group/GroupCommunityTab";
import { getImageMatch } from "../utilities/getImageMatch";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertGroupCommunity({
  openGroup,
  setOpenGroup,
  isDarkMode = false,
  search = []

}) {

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedGroup, setFocusedGroup] = useState(null)


  // handle screen responsiveness
  const theme = useTheme();

  // smart and below
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // tabs and below
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch()

  // redux state
  const { user, isGuest } = useSelector((state) => state.currentUser);

  // prevent showing group modal when is success alert
  const { isActive: isActiveSuccess } = useSelector((state) => state.currentSuccess);

  let { groups: groupData } = useSelector((state) => state.currentGroups);

  let tempGroupSearch = []

  // the request is from search
  if (search.length) {
    for (const element1 of groupData) {
      for (const element2 of search) {
        if (element2.name.includes(element1.name)) {
          tempGroupSearch.push(element1)
        }
      }
    }

    // update redux groups data with search matching results
    groupData = [...tempGroupSearch]
  }

  const handleClose = () => {
    setOpenGroup(false);
    setFocusedGroup(null)
  };


  // handle joining community
  const handleJoinCommunity = (group) => {
    const dataObject = {
      userId: user?._id,
      groupId: group._id
    }

    // set is fetching
    setIsFetching(true)

    // axios api call for joining into a community
    axios.post(
      `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/join`,
      dataObject,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        // update groups and community  triggers auto refetch
        if (res?.data) {
          dispatch(resetClearCurrentGroupCommunities())

          // show alert success
          dispatch(updateCurrentSuccessRedux({ title: 'Joined Group', message: res.data }))
        }
      })
      .catch(async (err) => {
        console.log(err);
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable!"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }



  // handle not showing of the alert group on launch
  const handleNoShowGroupOnLaunch = () => {
    // fetching state
    setIsFetching(true)
    // axios post, update the tutorial state in the user db backend
    axios.post(`
            ${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/tutorial/groups`,
      { userId: user?._id }, {
      withCredentials: true,
    })
      .then((res) => {
        // update the current user redux state from the backend
        dispatch(updateUserCurrentUserRedux(res.data))

      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable!"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }


  // handle focused group
  const handleFocusedGroup = (group) => {
    // fetching state
    setIsFetching(true)

    // axios api call for getting group details
    axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/groups/all/${user?._id}/${group?._id}`,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        // update focused group
        if (res?.data) {
          setFocusedGroup(res.data)
        }
      })
      .catch(async (err) => {
        console.log(err);
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable!"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);
      });

  }



  return (
    <Dialog
      open={openGroup && !isActiveSuccess}
      fullWidth
      maxWidth="md"
      fullScreen={focusedGroup}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",

        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box>
          <Typography fontWeight={600}>
            Communities
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Discover and join tech groups
          </Typography>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <Close sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
      {errorMessage || isFetching ? (
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={2}
          mb={0.5}
          justifyContent={'center'}>
          {isFetching && <CircularProgress size={12} />}
          <FormHelperText>
            {isFetching ? "processing information" : errorMessage}
          </FormHelperText>
        </Box>
      ) : (
        <Box
          display={'flex'}
          mb={0.5}
          gap={2}
          justifyContent={'center'}>

          {/* group name */}
          <Typography fontSize={13} color="text.secondary">
            {focusedGroup
              ? "Community Overview"
              : `${groupData?.length || 0} communities available`}
          </Typography>
        </Box>
      )}

      {/* dialog content */}
      <DialogContent
        dividers
        sx={{
          overflow: "auto",
          maxHeight: '80vh',
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          maxHeight: "75vh",
          overflowY: "auto",
          px: 2,
        }}
      >

        {focusedGroup ? (
          <React.Fragment>
            {isMobile ? (
              <GroupCommunityMobile
                focusedGroup={focusedGroup}
                isFetching={isFetching}
                userId={user?._id}
                isDarkMode={isDarkMode}
                handleJoinCommunity={handleJoinCommunity}
                groups={groupData}
              />
            ) : isTablet ? (
              <GroupCommunityTab
                focusedGroup={focusedGroup}
                isFetching={isFetching}
                userId={user?._id}
                isDarkMode={isDarkMode}
                handleJoinCommunity={handleJoinCommunity}
                groups={groupData}
              />
            ) : (
              <GroupCommunityDetails
                focusedGroup={focusedGroup}
                isFetching={isFetching}
                userId={user?._id}
                isDarkMode={isDarkMode}
                handleJoinCommunity={handleJoinCommunity}
                groups={groupData}

              />
            )}
          </React.Fragment>
        ) : (
          <>
            {!groupData?.length && (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No communities found
                </Typography>
              </Box>
            )}
            {/* loop through groups and communities courses */}
            {groupData?.length && groupData?.map((group, index) => (
              <Box
                key={group._id || index}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "0.2s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {/* LEFT */}
                <Box display="flex" gap={1.5} alignItems="center">
                  <Avatar
                    src={getImageMatch(group.name.split(","), false, true)}
                    sx={{ width: 42, height: 42 }}
                  />

                  <Box>
                    <Typography fontSize={14} fontWeight={600}>
                      {group.name}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {group.total} members • {group.post_count} posts
                    </Typography>
                  </Box>
                </Box>

                {/* ACTION */}
                {!isGuest && (
                  <Button
                    size="small"
                    variant={group.isMember ? "outlined" : "contained"}
                    disableElevation
                    onClick={() =>
                      group.isMember
                        ? handleFocusedGroup(group)
                        : handleJoinCommunity(group)
                    }
                    sx={{
                      borderRadius: "999px",
                      px: 2,
                      fontWeight: 600,
                      minWidth: 90,
                      transition: "0.2s",
                      background:
                        !group.isMember &&
                        "linear-gradient(135deg,#0FA88F,#14D2BE)",
                      color: !group.isMember ? "#fff" : undefined,
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    {group.isMember ? "View" : "Join"}
                  </Button>
                )}
              </Box>
            ))}

          </>
        )}

      </DialogContent>
      <DialogActions>
        {user?.isGroupTutorial && (
          <Button
            disabled={isFetching}
            onClick={handleNoShowGroupOnLaunch}
            sx={{
              borderRadius: 4,
              mr: 1,
            }}>
            don't show
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
