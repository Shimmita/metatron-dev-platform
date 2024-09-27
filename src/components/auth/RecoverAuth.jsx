import React, { useState } from "react";
import NabvBarAuth from "./NabvBarAuth";
import { Box, Button, TextField } from "@mui/material";

const RecoverAuth = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // will define the alternative route on the navbar
  const isRecover = true;

  return (
    <React.Fragment>
      <NabvBarAuth isRecover={isRecover} />
      <Box
        style={{ height: "90dvh" }}
        className=" container p-2 d-flex justify-content-center align-items-center"
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle:'none',
          scrollbarWidth:'none'
        }}
      >
        <form
          draggable={true}
          onSubmit={handleSubmit}
          className="w-100 p-4 border rounded  justify-content-center align-items-center align-content-center"
        >
          <div className="mb-3 mt-4">
            <TextField
              required
              id="outlined-required"
              label="Enter Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="xzyz@gmail.com"
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
              placeholder="+254xyz"
              type="tel"
            />
          </div>

          <div className="d-flex justify-content-center">
            <Button type="small">reset password</Button>
          </div>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default RecoverAuth;
