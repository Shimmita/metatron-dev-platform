import {
  AddRounded,
  Bookmark,
  CalendarMonthRounded,
  EventNoteRounded,
  LiveTvRounded,
} from "@mui/icons-material";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import EventsAddModal from "../modal/EventsAddModal";

export default function EventsTablet() {
  // controll showing of the events add modal
  const [openModalEventAdd, setOpenModalEventAdd] = React.useState(false);

  // navigate to next window
  const navigate = useNavigate();

  // navigate to live events window
  const handleEventsLive = () => {
    navigate("events/live");
  };

  // navigate to upcoming events window
  const handleEventsUpcoming = () => {
    navigate("events/upcoming");
  };

  // navigate to events bookmark window
  const handleEventsBookMarks = () => {
    navigate("events/bookmarks");
  };

  // show events add modal dialog
  const handleEventsAdd = () => {
    setOpenModalEventAdd(!openModalEventAdd);
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        className="pe-2"
      >
        <ListItemButton onClick={handleEventsLive}>
          <ListItemIcon>
            <LiveTvRounded color="warning" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">Live</Typography>}
          />
        </ListItemButton>
        <Typography variant="body2">20</Typography>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        className="pe-2 "
      >
        <ListItemButton onClick={handleEventsUpcoming}>
          <ListItemIcon>
            <CalendarMonthRounded
              color={"primary"}
              sx={{ width: 23, height: 23 }}
            />{" "}
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">Upcoming</Typography>}
          />
        </ListItemButton>
        <Typography className="fw-normal " variant="body2">
          35
        </Typography>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        className="pe-2"
      >
        <ListItemButton onClick={handleEventsBookMarks}>
          <ListItemIcon>
            <Bookmark color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">Bookmarks </Typography>}
          />
        </ListItemButton>
        <Typography className="fw-normal" variant="body2">
          10
        </Typography>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        className="pe-2"
      >
        <ListItemButton onClick={handleEventsAdd}>
          <ListItemIcon>
            <EventNoteRounded color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">Create Event</Typography>}
          />
        </ListItemButton>
        <AddRounded sx={{ color: "grey" }} />
      </Box>

      {/* Events add modal */}
      <EventsAddModal
        openModalEventAdd={openModalEventAdd}
        setOpenModalEventAdd={setOpenModalEventAdd}
      />
    </>
  );
}
