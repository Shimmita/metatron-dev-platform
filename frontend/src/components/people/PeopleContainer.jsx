import { PersonAdd } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";
import { GetScreenWidth } from "../utilities/GetScreenWidth";
import ConnectSuggestion from "./ConnectSuggestion";
import FollowSuggetion from "./FollowSuggestion";
import ModalMorePeople from "./ModalMorePeople";

const PeopleContainer = () => {
  // for follow/connect people people
  const items = Array.from({ length: 10 }, (_, i) => i);

  const [openPostModal, setOpenPostModal] = React.useState(false);
  const [followConnect, setFollowConnect] = React.useState();
  // handle showing follow, connect or event
  const handleChange = (event, update) => {
    setFollowConnect(update);
  };
  // handle opening of the modal
  const handleShowingModalMorePeople = () => {
    setOpenPostModal(true);
  };

  return (
    <Box className="shadow rounded mb-3 ">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <ToggleButtonGroup
            value={followConnect}
            exclusive
            color="primary"
            onChange={handleChange}
          >
            <ToggleButton value={1}>
              <Typography
                fontWeight={"bold"}
                fontSize={"small"}
                variant="body2"
              >
                follow <span className="ps-2">20</span>{" "}
              </Typography>
            </ToggleButton>
            <ToggleButton value={2}>
              <Typography
                fontWeight={"bold"}
                fontSize={"small"}
                variant="body2"
              >
                connect <span className="ps-2">10</span>{" "}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box display={"flex"}>
          <IconButton onClick={handleShowingModalMorePeople}>
            <PersonAdd color="primary" sx={{ width: 22, height: 22 }} />
          </IconButton>
        </Box>
      </Box>

      {/* followconnect empty then do not show else show */}
      {followConnect && (
        <Box
          sx={{
            width: GetScreenWidth(),
            display: "flex",
            overflowX: "auto",
            gap: 1,
            padding: 1,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* show follow if 0 else(1) show connect */}

          {followConnect === 1 ? (
            <>
              {items.map((item, index) => (
                <FollowSuggetion key={index} />
              ))}
            </>
          ) : followConnect === 2 ? (
            <>
              {items.map((item, index) => (
                <ConnectSuggestion key={index} />
              ))}
            </>
          ) : null}
        </Box>
      )}

      {/* follow more people modal */}
      <ModalMorePeople
        openPostModal={openPostModal}
        setOpenPostModal={setOpenPostModal}
      />
    </Box>
  );
};

export default PeopleContainer;
