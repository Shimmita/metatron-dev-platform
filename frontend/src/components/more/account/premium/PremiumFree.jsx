import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import PremiumData from "../../../data/PremiumData";

function PremiumFree() {
  return (
    <Box mt={2}>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box className="w-auto">
          <ul>
            {PremiumData &&
              PremiumData.Free.map((data, index) => (
                <Box key={index}>
                  <Box m={2}>
                    <Typography gutterBottom component={"li"} variant="body2">
                      {data}
                    </Typography>
                  </Box>
                  <Divider component={"div"} variant="fullWidth" />
                </Box>
              ))}
          </ul>
        </Box>
      </Box>
    </Box>
  );
}

export default PremiumFree;
