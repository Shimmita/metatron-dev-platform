import React, { useState } from "react";
import NabvBarAuth from "./NabvBarAuth";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const LoginAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // will define the alternative route on the navbar
  const isLogin = true;

  return (
    <React.Fragment>
      <NabvBarAuth isLogin={isLogin} />
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
          <div className="mb-4 mt-4">
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

          <div className="mb-3">
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Password &nbsp;*
              </InputLabel>
              <OutlinedInput
                required
                value={password}
                id="outlined-adornment-password"
                onChange={(e) => setPassword(e.target.value.toLowerCase())}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>
          <hr />
          <div className="d-flex justify-content-center mb-3">
            {" "}
            <small className="text-secondary" >
              forgot password? click to{" "}
              <Link
                to={"/genzee/auth/recover"}
                className="text-decoration-none"
              >
                recover
              </Link>
            </small>
          </div>
          <hr />
          <div className="d-flex justify-content-center">
            <Button onClick={(e)=>{
              navigate('/')
            }} type="small">Login</Button>
          </div>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default LoginAuth;
