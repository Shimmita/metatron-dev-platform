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

  /* ─── Redux States ─── */
  const { user } = useSelector((state) => state.currentUser);
  const { myNetwork } = useSelector((state) => state.currentNetwork);

  // Determine target ID (Current User or Profile being viewed)
  const currentUserID = otherUserID ?? user?._id;
  const userNetworks = user?.network;

  const handleCloseNotify = () => setNotify((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    // 1. If we already have the data in Redux, don't fetch again
    // 2. Only bypass fetch if viewing OWN profile and myNetwork exists
    const isOwnProfile = !otherUserID || otherUserID === user?._id;
    if (myNetwork?.length > 0 && isOwnProfile) return;

    const fetchNetwork = async () => {
      setIsFetching(true);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/network/all`,
          { currentUserID, networks: userNetworks },
          { withCredentials: true }
        );

        if (res?.data) {
          dispatch(updateCurrentNetwork(res.data));
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

    // Dependencies optimized to prevent infinite loops
  }, [dispatch, currentUserID, userNetworks, otherUserID, user?._id, myNetwork]);

  return (
    <Box mt={2} sx={{ width: "100%", minHeight: "200px" }}>
      {/* Metatron Themed Notifications */}
      <MetatronSnackbar
        open={notify.open}
        message={notify.message}
        isError={notify.isError}
        handleClose={handleCloseNotify}
      />

      {/* Loading State: Uses theme primary (Teal) */}
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
      {!isFetching && myNetwork?.length > 0 && (
        <Box>
          {myNetwork.map((network, index) => (
            <Box key={network._id || index} mb={2}>
              <UserNetworkLayout network={network} />
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State: If fetching is done and no network exists */}
      {!isFetching && (!myNetwork || myNetwork.length === 0) && (
        <Box py={10} textAlign="center">
          <Typography variant="body2" sx={{ color: "text.muted" }}>
            No active connections found in this sector.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserNetwork;