import { Call, EmailRounded } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DevAccountConfig from "../config/DevAccountConfig";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";

const HelpSupport = () => {
  //   handle emailSupport
  const handleEmailSupport = () => {
    return;
  };

  return (
    <Box
      width={"100%"}
      p={CustomDeviceIsSmall() ? undefined : 2}
    
    >

      {/* other communication channels */}
      <Box width={"100%"}>
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
            to={`mailto:[${DevAccountConfig.dev_email_1},${DevAccountConfig.dev_email_2} ]`}
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

      {/* info or about */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        mt={5}
        mb={1}
      >
        <Divider component={"div"} className="w-75" />
      </Box>

      <Box>
        <Typography
          variant="body2"
          fontWeight={"bold"}
          textAlign={"center"}
          gutterBottom
        >
          Tips
        </Typography>

        <Typography
          variant="body2"
          component={"li"}
          color={"text.secondary"}
          gutterBottom
        >
          Dear esteemed user our support team will reach out and respond to your
          inquiries at the shortest time possible.
        </Typography>

        <Typography
          variant="body2"
          component={"li"}
          gutterBottom
          color={"text.secondary"}
          mt={1}
        >
          Our support team will reach out via registered email linked to your
          account or send a direct message to your Metatron application inbox
          section.
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpSupport;
