import { BarChartRounded, Close, Flag, FlagRounded } from "@mui/icons-material";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showMessagingDrawer } from "../../../redux/AppUI";
import { updateCurrentReportID } from "../../../redux/CurrentPostReported";
import MiniProfileLayout from "../../custom/MiniProfileLayout";
import { getElapsedTime } from "../../utilities/getElapsedTime";

export default function PostReported({ report, isLastItem }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isMiniProfile, setIsMiniProfile] = useState(false);
  const navigate = useNavigate();

  // dispatch for redux functionalities
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;

  // getting the current reactionID
  const { _id } = report;

  // handle deletion of the current notification post_reaction
  const handleDeleteReportReaction = () => {
    console.log("delete");

    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .delete(
        `http://localhost:5000/metatron/api/v1/posts/report/delete/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // update the redux of of reactions to reflect the current changes
          dispatch(updateCurrentReportID(report?._id));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  };

  // handle fetch user details
  const handleShowMiniProfile = () => {
    // show user miniprofile view instead of their post reaction
    setIsMiniProfile((prev) => !prev);
  };

  // navigate to post details routed page, alse close the drawer notification
  const handleNavigatePostDetailsRoute = () => {
    // close drawer messageing by updating the redux state
    dispatch(showMessagingDrawer());

    // navigate
    navigate("/posts/details/" + report?.postId);
  };

  return (
    <React.Fragment>
      {isMiniProfile ? (
        <React.Fragment>
          {/* user miniprofile */}
          <Box
            className={" mb-2"}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <MiniProfileLayout
              handleShowMiniProfile={handleShowMiniProfile}
              userId={report?.reporterId}
            />
          </Box>
        </React.Fragment>
      ) : (
        <List
          sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar onClick={handleShowMiniProfile}>
              <Avatar src="" alt="">
                <Typography
                  variant="body2"
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                >
                  {report?.reporter_name[0]}
                </Typography>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  {/* reporter name */}
                  <Typography
                    fontWeight={"bold"}
                    variant="body2"
                    width={"100%"}
                  >
                    {report?.reporter_name}
                  </Typography>
                  {/*delete button +progress if is fetch */}
                  {isFetching ? (
                    <CircularProgress size={"10px"} />
                  ) : (
                    <Box display={"flex"} gap={"3px"} alignItems={"center"}>
                      {/* time elapsed since post created */}
                      <Typography variant="caption">
                        {getElapsedTime(report?.createdAt)}
                      </Typography>
                      {/* delete reaction */}
                      <IconButton
                        size="small"
                        onClick={handleDeleteReportReaction}
                      >
                        <Close sx={{ width: 15, height: 15 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              }
              secondary={
                <CardActionArea onClick={handleNavigatePostDetailsRoute}>
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        display: "inline",
                        alignItems: "center",
                      }}
                    >
                      {/* reporter speciality */}
                      <Typography variant="body2" gutterBottom>
                        {report?.reporter_speciality}
                      </Typography>{" "}
                      {/* post title */} " {report?.post_title} " <br />
                      {/* report about */}
                      <FlagRounded
                        sx={{ width: 16, height: 16 }}
                        color="info"
                        className="me-1"
                      />
                      {/* message  */}
                      {report?.report_title}
                      {/* minimessage of post section */}
                    </Typography>
                    {` — ${report?.report_message}`}

                    {/* box telling stats of report cases or count times */}
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      mt={1}
                      gap={1}
                    >
                      {/* stats svg */}
                      <Box>
                        <BarChartRounded sx={{ width: 16, height: 16 }} />
                      </Box>
                      <Box
                        sx={{
                          pe: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                          color: "text.secondary",
                          "& svg": {
                            m: 1,
                          },
                        }}
                      >
                        {/* likes count */}
                        <Flag sx={{ width: 14, height: 14 }} />
                        <Typography variant="caption" className="px-1">
                          post reported {report?.report_count} times
                        </Typography>
                      </Box>
                    </Box>
                  </React.Fragment>
                </CardActionArea>
              }
            />
          </ListItem>
          {/* show divider is is not last item */}
          {!isLastItem && <Divider variant="inset" component="li" />}
        </List>
      )}
    </React.Fragment>
  );
}
