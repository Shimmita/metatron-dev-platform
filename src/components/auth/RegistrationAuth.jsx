import React, { useState } from "react";
import NabvBarAuth from "./NabvBarAuth";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CountiesInKenya from "../data/Counties";

const RegistrationAuth = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [county, setCounty] = useState("");
  const [imagePath, setImagePath] = useState();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <NabvBarAuth />
      <Box
        className=" container mt-3 p-2 d-flex justify-content-center"
        sx={{
          overflowX: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <form
          draggable={true}
          onSubmit={handleSubmit}
          className="w-100 p-3 border rounded  justify-content-center align-items-center align-content-center"
        >
          <div className="mb-3">
            <div className="d-flex justify-content-center">
              <small className="text-secondary" style={{ fontSize: "small" }}>
                profile image (optional)
              </small>
            </div>
            <div>
              <input type="file" accept="image/*" className="form-control" onChange={(e)=>{
                setImagePath(e.target.files[0]);
                console.log(imagePath)
              }} />
            </div>
          </div>

          <div className="mb-3">
            <TextField
              required
              id="outlined-required"
              label="FullName"
              fullWidth
              onChange={(e) => setName(e.target.value.toLowerCase())}
              value={name}
              placeholder="Shirengo Michael"
            />
          </div>

          <div className="mb-3">
            <TextField
              required
              id="outlined-required"
              label="NickName"
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="TheGamer"
            />
          </div>

          <div className="mb-3">
            <TextField
              required
              id="outlined-required"
              label="Email Address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="xzyz@gmail.com"
              type="email"
            />
          </div>
          <div className="mb-3">
            <TextField
              required
              id="outlined-required"
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254xyz"
            />
          </div>

          <div className="mb-3">
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password &nbsp;*
              </InputLabel>
              <OutlinedInput
                required
                value={password}
                id="outlined-adornment-password"
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="mb-3">
            <TextField
              required
              select
              value={county}
              label="County"
              fullWidth
              onChange={(e) => setCounty(e.target.value)}
            >
              {CountiesInKenya &&
                CountiesInKenya.map((county) => (
                  <MenuItem key={county} value={county}>
                    {county}
                  </MenuItem>
                ))}
            </TextField>
          </div>

          <div className="d-flex justify-content-center mb-2">
            {" "}
            <small className="text-secondary" >
              attributes marked in asterisk(*) are mandatory
            </small>
          </div>
          <div className="d-flex justify-content-center">
            <Button type="small">Complete Registration</Button>
          </div>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default RegistrationAuth;
