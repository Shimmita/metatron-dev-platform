import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography
} from "@mui/material";
import React from "react";

function StreamingSettings() {
  return (
    <Box p={2}>
      <Box>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked />}
            label={<Typography variant="body2">video auto-play</Typography>}
          />
        </FormGroup>
      </Box>
    </Box>
  );
}

export default StreamingSettings;
