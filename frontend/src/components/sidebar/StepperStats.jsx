import { SmartphoneRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";

/* ─── Helper: Icon Resolver ─── */
const resolveIcon = (title) => {
  const key = title.split(" ")[0];

  if (key.includes("Multi") || key.includes("Backend")) {
    return <CourseIcon option={key} />;
  }

  if (key.includes("Native")) {
    return <SmartphoneRounded sx={{ width: 22, height: 22 }} />;
  }

  return (
    <Avatar
      sx={{ width: 22, height: 22 }}
      src={getImageMatch(key)}
      alt=""
    />
  );
};

export default function StepperStats({ dataInsights }) {
  return (
    <Stack
      px={!CustomLandscapeWidest() && 1}
      sx={{ width: "100%" }}
    >
      <Stepper
        orientation="vertical"
        sx={{
          "& .MuiStepConnector-line": {
            borderColor: "rgba(255,255,255,0.08)",
            borderLeftWidth: 1.2,
          },
        }}
      >
        {dataInsights?.map((insight, index) => (
          <Step key={index} active>
            <StepLabel
              sx={{
                "& .MuiStepLabel-iconContainer": {
                  display: "none", // remove default circle
                },
              }}
            >
              {/* ─── Custom Step Card ─── */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.25s ease",

                  "&:hover": {
                    background: "rgba(20,210,190,0.06)",
                    borderColor: "rgba(20,210,190,0.3)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(20,210,190,0.1)",
                    boxShadow: "0 0 10px rgba(20,210,190,0.2)",
                    flexShrink: 0,
                  }}
                >
                  {resolveIcon(insight.title)}
                </Box>

                {/* Content */}
                <Box flex={1}>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    color="#F0F4FA"
                    mb={0.3}
                  >
                    {insight.title}
                  </Typography>

                  <Typography
                    fontSize={11.5}
                    sx={{
                      color: "rgba(240,244,250,0.6)",
                      lineHeight: 1.5,
                    }}
                  >
                    {insight.details.substring(
                      0,
                      !CustomDeviceIsSmall() ? 55 : undefined
                    )}
                  </Typography>
                </Box>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}