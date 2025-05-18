import { Call, EmailRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DevAccountConfig from "../config/DevAccountConfig";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import { useSelector } from "react-redux";

const HelpSupport = () => {
  //   handle emailSupport
  const handleEmailSupport = () => {
    return;
  };

      const { user } = useSelector((state) => state.currentUser);
  

  return (
    <Box
      width={"100%"}
      p={CustomDeviceIsSmall() ? undefined : 2}
    
    >

      {/* other communication channels */}
      <Box width={"100%"} mb={2}>
        {/* row of comm channels */}
        <Box
          display={"flex"}
          justifyContent={"space-around"}
          width={"100%"}
          gap={2}
        >
          {/* call */}
          <Link to={`tel:${DevAccountConfig.dev_phone}`}>
            <Button
              startIcon={<Call />}
              variant="text"
              size="large"
              sx={{ textTransform: "capitalize", borderRadius: "20px", fontWeight:'bold' }}
            >
              call
            </Button>
          </Link>


          {/* email */}
          <Link
            to={`mailto:[${DevAccountConfig.dev_email_1} ]`}
          >
            <Button
              startIcon={<EmailRounded />}
              variant="text"
              onClick={handleEmailSupport}
              size="large"
              sx={{ textTransform: "capitalize", borderRadius: "20px", fontWeight:'bold'  }}
            >
              email
            </Button>
          </Link>
        </Box>
      </Box>

   
      <Box>
   
        <Typography
          variant="body2"
          component={"li"}
          gutterBottom
          color={"text.secondary"}
          mt={1}
        >
          Technical support team will reach out via registered email linked to your Metatron
          account {`( ${user?.email}) `} or send a direct message to your Metatron inbox
          section.
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpSupport;
