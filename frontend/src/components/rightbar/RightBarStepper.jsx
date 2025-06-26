import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import React from "react";

export default function RightBarStepper({
  corouselCounter,
  setCorouselCounter,
}) {
  const maxStep = 3;

  const handleNext = () => {
    setCorouselCounter((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCorouselCounter((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={maxStep}
      position="static"
      activeStep={corouselCounter}
      sx={{ maxWidth: 150, flexGrow: 1, p:0,m:0 }}
      nextButton={
        <IconButton onClick={handleNext} disabled={corouselCounter === maxStep - 1}>
          <KeyboardArrowRightRounded
            color={corouselCounter === maxStep - 1 ? "inherit" : "primary"}
          />
        </IconButton>
      }
      backButton={
        <IconButton onClick={handleBack} disabled={corouselCounter === 0}>
          <KeyboardArrowLeftRounded
            color={corouselCounter === 0 ? "inherit" : "primary"}
          />
        </IconButton>
      }
    />
  );
}
