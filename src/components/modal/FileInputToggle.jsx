import { Box, Typography } from "@mui/material";
import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
function FileInputToggle({ setIsUrl }) {
  const [fileLink, setFileLink] = React.useState(0);
  // handle showing follow, connect or event
  const handleChange = (event, update) => {
    setFileLink(update);
  };

  // change the state of the IsUrl property
  fileLink === 1 ? setIsUrl(true) : setIsUrl(false);
  return (
    <Box>
      <ToggleButtonGroup
        value={fileLink}
        exclusive
        color="primary"
        onChange={handleChange}
      >
        <ToggleButton value={0}>
          <Typography
            fontWeight={"bold"}
            fontSize={"xx-small"}
            variant="caption"
          >
            File
          </Typography>
        </ToggleButton>
        <ToggleButton value={1}>
          <Typography
            fontWeight={"bold"}
            fontSize={"xx-small"}
            variant="caption"
          >
            Link
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default FileInputToggle;
