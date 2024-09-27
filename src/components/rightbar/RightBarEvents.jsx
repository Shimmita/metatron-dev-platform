import {
  AddRounded,
  BookmarksRounded,
  CalendarMonthRounded,
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
    <>
      <List sx={{ bgcolor: "background.paper" }}>
        <CardActionArea onClick={handleEventsLive}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={1}
            mb={3}
          >
            <LiveTvRounded color={"error"} />
            <Typography variant="body2">View Live Ongoing Events</Typography>
            <Typography variant="body2" color={"text.secondary"}>
              50
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
            <Typography variant="body2">Check Upcoming Events</Typography>
            <Typography variant="body2" color={"text.secondary"}>
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
            <Typography variant="body2">Saved Event Bookmarks</Typography>
            <Typography variant="body2" color={"text.secondary"}>
              10
            </Typography>
          </Box>
        </CardActionArea>

        <CardActionArea onClick={handleEventsAdd}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={3}
          >
            <AddRounded color={"primary"} sx={{ width: 23, height: 23 }} />
            <Typography variant="body2">Add Your New Event</Typography>
            <Typography variant="body2" color={"text.secondary"}>
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
    </>
  );
}
