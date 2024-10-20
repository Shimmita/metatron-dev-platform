import {
    CallEndRounded,
    MessageRounded,
    PeopleRounded,
} from "@mui/icons-material";
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Tooltip,
} from "@mui/material";
import React from "react";

const BottomNavMobileLive = ({ handleShowPeople, handleShowMessages }) => {
  const [value, setValue] = React.useState(0);

  // return learning page
  const handleLearningContent = () => {
    return;
  };

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels={false}
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="attending"
          icon={<PeopleRounded />}
          onClick={handleShowPeople}
        />

        <BottomNavigationAction
          onClick={handleShowMessages}
          label="comments"
          icon={<MessageRounded />}
        />

        <Tooltip title="courses" arrow>
          <BottomNavigationAction
            onClick={handleLearningContent}
            label="Leave"
            icon={<CallEndRounded color="error" />}
          />
        </Tooltip>
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavMobileLive;
