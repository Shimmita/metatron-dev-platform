import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux & Components
import { updateCurrentNetwork } from "../../redux/CurrentNetwork";
import MetatronSnackbar from "../snackbar/MetatronSnackBar";
import UserNetworkLayout from "./UserNetworkLayout";

const UserNetwork = ({ otherUserID }) => {
  const dispatch = useDispatch();

  /* ─── UI States ─── */
  const [isFetching, setIsFetching] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    isError: false,
  });
  const [profileNetwork, setProfileNetwork] = useState(null);

  /* ─── Redux States ─── */
  const { user } = useSelector((state) => state.currentUser);
  const { myNetwork } = useSelector((state) => state.currentNetwork);

  // Determine target ID (Current User or Profile being viewed)
  const currentUserID = otherUserID ?? user?._id;
  const isOwnProfile = !otherUserID || otherUserID === user?._id;
  const displayNetwork = isOwnProfile ? myNetwork : profileNetwork;

  const handleCloseNotify = () => setNotify((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    if (myNetwork?.length > 0 && isOwnProfile) return;
    if (!currentUserID) return;

    const fetchNetwork = async () => {
      setIsFetching(true);
      if (!isOwnProfile) setProfileNetwork(null);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/network/all`,
          { currentUserID, networks: isOwnProfile ? user?.network : [] },
          { withCredentials: true }
        );

        if (res?.data) {
          if (isOwnProfile) {
            dispatch(updateCurrentNetwork(res.data));
          } else {
            setProfileNetwork(res.data);
          }
        }
      } catch (err) {
        if (err?.response?.data?.login) {
          window.location.reload();
          return;
        }

        const errorMsg = err?.code === "ERR_NETWORK"
          ? "Metatron server is unreachable."
          : (err?.response?.data || "Failed to load network data.");

        setNotify({
          open: true,
          message: errorMsg,
          isError: true,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchNetwork();

  }, [dispatch, currentUserID, otherUserID, user?._id, user?.network, myNetwork, isOwnProfile]);

  return (
    <Box mt={1.5} sx={{ width: "100%", minHeight: "200px" }}>
      {/* Metatron Themed Notifications */}
      <MetatronSnackbar
        open={notify.open}
        message={notify.message}
        isError={notify.isError}
        handleClose={handleCloseNotify}
      />

      <Box
        sx={{
          px: 0.5,
          pb: 1.25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box minWidth={0}>
          <Typography variant="body2" fontWeight={900}>
            Network
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isOwnProfile ? "Your trusted developer circle." : "Connections visible on this profile."}
          </Typography>
        </Box>
        <Typography variant="caption" color="primary.main" fontWeight={900}>
          {displayNetwork?.length || 0}
        </Typography>
      </Box>

      {isFetching && (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={35} thickness={4} sx={{ color: "primary.main" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", letterSpacing: "0.1em" }}>
              SYNCING METATRON NETWORK...
            </Typography>
          </Stack>
        </Box>
      )}

      {/* List State: Map through network data */}
      {!isFetching && displayNetwork?.length > 0 && (
        <Box>
          {displayNetwork.map((network, index) => (
            <Box key={network._id || index} mb={1}>
              <UserNetworkLayout network={network} canRemove={isOwnProfile} />
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State: If fetching is done and no network exists */}
      {!isFetching && (!displayNetwork || displayNetwork.length === 0) && (
        <Box py={10} textAlign="center">
          <Typography variant="body2" sx={{ color: "rgba(255,253,247,0.74)", fontWeight: 800 }}>
            No active connections yet.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,253,247,0.54)" }}>
            People you connect with will appear here.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserNetwork;
