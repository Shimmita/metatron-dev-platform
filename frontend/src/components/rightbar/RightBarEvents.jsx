import {
  AddRounded,
  BookmarksRounded,
  CalendarMonthRounded,
  EventNoteRounded,
  LiveTvRounded,
} from "@mui/icons-material";
import { Box, CardActionArea } from "@mui/material";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import EventsAddModal from "../modal/EventsAddModal";

export default function RightBarEvents() {
  // control opening of the events modal
  const [openModalEventAdd, setOpenModalEventAdd] = React.useState(false);

  // navigation router
  const navigate = useNavigate();

  const handleEventsLive = () => {
    navigate("events/live");
  };

  const handleEventsAdd = () => {
    setOpenModalEventAdd(!openModalEventAdd);
  };

  const handleEventsUpcoming = () => {
    navigate("events/upcoming");
  };
  const handleEventsBookMarks = () => {
    navigate("events/bookmarks");
  };
  return (
    <Box>
      <List
        className="px-4"
        sx={{ bgcolor: "background.paper", width: "100%" }}
      >
        <CardActionArea onClick={handleEventsLive}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={3}
            width={"100%"}
          >
            <LiveTvRounded color="warning" />
            <Typography variant="body2">Live Stream Events</Typography>
            <Typography
              fontWeight={"bold"}
              variant="body2"
              color={"text.secondary"}
            >
              125
            </Typography>
          </Box>
        </CardActionArea>

        <CardActionArea onClick={handleEventsUpcoming}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={1}
            mb={3}
          >
            <CalendarMonthRounded
              color={"primary"}
              sx={{ width: 23, height: 23 }}
            />
            <Typography variant="body2">Explore Upcoming </Typography>
            <Typography
              fontWeight={"bold"}
              variant="body2"
              color={"text.secondary"}
            >
              200
            </Typography>
          </Box>
        </CardActionArea>

        <CardActionArea onClick={handleEventsBookMarks}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={1}
            mb={3}
          >
            <BookmarksRounded
              color={"primary"}
              sx={{ width: 23, height: 23 }}
            />
            <Typography variant="body2">My Event Bookmarks</Typography>
            <Typography
              fontWeight={"bold"}
              variant="body2"
              color={"text.secondary"}
            >
              10
            </Typography>
          </Box>
        </CardActionArea>

        <CardActionArea onClick={handleEventsAdd}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={2}
          >
            <EventNoteRounded
              color={"primary"}
              sx={{ width: 23, height: 23 }}
            />
            <Typography variant="body2">Add New Event</Typography>
            <Typography
              fontWeight={"bold"}
              variant="body2"
              color={"text.secondary"}
            >
              create
            </Typography>
          </Box>
        </CardActionArea>
      </List>

      {/* display modal add events */}
      <EventsAddModal
        openModalEventAdd={openModalEventAdd}
        setOpenModalEventAdd={setOpenModalEventAdd}
      />
    </Box>
  );
}
