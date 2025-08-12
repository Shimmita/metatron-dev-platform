import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentNetwork } from "../../redux/CurrentNetwork";
import UserNetworkLayout from "./UserNetworkLayout";

const UserNetwork = ({ otherUserID }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const { myNetwork } = useSelector((state) => state.currentNetwork);
  // extracting user ID and user network from the redux
  const { _id: currentUserIdValue, network: networks } = user;

  const dispatch = useDispatch();

  const currentUserID = otherUserID != null ? otherUserID : currentUserIdValue;

  //use effect to fetch all the data of the friends of the user.
  useEffect(() => {
    // if there are posts and userId is matched current user don't network request
    if (myNetwork?.length > 0 || otherUserID === currentUserIdValue) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request to fetch the names of the friends
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/network/all`,
        { currentUserID, networks },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentNetwork(res.data));
        }
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable please try again");
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [
    dispatch,
    myNetwork,
    currentUserID,
    networks,
    currentUserIdValue,
    otherUserID,
  ]);

  return (
    <Box mt={2}>
      {/* progress dialog */}
      {isFetching && (
        <Box display={"flex"} justifyContent={"center"}>
          <Stack gap={1}>
            <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress size={30} />
            </Box>

            <Box display={"flex"} justifyContent={"center"}>
              <Typography variant="body2" color={"text.secondary"}>
                {" "}
                loading..
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* message response if there is a failure */}
      {errorMessage && (
        <Typography
          textAlign={"center"}
          variant="body2"
          color={"text.secondary"}
        >
          {errorMessage}
        </Typography>
      )}

      {myNetwork && (
        <Box>
          {myNetwork?.map((network, index) => (
            <Box key={index} mb={2}>
              <UserNetworkLayout network={network} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserNetwork;
