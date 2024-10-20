import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import { WbIncandescentRounded } from "@mui/icons-material";

const RecoverAuth = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      style={{ height: "99vh" }}
      className=" container d-flex justify-content-center  align-items-center"
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
      <form
        onSubmit={handleSubmit}
        className="w-100 p-3 rounded-4  shadow-lg justify-content-center align-items-center align-content-center"
      >
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          variant={CustomDeviceSmallest() ? "body1" : "h6"}
          gutterBottom
          color={"primary"}
        >
          Metatron Foundation
        </Typography>

        <Box
          mb={2}
          display={"flex"}
          justifyContent={"center"}
          gap={1}
          alignItems={"center"}
        >
          <WbIncandescentRounded
            sx={{ width: 18, height: 18, color: "orange" }}
          />
          <Typography
            variant={CustomDeviceSmallest() ? "caption" : "body2"}
            color={"text.secondary"}
          >
            Enlighting Technology Country Wide
          </Typography>
          <WbIncandescentRounded
            sx={{ width: 18, height: 18, color: "orange" }}
          />
        </Box>

        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          variant="body1"
          color={"text.secondary"}
        >
          Password Reset
        </Typography>

        <div className="mb-3 mt-4">
          <TextField
            required
            id="outlined-required"
            label="Enter Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder="username@gmail.com"
            type="email"
          />
        </div>

        <div className="mb-3 mt-4">
          <TextField
            required
            id="outlined-required"
            label="Enter Phone"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder="+254...."
            type="tel"
          />
        </div>

        <Box display={"flex"} justifyContent={"center"} mt={5}>
          <Typography
            variant="body2"
            color={"text.secondary"}
            display={"flex"}
            gap={1}
            alignItems={"center"}
          >
            Back to
            <Link to={"/auth/login"} className="text-decoration-none fw-bold">
              login
            </Link>
          </Typography>
        </Box>

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="contained"
            className="w-25"
            sx={{ borderRadius: "20px" }}
            disableElevation
            type="small"
          >
            reset
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default RecoverAuth;
