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
      className={!CustomDeviceIsSmall() ? "shadow rounded" : undefined}
      width={"100%"}
      p={CustomDeviceIsSmall() ? undefined : 2}
      maxHeight={"70vh"}
      sx={{
        overflow: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* form for input fields */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <div>
          <Typography
            variant="body2"
            textAlign={"center"}
            gutterBottom
            fontWeight={"bold"}
          >
            Send Us Message
          </Typography>
          <Typography
            variant="body2"
            className="ms-2"
            color={"text.secondary"}
            gutterBottom
          >
            {" "}
            what's the problem
          </Typography>
          <textarea
            name="message-area"
            className="form-control rounded"
            rows={5}
            required
            style={{ width: "100%" }}
            id="message"
            placeholder="..."
          />
        </div>

        {/* send button section */}
        <div style={{ marginTop: "10px" }}>
          <button
            type="submit"
            className="btn btn-light"
            style={{ fontSize: "small" }}
          >
            message
          </button>
        </div>
      </form>

      {/* divider */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        mt={5}
        mb={1}
      >
        <Divider component={"div"} className="w-75" />
      </Box>

      {/* other communication channels */}
      <Box width={"100%"}>
        <Typography
          variant="body2"
          textAlign={"center"}
          fontWeight={"bold"}
          gutterBottom
        >
          Or
        </Typography>

        {/* row of comm channels */}
        <Box
          mt={2}
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
              sx={{ textTransform: "capitalize", borderRadius: "10px" }}
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
              sx={{ textTransform: "capitalize", borderRadius: "10px" }}
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
          Info
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

        <Typography
          variant="body2"
          component={"li"}
          color={"text.secondary"}
          mt={1}
        >
          It's recommended that your request should be bound to Metatron's terms
          of services for the support team to reach out and help.
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpSupport;
