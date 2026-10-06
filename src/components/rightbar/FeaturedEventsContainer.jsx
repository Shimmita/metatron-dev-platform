import { InfoRounded, TvRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentEventsTop } from "../../redux/CurrentEventsTop";
import AlertGeneral from "../alerts/AlertGeneral";
import FeaturedEvent from "./layouts/FeaturedEvent";

const screenWidth = window.screen.availWidth;
// get the rightbar expanded appropriately
const rightBarExpanded = () => {
  if (screenWidth > 1300) {
    return 360;
  }

  if (screenWidth > 1250) {
    return 350;
  }

  if (screenWidth > 1400) {
    return 380;
  }
};

const getRequestMessage = (err, fallback = "Unable to load featured events.") => {
  if (err?.code === "ERR_NETWORK") return "Server is unreachable. Please try again later.";
  const payload = err?.response?.data || err;
  if (typeof payload === "string") return payload;
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  return fallback;
};

export default function FeaturedEventsContainer() {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false)
  const dispatch = useDispatch();

  // redux states
  const { eventsTop } = useSelector((state) => state.currentEventsTop);

  // fetch posts from the backend
  useEffect(() => {
    // check if there is no posts then fetch else don't api calls
    if (eventsTop) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/top`, {
        withCredentials: true,
      })
      .then((res) => {

        // update the redux of current events top
        if (res?.data) {
          dispatch(updateCurrentEventsTop(res.data));
        }
      })
      .catch(async (err) => {
        console.log(err);

        setErrorMessage(getRequestMessage(err));
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, eventsTop]);

  if (Array.isArray(eventsTop) && eventsTop.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
          py={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <TvRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
            <Typography fontSize={13} fontWeight={600} color="#FFFDF7">
              Featured Events
            </Typography>
          </Box>

          {isFetching && <CircularProgress size={14} />}
        </Box>
      </Box>
      <List
        className="rounded mt-2"
        sx={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          width: "100%",
          p: 0,
        }}
      >
        <Box>
          {eventsTop?.slice(0, 3).map((currentEvent, index) => (
            <Box key={currentEvent?._id}>
              <FeaturedEvent
                isLoading={isFetching}
                eventTop={currentEvent}
                setErrorMessage={setErrorMessage}
                isLastIndex={index === eventsTop?.length - 1}
              />
            </Box>
          ))}
        </Box>
      </List>

      {/* alert general of the error message */}
      {errorMessage && (
        <AlertGeneral
          title={'something went wrong!'}
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded />}
        />
      )}

    </React.Fragment>
  );
}
