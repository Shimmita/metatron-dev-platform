import {
  AccessTimeRounded,
  BalanceRounded,
  BoltRounded,
  OpenInBrowserRounded,
  PaidRounded,
  PeopleRounded,
  WorkHistoryRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import AwsLogo from "../../../images/aws.jpeg";
import ApplyJobModal from "../../modal/ApplyJobModal";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";

function JobLayout({ isDarkMode }) {
  const [openModal, setOpenApplyJobModal] = useState(false);
  const externalAppliation = false;

  const handleShowingApply = () => {
    setOpenApplyJobModal(true);
  };
  const dummySkills = ["Python", "Tensorflow", "Flask", "FastAPI", "Scikit"];
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      className={!CustomDeviceIsSmall() ? "rounded shadow" : ""}
      gap={2}
      m={3}
    >
      {/* logo */}
      <Avatar alt="" src={AwsLogo} sx={{ height: 50, width: 50, mt: 1 }} />
      {/* job title */}
      <Stack textAlign={"center"} gap={1}>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <WorkRounded color="primary" sx={{ width: 20, height: 20 }} />
          <Typography variant="body1" color={"primary"} fontWeight={"bold"}>
            {" "}
            Machine Learning Engineer
          </Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <BalanceRounded sx={{ width: 22, height: 22 }} />
          <Typography variant="body2">Intermidiate Position Level</Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PaidRounded color="success" sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">Ksh.150,000 - Ksh.200,000</Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <PeopleRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">Total Applications Done 10</Typography>
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <AccessTimeRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">Date Uploaded 10/11/2024</Typography>
        </Box>

        <Box display={"flex"} gap={1} alignItems={"center"}>
          <WorkHistoryRounded sx={{ width: 20, height: 20 }} />
          <Typography variant="body2">
            Years of Experience 1 - 2 yrs{" "}
          </Typography>
        </Box>
      </Stack>

      {/* skills mandatory */}
      <Box>
        <Typography
          gutterBottom
          display={"flex"}
          gap={1}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
          variant="body2"
          fontWeight={"bold"}
        >
          Mandatory Skills
        </Typography>
        <Box display="flex" justifyContent={"center"}>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            {dummySkills.map((val, index) => (
              <>
                <Typography key={index} gutterBottom variant="body2">
                  {val}
                </Typography>
              </>
            ))}
          </Box>
        </Box>
      </Box>

      {/* hiring org */}
      <Box textAlign={"center"}>
        <Typography
          gutterBottom
          variant="body2"
          fontWeight={"bold"}
          color={"text.secondary"}
        >
          Amazon Web Services (AWS)
        </Typography>
        <Typography
          gutterBottom
          fontWeight={"bold"}
          variant="body2"
          color={"text.secondary"}
        >
          Germany | Remote | FullTime
        </Typography>
      </Box>

      {/* application  */}
      <Button
        variant={isDarkMode ? "outlined" : "contained"}
        color="primary"
        className={CustomDeviceIsSmall() ? "w-75" : "w-50"}
        size="small"
        disableElevation
        onClick={handleShowingApply}
        endIcon={
          externalAppliation ? <OpenInBrowserRounded /> : <BoltRounded />
        }
        sx={{ borderRadius: "20px", mb: 3 }}
      >
        Apply Fast
      </Button>
      {/* show modal apply jobs */}
      <ApplyJobModal
        openApplyJobModal={openModal}
        setOpenApplyJobModal={setOpenApplyJobModal}
      />
    </Stack>
  );
}

export default JobLayout;
