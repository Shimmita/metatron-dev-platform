import { Add, GroupRounded, PeopleRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentConnectTop } from "../../redux/CurrentConnect";
import { resetClearPeopleData } from "../../redux/CurrentModal";
import UserNetwork from "../profile/UserNetwork";
import FriendRequest from "../rightbar/layouts/FriendRequest";
import {
  ModalBody,
  ModalHeader,
  ModalShell,
  SectionCard,
  SectionTitle,
  StatusBanner,
} from "./ModalShared";

const PeopleModal = ({
  openPeopleModal, 
  PeopleConnect, 
  isFeed=false,
  setOpenPeopleModal,
 }) => {
  
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMorePosts,setHasMorePosts]=useState(true) 
  const [pageNumber,setPageNumber]=useState(2)
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const theme = useTheme();

  // close the modal from redux by altering states to false and null data
  const handleCloseModalPeople = () => {
    // modal opened from the feed default content
    if (isFeed) {
      setOpenPeopleModal()
    }
    dispatch(resetClearPeopleData());
  };


     // handle loading of more data
  const handleLoadMore=()=>{

    // set is fetching to true
    setIsFetching(true);

    // performing get request
    axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/users/${user?._id}?page=${pageNumber}&limit=4`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of connect request suggestion
        if (res.data.length>0) {
          dispatch(updateCurrentConnectTop([...PeopleConnect, ...res.data]));
        }else{
          // no more posts
          setHasMorePosts(false)
        }
        // update the page number
        setPageNumber(prev=>prev+1)

      })
      .catch(async (err) => {

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
        
        // log error
        console.log(errorMessage)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
      }

  // control showing of friends
  const handleShowFriends=()=>{


  }

  const tabLabel = value === 1 ? "Friends and network" : "Suggested people";
  const suggestionsCount = PeopleConnect?.length || 0;

  return (
    <ModalShell open={openPeopleModal}>
      <ModalHeader
        title={isFeed ? "People suggestions" : "Search results"}
        subtitle={
          value === 1
            ? "Review your current network and manage the people you already know."
            : "Discover professionals you may want to connect with based on your activity and interests."
        }
        onClose={handleCloseModalPeople}
      />

      <StatusBanner
        errorMessage={errorMessage}
        onDismiss={() => setErrorMessage("")}
        isUploading={false}
      />

      <ModalBody>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          {isFeed && (
            <Box
              sx={{
                px: { xs: 0.5, sm: 1 },
                pt: 0.5,
              }}
            >
              <Tabs
                value={value}
                onChange={handleChangeTab}
                aria-label="people_tab"
                variant="fullWidth"
                sx={{
                  minHeight: 52,
                  "& .MuiTabs-flexContainer": {
                    gap: { xs: 0.5, sm: 1 },
                  },
                  "& .MuiTab-root": {
                    minHeight: 52,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.secondary",
                    bgcolor: isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(15,76,129,0.03)",
                  },
                  "& .Mui-selected": {
                    bgcolor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(15,76,129,0.08)",
                    color: "primary.main",
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab label="Connect" icon={<Add />} iconPosition="start" />
                <Tab
                  label="Friends"
                  onClick={handleShowFriends}
                  icon={<PeopleRounded />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          )}

          <SectionCard>
            <Box
              display="flex"
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              gap={1.5}
              flexDirection={{ xs: "column", sm: "row" }}
              mb={2}
            >
              <Box>
                <SectionTitle>{tabLabel}</SectionTitle>
                <Typography variant="body2" color="text.secondary">
                  {value === 1
                    ? "Stay on top of your existing relationships and revisit people you already follow or know."
                    : "Browse curated suggestions, review profiles, and connect with relevant people from the platform."}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.4,
                  py: 0.7,
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  minWidth: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {value === 1
                    ? "Network overview"
                    : `${suggestionsCount} suggestion${suggestionsCount === 1 ? "" : "s"}`}
                </Typography>
              </Box>
            </Box>

            {value===1 ? (
              <UserNetwork/>
            ):(
              <Box display={"flex"} flexDirection={"column"} gap={1.5}>
                {suggestionsCount > 0 ? (
                  PeopleConnect?.map((person) => (
                    <FriendRequest key={person?._id} connect_request={person} />
                  ))
                ) : (
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: `${theme.shape.borderRadius + 2}px`,
                      p: 2.5,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <GroupRounded color="primary" sx={{ mb: 1 }} />
                    <Typography fontWeight={700} mb={0.5}>
                      No people to show right now
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      New suggestions will appear here once more matching profiles are available.
                    </Typography>
                  </Box>
                )}

                {isFeed && suggestionsCount > 0 && (
                  <Box display="flex" justifyContent="center" pt={1}>
                    <Button
                      variant="outlined"
                      startIcon={isFetching ? <CircularProgress size={14}/> : undefined}
                      disabled={isFetching || !hasMorePosts}
                      onClick={handleLoadMore}
                    >
                      {!hasMorePosts ? "No more suggestions" : "Load more people"}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </SectionCard>
        </Box>
      </ModalBody>
    </ModalShell>
  );
};

export default PeopleModal;
