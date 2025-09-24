import { InfoRounded, TvRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
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

export default function FeaturedEventsContainer() {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)

  const dispatch = useDispatch();
  const theme=useTheme()
  const isMobileTab=useMediaQuery(theme.breakpoints.down('md'))

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

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, eventsTop]);

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
          <Typography 
          fontWeight={"bold"} 
          color={"primary"}>
            FEATURED EVENTS
          </Typography>

          {/* loading content when not ready */}
          {isFetching ? (
            <CircularProgress size={18}/>
          ):(
            <TvRounded color="primary" sx={{width:22, height:22}} />
          )}
        </Box>
      </Box>
      <List
        className="rounded mt-2"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpanded(),
        }}
      >
        <Box>
          {eventsTop?.slice(0,isMobileTab ? 3:undefined).map((currentEvent, index) => (
              <Box key={currentEvent?._id}>
                <FeaturedEvent
                isLoading={isFetching}
                eventTop={currentEvent}
                setErrorMessage={setErrorMessage}
                isLastIndex={index===eventsTop?.length-1}
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
          defaultIcon={<InfoRounded/>}
          />
        )}

    </React.Fragment>
  );
}
