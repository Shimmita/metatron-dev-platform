import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";

const steps = ["Free","Silver", "Gold"];

export default function AccountLevelStep() {

  return (
    <Box>
      <Stepper activeStep={0}>
        {steps.map((label) => (
          <Step  key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      
      </Stepper>
   
    </Box>
  );
}
