import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function HelpAssistanceEmail() {
  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <div className="d-flex justify-content-center w-100 align-items-center border-bottom">
        {/* title */}
        <Typography variant={"caption"} className="w-100 fw-light text-center">
          Help Center Assistance Email
        </Typography>
      </div>

      <div>
        <p>send email</p>
      </div>
    </Box>
  );
}
