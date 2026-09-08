import { InfoRounded, SchoolRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentCoursesTop } from "../../redux/CurrentCoursesTop";
import AlertGeneral from "../alerts/AlertGeneral";
import PopularCouses from "./layouts/PopularCourses";

export default function CoursesContainer() {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false);
  const dispatch = useDispatch();
  const { coursesTop } = useSelector((state) => state.currentCoursesTop);

  useEffect(() => {
    if (coursesTop) {
      return;
    }

    setIsFetching(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/top`, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(updateCurrentCoursesTop(res?.data || []));
      })
      .catch((err) => {
        setErrorMessage(err?.code === "ERR_NETWORK" ? "Unable to load learning tracks." : err?.response?.data || "Unable to load learning tracks.");
        setOpenAlertGeneral(true);
        dispatch(updateCurrentCoursesTop([]));
      })
      .finally(() => setIsFetching(false));
  }, [coursesTop, dispatch]);

  if (Array.isArray(coursesTop) && coursesTop.length === 0) {
    return null;
  }

  return (
    <>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
          py={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolRounded sx={{ color: "#D6B25E", fontSize: 18 }} />
            <Typography fontSize={13} fontWeight={600} color="#FFFDF7">
              Learning Tracks
            </Typography>
          </Box>
          {isFetching && <CircularProgress size={14} />}
        </Box>
      </Box>
      <List
        className="rounded"
        sx={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          width: "100%",
          p: 0,
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 1 }}
        >
          {coursesTop?.slice(0, 3).map((courseTop) => (
            <Box
              key={courseTop?._id}
              sx={{
                flex: '1 1 250px',
                minWidth: '200px',
                maxWidth: '300px',
              }}
            >
              <PopularCouses courseTop={courseTop} />
            </Box>
          ))}
        </Box>
      </List>

      {errorMessage && (
        <AlertGeneral
          title="something went wrong!"
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded />}
        />
      )}
    </>
  );
}
