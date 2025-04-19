import { PeopleRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentConnectTop } from "../../redux/CurrentConnect";
import FriendRequest from "./layouts/FriendRequest";

export default function RequestContainer({ isLoadingPostLaunch }) {
  const { connectTop } = useSelector((state) => state.currentConnectRequest);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useSelector((state) => state.currentUser);

  // tackle corner cases screen width
  const screenWidth = window.screen.availWidth;
  // dispatch action
  const dispatch = useDispatch();

  // extracting current userId for locatin users aint friend with
  const { _id } = user || {};
  // axios default credentials
  axios.defaults.withCredentials = true;

  // fetch from the backend the top 3 users
  useEffect(() => {
    // if already available in redux dont fetch
    if (connectTop) {
      return;
    }

    // set is fetching to true
    setIsFetching(true);

    // performing get request
    axios
      .get(
        `http://localhost:5000/metatron/api/v1/connections/connection/users/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the redux of connect request suggestion
        if (res?.data && res.data) {
          dispatch(updateCurrentConnectTop(res.data));
        }
      })
      .catch(async (err) => {
        console.log(err);

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, _id, connectTop]);

  // get the rightbar expanded appropritately
  const rightBarExpaned = () => {
    if (screenWidth > 1300) {
      return 360;
    }

    if (screenWidth > 1250) {
      return 350;
    }

    if (screenWidth > 1400) {
      return 380;
    }
    return;
  };

  return (
    <React.Fragment>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          pt={2}
        >
          <Typography fontWeight={"bold"} color={"primary"}>
            CONNECT SUGGESTION
          </Typography>
          <PeopleRounded color="primary" />
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpaned(),
        }}
      >
        <Box>
          {connectTop &&
            connectTop.slice(0, 4).map((connection, index) => (
              <Box key={index}>
                <FriendRequest
                  isLoadingRequest={isFetching}
                  connect_request={connection}
                />
              </Box>
            ))}
        </Box>
      </List>
    </React.Fragment>
  );
}
