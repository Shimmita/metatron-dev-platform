import {
  DownloadForOfflineRounded,
  DownloadRounded,
  EmailRounded,
  FlagRounded,
  PersonAddRounded,
  StarRounded,
  WarningRounded,
} from "@mui/icons-material";
import { Box, Divider, ListItemText, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
function CardFeedMore({ ownerId, ownerName, currentUserNetwork = [] }) {
  const [isFriend, setIsFriend] = useState();

  // extracting the list of friends/network from the current user
  useEffect(() => {
    // map through ids of friends if the current user network
    // has the id of the post owner, measns are friends else false
    if (currentUserNetwork.includes(ownerId)) {
      setIsFriend(true);
    }
  }, [isFriend, currentUserNetwork, ownerId]);

  return (
    <>
      <Box borderRadius={5}>
        {isFriend ? (
          <React.Fragment>
            <MenuItem>
              <ListItemText>
                <EmailRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={`Inbox ${ownerName.split(" ")[0]}`}
              />
            </MenuItem>
            <Divider component={"li"} />
            <MenuItem>
              <ListItemText>
                <DownloadForOfflineRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"Download Media"}
              />
            </MenuItem>
            <Divider component={"li"} />
            <MenuItem>
              <ListItemText>
                <StarRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"add favourite"}
              />
            </MenuItem>
            <Divider component={"li"} />
            <MenuItem>
              <ListItemText>
                <FlagRounded color="warning" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"Report Content"}
              />
            </MenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MenuItem>
              <ListItemText>
                <PersonAddRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={`add ${ownerName.split(" ")[0]}`}
              />
            </MenuItem>

            <Divider component={"li"} />

            <MenuItem>
              <ListItemText>
                <DownloadRounded color="primary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"save content"}
              />
            </MenuItem>
            <Divider component={"li"} />
            <MenuItem>
              <ListItemText>
                <StarRounded color="secondary" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"add favourite"}
              />
            </MenuItem>
            <Divider component={"li"} />
            <MenuItem>
              <ListItemText>
                <WarningRounded color="warning" className="mx-2" />
              </ListItemText>
              <ListItemText
                sx={{ textTransform: "lowercase" }}
                primary={"Report Content"}
              />
            </MenuItem>
          </React.Fragment>
        )}
      </Box>
    </>
  );
}

export default CardFeedMore;
